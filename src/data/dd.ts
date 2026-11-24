// Typed access to the Due Diligence mock data.
//
// Source: src/data/mock/cottonwood-data.json (project Cottonwood on QA's data
// model: 11 themes, 29 layers, 4 rings) and src/data/mock/qa-data.json (QA enums
// and copy). Both copied from the homebase on 2026-11-24. Every count in the
// JSON is computed there, so the prototype reads values and never retypes them.

import cottonwood from './mock/cottonwood-data.json';
import qa from './mock/qa-data.json';

// ---- Types -------------------------------------------------------------------

export type LayerStatus =
  | 'on_site'
  | 'within_ring_1'
  | 'within_ring_2'
  | 'within_ring_3'
  | 'not_found'
  | 'no_data_for_county'
  | 'not_applicable';

export type Geometry = 'polygon' | 'line' | 'point';

export interface Ring {
  ringIndex: number;
  name: string;
  bandLabel: string;
  displayLabel: string;
  fromMiles: number;
  toMiles: number;
  uniqueAreaSqMi: number;
  uniqueAcres: number;
  areaLabel: string;
}

export interface RingCell {
  ring?: string;
  quantity: number;
  featureCount: number;
  cell: string;
}

export interface ClassBreakdown {
  className: string;
  byRing: (RingCell | null)[];
}

export interface CompositionClass {
  className: string;
  pct: number;
  quantity: string;
}

export interface Composition {
  rows: { label: string; classes: CompositionClass[] }[];
  legendShown: number;
  legendMore: number;
  legendMoreText: string | null;
  note: string | null;
}

export interface NearbyFeature {
  name: string;
  className: string;
  miles: number;
  distance: string;
}

export interface LayerResult {
  status: LayerStatus;
  stateKey: string;
  shade: string;
  statusLabel: string;
  chip: string;
  finding: string;
  short: string;
  tooltip: string;
  hasData: boolean;
  appliesInCounty: boolean;
  nearestMiles: number | null;
  nearestLabel: string | null;
  onSiteShare: number | null;
  byRing: (RingCell | null)[] | null;
  classBreakdown?: ClassBreakdown[] | null;
  composition?: Composition | null;
  nearbyFeatures?: NearbyFeature[] | null;
}

export interface Layer {
  id: number;
  themeId: number;
  reportOrder: number;
  geometry: Geometry;
  measureUnit: string;
  measureType: string;
  sourceAgency: string;
  loadedDate: string | null;
  updateFrequency: string | null;
  sourceLine: string;
  name: string;
  theme: string;
  featuresLoadedInCounty: number;
  result: LayerResult;
}

export interface ThemeStatusCounts {
  on_site: number;
  within_ring_1: number;
  within_ring_2: number;
  within_ring_3: number;
  not_found: number;
  no_data_for_county: number;
  not_applicable: number;
}

export interface Theme {
  id: number;
  name: string;
  layerCount: number;
  screenedCount: number;
  onSiteCount: number;
  summaryLine: string;
  statusCounts: ThemeStatusCounts;
  layers: { id: number; name: string; status: LayerStatus; short: string }[];
}

export interface ProjectListItem {
  id: number;
  name: string;
  type: string;
  county: string;
  acres: number | null;
  areaLabel: string;
  stage: string;
  createdBy: string;
  createdLabel: string;
  latestRunStatus: 'Complete' | 'Running' | 'Failed' | 'Queued' | null;
  staleRun?: boolean;
}

export interface Parcel {
  apn: string;
  acres: number;
  owner: string;
  situsAddress: string | null;
}

// ---- Raw data ----------------------------------------------------------------

const data = cottonwood as unknown as {
  project: {
    ProjectName: string;
    County: string;
    ProjectTypeDisplay: string;
    ProjectStageDisplay: string;
    Description: string;
    Acres: number;
    Parcels: Parcel[];
    countyLine: string;
    countyLockedNote: string;
  };
  rings: Ring[];
  ringTotal: { displayLabel: string; areaLabel: string; cumulativeAreaSqMi: number };
  run: { runLabel: string; miles: number[]; createdBy: string };
  runStates: Record<string, unknown>;
  themes: Theme[];
  layers: Layer[];
  themeOrder: { projectType: string; listedFirst: string[]; themeIds: number[]; names: string[] };
  statusCounts: ThemeStatusCounts;
  statusCountsUI: {
    onTheSite: number; nearby: number; notFound: number; noDataYet: number;
    notApplicable: number; screened: number; total: number;
  };
  filterChips: { key: string | null; label: string; count: number }[];
  projects: ProjectListItem[];
  enums: {
    projectTypes: { id: number; name: string }[];
    projectStages: { id: number; name: string }[];
    counties: { id: number; name: string; parcelCount: number; parcelLoadDate: string }[];
  };
  uiCopy: Record<string, Record<string, unknown>>;
  map: { defaultVisible: number[]; layersListed: number[]; layersListedCount: number };
};

export const raw = data;
export const qaRaw = qa as unknown as Record<string, unknown>;

// ---- Accessors ---------------------------------------------------------------

export const project = data.project;
export const rings: Ring[] = data.rings;
export const ringTotal = data.ringTotal;
export const run = data.run;
export const runStates = data.runStates;
export const layers: Layer[] = data.layers;
export const statusCounts = data.statusCounts;
export const statusCountsUI = data.statusCountsUI;
export const filterChips = data.filterChips;
export const projects: ProjectListItem[] = data.projects;
export const enums = data.enums;
export const uiCopy = data.uiCopy;
export const mapConfig = data.map;

/** Themes in the project's Theme Order (Data Center: Infrastructure, Wetlands and Water, Land Use and Zoning first). */
export const themes: Theme[] = data.themeOrder.themeIds
  .map((id) => data.themes.find((t) => t.id === id))
  .filter((t): t is Theme => Boolean(t));

export const themeOrder = data.themeOrder;

export const layerById = (id: number): Layer | undefined => layers.find((l) => l.id === id);

/** Layers of one theme in report order. */
export const layersForTheme = (themeId: number): Layer[] =>
  layers.filter((l) => l.themeId === themeId).sort((a, b) => a.reportOrder - b.reportOrder);

/** Ring index (0 = on the site) a status first appears in, or null for the off-ring states. */
export const statusRing = (s: LayerStatus): number | null =>
  s === 'on_site' ? 0
  : s === 'within_ring_1' ? 1
  : s === 'within_ring_2' ? 2
  : s === 'within_ring_3' ? 3
  : null;

/** The four project steps in the app's order, plus the deferred ones. */
export type StepKey =
  | 'project-details' | 'site-boundary' | 'proximity'
  | 'site-profile' | 'geospatial' | 'deep-dive'
  | 'outline' | 'final-report';

export interface StepDef {
  key: StepKey;
  label: string;
  phase: 'Setup' | 'Analysis' | 'Report';
  /** What has to be true for the step to open. */
  needs: 'none' | 'boundary' | 'run' | 'results';
}

export const STEPS: StepDef[] = [
  { key: 'project-details', label: 'Project Details', phase: 'Setup', needs: 'none' },
  { key: 'site-boundary', label: 'Site Boundary', phase: 'Setup', needs: 'none' },
  { key: 'proximity', label: 'Proximity', phase: 'Setup', needs: 'boundary' },
  { key: 'site-profile', label: 'Site Profile', phase: 'Analysis', needs: 'run' },
  { key: 'geospatial', label: 'Geospatial', phase: 'Analysis', needs: 'results' },
  { key: 'deep-dive', label: 'Deep Dive', phase: 'Analysis', needs: 'results' },
  { key: 'outline', label: 'Outline', phase: 'Report', needs: 'results' },
  { key: 'final-report', label: 'Final Report', phase: 'Report', needs: 'results' },
];

export const LOCK_REASON = {
  boundary: 'Define the area first',
  run: 'Run the report first',
} as const;

/** Route of a project step, base-less. */
export const stepRoute = (key: StepKey): string => `/app/cottonwood/${key}/`;
