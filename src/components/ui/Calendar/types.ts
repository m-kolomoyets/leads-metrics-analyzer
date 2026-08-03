import type { ChevronProps, DayButtonProps, DayPickerProps, RootProps } from 'react-day-picker';
import type { ButtonProps } from '@/components/ui/Button/types';

export type CalendarProps = DayPickerProps & {
    // The Button variant the month-nav arrows borrow, so a Calendar dropped onto a busier surface can
    // quiet them down without the grid being restyled.
    buttonVariant?: ButtonProps['variant'];
};

export type CalendarRootProps = RootProps;
export type CalendarChevronProps = ChevronProps;
export type CalendarDayButtonProps = DayButtonProps;
