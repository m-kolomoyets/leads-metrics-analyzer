import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { monthDays, monthRange } from '@/lib/utils/calendarMonth';
import { dynamicsHistoryQueryOptions } from '@/services/dynamics/queries';
import { DayPicker } from '@/components/dynamics/DayPicker';
import { heatDays } from '../../utils/heatDays';
import { teamHistory } from '../../utils/teamHistory';

// The header's day control, with the month behind it. The read is keyed by the visible month rather
// than by the day, so paging the grid is what fetches — and moving to another day inside the same
// month costs nothing.
//
// The heatmap is the TEAM's, summed across every buyer the viewer may see: the day is picked
// independently of who is selected, so the grid must not change colour when a card is clicked.
//
// `useQuery`, deliberately not the page's usual `useSuspenseQuery`: the grid is a control the reader
// is standing in front of, and suspending it would tear the popover down every time they paged a
// month. The previous month is held on screen instead while the next one lands.

type DayPickerControlProps = {
    // The day the page is reading, and today in Kyiv — the caller owns both (ADR-0017).
    reportDate: string;
    today: string;
    onSelect: (day: string) => void;
};

function DayPickerControl({ reportDate, today, onSelect }: DayPickerControlProps) {
    // Any date inside the month on show. It follows the day being read until the reader pages away.
    const [month, setMonth] = useState(reportDate);

    const { data: histories } = useQuery({
        ...dynamicsHistoryQueryOptions(monthRange(month)),
        placeholderData: keepPreviousData,
    });

    const days = heatDays(monthDays(month), teamHistory(histories ?? []), today);

    return (
        <DayPicker
            value={reportDate}
            today={today}
            month={month}
            days={days}
            onSelect={onSelect}
            onMonthChange={setMonth}
        />
    );
}

export { DayPickerControl };
