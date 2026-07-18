import {
    I as Input$1,
    G as SelectIcon,
    N as SelectItem$1,
    P as SelectItemIndicator,
    O as SelectItemText,
    L as SelectPopup,
    J as SelectPortal,
    K as SelectPositioner,
    E as SelectRoot,
    F as SelectTrigger$1,
    H as SelectValue$1,
} from '../_libs/base-ui__react.mjs';
import { c as cva } from '../_libs/class-variance-authority.mjs';
import { h as Check, C as ChevronsUpDown } from '../_libs/lucide-react.mjs';
import { j as jsxRuntimeExports, r as reactExports } from '../_libs/react.mjs';
import { c as createFormHook, a as createFormHookContexts } from '../_libs/tanstack__react-form.mjs';
import { c as cn } from './router-BqEFGHsP.mjs';

function Input({ className, type, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Input$1, {
        'data-slot': 'input',
        type,
        className: cn(
            'dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 h-8 rounded-lg border bg-transparent px-2.5 py-1 text-base motion-safe:transition-colors file:h-6 file:text-sm file:font-medium aria-invalid:ring-3 md:text-sm w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            className
        ),
        ...props,
    });
}
const { fieldContext, formContext, useFieldContext } = createFormHookContexts();
const getFieldErrorMessage = (errors) => {
    if (!errors || errors.length === 0) {
        return void 0;
    }
    for (const error of errors) {
        if (!error) {
            continue;
        }
        if (typeof error === 'string') {
            return error;
        }
        if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
            return error.message;
        }
        if (Array.isArray(error)) {
            const nested = getFieldErrorMessage(error);
            if (nested) {
                return nested;
            }
        }
    }
    return void 0;
};
function Label({ className, htmlFor, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('label', {
        className: cn(
            'gap-2 text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed',
            className
        ),
        htmlFor,
        ...props,
    });
}
const fieldVariants = cva('data-[invalid=true]:text-destructive gap-2 group/field flex w-full', {
    variants: {
        orientation: {
            vertical: 'flex-col *:w-full [&>.sr-only]:w-auto',
            horizontal:
                'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
            responsive:
                'flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        },
    },
    defaultVariants: {
        orientation: 'vertical',
    },
});
function FieldSet({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('fieldset', {
        'data-slot': 'field-set',
        className: cn(
            'gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3 flex flex-col',
            className
        ),
        ...props,
    });
}
function FieldGroup({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
        'data-slot': 'field-group',
        className: cn(
            'gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4 group/field-group @container/field-group flex w-full flex-col',
            className
        ),
        ...props,
    });
}
function Field({ className, orientation = 'vertical', ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
        role: 'group',
        'data-slot': 'field',
        'data-orientation': orientation,
        className: cn(fieldVariants({ orientation }), className),
        ...props,
    });
}
function FieldLabel({ className, htmlFor, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Label, {
        'data-slot': 'field-label',
        className: cn(
            'has-data-checked:bg-primary/5 has-data-checked:border-primary/30 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 gap-2 group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5 group/field-label peer/field-label flex w-fit leading-snug',
            'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
            className
        ),
        htmlFor,
        ...props,
    });
}
function FieldError({ className, children, errors, ...props }) {
    let content = null;
    if (children) {
        content = children;
    } else if (!errors) {
        content = null;
    } else if (errors?.length === 1 && errors[0]?.message) {
        content = errors[0].message;
    } else {
        content = /* @__PURE__ */ jsxRuntimeExports.jsx('ul', {
            className: 'ml-4 flex list-disc flex-col gap-1',
            children: errors.map((error, index) => {
                return error?.message
                    ? /* @__PURE__ */ jsxRuntimeExports.jsx('li', { children: error.message }, index)
                    : null;
            }),
        });
    }
    if (!content) {
        return null;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
        role: 'alert',
        'data-slot': 'field-error',
        className: cn('text-destructive text-sm font-normal', className),
        ...props,
        children: content,
    });
}
function FormFieldWrapper({ className, label, labelClassName, children }) {
    const field = useFieldContext();
    const fieldErrorMessage = getFieldErrorMessage(field.state.meta.errors);
    const isInvalid = !!fieldErrorMessage;
    const id = `${field.name}${field.form.formId}`;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, {
        className,
        'data-invalid': isInvalid,
        children: [
            !!label &&
                /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, {
                    className: labelClassName,
                    htmlFor: id,
                    children: label,
                }),
            children,
            isInvalid && /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { children: fieldErrorMessage }),
        ],
    });
}
function InputField({ onChange, onBlur, ...props }) {
    const field = useFieldContext();
    const fieldErrorMessage = getFieldErrorMessage(field.state.meta.errors);
    const id = `${field.name}${field.form.formId}`;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
        id,
        name: field.name,
        'aria-invalid': !!fieldErrorMessage,
        value: field.state.value ?? '',
        onChange: (e) => {
            field.handleChange(e.target.value);
            onChange?.(e);
        },
        onBlur: (e) => {
            field.handleBlur();
            onBlur?.(e);
        },
        ...props,
    });
}
const Select = SelectRoot;
function SelectTrigger({ className, children, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger$1, {
        'data-slot': 'select-trigger',
        className: cn(
            'dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 flex h-8 w-full min-w-0 items-center justify-between gap-2 rounded-lg border bg-transparent px-2.5 py-1 text-base outline-none motion-safe:transition-colors md:text-sm aria-invalid:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate',
            className
        ),
        ...props,
        children: [
            children,
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectIcon, {
                className: 'text-muted-foreground shrink-0',
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: 'size-3.5' }),
            }),
        ],
    });
}
function SelectValue({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue$1, {
        'data-slot': 'select-value',
        className: cn('data-[empty]:text-muted-foreground', className),
        ...props,
    });
}
function SelectContent({ className, children, positionerProps, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectPortal, {
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectPositioner, {
            sideOffset: 4,
            className: 'z-50 outline-none',
            ...positionerProps,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectPopup, {
                'data-slot': 'select-content',
                className: cn(
                    'bg-popover text-popover-foreground border-border max-h-[min(24rem,var(--available-height))] min-w-[var(--anchor-width)] overflow-y-auto rounded-lg border p-1 shadow-md outline-none',
                    className
                ),
                ...props,
                children,
            }),
        }),
    });
}
function SelectItem({ className, children, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem$1, {
        'data-slot': 'select-item',
        className: cn(
            'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default select-none items-center gap-2 rounded-md py-1.5 pl-2 pr-8 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            className
        ),
        ...props,
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemText, { children }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemIndicator, {
                className: 'absolute right-2 flex items-center',
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: 'size-4' }),
            }),
        ],
    });
}
function SelectField({ items, placeholder, disabled }) {
    const field = useFieldContext();
    const fieldErrorMessage = getFieldErrorMessage(field.state.meta.errors);
    const id = `${field.name}${field.form.formId}`;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, {
        items,
        value: field.state.value,
        onValueChange: (value) => {
            field.handleChange(value);
        },
        disabled,
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, {
                id,
                name: field.name,
                'aria-invalid': !!fieldErrorMessage,
                onBlur: field.handleBlur,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder }),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, {
                children: items.map((item) => {
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectItem,
                        { value: item.value, children: item.label },
                        item.value
                    );
                }),
            }),
        ],
    });
}
const PasswordInputField = reactExports.lazy(async () => {
    const res = await import('./index-Cp3l8Ukc.mjs');
    return {
        default: res.PasswordInputField,
    };
});
const { useAppForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        FormFieldWrapper,
        InputField,
        PasswordInputField,
        SelectField,
    },
    formComponents: {},
});
export {
    FieldSet as F,
    Input as I,
    FieldGroup as a,
    Field as b,
    useFieldContext as c,
    getFieldErrorMessage as g,
    useAppForm as u,
};
