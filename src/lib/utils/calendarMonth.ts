// Calendar-month arithmetic over `YYYY-MM-DD` strings — the shape `report_date` already uses, so
// nothing here needs a timezone. Which day "today" is remains `kyivDay`'s question (ADR-0017); this
// file only answers "which days does the month that day sits in contain", and answers it in UTC so a
// viewer's own zone can never shift a month boundary.

const pad2 = (value: number): string => {
    return String(value).padStart(2, '0');
};

// The month a calendar date sits in, as a `[year, month]` pair with a 1-based month.
const partsOf = (day: string): [number, number] => {
    const [year, month] = day.split('-').map(Number);

    return [year, month];
};

const dayLabelFormat = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
});

// How many days the month holds — day 0 of the NEXT month is the last day of this one.
export function daysInMonth(day: string): number {
    const [year, month] = partsOf(day);

    return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

// The first and last date of the month, for a read that asks the server for a range.
export function monthRange(day: string): { from: string; to: string } {
    const [year, month] = partsOf(day);
    const prefix = `${year}-${pad2(month)}`;

    return { from: `${prefix}-01`, to: `${prefix}-${pad2(daysInMonth(day))}` };
}

// Every date of the month, in order. The grid is built from this rather than from the days that
// happen to carry a Snapshot: a month with a hole in it must render the hole.
export function monthDays(day: string): string[] {
    const [year, month] = partsOf(day);
    const prefix = `${year}-${pad2(month)}`;

    return Array.from({ length: daysInMonth(day) }, (_, index) => {
        return `${prefix}-${pad2(index + 1)}`;
    });
}

// "Tue, Sep 15" — one dot's date, spelled out in its tooltip and its accessible label.
export function dayLabel(day: string): string {
    return dayLabelFormat.format(new Date(`${day}T00:00:00Z`));
}
