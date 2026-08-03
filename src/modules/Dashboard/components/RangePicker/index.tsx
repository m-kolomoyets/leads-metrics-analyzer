import type { DateRange, DayPickerLocale } from 'react-day-picker';
import type { Locale } from '@/components/report/utils/i18n';
import type { RangeToken, ReportRange } from '../../types';
import { CalendarIcon } from 'lucide-react';
import { enGB, uk } from 'react-day-picker/locale';
import { ui } from '@/components/report/utils/i18n';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { parseISODate, toISODate } from './utils/dates';
import { RANGE_TOKENS } from '../../types';

type RangePickerProps = {
    range: ReportRange;
    onChange: (next: ReportRange) => void;
    locale: Locale;
};

// The token labels, keyed to the i18n bag. Static map rather than a template so the keys stay
// greppable and the strings stay in one file.
const TOKEN_LABEL: Record<RangeToken, string> = {
    '1d': 'range1d',
    '3d': 'range3d',
    '7d': 'range7d',
    '30d': 'range30d',
    all: 'rangeAll',
    custom: 'rangeCustom',
};

// The day grid speaks its own locale bag (month and weekday names). `en-GB` rather than `en-US`: the
// team reads a Monday-first calendar in both languages.
const DAY_PICKER_LOCALE: Record<Locale, Partial<DayPickerLocale>> = { uk, en: enGB };

// The trigger reads as one window — "3 Aug — 9 Aug" — rather than two inputs, so a half-picked range
// is visibly half-picked.
const EDGE_FORMAT: Record<Locale, Intl.DateTimeFormat> = {
    uk: new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'short' }),
    en: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }),
};

// The range control. Every change goes back out through `onChange` and lands in the URL, so a view is
// shareable and survives a reload (spec stories 20, 21).
function RangePicker({ range, onChange, locale }: RangePickerProps) {
    const selected: DateRange | undefined = parseISODate(range.from)
        ? { from: parseISODate(range.from), to: parseISODate(range.to) }
        : undefined;

    function selectToken(token: RangeToken) {
        // Switching to a token drops the custom edges: leaving them in the URL would make a `7d` link
        // carry dates that mean nothing, and pasting it back would look like a bug.
        onChange(token === 'custom' ? { range: 'custom', from: range.from, to: range.to } : { range: token });
    }

    function selectDays(next: DateRange | undefined) {
        onChange({ range: 'custom', from: toISODate(next?.from), to: toISODate(next?.to) });
    }

    function renderTriggerLabel() {
        const from = parseISODate(range.from);
        const to = parseISODate(range.to);

        if (!from && !to) {
            return ui('rangePick', locale);
        }

        const format = EDGE_FORMAT[locale];
        const fromLabel = from ? format.format(from) : ui('rangeFrom', locale);
        const toLabel = to ? format.format(to) : ui('rangeTo', locale);

        return `${fromLabel} — ${toLabel}`;
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1" role="group" aria-label={ui('range', locale)}>
                {RANGE_TOKENS.map((token) => {
                    return (
                        <Button
                            key={token}
                            type="button"
                            size="xs"
                            variant={token === range.range ? 'default' : 'ghost'}
                            aria-pressed={token === range.range}
                            onClick={() => {
                                selectToken(token);
                            }}
                        >
                            {ui(TOKEN_LABEL[token], locale)}
                        </Button>
                    );
                })}
            </div>

            {range.range === 'custom' && (
                <Popover>
                    <PopoverTrigger
                        render={
                            <Button type="button" size="xs" variant="outline">
                                <CalendarIcon data-icon="inline-start" />
                                {renderTriggerLabel()}
                            </Button>
                        }
                    />

                    <PopoverContent align="start" className="w-auto p-2">
                        <Calendar
                            mode="range"
                            numberOfMonths={2}
                            defaultMonth={parseISODate(range.from)}
                            locale={DAY_PICKER_LOCALE[locale]}
                            selected={selected}
                            onSelect={selectDays}
                        />

                        <div className="mt-1 flex justify-end">
                            <Button
                                type="button"
                                size="xs"
                                variant="ghost"
                                disabled={!range.from && !range.to}
                                onClick={() => {
                                    selectDays(undefined);
                                }}
                            >
                                {ui('rangeClear', locale)}
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
}

export { RangePicker };
