import { describe, expect, it } from 'vitest';
import { FADED_OPACITY, TONE_STROKE, UNGRADED_STROKE } from '../constants';
import { strokeStops, toneStops } from './gradient';

describe('toneStops', () => {
    it('places one stop per point, at the fraction of the width that point sits at', () => {
        expect(toneStops(['green', 'yellow', 'red'])).toEqual([
            { offset: 0, color: TONE_STROKE.green },
            { offset: 0.5, color: TONE_STROKE.yellow },
            { offset: 1, color: TONE_STROKE.red },
        ]);
    });
});

describe('strokeStops', () => {
    const colors = [TONE_STROKE.green, TONE_STROKE.yellow, TONE_STROKE.red];

    it('draws a day nothing was restated in at full strength', () => {
        expect(strokeStops(colors, [false, false, false])).toEqual([
            { offset: 0, color: TONE_STROKE.green, opacity: 1 },
            { offset: 0.5, color: TONE_STROKE.yellow, opacity: 1 },
            { offset: 1, color: TONE_STROKE.red, opacity: 1 },
        ]);
    });

    it('fades only the interval that was restated, not the ones either side of it', () => {
        // The middle push carries the correction, so the stroke INTO it is the faded one: the
        // opacity drops at the first push and comes back at the second, and the interval after it
        // is drawn as strongly as the one before.
        expect(strokeStops(colors, [false, true, false])).toEqual([
            { offset: 0, color: TONE_STROKE.green, opacity: FADED_OPACITY },
            { offset: 0.5, color: TONE_STROKE.yellow, opacity: FADED_OPACITY },
            { offset: 0.5, color: TONE_STROKE.yellow, opacity: 1 },
            { offset: 1, color: TONE_STROKE.red, opacity: 1 },
        ]);
    });

    it('fades the last interval without leaving a stop hanging past the plot', () => {
        expect(strokeStops(colors, [false, false, true])).toEqual([
            { offset: 0, color: TONE_STROKE.green, opacity: 1 },
            { offset: 0.5, color: TONE_STROKE.yellow, opacity: 1 },
            { offset: 0.5, color: TONE_STROKE.yellow, opacity: FADED_OPACITY },
            { offset: 1, color: TONE_STROKE.red, opacity: FADED_OPACITY },
        ]);
    });

    it('carries an ungraded line, which has one colour and can still be faded', () => {
        expect(strokeStops([UNGRADED_STROKE, UNGRADED_STROKE], [false, true])).toEqual([
            { offset: 0, color: UNGRADED_STROKE, opacity: FADED_OPACITY },
            { offset: 1, color: UNGRADED_STROKE, opacity: FADED_OPACITY },
        ]);
    });

    it('gives a single push a flat stop rather than a gradient the browser would not draw', () => {
        expect(strokeStops([TONE_STROKE.green], [true])).toEqual([{ offset: 0, color: TONE_STROKE.green, opacity: 1 }]);
    });

    it('has nothing to draw for an empty day', () => {
        expect(strokeStops([], [])).toEqual([]);
    });
});
