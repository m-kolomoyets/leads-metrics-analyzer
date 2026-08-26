import type { Zone } from '@/lib/domain/types';

// One series' points, already placed, and the strokes between them. Split from the SVG so the two
// rules that make the chart readable — a gap at an unmeasurable point, a grey stroke at a restated
// one — are checkable without a DOM (ADR-0005).

export type PlotPoint = {
    // Which push this is, so a segment can be traced back to the delta that produced it.
    index: number;
    x: number;
    // Null when the metric was unmeasurable at that push: a gap in the line, never a dive to zero.
    y: number | null;
    // The zone the point's own frozen thresholds graded it (ADR-0002). Money is always `neutral`.
    zone: Zone;
};

export type PlotSegment = {
    // The index of the point the segment ENDS on — the delta it was drawn from.
    index: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    fromZone: Zone;
    toZone: Zone;
    // Facebook restated the day across this interval: the segment measures nothing and reads grey.
    corrected: boolean;
};

// `corrected` is indexed by point, matching `deltasFor` output: entry `i` describes the interval that
// ENDS at point `i`, which is exactly the segment drawn from `i - 1` to `i`.
export function segmentsOf(points: PlotPoint[], corrected: boolean[]): PlotSegment[] {
    const segments: PlotSegment[] = [];

    for (let index = 1; index < points.length; index += 1) {
        const from = points[index - 1];
        const to = points[index];

        // An unmeasurable end leaves a gap. Interpolating across it would invent a cost for a push
        // that reported none, which is the one thing a trajectory must never do.
        if (from.y === null || to.y === null) {
            continue;
        }

        segments.push({
            index: to.index,
            x1: from.x,
            y1: from.y,
            x2: to.x,
            y2: to.y,
            fromZone: from.zone,
            toZone: to.zone,
            corrected: corrected[index] ?? false,
        });
    }

    return segments;
}
