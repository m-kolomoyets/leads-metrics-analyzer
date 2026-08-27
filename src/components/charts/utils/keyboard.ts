// Walking a plot with the arrow keys. Kept out of the card because it is the one part of the
// keyboard path that can be wrong in a way nobody sees: a wrap, an off-by-one at either end, or a
// position left over from a longer day are all silent on screen and all obvious in a test.

// Where the given key sends the position, or `null` when the key is not one that walks. Clamped both
// ways: `current` may be stale — the selection survives a mode switch that shortened the day — so it
// is pulled back inside the range before it is moved, not after.
export function pointStep(key: string, current: number, count: number): number | null {
    const last = Math.max(0, count - 1);
    const from = Math.min(Math.max(current, 0), last);

    if (key === 'Home') {
        return 0;
    }

    if (key === 'End') {
        return last;
    }

    // Both axes walk the day. The plot is a row of pushes whichever pair of arrows the reader
    // reaches for, and a chart that answers only two of the four reads as broken.
    if (key === 'ArrowRight' || key === 'ArrowDown') {
        return Math.min(last, from + 1);
    }

    if (key === 'ArrowLeft' || key === 'ArrowUp') {
        return Math.max(0, from - 1);
    }

    return null;
}
