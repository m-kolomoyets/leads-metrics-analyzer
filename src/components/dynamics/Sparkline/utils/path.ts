import type { Bounds } from '../../utils/geometry';
import { boundsOf, scaleOf } from '../../utils/geometry';

// A sparkline is the trajectory with everything explanatory removed: no axes, no ticks, no markers,
// no zone gradient. What survives is the shape — is this climbing, falling or flat — which is the
// only question a strip of four is there to answer at a glance.
//
// Pure, so the one rule that matters is checkable without a DOM (ADR-0005): an unmeasurable push is a
// BREAK in the path, never a dip to zero. A CPI nobody could compute is not a CPI of nothing.

export type SparklineShape = {
    // An SVG path, or null when the series has nothing measurable to draw at all.
    d: string | null;
    // Where the last measurable point landed, so the trailing value can be pinned beside it.
    last: { x: number; y: number } | null;
};

function coordinate(value: number): string {
    return value.toFixed(2);
}

// `padding` keeps the stroke's own width inside the box: a flat line at the top of the band would
// otherwise be clipped in half by the viewBox edge.
export function sparklineShape(values: (number | null)[], width: number, height: number, padding = 2): SparklineShape {
    const bounds: Bounds | null = boundsOf(values);

    if (bounds === null || values.length === 0) {
        return { d: null, last: null };
    }

    const scale = scaleOf(bounds, height - padding, padding);
    // A lone push has no width to travel across, so it sits in the middle rather than against the
    // left edge, where it would read as the start of a line that failed to draw.
    const step = values.length > 1 ? (width - padding * 2) / (values.length - 1) : 0;
    const originX = values.length > 1 ? padding : width / 2;

    const parts: string[] = [];
    let last: { x: number; y: number } | null = null;
    let penDown = false;

    values.forEach((value, index) => {
        if (value === null || !Number.isFinite(value)) {
            // Lift the pen. Joining across the gap would invent a figure for a push that reported
            // none, which is the one thing a trajectory must never do.
            penDown = false;
            return;
        }

        const x = originX + step * index;
        const y = scale(value);

        parts.push(`${penDown ? 'L' : 'M'}${coordinate(x)} ${coordinate(y)}`);
        penDown = true;
        last = { x, y };
    });

    if (parts.length === 0) {
        return { d: null, last: null };
    }

    return { d: parts.join(' '), last };
}
