import { bk as E, K as I, G as M, y as m, ar as P, bG as w, bP as y } from './index-CATHI92X.js';
import { u as D } from './useScrollLock-BrgHxV8m.js';
import { r as c, j as k } from './vendor-react-1kp2ER4x.js';

function K({ controlled: e, default: t, name: n, state: r = 'value' }) {
    const { current: o } = c.useRef(e !== void 0),
        [u, i] = c.useState(t),
        a = o ? e : u,
        l = c.useCallback((p) => {
            o || i(p);
        }, []);
    return [a, l];
}
function L(e) {
    const t = c.useRef(''),
        n = c.useCallback(
            (o) => {
                o.defaultPrevented || ((t.current = o.pointerType), e(o, o.pointerType));
            },
            [e]
        );
    return {
        onClick: c.useCallback(
            (o) => {
                if (o.detail === 0) {
                    e(o, 'keyboard');
                    return;
                }
                ('pointerType' in o ? e(o, o.pointerType) : e(o, t.current), (t.current = ''));
            },
            [e]
        ),
        onPointerDown: n,
    };
}
function _(e, t) {
    const n = c.useRef(e),
        r = M(t);
    (m(() => {
        n.current !== e && r(n.current);
    }, [e, r]),
        m(() => {
            n.current = e;
        }, [e]));
}
function W(e, t) {
    const n = M((u, i) => {
            (typeof e == 'function' ? e() : e) || t(i || (E ? 'touch' : ''));
        }),
        { onClick: r, onPointerDown: o } = L(n);
    return c.useMemo(() => ({ onClick: r, onPointerDown: o }), [r, o]);
}
function X(e) {
    const [t, n] = c.useState(null),
        r = W(e, n);
    return (
        _(e, (o) => {
            o && !e && n(null);
        }),
        c.useMemo(() => ({ openMethod: t, triggerProps: r }), [t, r])
    );
}
const S = c.createContext({
    register: () => {},
    unregister: () => {},
    subscribeMapChange: () => () => {},
    elementsRef: { current: [] },
    nextIndexRef: { current: 0 },
});
function F() {
    return c.useContext(S);
}
let z = (function (e) {
    return ((e[(e.None = 0)] = 'None'), (e[(e.GuessFromOrder = 1)] = 'GuessFromOrder'), e);
})({});
function Y(e = {}) {
    const { label: t, metadata: n, textRef: r, indexGuessBehavior: o, index: u } = e,
        { register: i, unregister: a, subscribeMapChange: l, elementsRef: p, labelsRef: x, nextIndexRef: d } = F(),
        b = c.useRef(-1),
        [C, f] = c.useState(
            u ??
                (o === z.GuessFromOrder
                    ? () => {
                          if (b.current === -1) {
                              const s = d.current;
                              ((d.current += 1), (b.current = s));
                          }
                          return b.current;
                      }
                    : -1)
        ),
        O = c.useRef(null),
        N = c.useCallback(
            (s) => {
                if (((O.current = s), C !== -1 && s !== null && ((p.current[C] = s), x))) {
                    const g = t !== void 0;
                    x.current[C] = g ? t : (r?.current?.textContent ?? s.textContent);
                }
            },
            [C, p, x, t, r]
        );
    return (
        m(() => {
            if (u != null) return;
            const s = O.current;
            if (s)
                return (
                    i(s, n),
                    () => {
                        a(s);
                    }
                );
        }, [u, i, a, n]),
        m(() => {
            if (u == null)
                return l((s) => {
                    const g = O.current ? s.get(O.current)?.index : null;
                    g != null && f(g);
                });
        }, [u, l, f]),
        { ref: N, index: C }
    );
}
const U = c.createContext(void 0);
function q(e) {
    return c.useContext(U);
}
function J(e) {
    const { children: t, elementsRef: n, labelsRef: r, onMapChange: o } = e,
        u = M(o),
        i = c.useRef(0),
        a = I(G).current,
        l = I(A).current,
        [p, x] = c.useState(0),
        d = c.useRef(p),
        b = M((s, g) => {
            (l.set(s, g ?? null), (d.current += 1), x(d.current));
        }),
        C = M((s) => {
            (l.delete(s), (d.current += 1), x(d.current));
        }),
        f = c.useMemo(() => {
            const s = new Map();
            return (
                Array.from(l.keys())
                    .filter((h) => h.isConnected)
                    .sort(H)
                    .forEach((h, T) => {
                        const R = l.get(h) ?? {};
                        s.set(h, { ...R, index: T });
                    }),
                s
            );
        }, [l, p]);
    (m(() => {
        if (typeof MutationObserver != 'function' || f.size === 0) return;
        const s = new MutationObserver((g) => {
            const h = new Set(),
                T = (R) => (h.has(R) ? h.delete(R) : h.add(R));
            (g.forEach((R) => {
                (R.removedNodes.forEach(T), R.addedNodes.forEach(T));
            }),
                h.size === 0 && ((d.current += 1), x(d.current)));
        });
        return (
            f.forEach((g, h) => {
                h.parentElement && s.observe(h.parentElement, { childList: !0 });
            }),
            () => {
                s.disconnect();
            }
        );
    }, [f]),
        m(() => {
            (d.current === p &&
                (n.current.length !== f.size && (n.current.length = f.size),
                r && r.current.length !== f.size && (r.current.length = f.size),
                (i.current = f.size)),
                u(f));
        }, [u, f, n, r, p]),
        m(
            () => () => {
                n.current = [];
            },
            [n]
        ),
        m(
            () => () => {
                r && (r.current = []);
            },
            [r]
        ));
    const O = M(
        (s) => (
            a.add(s),
            () => {
                a.delete(s);
            }
        )
    );
    m(() => {
        a.forEach((s) => s(f));
    }, [a, f]);
    const N = c.useMemo(
        () => ({ register: b, unregister: C, subscribeMapChange: O, elementsRef: n, labelsRef: r, nextIndexRef: i }),
        [b, C, O, n, r, i]
    );
    return k.jsx(S.Provider, { value: N, children: t });
}
function A() {
    return new Map();
}
function G() {
    return new Set();
}
function H(e, t) {
    const n = e.compareDocumentPosition(t);
    return n & Node.DOCUMENT_POSITION_FOLLOWING || n & Node.DOCUMENT_POSITION_CONTAINED_BY
        ? -1
        : n & Node.DOCUMENT_POSITION_PRECEDING || n & Node.DOCUMENT_POSITION_CONTAINS
          ? 1
          : 0;
}
const V = 20;
function Q(e, t, n, r) {
    const [o, u] = c.useState(!1);
    (m(() => {
        if (!e || !t || n == null) {
            u(!1);
            return;
        }
        const i = P(n).documentElement.clientWidth,
            a = n.offsetWidth;
        u(i > 0 && a > 0 && a >= i - V);
    }, [e, t, n]),
        D(e && (!t || o), r));
}
function Z(e) {
    const t = e.getBoundingClientRect(),
        n = w(e);
    if (y) return t;
    const r = n.getComputedStyle(e, '::before'),
        o = n.getComputedStyle(e, '::after');
    if (!(r.content !== 'none' || o.content !== 'none')) return t;
    const i = parseFloat(r.width) || 0,
        a = parseFloat(r.height) || 0,
        l = parseFloat(o.width) || 0,
        p = parseFloat(o.height) || 0,
        x = Math.max(t.width, i, l),
        d = Math.max(t.height, a, p),
        b = x - t.width,
        C = d - t.height;
    return { left: t.left - b / 2, right: t.right + b / 2, top: t.top - C / 2, bottom: t.bottom + C / 2 };
}
export { J as C, z as I, q as a, Q as b, K as c, X as d, _ as e, Z as g, Y as u };
