import type { ChartPalette } from '../types';
import { useSyncExternalStore } from 'react';

// Canvas takes colours, not custom properties: `ctx.strokeStyle = 'var(--zone-red)'` silently paints
// nothing. So the theme tokens are resolved to real values here and handed to the chart, and read
// again whenever the theme flips — otherwise a light-mode switch would leave the canvas dark-themed
// until the next data change. One direction only: no colour is declared here and mirrored into CSS
// (ADR-0020).

// The values the tokens carry in the dark theme, used until the first read lands (and on the server,
// where there is no computed style at all). This is what the first paint uses, so it is kept honest
// against `src/styles/index.css` rather than left at whatever it once was.
const FALLBACK: ChartPalette = {
    zone: { green: '#26a69a', yellow: '#e0a33e', red: '#ef5350', neutral: '#9b9b9b' },
    accent: '#4c82f7',
    background: '#000000',
    surface: '#212121',
    muted: '#9b9b9b',
    border: '#262626',
    text: '#f2f2f2',
    guide: 'rgb(255 255 255 / 0.35)',
    fontFamily: '"Inter", sans-serif',
    fontSize: 13,
};

// Chart axes are the 13px label step from the type scale. It is a number, not a colour, so it has no
// custom property to read — the scale lives in `docs/design-system.md` and this is its canvas copy.
const AXIS_FONT_SIZE = 13;

function tokenOf(styles: CSSStyleDeclaration, name: string, fallback: string): string {
    const value = styles.getPropertyValue(name).trim();

    return value === '' ? fallback : value;
}

function readPalette(): ChartPalette {
    const styles = window.getComputedStyle(document.documentElement);

    return {
        zone: {
            green: tokenOf(styles, '--zone-green', FALLBACK.zone.green),
            yellow: tokenOf(styles, '--zone-yellow', FALLBACK.zone.yellow),
            red: tokenOf(styles, '--zone-red', FALLBACK.zone.red),
            neutral: tokenOf(styles, '--zone-neutral', FALLBACK.zone.neutral),
        },
        accent: tokenOf(styles, '--accent', FALLBACK.accent),
        background: tokenOf(styles, '--background', FALLBACK.background),
        surface: tokenOf(styles, '--surface-overlay', FALLBACK.surface),
        muted: tokenOf(styles, '--muted-foreground', FALLBACK.muted),
        border: tokenOf(styles, '--border', FALLBACK.border),
        text: tokenOf(styles, '--foreground', FALLBACK.text),
        guide: document.documentElement.classList.contains('light')
            ? 'rgb(19 19 19 / 0.35)'
            : 'rgb(255 255 255 / 0.35)',
        fontFamily: tokenOf(styles, '--font-sans', FALLBACK.fontFamily),
        fontSize: AXIS_FONT_SIZE,
    };
}

// The theme is an external system — a class on <html> that `ThemeContext` writes — so it is
// subscribed to rather than mirrored into state. The snapshot is cached against that class, because
// `useSyncExternalStore` demands a stable reference and re-reading the computed style on every render
// would hand back a fresh object each time and loop.
let cached: { key: string; palette: ChartPalette } = { key: '', palette: FALLBACK };

function subscribe(onChange: () => void): () => void {
    const observer = new MutationObserver(onChange);

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });

    return function unsubscribe() {
        observer.disconnect();
    };
}

function getSnapshot(): ChartPalette {
    const key = document.documentElement.className;

    if (cached.key !== key) {
        cached = { key, palette: readPalette() };
    }

    return cached.palette;
}

function getServerSnapshot(): ChartPalette {
    return FALLBACK;
}

export function useChartPalette(): ChartPalette {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
