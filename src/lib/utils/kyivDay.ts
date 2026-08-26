// The only place in the app that knows a timezone (ADR-0017, SPEC I4). Europe/Kyiv is hardcoded and
// the browser's own zone is never consulted: a buyer travelling — or a server rendering in UTC —
// must still read the same "today" as the team it reports to.
//
// The zone answers viewer-local questions only ("is it past 10:00 today", "how stale is the last
// push", "which day does *today* mean"). It never decides which day a Snapshot belongs to — that is
// the buyer-entered `report_date` (ADR-0017).

export const KYIV_TIME_ZONE = 'Europe/Kyiv';

const HOUR_IN_MS = 60 * 60 * 1000;

// `formatToParts` rather than a locale that happens to print ISO order: the parts are named, so the
// output cannot drift with an ICU locale-data change.
const dayFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: KYIV_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

const hourFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: KYIV_TIME_ZONE,
    hour: '2-digit',
    hourCycle: 'h23',
});

const clockFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: KYIV_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
});

function partOf(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
    const part = parts.find((candidate) => {
        return candidate.type === type;
    });
    return part ? part.value : '';
}

// The calendar date in Europe/Kyiv as `YYYY-MM-DD` — the same string shape `report_date` uses, so it
// compares and sorts as plain text.
export function kyivDay(now: Date = new Date()): string {
    const parts = dayFormatter.formatToParts(now);
    return `${partOf(parts, 'year')}-${partOf(parts, 'month')}-${partOf(parts, 'day')}`;
}

// The wall-clock hour in Europe/Kyiv, 0–23.
export function kyivHour(now: Date = new Date()): number {
    // h23 prints midnight as "24" in some ICU versions; normalise rather than trust it.
    return Number(partOf(hourFormatter.formatToParts(now), 'hour')) % 24;
}

// How old an instant is, in fractional hours. Zone-free by construction — the answer is a duration,
// not a wall-clock reading — but it lives here because every caller asking it is asking a Kyiv-local
// freshness question ("is the latest push older than three hours"). Negative for a future instant.
export function hoursSince(instant: Date, now: Date = new Date()): number {
    return (now.getTime() - instant.getTime()) / HOUR_IN_MS;
}

// The wall-clock time in Europe/Kyiv as `HH:mm` — the header's "data as of 12:04". Same reason as
// the day: a buyer reading from Warsaw and their lead reading from Kyiv must see one clock.
export function kyivClock(instant: Date): string {
    const parts = clockFormatter.formatToParts(instant);
    return `${partOf(parts, 'hour')}:${partOf(parts, 'minute')}`;
}
