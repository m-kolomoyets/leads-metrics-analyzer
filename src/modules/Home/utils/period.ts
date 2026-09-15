import type { ResolvedRange } from '@/modules/Dashboard/types';
import { monthRange } from '@/lib/utils/calendarMonth';

// The Home period (offers-and-home/13, PRD story 46). Calendar months rather than the feed's
// rolling days: the map answers "how is this month going", and a month is the horizon a buyer is
// judged over. The URL shape is the feed's — `range`, `from`, `to` — so a custom window pasted
// from one page reads on the other; only the tokens differ.

export const HOME_PERIODS = ['month', 'last-month', 'custom'] as const;

export type HomePeriodToken = (typeof HOME_PERIODS)[number];

export type HomePeriod = {
    range: HomePeriodToken;
    from?: string;
    to?: string;
};

// The 1st of the month before the one `day` sits in. Day 0 of a month is the previous month's last
// day, so the previous month's range is one `monthRange` of that.
const lastDayOfPreviousMonth = (day: string): string => {
    const [year, month] = day.split('-').map(Number);
    const last = new Date(Date.UTC(year, month - 1, 0));

    return last.toISOString().slice(0, 10);
};

export function resolvePeriod(period: HomePeriod, today: string): ResolvedRange {
    if (period.range === 'custom') {
        // A half-filled custom range is a shareable link someone trimmed, not an error: the missing
        // edge falls back to today, and a backwards window is ordered rather than matching nothing.
        const from = period.from ?? today;
        const to = period.to ?? today;

        return from <= to ? { from, to } : { from: to, to: from };
    }

    if (period.range === 'last-month') {
        return monthRange(lastDayOfPreviousMonth(today));
    }

    return monthRange(today);
}
