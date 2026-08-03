import type { RangeToken, ReportRange, ResolvedRange } from '../types';

// Range-token arithmetic, pure and calendar-based. A token means the last N CALENDAR days ending
// today inclusive — "3d" on the 12th is the 10th, 11th and 12th, not the last 72 hours — and the
// window is compared against a Snapshot's report date, which is itself a plain calendar date.

// How many calendar days each token spans, today included.
const TOKEN_DAYS: Record<Exclude<RangeToken, 'custom' | 'all'>, number> = {
    '1d': 1,
    '3d': 3,
    '7d': 7,
    '30d': 30,
};

// The lower edge of `all`. A concrete date rather than an open-ended query, so the server contract
// stays "two dates" and every caller keeps comparing plain calendar strings. Earlier than any
// Snapshot this system can hold — the product did not exist, and a report date is not backdated
// beyond the campaign data it describes.
const EPOCH_DATE = '2000-01-01';

// Calendar arithmetic through UTC: the inputs are already the VIEWER's local calendar dates
// (`todayISO` reads the local clock), so UTC here is only a stable way to add days without a DST
// jump moving a date by one.
function shiftDays(date: string, days: number): string {
    const [year, month, day] = date.split('-').map(Number);
    const shifted = new Date(Date.UTC(year, month - 1, day + days));
    return shifted.toISOString().slice(0, 10);
}

// The viewer's local calendar day as YYYY-MM-DD. The only clock read in the Report — `buildReport`
// takes `today` as an argument precisely so it never reads one.
export function todayISO(now: Date = new Date()): string {
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    const day = `${now.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function resolveRange(range: ReportRange, today: string): ResolvedRange {
    if (range.range === 'custom') {
        // A half-filled custom range is a shareable link someone trimmed, not an error: the missing
        // edge falls back to today rather than throwing away the edge they did pick.
        const from = range.from ?? today;
        const to = range.to ?? today;
        // Ordered rather than trusted — a backwards window would otherwise match nothing at all and
        // read as "nobody reported", which is a different and wrong answer.
        return from <= to ? { from, to } : { from: to, to: from };
    }

    if (range.range === 'all') {
        return { from: EPOCH_DATE, to: today };
    }

    return { from: shiftDays(today, -(TOKEN_DAYS[range.range] - 1)), to: today };
}
