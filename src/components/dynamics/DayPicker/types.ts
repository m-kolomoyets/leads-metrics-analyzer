import type { HeatDay } from '@/modules/Dynamics/utils/heatDays';

export type DayPickerProps = {
    // The day the page is READING, as a plain calendar date (YYYY-MM-DD) — the same shape
    // `report_date` uses, so no `Date` leaks past this component.
    value: string;
    // Today in Europe/Kyiv (ADR-0017), resolved by the caller. It bounds the grid — there is no day
    // after it to read — and marks the square, which is not the same square as the selected one.
    today: string;
    // Any date inside the month the grid is showing. Held by the caller because the month IS the
    // read: paging to August is what asks the server for August.
    month: string;
    // That month, day by day, for the whole team. Empty while the month is still loading — the grid
    // then paints an unheated calendar rather than disappearing under a spinner.
    days: HeatDay[];
    onSelect: (day: string) => void;
    onMonthChange: (month: string) => void;
};
