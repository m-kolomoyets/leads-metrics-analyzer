// Round numbers, evenly spaced, and as few as will still describe the range. An axis whose labels
// read 0.00 · 0.65 · 1.30 · 1.95 makes the reader do arithmetic to place a value between two of
// them; 0 · 0.5 · 1.0 · 1.5 · 2.0 · 2.5 is read without thinking, which is the whole job of a scale.
//
// The step is the smallest of 1, 2, 2.5 or 5 (times a power of ten) that covers the span in roughly
// `count` steps, which is the standard nice-number choice and the one every charting library that
// looks confident is making.
const STEPS = [1, 2, 2.5, 5];

// EXACTLY `count` ticks, all round, spanning the data. The count is fixed rather than approximate
// because the horizontal grid is drawn once and both scales have to land on it — a left axis with
// five rows and a right axis with four prints figures between the rules instead of on them.
//
// The step is the smallest of 1, 2, 2.5 or 5 (times a power of ten) whose `count` rows still reach
// past the data from a round starting point. Walking the candidates upward rather than solving for
// one guarantees the smallest step that fits, which is the tightest honest axis.
export function niceTicks(min: number, max: number, count = 5): number[] {
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
        return [];
    }
    // A flat series has no span to divide, and inventing a range around it would imply movement.
    if (max <= min) {
        return [min];
    }

    const rows = Math.max(2, count);
    let magnitude = 10 ** Math.floor(Math.log10((max - min) / (rows - 1)));

    // Bounded rather than `while (true)`: the loop is provably short — each pass multiplies the step
    // by at least 2 — and an axis is not worth a chance of hanging the render.
    for (let attempt = 0; attempt < 64; attempt += 1) {
        for (const candidate of STEPS) {
            const step = candidate * magnitude;
            const first = Math.floor(min / step) * step;
            // A hair of tolerance: 0.1 * 3 is 0.30000000000000004, and without it the axis would
            // grow a whole extra step to cover a value it already covers.
            if (first + step * (rows - 1) >= max - step / 1000) {
                return Array.from({ length: rows }, (_unused, index) => {
                    return Number((first + index * step).toFixed(10));
                });
            }
        }
        magnitude *= 10;
    }
    return [min, max];
}

// The span a set of series covers, ignoring the gaps. Null everywhere means no axis at all.
export function extentOf(rows: readonly Record<string, unknown>[], keys: readonly string[]): [number, number] {
    let min = Infinity;
    let max = -Infinity;
    for (const row of rows) {
        for (const key of keys) {
            const value = row[key];
            if (typeof value === 'number' && Number.isFinite(value)) {
                min = Math.min(min, value);
                max = Math.max(max, value);
            }
        }
    }
    return [min, max];
}

// The range a small card's plot draws over. Not the data's own extent: a domain of exactly
// [min, max] pins the lowest point to the floor and the highest to the ceiling, so a heavy stroke
// and its halo are half outside the panel, and a curve that spends most of the day high reads as
// pressed against the top with nothing under it.
//
// The buffer is a share of the span rather than a fixed number, so the shape is unchanged — it is
// the same curve with air around it, at any scale. More below than above: the line is being read as
// a shape standing on a floor, and a floor needs room.
const BELOW = 0.45;
const ABOVE = 0.2;

export function paddedDomain(values: readonly (number | null)[]): [number, number] {
    const numbers = values.filter((value): value is number => {
        return typeof value === 'number' && Number.isFinite(value);
    });
    if (numbers.length === 0) {
        return [0, 1];
    }
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    // A flat series has no span to take a share of, so the buffer comes off the value itself — and
    // off 1 when the value is 0, which has no magnitude to work from either.
    const span = max - min || Math.abs(max) || 1;
    return [min - span * BELOW, max + span * ABOVE];
}
