import { describe, expect, it } from 'vitest';
import { clampBound } from './zoneBounds';

describe('clampBound', () => {
    it('stops the green bound at its neighbour instead of letting it cross', () => {
        expect(clampBound('gy', '20', '14')).toBe('14');
    });

    it('stops the red bound at its neighbour from the other side', () => {
        expect(clampBound('yr', '5', '8')).toBe('8');
    });

    it('leaves a legal pair exactly as typed', () => {
        expect(clampBound('gy', '8', '14')).toBe('8');
        expect(clampBound('yr', '14', '8')).toBe('14');
    });

    it('leaves a half-typed field alone, so a blur mid-edit never rewrites it', () => {
        expect(clampBound('gy', '', '14')).toBe('');
        expect(clampBound('gy', '-', '14')).toBe('-');
    });

    it('holds a percent band inside its own ceiling', () => {
        expect(clampBound('yr', '140', '7', { min: 0, max: 100 })).toBe('100');
        expect(clampBound('gy', '-5', '15', { min: 0, max: 100 })).toBe('0');
    });

    it('clamps against a neighbour that has not been filled in yet by leaving it be', () => {
        expect(clampBound('gy', '20', '')).toBe('20');
    });
});
