// Site Profile: the toolbar filters (Themes, Layers, Proximity) as one small
// client-side state shared by the sections through window events.

export interface ProfileFilters {
  /** Theme ids shown; null = all. */
  themes: number[] | null;
  /** Layer ids shown; null = all. */
  layers: number[] | null;
}

export const FILTER_EVENT = 'dd-profile:filters';
export const SHOW_THEME_EVENT = 'dd-profile:show-theme';

let current: ProfileFilters = { themes: null, layers: null };

export function getFilters(): ProfileFilters {
  return current;
}

export function setFilters(patch: Partial<ProfileFilters>): void {
  current = { ...current, ...patch };
  window.dispatchEvent(new CustomEvent<ProfileFilters>(FILTER_EVENT, { detail: current }));
}

export function onFilters(fn: (f: ProfileFilters) => void): void {
  window.addEventListener(FILTER_EVENT, (e) => fn((e as CustomEvent<ProfileFilters>).detail));
}

/**
 * Hide elements under `root` that carry data-filter-theme / data-filter-layer
 * outside the current selection (sets data-off-toolbar; each section's CSS hides it).
 */
export function applyFilters(root: ParentNode, f: ProfileFilters = current): void {
  root.querySelectorAll<HTMLElement>('[data-filter-theme], [data-filter-layer]').forEach((el) => {
    const t = el.dataset.filterTheme ? Number(el.dataset.filterTheme) : null;
    const l = el.dataset.filterLayer ? Number(el.dataset.filterLayer) : null;
    const off = (t !== null && f.themes !== null && !f.themes.includes(t))
      || (l !== null && f.layers !== null && !f.layers.includes(l));
    el.toggleAttribute('data-off-toolbar', off);
  });
}
