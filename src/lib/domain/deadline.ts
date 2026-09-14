// The Deadline's pure state (offers-and-home/09, CONTEXT.md §Deadline, PRD stories 26–28). Calendar
// arithmetic over `YYYY-MM-DD` strings, in UTC, like `calendarMonth` — which day "today" is stays
// `kyivDay`'s question (ADR-0017) and the caller passes it in, so the list, the badge and the tests
// all judge the same day.

export type DeadlineState = 'neutral' | 'due-soon' | 'overdue';

// The minimal card shape the rule reads. An archived card's Deadline demands nothing.
export type DeadlineSubject = {
    deadline: string | null;
    archivedAt: string | null;
};

export const DEADLINE_DUE_SOON_DAYS = 3;

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const utcMidnight = (day: string): number => {
    const [year, month, date] = day.split('-').map(Number);

    return Date.UTC(year, month - 1, date);
};

// Whole calendar days from `today` to the deadline: 0 today, negative once past.
export const daysUntilDeadline = (deadline: string, today: string): number => {
    return Math.round((utcMidnight(deadline) - utcMidnight(today)) / DAY_IN_MS);
};

export const deadlineState = (subject: DeadlineSubject, today: string): DeadlineState => {
    if (subject.deadline === null || subject.archivedAt !== null) {
        return 'neutral';
    }

    const days = daysUntilDeadline(subject.deadline, today);

    if (days < 0) {
        return 'overdue';
    }

    return days <= DEADLINE_DUE_SOON_DAYS ? 'due-soon' : 'neutral';
};

// `12.09.2026` — the shape the team writes dates in, used by the card and by the Thread's system
// entry ("deadline moved to 12.09.2026 · Ihor").
export const formatDeadline = (deadline: string): string => {
    const [year, month, day] = deadline.split('-');

    return `${day}.${month}.${year}`;
};
