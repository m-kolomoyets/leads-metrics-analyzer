import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';

describe('contrastRatio', () => {
    it('returns 21 for black on white', () => {
        expect(contrastRatio('#000000', '#ffffff')).toBe(21);
    });

    it('returns 1 for a colour against itself', () => {
        expect(contrastRatio('#ab5e00', '#ab5e00')).toBe(1);
    });

    it('is symmetric', () => {
        expect(contrastRatio('#26a69a', '#161616')).toBe(contrastRatio('#161616', '#26a69a'));
    });

    it('reproduces the measured Zone ratios recorded in docs/design-system.md', () => {
        // Dark Zone colours against --surface #161616.
        expect(contrastRatio('#26a69a', '#161616')).toBeCloseTo(6.04, 1);
        expect(contrastRatio('#e0a33e', '#161616')).toBeCloseTo(8.17, 1);
        expect(contrastRatio('#ef5350', '#161616')).toBeCloseTo(5.19, 1);

        // Light Zone colours against --surface #ffffff.
        expect(contrastRatio('#008275', '#ffffff')).toBeCloseTo(4.72, 1);
        expect(contrastRatio('#ad6200', '#ffffff')).toBeCloseTo(4.64, 1);
        expect(contrastRatio('#a82727', '#ffffff')).toBeCloseTo(7.04, 1);
    });

    it('accepts shorthand hex', () => {
        expect(contrastRatio('#fff', '#000')).toBe(21);
    });
});
