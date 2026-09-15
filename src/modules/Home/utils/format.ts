// Calendar dates on the Home page — the header's period and the panel's "last report" — printed as
// "12 Sept". Forced to UTC because the value is a date, not an instant: a local formatter would
// shift a midnight date a day back west of Greenwich.
const dayFormat = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'short' });

export const dayLabel = (day: string): string => {
    return dayFormat.format(new Date(`${day}T00:00:00Z`));
};

export const periodLabel = (from: string, to: string): string => {
    return `${dayLabel(from)} — ${dayLabel(to)}`;
};
