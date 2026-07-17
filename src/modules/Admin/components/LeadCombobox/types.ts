import type { SelectFieldItem } from '@/components/Form/components/SelectField/types';

export type LeadComboboxProps = {
    value: string;
    options: SelectFieldItem[];
    onChange: (value: string) => void;
    disabled?: boolean;
};
