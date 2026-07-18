import { aT as c, g, L as h, b as m, aU as u } from './index-CATHI92X.js';
import { j as t, c as x } from './vendor-react-1kp2ER4x.js';
import './vendor-zod-D40u6Zl6.js';

const p = g('/_public/');
function b() {
    const e = x.c(7);
    let a;
    e[0] === Symbol.for('react.memo_cache_sentinel')
        ? ((a = {
              select(d) {
                  return d.auth.isAuthenticated;
              },
          }),
          (e[0] = a))
        : (a = e[0]);
    const r = p.useRouteContext(a);
    let s;
    e[1] === Symbol.for('react.memo_cache_sentinel')
        ? ((s = t.jsx('div', {
              className:
                  'absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:mask-[linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]',
          })),
          (e[1] = s))
        : (s = e[1]);
    let l;
    e[2] === Symbol.for('react.memo_cache_sentinel')
        ? ((l = t.jsxs('div', {
              className: 'flex justify-center mb-12',
              children: [
                  t.jsx('img', {
                      src: '/images/logo-black.svg',
                      alt: 'Phenomenon Logo',
                      className: 'h-16 w-auto dark:hidden',
                  }),
                  t.jsx('img', {
                      src: '/images/logo-white.svg',
                      alt: 'Phenomenon Logo',
                      className: 'h-16 w-auto hidden dark:block',
                  }),
              ],
          })),
          (e[2] = l))
        : (l = e[2]);
    let o;
    e[3] === Symbol.for('react.memo_cache_sentinel')
        ? ((o = t.jsxs('h1', {
              className: 'text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl',
              children: [
                  'Welcome to the',
                  t.jsx('span', {
                      className:
                          'block bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent',
                      children: 'Template Admin Panel',
                  }),
              ],
          })),
          (e[3] = o))
        : (o = e[3]);
    let i;
    e[4] === Symbol.for('react.memo_cache_sentinel')
        ? ((i = t.jsx('div', {
              className: 'mt-8 max-w-4xl mx-auto',
              children: t.jsx('p', {
                  className: 'text-xl leading-8 text-muted-foreground mb-8',
                  children:
                      'Vite, React, TypeScript, Tailwind CSS, Shadcn/ui, TanStack Router, TanStack Query, Ky, TansTack Form, Zod, Lucide Icons',
              }),
          })),
          (e[4] = i))
        : (i = e[4]);
    let n;
    return (
        e[5] !== r
            ? ((n = t.jsx('main', {
                  className: 'min-h-screen bg-linear-to-br from-background via-background to-muted/30',
                  children: t.jsxs('section', {
                      className: 'relative overflow-hidden',
                      children: [
                          s,
                          t.jsx('div', {
                              className: 'relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8',
                              children: t.jsxs('div', {
                                  className: 'mx-auto max-w-4xl text-center',
                                  children: [
                                      l,
                                      o,
                                      i,
                                      t.jsx('div', {
                                          className:
                                              'mt-12 flex flex-col sm:flex-row items-center justify-center gap-4',
                                          children: r
                                              ? t.jsx(c, {
                                                    variant: 'outline',
                                                    size: 'lg',
                                                    className: 'px-8 py-4 text-lg font-semibold',
                                                    nativeButton: !1,
                                                    render: t.jsxs(m, {
                                                        to: '/dashboard',
                                                        children: [
                                                            'Dashboard',
                                                            t.jsx(h, { className: 'ml-2 h-5 w-5' }),
                                                        ],
                                                    }),
                                                })
                                              : t.jsx(c, {
                                                    size: 'lg',
                                                    className: 'group px-8 py-4 text-lg font-semibold',
                                                    nativeButton: !1,
                                                    render: t.jsxs(m, {
                                                        to: '/login',
                                                        children: ['Login', t.jsx(u, { className: 'ml-2 h-5 w-5' })],
                                                    }),
                                                }),
                                      }),
                                  ],
                              }),
                          }),
                      ],
                  }),
              })),
              (e[5] = r),
              (e[6] = n))
            : (n = e[6]),
        n
    );
}
const N = b;
export { N as component };
