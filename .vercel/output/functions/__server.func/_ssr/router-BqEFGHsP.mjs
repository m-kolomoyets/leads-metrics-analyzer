import {
    C as COMMON_ERROR_MESSAGE,
    c as createTeamInputSchema,
    a as createUserInputSchema,
    d as deleteTeamInputSchema,
    b as deleteUserInputSchema,
    F as FALLBACK_REDIRECT,
    L as LS_THEME_KEY,
    r as resendInvitationInputSchema,
    R as ROLES_IDS,
    e as updateTeamInputSchema,
    u as updateTeamLeadInputSchema,
    f as updateUserInputSchema,
} from './schemas-BFwg8Iyq.mjs';
import { a as activateInputSchema, l as loginInputSchema } from './schemas-ELPmZsuS.mjs';
import {
    B as Button$1,
    e as TooltipArrow,
    d as TooltipPopup,
    b as TooltipPortal,
    c as TooltipPositioner,
    T as TooltipProvider$1,
    a as TooltipRoot,
    f as TooltipTrigger$1,
} from '../_libs/base-ui__react.mjs';
import { c as cva } from '../_libs/class-variance-authority.mjs';
import { c as clsx } from '../_libs/clsx.mjs';
import { i as isHTTPError } from '../_libs/ky.mjs';
import {
    F as FileSearch,
    H as House,
    L as LoaderCircle,
    O as OctagonX,
    R as RotateCcw,
} from '../_libs/lucide-react.mjs';
import { a as useLocalStorageValue, u as useMediaQuery } from '../_libs/react-hookz__web.mjs';
import { j as jsxRuntimeExports, r as reactExports } from '../_libs/react.mjs';
import { t as toast, T as Toaster } from '../_libs/sonner.mjs';
import { t as twMerge } from '../_libs/tailwind-merge.mjs';
import { c as QueryCache, b as QueryClient } from '../_libs/tanstack__query-core.mjs';
import {
    m as mutationOptions,
    Q as QueryClientProvider,
    q as queryOptions,
    u as useQueryErrorResetBoundary,
} from '../_libs/tanstack__react-query.mjs';
import {
    b as createFileRoute,
    a as createRootRouteWithContext,
    c as createRouter,
    H as HeadContent,
    l as lazyRouteComponent,
    L as Link,
    O as Outlet,
    S as Scripts,
    u as useRouter,
} from '../_libs/tanstack__react-router.mjs';
import { o as isRedirect, n as notFound, C as redirect } from '../_libs/tanstack__router-core.mjs';
import { o as object, s as string } from '../_libs/zod.mjs';
import { a as createServerFn, b as createSsrRpc } from './index.mjs';
import '../_libs/react-dom.mjs';
import 'util';
import 'async_hooks';
import 'crypto';
import 'stream';
import 'node:stream';
import '../_libs/isbot.mjs';
import '../_libs/tanstack__history.mjs';
import 'node:stream/web';
import 'node:async_hooks';
import '../_libs/base-ui__utils.mjs';
import '../_libs/use-sync-external-store.mjs';
import '../_libs/floating-ui__utils.mjs';
import '../_libs/floating-ui__dom.mjs';
import '../_libs/floating-ui__core.mjs';
import '../_libs/floating-ui__react-dom.mjs';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
            throwOnError: true,
        },
        mutations: {
            retry: false,
        },
    },
    queryCache: new QueryCache({
        onError(error, query) {
            const hasQueryData = query.state.data !== void 0;
            if (hasQueryData && isHTTPError(error) && error.data !== void 0) {
                const message = typeof error.data === 'string' ? error.data : error.data.message;
                toast.error(message || error.message);
            } else if (hasQueryData && error instanceof Error) {
                toast.error(error?.message || COMMON_ERROR_MESSAGE);
            }
        },
    }),
});
const noopReturnNull = () => {
    return null;
};
const disableTransitionsTemporarily = () => {
    const style = document.createElement('style');
    style.appendChild(
        document.createTextNode(`*,*::before,*::after{-webkit-transition:none!important;transition:none!important}`)
    );
    document.head.appendChild(style);
    return () => {
        window.getComputedStyle(document.body);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                style.remove();
            });
        });
    };
};
const useSafeContext = (contextObject) => {
    const context = reactExports.use(contextObject);
    if (!contextObject.displayName) {
        throw new Error('Context.displayName is not set, it must be set for useSafeContext');
    }
    if (context === void 0) {
        const contextName = contextObject.displayName.split('Context')[0];
        throw new TypeError(`use${contextName}Context must be used within a ${contextName}Provider`);
    }
    return context;
};
const ThemeProviderContext = reactExports.createContext({});
ThemeProviderContext.displayName = 'ThemeProviderContext';
function ThemeProvider({ children, defaultTheme = 'system', storageKey = LS_THEME_KEY }) {
    const { value: themeLocalStorageValue, set: setThemeLocalStorageValue } = useLocalStorageValue(storageKey, {
        defaultValue: defaultTheme,
    });
    const isPrefersDarkTheme = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = themeLocalStorageValue ?? defaultTheme;
    const isDarkTheme = (theme === 'system' && isPrefersDarkTheme) || theme === 'dark';
    reactExports.useLayoutEffect(
        function setTheme() {
            const root = window.document.documentElement;
            const restoreTransitions = disableTransitionsTemporarily();
            root.classList.remove('light', 'dark');
            if (
                themeLocalStorageValue === 'system' ||
                (themeLocalStorageValue !== 'dark' && themeLocalStorageValue !== 'light')
            ) {
                root.classList.add(isPrefersDarkTheme ? 'dark' : 'light');
            } else {
                root.classList.add(themeLocalStorageValue);
            }
            restoreTransitions();
        },
        [themeLocalStorageValue, isPrefersDarkTheme, defaultTheme]
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeProviderContext, {
        value: {
            theme,
            setTheme: setThemeLocalStorageValue,
            isPrefersDarkTheme,
            isDarkTheme,
        },
        children,
    });
}
const useTheme = () => {
    const context = useSafeContext(ThemeProviderContext);
    return context;
};
const useRemoveInitialStyle = () => {
    reactExports.useLayoutEffect(function removeInitialStyle() {
        document.getElementById('initial-style')?.remove();
    }, []);
};
const cn = (...inputs) => {
    return twMerge(clsx(inputs));
};
function Toast({ className, style, ...props }) {
    const { theme } = useTheme();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {
        ...props,
        theme,
        className: cn('group/toast', className),
        style: {
            ...style,
            '--normal-bg': 'var(--popover)',
            '--normal-text': 'var(--popover-foreground)',
            '--normal-border': 'var(--border)',
        },
    });
}
function TooltipProvider({ delay = 0, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider$1, {
        'data-slot': 'tooltip-provider',
        delay,
        ...props,
    });
}
function Tooltip(props) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipRoot, { 'data-slot': 'tooltip', ...props });
}
function TooltipTrigger(props) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger$1, { 'data-slot': 'tooltip-trigger', ...props });
}
function TooltipContent({
    className,
    side = 'top',
    sideOffset = 8,
    align = 'center',
    alignOffset = 0,
    children,
    ...props
}) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipPortal, {
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipPositioner, {
            align,
            alignOffset,
            side,
            sideOffset,
            className: 'isolate',
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TooltipPopup, {
                'data-slot': 'tooltip-content',
                className: cn(
                    'motion-safe:data-open:animate-in motion-safe:data-open:fade-in-0 motion-safe:data-open:zoom-in-95 motion-safe:data-[state=delayed-open]:animate-in motion-safe:data-[state=delayed-open]:fade-in-0 motion-safe:data-[state=delayed-open]:zoom-in-95 motion-safe:data-closed:animate-out motion-safe:data-closed:fade-out-0 motion-safe:data-closed:zoom-out-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs has-data-[slot=kbd]:pr-1.5 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm motion-safe:data-[side=inline-start]:slide-in-from-right-2 motion-safe:data-[side=inline-end]:slide-in-from-left-2 w-fit max-w-xs origin-(--transform-origin) bg-foreground text-background',
                    className
                ),
                ...props,
                children: [
                    children,
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipArrow, {
                        className:
                            'size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-xs data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5',
                    }),
                ],
            }),
        }),
    });
}
const THEME_SCRIPT = `
(() => {
    const themeLocalStorageValue = window.localStorage.getItem("<appName>_ADMIN_Theme");
    const isPrefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (
        themeLocalStorageValue === "system" ||
        (themeLocalStorageValue !== "dark" && themeLocalStorageValue !== "light")
    ) {
        root.classList.add(isPrefersDarkTheme ? "dark" : "light");
    } else {
        root.classList.add(themeLocalStorageValue);
    }
})();
`;
const INITIAL_STYLE = `
:root { --initial-bg: rgb(255 255 255); }
html.dark { --initial-bg: rgb(25 25 26); }
html { font-family: "Geist", sans-serif; }
body { background-color: var(--initial-bg); margin: 0; position: relative; }
`;
const TanStackRouterDevtools = noopReturnNull;
const TanStackQueryDevtools = noopReturnNull;
const Route$a = createRootRouteWithContext()({
    head() {
        return {
            meta: [
                { charSet: 'utf-8' },
                { name: 'format-detection', content: 'telephone=no' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
                { name: 'color-scheme', content: 'light dark' },
                { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
                { name: 'theme-color', content: '#19191a', media: '(prefers-color-scheme: dark)' },
                { title: 'Phenomenon Studio Admin Panel' },
            ],
            links: [
                { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
                { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
                { rel: 'apple-touch-icon', href: '/apple-icon.png' },
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap',
                },
            ],
        };
    },
    shellComponent: RootDocument,
    component: RootComponent,
});
function RootDocument({ children }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs('html', {
        lang: 'en',
        className: 'font-sans',
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs('head', {
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx('script', {
                        dangerouslySetInnerHTML: { __html: THEME_SCRIPT },
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx('style', {
                        id: 'initial-style',
                        dangerouslySetInnerHTML: { __html: INITIAL_STYLE },
                    }),
                ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs('body', {
                className: 'text-foreground bg-background antialiased relative',
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
                        id: 'root',
                        className: 'flex flex-col h-dvh isolate',
                        children,
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {}),
                ],
            }),
        ],
    });
}
function RootComponent() {
    useRemoveInitialStyle();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, {
        client: queryClient,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ThemeProvider, {
            children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TooltipProvider, {
                    children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, {
                            richColors: true,
                            closeButton: true,
                            swipeDirections: ['bottom'],
                        }),
                    ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Suspense, {
                    children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TanStackRouterDevtools, { position: 'bottom-right' }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TanStackQueryDevtools, { position: 'bottom' }),
                    ],
                }),
            ],
        }),
    });
}
const loginFn = createServerFn({
    method: 'POST',
})
    .inputValidator(loginInputSchema)
    .handler(createSsrRpc('ebfc11faca05eae0aa69ac0fed4d252bd151c9caf5e3b97f56c115ee04adcf98'));
const activateFn = createServerFn({
    method: 'POST',
})
    .inputValidator(activateInputSchema)
    .handler(createSsrRpc('de679316d5ed59ce667549d45bf242b425b91745d24de4534c58ef303c01d680'));
const logoutFn = createServerFn({
    method: 'POST',
}).handler(createSsrRpc('541821caf8acb648a6880b1dd1a4064ae0cde067de0c012d4e72e79439c9d1a3'));
const meFn = createServerFn({
    method: 'GET',
}).handler(createSsrRpc('61e62bee5fe070e3d3451243793279e26aa2ea6e59850d90ff70cb33d287d148'));
const authKeys = {
    all: ['auth'],
    meQueryKey() {
        return [...authKeys.all, 'me'];
    },
    loginMutationKey() {
        return [...authKeys.all, 'login'];
    },
    activateMutationKey() {
        return [...authKeys.all, 'activate'];
    },
    logoutMutationKey() {
        return [...authKeys.all, 'logout'];
    },
};
const meQueryOptions = () => {
    return queryOptions({
        queryKey: authKeys.meQueryKey(),
        queryFn() {
            return meFn();
        },
        // staleTime 0: route guards revalidate the session on every navigation, so a revoked
        // session (deleted row / disabled user) takes effect on the next request, not up to a
        // minute later. The httpOnly cookie makes the server round-trip cheap.
        staleTime: 0,
    });
};
const loginMutationOptions = () => {
    return mutationOptions({
        mutationKey: authKeys.loginMutationKey(),
        mutationFn(data) {
            return loginFn({ data });
        },
        onSuccess(data, _variables, _onMutateResult, { client }) {
            client.setQueryData(authKeys.meQueryKey(), data);
        },
    });
};
const activateMutationOptions = () => {
    return mutationOptions({
        mutationKey: authKeys.activateMutationKey(),
        mutationFn(data) {
            return activateFn({ data });
        },
        onSuccess(data, _variables, _onMutateResult, { client }) {
            client.setQueryData(authKeys.meQueryKey(), data);
        },
    });
};
const logoutMutationOptions = () => {
    return mutationOptions({
        mutationKey: authKeys.logoutMutationKey(),
        mutationFn() {
            return logoutFn();
        },
    });
};
const $$splitComponentImporter$9 = () => import('./route-hdlc17Rz.mjs');
const Route$9 = createFileRoute('/_unauthenticated')({
    validateSearch: object({
        // Only accept internal paths ("/…" but not "//…") so a crafted ?redirect=https://evil.com
        // cannot turn login into an open redirect. Anything else falls back to '' (→ dashboard).
        redirect: string()
            .refine((value) => {
                return value.startsWith('/') && !value.startsWith('//');
            })
            .optional()
            .catch(''),
    }),
    async beforeLoad({ context: { queryClient: queryClient2 }, search }) {
        let me = null;
        try {
            me = await queryClient2.ensureQueryData(meQueryOptions());
        } catch {}
        if (me) {
            throw redirect({
                to: search.redirect || FALLBACK_REDIRECT,
                replace: true,
            });
        }
    },
    component: lazyRouteComponent($$splitComponentImporter$9, 'component'),
});
const $$splitComponentImporter$8 = () => import('./route-Z4H4OwxA.mjs');
const Route$8 = createFileRoute('/_public')({
    async beforeLoad({ context: { queryClient: queryClient2 } }) {
        try {
            const me = await queryClient2.ensureQueryData(meQueryOptions());
            if (me) {
                return {
                    auth: {
                        me,
                        isAuthenticated: true,
                    },
                };
            }
        } catch {}
        return {
            auth: {
                me: null,
                isAuthenticated: false,
            },
        };
    },
    component: lazyRouteComponent($$splitComponentImporter$8, 'component'),
});
const $$splitComponentImporter$7 = () => import('./route-D1mgaseV.mjs');
const Route$7 = createFileRoute('/_authenticated')({
    async beforeLoad({ context: { queryClient: queryClient2 }, location }) {
        const unauthRedirectOptions = {
            to: '/login',
            search: {
                redirect: location.href,
            },
            replace: true,
        };
        try {
            const me = await queryClient2.ensureQueryData(meQueryOptions());
            if (!me) {
                throw redirect(unauthRedirectOptions);
            }
            return {
                auth: {
                    isAuthenticated: true,
                    me,
                },
            };
        } catch (error) {
            if (isRedirect(error)) {
                throw error;
            }
            throw redirect(unauthRedirectOptions);
        }
    },
    component: lazyRouteComponent($$splitComponentImporter$7, 'component'),
});
const $$splitComponentImporter$6 = () => import('./index-CapKU1NX.mjs');
const Route$6 = createFileRoute('/_public/')({
    component: lazyRouteComponent($$splitComponentImporter$6, 'component'),
});
const $$splitComponentImporter$5 = () => import('./index-CQHDhbbm.mjs');
const Route$5 = createFileRoute('/_unauthenticated/login/')({
    component: lazyRouteComponent($$splitComponentImporter$5, 'component'),
});
const $$splitComponentImporter$4 = () => import('./index-CijZwpRm.mjs');
const Route$4 = createFileRoute('/_unauthenticated/activate/')({
    // The raw invitation token rides in the URL (T4c). Missing/garbage falls back to '' → the form
    // shows the generic "invalid link" state rather than crashing.
    validateSearch: object({
        token: string().optional().catch(''),
    }),
    component: lazyRouteComponent($$splitComponentImporter$4, 'component'),
});
const ROLES_CONFIG = {
    [ROLES_IDS.head]: { id: ROLES_IDS.head, label: 'Head' },
    [ROLES_IDS.teamLead]: { id: ROLES_IDS.teamLead, label: 'Team Lead' },
    [ROLES_IDS.buyer]: { id: ROLES_IDS.buyer, label: 'Buyer' },
    [ROLES_IDS.designer]: { id: ROLES_IDS.designer, label: 'Designer' },
    [ROLES_IDS.bdm]: { id: ROLES_IDS.bdm, label: 'BDM' },
};
const ROLES_PERMISSIONS = {
    // Admin panel (T4b, #6) — Head-only. Mirrors the server-side `requireHead` gate on the admin API.
    admin: {
        view: [ROLES_IDS.head],
    },
    merchants: {
        view: [ROLES_IDS.teamLead, ROLES_IDS.head],
        item: {
            view: [ROLES_IDS.teamLead, ROLES_IDS.head],
            update: [ROLES_IDS.head],
        },
    },
    vouchers: {
        view: [ROLES_IDS.head],
        update: [ROLES_IDS.head],
        item: {
            view: [ROLES_IDS.head],
        },
    },
};
const hasPermissions = (permissionKey, authRole) => {
    const propertiesChain = permissionKey.split('.');
    const clonedRolesPermissions = structuredClone(ROLES_PERMISSIONS);
    const permissions = propertiesChain.reduce((acc, cur) => {
        return acc[cur];
    }, clonedRolesPermissions);
    return Array.isArray(permissions) && permissions.includes(authRole);
};
const checkIsRouteAllowed = (rolePermissionKey, role) => {
    const isAllowed = hasPermissions(rolePermissionKey, role);
    if (!isAllowed) {
        throw notFound();
    }
};
const $$splitComponentImporter$3 = () => import('./index-ClpYK8Z-.mjs');
const Route$3 = createFileRoute('/_authenticated/vouchers/')({
    beforeLoad({ context: { auth } }) {
        checkIsRouteAllowed('vouchers.view', auth.me.role);
    },
    component: lazyRouteComponent($$splitComponentImporter$3, 'component'),
});
const $$splitComponentImporter$2 = () => import('./index-BrMZcFyo.mjs');
const Route$2 = createFileRoute('/_authenticated/merchants/')({
    beforeLoad({ context: { auth } }) {
        checkIsRouteAllowed('merchants.view', auth.me.role);
    },
    component: lazyRouteComponent($$splitComponentImporter$2, 'component'),
});
const $$splitComponentImporter$1 = () => import('./index-DBwyEodQ.mjs');
const Route$1 = createFileRoute('/_authenticated/dashboard/')({
    component: lazyRouteComponent($$splitComponentImporter$1, 'component'),
});
const listUsersFn = createServerFn({
    method: 'GET',
}).handler(createSsrRpc('6d69451eee36ff58fb791cbb4eec0f15e3ea56b6b1cf8d46d959d43547a6fbb3'));
const listTeamsFn = createServerFn({
    method: 'GET',
}).handler(createSsrRpc('45893ca7f6a1a2b0ddd1eab61ee06e5568c27b0977a5c12f1b0e803535312e74'));
const createTeamFn = createServerFn({
    method: 'POST',
})
    .inputValidator(createTeamInputSchema)
    .handler(createSsrRpc('f1629487f63b203d7703bbab0987d78ec5a5fd55b5f1da4a061f8891d9dff976'));
const createUserFn = createServerFn({
    method: 'POST',
})
    .inputValidator(createUserInputSchema)
    .handler(createSsrRpc('234f4cead3236d9dbf1e5435c147da848cc8d58286433eb3fe7f127f9f6cee98'));
const deleteUserFn = createServerFn({
    method: 'POST',
})
    .inputValidator(deleteUserInputSchema)
    .handler(createSsrRpc('11a07940daad52d178b28c761c31f13e0abf489057b0545f01b18e88f37e23e8'));
const resendInvitationFn = createServerFn({
    method: 'POST',
})
    .inputValidator(resendInvitationInputSchema)
    .handler(createSsrRpc('5dae9ea880ac4b6fc903edbb803c9a8f7204127c6bbeded7b8286402673f232d'));
const updateUserFn = createServerFn({
    method: 'POST',
})
    .inputValidator(updateUserInputSchema)
    .handler(createSsrRpc('eed2d0a904899c29f8b6f308600676242b268d9827ca9d37fd051a72a96ab871'));
const updateTeamFn = createServerFn({
    method: 'POST',
})
    .inputValidator(updateTeamInputSchema)
    .handler(createSsrRpc('c9fe8570b6ba7c14cef30cfedd5a8ed7e79b6654992f280c6569c005a92691e1'));
const deleteTeamFn = createServerFn({
    method: 'POST',
})
    .inputValidator(deleteTeamInputSchema)
    .handler(createSsrRpc('c4e96b41d3c28bedef7426fc9a09126d4197153b4285d64558a96b563da0c38a'));
const setTeamLeadFn = createServerFn({
    method: 'POST',
})
    .inputValidator(updateTeamLeadInputSchema)
    .handler(createSsrRpc('ba37af0122d3475dd1b7289425ea54d9ddeecd11372fa2e7f24fbd03f12ddca0'));
const adminKeys = {
    all: ['admin'],
    usersQueryKey() {
        return [...adminKeys.all, 'users'];
    },
    teamsQueryKey() {
        return [...adminKeys.all, 'teams'];
    },
    createUserMutationKey() {
        return [...adminKeys.all, 'create-user'];
    },
    resendInvitationMutationKey() {
        return [...adminKeys.all, 'resend-invitation'];
    },
    updateUserMutationKey() {
        return [...adminKeys.all, 'update-user'];
    },
    deleteUserMutationKey() {
        return [...adminKeys.all, 'delete-user'];
    },
    createTeamMutationKey() {
        return [...adminKeys.all, 'create-team'];
    },
    updateTeamMutationKey() {
        return [...adminKeys.all, 'update-team'];
    },
    deleteTeamMutationKey() {
        return [...adminKeys.all, 'delete-team'];
    },
    setTeamLeadMutationKey() {
        return [...adminKeys.all, 'set-team-lead'];
    },
};
const usersQueryOptions = () => {
    return queryOptions({
        queryKey: adminKeys.usersQueryKey(),
        queryFn() {
            return listUsersFn();
        },
    });
};
const teamsQueryOptions = () => {
    return queryOptions({
        queryKey: adminKeys.teamsQueryKey(),
        queryFn() {
            return listTeamsFn();
        },
    });
};
const createUserMutationOptions = () => {
    return mutationOptions({
        mutationKey: adminKeys.createUserMutationKey(),
        mutationFn(data) {
            return createUserFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: adminKeys.usersQueryKey() });
        },
    });
};
const deleteUserMutationOptions = () => {
    return mutationOptions({
        mutationKey: adminKeys.deleteUserMutationKey(),
        mutationFn(data) {
            return deleteUserFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: adminKeys.usersQueryKey() });
            client.invalidateQueries({ queryKey: adminKeys.teamsQueryKey() });
        },
    });
};
const resendInvitationMutationOptions = () => {
    return mutationOptions({
        mutationKey: adminKeys.resendInvitationMutationKey(),
        mutationFn(data) {
            return resendInvitationFn({ data });
        },
    });
};
const updateUserMutationOptions = () => {
    return mutationOptions({
        mutationKey: adminKeys.updateUserMutationKey(),
        mutationFn(data) {
            return updateUserFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: adminKeys.usersQueryKey() });
        },
    });
};
const createTeamMutationOptions = () => {
    return mutationOptions({
        mutationKey: adminKeys.createTeamMutationKey(),
        mutationFn(data) {
            return createTeamFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: adminKeys.teamsQueryKey() });
        },
    });
};
const updateTeamMutationOptions = () => {
    return mutationOptions({
        mutationKey: adminKeys.updateTeamMutationKey(),
        mutationFn(data) {
            return updateTeamFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: adminKeys.teamsQueryKey() });
        },
    });
};
const deleteTeamMutationOptions = () => {
    return mutationOptions({
        mutationKey: adminKeys.deleteTeamMutationKey(),
        mutationFn(data) {
            return deleteTeamFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: adminKeys.teamsQueryKey() });
            client.invalidateQueries({ queryKey: adminKeys.usersQueryKey() });
        },
    });
};
const setTeamLeadMutationOptions = () => {
    return mutationOptions({
        mutationKey: adminKeys.setTeamLeadMutationKey(),
        mutationFn(data) {
            return setTeamLeadFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: adminKeys.teamsQueryKey() });
            client.invalidateQueries({ queryKey: adminKeys.usersQueryKey() });
        },
    });
};
const $$splitComponentImporter = () => import('./index-C-yW7T8N.mjs');
const Route = createFileRoute('/_authenticated/admin/')({
    // Head-only. Mirrors the server-side `requireHead` gate; a non-Head navigating here 404s.
    beforeLoad({ context: { auth } }) {
        checkIsRouteAllowed('admin.view', auth.me.role);
    },
    async loader({ context: { queryClient: queryClient2 } }) {
        await Promise.all([
            queryClient2.ensureQueryData(usersQueryOptions()),
            queryClient2.ensureQueryData(teamsQueryOptions()),
        ]);
    },
    component: lazyRouteComponent($$splitComponentImporter, 'component'),
});
const UnauthenticatedRouteRoute = Route$9.update({
    id: '/_unauthenticated',
    getParentRoute: () => Route$a,
});
const PublicRouteRoute = Route$8.update({
    id: '/_public',
    getParentRoute: () => Route$a,
});
const AuthenticatedRouteRoute = Route$7.update({
    id: '/_authenticated',
    getParentRoute: () => Route$a,
});
const PublicIndexRoute = Route$6.update({
    id: '/',
    path: '/',
    getParentRoute: () => PublicRouteRoute,
});
const UnauthenticatedLoginIndexRoute = Route$5.update({
    id: '/login/',
    path: '/login/',
    getParentRoute: () => UnauthenticatedRouteRoute,
});
const UnauthenticatedActivateIndexRoute = Route$4.update({
    id: '/activate/',
    path: '/activate/',
    getParentRoute: () => UnauthenticatedRouteRoute,
});
const AuthenticatedVouchersIndexRoute = Route$3.update({
    id: '/vouchers/',
    path: '/vouchers/',
    getParentRoute: () => AuthenticatedRouteRoute,
});
const AuthenticatedMerchantsIndexRoute = Route$2.update({
    id: '/merchants/',
    path: '/merchants/',
    getParentRoute: () => AuthenticatedRouteRoute,
});
const AuthenticatedDashboardIndexRoute = Route$1.update({
    id: '/dashboard/',
    path: '/dashboard/',
    getParentRoute: () => AuthenticatedRouteRoute,
});
const AuthenticatedAdminIndexRoute = Route.update({
    id: '/admin/',
    path: '/admin/',
    getParentRoute: () => AuthenticatedRouteRoute,
});
const AuthenticatedRouteRouteChildren = {
    AuthenticatedAdminIndexRoute,
    AuthenticatedDashboardIndexRoute,
    AuthenticatedMerchantsIndexRoute,
    AuthenticatedVouchersIndexRoute,
};
const AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
const PublicRouteRouteChildren = {
    PublicIndexRoute,
};
const PublicRouteRouteWithChildren = PublicRouteRoute._addFileChildren(PublicRouteRouteChildren);
const UnauthenticatedRouteRouteChildren = {
    UnauthenticatedActivateIndexRoute,
    UnauthenticatedLoginIndexRoute,
};
const UnauthenticatedRouteRouteWithChildren = UnauthenticatedRouteRoute._addFileChildren(
    UnauthenticatedRouteRouteChildren
);
const rootRouteChildren = {
    AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
    PublicRouteRoute: PublicRouteRouteWithChildren,
    UnauthenticatedRouteRoute: UnauthenticatedRouteRouteWithChildren,
};
const routeTree = Route$a._addFileChildren(rootRouteChildren)._addFileTypes();
function Loader({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, {
        className: cn('motion-safe:animate-spin', className),
        ...props,
    });
}
const buttonVariants = cva(
    `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-lg border border-transparent bg-clip-padding text-sm font-medium aria-invalid:ring-3 active:translate-y-px [&_svg:not([class*='size-'])]:size-4 group/button relative inline-flex shrink-0 items-center justify-center whitespace-nowrap motion-safe:transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0`,
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
                outline:
                    'border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground',
                secondary:
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
                ghost: 'hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground',
                destructive:
                    'bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
                xs: `h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3`,
                sm: `h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5`,
                lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
                icon: 'size-8',
                'icon-xs': `size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3`,
                'icon-sm': 'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
                'icon-lg': 'size-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);
function Button({ className, children, variant, size, isLoading, disabled, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Button$1, {
        'data-slot': 'button',
        className: cn(buttonVariants({ variant, size, className })),
        disabled: disabled || isLoading,
        ...props,
        children: isLoading
            ? /* @__PURE__ */ jsxRuntimeExports.jsxs('span', {
                  children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx('span', { className: 'contents invisible', children }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx('span', { className: 'sr-only', children }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx('span', {
                          className: 'flex justify-center items-center absolute inset-0',
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, {}),
                      }),
                  ],
              })
            : children,
    });
}
const emptyMediaVariants = cva(
    'mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default: 'bg-transparent',
                icon: `bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-4`,
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);
function Empty({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
        'data-slot': 'empty',
        className: cn(
            'gap-4 rounded-xl border-dashed p-6 flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance',
            className
        ),
        ...props,
    });
}
function EmptyHeader({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('header', {
        'data-slot': 'empty-header',
        className: cn('gap-2 flex max-w-sm flex-col items-center', className),
        ...props,
    });
}
function EmptyMedia({ className, variant = 'default', ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
        'data-slot': 'empty-icon',
        'data-variant': variant,
        className: cn(emptyMediaVariants({ variant, className })),
        ...props,
    });
}
function EmptyTitle({ className, children, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('h2', {
        'data-slot': 'empty-title',
        className: cn('text-sm font-medium tracking-tight', className),
        ...props,
        children,
    });
}
function EmptyDescription({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('p', {
        'data-slot': 'empty-description',
        className: cn(
            'text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
            className
        ),
        ...props,
    });
}
function EmptyContent({ className, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
        'data-slot': 'empty-content',
        className: cn('gap-2.5 text-sm flex w-full max-w-sm min-w-0 flex-col items-center text-balance', className),
        ...props,
    });
}
function ErrorComponent({ error }) {
    const router2 = useRouter();
    const queryErrorResetBoundary = useQueryErrorResetBoundary();
    reactExports.useEffect(
        function resetErrorBoundary() {
            queryErrorResetBoundary.reset();
        },
        [queryErrorResetBoundary]
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Empty, {
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(EmptyHeader, {
                className: 'max-w-2xl',
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyMedia, {
                        variant: 'icon',
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(OctagonX, {}),
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyTitle, { className: 'text-4xl', children: 'Error' }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyDescription, {
                        className: 'text-xl',
                        children: error.message || COMMON_ERROR_MESSAGE,
                    }),
                ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyContent, {
                className: 'max-w-2xl',
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, {
                    onClick: () => {
                        router2.invalidate();
                    },
                    children: [/* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { 'aria-hidden': true }), 'Retry'],
                }),
            }),
        ],
    });
}
function NotFound() {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Empty, {
        children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(EmptyHeader, {
                className: 'max-w-2xl',
                children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyMedia, {
                        variant: 'icon',
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileSearch, {}),
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyTitle, { className: 'text-4xl', children: '404' }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyDescription, {
                        className: 'text-xl',
                        children: 'Page Not Found',
                    }),
                ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyContent, {
                className: 'max-w-2xl',
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                    nativeButton: false,
                    render: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, {
                        to: '/dashboard',
                        children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(House, { 'aria-hidden': true }),
                            'Go back to the main page',
                        ],
                    }),
                }),
            }),
        ],
    });
}
function getRouter() {
    return createRouter({
        routeTree,
        context: {
            queryClient,
            auth: { isAuthenticated: false, me: null },
        },
        defaultPreload: 'intent',
        defaultPreloadStaleTime: 0,
        scrollRestoration: true,
        defaultPendingMs: 100,
        defaultPendingMinMs: 500,
        defaultNotFoundComponent: NotFound,
        defaultErrorComponent: ErrorComponent,
        defaultPendingComponent() {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { className: 'size-16 m-auto' });
        },
    });
}
const router = /* @__PURE__ */ Object.freeze(
    /* @__PURE__ */ Object.defineProperty(
        {
            __proto__: null,
            getRouter,
        },
        Symbol.toStringTag,
        { value: 'Module' }
    )
);
export {
    Button as B,
    ROLES_CONFIG as R,
    TooltipTrigger as T,
    loginMutationOptions as a,
    activateMutationOptions as b,
    cn as c,
    updateTeamMutationOptions as d,
    deleteTeamMutationOptions as e,
    createTeamMutationOptions as f,
    createUserMutationOptions as g,
    hasPermissions as h,
    updateUserMutationOptions as i,
    deleteUserMutationOptions as j,
    usersQueryOptions as k,
    logoutMutationOptions as l,
    useSafeContext as m,
    Tooltip as n,
    TooltipContent as o,
    router as p,
    resendInvitationMutationOptions as r,
    setTeamLeadMutationOptions as s,
    teamsQueryOptions as t,
    useTheme as u,
};
