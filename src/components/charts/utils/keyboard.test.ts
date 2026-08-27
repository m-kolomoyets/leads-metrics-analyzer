import { describe, expect, it } from 'vitest';
import { pointStep } from './keyboard';

describe('pointStep', () => {
    it('walks forward and back one push at a time', () => {
        expect(pointStep('ArrowRight', 2, 5)).toBe(3);
        expect(pointStep('ArrowLeft', 2, 5)).toBe(1);
    });

    it('treats the vertical arrows as the horizontal ones', () => {
        expect(pointStep('ArrowDown', 0, 5)).toBe(1);
        expect(pointStep('ArrowUp', 4, 5)).toBe(3);
    });

    it('stops at the ends rather than wrapping', () => {
        // A wrap would send a reader walking the day off its last push back to breakfast.
        expect(pointStep('ArrowRight', 4, 5)).toBe(4);
        expect(pointStep('ArrowLeft', 0, 5)).toBe(0);
    });

    it('jumps to either end', () => {
        expect(pointStep('Home', 3, 5)).toBe(0);
        expect(pointStep('End', 1, 5)).toBe(4);
    });

    it('ignores every other key', () => {
        expect(pointStep('Enter', 1, 5)).toBeNull();
        expect(pointStep('a', 1, 5)).toBeNull();
    });

    it('holds still on an empty plot', () => {
        expect(pointStep('End', 0, 0)).toBe(0);
        expect(pointStep('ArrowRight', 0, 0)).toBe(0);
    });

    it('pulls an out-of-range position back inside before moving', () => {
        // The selection outlives a mode switch that shortened the day, and the first arrow key after
        // one must land on a push that exists.
        expect(pointStep('ArrowRight', 9, 5)).toBe(4);
        expect(pointStep('ArrowLeft', 9, 5)).toBe(3);
    });
});
