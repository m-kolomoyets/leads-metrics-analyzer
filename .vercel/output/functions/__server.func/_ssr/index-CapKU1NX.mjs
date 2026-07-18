import { j as jsxRuntimeExports } from '../_libs/react.mjs';
import { g as getRouteApi, L as Link } from '../_libs/tanstack__react-router.mjs';
import { B as Button } from './router-BqEFGHsP.mjs';
import '../_libs/sonner.mjs';
import './schemas-BFwg8Iyq.mjs';
import './index.mjs';
import './schemas-ELPmZsuS.mjs';
import { a as LayoutDashboard, g as LogIn } from '../_libs/lucide-react.mjs';
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
import '../_libs/tanstack__react-query.mjs';
import '../_libs/clsx.mjs';
import '../_libs/tailwind-merge.mjs';
import '../_libs/class-variance-authority.mjs';
import '../_libs/ky.mjs';
import '../_libs/react-hookz__web.mjs';
import '../_libs/base-ui__react.mjs';
import '../_libs/base-ui__utils.mjs';
import '../_libs/use-sync-external-store.mjs';
import '../_libs/floating-ui__utils.mjs';
import '../_libs/floating-ui__dom.mjs';
import '../_libs/floating-ui__core.mjs';
import '../_libs/floating-ui__react-dom.mjs';
import '../_libs/zod.mjs';
import 'node:async_hooks';

const routeApi = getRouteApi('/_public/');
function Home() {
    const isAuthenticated = routeApi.useRouteContext({
        select(context) {
            return context.auth.isAuthenticated;
        },
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx('main', {
        className: 'min-h-screen bg-linear-to-br from-background via-background to-muted/30',
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs('section', {
            className: 'relative overflow-hidden',
            children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
                    className:
                        'absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:mask-[linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]',
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
                    className: 'relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8',
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
                        className: 'mx-auto max-w-4xl text-center',
                        children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs('div', {
                                className: 'flex justify-center mb-12',
                                children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx('img', {
                                        src: '/images/logo-black.svg',
                                        alt: 'Phenomenon Logo',
                                        className: 'h-16 w-auto dark:hidden',
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx('img', {
                                        src: '/images/logo-white.svg',
                                        alt: 'Phenomenon Logo',
                                        className: 'h-16 w-auto hidden dark:block',
                                    }),
                                ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs('h1', {
                                className: 'text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl',
                                children: [
                                    'Welcome to the',
                                    /* @__PURE__ */ jsxRuntimeExports.jsx('span', {
                                        className:
                                            'block bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent',
                                        children: 'Template Admin Panel',
                                    }),
                                ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
                                className: 'mt-8 max-w-4xl mx-auto',
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx('p', {
                                    className: 'text-xl leading-8 text-muted-foreground mb-8',
                                    children:
                                        'Vite, React, TypeScript, Tailwind CSS, Shadcn/ui, TanStack Router, TanStack Query, Ky, TansTack Form, Zod, Lucide Icons',
                                }),
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx('div', {
                                className: 'mt-12 flex flex-col sm:flex-row items-center justify-center gap-4',
                                children: isAuthenticated
                                    ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                                          variant: 'outline',
                                          size: 'lg',
                                          className: 'px-8 py-4 text-lg font-semibold',
                                          nativeButton: false,
                                          render: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, {
                                              to: '/dashboard',
                                              children: [
                                                  'Dashboard',
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, {
                                                      className: 'ml-2 h-5 w-5',
                                                  }),
                                              ],
                                          }),
                                      })
                                    : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, {
                                          size: 'lg',
                                          className: 'group px-8 py-4 text-lg font-semibold',
                                          nativeButton: false,
                                          render: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, {
                                              to: '/login',
                                              children: [
                                                  'Login',
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, {
                                                      className: 'ml-2 h-5 w-5',
                                                  }),
                                              ],
                                          }),
                                      }),
                            }),
                        ],
                    }),
                }),
            ],
        }),
    });
}
const SplitComponent = Home;
export { SplitComponent as component };
