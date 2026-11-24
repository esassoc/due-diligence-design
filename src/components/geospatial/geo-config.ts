// Geospatial step: how each layer draws on the map, its legend classes and the
// features the Identify tool can open. Geometry is in metres on the shared
// Cottonwood grid (src/lib/map-geometry.ts). Colours are dd tokens only.
//
// Layer facts (status, short value, agency, loaded date) come from src/data/dd.ts;
// this file holds only the presentation the mock JSON does not carry.

import {
  CREEK, TRANSMISSION, RAIL, HIGHWAY, ROADS, WETLANDS, FIRE_PERIMETER,
  linePath, smoothPath, polyPath, type Pt,
} from '../../lib/map-geometry';
import { mapConfig, layers, type Layer, type LayerStatus } from '../../data/dd';

// ---- Types -------------------------------------------------------------------

/** How a shape is painted (see DdGeoMap's CSS). */
export type ShapeRole = 'area' | 'outline' | 'patch' | 'line' | 'dash' | 'rail' | 'band' | 'point';

export interface Shape {
  role: ShapeRole;
  /** A CSS colour, always one of the app colour tokens. */
  color: string;
  d: string;
  /** Stroke width in metres, for role "band" only. */
  bandWidth?: number;
  /** Identify feature key, when the shape can be clicked. */
  feature?: string;
}

export type SwatchKind = 'fill' | 'line' | 'dash' | 'point' | 'outline';

export interface LegendItem {
  label: string;
  color: string;
  swatch: SwatchKind;
}

export interface LayerDraw {
  shapes: Shape[];
  legend: LegendItem[];
}

export interface IdentifyFeature {
  layerId: number;
  name: string;
  code?: string;
  /** Acres on the site and the feature's whole area. */
  onSite?: { acres: number; total: number };
  rows: [string, string][];
}

export type StatusGroup = 'on_site' | 'nearby' | 'not_found' | 'no_data';

// ---- Helpers -----------------------------------------------------------------

const rect = (x0: number, y0: number, x1: number, y1: number): string =>
  polyPath([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);

const ellipse = (cx: number, cy: number, rx: number, ry: number): string =>
  `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;

/** A point marker: a zero-length segment with a round cap (constant screen size). */
const dot = ([x, y]: Pt): string => `M${x} ${y}h0.01`;

const smoothClosed = (pts: Pt[]): string => `${smoothPath([...pts, pts[0], pts[1]])}Z`;

const EXCELSIOR = ROADS.find((r) => r.name === 'Excelsior Rd')?.pts ?? [];

const CANAL_A: Pt[] = [[-9000, 2350], [-5200, 1900], [-2600, 1450], [-1150, 820], [200, 420], [1900, 170], [5200, -180], [9000, -520]];
const CANAL_B: Pt[] = [[-9000, 3900], [-4600, 2700], [-2300, 2050], [-700, 1500], [1100, 1250]];

const WETLAND_POND: Pt = [-1900, 1450];

/**
 * The on-site wetland complex: drawn across the site's north edge (y -578) so
 * about 55% of it is inside, matching NWI's on-site acres from the run
 * (byRing[0], 14.4 ac) against a 26.3 ac whole (ellipse area = 26.3 ac).
 */
const ONSITE_WETLAND = { cx: 300, cy: -568, rx: 280, ry: 121 };
const NWI = layers.find((l) => l.id === 10);
const NWI_ON_SITE_AC = NWI?.result.byRing?.[0]?.quantity ?? 0;
const NWI_FEATURE_TOTAL_AC = 26.3;
const WETLAND_SHRUB: Pt = [-3200, 200];

// ---- Layer drawing -----------------------------------------------------------

const C = {
  site: 'var(--dd-data-on-site)',
  water: 'var(--dd-data-nearby)',
  waterLight: 'var(--dd-map-water)',
  teal: 'var(--dd-class-3)',
  tealLight: 'var(--dd-class-4)',
  orange: 'var(--dd-class-1)',
  orangeLight: 'var(--dd-class-2)',
  olive: 'var(--dd-class-5)',
  violet: 'var(--dd-class-6)',
  gold: 'var(--dd-class-7)',
  green: 'var(--dd-class-8)',
  grey: 'var(--dd-text-subtle)',
  dark: 'var(--dd-text-muted)',
} as const;

export const LAYER_DRAW: Record<number, LayerDraw> = {
  // Land Use and Zoning
  1: {
    shapes: [
      { role: 'area', color: C.olive, d: rect(-2900, -2100, 2300, 1900), feature: 'zoning-ag80' },
      { role: 'area', color: C.gold, d: rect(2300, -2100, 4600, 1900), feature: 'zoning-ar10' },
    ],
    legend: [
      { label: 'Agricultural (AG-80)', color: C.olive, swatch: 'fill' },
      { label: 'Agricultural Residential (AR-10)', color: C.gold, swatch: 'fill' },
    ],
  },
  2: {
    shapes: [
      { role: 'area', color: C.green, d: rect(-3400, -2600, 2600, 2300), feature: 'gp-cropland' },
      { role: 'area', color: C.violet, d: rect(-9000, -2600, -3400, 2300), feature: 'gp-uda' },
    ],
    legend: [
      { label: 'Agricultural Cropland', color: C.green, swatch: 'fill' },
      { label: 'Urban Development Area', color: C.violet, swatch: 'fill' },
    ],
  },
  // Wetlands and Water
  10: {
    shapes: [
      { role: 'patch', color: C.teal, d: ellipse(ONSITE_WETLAND.cx, ONSITE_WETLAND.cy, ONSITE_WETLAND.rx, ONSITE_WETLAND.ry), feature: 'nwi-0' },
      ...WETLANDS.slice(1).map((w, i) => ({ role: 'patch' as const, color: C.teal, d: ellipse(w.cx, w.cy, w.rx, w.ry), feature: `nwi-${i + 1}` })),
      { role: 'patch', color: C.olive, d: ellipse(WETLAND_SHRUB[0], WETLAND_SHRUB[1], 230, 120), feature: 'nwi-shrub' },
      { role: 'patch', color: C.waterLight, d: ellipse(WETLAND_POND[0], WETLAND_POND[1], 120, 80), feature: 'nwi-pond' },
    ],
    legend: [
      { label: 'Freshwater Emergent', color: C.teal, swatch: 'fill' },
      { label: 'Forested or Shrub', color: C.olive, swatch: 'fill' },
      { label: 'Pond or Lake', color: C.waterLight, swatch: 'fill' },
    ],
  },
  11: {
    shapes: [
      { role: 'line', color: C.teal, d: smoothPath(CANAL_A), feature: 'nhd-canal' },
      { role: 'line', color: C.teal, d: smoothPath(CANAL_B), feature: 'nhd-canal' },
      { role: 'line', color: C.water, d: smoothPath(CREEK), feature: 'nhd-creek' },
    ],
    legend: [
      { label: 'Stream or River', color: C.water, swatch: 'line' },
      { label: 'Canal or Ditch', color: C.teal, swatch: 'line' },
    ],
  },
  // Natural Hazards
  20: {
    shapes: [
      { role: 'area', color: C.tealLight, d: rect(-4800, -3200, 4800, 3200), feature: 'fema-x' },
      { role: 'band', color: C.water, d: smoothPath(CREEK), bandWidth: 320, feature: 'fema-a' },
    ],
    legend: [
      { label: 'Zone X (Minimal)', color: C.tealLight, swatch: 'fill' },
      { label: 'Zone A (1% Annual Chance)', color: C.water, swatch: 'fill' },
    ],
  },
  23: {
    shapes: [{ role: 'area', color: C.violet, d: rect(-9000, -6000, 9000, 6000), feature: 'mmi-7' }],
    legend: [{ label: 'MMI VII (Very Strong)', color: C.violet, swatch: 'fill' }],
  },
  25: {
    shapes: [{ role: 'patch', color: C.orange, d: smoothClosed(FIRE_PERIMETER), feature: 'fire-1' }],
    legend: [{ label: 'Fire Perimeter', color: C.orange, swatch: 'fill' }],
  },
  // Biological Resources
  30: {
    shapes: [{ role: 'patch', color: C.violet, d: smoothClosed([[-2900, 1700], [-1900, 1950], [-1500, 2700], [-2200, 3300], [-3300, 2900], [-3400, 2200]]), feature: 'habitat-1' }],
    legend: [{ label: 'Vernal Pool Fairy Shrimp', color: C.violet, swatch: 'fill' }],
  },
  31: {
    shapes: [{ role: 'area', color: C.green, d: rect(-9000, -5200, 6800, 4200), feature: 'range-1' }],
    legend: [{ label: 'California Tiger Salamander', color: C.green, swatch: 'fill' }],
  },
  // Infrastructure
  50: {
    shapes: [
      { role: 'line', color: C.dark, d: linePath(EXCELSIOR), feature: 'road-excelsior' },
      { role: 'line', color: C.dark, d: linePath(HIGHWAY), feature: 'road-sr16' },
    ],
    legend: [{ label: 'State Highway', color: C.dark, swatch: 'line' }],
  },
  51: {
    shapes: [{ role: 'rail', color: C.dark, d: linePath(RAIL), feature: 'rail-1' }],
    legend: [{ label: 'Main Line', color: C.dark, swatch: 'line' }],
  },
  52: {
    shapes: [{ role: 'point', color: C.dark, d: dot([6000, -3800]), feature: 'airport-1' }],
    legend: [{ label: 'Public Use Airport', color: C.dark, swatch: 'point' }],
  },
  53: {
    shapes: [
      { role: 'line', color: C.orange, d: linePath(TRANSMISSION), feature: 'tx-230' },
      { role: 'dash', color: C.orangeLight, d: linePath([[700, -1200], [3200, -1650], [9000, -2700]]), feature: 'tx-115' },
    ],
    legend: [
      { label: '220 to 287 kV', color: C.orange, swatch: 'line' },
      { label: '100 to 161 kV', color: C.orangeLight, swatch: 'dash' },
    ],
  },
  // Protected and Special Areas
  14: {
    shapes: [{ role: 'area', color: C.tealLight, d: polyPath([[-16000, -9000], [-7050, -9000], [-7300, 3000], [-7900, 9000], [-16000, 9000]]), feature: 'delta-1' }],
    legend: [{ label: 'Legal Delta', color: C.tealLight, swatch: 'fill' }],
  },
  60: {
    shapes: [{ role: 'patch', color: C.green, d: smoothClosed([[980, -420], [1500, -520], [1720, -80], [1560, 380], [1080, 330]]), feature: 'padus-1' }],
    legend: [{ label: 'Conservation Easement', color: C.green, swatch: 'fill' }],
  },
  // Cultural Resources
  70: {
    shapes: [{ role: 'point', color: C.violet, d: dot([-1700, -1500]), feature: 'nrhp-1' }],
    legend: [{ label: 'Listed Property', color: C.violet, swatch: 'point' }],
  },
  // Air Quality
  80: {
    shapes: [{ role: 'outline', color: C.gold, d: rect(-12000, -8000, 7600, 6400), feature: 'ozone-1' }],
    legend: [{ label: 'Severe 15 Nonattainment', color: C.gold, swatch: 'outline' }],
  },
  81: {
    shapes: [{ role: 'outline', color: C.teal, d: rect(-10000, -7000, 9000, 7600), feature: 'carb-1' }],
    legend: [{ label: 'Sacramento Metropolitan AQMD', color: C.teal, swatch: 'outline' }],
  },
  // Community
  100: {
    shapes: [{ role: 'outline', color: C.grey, d: rect(-2600, -2200, 3400, 2500), feature: 'tract-1' }],
    legend: [{ label: 'Census Tract', color: C.grey, swatch: 'outline' }],
  },
  101: {
    shapes: [{ role: 'area', color: C.orangeLight, d: rect(-2600, -2200, 3400, 2500), feature: 'svi-1' }],
    legend: [{ label: 'Low to Moderate (0.25 to 0.50)', color: C.orangeLight, swatch: 'fill' }],
  },
};

// ---- Identify ----------------------------------------------------------------

export const IDENTIFY: Record<string, IdentifyFeature> = {
  'nwi-0': {
    layerId: 10, name: 'Freshwater Emergent Wetland', code: 'PEM1C',
    onSite: { acres: NWI_ON_SITE_AC, total: NWI_FEATURE_TOTAL_AC },
    rows: [['Distance', 'Crosses the site boundary'], ['Water Regime', 'Seasonally flooded']],
  },
  'nwi-1': {
    layerId: 10, name: 'Freshwater Emergent Wetland', code: 'PEM1A',
    rows: [['Distance', '0.9 mi'], ['Area', '26.4 ac'], ['Water Regime', 'Temporarily flooded']],
  },
  'nwi-2': {
    layerId: 10, name: 'Freshwater Emergent Wetland', code: 'PEM1C',
    rows: [['Distance', '1.2 mi'], ['Area', '39.7 ac'], ['Water Regime', 'Seasonally flooded']],
  },
  'nwi-shrub': {
    layerId: 10, name: 'Freshwater Forested/Shrub Wetland', code: 'PSS1A',
    rows: [['Distance', '1.5 mi'], ['Area', '11.3 ac'], ['Water Regime', 'Temporarily flooded']],
  },
  'nwi-pond': {
    layerId: 10, name: 'Freshwater Pond', code: 'PUBHx',
    rows: [['Distance', '0.8 mi'], ['Area', '2.4 ac'], ['Water Regime', 'Permanently flooded']],
  },
  'nhd-creek': {
    layerId: 11, name: 'Deer Creek', code: 'StreamRiver 46006',
    rows: [['Distance', 'Crosses the site'], ['On the Site', '1.6 mi'], ['Flow', 'Perennial']],
  },
  'nhd-canal': {
    layerId: 11, name: 'Unnamed Canal', code: 'CanalDitch 33600',
    rows: [['Distance', '0.2 mi'], ['Flow', 'Intermittent']],
  },
  'fema-x': {
    layerId: 20, name: 'Zone X', code: 'X',
    rows: [['Distance', 'Covers the site'], ['Flood Risk', 'Minimal']],
  },
  'fema-a': {
    layerId: 20, name: 'Zone A', code: 'A',
    rows: [['Distance', 'Crosses the site'], ['Flood Risk', '1% annual chance']],
  },
  'mmi-7': {
    layerId: 23, name: 'MMI VII', code: 'VII',
    rows: [['Distance', 'Covers the site'], ['Shaking', 'Very strong']],
  },
  'fire-1': {
    layerId: 25, name: 'Grant Line Fire', code: 'CA-SCU-2021-0412',
    rows: [['Distance', '0.6 mi'], ['Year', '2021'], ['Burned Area', '412 ac']],
  },
  'habitat-1': {
    layerId: 30, name: 'Vernal Pool Fairy Shrimp', code: 'Unit 21',
    rows: [['Distance', '0.9 mi'], ['Listing', 'Threatened']],
  },
  'range-1': {
    layerId: 31, name: 'California Tiger Salamander', code: 'Central DPS',
    rows: [['Distance', 'Covers the site'], ['Listing', 'Threatened']],
  },
  'zoning-ag80': {
    layerId: 1, name: 'Agricultural', code: 'AG-80',
    rows: [['Distance', 'Covers the site'], ['Minimum Lot', '80 ac']],
  },
  'zoning-ar10': {
    layerId: 1, name: 'Agricultural Residential', code: 'AR-10',
    rows: [['Distance', '1.0 mi'], ['Minimum Lot', '10 ac']],
  },
  'gp-cropland': {
    layerId: 2, name: 'Agricultural Cropland', code: 'AC',
    rows: [['Distance', 'Covers the site']],
  },
  'gp-uda': {
    layerId: 2, name: 'Urban Development Area', code: 'UDA',
    rows: [['Distance', '1.7 mi']],
  },
  'road-excelsior': {
    layerId: 50, name: 'Excelsior Rd', code: 'S1200',
    rows: [['Distance', '0.3 mi'], ['Class', 'Primary road']],
  },
  'road-sr16': {
    layerId: 50, name: 'Jackson Hwy (SR 16)', code: 'S1100',
    rows: [['Distance', '0.5 mi'], ['Class', 'State highway']],
  },
  'rail-1': {
    layerId: 51, name: 'Union Pacific Fresno Subdivision', code: 'UP',
    rows: [['Distance', '0.9 mi'], ['Class', 'Main line']],
  },
  'airport-1': {
    layerId: 52, name: 'Sacramento Mather Airport', code: 'MHR',
    rows: [['Distance', '4.3 mi'], ['Use', 'Public']],
  },
  'tx-230': {
    layerId: 53, name: 'Rancho Seco to Hedge', code: '230 kV',
    rows: [['Distance', 'Crosses the site'], ['Voltage Class', '220 to 287 kV'], ['Owner', 'SMUD']],
  },
  'tx-115': {
    layerId: 53, name: 'Elk Grove to Kiefer', code: '115 kV',
    rows: [['Distance', '0.3 mi'], ['Voltage Class', '100 to 161 kV'], ['Owner', 'SMUD']],
  },
  'delta-1': {
    layerId: 14, name: 'Legal Delta', code: 'Water Code 12220',
    rows: [['Distance', '3.8 mi']],
  },
  'padus-1': {
    layerId: 60, name: 'Deer Creek Conservation Easement', code: 'GAP 2',
    rows: [['Distance', '0.2 mi'], ['Manager', 'Sacramento Valley Conservancy']],
  },
  'nrhp-1': {
    layerId: 70, name: 'Sloughhouse Grange Hall', code: 'NRHP 82002214',
    rows: [['Distance', '0.8 mi'], ['Listed', '1982']],
  },
  'ozone-1': {
    layerId: 80, name: 'Sacramento Metro', code: 'Severe 15',
    rows: [['Distance', 'Covers the site']],
  },
  'carb-1': {
    layerId: 81, name: 'Sacramento Metropolitan AQMD', code: 'SMAQMD',
    rows: [['Distance', 'Covers the site']],
  },
  'tract-1': {
    layerId: 100, name: 'Census Tract 94.06', code: '06067009406',
    rows: [['Distance', 'Covers the site']],
  },
  'svi-1': {
    layerId: 101, name: 'Census Tract 94.06', code: 'SVI 0.42',
    rows: [['Distance', 'Covers the site'], ['Ranking', 'Low to moderate']],
  },
};

// ---- Layer facts the JSON does not carry --------------------------------------

/** National Wetlands Inventory was reloaded after the report ran. */
export const RELOADED: Record<number, string> = { 10: 'Nov 24, 2026, 2:10 PM' };
export const RELOADED_TIP = 'Reloaded since the report ran. The map shows current data.';

/** The layers on at load. mapConfig.defaultVisible wins when the data sets it. */
const GOLD_DEFAULT = [50, 51, 53, 10, 11];
export const DEFAULT_VISIBLE: number[] = mapConfig.defaultVisible.length
  ? mapConfig.defaultVisible
  : GOLD_DEFAULT;

/** Opacity (0 to 100) a layer starts at: areas sit back, lines stay crisp. */
export const defaultOpacity = (l: Layer): number => (l.geometry === 'polygon' ? 60 : 100);

export const hasData = (l: Layer): boolean =>
  l.result.status !== 'no_data_for_county' && l.result.status !== 'not_applicable';

export const statusGroup = (s: LayerStatus): StatusGroup =>
  s === 'on_site' ? 'on_site'
  : s === 'not_found' ? 'not_found'
  : s === 'no_data_for_county' || s === 'not_applicable' ? 'no_data'
  : 'nearby';

/** "Nov 20, 2026" from an ISO date, or the reloaded stamp. */
export const loadedLabel = (l: Layer): string => {
  if (RELOADED[l.id]) return RELOADED[l.id];
  if (!l.loadedDate) return 'Not loaded';
  return new Date(l.loadedDate).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Los_Angeles',
  });
};

/** Value shown at the right of a layer row ("0.3 mi", "4% of site"); empty for Not Found. */
export const rowValue = (l: Layer): string =>
  l.result.status === 'not_found' ? '' : l.result.short;

/** Zoom To presets: [label, value, box width, box height] in metres, centred on the site. */
export const ZOOM_TO: { label: string; value: string; w: number; h: number }[] = [
  { label: 'Site', value: 'site', w: 2700, h: 1950 },
  { label: '¼ mi', value: '0.25', w: 4000, h: 2900 },
  { label: '1 mi', value: '1', w: 9600, h: 6950 },
  { label: '5 mi', value: '5', w: 23400, h: 16900 },
];
export const DEFAULT_ZOOM = '1';

/** A serialisable slice of each layer, for the client scripts. */
export const clientLayers = layers.map((l) => ({
  id: l.id,
  name: l.name,
  theme: l.theme,
  themeId: l.themeId,
  geometry: l.geometry,
  status: l.result.status,
  agency: l.sourceAgency,
  loaded: loadedLabel(l),
  updates: l.updateFrequency,
  hasData: hasData(l),
  opacity: defaultOpacity(l),
  legend: LAYER_DRAW[l.id]?.legend ?? [],
}));
export type ClientLayer = (typeof clientLayers)[number];
