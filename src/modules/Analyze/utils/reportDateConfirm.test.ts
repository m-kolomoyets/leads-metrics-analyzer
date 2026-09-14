import { describe, expect, it } from 'vitest';
import { needsReportDateConfirmation } from './reportDateConfirm';

// "Today" is Kyiv's today (ADR-0017): the predicate must agree with the team clock, not the browser.

describe('needsReportDateConfirmation', () => {
    it('is false when the picked day is today in Kyiv', () => {
        // 2026-09-13 21:30 UTC is already the 14th in Kyiv (UTC+3).
        const now = new Date('2026-09-13T21:30:00Z');

        expect(needsReportDateConfirmation('2026-09-14', now)).toBe(false);
    });

    it('is true for yesterday even though it is still that day in UTC', () => {
        const now = new Date('2026-09-13T21:30:00Z');

        expect(needsReportDateConfirmation('2026-09-13', now)).toBe(true);
    });

    it('is false right before Kyiv midnight and true one minute after', () => {
        const beforeMidnight = new Date('2026-09-13T20:59:00Z');
        const afterMidnight = new Date('2026-09-13T21:00:00Z');

        expect(needsReportDateConfirmation('2026-09-13', beforeMidnight)).toBe(false);
        expect(needsReportDateConfirmation('2026-09-13', afterMidnight)).toBe(true);
    });

    it('is true for a future day', () => {
        const now = new Date('2026-09-13T10:00:00Z');

        expect(needsReportDateConfirmation('2026-09-20', now)).toBe(true);
    });
});
