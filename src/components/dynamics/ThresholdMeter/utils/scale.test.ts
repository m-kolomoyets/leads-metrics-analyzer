import { describe, expect, it } from 'vitest';
import { meterScale } from './scale';

describe('meterScale', () => {
    it('keeps air past the red line, so "how far over" is visible rather than implied', () => {
        const scale = meterScale(8, 8, 14);

        expect(scale.max).toBeGreaterThan(14);
        expect(scale.red).toBeLessThan(100);
    });

    it('places the value between the lines it was graded against', () => {
        const scale = meterScale(10, 8, 14);

        expect(scale.value).toBeGreaterThan(scale.green);
        expect(scale.value).toBeLessThan(scale.red);
    });

    it('stretches to a figure that ran past the rail rather than drawing it off the end', () => {
        const scale = meterScale(40, 8, 14);

        expect(scale.max).toBe(40);
        expect(scale.value).toBe(100);
    });

    it('reads an unmeasurable figure as no position at all', () => {
        expect(meterScale(null, 8, 14).value).toBe(0);
    });
});
