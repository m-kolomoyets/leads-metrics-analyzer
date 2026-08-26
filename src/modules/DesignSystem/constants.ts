// The token tables from `docs/design-system.md`, transcribed once. The literals are duplicated from
// `src/styles/index.css` on purpose: a swatch that read the computed custom property could never
// disagree with the stylesheet, and disagreeing with the stylesheet is exactly what this page is for.

export type ThemeName = 'light' | 'dark';

export type ColourToken = {
    name: string;
    light: string;
    dark: string;
    usage: string;
};

export const THEMES: ReadonlyArray<ThemeName> = ['light', 'dark'];

export const SURFACE_BY_THEME: Record<ThemeName, string> = {
    light: '#ffffff',
    dark: '#171717',
};

export const CHROME_TOKENS: ReadonlyArray<ColourToken> = [
    { name: '--background', light: '#fafafa', dark: '#101010', usage: 'the page' },
    { name: '--surface', light: '#ffffff', dark: '#171717', usage: 'inline: cards, panels, tables, sidebar' },
    { name: '--surface-overlay', light: '#ffffff', dark: '#1e1e1e', usage: 'floating: popover, menu, dialog, sheet' },
    { name: '--border', light: '#e4e4e4', dark: '#2b2b2b', usage: 'hairlines, table rules, dividers' },
    { name: '--border-strong', light: '#d0d0d0', dark: '#3d3d3d', usage: 'input borders, header/total rules' },
    { name: '--foreground', light: '#131313', dark: '#e8e8e8', usage: 'body text, figures' },
    { name: '--muted-foreground', light: '#5f5f5f', dark: '#8f8f8f', usage: 'labels, column heads' },
    { name: '--faint', light: '#8a8a8a', dark: '#5c5c5c', usage: 'disabled, placeholder' },
];

export const ACCENT_TOKENS: ReadonlyArray<ColourToken> = [
    { name: '--accent', light: '#1976d2', dark: '#2196f3', usage: 'focus ring, active nav, selected tab, link' },
    { name: '--accent-foreground', light: '#ffffff', dark: '#101010', usage: 'ink on a filled accent' },
];

// `green` renders teal and `yellow` renders amber; the names are the DB enum, not the paint.
export const ZONE_TOKENS: ReadonlyArray<ColourToken> = [
    { name: '--zone-green', light: '#00796b', dark: '#26a69a', usage: 'Zone green' },
    { name: '--zone-yellow', light: '#ab5e00', dark: '#e0a33e', usage: 'Zone yellow — the invented one' },
    { name: '--zone-red', light: '#9b1c1c', dark: '#ef5350', usage: 'Zone red' },
    { name: '--zone-neutral', light: '#5f5f5f', dark: '#8f8f8f', usage: 'Zone neutral — no judgement' },
];

export const SHADOW_BY_THEME: Record<ThemeName, string> = {
    light: '0 4px 12px rgb(0 0 0 / 0.12)',
    dark: '0 4px 12px rgb(0 0 0 / 0.45)',
};

export const RADIUS_STEPS = [
    { name: 'rounded-sm', value: '2px', className: 'rounded-sm' },
    { name: 'rounded-md', value: '4px', className: 'rounded-md' },
    { name: 'rounded-lg', value: '6px', className: 'rounded-lg' },
    { name: 'rounded-full', value: 'avatars only', className: 'rounded-full' },
] as const;

export const TYPE_SCALE = [
    { role: 'labels, column heads, chart axes', className: 'text-xs font-normal', note: '12px / 400' },
    { role: 'labels, emphasised', className: 'text-xs font-medium', note: '12px / 500' },
    { role: 'body, table cells', className: 'text-sm font-normal', note: '14px / 400' },
    { role: 'section headings', className: 'text-base font-semibold', note: '16px / 600' },
    { role: 'headline figures', className: 'text-xl font-semibold tabular-nums', note: '20px / 600' },
] as const;

// 700 is not in the vocabulary; the ramp stops at 600.
export const WEIGHT_RAMP = [
    { name: 'font-normal', className: 'font-normal', note: '400' },
    { name: 'font-medium', className: 'font-medium', note: '500' },
    { name: 'font-semibold', className: 'font-semibold', note: '600' },
] as const;

export const ICON_SIZES = [
    { name: 'size-3', className: 'size-3', note: '12px — inline with 12px text' },
    { name: 'size-4', className: 'size-4', note: '16px — the default' },
] as const;
