import type { ChartTone } from '../types';
import { BAR_MIN_FRACTION, TONE_STROKE } from '../constants';

// One bar of a small card's plot: the INTERVAL between two pushes, drawn as a floating segment from
// the lower of the pair to the higher. A candle, not a column — a column from the floor would draw
// the whole reading again as a length, and four cards of that read as four bar charts of unrelated
// units. The candle draws only the MOVE, which is the one thing a strip card is scanned for.
//
// The colour is the interval's END grade, the same convention the trajectory's flags use: a stroke
// describes the interval that arrives at the push it ends on.
export type BarSpan = {
    index: number;
    // `[low, high]`, which is what Recharts reads as a range bar. Undefined where the interval is
    // unmeasurable — a missing bar is a gap, and a zero-length one would be a reading of "no move".
    span?: [number, number];
    color: string;
};

// Turn a card's readings into its bars. `domain` is the plot's own range, and is what the minimum
// visible length is taken as a fraction of: a flat interval still has to draw SOMETHING, and a
// minimum in pixels would be a different amount of data on every card.
export function barSpans(
    values: readonly (number | null)[],
    tones: readonly ChartTone[] | undefined,
    domain: readonly [number, number],
    ungradedColor: string
): BarSpan[] {
    // The smallest a bar may be drawn, in the data's own units. A move shorter than this is rounded
    // up to it and centred on where it happened, so the bar still sits at the right height.
    const floor = (domain[1] - domain[0]) * BAR_MIN_FRACTION;

    return values.slice(1).map((value, offset) => {
        const index = offset + 1;
        const previous = values[offset];
        const tone = tones?.[index];
        const color = tone ? TONE_STROKE[tone] : ungradedColor;

        if (value === null || previous === null) {
            return { index, color };
        }

        const low = Math.min(previous, value);
        const high = Math.max(previous, value);

        if (high - low >= floor) {
            return { index, color, span: [low, high] };
        }

        const middle = (low + high) / 2;

        return { index, color, span: [middle - floor / 2, middle + floor / 2] };
    });
}
