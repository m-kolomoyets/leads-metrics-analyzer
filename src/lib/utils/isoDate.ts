// Bridge between plain calendar dates (YYYY-MM-DD, no zone) and the `Date` objects the day grid
// selects. Both directions go through the LOCAL calendar — `new Date('2026-08-03')` parses as UTC
// midnight and reads as the 2nd for anyone west of Greenwich, which would silently shift a shared
// link, or a stamped report date, by a day.

export function parseISODate(value: string | undefined): Date | undefined {
    if (!value) {
        return undefined;
    }

    const [year, month, day] = value.split('-').map(Number);

    if (!year || !month || !day) {
        return undefined;
    }

    return new Date(year, month - 1, day);
}

export function toISODate(date: Date | undefined): string | undefined {
    if (!date) {
        return undefined;
    }

    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${date.getFullYear()}-${month}-${day}`;
}
