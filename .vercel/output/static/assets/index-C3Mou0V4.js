import { c6 as E, c5 as I, c4 as j, aF as y } from './index-CATHI92X.js';
import { w as h, I as v, x as w } from './index-CPILwtgz.js';
import { c as b, j as p } from './vendor-react-1kp2ER4x.js';
import './getPseudoElementBounds-D7ePV0js.js';
import './useScrollLock-BrgHxV8m.js';
import './vendor-zod-D40u6Zl6.js';

function C(f) {
    const e = b.c(24);
    let o, t, l;
    e[0] !== f
        ? (({ className: o, disabled: t, ...l } = f), (e[0] = f), (e[1] = o), (e[2] = t), (e[3] = l))
        : ((o = e[1]), (t = e[2]), (l = e[3]));
    const [s, c] = j(),
        g = s ? I : E;
    let n;
    e[4] !== o ? ((n = y('pe-9', o)), (e[4] = o), (e[5] = n)) : (n = e[5]);
    const u = s ? 'text' : 'password';
    let r;
    e[6] !== t || e[7] !== l || e[8] !== n || e[9] !== u
        ? ((r = p.jsx(v, { className: n, type: u, disabled: t, ...l })),
          (e[6] = t),
          (e[7] = l),
          (e[8] = n),
          (e[9] = u),
          (e[10] = r))
        : (r = e[10]);
    let i;
    e[11] !== g
        ? ((i = p.jsx(g, { size: 16, strokeWidth: 2, 'aria-hidden': !0 })), (e[11] = g), (e[12] = i))
        : (i = e[12]);
    const d = s ? 'Hide password' : 'Show password';
    let a;
    e[13] !== d ? ((a = p.jsx('span', { className: 'sr-only', children: d })), (e[13] = d), (e[14] = a)) : (a = e[14]);
    let m;
    e[15] !== t || e[16] !== s || e[17] !== i || e[18] !== a || e[19] !== c
        ? ((m = p.jsxs('button', {
              className:
                  'absolute inset-y-0 inset-e-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 motion-safe:transition-colors hover:text-foreground focus-visible:z-10 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
              type: 'button',
              onClick: c,
              disabled: t,
              'aria-pressed': s,
              'aria-controls': 'password',
              children: [i, a],
          })),
          (e[15] = t),
          (e[16] = s),
          (e[17] = i),
          (e[18] = a),
          (e[19] = c),
          (e[20] = m))
        : (m = e[20]);
    let x;
    return (
        e[21] !== r || e[22] !== m
            ? ((x = p.jsxs('div', { className: 'relative', children: [r, m] })), (e[21] = r), (e[22] = m), (e[23] = x))
            : (x = e[23]),
        x
    );
}
function M(f) {
    const e = b.c(20);
    let o, t, l;
    e[0] !== f
        ? (({ onChange: t, onBlur: o, ...l } = f), (e[0] = f), (e[1] = o), (e[2] = t), (e[3] = l))
        : ((o = e[1]), (t = e[2]), (l = e[3]));
    const s = h();
    let c;
    e[4] !== s.state.meta.errors
        ? ((c = w(s.state.meta.errors)), (e[4] = s.state.meta.errors), (e[5] = c))
        : (c = e[5]);
    const g = c,
        n = `${s.name}${s.form.formId}`,
        u = !!g;
    let r;
    e[6] !== s || e[7] !== t
        ? ((r = (a) => {
              (s.handleChange(a.target.value), t?.(a));
          }),
          (e[6] = s),
          (e[7] = t),
          (e[8] = r))
        : (r = e[8]);
    let i;
    e[9] !== s || e[10] !== o
        ? ((i = (a) => {
              (s.handleBlur(), o?.(a));
          }),
          (e[9] = s),
          (e[10] = o),
          (e[11] = i))
        : (i = e[11]);
    let d;
    return (
        e[12] !== s.name ||
        e[13] !== s.state.value ||
        e[14] !== n ||
        e[15] !== l ||
        e[16] !== u ||
        e[17] !== r ||
        e[18] !== i
            ? ((d = p.jsx(C, {
                  id: n,
                  name: s.name,
                  'aria-invalid': u,
                  value: s.state.value,
                  onChange: r,
                  onBlur: i,
                  ...l,
              })),
              (e[12] = s.name),
              (e[13] = s.state.value),
              (e[14] = n),
              (e[15] = l),
              (e[16] = u),
              (e[17] = r),
              (e[18] = i),
              (e[19] = d))
            : (d = e[19]),
        d
    );
}
export { M as PasswordInputField };
