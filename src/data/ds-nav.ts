// Single source of truth for the design-system sidebar + breadcrumbs.
// Types come from @esa/docs so this data is structurally compatible with DocsShell.
//
// The `foundations` group below is GENERIC — every spoke documents the same five
// token-driven foundation pages, so keep it as-is. `componentGroups` is the
// per-spoke catalog: /spoke-init populates it by mirroring the source app's
// catalog (e.g. an Angular ui-catalog) or by curating the esa-* components this
// spoke actually uses. The single scaffold entry below shows the shape.
import type { NavItem, NavGroup } from '@esa/docs/nav';
export type { NavItem, NavGroup };

export const foundations: NavGroup = {
  label: 'Foundations',
  items: [
    { label: 'Color', href: '/design-system/foundations/color' },
    { label: 'Typography', href: '/design-system/foundations/typography' },
    { label: 'Spacing', href: '/design-system/foundations/spacing' },
    { label: 'Radius', href: '/design-system/foundations/radius' },
    { label: 'Iconography', href: '/design-system/foundations/iconography' },
  ],
};

const c = (label: string, name: string): NavItem => ({
  label,
  href: `/design-system/components/${name}`,
});

// The esa-* legos the Due Diligence prototype composes, each shown in this
// spoke's theme. App-only dd-* components are listed on /handoff/.
export const componentGroups: NavGroup[] = [
  { label: 'Actions', items: [c('Button', 'esa-button'), c('Button Toggle', 'esa-button-toggle'), c('Dropdown Menu', 'esa-dropdown-menu')] },
  { label: 'Forms', items: [c('Text Field', 'esa-text-field'), c('Textarea', 'esa-textarea'), c('Checkbox', 'esa-checkbox'), c('Range Slider', 'esa-range-slider'), c('File Upload', 'esa-file-upload')] },
  { label: 'Display', items: [c('Badge', 'esa-badge'), c('Card', 'esa-card'), c('Tab Layout', 'esa-tab-layout')] },
  { label: 'Overlays', items: [c('Popover', 'esa-popover'), c('Dialog', 'esa-dialog')] },
];

export const allGroups: NavGroup[] = [foundations, ...componentGroups];
