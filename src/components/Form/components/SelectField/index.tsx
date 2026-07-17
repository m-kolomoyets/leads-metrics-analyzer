import type { SelectFieldProps } from './types';
import { getFieldErrorMessage } from '@/lib/utils/getFieldErrorMessage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useFieldContext } from '../../context/FormContext';

// TanStack Form field bound to the styled Base UI Select. Value is a string; callers pass a sentinel
// value for "none" options (Select values must be non-empty).
function SelectField({ items, placeholder, disabled }: SelectFieldProps) {
    const field = useFieldContext<string>();
    const fieldErrorMessage = getFieldErrorMessage(field.state.meta.errors);
    const id = `${field.name}${field.form.formId}`;

    return (
        <Select
            items={items}
            value={field.state.value}
            onValueChange={(value) => {
                field.handleChange(value as string);
            }}
            disabled={disabled}
        >
            <SelectTrigger id={id} name={field.name} aria-invalid={!!fieldErrorMessage} onBlur={field.handleBlur}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {items.map((item) => {
                    return (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
}

export { SelectField };
