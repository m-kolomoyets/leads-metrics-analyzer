import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { monthDays, monthRange } from '@/lib/utils/calendarMonth';
import { dynamicsDimensionHistoryQueryOptions } from '@/services/dynamics/queries';
import { dimensionHeatDays } from '@/modules/Dynamics/utils/heatDays';
import { teamDimensionHistory } from '@/modules/Dynamics/utils/teamHistory';
import { DayPicker } from '@/components/dynamics/DayPicker';

// The dollar-free header's day control (#10). Same grid, same read shape, and no verdict on any
// square: these viewers hold no money dimension, so a day can only say that SOMEBODY reported it.

type DayPickerControlProps = {
    reportDate: string;
    today: string;
    onSelect: (day: string) => void;
};

function DayPickerControl({ reportDate, today, onSelect }: DayPickerControlProps) {
    const [month, setMonth] = useState(reportDate);

    const { data: histories } = useQuery({
        ...dynamicsDimensionHistoryQueryOptions(monthRange(month)),
        placeholderData: keepPreviousData,
    });

    const days = dimensionHeatDays(monthDays(month), teamDimensionHistory(histories ?? []), today);

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
