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
        expect(contrastRatio('#26a69a', '#171717')).toBe(contrastRatio('#171717', '#26a69a'));
    });

    it('reproduces the measured Zone ratios recorded in docs/design-system.md', () => {
        // Dark Zone colours against --surface #171717.
        expect(contrastRatio('#26a69a', '#171717')).toBeCloseTo(5.98, 1);
        expect(contrastRatio('#e0a33e', '#171717')).toBeCloseTo(8.09, 1);
        expect(contrastRatio('#ef5350', '#171717')).toBeCloseTo(5.14, 1);

        // Light Zone colours against --surface #ffffff.
        expect(contrastRatio('#00796b', '#ffffff')).toBeCloseTo(5.32, 1);
        expect(contrastRatio('#ab5e00', '#ffffff')).toBeCloseTo(4.85, 1);
        expect(contrastRatio('#9b1c1c', '#ffffff')).toBeCloseTo(8.15, 1);
    });

    it('accepts shorthand hex', () => {
        expect(contrastRatio('#fff', '#000')).toBe(21);
    });
});
