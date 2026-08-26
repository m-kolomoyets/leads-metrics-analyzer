// Where a cost sits between its own two threshold lines, as percentages of one rail. Pure, so the one
// thing that can be wrong here in a way nobody notices — a value drawn on the wrong side of a line —
// is checkable without a DOM (ADR-0005).

export type MeterScale = {
    // The rail's right-hand end, in the metric's own units.
    max: number;
    // Positions along the rail, 0–100.
    green: number;
    red: number;
    value: number;
    // True when the figure ran past the end of the rail and its marker is pinned to the edge.
    clamped: boolean;
};

function percent(value: number, max: number): number {
    if (max <= 0) {
        return 0;
    }

    return Math.min(100, Math.max(0, (value / max) * 100));
}

// The rail always shows BOTH lines with air past the red one, so "how far over" is visible rather
// than implied — a bar that ended at the red line would draw every failing cost the same way. A
// figure beyond that air pins to the end and says so through `clamped`.
export function meterScale(value: number | null, greenBelow: number, redAbove: number): MeterScale {
    const max = Math.max(redAbove * 1.3, greenBelow * 1.3, value ?? 0);

    return {
        max,
        green: percent(greenBelow, max),
        red: percent(redAbove, max),
        value: value === null ? 0 : percent(value, max),
        clamped: value !== null && value > max,
    };
}
