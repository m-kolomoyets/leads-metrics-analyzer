import { F as FALLBACK_REDIRECT } from './schemas-BFwg8Iyq.mjs';
import { j as jsxRuntimeExports } from '../_libs/react.mjs';
import { t as toast } from '../_libs/sonner.mjs';
import { b as useMutation } from '../_libs/tanstack__react-query.mjs';
import { g as getRouteApi } from '../_libs/tanstack__react-router.mjs';
import { f as focusFirstError } from './focusFirstError-CtErvujm.mjs';
import { b as Field, a as FieldGroup, F as FieldSet, u as useAppForm } from './index-WZO7W8P4.mjs';
import { b as activateMutationOptions, B as Button } from './router-BqEFGHsP.mjs';
import './index.mjs';
import './schemas-ELPmZsuS.mjs';
import { o as object, s as string } from '../_libs/zod.mjs';
import '../_libs/tanstack__query-core.mjs';
import '../_libs/tanstack__router-core.mjs';
import '../_libs/tanstack__history.mjs';
import 'node:stream/web';
import 'node:stream';
import '../_libs/react-dom.mjs';
import 'util';
import 'async_hooks';
import 'crypto';
import 'stream';
import '../_libs/isbot.mjs';
import '../_libs/clsx.mjs';
import '../_libs/tailwind-merge.mjs';
import '../_libs/class-variance-authority.mjs';
import '../_libs/ky.mjs';
import '../_libs/react-hookz__web.mjs';
import '../_libs/lucide-react.mjs';
import '../_libs/base-ui__react.mjs';
import '../_libs/base-ui__utils.mjs';
import '../_libs/use-sync-external-store.mjs';
import '../_libs/floating-ui__utils.mjs';
import '../_libs/floating-ui__dom.mjs';
import '../_libs/floating-ui__core.mjs';
import '../_libs/floating-ui__react-dom.mjs';
import 'node:async_hooks';
import '../_libs/tanstack__react-form.mjs';
import '../_libs/tanstack__form-core.mjs';
import '../_libs/tanstack__store.mjs';
import '../_libs/tanstack__pacer-lite.mjs';
import '../_libs/@tanstack/devtools-event-client+[...].mjs';
import '../_libs/tanstack__react-store.mjs';

const activateFormSchema = object({
    password: string().min(8, { error: 'Password must be at least 8 characters' }),
    confirmPassword: string().min(1, { error: 'Please confirm your password' }),
}).refine(
    (value) => {
        return value.password === value.confirmPassword;
    },
    { error: 'Passwords do not match', path: ['confirmPassword'] }
);
const routeApi = getRouteApi('/_unauthenticated/activate/');
function ActivateForm() {
    const navigate = routeApi.useNavigate();
    const token = routeApi.useSearch({
        select({ token: value }) {
            return value;
        },
    });
    const { mutateAsync: activate } = useMutation(activateMutationOptions());
    const form = useAppForm({
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
        validators: {
            onSubmit: activateFormSchema,
        },
        async onSubmit({ value, formApi }) {
            await activate(
                { token: token ?? '', password: value.password },
                {
                    onSuccess() {
                        navigate({ to: FALLBACK_REDIRECT, replace: true });
                    },
                    onError(error) {
                        if (error instanceof Error && error.message) {
                            formApi.setErrorMap({
                                onSubmit: { fields: { password: { message: error.message } } },
                            });
                        } else {
                            toast.error('Activation failed');
                        }
                    },
                }
            );
        },
        onSubmitInvalid({ formApi }) {
            focusFirstError('#activate-form', formApi.state.errorMap.onSubmit);
        },
    });
    if (!token) {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
            className: 'w-full max-w-md text-center',
            children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx('h1', {
                    className: 'text-2xl font-bold',
                    children: 'Invalid invitation',
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx('p', {
                    className: 'text-muted-foreground mt-2 text-balance',
                    children: 'This invitation link is invalid or has expired. Ask the Head to send you a new one.',
                }),
            ],
        });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
        className: 'w-full max-w-md p-6 md:p-8',
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
                className: 'mb-6 flex flex-col items-center text-center',
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx('h1', {
                        className: 'text-2xl font-bold',
                        children: 'Set your password',
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx('p', {
                        className: 'text-muted-foreground text-balance',
                        children: 'Choose a password to activate your account',
                    }),
                ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx('form', {
                id: 'activate-form',
                noValidate: true,
                onSubmit: (e) => {
                    e.preventDefault();
                    form.handleSubmit();
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSet, {
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(FieldGroup, {
                        children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(form.AppField, {
                                name: 'password',
                                children: (field) => {
                                    return /* @__PURE__ */ jsxRuntimeExports.jsx(field.FormFieldWrapper, {
                                        label: 'Password',
                                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(field.PasswordInputField, {
                                            placeholder: 'At least 8 characters',
                                            autoComplete: 'new-password',
                                        }),
                                    });
                                },
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(form.AppField, {
                                name: 'confirmPassword',
                                children: (field) => {
                                    return /* @__PURE__ */ jsxRuntimeExports.jsx(field.FormFieldWrapper, {
                                        label: 'Confirm password',
                                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(field.PasswordInputField, {
                                            placeholder: 'Re-enter password',
                                            autoComplete: 'new-password',
                                        }),
                                    });
                                },
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(form.Subscribe, {
                                    selector: (state) => {
                                        return [state.canSubmit, state.isSubmitting];
                                    },
                                    children: ([canSubmit, isSubmitting]) => {
                                        return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                                            type: 'submit',
                                            className: 'w-full',
                                            disabled: !canSubmit,
                                            isLoading: isSubmitting,
                                            children: 'Activate account',
                                        });
                                    },
                                }),
                            }),
                        ],
                    }),
                }),
            }),
        ],
    });
}
function Activate() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
        className: 'flex h-full flex-col items-center justify-center p-6',
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ActivateForm, {}),
    });
}
const SplitComponent = Activate;
export { SplitComponent as component };
