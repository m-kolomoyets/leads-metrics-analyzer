import type { DateRange } from 'react-day-picker';
import type { HomePeriodToken } from '../../utils/period';
import type { PeriodPickerProps } from './types';
import { CalendarIcon } from 'lucide-react';
import { parseISODate, toISODate } from '@/lib/utils/isoDate';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Segmented, SegmentedItem } from '@/components/ui/Segmented';
import { PERIOD_LABELS } from '../../constants';
import { HOME_PERIODS } from '../../utils/period';

const edgeFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });

// The Home period control (PRD story 46): this month, last month, or a window. Every change goes out
// through `onChange` into the URL, the feed's way, so a view is shareable and survives a reload.
function PeriodPicker({ period, onChange }: PeriodPickerProps) {
    const from = parseISODate(period.from);
    const to = parseISODate(period.to);
    const selected: DateRange | undefined = from ? { from, to } : undefined;

    function selectToken(token: HomePeriodToken) {
        // A month token drops the custom edges: dates in a `month` link would mean nothing.
        onChange(token === 'custom' ? { range: 'custom', from: period.from, to: period.to } : { range: token });
    }

    function selectDays(next: DateRange | undefined) {
        onChange({ range: 'custom', from: toISODate(next?.from), to: toISODate(next?.to) });
    }

    function renderTriggerLabel() {
        if (!from && !to) {
            return 'Pick dates';
        }

        return `${from ? edgeFormat.format(from) : '…'} — ${to ? edgeFormat.format(to) : '…'}`;
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Segmented label="Period">
                {HOME_PERIODS.map((token) => {
                    return (
                        <SegmentedItem
                            key={token}
                            selected={token === period.range}
                            onSelect={() => {
                                selectToken(token);
                            }}
                            className="px-2 py-0.5 text-xs"
                        >
                            {PERIOD_LABELS[token]}
                        </SegmentedItem>
                    );
                })}
            </Segmented>

            {period.range === 'custom' && (
                <Popover>
                    <PopoverTrigger
                        render={
                            <Button type="button" size="xs" variant="outline">
                                <CalendarIcon data-icon="inline-start" />
                                {renderTriggerLabel()}
                            </Button>
                        }
                    />

                    <PopoverContent align="end" className="w-auto p-2">
                        <Calendar
                            mode="range"
                            numberOfMonths={2}
                            defaultMonth={from}
                            selected={selected}
                            onSelect={selectDays}
                        />

                        <div className="mt-1 flex justify-end">
                            <Button
                                type="button"
                                size="xs"
                                variant="ghost"
                                disabled={!period.from && !period.to}
                                onClick={() => {
                                    selectDays(undefined);
                                }}
                            >
                                Clear
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
}

export { PeriodPicker };
