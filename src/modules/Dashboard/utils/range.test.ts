import { describe, expect, it } from 'vitest';
import { resolveRange } from './range';

// Token resolution is the one piece of date arithmetic in the Report, and it is deliberately
// calendar-based: "last 3 days" is three calendar days ending today INCLUSIVE, not 72 hours.

describe('resolveRange', () => {
    it('resolves each token to the last N calendar days ending today, inclusive', () => {
        expect(resolveRange({ range: '1d' }, '2026-06-12')).toEqual({ from: '2026-06-12', to: '2026-06-12' });
        expect(resolveRange({ range: '3d' }, '2026-06-12')).toEqual({ from: '2026-06-10', to: '2026-06-12' });
        expect(resolveRange({ range: '7d' }, '2026-06-12')).toEqual({ from: '2026-06-06', to: '2026-06-12' });
        expect(resolveRange({ range: '30d' }, '2026-06-12')).toEqual({ from: '2026-05-14', to: '2026-06-12' });
    });

    it('crosses month and year boundaries', () => {
        expect(resolveRange({ range: '3d' }, '2026-03-01')).toEqual({ from: '2026-02-27', to: '2026-03-01' });
        expect(resolveRange({ range: '7d' }, '2026-01-02')).toEqual({ from: '2025-12-27', to: '2026-01-02' });
    });

    it('handles a leap day', () => {
        expect(resolveRange({ range: '3d' }, '2028-03-01')).toEqual({ from: '2028-02-28', to: '2028-03-01' });
    });

    it('passes a custom range through', () => {
        expect(resolveRange({ range: 'custom', from: '2026-01-01', to: '2026-01-31' }, '2026-06-12')).toEqual({
            from: '2026-01-01',
            to: '2026-01-31',
        });
    });

    it('falls back to today for a half-filled custom range', () => {
        expect(resolveRange({ range: 'custom', from: '2026-06-01' }, '2026-06-12')).toEqual({
            from: '2026-06-01',
            to: '2026-06-12',
        });
        expect(resolveRange({ range: 'custom', to: '2026-06-30' }, '2026-06-12')).toEqual({
            from: '2026-06-12',
            to: '2026-06-30',
        });
        expect(resolveRange({ range: 'custom' }, '2026-06-12')).toEqual({ from: '2026-06-12', to: '2026-06-12' });
    });

    it('orders a backwards custom range rather than returning an empty window', () => {
        expect(resolveRange({ range: 'custom', from: '2026-06-30', to: '2026-06-01' }, '2026-06-12')).toEqual({
            from: '2026-06-01',
            to: '2026-06-30',
        });
    });
});
