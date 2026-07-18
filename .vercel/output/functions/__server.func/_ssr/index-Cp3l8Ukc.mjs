import { j as jsxRuntimeExports } from '../_libs/react.mjs';
import { g as getFieldErrorMessage, I as Input, c as useFieldContext } from './index-WZO7W8P4.mjs';
import { c as cn } from './router-BqEFGHsP.mjs';
import '../_libs/sonner.mjs';
import './schemas-BFwg8Iyq.mjs';
import './index.mjs';
import './schemas-ELPmZsuS.mjs';
import { k as Eye, E as EyeOff } from '../_libs/lucide-react.mjs';
import { d as useToggle } from '../_libs/react-hookz__web.mjs';
import '../_libs/tanstack__react-form.mjs';
import '../_libs/tanstack__form-core.mjs';
import '../_libs/tanstack__store.mjs';
import '../_libs/tanstack__pacer-lite.mjs';
import '../_libs/@tanstack/devtools-event-client+[...].mjs';
import '../_libs/tanstack__react-store.mjs';
import '../_libs/use-sync-external-store.mjs';
import '../_libs/class-variance-authority.mjs';
import '../_libs/clsx.mjs';
import '../_libs/base-ui__react.mjs';
import '../_libs/base-ui__utils.mjs';
import '../_libs/react-dom.mjs';
import 'util';
import 'async_hooks';
import 'crypto';
import 'stream';
import '../_libs/floating-ui__utils.mjs';
import '../_libs/floating-ui__dom.mjs';
import '../_libs/floating-ui__core.mjs';
import '../_libs/floating-ui__react-dom.mjs';
import '../_libs/tanstack__query-core.mjs';
import '../_libs/tanstack__react-query.mjs';
import '../_libs/tanstack__react-router.mjs';
import '../_libs/tanstack__router-core.mjs';
import '../_libs/tanstack__history.mjs';
import 'node:stream/web';
import 'node:stream';
import '../_libs/isbot.mjs';
import '../_libs/tailwind-merge.mjs';
import '../_libs/ky.mjs';
import '../_libs/zod.mjs';
import 'node:async_hooks';

function PasswordInput({ className, disabled, ...props }) {
    const [isVisible, toggleIsVisible] = useToggle();
    const Icon = isVisible ? EyeOff : Eye;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
        className: 'relative',
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, {
                className: cn('pe-9', className),
                type: isVisible ? 'text' : 'password',
                disabled,
                ...props,
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs('button', {
                className:
                    'absolute inset-y-0 inset-e-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 motion-safe:transition-colors hover:text-foreground focus-visible:z-10 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                type: 'button',
                onClick: toggleIsVisible,
                disabled,
                'aria-pressed': isVisible,
                'aria-controls': 'password',
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 16, strokeWidth: 2, 'aria-hidden': true }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx('span', {
                        className: 'sr-only',
                        children: isVisible ? 'Hide password' : 'Show password',
                    }),
                ],
            }),
        ],
    });
}
function PasswordInputField({ onChange, onBlur, ...props }) {
    const field = useFieldContext();
    const fieldErrorMessage = getFieldErrorMessage(field.state.meta.errors);
    const id = `${field.name}${field.form.formId}`;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordInput, {
        id,
        name: field.name,
        'aria-invalid': !!fieldErrorMessage,
        value: field.state.value,
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
export { PasswordInputField };
