import type { PlotPoint } from './segments';
import { describe, expect, it } from 'vitest';
import { segmentsOf } from './segments';

const plot = (index: number, y: number | null, zone: PlotPoint['zone'] = 'green'): PlotPoint => {
    return { index, x: index * 10, y, zone };
};

describe('segmentsOf', () => {
    it('joins consecutive points, one segment fewer than there are points', () => {
        const segments = segmentsOf([plot(0, 100), plot(1, 80), plot(2, 60)], [false, false, false]);

        expect(segments).toHaveLength(2);
        expect(segments[0]).toMatchObject({ x1: 0, y1: 100, x2: 10, y2: 80 });
    });

    it('carries both ends zones, so a crossing segment can be painted as a gradient', () => {
        const segments = segmentsOf([plot(0, 100, 'red'), plot(1, 80, 'green')], [false, false]);

        expect(segments[0]).toMatchObject({ fromZone: 'red', toZone: 'green' });
    });

    it('breaks the line at an unmeasurable point rather than drawing through it', () => {
        const segments = segmentsOf([plot(0, 100), plot(1, null), plot(2, 60)], [false, false, false]);

        expect(segments).toHaveLength(0);
    });

    it('flags the segment the correction arrived on, and only that one', () => {
        const segments = segmentsOf([plot(0, 100), plot(1, 80), plot(2, 60)], [false, true, false]);

        expect(segments[0].corrected).toBe(true);
        expect(segments[1].corrected).toBe(false);
    });

    it('draws nothing from a single push — one point is a dot, not a trajectory', () => {
        expect(segmentsOf([plot(0, 100)], [false])).toEqual([]);
    });
});
