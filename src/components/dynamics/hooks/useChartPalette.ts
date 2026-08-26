import type { Zone } from '@/lib/domain/types';
import { useSyncExternalStore } from 'react';

// Canvas takes colours, not custom properties: `ctx.strokeStyle = 'var(--danger)'` silently paints
// nothing. So the theme tokens are resolved to real values here and handed to the chart, and read
// again whenever the theme flips — otherwise a light-mode switch would leave the canvas dark-themed
// until the next data change.

export type ChartPalette = {
    zone: Record<Zone, string>;
    accent: string;
    background: string;
    muted: string;
    border: string;
    text: string;
};

// The values the tokens carry in the dark theme, used until the first read lands (and on the server,
// where there is no computed style at all).
const FALLBACK: ChartPalette = {
    zone: { green: '#22c55e', yellow: '#eab308', red: '#ef4444', neutral: '#94a3b8' },
    accent: '#3b82f6',
    background: '#0b1220',
    muted: '#94a3b8',
    border: '#1e293b',
    text: '#e2e8f0',
};

function tokenOf(styles: CSSStyleDeclaration, name: string, fallback: string): string {
    const value = styles.getPropertyValue(name).trim();

    return value === '' ? fallback : value;
}

function readPalette(): ChartPalette {
    const styles = window.getComputedStyle(document.documentElement);

    return {
        zone: {
            green: tokenOf(styles, '--success', FALLBACK.zone.green),
            yellow: tokenOf(styles, '--warning', FALLBACK.zone.yellow),
            red: tokenOf(styles, '--danger', FALLBACK.zone.red),
            neutral: tokenOf(styles, '--neutral', FALLBACK.zone.neutral),
        },
        accent: tokenOf(styles, '--accent-solid', FALLBACK.accent),
        background: tokenOf(styles, '--background', FALLBACK.background),
        muted: tokenOf(styles, '--muted-foreground', FALLBACK.muted),
        border: tokenOf(styles, '--border', FALLBACK.border),
        text: tokenOf(styles, '--foreground', FALLBACK.text),
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
