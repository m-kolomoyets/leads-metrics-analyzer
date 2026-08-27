import { describe, expect, it } from 'vitest';
import { TONE_STROKE, UNGRADED_STROKE } from '../constants';
import { barSpans } from './bars';

describe('barSpans', () => {
    it('draws one bar per interval, spanning the move it made', () => {
        expect(barSpans([1, 3, 2], undefined, [0, 10], UNGRADED_STROKE)).toEqual([
            { index: 1, color: UNGRADED_STROKE, span: [1, 3] },
            { index: 2, color: UNGRADED_STROKE, span: [2, 3] },
        ]);
    });

    it('colours an interval by the grade of the push it arrives at', () => {
        expect(barSpans([1, 3], ['green', 'red'], [0, 10], UNGRADED_STROKE)).toEqual([
            { index: 1, color: TONE_STROKE.red, span: [1, 3] },
        ]);
    });

    it('opens a flat interval to the floor, centred where it happened', () => {
        expect(barSpans([5, 5], undefined, [0, 10], UNGRADED_STROKE)).toEqual([
            { index: 1, color: UNGRADED_STROKE, span: [4.75, 5.25] },
        ]);
    });

    it('leaves an unmeasurable interval without a bar at all', () => {
        expect(barSpans([1, null, 2], undefined, [0, 10], UNGRADED_STROKE)).toEqual([
            { index: 1, color: UNGRADED_STROKE },
            { index: 2, color: UNGRADED_STROKE },
        ]);
    });

    it('draws nothing for a single reading, which is no interval', () => {
        expect(barSpans([1], undefined, [0, 10], UNGRADED_STROKE)).toEqual([]);
    });
});
