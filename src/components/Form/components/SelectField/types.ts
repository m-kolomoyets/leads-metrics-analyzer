export type SelectFieldItem = {
    label: string;
    value: string;
};

export type SelectFieldProps = {
    items: SelectFieldItem[];
    placeholder?: string;
    disabled?: boolean;
};
