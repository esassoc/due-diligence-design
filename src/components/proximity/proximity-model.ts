// Proximity: shared ring model for the map, the Search Distances panel and the
// What Will Be Measured card. Pure functions over the ring list in state
// (outer edges in miles, ascending; On the Site is implicit), plus the small
// HTML builders the components render on the server (set:html) and re-render
// on the client after an edit, so both sides draw from one source.

import { rings as dataRings, ringTotal } from '../../data/dd';
import { SITE, MI, type Pt } from '../../lib/map-geometry';

// ---- Distances ----------------------------------------------------------------

/** The three distances the standard presets use; any other ring is custom. */
export const STANDARD_MILES = [0.25, 1, 5];
export const MIN_MILES = 0.1;
export const MAX_MILES = 5;
export const MAX_CUSTOM = 4;

/** Ruler stops on the ring slider (0 = On Site, locked). */
export const STOPS = [0, 0.25, 0.5, 1, 2, 5];
export const STOP_LABELS = ['On Site', '¼', '½', '1 mi', '2', '5 mi'];

export const isStandard = (m: number): boolean => STANDARD_MILES.includes(m);
export const customOf = (miles: number[]): number[] => miles.filter((m) => !isStandard(m));

/** "¼", "1", "1.5": the number part of a distance. */
export const frac = (m: number): string => {
  const f: Record<number, string> = { 0.25: '¼', 0.5: '½', 0.75: '¾' };
  return f[m] ?? String(m);
};
export const mi = (m: number): string => `${frac(m)} mi`;

/** "¼ mi, 1 mi, 5 mi"; longer lists collapse to "¼, ½, 1, 1.5, 2, 3, 5 mi". */
export const ringsListLabel = (miles: number[]): string => {
  if (miles.length === 0) return 'Site Only';
  if (miles.length <= 3) return miles.map(mi).join(', ');
  return `${miles.map(frac).join(', ')} mi`;
};

export const normalize = (miles: number[]): number[] =>
  [...new Set(miles.map((m) => Math.round(m * 100) / 100))]
    .filter((m) => m >= MIN_MILES && m <= MAX_MILES)
    .sort((a, b) => a - b);

// ---- Bands and areas ------------------------------------------------------------

export type Swatch = 'site' | 'solid' | 'light' | 'dashed';

export interface Band {
  label: string;
  from: number;
  to: number;
  swatch: Swatch;
  value: string;
  unit: string;
}

const site = dataRings[0];
// Buffer area of the site at distance d is A0 + P·d + π·d² (polygon area, its
// perimeter, and the round corners). P comes from the data's first ring, so the
// formula reproduces every ring in the data and scales to any custom ring.
const A0 = site.uniqueAreaSqMi;
const P = (dataRings[1].uniqueAreaSqMi - Math.PI * dataRings[1].toMiles ** 2) / dataRings[1].toMiles;
const areaWithin = (d: number): number => (d <= 0 ? A0 : A0 + P * d + Math.PI * d * d);

const splitLabel = (areaLabel: string): { value: string; unit: string } => {
  const i = areaLabel.indexOf(' ');
  return { value: areaLabel.slice(0, i), unit: areaLabel.slice(i + 1) };
};

const swatchFor = (index: number, to: number): Swatch =>
  index === 0 ? 'solid' : to <= 1 ? 'light' : 'dashed';

export const bandLabel = (from: number, to: number): string =>
  from === 0 ? `0 to ${mi(to)}` : `${frac(from)} to ${mi(to)}`;

/** On the Site, then one band per ring. */
export const bandsFor = (miles: number[]): Band[] => {
  const out: Band[] = [{ label: 'On Site', from: 0, to: 0, swatch: 'site', ...splitLabel(site.areaLabel) }];
  miles.forEach((to, i) => {
    const from = i === 0 ? 0 : miles[i - 1];
    const hit = dataRings.find((r) => r.ringIndex > 0 && r.fromMiles === from && r.toMiles === to);
    const area = hit ? hit.uniqueAreaSqMi : areaWithin(to) - areaWithin(from);
    out.push({ label: bandLabel(from, to), from, to, swatch: swatchFor(i, to), value: area.toFixed(2), unit: 'sq mi' });
  });
  return out;
};

export const totalFor = (miles: number[]): { label: string; value: string; unit: string } | null => {
  if (miles.length === 0) return null;
  const max = miles[miles.length - 1];
  const area = max === 5 ? ringTotal.cumulativeAreaSqMi : areaWithin(max);
  return { label: `Total Within ${mi(max)}`, value: area.toFixed(2), unit: 'sq mi' };
};

// ---- Ruler mapping ---------------------------------------------------------------

/** 0..1 along the ruler for a distance (piecewise between stops). */
export const rulerPos = (m: number): number => {
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    if (m <= b) return (i + (m - a) / (b - a)) / (STOPS.length - 1);
  }
  return 1;
};

/** Inverse of rulerPos. */
export const rulerMiles = (p: number): number => {
  const x = Math.max(0, Math.min(1, p)) * (STOPS.length - 1);
  const i = Math.min(STOPS.length - 2, Math.floor(x));
  return STOPS[i] + (x - i) * (STOPS[i + 1] - STOPS[i]);
};

// ---- Buffer geometry --------------------------------------------------------------

const segDist = (p: Pt, a: Pt, b: Pt): number => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
};

const inside = (p: Pt, poly: Pt[]): boolean => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

/** Metres from a point to the site (0 inside). */
export const siteDistance = (p: Pt): number => {
  if (inside(p, SITE)) return 0;
  let d = Infinity;
  for (let i = 0; i < SITE.length; i++) d = Math.min(d, segDist(p, SITE[i], SITE[(i + 1) % SITE.length]));
  return d;
};

/** The point on the buffer of d miles in direction theta (radians, 0 = east). */
export const bufferPoint = (d: number, theta: number): Pt => {
  const r = d * MI;
  const cx = Math.cos(theta);
  const cy = Math.sin(theta);
  let lo = 0;
  let hi = r + 1400;
  for (let k = 0; k < 28; k++) {
    const t = (lo + hi) / 2;
    if (siteDistance([t * cx, t * cy]) <= r) lo = t; else hi = t;
  }
  return [lo * cx, lo * cy];
};

/** Outline of the site buffered by d miles (round joins), as an SVG path. */
export const bufferPath = (d: number, samples = 240): string => {
  const pts: string[] = [];
  for (let i = 0; i < samples; i++) {
    const [x, y] = bufferPoint(d, (i / samples) * Math.PI * 2);
    pts.push(`${x.toFixed(0)} ${y.toFixed(0)}`);
  }
  return `M${pts.join('L')}Z`;
};

/** SVG for the ring buffers, outermost first so inner fills stack on top. */
export const ringsSvg = (miles: number[]): string => {
  const n = miles.length;
  return [...miles]
    .map((m, i) => ({ m, i }))
    .reverse()
    .map(({ m, i }) => {
      const kind = !isStandard(m) ? 'custom' : i === 0 ? 'inner' : i === n - 1 ? 'outer' : 'mid';
      return `<path class="prox-ring prox-ring--${kind}" data-miles="${m}" d="${bufferPath(m)}" />`;
    })
    .join('');
};

// ---- HTML builders -------------------------------------------------------------------

const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export const swatchHtml = (s: Swatch): string => `<span class="prox-swatch prox-swatch--${s}" aria-hidden="true"></span>`;

/** Ring area tiles for What Will Be Measured. */
export const tilesHtml = (miles: number[]): string => {
  const tiles = bandsFor(miles).map((b) =>
    `<div class="prox-tile"><span class="prox-tile__label dd-t-13">${swatchHtml(b.swatch)}${esc(b.label)}</span>` +
    `<span class="prox-tile__value"><span class="dd-t-16-strong">${b.value}</span> <span class="dd-t-13 prox-tile__unit">${b.unit}</span></span></div>`);
  const t = totalFor(miles);
  if (t) {
    tiles.push(`<div class="prox-tile prox-tile--total"><span class="prox-tile__label dd-t-13">${esc(t.label)}</span>` +
      `<span class="prox-tile__value"><span class="dd-t-16-strong">${t.value}</span> <span class="dd-t-13 prox-tile__unit">${t.unit}</span></span></div>`);
  }
  return tiles.join('');
};

/** Legend descriptions, keyed by the ring's outer edge (Gold copy). */
export const LEGEND_COPY: Record<string, string> = {
  site: 'What the boundary itself touches.',
  '0.25': 'Adjoining parcels and edge effects.',
  '1': 'Neighborhood context. The widest standard records search in a Phase I site assessment.',
  '5': 'Regional context: airports, habitat and protected lands.',
};

export const legendHtml = (miles: number[]): string =>
  bandsFor(miles)
    .filter((b) => b.swatch === 'site' || LEGEND_COPY[String(b.to)])
    .map((b) =>
      `<div class="prox-legend__row"><span class="prox-legend__label dd-t-13">${swatchHtml(b.swatch)}${esc(b.label)}</span>` +
      `<span class="prox-legend__text dd-t-13">${LEGEND_COPY[b.swatch === 'site' ? 'site' : String(b.to)]}</span></div>`)
    .join('');

/** Ruler ticks: major stops plus three minor dots between each pair. */
export const ticksHtml = (miles: number[]): string => {
  const out: string[] = [];
  for (let i = 1; i < STOPS.length; i++) {
    for (let k = 1; k <= 3; k++) {
      out.push(`<span class="prox-ruler__tick" style="--p:${((i - 1 + k / 4) / (STOPS.length - 1)).toFixed(4)}"></span>`);
    }
    if (i < STOPS.length - 1 && !miles.includes(STOPS[i])) {
      out.push(`<span class="prox-ruler__stop" style="--p:${(i / (STOPS.length - 1)).toFixed(4)}"></span>`);
    }
  }
  return out.join('');
};

export const thumbsHtml = (miles: number[]): string =>
  miles
    .map((m, i) =>
      `<span class="prox-ruler__thumb prox-ruler__thumb--${isStandard(m) ? 'standard' : 'custom'}" role="slider" tabindex="0"` +
      ` data-index="${i}" style="--p:${rulerPos(m).toFixed(4)}" aria-label="Ring ${i + 1}" aria-valuemin="${MIN_MILES}"` +
      ` aria-valuemax="${MAX_MILES}" aria-valuenow="${m}" aria-valuetext="${mi(m)}"></span>`)
    .join('');

export const stopLabelsHtml = (miles: number[], lockSvg: string): string =>
  STOPS.map((s, i) =>
    `<span class="prox-ruler__label dd-t-12${i > 0 && miles.includes(s) ? ' is-on' : ''}" style="--p:${(i / (STOPS.length - 1)).toFixed(4)}">` +
    `${i === 0 ? lockSvg : ''}${STOP_LABELS[i]}</span>`).join('');
