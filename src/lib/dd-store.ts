// Client-side prototype state for the Due Diligence flow.
//
// One small object in sessionStorage (per tab, like the password gate), read by
// the shell (step locks, pager) and by each step. Changing it dispatches a
// `dd:state` event on window so every listener re-renders.
//
// The run is time-based: Run Report stores a start time, and the status is
// derived from elapsed time (Queued, then Running, then Complete). Leaving the
// page mid-run and coming back shows the run where it would be.

export type BoundaryState = 'defined' | 'none';
export type RunStatus = 'never' | 'queued' | 'running' | 'complete' | 'failed';

export interface DdState {
  boundary: BoundaryState;
  /** Epoch ms the latest run was started; null = never run. */
  runStartedAt: number | null;
  /** The demo starts with a finished run when true (deep links, review). */
  runPreset: 'never' | 'complete';
  /** Inputs changed since the latest run. */
  stale: boolean;
  /** Which input changed since the run, for the stale banner. */
  staleReason: 'rings' | 'boundary' | null;
  /** The rings the latest run measured (miles). Site Profile shows these, not the edited rings. */
  runRings: number[] | null;
  /** Ring distances in miles, outer edges, ascending (On the Site is implicit). */
  rings: number[];
  /** Theme ids in the user's order. */
  themeOrder: number[] | null;
  /** Saved form values on Project Details, keyed by field name. */
  details: Record<string, string>;
}

const KEY = 'dd-proto-state';
export const QUEUED_MS = 1800;
export const RUN_MS = 9000;

export const DEFAULT_STATE: DdState = {
  boundary: 'defined',
  runStartedAt: null,
  runPreset: 'never',
  stale: false,
  staleReason: null,
  runRings: null,
  rings: [0.25, 1, 5],
  themeOrder: null,
  details: {},
};

const safeStorage = (): Storage | null => {
  try { return window.sessionStorage; } catch { return null; }
};

export function getState(): DdState {
  const raw = safeStorage()?.getItem(KEY);
  if (!raw) return { ...DEFAULT_STATE };
  try {
    return { ...DEFAULT_STATE, ...(JSON.parse(raw) as Partial<DdState>) };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function setState(patch: Partial<DdState>): DdState {
  const next = { ...getState(), ...patch };
  safeStorage()?.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent<DdState>('dd:state', { detail: next }));
  return next;
}

export function resetState(): void {
  safeStorage()?.removeItem(KEY);
  window.dispatchEvent(new CustomEvent<DdState>('dd:state', { detail: getState() }));
}

export function onState(fn: (s: DdState) => void): void {
  window.addEventListener('dd:state', (e) => fn((e as CustomEvent<DdState>).detail));
}

/** The run's status right now. */
export function runStatus(s: DdState = getState()): RunStatus {
  if (s.runStartedAt === null) return s.runPreset === 'complete' ? 'complete' : 'never';
  const elapsed = Date.now() - s.runStartedAt;
  if (elapsed < QUEUED_MS) return 'queued';
  if (elapsed < RUN_MS) return 'running';
  return 'complete';
}

/** 0 to 1 through the Running phase. */
export function runProgress(s: DdState = getState()): number {
  if (s.runStartedAt === null) return s.runPreset === 'complete' ? 1 : 0;
  const t = (Date.now() - s.runStartedAt - QUEUED_MS) / (RUN_MS - QUEUED_MS);
  return Math.max(0, Math.min(1, t));
}

export function startRun(): DdState {
  const s = getState();
  return setState({ runStartedAt: Date.now(), stale: false, staleReason: null, runRings: [...s.rings] });
}

/** Mark the report stale after an input changed (only when a run exists). */
export function markStale(reason: 'rings' | 'boundary'): void {
  if (runStatus() !== 'never') setState({ stale: true, staleReason: reason });
}

/** The rings the current results were measured with. */
export function measuredRings(s: DdState = getState()): number[] {
  return s.runRings ?? [0.25, 1, 5];
}

/** "Run Nov 24, 2026, 9:42 AM by Andy Lovseth", from the run start when there is one. */
export function runLabel(s: DdState = getState(), fallback = 'Run Nov 24, 2026, 9:42 AM by Andy Lovseth'): string {
  if (s.runStartedAt === null) return fallback;
  const d = new Date(s.runStartedAt + RUN_MS);
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `Run ${date}, ${time} by Andy Lovseth`;
}

export type StepNeeds = 'none' | 'boundary' | 'run' | 'results';

/**
 * Can the user open a step that needs `needs`? Returns the lock reason or null.
 * 'run' (Site Profile) opens once a run has started, so it can show the run
 * working; 'results' (Geospatial and later) opens when the run is complete.
 */
export function lockReason(needs: StepNeeds, s: DdState = getState()): string | null {
  if (needs === 'none') return null;
  if (s.boundary !== 'defined') return 'Define the area first';
  const status = runStatus(s);
  if (needs === 'run' && status === 'never') return 'Run the report first';
  if (needs === 'results' && status !== 'complete') return 'Run the report first';
  return null;
}

/** Where a locked step sends you (QA redirects locked step URLs to setup). */
export function lockRedirect(needs: StepNeeds, s: DdState = getState()): string | null {
  if (!lockReason(needs, s)) return null;
  return s.boundary !== 'defined' ? 'app/cottonwood/site-boundary/' : 'app/cottonwood/proximity/';
}

/** "¼ mi, 1 mi and 5 mi" style label for the ring list. */
export function ringsLabel(miles: number[]): string {
  const parts = miles.map(milesLabel);
  if (parts.length <= 1) return parts.join('');
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

export function milesLabel(m: number): string {
  const frac: Record<number, string> = { 0.25: '¼', 0.5: '½', 0.75: '¾' };
  return `${frac[m] ?? String(m)} mi`;
}

// ---- Toast -------------------------------------------------------------------

/** Show the quiet Saved toast above the pager bar. */
export function toast(message = 'Saved'): void {
  window.dispatchEvent(new CustomEvent<string>('dd:toast', { detail: message }));
}

/** Autosave helper: debounce a save, then toast. */
export function autosave(fn: () => void, wait = 600): () => void {
  let t: number | undefined;
  return () => {
    window.clearTimeout(t);
    t = window.setTimeout(() => { fn(); toast('Saved'); }, wait);
  };
}
