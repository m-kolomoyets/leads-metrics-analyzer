import type { DatePickerProps } from './types';
import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { parseISODate, toISODate } from '@/lib/utils/isoDate';
import { DAY_PICKER_LOCALE } from '@/components/report/utils/dayPickerLocale';
import { longDate, ui } from '@/components/report/utils/i18n';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';

// Single-day picker: the app's Calendar in a Popover, wearing the app's Button and tokens, in place of
// the browser's native date input (which ignores the theme and renders differently per platform).
function DatePicker({ value, onChange, locale, id, disabled, className, align = 'start' }: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const selected = parseISODate(value);

    // `required` on the grid: re-clicking the chosen day keeps it rather than clearing the field, so
    // the caller never has to render a half-empty date.
    function selectDay(next: Date) {
        const iso = toISODate(next);

        if (iso) {
            onChange(iso);
        }

        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    <Button id={id} type="button" size="sm" variant="outline" disabled={disabled} className={className}>
                        <CalendarIcon data-icon="inline-start" />
                        {selected ? longDate(selected, locale) : ui('datePick', locale)}
                    </Button>
                }
            />

            <PopoverContent align={align} className="w-auto p-2">
                <Calendar
                    mode="single"
                    required
                    defaultMonth={selected}
                    locale={DAY_PICKER_LOCALE[locale]}
                    selected={selected}
                    onSelect={selectDay}
                />
            </PopoverContent>
        </Popover>
    );
}

export { DatePicker };
