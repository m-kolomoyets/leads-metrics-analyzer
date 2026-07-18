import { e as f, v as p } from './index-BgIF0Ych.js';
import { aF as m } from './index-CATHI92X.js';
import { c, j as n } from './vendor-react-1kp2ER4x.js';

function d(o) {
    const e = c.c(10);
    let t, a, s;
    e[0] !== o
        ? (({ className: t, orientation: s, ...a } = o), (e[0] = o), (e[1] = t), (e[2] = a), (e[3] = s))
        : ((t = e[1]), (a = e[2]), (s = e[3]));
    const l = s === void 0 ? 'horizontal' : s;
    let r;
    e[4] !== t
        ? ((r = m(
              'shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch',
              t
          )),
          (e[4] = t),
          (e[5] = r))
        : (r = e[5]);
    let i;
    return (
        e[6] !== l || e[7] !== a || e[8] !== r
            ? ((i = n.jsx(f, { 'data-slot': 'separator', orientation: l, className: r, ...a })),
              (e[6] = l),
              (e[7] = a),
              (e[8] = r),
              (e[9] = i))
            : (i = e[9]),
        i
    );
}
function j(o) {
    const e = c.c(11);
    let t, a, s;
    e[0] !== o
        ? (({ children: t, className: a, ...s } = o), (e[0] = o), (e[1] = t), (e[2] = a), (e[3] = s))
        : ((t = e[1]), (a = e[2]), (s = e[3]));
    let l;
    e[4] !== a ? ((l = m('flex items-center gap-2 p-6 -mx-6 -mt-6', a)), (e[4] = a), (e[5] = l)) : (l = e[5]);
    let r;
    e[6] === Symbol.for('react.memo_cache_sentinel')
        ? ((r = n.jsxs('div', {
              className: 'flex shrink-0 items-center gap-2',
              children: [n.jsx(p, {}), n.jsx(d, { orientation: 'vertical', className: 'mr-2' })],
          })),
          (e[6] = r))
        : (r = e[6]);
    let i;
    return (
        e[7] !== t || e[8] !== s || e[9] !== l
            ? ((i = n.jsxs('header', { className: l, ...s, children: [r, t] })),
              (e[7] = t),
              (e[8] = s),
              (e[9] = l),
              (e[10] = i))
            : (i = e[10]),
        i
    );
}
export { j as M, d as S };
