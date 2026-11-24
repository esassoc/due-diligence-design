// Server-side model for Project Details and the New Project panel: the enum
// lists in Title Case, their glyphs, the default details for Cottonwood, and
// the per-type "Listed First" themes. Components serialise what the client
// needs into a data attribute, so the mock JSON never ships to the browser.
import { enums, themes, project, qaRaw } from '../../data/dd';

export interface DdOption {
  id: string;
  name: string;
  icon?: string;
}

export interface DdDetails {
  name: string;
  county: string;
  typeId: string;
  stageId: string;
  description: string;
}

/** Client config for the Theme Order list. */
export interface DdThemeConfig {
  themes: { id: number; name: string }[];
  /** Project type id -> the three theme ids listed first (empty for Other). */
  priority: Record<string, number[]>;
  /** Project type id -> its Title Case name. */
  typeNames: Record<string, string>;
}

const SMALL = new Set(['or', 'and', 'of', 'the', 'a', 'in']);

/** "Residential or mixed-use development" -> "Residential or Mixed-Use Development". */
export const titleCase = (s: string): string =>
  s
    .split(' ')
    .map((word, i) =>
      i > 0 && SMALL.has(word.toLowerCase())
        ? word.toLowerCase()
        : word
            .split('-')
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
            .join('-'),
    )
    .join(' ');

const TYPE_ICONS: Record<number, string> = {
  1: 'sun',
  2: 'wind',
  3: 'battery-charging',
  4: 'server',
  5: 'utility-pole',
  6: 'house',
  7: 'warehouse',
  8: 'droplets',
  9: 'shapes',
};

export const PROJECT_TYPES: DdOption[] = enums.projectTypes.map((t) => ({
  id: String(t.id),
  name: titleCase(t.name),
  icon: TYPE_ICONS[t.id] ?? 'shapes',
}));

/** Glyph for a project type by its display name (the projects list carries names). */
export const typeIcon = (name: string): string =>
  PROJECT_TYPES.find((t) => t.name.toLowerCase() === name.toLowerCase())?.icon ?? 'shapes';

export const STAGES: DdOption[] = enums.projectStages.map((s) => ({ id: String(s.id), name: titleCase(s.name) }));

/** Counties in alphabetical order, as the New Project panel lists them. */
export const COUNTIES = [...enums.counties].sort((a, b) => a.name.localeCompare(b.name));

export const DEFAULT_DETAILS: DdDetails = {
  name: project.ProjectName,
  county: project.County,
  typeId: String((project as unknown as { ProjectTypeID: number }).ProjectTypeID),
  stageId: String((project as unknown as { ProjectStageID: number }).ProjectStageID),
  description: '',
};

const priorityRaw = (qaRaw.projectTypeThemePriority as { byProjectTypeId: Record<string, string[]> }).byProjectTypeId;

const themeIdByName = (name: string): number | undefined =>
  themes.find((t) => t.name.toLowerCase() === name.toLowerCase())?.id;

export const THEME_CONFIG: DdThemeConfig = {
  themes: themes.map((t) => ({ id: t.id, name: t.name })),
  priority: Object.fromEntries(
    PROJECT_TYPES.map((t) => [
      t.id,
      (priorityRaw[t.id] ?? []).map(themeIdByName).filter((id): id is number => id !== undefined),
    ]),
  ),
  typeNames: Object.fromEntries(PROJECT_TYPES.map((t) => [t.id, t.name])),
};
