import { describe, expect, it } from 'vitest';
import { sparklineShape } from './path';

// A sparkline says one thing — the shape of the day — so the only rules worth pinning are the ones
// that would make it say something false: a gap drawn as a dive, or a lone push drawn as a line.

describe('sparklineShape', () => {
    it('draws one command per measurable push, moving left to right', () => {
        const { d } = sparklineShape([10, 20, 30], 100, 40);

        expect(d).toMatch(/^M/);
        expect(d?.match(/L/g)).toHaveLength(2);
    });

    it('inverts the band, so a rising series rises on screen', () => {
        const { d } = sparklineShape([10, 30], 100, 40);
        const [, first, second] = d?.match(/M[\d.]+ ([\d.]+) L[\d.]+ ([\d.]+)/) ?? [];

        expect(Number(second)).toBeLessThan(Number(first));
    });

    it('breaks the path at an unmeasurable push rather than dipping through zero', () => {
        const { d } = sparklineShape([10, null, 30], 100, 40);

        expect(d?.match(/M/g)).toHaveLength(2);
        expect(d).not.toMatch(/L/);
    });

    it('pins the trailing point on the last measurable push, not on a trailing gap', () => {
        const { last } = sparklineShape([10, 30, null], 100, 40);
        const measured = sparklineShape([10, 30], 100, 40);

        expect(last?.y).toBeCloseTo(measured.last?.y ?? Number.NaN);
    });

    it('centres a lone push instead of parking it against the left edge', () => {
        const { last } = sparklineShape([42], 100, 40);

        expect(last?.x).toBe(50);
    });

    it('draws nothing at all when nothing was measurable', () => {
        expect(sparklineShape([null, null], 100, 40)).toEqual({ d: null, last: null });
        expect(sparklineShape([], 100, 40)).toEqual({ d: null, last: null });
    });

    it('keeps a flat series inside the box rather than clipping it against an edge', () => {
        const { last } = sparklineShape([5, 5, 5], 100, 40);

        expect(last?.y).toBeGreaterThan(2);
        expect(last?.y).toBeLessThan(38);
    });
});
