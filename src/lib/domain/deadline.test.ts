import { daysUntilDeadline, DEADLINE_DUE_SOON_DAYS, deadlineState, formatDeadline } from './deadline';

// The Deadline's state (offers-and-home/09, CONTEXT.md §Deadline): due within three days or past
// due it demands attention; an archived card's Deadline demands nothing. Days are calendar days
// judged against Kyiv's today, which the caller supplies (ADR-0017).
describe('deadlineState', () => {
    const today = '2026-09-14';
    const live = (deadline: string | null) => {
        return { deadline, archivedAt: null };
    };

    it('is neutral without a deadline', () => {
        expect(deadlineState(live(null), today)).toBe('neutral');
    });

    it('is neutral more than three days out', () => {
        expect(deadlineState(live('2026-09-18'), today)).toBe('neutral');
    });

    it('is due-soon at exactly three days', () => {
        expect(DEADLINE_DUE_SOON_DAYS).toBe(3);
        expect(deadlineState(live('2026-09-17'), today)).toBe('due-soon');
    });

    it('is due-soon today', () => {
        expect(deadlineState(live('2026-09-14'), today)).toBe('due-soon');
    });

    it('is overdue from yesterday', () => {
        expect(deadlineState(live('2026-09-13'), today)).toBe('overdue');
    });

    it('is neutral on an archived card whatever the date', () => {
        expect(deadlineState({ deadline: '2026-09-01', archivedAt: '2026-09-10T00:00:00.000Z' }, today)).toBe(
            'neutral'
        );
    });

    it('counts calendar days across a month boundary and a DST change', () => {
        expect(daysUntilDeadline('2026-10-02', '2026-09-30')).toBe(2);
        // Kyiv leaves summer time on 2026-10-25; a 23-hour day is still one day.
        expect(daysUntilDeadline('2026-10-26', '2026-10-24')).toBe(2);
        expect(daysUntilDeadline('2026-09-10', today)).toBe(-4);
    });
});

describe('formatDeadline', () => {
    it('prints the day the team reads it', () => {
        expect(formatDeadline('2026-09-12')).toBe('12.09.2026');
    });
});
