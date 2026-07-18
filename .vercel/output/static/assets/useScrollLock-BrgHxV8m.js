import {
    bH as $,
    ar as a,
    y as B,
    bG as h,
    bk as H,
    bI as I,
    c3 as j,
    c1 as O,
    c2 as p,
    aO as T,
} from './index-CATHI92X.js';
import { j as A, r as X } from './vendor-react-1kp2ER4x.js';

const _ = 'ArrowUp',
    z = 'ArrowDown',
    F = 'ArrowLeft',
    K = 'ArrowRight',
    P = 'Home',
    U = 'End',
    V = new Set([F, K]),
    D = new Set([_, z]),
    M = new Set([...V, ...D]),
    rt = new Set([...M, P, U]),
    nt = X.forwardRef(function (e, t) {
        const { cutout: o, ...l } = e;
        let s;
        if (o) {
            const r = o.getBoundingClientRect();
            s = `polygon(0% 0%,100% 0%,100% 100%,0% 100%,0% 0%,${r.left}px ${r.top}px,${r.left}px ${r.bottom}px,${r.right}px ${r.bottom}px,${r.right}px ${r.top}px,${r.left}px ${r.top}px)`;
        }
        return A.jsx('div', {
            ref: t,
            role: 'presentation',
            'data-base-ui-inert': '',
            ...l,
            style: { position: 'fixed', inset: 0, userSelect: 'none', WebkitUserSelect: 'none', clipPath: s },
        });
    });
let k = {},
    Y = {},
    x = '';
function N(n) {
    if (typeof document > 'u') return !1;
    const e = a(n);
    return h(e).innerWidth - e.documentElement.clientWidth > 0;
}
function q(n) {
    if (!(typeof CSS < 'u' && CSS.supports && CSS.supports('scrollbar-gutter', 'stable')) || typeof document > 'u')
        return !1;
    const t = a(n),
        o = t.documentElement,
        l = t.body,
        s = p(o) ? o : l,
        r = s.style.overflowY,
        i = o.style.scrollbarGutter;
    ((o.style.scrollbarGutter = 'stable'), (s.style.overflowY = 'scroll'));
    const u = s.offsetWidth;
    s.style.overflowY = 'hidden';
    const d = s.offsetWidth;
    return ((s.style.overflowY = r), (o.style.scrollbarGutter = i), u === d);
}
function Z(n) {
    const e = a(n),
        t = e.documentElement,
        o = e.body,
        l = p(t) ? t : o,
        s = { overflowY: l.style.overflowY, overflowX: l.style.overflowX };
    return (
        Object.assign(l.style, { overflowY: 'hidden', overflowX: 'hidden' }),
        () => {
            Object.assign(l.style, s);
        }
    );
}
function J(n) {
    const e = a(n),
        t = e.documentElement,
        o = e.body,
        l = h(t);
    let s = 0,
        r = 0,
        i = !1;
    const u = j.create();
    if ($ && (l.visualViewport?.scale ?? 1) !== 1) return () => {};
    function d() {
        const f = l.getComputedStyle(t),
            c = l.getComputedStyle(o),
            y = (f.scrollbarGutter || '').includes('both-edges') ? 'stable both-edges' : 'stable';
        ((s = t.scrollTop),
            (r = t.scrollLeft),
            (k = {
                scrollbarGutter: t.style.scrollbarGutter,
                overflowY: t.style.overflowY,
                overflowX: t.style.overflowX,
            }),
            (x = t.style.scrollBehavior),
            (Y = {
                position: o.style.position,
                height: o.style.height,
                width: o.style.width,
                boxSizing: o.style.boxSizing,
                overflowY: o.style.overflowY,
                overflowX: o.style.overflowX,
                scrollBehavior: o.style.scrollBehavior,
            }));
        const R = t.scrollHeight > t.clientHeight,
            E = t.scrollWidth > t.clientWidth,
            W = f.overflowY === 'scroll' || c.overflowY === 'scroll',
            G = f.overflowX === 'scroll' || c.overflowX === 'scroll',
            w = Math.max(0, l.innerWidth - o.clientWidth),
            v = Math.max(0, l.innerHeight - o.clientHeight),
            m = parseFloat(c.marginTop) + parseFloat(c.marginBottom),
            S = parseFloat(c.marginLeft) + parseFloat(c.marginRight),
            g = p(t) ? t : o;
        if (((i = q(n)), i)) {
            ((t.style.scrollbarGutter = y), (g.style.overflowY = 'hidden'), (g.style.overflowX = 'hidden'));
            return;
        }
        (Object.assign(t.style, { scrollbarGutter: y, overflowY: 'hidden', overflowX: 'hidden' }),
            (R || W) && (t.style.overflowY = 'scroll'),
            (E || G) && (t.style.overflowX = 'scroll'),
            Object.assign(o.style, {
                position: 'relative',
                height: m || v ? `calc(100dvh - ${m + v}px)` : '100dvh',
                width: S || w ? `calc(100vw - ${S + w}px)` : '100vw',
                boxSizing: 'border-box',
                overflow: 'hidden',
                scrollBehavior: 'unset',
            }),
            (o.scrollTop = s),
            (o.scrollLeft = r),
            t.setAttribute('data-base-ui-scroll-locked', ''),
            (t.style.scrollBehavior = 'unset'));
    }
    function b() {
        (Object.assign(t.style, k),
            Object.assign(o.style, Y),
            i ||
                ((t.scrollTop = s),
                (t.scrollLeft = r),
                t.removeAttribute('data-base-ui-scroll-locked'),
                (t.style.scrollBehavior = x)));
    }
    function C() {
        (b(), u.request(d));
    }
    d();
    const L = I(l, 'resize', C);
    return () => {
        (u.cancel(), b(), typeof l.removeEventListener == 'function' && L());
    };
}
class Q {
    lockCount = 0;
    restore = null;
    timeoutLock = O.create();
    timeoutUnlock = O.create();
    acquire(e) {
        return (
            (this.lockCount += 1),
            this.lockCount === 1 && this.restore === null && this.timeoutLock.start(0, () => this.lock(e)),
            this.release
        );
    }
    release = () => {
        ((this.lockCount -= 1), this.lockCount === 0 && this.restore && this.timeoutUnlock.start(0, this.unlock));
    };
    unlock = () => {
        this.lockCount === 0 && this.restore && (this.restore?.(), (this.restore = null));
    };
    lock(e) {
        if (this.lockCount === 0 || this.restore !== null) return;
        const o = a(e).documentElement,
            l = h(o).getComputedStyle(o).overflowY;
        if (l === 'hidden' || l === 'clip') {
            this.restore = T;
            return;
        }
        const s = H || !N(e);
        this.restore = s ? Z(e) : J(e);
    }
}
const tt = new Q();
function ct(n = !0, e = null) {
    B(() => {
        if (n) return tt.acquire(e);
    }, [n, e]);
}
export { rt as C, nt as I, ct as u };
