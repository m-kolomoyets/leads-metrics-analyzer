// The trajectory chart's arithmetic: values and instants in, plot coordinates out. Pure, so the SVG
// above it holds no maths at all and this can be checked without a DOM (ADR-0005).
//
// SVG's Y grows downward, so every vertical scale is handed a `from` BELOW a `to` and inverts.

export type Bounds = {
    min: number;
    max: number;
};

// How much air is left above and below the extremes, as a share of the band.
const PADDING = 0.1;

// The band a flat series is drawn in: a day where CPI never moved is a straight line across the
// middle, not a line lying on the frame. Proportional to the figure, with a floor for a flat zero.
function flatBand(value: number): Bounds {
    const air = Math.abs(value) * PADDING || 1;

    return { min: value - air, max: value + air };
}

// The band a set of values needs. Nulls are skipped rather than read as zero — an unmeasurable CPI
// must not drag the axis down to 0 — and a set with nothing measurable has no band at all.
export function boundsOf(values: (number | null)[]): Bounds | null {
    const measured = values.filter((value): value is number => {
        return value !== null && Number.isFinite(value);
    });

    if (measured.length === 0) {
        return null;
    }

    const min = Math.min(...measured);
    const max = Math.max(...measured);

    if (min === max) {
        return flatBand(min);
    }

    const air = (max - min) * PADDING;

    return { min: min - air, max: max + air };
}

// A value → pixel mapping across one axis. A degenerate band is parked mid-plot: dividing by its
// zero height would put every point at NaN and paint nothing.
export function scaleOf(bounds: Bounds, from: number, to: number): (value: number) => number {
    const height = bounds.max - bounds.min;

    return (value: number): number => {
        if (height <= 0) {
            return (from + to) / 2;
        }

        return from + ((value - bounds.min) / height) * (to - from);
    };
}

// Evenly spaced positions, the fallback whenever time cannot separate the pushes: a lone point sits
// in the middle of the plot rather than against its left edge.
function evenly(count: number, left: number, right: number): number[] {
    if (count === 1) {
        return [(left + right) / 2];
    }

    return Array.from({ length: count }, (_unused, index) => {
        return left + (index / (count - 1)) * (right - left);
    });
}

// Where each push sits along the bottom. The axis is `taken_at` (ADR-0017) and it is read as time:
// two pushes twenty minutes apart sit closer together than two pushes three hours apart, which is
// the whole reason the axis is the stamp and not the push's ordinal. Unparseable or coincident
// stamps fall back to even spacing — two pushes in the same minute are still two points.
export function xPositions(takenAt: string[], left: number, right: number): number[] {
    const instants = takenAt.map((stamp) => {
        return Date.parse(stamp);
    });

    if (instants.length === 0) {
        return [];
    }

    if (instants.some(Number.isNaN)) {
        return evenly(instants.length, left, right);
    }

    const first = Math.min(...instants);
    const span = Math.max(...instants) - first;

    if (span <= 0) {
        return evenly(instants.length, left, right);
    }

    return instants.map((instant) => {
        return left + ((instant - first) / span) * (right - left);
    });
}

// Evenly spaced label values across a band, both ends included — the gridline ladder either axis
// prints beside itself.
export function ticksOf(bounds: Bounds, count: number): number[] {
    if (count < 2) {
        return [bounds.min];
    }

    const step = (bounds.max - bounds.min) / (count - 1);

    return Array.from({ length: count }, (_unused, index) => {
        return bounds.min + step * index;
    });
}
