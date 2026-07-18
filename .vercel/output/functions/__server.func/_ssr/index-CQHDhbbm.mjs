import { F as FALLBACK_REDIRECT } from './schemas-BFwg8Iyq.mjs';
import { l as loginInputSchema } from './schemas-ELPmZsuS.mjs';
import { j as jsxRuntimeExports } from '../_libs/react.mjs';
import { t as toast } from '../_libs/sonner.mjs';
import { b as useMutation } from '../_libs/tanstack__react-query.mjs';
import { g as getRouteApi, L as Link } from '../_libs/tanstack__react-router.mjs';
import { f as focusFirstError } from './focusFirstError-CtErvujm.mjs';
import { b as Field, a as FieldGroup, F as FieldSet, u as useAppForm } from './index-WZO7W8P4.mjs';
import { B as Button, a as loginMutationOptions, u as useTheme } from './router-BqEFGHsP.mjs';
import './index.mjs';
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
import '../_libs/tanstack__query-core.mjs';
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
import '../_libs/zod.mjs';
import 'node:async_hooks';
import '../_libs/tanstack__react-form.mjs';
import '../_libs/tanstack__form-core.mjs';
import '../_libs/tanstack__store.mjs';
import '../_libs/tanstack__pacer-lite.mjs';
import '../_libs/@tanstack/devtools-event-client+[...].mjs';
import '../_libs/tanstack__react-store.mjs';

const routeApi = getRouteApi('/_unauthenticated/login/');
function LoginForm() {
    const navigate = routeApi.useNavigate();
    const redirectSearch = routeApi.useSearch({
        select({ redirect }) {
            return redirect;
        },
    });
    const { mutateAsync: login } = useMutation(loginMutationOptions());
    const form = useAppForm({
        defaultValues: {
            email: '',
            password: '',
        },
        validators: {
            onSubmit: loginInputSchema,
        },
        async onSubmit({ value, formApi }) {
            await login(value, {
                onSuccess() {
                    navigate({
                        to: redirectSearch || FALLBACK_REDIRECT,
                        replace: true,
                    });
                },
                onError(error) {
                    if (error instanceof Error && error.message) {
                        formApi.setErrorMap({
                            onSubmit: {
                                fields: {
                                    email: { message: error.message },
                                    password: { message: error.message },
                                },
                            },
                        });
                    } else {
                        toast.error('Login failed');
                    }
                },
            });
        },
        onSubmitInvalid({ formApi }) {
            focusFirstError('#login-form', formApi.state.errorMap.onSubmit);
        },
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
        className: 'p-6 md:p-8 w-full max-w-md',
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
                className: 'flex flex-col items-center text-center mb-6',
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx('h1', {
                        className: 'text-2xl font-bold',
                        children: 'Welcome back',
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx('p', {
                        className: 'text-balance text-muted-foreground',
                        children: 'Login to your account',
                    }),
                ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx('form', {
                id: 'login-form',
                noValidate: true,
                onSubmit: (e) => {
                    e.preventDefault();
                    form.handleSubmit();
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(FieldSet, {
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(FieldGroup, {
                        children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(form.AppField, {
                                name: 'email',
                                children: (field) => {
                                    return /* @__PURE__ */ jsxRuntimeExports.jsx(field.FormFieldWrapper, {
                                        label: 'Email',
                                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(field.InputField, {
                                            type: 'email',
                                            placeholder: 'you@example.com',
                                            autoComplete: 'username',
                                        }),
                                    });
                                },
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(form.AppField, {
                                name: 'password',
                                children: (field) => {
                                    return /* @__PURE__ */ jsxRuntimeExports.jsx(field.FormFieldWrapper, {
                                        labelClassName: 'flex items-center justify-between',
                                        label: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                                            children: [
                                                'Password',
                                                ' ',
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
                                                    to: '/login',
                                                    className:
                                                        'ml-auto text-sm underline-offset-2 hover:underline text-foreground rounded-sm outline-none  focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
                                                    children: 'Forgot your password?',
                                                }),
                                            ],
                                        }),
                                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(field.PasswordInputField, {
                                            placeholder: 'Enter password',
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
                                            children: 'Login',
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
function Login() {
    const { isDarkTheme } = useTheme();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
        className: 'grid h-full lg:grid-cols-2',
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
                className: 'relative hidden bg-black dark:bg-white lg:flex flex-col justify-between p-10',
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
                        className: 'outline-hidden focus-visible:outline-ring rounded-md w-fit',
                        to: '/login',
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx('img', {
                            className: 'h-7 w-fi',
                            src: isDarkTheme ? '/images/logo-black.svg' : '/images/logo-white.svg',
                            alt: 'Phenomenon logo',
                        }),
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx('h3', {
                        className: 'text-background text-lg',
                        children: 'Where big ideas meet bold execution',
                    }),
                ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
                className: 'flex flex-col gap-4 p-6 md:p-10',
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
                        className: 'flex flex-col justify-center items-center gap-2 lg:hidden',
                        children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
                                to: '/login',
                                className:
                                    'outline-hidden focus-visible:outline-ring flex items-center gap-2 font-medium rounded-md w-fit',
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx('img', {
                                    className: 'h-7 w-fit',
                                    src: isDarkTheme ? '/images/logo-white.svg' : '/images/logo-black.svg',
                                    alt: 'Phenomenon logo',
                                }),
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx('h3', {
                                className: 'text-md',
                                children: 'Where big ideas meet bold execution',
                            }),
                        ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
                        className: 'flex flex-1 items-center justify-center',
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoginForm, {}),
                    }),
                ],
            }),
        ],
    });
}
const SplitComponent = Login;
export { SplitComponent as component };
