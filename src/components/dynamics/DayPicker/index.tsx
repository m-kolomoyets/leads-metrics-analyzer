import type { CalendarDayButtonProps } from '@/components/ui/Calendar/types';
import type { HeatDay } from '@/modules/Dynamics/utils/heatDays';
import type { RosterGeoProfit } from '@/services/dynamics/types';
import type { DayPickerProps } from './types';
import { createContext, useEffect, useRef, useState } from 'react';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import { dayLabel } from '@/lib/utils/calendarMonth';
import { cn } from '@/lib/utils/cn';
import { flagEmoji } from '@/lib/utils/flagEmoji';
import { parseISODate, toISODate } from '@/lib/utils/isoDate';
import { useSafeContext } from '@/hooks/useSafeContext';
import { DASH, pct, usdCompactSigned, usdSigned } from '@/components/report/utils/format';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { DAY_HEAT_CLASS, DAY_HEAT_LABEL } from './constants';

// The day the Dynamics page is reading, as a control rather than a URL param (spec story 20). The
// grid under it is a heatmap of the WHOLE team's month — every visible buyer's day summed into one
// verdict — so picking a day and seeing which days are worth picking is one gesture, not two.
//
// Team-wide rather than per-buyer on purpose: the day is chosen independently of who is selected, so
// a grid that followed the selection would change its colours underneath the reader every time they
// clicked a different card, and would answer a question ("was this person's Tuesday good") nobody
// asked while looking for a day to open.
//
// The colour is a MAGNITUDE grade over the team's ROI; the card row's is the SIGN of one buyer's
// profit. Different questions, deliberately — `heatDays` owns the grading rule for this one.

// The month, by date, for the cells to read. A context rather than a prop: the day cell is
// react-day-picker's own component slot, so the only way to hand it data without remounting the grid
// on every render is to put the data where it can reach for it.
const DayHeatContext = createContext<Map<string, HeatDay> | undefined>(undefined);

DayHeatContext.displayName = 'DayHeatContext';

// What one square says out loud. The colour is a claim about money, so the money is spelled out
// beside it: a heatmap nobody can check is a heatmap nobody can argue with, and it is the only text
// a screen reader gets from this grid at all.
function heatName(iso: string, heat: HeatDay | undefined): string {
    const date = dayLabel(iso);

    if (!heat || heat.state === 'future' || heat.state === 'unreported') {
        return `${date} — ${DAY_HEAT_LABEL[heat?.state ?? 'future']}`;
    }

    const profit = heat.profit === null ? DASH : usdSigned(heat.profit);
    // Every market, not only the three that fit: the label is the one channel with no width limit,
    // and a reader on a screen reader is exactly the one who cannot see the "+2".
    const markets =
        heat.geos.length === 0
            ? ''
            : `, markets ${heat.geos
                  .map((geo) => {
                      return geo.geo;
                  })
                  .join(', ')}`;

    return `${date} — ${DAY_HEAT_LABEL[heat.state]} — team ${profit}, ROI ${pct(heat.roi)}${markets}`;
}

// The day's markets, as flags, ALL of them: a day run in six markets is a different day from one run
// in two, and a truncated row hid exactly that. They wrap, and the cell grows to hold them — the
// width is what has to stay fixed, not the height.
//
// The code is dropped here and only here — there is no room for it at this size — and every market
// the flags stand for is spelled out in the cell's own label and again in the day it opens.
function GeoFlags({ geos }: { geos: RosterGeoProfit[] }) {
    return (
        <span aria-hidden={true} className="flex flex-wrap items-center gap-x-0.5 text-[0.7rem] leading-tight">
            {geos.map((geo) => {
                return <span key={geo.geo}>{flagEmoji(geo.geo)}</span>;
            })}
        </span>
    );
}

// The app's day cell, repainted. It is NOT `CalendarDayButton`: that one fills the selected day with
// the accent, which is the one thing this grid cannot afford — the fill is the data. Selection is an
// outline here, so the day being read still says what the team made on it.
function HeatDayButton({ className, day, modifiers, ...props }: CalendarDayButtonProps) {
    const heatByDate = useSafeContext(DayHeatContext);

    // Roving focus lives in DayPicker's state, not the DOM: it flags the focused day and the button
    // has to pull focus itself, otherwise arrow-key navigation moves the highlight but not the caret.
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(function focusDay() {
        if (modifiers.focused) {
            ref.current?.focus();
        }
    });

    const iso = toISODate(day.date) ?? '';
    const heat = heatByDate.get(iso);
    const state = heat?.state ?? 'future';
    const name = heatName(iso, heat);
    // The two figures the colour was decided from. A day is red on the SIGN of the team's profit and
    // green on the MAGNITUDE of its ROI, so printing both is printing the reason: a reader can see
    // that an amber day made money and simply not enough of it, without opening anything.
    const graded = heat && heat.state !== 'future' && heat.state !== 'unreported';

    return (
        <Button
            ref={ref}
            variant="ghost"
            // The square is a colour, so its meaning is written out too — twice over, because a
            // pointer reader gets the title and a screen reader gets the label, and neither of them
            // gets the fill. The title also carries the exact dollars the cell had to shorten.
            aria-label={name}
            title={name}
            className={cn(
                'relative z-10 flex h-full min-h-(--cell-size) w-full min-w-0 flex-col items-stretch justify-start gap-1 rounded-(--cell-radius) border-0 p-1.5 text-left leading-none font-normal tabular-nums motion-safe:transition-[box-shadow] hover:heat-shade',
                DAY_HEAT_CLASS[state],
                // An outline rather than a ring or a fill: it is drawn outside the box, so it neither
                // covers the square's colour nor fights the focus ring for the same box-shadow.
                modifiers.selected && 'outline-accent font-semibold outline-2 outline-offset-1',
                // Today is marked whatever it is painted, and marked differently from the day being
                // read: one says where you are in the month, the other what you are looking at.
                modifiers.today && !modifiers.selected && 'outline-foreground/60 outline',
                className
            )}
            {...props}
        >
            {/* The date rides in the corner rather than in the middle: on a graded day the figure is
                what the reader is scanning for, and a centred number would take the eye first every
                time. It keeps its weight on the days that have nothing else to say. */}
            {/* Top left, on every square: the date is how a reader finds a day in the grid, so it
                must sit in the same place whether the cell carries figures under it or nothing at
                all — the Button's own centring would otherwise park it mid-cell on an empty day. */}
            <span className={cn('self-start text-[0.7rem] leading-none', graded && 'opacity-80')}>
                {day.date.getDate()}
            </span>

            {graded && (
                <span className="flex flex-col gap-0.5 leading-none">
                    {/* The markets sit ABOVE the money rather than beside the ROI: they are the
                        answer to "where did this come from", which is read before the arithmetic
                        under it, and a row of its own is what lets every one of them show. */}
                    <GeoFlags geos={heat.geos} />
                    <span className="truncate text-[0.8rem] font-semibold">
                        {heat.profit === null ? DASH : usdCompactSigned(heat.profit)}
                    </span>
                    {/* The band's own number, quieter than the money it was taken over: ROI is why the
                        square is green rather than amber, and profit is why it is red at all. The
                        markets ride beside it — a day is made or lost in one or two of them, and
                        which ones is the first thing a reader asks after "how much". */}
                    <span className="truncate text-[0.65rem] opacity-80">{pct(heat.roi)}</span>
                </span>
            )}
        </Button>
    );
}

// The month transition. Each value is ONE class name, and it has to stay that way: react-day-picker
// hands these straight to `classList.add`, which rejects a token with a space in it — so the styles
// live in `styles/index.css` rather than being spelled as a string of utilities here.
const MONTH_ANIMATION = {
    // Paging FORWARD: the new month arrives from the right, the old one leaves to the left.
    weeks_after_enter: 'month-enter-right',
    weeks_before_exit: 'month-exit-left',
    // Paging BACK: the same move, mirrored.
    weeks_before_enter: 'month-enter-left',
    weeks_after_exit: 'month-exit-right',
    // The caption only crosses over — a month name sliding out of a box it is centred in reads as a
    // second, competing movement.
    caption_after_enter: 'month-caption-enter',
    caption_before_enter: 'month-caption-enter',
    caption_after_exit: 'month-caption-exit',
    caption_before_exit: 'month-caption-exit',
};

const TRIGGER_FORMAT = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

function DayPicker({ value, today, month, days, onSelect, onMonthChange }: DayPickerProps) {
    const [open, setOpen] = useState(false);

    const selected = parseISODate(value);
    const visibleMonth = parseISODate(month);
    const todayDate = parseISODate(today);

    const heatByDate = new Map(
        days.map((day) => {
            return [day.date, day];
        })
    );

    function selectDay(next: Date) {
        const iso = toISODate(next);

        if (iso) {
            onSelect(iso);
        }

        setOpen(false);
    }

    function changeMonth(next: Date) {
        const iso = toISODate(next);

        if (iso) {
            onMonthChange(iso);
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    // It stands where the header's `meta` used to — the muted line beside the page
                    // name — so it is dressed as that line and not as a form field: no box, no input
                    // chrome, the same `text-sm tabular-nums` the meta slot sets, and a chevron to
                    // say it opens. The outline variant read as a stray text input parked next to an
                    // H1.
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground data-[popup-open]:text-foreground data-[popup-open]:bg-accent/50 -ml-1 gap-1.5 px-1.5 text-sm font-normal"
                    >
                        <CalendarIcon data-icon="inline-start" className="opacity-70" />
                        <span className="tabular-nums">{selected ? TRIGGER_FORMAT.format(selected) : value}</span>
                        {/* Only when it is today, and quieter than the date it qualifies: a reader
                            scanning the header needs to know they are on the live day without the
                            word competing with the date itself. */}
                        {value === today && <span className="text-muted-foreground/70">· today</span>}
                        <ChevronDownIcon data-icon="inline-end" className="opacity-70" />
                    </Button>
                }
            />

            <PopoverContent align="start" className="w-auto p-3">
                <DayHeatContext value={heatByDate}>
                    <Calendar
                        mode="single"
                        // `required`: re-clicking the open day keeps it rather than clearing the
                        // page's day, which is not a state this page has.
                        required
                        selected={selected}
                        month={visibleMonth}
                        today={todayDate}
                        // There is no day after today to read: a Snapshot reports a day that has
                        // happened (ADR-0017), so tomorrow is a square with nothing behind it.
                        disabled={todayDate ? { after: todayDate } : undefined}
                        aria-label="Team month"
                        // Two and a half times the app's default cell, because each square carries
                        // four things — the date, what the team made, the ROI that graded it and the
                        // markets it was made in — and a figure nobody can read is a figure that may
                        // as well not be printed.
                        className="[--cell-size:--spacing(20)]"
                        // The squares are separated in BOTH directions here, unlike the app's other
                        // grids: a heatmap is read as a field of colour, and cells sitting flush turn
                        // a week of green into one bar. The gap is this calendar's alone — the range
                        // pickers need their cells flush, or the selected band breaks into blocks.
                        //
                        // The month nav keeps the SMALL button: `--cell-size` drives it too, and a
                        // 64px chevron reads as the loudest thing on a grid it is only chrome for.
                        // The month slides, and the caption crosses over with it: paging is a move
                        // along one strip of time, and an instant redraw makes the reader check the
                        // caption to find out which way they went.
                        animate
                        classNames={{
                            weekdays: 'flex gap-1',
                            week: 'mt-1 flex w-full items-stretch gap-1',
                            // The cell is fixed at `--cell-size` rather than sized by its contents:
                            // a month holding +$12.3K would otherwise be wider than a month holding
                            // +$120, and the popover would jump every time the reader paged.
                            // Fixed WIDTH, free height: a month holding +$12.3K must be exactly as
                            // wide as one holding +$120, but a day run in six markets is allowed to
                            // be taller than a day run in one. The week row stretches its cells to
                            // the tallest, so a row stays a row.
                            day: 'group/day relative h-auto w-(--cell-size) shrink-0 rounded-(--cell-radius) p-0 text-center select-none',
                            month_caption: 'flex h-8 w-full items-center justify-center px-9',
                            button_previous: cn(
                                buttonVariants({ variant: 'ghost' }),
                                'size-8 p-0 select-none aria-disabled:opacity-50'
                            ),
                            button_next: cn(
                                buttonVariants({ variant: 'ghost' }),
                                'size-8 p-0 select-none aria-disabled:opacity-50'
                            ),
                            ...MONTH_ANIMATION,
                        }}
                        components={{ DayButton: HeatDayButton }}
                        onSelect={selectDay}
                        onMonthChange={changeMonth}
                    />
                </DayHeatContext>
            </PopoverContent>
        </Popover>
    );
}

export { DayPicker };
