import type { Locale } from '@/components/report/utils/i18n';

export type LocaleSwitchProps = {
    locale: Locale;
    onSelect: (locale: Locale) => void;
};
