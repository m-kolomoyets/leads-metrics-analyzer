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
    dark: '#08080a',
};

export const CHROME_TOKENS: ReadonlyArray<ColourToken> = [
    { name: '--background', light: '#fafafa', dark: '#1b1b1f', usage: 'the page' },
    { name: '--surface', light: '#ffffff', dark: '#08080a', usage: 'inline: cards, panels, tables, navbar' },
    { name: '--surface-overlay', light: '#ffffff', dark: '#17171a', usage: 'floating: popover, menu, dialog, sheet' },
    { name: '--border', light: '#e4e4e4', dark: '#2a2a2f', usage: 'hairlines, table rules, dividers' },
    { name: '--border-strong', light: '#d0d0d0', dark: '#3d3d43', usage: 'input borders, header/total rules' },
    { name: '--foreground', light: '#131313', dark: '#f2f2f2', usage: 'body text, figures' },
    { name: '--muted-foreground', light: '#5f5f5f', dark: '#9b9b9b', usage: 'labels, column heads' },
    { name: '--faint', light: '#8a8a8a', dark: '#6b6b6b', usage: 'disabled, placeholder' },
];

export const ACCENT_TOKENS: ReadonlyArray<ColourToken> = [
    { name: '--accent', light: '#1f5fd0', dark: '#4c82f7', usage: 'focus ring, selected tab, chosen metric, link' },
    { name: '--accent-foreground', light: '#ffffff', dark: '#000000', usage: 'ink on a filled accent' },
];

// `green` renders teal and `yellow` renders amber; the names are the DB enum, not the paint.
export const ZONE_TOKENS: ReadonlyArray<ColourToken> = [
    { name: '--zone-green', light: '#008275', dark: '#26a69a', usage: 'Zone green' },
    { name: '--zone-yellow', light: '#ad6200', dark: '#e0a33e', usage: 'Zone yellow — the invented one' },
    { name: '--zone-red', light: '#a82727', dark: '#ef5350', usage: 'Zone red' },
    { name: '--zone-neutral', light: '#5f5f5f', dark: '#9b9b9b', usage: 'Zone neutral — no judgement' },
    { name: '--sales', light: '#6d28d9', dark: '#a78bfa', usage: 'sales — a fact, not a judgement' },
];

// Not a colour so much as a treatment: one translucent grey wash, used for every hover and every
// selected row in the app. Translucent so it reads the same over --surface, --popover and the navbar.
export const INTERACTION_TOKENS: ReadonlyArray<ColourToken> = [
    {
        name: '--hover',
        light: 'rgb(90 90 90 / 0.1)',
        dark: 'rgb(255 255 255 / 0.08)',
        usage: 'hover on button, menu item, nav row',
    },
    {
        name: '--hover-strong',
        light: 'rgb(90 90 90 / 0.16)',
        dark: 'rgb(255 255 255 / 0.14)',
        usage: 'the selected nav row / chosen option',
    },
];

export const SHADOW_BY_THEME: Record<ThemeName, string> = {
    light: '0 4px 12px rgb(0 0 0 / 0.12)',
    dark: '0 4px 12px rgb(0 0 0 / 0.45)',
};

export const RADIUS_STEPS = [
    { name: 'rounded-sm', value: '4px', className: 'rounded-sm' },
    { name: 'rounded-md', value: '8px', className: 'rounded-md' },
    { name: 'rounded-lg', value: '12px', className: 'rounded-lg' },
    { name: 'rounded-full', value: 'avatars only', className: 'rounded-full' },
] as const;

export const TYPE_SCALE = [
    { role: 'labels, column heads, chart axes', className: 'text-xs font-normal', note: '13px / 400' },
    { role: 'labels, emphasised', className: 'text-xs font-medium', note: '13px / 500' },
    { role: 'body, table cells', className: 'text-sm font-normal', note: '15px / 400' },
    { role: 'section headings', className: 'text-base font-semibold', note: '17px / 600' },
    { role: 'headline figures', className: 'text-xl font-semibold tabular-nums', note: '22px / 600' },
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
