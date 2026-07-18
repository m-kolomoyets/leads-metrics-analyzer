import { f as C } from './focusFirstError-DXrcz5gg.js';
import { g as A, aT as E, aW as I, aL as k, aV as L, aX as T, b as w, aQ as W } from './index-CATHI92X.js';
import { a as D, u as P, F as R, b as V } from './index-CPILwtgz.js';
import { c as _, j as s } from './vendor-react-1kp2ER4x.js';
import { e as M, o as N, s as v } from './vendor-zod-D40u6Zl6.js';
import './getPseudoElementBounds-D7ePV0js.js';
import './useScrollLock-BrgHxV8m.js';

const q = v().min(8, { error: 'Password must be at least 8 characters' });
N({ token: v().min(1, { error: 'Missing invitation token' }), password: q });
const B = N({
        email: v()
            .trim()
            .min(1, { error: 'This field is required' })
            .pipe(M({ error: 'Invalid email' })),
        password: v().min(1, { error: 'This field is required' }),
    }),
    F = A('/_unauthenticated/login/');
function $() {
    const e = _.c(23),
        u = F.useNavigate();
    let n;
    e[0] === Symbol.for('react.memo_cache_sentinel')
        ? ((n = {
              select(p) {
                  const { redirect: b } = p;
                  return b;
              },
          }),
          (e[0] = n))
        : (n = e[0]);
    const r = F.useSearch(n);
    let c;
    e[1] === Symbol.for('react.memo_cache_sentinel') ? ((c = L()), (e[1] = c)) : (c = e[1]);
    const { mutateAsync: a } = k(c);
    let f, l;
    e[2] === Symbol.for('react.memo_cache_sentinel')
        ? ((f = { email: '', password: '' }), (l = { onSubmit: B }), (e[2] = f), (e[3] = l))
        : ((f = e[2]), (l = e[3]));
    let m;
    e[4] !== a || e[5] !== u || e[6] !== r
        ? ((m = {
              defaultValues: f,
              validators: l,
              async onSubmit(p) {
                  const { value: b, formApi: y } = p;
                  await a(b, {
                      onSuccess() {
                          u({ to: r || T, replace: !0 });
                      },
                      onError(S) {
                          S instanceof Error && S.message
                              ? y.setErrorMap({
                                    onSubmit: {
                                        fields: { email: { message: S.message }, password: { message: S.message } },
                                    },
                                })
                              : I.error('Login failed');
                      },
                  });
              },
              onSubmitInvalid(p) {
                  const { formApi: b } = p;
                  C('#login-form', b.state.errorMap.onSubmit);
              },
          }),
          (e[4] = a),
          (e[5] = u),
          (e[6] = r),
          (e[7] = m))
        : (m = e[7]);
    const t = P(m);
    let d;
    e[8] === Symbol.for('react.memo_cache_sentinel')
        ? ((d = s.jsxs('div', {
              className: 'flex flex-col items-center text-center mb-6',
              children: [
                  s.jsx('h1', { className: 'text-2xl font-bold', children: 'Welcome back' }),
                  s.jsx('p', { className: 'text-balance text-muted-foreground', children: 'Login to your account' }),
              ],
          })),
          (e[8] = d))
        : (d = e[8]);
    let i;
    e[9] !== t
        ? ((i = (p) => {
              (p.preventDefault(), t.handleSubmit());
          }),
          (e[9] = t),
          (e[10] = i))
        : (i = e[10]);
    let o, g;
    e[11] !== t.AppField
        ? ((o = s.jsx(t.AppField, { name: 'email', children: Q })),
          (g = s.jsx(t.AppField, { name: 'password', children: O })),
          (e[11] = t.AppField),
          (e[12] = o),
          (e[13] = g))
        : ((o = e[12]), (g = e[13]));
    let h;
    e[14] !== t.Subscribe
        ? ((h = s.jsx(R, { children: s.jsx(t.Subscribe, { selector: K, children: G }) })),
          (e[14] = t.Subscribe),
          (e[15] = h))
        : (h = e[15]);
    let x;
    e[16] !== o || e[17] !== g || e[18] !== h
        ? ((x = s.jsx(D, { children: s.jsxs(V, { children: [o, g, h] }) })),
          (e[16] = o),
          (e[17] = g),
          (e[18] = h),
          (e[19] = x))
        : (x = e[19]);
    let j;
    return (
        e[20] !== x || e[21] !== i
            ? ((j = s.jsxs('div', {
                  className: 'p-6 md:p-8 w-full max-w-md',
                  children: [d, s.jsx('form', { id: 'login-form', noValidate: !0, onSubmit: i, children: x })],
              })),
              (e[20] = x),
              (e[21] = i),
              (e[22] = j))
            : (j = e[22]),
        j
    );
}
function G(e) {
    const [u, n] = e;
    return s.jsx(E, { type: 'submit', className: 'w-full', disabled: !u, isLoading: n, children: 'Login' });
}
function K(e) {
    return [e.canSubmit, e.isSubmitting];
}
function O(e) {
    return s.jsx(e.FormFieldWrapper, {
        labelClassName: 'flex items-center justify-between',
        label: s.jsxs(s.Fragment, {
            children: [
                'Password',
                ' ',
                s.jsx(w, {
                    to: '/login',
                    className:
                        'ml-auto text-sm underline-offset-2 hover:underline text-foreground rounded-sm outline-none  focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
                    children: 'Forgot your password?',
                }),
            ],
        }),
        children: s.jsx(e.PasswordInputField, { placeholder: 'Enter password' }),
    });
}
function Q(e) {
    return s.jsx(e.FormFieldWrapper, {
        label: 'Email',
        children: s.jsx(e.InputField, { type: 'email', placeholder: 'you@example.com', autoComplete: 'username' }),
    });
}
function X() {
    const e = _.c(16),
        { isDarkTheme: u } = W(),
        n = u ? '/images/logo-black.svg' : '/images/logo-white.svg';
    let r;
    e[0] !== n
        ? ((r = s.jsx(w, {
              className: 'outline-hidden focus-visible:outline-ring rounded-md w-fit',
              to: '/login',
              children: s.jsx('img', { className: 'h-7 w-fi', src: n, alt: 'Phenomenon logo' }),
          })),
          (e[0] = n),
          (e[1] = r))
        : (r = e[1]);
    let c;
    e[2] === Symbol.for('react.memo_cache_sentinel')
        ? ((c = s.jsx('h3', { className: 'text-background text-lg', children: 'Where big ideas meet bold execution' })),
          (e[2] = c))
        : (c = e[2]);
    let a;
    e[3] !== r
        ? ((a = s.jsxs('div', {
              className: 'relative hidden bg-black dark:bg-white lg:flex flex-col justify-between p-10',
              children: [r, c],
          })),
          (e[3] = r),
          (e[4] = a))
        : (a = e[4]);
    const f = u ? '/images/logo-white.svg' : '/images/logo-black.svg';
    let l;
    e[5] !== f
        ? ((l = s.jsx(w, {
              to: '/login',
              className:
                  'outline-hidden focus-visible:outline-ring flex items-center gap-2 font-medium rounded-md w-fit',
              children: s.jsx('img', { className: 'h-7 w-fit', src: f, alt: 'Phenomenon logo' }),
          })),
          (e[5] = f),
          (e[6] = l))
        : (l = e[6]);
    let m;
    e[7] === Symbol.for('react.memo_cache_sentinel')
        ? ((m = s.jsx('h3', { className: 'text-md', children: 'Where big ideas meet bold execution' })), (e[7] = m))
        : (m = e[7]);
    let t;
    e[8] !== l
        ? ((t = s.jsxs('div', {
              className: 'flex flex-col justify-center items-center gap-2 lg:hidden',
              children: [l, m],
          })),
          (e[8] = l),
          (e[9] = t))
        : (t = e[9]);
    let d;
    e[10] === Symbol.for('react.memo_cache_sentinel')
        ? ((d = s.jsx('div', { className: 'flex flex-1 items-center justify-center', children: s.jsx($, {}) })),
          (e[10] = d))
        : (d = e[10]);
    let i;
    e[11] !== t
        ? ((i = s.jsxs('div', { className: 'flex flex-col gap-4 p-6 md:p-10', children: [t, d] })),
          (e[11] = t),
          (e[12] = i))
        : (i = e[12]);
    let o;
    return (
        e[13] !== a || e[14] !== i
            ? ((o = s.jsxs('div', { className: 'grid h-full lg:grid-cols-2', children: [a, i] })),
              (e[13] = a),
              (e[14] = i),
              (e[15] = o))
            : (o = e[15]),
        o
    );
}
const se = X;
export { se as component };
