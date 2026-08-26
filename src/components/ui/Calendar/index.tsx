import type { CalendarChevronProps, CalendarDayButtonProps, CalendarProps, CalendarRootProps } from './types';
import { useEffect, useRef } from 'react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import { cn } from '@/lib/utils/cn';
import { Button, buttonVariants } from '@/components/ui/Button';

// The day grid — react-day-picker's headless DayPicker wearing the app's tokens. Every visual
// decision here is a class on a DayPicker slot, so the picker inherits the theme (light/dark, radius,
// accent) instead of shipping its own stylesheet: `react-day-picker/style.css` is deliberately NOT
// imported.

// The nav arrows and each day cell are real Buttons, so focus rings, hover and disabled states are
// the ones the rest of the app already uses.
function CalendarRoot({ className, rootRef, ...props }: CalendarRootProps) {
    return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
}

function CalendarChevron({ className, orientation, ...props }: CalendarChevronProps) {
    if (orientation === 'left') {
        return <ChevronLeftIcon className={cn('size-4', className)} {...props} />;
    }

    if (orientation === 'right') {
        return <ChevronRightIcon className={cn('size-4', className)} {...props} />;
    }

    return <ChevronDownIcon className={cn('size-4', className)} {...props} />;
}

function CalendarDayButton({ className, day, modifiers, ...props }: CalendarDayButtonProps) {
    const defaultClassNames = getDefaultClassNames();

    // Roving focus lives in DayPicker's state, not the DOM: it flags the focused day and the button
    // has to pull focus itself, otherwise arrow-key navigation moves the highlight but not the caret.
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(function focusDay() {
        if (modifiers.focused) {
            ref.current?.focus();
        }
    });

    return (
        <Button
            ref={ref}
            variant="ghost"
            size="icon"
            data-day={day.date.toISOString().slice(0, 10)}
            // A lone selected day is styled like a range edge; splitting the flags lets the two edges
            // carry the solid accent while the days between them keep only a wash of it.
            data-selected-single={
                modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle
            }
            data-range-start={modifiers.range_start}
            data-range-end={modifiers.range_end}
            data-range-middle={modifiers.range_middle}
            className={cn(
                'data-[range-end=true]:bg-accent data-[range-start=true]:bg-accent data-[selected-single=true]:bg-accent data-[range-end=true]:text-accent-foreground data-[range-start=true]:text-accent-foreground data-[selected-single=true]:text-accent-foreground relative z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-transparent',
                defaultClassNames.day,
                className
            )}
            {...props}
        />
    );
}

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    captionLayout = 'label',
    buttonVariant = 'ghost',
    components,
    ...props
}: CalendarProps) {
    const defaultClassNames = getDefaultClassNames();

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            captionLayout={captionLayout}
            className={cn('group/calendar [--cell-size:--spacing(8)] p-1 [--cell-radius:var(--radius-md)]', className)}
            classNames={{
                root: cn('w-fit', defaultClassNames.root),
                months: cn('relative flex flex-col gap-4 md:flex-row', defaultClassNames.months),
                month: cn('flex w-full flex-col gap-3', defaultClassNames.month),
                nav: cn(
                    'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
                    defaultClassNames.nav
                ),
                button_previous: cn(
                    buttonVariants({ variant: buttonVariant }),
                    'size-(--cell-size) p-0 select-none aria-disabled:opacity-50',
                    defaultClassNames.button_previous
                ),
                button_next: cn(
                    buttonVariants({ variant: buttonVariant }),
                    'size-(--cell-size) p-0 select-none aria-disabled:opacity-50',
                    defaultClassNames.button_next
                ),
                month_caption: cn(
                    'flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)',
                    defaultClassNames.month_caption
                ),
                dropdowns: cn(
                    'flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium',
                    defaultClassNames.dropdowns
                ),
                dropdown_root: cn(
                    'border-border focus-ring-within relative rounded-(--cell-radius) border',
                    defaultClassNames.dropdown_root
                ),
                dropdown: cn('bg-popover absolute inset-0 opacity-0', defaultClassNames.dropdown),
                caption_label: cn(
                    'font-medium select-none',
                    captionLayout === 'label'
                        ? 'text-sm'
                        : '[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-(--cell-radius) pr-1 pl-2 text-sm [&>svg]:size-3.5',
                    defaultClassNames.caption_label
                ),
                month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
                weekdays: cn('flex', defaultClassNames.weekdays),
                weekday: cn(
                    'text-muted-foreground flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal select-none',
                    defaultClassNames.weekday
                ),
                week: cn('mt-1 flex w-full', defaultClassNames.week),
                week_number_header: cn('w-(--cell-size) select-none', defaultClassNames.week_number_header),
                week_number: cn('text-muted-foreground text-[0.8rem] select-none', defaultClassNames.week_number),
                day: cn(
                    'group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none',
                    defaultClassNames.day
                ),
                // The band is painted by the CELLS, not the buttons: the cells sit flush in the week
                // row, so a tinted cell run reads as one continuous stripe from the first day to the
                // last. The edge cells keep the tint too — it runs under their accent button and out
                // to the neighbouring day, instead of leaving a notch at each end.
                range_start: cn('bg-accent/15 rounded-r-none', defaultClassNames.range_start),
                range_middle: cn('bg-accent/15 rounded-none', defaultClassNames.range_middle),
                range_end: cn('bg-accent/15 rounded-l-none', defaultClassNames.range_end),
                today: cn(
                    'text-primary rounded-(--cell-radius) font-medium underline underline-offset-4 data-[selected=true]:no-underline',
                    defaultClassNames.today
                ),
                outside: cn('text-muted-foreground opacity-60', defaultClassNames.outside),
                disabled: cn('text-muted-foreground opacity-50', defaultClassNames.disabled),
                hidden: cn('invisible', defaultClassNames.hidden),
                ...classNames,
            }}
            components={{
                Root: CalendarRoot,
                Chevron: CalendarChevron,
                DayButton: CalendarDayButton,
                ...components,
            }}
            {...props}
        />
    );
}

export { Calendar, CalendarDayButton };
