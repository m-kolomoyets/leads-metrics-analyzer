import { describe, expect, it } from 'vitest';
import { TONE_STROKE, UNGRADED_STROKE } from '../constants';
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
    it('places one stop per push, evenly across the plot', () => {
        const colors = [TONE_STROKE.green, TONE_STROKE.yellow, TONE_STROKE.red];

        expect(strokeStops(colors)).toEqual([
            { offset: 0, color: TONE_STROKE.green },
            { offset: 0.5, color: TONE_STROKE.yellow },
            { offset: 1, color: TONE_STROKE.red },
        ]);
    });

    it('carries an ungraded line as one colour repeated, and never varies its strength', () => {
        expect(strokeStops([UNGRADED_STROKE, UNGRADED_STROKE])).toEqual([
            { offset: 0, color: UNGRADED_STROKE },
            { offset: 1, color: UNGRADED_STROKE },
        ]);
    });

    it('flattens a single push, which has no width to spread a gradient across', () => {
        expect(strokeStops([TONE_STROKE.green])).toEqual([{ offset: 0, color: TONE_STROKE.green }]);
    });

    it('draws nothing for no pushes at all', () => {
        expect(strokeStops([])).toEqual([]);
    });
});
