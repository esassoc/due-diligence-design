// Content of the handoff page (/handoff/) for the developer of the Due
// Diligence app on QA. Plain, direct, no em dashes, no middots (external-comms).

export type Scope = 'Change' | 'New Scope' | 'Matches QA' | 'Prototype Only';

export interface HandoffRow {
  cells: string[];
  scope?: Scope;
}

export interface HandoffTable {
  head: string[];
  rows: HandoffRow[];
  /** Index of the column holding the scope badge, when there is one. */
  scopeCol?: number;
}

export interface HandoffSection {
  id: string;
  title: string;
  /**
   * Statements the developer acts on: what the prototype covers, where its
   * data comes from, how a state is reached, what a scope label means. One
   * fact per entry. Never commentary about the page or how it was made.
   */
  facts?: string[];
  tables?: { title?: string; table: HandoffTable }[];
  /** Open questions, one per entry. */
  questions?: string[];
}

export const handoffTitle = 'Design Handoff';

export const handoffSections: HandoffSection[] = [
  {
    id: 'start',
    title: 'Using the Prototype',
    facts: [
      'The prototype runs the first five steps on mock data for Cottonwood, a 359 ac data center site in Sacramento County. Project data follows the QA model: 11 themes, 29 layers and four rings (on the site, 0 to ¼ mi, ¼ to 1 mi, 1 to 5 mi).',
      'It starts with the boundary defined and the report not yet run, so the Analysis and Report steps are locked. Run Report on Proximity unlocks them and opens Site Profile in its running state. Reset Prototype in the avatar menu starts over.',
      'Deep Dive, Outline and Final Report are in the navigation but empty. Their design is deferred.',
    ],
    tables: [
      {
        title: 'Where Each State Lives',
        table: {
          head: ['Step', 'States You Can Reach', 'How'],
          rows: [
            { cells: ['Projects', 'List, New Project dialog', 'Data > Projects, or the site switcher'] },
            { cells: ['Project Details', 'Autosave with Saved toast, required error, county locked and unlocked', 'Edit any field. Clear the name. Clear the boundary to unlock County.'] },
            { cells: ['Site Boundary', 'Defined with Edit Corners, Not Defined, Draw New, Select Parcels, Find results and no match, upload preview and bad file', 'Toolbar on the map. The trash button clears the boundary.'] },
            { cells: ['Proximity', 'Presets, ring slider, map handle, custom distances with limits, Run Report, running', 'Run Report starts the run and opens Site Profile.'] },
            { cells: ['Site Profile', 'Queued, running with per-theme progress, results, stale, failed, class bar and theme popovers, filters, row expansion, group by distance', 'Change rings or the boundary after a run to see the stale banner. Add ?run=failed to the URL for the failed state.'] },
            { cells: ['Geospatial', 'Layers and Legend tabs, toggles, status filter, search, opacity, layer info, reloaded since run, identify card, measure, Zoom To', 'Click a wetland to identify it. Use the ruler to measure.'] },
          ],
        },
      },
    ],
  },
  {
    id: 'theme',
    title: 'Theme and Tokens',
    facts: [
      'The app theme is an Ecology spoke theme generated from a recipe, with the Figma values pinned where they differ from the generated ramp.',
      'App tokens carry the Figma variable names (prefix --dd-), so a value in Figma and a value in code share one name.',
    ],
    tables: [
      {
        table: {
          head: ['Token or Setting', 'Value', 'Change From Ecology'],
          rows: [
            { cells: ['Brand', 'Cobalt #2f5fd0 (text #2850b3, surface #ebf0fc, border #b9c9f1)', 'Replaces the Ecology brand ramp. Brand marks selection, links, primary actions and nearby data.'] },
            { cells: ['Accent', 'Coral #ff7a59 (text #b23a1b, surface #fff0eb)', 'New role: what touches the site. Labels on coral fills use #272a30, not white.'] },
            { cells: ['Neutrals', 'Cool slate. Text #272a30, muted #4f5259, subtle #61646b, borders #e0e1e3, #c6c8cd, #abaeb5, page #f6f7f7', 'Pinned to the Figma values.'] },
            { cells: ['Data colours', 'On site #ff7a59, nearby #3f68cf, nearby far #c4d3f4, not found #e0e1e3, lane washes', 'New. Shared by the summary, the table and the maps.'] },
            { cells: ['Class palette', 'Eight hues (--dd-class-1 to 8) plus a grey for the rest', 'New. Used for class mix bars and composition bars.'] },
            { cells: ['Chrome', 'Top bar #efeff1, side nav #f3f4f5 with phase cards #f9f9fa, dark pager bar', 'New chrome tokens (--dd-chrome-*).'] },
            { cells: ['Type', 'DM Sans for UI, Besley for page and section headlines, Roboto Mono for APNs and codes', 'Adds a display family. Uses a fixed dense ramp (12, 13, 14, 16) instead of the fluid Ecology roles.'] },
            { cells: ['H1', 'Besley 22 semibold, "Cottonwood / Page Title" with the project in muted text', 'Replaces the breadcrumb.'] },
            { cells: ['Corners', '4px badges and chips, 6px controls, 8px cards', 'Soft corners, same as Ecology.'] },
          ],
        },
      },
    ],
  },
  {
    id: 'components',
    title: 'Components',
    facts: [
      'Every control is an Ecology component where one exists. The table lists what this design adds or changes.',
    ],
    tables: [
      {
        table: {
          head: ['Component', 'What It Does', 'Built On', 'Status'],
          scopeCol: 3,
          rows: [
            { cells: ['Side nav with phase cards', 'Every step in three phase cards on a connected rail: done, current, upcoming, and locked with a reason ("Define the area first", "Run the report first").', 'New. Ecology sidebar nav has no step states.', 'New Scope'], scope: 'New Scope' },
            { cells: ['Pager bar', 'Floating Prev and Next with up menus listing every step. Locked steps are disabled in the menus, and Next is disabled when the next step is locked (the reason shows as its tooltip).', 'New, menus are esa-dropdown-menu', 'New Scope'], scope: 'New Scope' },
            { cells: ['Saved toast', 'One-word confirmation above the pager bar after any autosave. There are no save buttons.', 'New. Replaces Save Details.', 'Change'], scope: 'Change' },
            { cells: ['Count badge', 'A quiet count next to a label (12px semibold, muted text on a light grey, 4px corners), so a count never reads as a distance.', 'esa-badge through its --badge-* hooks', 'Change'], scope: 'Change' },
            { cells: ['Page title', 'Two-tone Besley H1 with optional actions on the right and a toolbar row below.', 'Replaces esa-page-header here', 'Change'], scope: 'Change' },
            { cells: ['Project type tiles', 'Nine selectable tiles with icons. The choice re-seeds the three themes listed first.', 'New', 'New Scope'], scope: 'New Scope' },
            { cells: ['Theme order list', 'Drag to reorder the 11 themes (keyboard: Alt and the arrow keys). The first three sit in a brand group.', 'New', 'New Scope'], scope: 'New Scope' },
            { cells: ['Stage stepper', 'Four-stop project stage control with radio semantics.', 'New, replaces a select', 'Change'], scope: 'Change' },
            { cells: ['Boundary editor', 'Edit Corners with drag handles, undo and redo, Draw New, Select Parcels, Find, the This Change Affects list.', 'New, on the static map', 'New Scope'], scope: 'New Scope' },
            { cells: ['Upload preview', 'Preview the uploaded polygon and its area before it replaces the boundary. Bad files get an error.', 'esa-file-upload', 'Change'], scope: 'Change' },
            { cells: ['Ring slider', 'A ruler track with stops from On Site to 5 mi and one thumb per ring, plus a drag handle on the map ring.', 'New. esa-range-slider holds one value.', 'New Scope'], scope: 'New Scope' },
            { cells: ['Ring area tiles', 'One tile per ring with its unique area and a total.', 'New', 'Matches QA'], scope: 'Matches QA' },
            { cells: ['Run progress', 'Site Profile shows the run working: each theme moves from waiting to measuring to done, with the layer count.', 'New. QA has a spinner and copy.', 'New Scope'], scope: 'New Scope' },
            { cells: ['Distance lanes', 'Screening Summary rows per theme with a lane per ring. Layers sit in the lane where they are first found.', 'New', 'New Scope'], scope: 'New Scope' },
            { cells: ['Class mix bars with popover', 'Predominant class mix per ring for class layers. Hover shows acres and feature counts by class.', 'New, popover is esa-popover', 'New Scope'], scope: 'New Scope' },
            { cells: ['Theme summary card', 'Collapsible card per theme: lead figures, composition bars and a lane chart.', 'New', 'Change'], scope: 'Change' },
            { cells: ['All Layers table', 'Filter chips with counts, group by theme or distance, a column per ring, rows that open to classes by ring, nearest named features and the source line.', 'New', 'Change'], scope: 'Change' },
            { cells: ['Layer tree', 'Theme groups with tri-state checkboxes, status dots, values and No Data Yet.', 'esa-checkbox', 'Change'], scope: 'Change' },
            { cells: ['Layer info and identify', 'Info popover per layer (agency, loaded, update frequency). Identify card for a clicked feature.', 'New', 'New Scope'], scope: 'New Scope' },
            { cells: ['Map tools', 'Static basemap with site, rings, zoom, Zoom To, measure, imagery toggle.', 'New. The real app keeps its map library.', 'Prototype Only'], scope: 'Prototype Only' },
            { cells: ['Password gate', 'Keeps the prototype from being stumbled on. Not part of the app.', 'esa-card, esa-text-field, esa-button', 'Prototype Only'], scope: 'Prototype Only' },
          ],
        },
      },
    ],
  },
  {
    id: 'gaps',
    title: 'Gaps Against the QA Build',
    facts: [
      'Change: QA has the feature and the design changes it.',
      'New Scope: the design adds something QA does not have.',
      'Matches QA: the design keeps what QA does.',
      'Prototype Only: needed to run the prototype, not part of the app.',
    ],
    tables: [
      {
        title: 'Fix First',
        table: {
          head: ['Area', 'Design', 'QA Today', 'Scope'],
          scopeCol: 3,
          rows: [
            { cells: ['Run model', 'Run Report with Queued, Running, Complete and Failed; a run line with Run Again; a stale banner when inputs change after a run.', 'Run Report and run states exist. No stale state.', 'Change'], scope: 'Change' },
            { cells: ['No Data Yet and Not Applicable', 'Both states in the summary, the filter chips, table rows, theme cards and the layer tree.', 'Present in copy and chips.', 'Change'], scope: 'Change' },
            { cells: ['Projects and County', 'Projects list with run state, New Project dialog, County on Project Details, locked once a boundary exists.', 'Present. County is chosen before the area.', 'Change'], scope: 'Change' },
            { cells: ['Site Boundary states', 'Not Defined with three ways in, draw mode, parcel mode, find results and failures, upload preview.', 'Present with simpler states. Upload has no preview step.', 'Change'], scope: 'Change' },
            { cells: ['Row expansion and ring columns', 'Rows open to classes by ring, named features and source. Ring columns flex from 2 to 6.', 'Present.', 'Change'], scope: 'Change' },
          ],
        },
      },
      {
        title: 'By Step',
        table: {
          head: ['Step', 'Design', 'QA Today', 'Scope'],
          scopeCol: 3,
          rows: [
            { cells: ['Project Details', 'Autosave with a Saved toast.', 'Save Details button, disabled until changed.', 'Change'], scope: 'Change' },
            { cells: ['Project Details', 'Required marks and inline errors.', 'Required marks.', 'Change'], scope: 'Change' },
            { cells: ['Project Details', 'Theme Order drag list seeded by project type.', 'Three themes listed first per type, no reordering.', 'New Scope'], scope: 'New Scope' },
            { cells: ['Site Boundary', 'Edit Corners with undo and redo.', 'Redraw from scratch only.', 'New Scope'], scope: 'New Scope' },
            { cells: ['Site Boundary', 'Parcels Crossed list and This Change Affects list.', 'Not present.', 'New Scope'], scope: 'New Scope' },
            { cells: ['Site Boundary', 'Download the current boundary file. KMZ upload.', 'Not present.', 'New Scope'], scope: 'New Scope' },
            { cells: ['Site Boundary', 'Use Sample Area kept in the empty state.', 'Present.', 'Matches QA'], scope: 'Matches QA' },
            { cells: ['Navigation', 'Locked steps show a lock and the reason in the nav; the pager menus disable them; a locked step URL redirects to the step that unlocks it. Site Profile opens as soon as a run starts and shows it working; later steps open when it completes.', 'Locks with reasons and redirects.', 'Matches QA'], scope: 'Matches QA' },
            { cells: ['Proximity', 'Presets, ruler slider and map ring handle.', 'Fixed distances plus typed custom distances.', 'New Scope'], scope: 'New Scope' },
            { cells: ['Proximity', 'Up to four custom distances, 0.1 to 5 mi, typed.', 'Present.', 'Matches QA'], scope: 'Matches QA' },
            { cells: ['Proximity', 'What Will Be Measured: ring areas with a total, and the layers by theme.', 'Ring areas and total only.', 'Change'], scope: 'Change' },
            { cells: ['Site Profile', 'Screening Summary with distance lanes and class mix bars.', 'Stacked summary bar and lists.', 'New Scope'], scope: 'New Scope' },
            { cells: ['Site Profile', 'Proximity, Themes and Layers filters in the toolbar.', 'Not present.', 'New Scope'], scope: 'New Scope' },
            { cells: ['Site Profile', 'Export menu: PDF, Print, Table CSV.', 'Print only.', 'Change'], scope: 'Change' },
            { cells: ['Site Profile', 'Group by distance.', 'Not present.', 'New Scope'], scope: 'New Scope' },
            { cells: ['Geospatial', 'Layers and Legend as tabs in one pane, layer search, status filter, opacity.', 'Layer list without these.', 'New Scope'], scope: 'New Scope' },
            { cells: ['Geospatial', 'Source and dates in a layer info popover; reloaded since run marker.', 'Source and dates on every row; warning copy.', 'Change'], scope: 'Change' },
            { cells: ['Geospatial', 'Identify card, measure tool, address search. No map export.', 'A feature click opens nothing.', 'New Scope'], scope: 'New Scope' },
            { cells: ['Geospatial', 'Default visibility: five layers start on (Primary Roads, North American Rail Network, Electric Power Transmission Lines, National Wetlands Inventory, NHDPlus HR Flowlines).', 'Every layer starts off.', 'Change'], scope: 'Change' },
            { cells: ['Chrome', 'Global search, notifications, Data group (Layers, Themes, Project Types, Sources, Permits), Resources group.', 'Resources and Support Desk exist without a home in the nav.', 'New Scope'], scope: 'New Scope' },
          ],
        },
      },
    ],
  },
  {
    id: 'open',
    title: 'Open Questions',
    questions: [
      'Default layer visibility on Geospatial: a curated set (this design), the layers found on the site, or none (QA).',
      'Use Sample Area: keep it in production or keep it on QA only.',
      'Themes and layers: QA has 11 themes and 29 layers. Confirm this stays the model for the first release.',
    ],
  },
];
