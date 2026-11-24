// Client state for the Geospatial map, shared by the layer panel and the map.
// Visible layers, per-layer opacity and the selected row live in sessionStorage
// (per tab, like the rest of the prototype). Map layer toggles are view state,
// not edits, so nothing here autosaves or toasts.

import { DEFAULT_VISIBLE, clientLayers } from './geo-config';

export interface GeoState {
  visible: number[];
  opacity: Record<number, number>;
  selected: number | null;
  /** True while the first-visit loading pass runs. */
  loading: boolean;
}

const KEY = 'dd-geo-state';
/** Stamp of the run whose layers this tab has already loaded (first visit shows Loading). */
export const LOADED_KEY = 'dd-geo-loaded';

const defaults = (): GeoState => ({
  visible: [...DEFAULT_VISIBLE],
  opacity: Object.fromEntries(clientLayers.map((l) => [l.id, l.opacity])),
  selected: 10,
  loading: false,
});

const read = (): GeoState => {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return { ...defaults(), ...(JSON.parse(raw) as Partial<GeoState>), loading: false };
  } catch { /* ignore */ }
  return defaults();
};

let state: GeoState = read();
const listeners = new Set<(s: GeoState) => void>();

export const geo = (): GeoState => state;

export function setGeo(patch: Partial<GeoState>): void {
  state = { ...state, ...patch };
  try {
    const { loading: _l, ...persist } = state;
    sessionStorage.setItem(KEY, JSON.stringify(persist));
  } catch { /* ignore */ }
  listeners.forEach((fn) => fn(state));
}

export function onGeo(fn: (s: GeoState) => void): void {
  listeners.add(fn);
}

export const isVisible = (id: number): boolean => state.visible.includes(id);

export function setVisible(ids: number[], on: boolean): void {
  const set = new Set(state.visible);
  ids.forEach((id) => (on ? set.add(id) : set.delete(id)));
  setGeo({ visible: clientLayers.filter((l) => set.has(l.id)).map((l) => l.id) });
}

export function setOpacity(id: number, value: number): void {
  setGeo({ opacity: { ...state.opacity, [id]: value } });
}

/** Map-wide requests that cross components (info card, reload tip). */
export type GeoRequest =
  | { kind: 'info'; id: number; anchor: DOMRect }
  | { kind: 'tip'; text: string; anchor: DOMRect }
  | { kind: 'close-floaters' };

const requestListeners = new Set<(r: GeoRequest) => void>();
export const requestGeo = (r: GeoRequest): void => requestListeners.forEach((fn) => fn(r));
export const onGeoRequest = (fn: (r: GeoRequest) => void): void => { requestListeners.add(fn); };
