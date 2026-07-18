import { f as R } from './focusFirstError-DXrcz5gg.js';
import { aX as C, aW as E, aL as g, aY as N, aT as P, g as y } from './index-CATHI92X.js';
import { F as I, u as k, a as L, b as M } from './index-CPILwtgz.js';
import { c as F, j as t } from './vendor-react-1kp2ER4x.js';
import { s as j, o as T } from './vendor-zod-D40u6Zl6.js';
import './getPseudoElementBounds-D7ePV0js.js';
import './useScrollLock-BrgHxV8m.js';

const W = T({
        password: j().min(8, { error: 'Password must be at least 8 characters' }),
        confirmPassword: j().min(1, { error: 'Please confirm your password' }),
    }).refine((e) => e.password === e.confirmPassword, { error: 'Passwords do not match', path: ['confirmPassword'] }),
    A = y('/_unauthenticated/activate/');
function B() {
    const e = F.c(24),
        a = A.useNavigate();
    let r;
    e[0] === Symbol.for('react.memo_cache_sentinel')
        ? ((r = {
              select(s) {
                  const { token: d } = s;
                  return d;
              },
          }),
          (e[0] = r))
        : (r = e[0]);
    const u = A.useSearch(r);
    let p;
    e[1] === Symbol.for('react.memo_cache_sentinel') ? ((p = N()), (e[1] = p)) : (p = e[1]);
    const { mutateAsync: v } = g(p);
    let f, x;
    e[2] === Symbol.for('react.memo_cache_sentinel')
        ? ((f = { password: '', confirmPassword: '' }), (x = { onSubmit: W }), (e[2] = f), (e[3] = x))
        : ((f = e[2]), (x = e[3]));
    let h;
    e[4] !== v || e[5] !== a || e[6] !== u
        ? ((h = {
              defaultValues: f,
              validators: x,
              async onSubmit(s) {
                  const { value: d, formApi: _ } = s;
                  await v(
                      { token: u ?? '', password: d.password },
                      {
                          onSuccess() {
                              a({ to: C, replace: !0 });
                          },
                          onError(S) {
                              S instanceof Error && S.message
                                  ? _.setErrorMap({ onSubmit: { fields: { password: { message: S.message } } } })
                                  : E.error('Activation failed');
                          },
                      }
                  );
              },
              onSubmitInvalid(s) {
                  const { formApi: d } = s;
                  R('#activate-form', d.state.errorMap.onSubmit);
              },
          }),
          (e[4] = v),
          (e[5] = a),
          (e[6] = u),
          (e[7] = h))
        : (h = e[7]);
    const o = k(h);
    if (!u) {
        let s;
        return (
            e[8] === Symbol.for('react.memo_cache_sentinel')
                ? ((s = t.jsxs('div', {
                      className: 'w-full max-w-md text-center',
                      children: [
                          t.jsx('h1', { className: 'text-2xl font-bold', children: 'Invalid invitation' }),
                          t.jsx('p', {
                              className: 'text-muted-foreground mt-2 text-balance',
                              children:
                                  'This invitation link is invalid or has expired. Ask the Head to send you a new one.',
                          }),
                      ],
                  })),
                  (e[8] = s))
                : (s = e[8]),
            s
        );
    }
    let b;
    e[9] === Symbol.for('react.memo_cache_sentinel')
        ? ((b = t.jsxs('div', {
              className: 'mb-6 flex flex-col items-center text-center',
              children: [
                  t.jsx('h1', { className: 'text-2xl font-bold', children: 'Set your password' }),
                  t.jsx('p', {
                      className: 'text-muted-foreground text-balance',
                      children: 'Choose a password to activate your account',
                  }),
              ],
          })),
          (e[9] = b))
        : (b = e[9]);
    let i;
    e[10] !== o
        ? ((i = (s) => {
              (s.preventDefault(), o.handleSubmit());
          }),
          (e[10] = o),
          (e[11] = i))
        : (i = e[11]);
    let n, l;
    e[12] !== o.AppField
        ? ((n = t.jsx(o.AppField, { name: 'password', children: G })),
          (l = t.jsx(o.AppField, { name: 'confirmPassword', children: $ })),
          (e[12] = o.AppField),
          (e[13] = n),
          (e[14] = l))
        : ((n = e[13]), (l = e[14]));
    let c;
    e[15] !== o.Subscribe
        ? ((c = t.jsx(I, { children: t.jsx(o.Subscribe, { selector: V, children: D }) })),
          (e[15] = o.Subscribe),
          (e[16] = c))
        : (c = e[16]);
    let m;
    e[17] !== n || e[18] !== l || e[19] !== c
        ? ((m = t.jsx(L, { children: t.jsxs(M, { children: [n, l, c] }) })),
          (e[17] = n),
          (e[18] = l),
          (e[19] = c),
          (e[20] = m))
        : (m = e[20]);
    let w;
    return (
        e[21] !== m || e[22] !== i
            ? ((w = t.jsxs('div', {
                  className: 'w-full max-w-md p-6 md:p-8',
                  children: [b, t.jsx('form', { id: 'activate-form', noValidate: !0, onSubmit: i, children: m })],
              })),
              (e[21] = m),
              (e[22] = i),
              (e[23] = w))
            : (w = e[23]),
        w
    );
}
function D(e) {
    const [a, r] = e;
    return t.jsx(P, { type: 'submit', className: 'w-full', disabled: !a, isLoading: r, children: 'Activate account' });
}
function V(e) {
    return [e.canSubmit, e.isSubmitting];
}
function $(e) {
    return t.jsx(e.FormFieldWrapper, {
        label: 'Confirm password',
        children: t.jsx(e.PasswordInputField, { placeholder: 'Re-enter password', autoComplete: 'new-password' }),
    });
}
function G(e) {
    return t.jsx(e.FormFieldWrapper, {
        label: 'Password',
        children: t.jsx(e.PasswordInputField, { placeholder: 'At least 8 characters', autoComplete: 'new-password' }),
    });
}
function H() {
    const e = F.c(1);
    let a;
    return (
        e[0] === Symbol.for('react.memo_cache_sentinel')
            ? ((a = t.jsx('div', {
                  className: 'flex h-full flex-col items-center justify-center p-6',
                  children: t.jsx(B, {}),
              })),
              (e[0] = a))
            : (a = e[0]),
        a
    );
}
const Q = H;
export { Q as component };
