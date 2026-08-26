import type { ChartPalette } from '../types';
import { describe, expect, it } from 'vitest';
import { chartOptionsFor } from './chartOptions';

const PALETTE: ChartPalette = {
    zone: { green: '#g', yellow: '#y', red: '#r', neutral: '#n' },
    accent: '#accent',
    background: '#background',
    surface: '#surface',
    muted: '#muted',
    border: '#border',
    text: '#text',
    guide: '#guide',
    fontFamily: 'Inter, sans-serif',
    fontSize: 12,
};

// Every colour the library would otherwise default to. If one of these survives into the options the
// chart is painting in someone else's design system.
const LIBRARY_DEFAULTS = ['#D6DCDE', '#2B2B43', '#758696', '#B2B5BE', '#191919', 'rgba(178, 181, 189, 0.2)'];

function colourValuesOf(value: unknown): string[] {
    if (typeof value === 'string') {
        return [value];
    }

    if (value === null || typeof value !== 'object') {
        return [];
    }

    return Object.values(value).flatMap(colourValuesOf);
}

describe('chartOptionsFor', () => {
    it('renders axis text in the app font at the app size', () => {
        const options = chartOptionsFor(PALETTE);

        expect(options.layout?.fontFamily).toBe(PALETTE.fontFamily);
        expect(options.layout?.fontSize).toBe(PALETTE.fontSize);
        expect(options.layout?.textColor).toBe(PALETTE.muted);
    });

    it('covers grid, crosshair, both price scales, time scale and the pane separator', () => {
        const options = chartOptionsFor(PALETTE);

        expect(options.grid?.vertLines?.color).toBe(PALETTE.border);
        expect(options.grid?.horzLines?.color).toBe(PALETTE.border);
        expect(options.crosshair?.vertLine?.color).toBe(PALETTE.guide);
        expect(options.crosshair?.vertLine?.labelBackgroundColor).toBe(PALETTE.surface);
        expect(options.crosshair?.horzLine?.color).toBe(PALETTE.guide);
        expect(options.crosshair?.horzLine?.labelBackgroundColor).toBe(PALETTE.surface);
        expect(options.leftPriceScale?.borderColor).toBe(PALETTE.border);
        expect(options.rightPriceScale?.borderColor).toBe(PALETTE.border);
        expect(options.timeScale?.borderColor).toBe(PALETTE.border);
        expect(options.layout?.panes?.separatorColor).toBe(PALETTE.border);
        expect(options.layout?.panes?.separatorHoverColor).toBe(PALETTE.border);
    });

    it('leaves the page showing through rather than painting a background over it', () => {
        const options = chartOptionsFor(PALETTE);

        expect(options.layout?.background).toEqual({ type: 'solid', color: 'transparent' });
        expect(options.layout?.attributionLogo).toBe(false);
    });

    it('lets no Lightweight Charts default colour through', () => {
        const colours = colourValuesOf(chartOptionsFor(PALETTE));

        for (const fallback of LIBRARY_DEFAULTS) {
            expect(colours).not.toContain(fallback);
        }
    });
});
