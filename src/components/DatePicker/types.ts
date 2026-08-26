import type { Locale } from '@/components/report/utils/i18n';
import type { PopoverContentProps } from '@/components/ui/Popover/types';

export type DatePickerProps = {
    // The day, as a plain calendar date (YYYY-MM-DD). Same shape the native `type="date"` input
    // carried, so callers keep storing and sending strings — no `Date` leaks past this component.
    value: string;
    onChange: (next: string) => void;
    locale: Locale;
    id?: string;
    disabled?: boolean;
    className?: string;
    align?: PopoverContentProps['align'];
};
