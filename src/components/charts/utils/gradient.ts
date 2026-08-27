import type { ChartTone } from '../types';
import { FADED_OPACITY, TONE_STROKE } from '../constants';

// A zone-graded stroke, as SVG gradient stops. One stop per point, placed at the fraction of the
// plot's width that point sits at, so the colour changes exactly where the verdict does — the same
// thing `ZoneSeries` paints on canvas, expressed as a gradient the browser interpolates.
//
// The interpolation is the honest part: a cost does not snap from green to red between two pushes,
// it passes through the threshold somewhere in between, and a blend says so where a hard edge would
// claim a precision the data has not got.
export function toneStops(tones: readonly ChartTone[]): { offset: number; color: string }[] {
    if (tones.length === 0) {
        return [];
    }
    // A single point has no width to spread a gradient across — one flat stop, or the browser draws
    // nothing at all.
    if (tones.length === 1) {
        return [{ offset: 0, color: TONE_STROKE[tones[0]] }];
    }
    return tones.map((tone, index) => {
        return { offset: index / (tones.length - 1), color: TONE_STROKE[tone] };
    });
}

// The decorative fill behind a small card's line: the line's own colours, anchored at the floor of
// the plot and fading out upward. Each grade is its own blob rather than a stop on one flat band —
// a band reads as a second chart, a blur of blobs reads as light on a surface, which is what it is.
export function toneFill(tones: readonly ChartTone[]): string {
    if (tones.length === 0) {
        return 'none';
    }
    return tones
        .map((tone, index) => {
            const x = tones.length === 1 ? 50 : (index / (tones.length - 1)) * 100;
            return `radial-gradient(70% 130% at ${x}% 105%, ${TONE_STROKE[tone]}, transparent 72%)`;
        })
        .join(', ');
}

// The same, for a line that carries no grade. One hue, so one blob spanning the plot.
export function accentFill(color: string): string {
    return `radial-gradient(110% 130% at 50% 105%, ${color}, transparent 72%)`;
}

// The same stroke, once opacity has something to say as well: colour from the grade at each push,
// strength from whether the interval INTO that push measured anything. `faded[i]` describes the
// segment ending at point i — the one drawn into it — so a restated interval is weakened without
// touching the intervals either side of it.
//
// That precision is why a point can emit TWO stops at one offset: a stop is shared by the segments
// on both sides of it, so a boundary where the strength changes needs one stop for each. The colour
// is the same on both, so only the opacity steps; the hue still blends across every segment.
export function strokeStops(
    colors: readonly string[],
    faded: readonly boolean[]
): { offset: number; color: string; opacity: number }[] {
    if (colors.length === 0) {
        return [];
    }
    // A single point has no width to spread a gradient across — one flat stop, or the browser draws
    // nothing at all. It has no interval into it either, so nothing to fade.
    if (colors.length === 1) {
        return [{ offset: 0, color: colors[0], opacity: 1 }];
    }

    const stops: { offset: number; color: string; opacity: number }[] = [];

    colors.forEach((color, index) => {
        const offset = index / (colors.length - 1);
        const incoming = faded[index] === true ? FADED_OPACITY : 1;
        const outgoing = faded[index + 1] === true ? FADED_OPACITY : 1;

        if (index > 0) {
            stops.push({ offset, color, opacity: incoming });
        }
        if (index < colors.length - 1 && (index === 0 || incoming !== outgoing)) {
            stops.push({ offset, color, opacity: outgoing });
        }
    });

    return stops;
}
