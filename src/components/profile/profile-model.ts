// Site Profile: derived views over src/data/dd.ts. Every figure here is read
// from the mock data or summed from it; nothing is retyped.
import {
  layers, themes, rings, filterChips, raw, layerById, layersForTheme, run,
  type Layer, type LayerStatus, type Theme, type Ring,
} from '../../data/dd';

export { layers, themes, rings, filterChips, layerById, layersForTheme, run };
export type { Layer, Theme, Ring, LayerStatus };

/** The rings beyond the site, in order (ringIndex 1..n). */
export const outerRings: Ring[] = rings.filter((r) => r.ringIndex > 0);
export const siteRing: Ring = rings[0];
export const maxMiles: number = outerRings[outerRings.length - 1]?.toMiles ?? 0;

/** "5 mi", "¼ mi". */
export function mi(m: number): string {
  const frac: Record<number, string> = { 0.25: '¼', 0.5: '½', 0.75: '¾' };
  return `${frac[m] ?? String(m)} mi`;
}

/** Short lane head for the theme mini chart: "0 to ¼", "¼ to 1", last keeps "mi". */
export function laneShort(r: Ring, isLast: boolean): string {
  return isLast ? r.bandLabel : r.bandLabel.replace(/ mi$/, '');
}

/** Filter key a layer belongs to (matches filterChips keys). */
export function statusKey(s: LayerStatus): string {
  switch (s) {
    case 'on_site': return '0';
    case 'within_ring_1': return '1';
    case 'within_ring_2': return '2';
    case 'within_ring_3': return '3';
    case 'not_found': return 'none';
    case 'no_data_for_county': return 'nodata';
    default: return 'na';
  }
}

/** Ring a layer is first found in (0 = site), or null. */
export function firstRing(l: Layer): number | null {
  const k = statusKey(l.result.status);
  return /^\d+$/.test(k) ? Number(k) : null;
}

export const chipLabel = (key: string): string =>
  filterChips.find((c) => c.key === key)?.label ?? key;
export const chipCount = (key: string | null): number =>
  filterChips.find((c) => c.key === key)?.count ?? 0;

/** Legend text by shade from the data (e.g. "No Data for This County Yet"). */
export const legendLabel = (shade: string): string =>
  (raw as unknown as { legend: { shade: string; label: string }[] }).legend.find((l) => l.shade === shade)?.label ?? '';

// ---- Units -------------------------------------------------------------------

export function unitOf(l: Layer): string {
  return l.measureUnit === 'acres' ? 'ac' : l.measureUnit === 'miles' ? 'mi' : '';
}

/** Format a summed quantity the way the data formats its cells. */
export function fmtQty(q: number, unit: string): string {
  let s: string;
  if (q >= 100) s = Math.round(q).toLocaleString('en-US');
  else if (q >= 10) s = String(Number(q.toFixed(1)));
  else s = String(Number(q.toFixed(2)));
  return unit ? `${s} ${unit}` : s;
}

export const pct = (n: number): string => `${Math.round(n)}%`;

// ---- Class colours -----------------------------------------------------------

/** Class names of a layer in colour order: composition (Within 5 mi) first, then the breakdown. */
function classOrder(l: Layer): string[] {
  const comp = l.result.composition?.rows;
  const names = comp?.[comp.length - 1]?.classes.map((c) => c.className) ?? [];
  for (const c of l.result.classBreakdown ?? []) if (!names.includes(c.className)) names.push(c.className);
  return names;
}

const CLASS_COLORS = [
  'var(--dd-class-1)', 'var(--dd-class-2)', 'var(--dd-class-3)', 'var(--dd-class-4)',
  'var(--dd-class-5)', 'var(--dd-class-6)', 'var(--dd-class-7)', 'var(--dd-class-8)',
];

/** Hazard-scale classes read by meaning, not palette order: minimal / undetermined
    zones are neutral grey, flood zones take the teal pair (Gold, FEMA Flood Hazard Zones). */
const NEUTRAL_CLASS = /minimal|undetermined|\((X|D)\)$/i;
const FLOOD_CLASS = /flood|\((A|AE|AH|AO|V|VE)\)$/i;
const FLOOD_COLORS = ['var(--dd-class-3)', 'var(--dd-class-4)'];

export function classColor(l: Layer, className: string): string {
  if (NEUTRAL_CLASS.test(className)) return 'var(--dd-class-rest)';
  if (FLOOD_CLASS.test(className)) {
    const floods = classOrder(l).filter((n) => FLOOD_CLASS.test(n) && !NEUTRAL_CLASS.test(n));
    return FLOOD_COLORS[Math.min(floods.indexOf(className), FLOOD_COLORS.length - 1)] ?? FLOOD_COLORS[0];
  }
  const i = classOrder(l).indexOf(className);
  return i >= 0 && i < CLASS_COLORS.length ? CLASS_COLORS[i] : 'var(--dd-class-rest)';
}

export const REST_COLOR = 'var(--dd-class-rest)';

// ---- Class mix (bars + popovers) ------------------------------------------------

export interface MixRow { name: string; color: string; share: number; qty: string; }
export interface Mix {
  segments: { color: string; share: number; name: string }[];
  top: MixRow[];
  other: { count: number; share: number; qty: string } | null;
  featureCount: number;
  total: string;
}

const TOP = 3;

/** Predominant mix of a class layer inside one ring band (ringIndex). */
export function bandMix(l: Layer, ringIndex: number): Mix | null {
  const unit = unitOf(l);
  const cells = (l.result.classBreakdown ?? [])
    .map((c) => ({ name: c.className, cell: c.byRing[ringIndex] }))
    .filter((c) => c.cell && c.cell.quantity > 0)
    .map((c) => ({ name: c.name, q: c.cell!.quantity, label: c.cell!.cell }))
    .sort((a, b) => b.q - a.q);
  const sum = cells.reduce((s, c) => s + c.q, 0);
  if (!sum) return null;
  const band = l.result.byRing?.[ringIndex];
  const top = cells.slice(0, TOP).map((c) => ({ name: c.name, color: classColor(l, c.name), share: (c.q / sum) * 100, qty: c.label }));
  const rest = cells.slice(TOP);
  const restQ = rest.reduce((s, c) => s + c.q, 0);
  return {
    segments: [
      ...top.map((t) => ({ color: t.color, share: t.share, name: t.name })),
      ...(rest.length ? [{ color: REST_COLOR, share: (restQ / sum) * 100, name: 'Other' }] : []),
    ],
    top,
    other: rest.length ? { count: rest.length, share: (restQ / sum) * 100, qty: fmtQty(restQ, unit) } : null,
    featureCount: band?.featureCount ?? 0,
    total: band?.cell || fmtQty(sum, unit),
  };
}

/** Fold every class past the palette into one Other segment. */
function mergeRest(segs: Mix['segments']): Mix['segments'] {
  const out: Mix['segments'] = [];
  for (const s of segs) {
    const prev = out[out.length - 1];
    if (prev && prev.color === REST_COLOR && s.color === REST_COLOR) prev.share += s.share;
    else out.push({ ...s });
  }
  return out;
}

/** Mix for a composition row ("Site" or "Within 5 mi"), for the theme card popover. */
export function compositionMix(l: Layer, rowIndex: number): Mix | null {
  const row = l.result.composition?.rows[rowIndex];
  if (!row) return null;
  const unit = unitOf(l);
  const isSite = rowIndex === 0;
  const qtyOf = (name: string): number => {
    const c = l.result.classBreakdown?.find((x) => x.className === name);
    if (!c) return 0;
    return isSite ? (c.byRing[0]?.quantity ?? 0) : c.byRing.reduce((s, cell) => s + (cell?.quantity ?? 0), 0);
  };
  const byRing = l.result.byRing ?? [];
  const totalQ = isSite ? (byRing[0]?.quantity ?? 0) : byRing.reduce((s, c) => s + (c?.quantity ?? 0), 0);
  const features = isSite ? (byRing[0]?.featureCount ?? 0) : byRing.reduce((s, c) => s + (c?.featureCount ?? 0), 0);
  const top = row.classes.slice(0, TOP).map((c) => ({ name: c.className, color: classColor(l, c.className), share: c.pct, qty: c.quantity }));
  const rest = row.classes.slice(TOP);
  const topQ = top.reduce((s, t) => s + qtyOf(t.name), 0);
  return {
    segments: mergeRest(row.classes.map((c) => ({ color: classColor(l, c.className), share: c.pct, name: c.className }))),
    top,
    other: rest.length ? { count: rest.length, share: rest.reduce((s, c) => s + c.pct, 0), qty: fmtQty(Math.max(0, totalQ - topQ), unit) } : null,
    featureCount: features,
    total: isSite ? (byRing[0]?.cell || fmtQty(totalQ, unit)) : fmtQty(totalQ, unit),
  };
}

/** Class layers drawn as mix bars in the Screening Summary: on the whole site, with a class mix. */
export const isMixLayer = (l: Layer): boolean =>
  l.result.status === 'on_site' && l.result.onSiteShare === 1 && Boolean(l.result.composition) && Boolean(l.result.classBreakdown?.length);

// ---- Theme cards --------------------------------------------------------------

export interface TopFigure { layerId: number; name: string; short: string; status: LayerStatus; }

export function topFigures(t: Theme): TopFigure[] {
  return ((t as unknown as { topFigures?: TopFigure[] }).topFigures ?? []).slice(0, 3);
}

export interface Stat { value: string; label: string; sub: string; }

/** One big figure for a layer in its theme card. */
export function layerStat(l: Layer): Stat {
  const r = l.result;
  const label = l.name;
  if (r.status === 'on_site') {
    const share = /% of site$/.test(r.short);
    if (share && r.onSiteShare === 1 && r.composition) {
      const c = r.composition.rows[0].classes[0];
      const code = c.className.includes(',') ? `${c.className.split(',')[0]} of the site` : c.className;
      return { value: pct(c.pct), label, sub: code };
    }
    if (share) return { value: r.short.replace(/ of site$/, ''), label, sub: `${r.byRing?.[0]?.cell ?? ''} of site` };
    return { value: r.short, label, sub: 'On the Site' };
  }
  if (r.status === 'not_found') return { value: r.short, label, sub: `Within ${mi(maxMiles)}` };
  if (r.status === 'no_data_for_county') return { value: r.short, label, sub: 'For This County' };
  return { value: r.short, label, sub: 'To the Nearest' };
}

/** Sort order inside a theme: on site, then nearest first, then the rest. */
export function byNearest(a: Layer, b: Layer): number {
  const rank = (l: Layer): number => {
    const ring = firstRing(l);
    if (ring === 0) return -1;
    if (ring !== null) return l.result.nearestMiles ?? 99;
    return l.result.status === 'not_found' ? 100 : l.result.status === 'no_data_for_county' ? 101 : 102;
  };
  const d = rank(a) - rank(b);
  return d !== 0 ? d : a.reportOrder - b.reportOrder;
}

/** Value column text for a layer. */
export function valueText(l: Layer): string {
  const s = l.result.status;
  if (s === 'not_found') return 'Not Found';
  if (s === 'no_data_for_county') return 'No Data Yet';
  if (s === 'not_applicable') return 'Not Applicable';
  return l.result.short;
}

/** 0..1 position of a distance across the outer lanes (equal-width lanes, linear inside each). */
export function lanePos(miles: number): number {
  const n = outerRings.length;
  for (let i = 0; i < n; i++) {
    const r = outerRings[i];
    if (miles <= r.toMiles) {
      const f = r.toMiles === r.fromMiles ? 0 : (miles - r.fromMiles) / (r.toMiles - r.fromMiles);
      return (i + Math.max(0, Math.min(1, f))) / n;
    }
  }
  return 1;
}

/** Source line in the table: agency, loaded date, update frequency. */
export function sourceLine(l: Layer): string {
  const parts = [l.sourceAgency];
  if (l.loadedDate) {
    const d = new Date(l.loadedDate);
    parts.push(`Loaded ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}`);
  }
  if (l.updateFrequency) parts.push(`Updated ${l.updateFrequency}`);
  return parts.join(' · ');
}

/** Run-progress order: layers in Theme Order, then report order. */
export const progressLayers: Layer[] = themes.flatMap((t) => layersForTheme(t.id));
