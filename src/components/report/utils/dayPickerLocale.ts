import type { DayPickerLocale } from 'react-day-picker';
import type { Locale } from './i18n';
import { enGB, uk } from 'react-day-picker/locale';

// The day grid speaks its own locale bag (month and weekday names). `en-GB` rather than `en-US`: the
// team reads a Monday-first calendar in both languages.
export const DAY_PICKER_LOCALE: Record<Locale, Partial<DayPickerLocale>> = { uk, en: enGB };
