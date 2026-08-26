import { describe, expect, it } from 'vitest';
import { boundsOf, scaleOf, ticksOf, xPositions } from './geometry';

// The chart's arithmetic, kept out of the SVG so it can be checked without a DOM (ADR-0005).

describe('boundsOf', () => {
    it('spans the measurable values, padded so a marker never sits on the frame', () => {
        const bounds = boundsOf([10, null, 20]);

        expect(bounds).not.toBeNull();
        expect(bounds!.min).toBeLessThan(10);
        expect(bounds!.max).toBeGreaterThan(20);
    });

    it('is null when nothing is measurable — an empty axis is not an axis of zero', () => {
        expect(boundsOf([null, null])).toBeNull();
        expect(boundsOf([])).toBeNull();
    });

    it('opens a band around a flat series rather than collapsing it to a line of height zero', () => {
        const bounds = boundsOf([25, 25, 25]);

        expect(bounds!.min).toBeLessThan(25);
        expect(bounds!.max).toBeGreaterThan(25);
    });

    it('keeps a negative figure inside the band — profit goes below zero and must still be drawn', () => {
        const bounds = boundsOf([-40, 10]);

        expect(bounds!.min).toBeLessThan(-40);
    });
});

describe('scaleOf', () => {
    it('maps the bottom of the band to the bottom of the plot and inverts the SVG axis', () => {
        const scale = scaleOf({ min: 0, max: 100 }, 200, 0);

        expect(scale(0)).toBe(200);
        expect(scale(100)).toBe(0);
        expect(scale(50)).toBe(100);
    });

    it('parks a degenerate band mid-plot instead of dividing by zero', () => {
        const scale = scaleOf({ min: 5, max: 5 }, 200, 0);

        expect(scale(5)).toBe(100);
    });
});

describe('xPositions', () => {
    it('places pushes in proportion to when they happened, not evenly', () => {
        const [first, second, third] = xPositions(
            ['2026-08-26T06:00:00Z', '2026-08-26T07:00:00Z', '2026-08-26T10:00:00Z'],
            0,
            120
        );

        expect(first).toBe(0);
        expect(second).toBe(30);
        expect(third).toBe(120);
    });

    it('spreads pushes evenly when they share an instant, so two points are still two points', () => {
        const positions = xPositions(['2026-08-26T06:00:00Z', '2026-08-26T06:00:00Z'], 0, 100);

        expect(positions).toEqual([0, 100]);
    });

    it('centres a lone push rather than pinning it to the left frame', () => {
        expect(xPositions(['2026-08-26T06:00:00Z'], 0, 100)).toEqual([50]);
    });

    it('falls back to even spacing when a stamp will not parse', () => {
        expect(xPositions(['nonsense', 'also nonsense'], 0, 100)).toEqual([0, 100]);
    });
});

describe('ticksOf', () => {
    it('returns rounded values inside the band, ends included', () => {
        const ticks = ticksOf({ min: 0, max: 100 }, 5);

        expect(ticks).toHaveLength(5);
        expect(ticks[0]).toBe(0);
        expect(ticks.at(-1)).toBe(100);
    });
});
