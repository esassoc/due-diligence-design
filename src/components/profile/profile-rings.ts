// Site Profile: which of the data's rings the latest run measured.
//
// The page renders every data ring; on the client each section hides the rings
// whose outer edge is not in measuredRings() and re-derives where each layer is
// first found among the rings that remain. Rings the data does not carry (a
// custom 2 mi) have no columns.
import { measuredRings, onState, getState } from '../../lib/dd-store';
import { outerRings, layerById, mi, type Layer } from './profile-model';

export interface RingView {
  /** Data ringIndexes (1..n) the run measured, ascending. */
  shown: number[];
  /** Outer edge of the outermost shown ring, or null when only the site was measured. */
  maxMiles: number | null;
  /** "Within 1 mi", or "On the Site" when no ring was measured. */
  within: string;
  /** "Not Found Within 1 mi", or "Not on the Site". */
  notFound: string;
  isShown: (ringIndex: number) => boolean;
}

export function ringView(): RingView {
  const measured = measuredRings(getState());
  const shown = outerRings.filter((r) => measured.some((m) => Math.abs(m - r.toMiles) < 1e-9)).map((r) => r.ringIndex);
  const last = shown.length ? outerRings.find((r) => r.ringIndex === shown[shown.length - 1])! : null;
  const maxMiles = last ? last.toMiles : null;
  return {
    shown,
    maxMiles,
    within: maxMiles !== null ? `Within ${mi(maxMiles)}` : 'On the Site',
    notFound: maxMiles !== null ? `Not Found Within ${mi(maxMiles)}` : 'Not on the Site',
    isShown: (k) => k === 0 || shown.includes(k),
  };
}

/** Ring a layer is first found in among the shown rings; null for not found / off-ring states. */
export function effRing(l: Layer, v: RingView): number | null {
  const s = l.result.status;
  if (s === 'on_site') return 0;
  if (!/^within_ring_/.test(s)) return null;
  for (const k of v.shown) {
    const c = l.result.byRing?.[k];
    if (c && (c.quantity > 0 || c.featureCount > 0)) return k;
  }
  return null;
}

/** Filter key a layer has under this view ('0'..'n', 'none', 'nodata', 'na'). */
export function effKey(l: Layer, v: RingView): string {
  const r = effRing(l, v);
  if (r !== null) return String(r);
  const s = l.result.status;
  if (s === 'no_data_for_county') return 'nodata';
  if (s === 'not_applicable') return 'na';
  return 'none';
}

export const layerOf = (id: string | undefined): Layer | undefined => (id ? layerById(Number(id)) : undefined);

/** Finding text under this view: a layer only found in an unmeasured ring reads as none within the measured extent. */
export function effFinding(l: Layer, v: RingView): string {
  const key = effKey(l, v);
  if (key !== 'none') return l.result.finding;
  return v.maxMiles !== null ? `None within ${mi(v.maxMiles)}` : 'Not on the site';
}

/** Run fn now and whenever the prototype state changes. */
export function onRingView(fn: (v: RingView) => void): void {
  fn(ringView());
  onState(() => fn(ringView()));
}

/** Position 0..1 of a distance across the shown lanes (equal width, linear inside each); null if in no shown lane. */
export function shownLanePos(miles: number, v: RingView): number | null {
  const n = v.shown.length;
  for (let i = 0; i < n; i++) {
    const r = outerRings.find((x) => x.ringIndex === v.shown[i])!;
    if (miles > r.fromMiles - 1e-9 && miles <= r.toMiles + 1e-9) {
      const f = r.toMiles === r.fromMiles ? 0 : (miles - r.fromMiles) / (r.toMiles - r.fromMiles);
      return (i + Math.max(0, Math.min(1, f))) / n;
    }
  }
  return null;
}
