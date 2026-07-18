import {
    d as du,
    j as F,
    s as fu,
    e as jh,
    R as K,
    w as la,
    b as Nh,
    a as Pn,
    r as v,
    c as Xe,
} from './vendor-react-1kp2ER4x.js';
import { o as hu, s as pu } from './vendor-zod-D40u6Zl6.js';

const __vite__mapDeps = (
    i,
    m = __vite__mapDeps,
    d = m.f ||
        (m.f = [
            'assets/route-CvpCBWE5.js',
            'assets/vendor-react-1kp2ER4x.js',
            'assets/vendor-zod-D40u6Zl6.js',
            'assets/route-b0KtfCgL.js',
            'assets/route-Bxa2kfp4.js',
            'assets/index-BgIF0Ych.js',
            'assets/useScrollLock-BrgHxV8m.js',
            'assets/getPseudoElementBounds-D7ePV0js.js',
            'assets/index-BE_a3b1D.js',
            'assets/index-CaxdFBgf.js',
            'assets/focusFirstError-DXrcz5gg.js',
            'assets/index-CPILwtgz.js',
            'assets/index-DyMSxq9l.js',
            'assets/index-DPQbE8CJ.js',
            'assets/index-CxJizuOO.js',
            'assets/index-Mm-D9E6O.js',
            'assets/index-B5JXjj6F.js',
            'assets/index-CG7XaCY0.js',
        ])
) => i.map((i) => d[i]);
var Bh = '__TSS_CONTEXT',
    Ti = Symbol.for('TSS_SERVER_FUNCTION'),
    dc = Symbol.for('TSS_SERVER_FUNCTION_FACTORY'),
    $h = 'application/x-tss-framed',
    Xt = { JSON: 0, CHUNK: 1, END: 2, ERROR: 3 },
    zh = /;\s*v=(\d+)/;
function Uh(e) {
    const t = e.match(zh);
    return t ? parseInt(t[1], 10) : void 0;
}
function Hh(e) {
    const t = Uh(e);
    if (t !== void 0 && t !== 1)
        throw new Error(
            `Incompatible framed protocol version: server=${t}, client=1. Please ensure client and server are using compatible versions.`
        );
}
var ua = () => window.__TSS_START_OPTIONS__;
const mu = !1;
function qr(e) {
    return e[e.length - 1];
}
function Wh(e) {
    return typeof e == 'function';
}
function jn(e, t) {
    return Wh(e) ? e(t) : e;
}
const gu = Object.prototype.hasOwnProperty,
    fc = Object.prototype.propertyIsEnumerable;
function yu(e) {
    for (const t in e) if (gu.call(e, t)) return !0;
    return !1;
}
const Kh = () => Object.create(null),
    Dn = (e, t) => Bn(e, t, Kh);
function Bn(e, t, n = () => ({}), r = 0) {
    if (e === t) return e;
    if (r > 500) return t;
    const s = t,
        o = mc(e) && mc(s);
    if (!o && !(no(e) && no(s))) return s;
    const i = o ? e : hc(e);
    if (!i) return s;
    const a = o ? s : hc(s);
    if (!a) return s;
    const d = i.length,
        u = a.length,
        l = o ? new Array(u) : n();
    let c = 0;
    for (let f = 0; f < u; f++) {
        const p = o ? f : a[f],
            h = e[p],
            g = s[p];
        if (h === g) {
            ((l[p] = h), (o ? f < d : gu.call(e, p)) && c++);
            continue;
        }
        if (h === null || g === null || typeof h != 'object' || typeof g != 'object') {
            l[p] = g;
            continue;
        }
        const m = Bn(h, g, n, r + 1);
        ((l[p] = m), m === h && c++);
    }
    return d === u && c === d ? e : l;
}
function hc(e) {
    const t = Object.getOwnPropertyNames(e);
    for (const s of t) if (!fc.call(e, s)) return !1;
    const n = Object.getOwnPropertySymbols(e);
    if (n.length === 0) return t;
    const r = t;
    for (const s of n) {
        if (!fc.call(e, s)) return !1;
        r.push(s);
    }
    return r;
}
function no(e) {
    if (!pc(e)) return !1;
    const t = e.constructor;
    if (typeof t > 'u') return !0;
    const n = t.prototype;
    return !(!pc(n) || !n.hasOwnProperty('isPrototypeOf'));
}
function pc(e) {
    return Object.prototype.toString.call(e) === '[object Object]';
}
function mc(e) {
    return Array.isArray(e) && e.length === Object.keys(e).length;
}
function gt(e, t, n) {
    if (e === t) return !0;
    if (typeof e != typeof t) return !1;
    if (Array.isArray(e) && Array.isArray(t)) {
        if (e.length !== t.length) return !1;
        for (let r = 0, s = e.length; r < s; r++) if (!gt(e[r], t[r], n)) return !1;
        return !0;
    }
    if (no(e) && no(t)) {
        const r = n?.ignoreUndefined ?? !0;
        if (n?.partial) {
            for (const i in t) if ((!r || t[i] !== void 0) && !gt(e[i], t[i], n)) return !1;
            return !0;
        }
        let s = 0;
        if (!r) s = Object.keys(e).length;
        else for (const i in e) e[i] !== void 0 && s++;
        let o = 0;
        for (const i in t) if ((!r || t[i] !== void 0) && (o++, o > s || !gt(e[i], t[i], n))) return !1;
        return s === o;
    }
    return !1;
}
function er(e) {
    let t, n;
    const r = new Promise((s, o) => {
        ((t = s), (n = o));
    });
    return (
        (r.status = 'pending'),
        (r.resolve = (s) => {
            ((r.status = 'resolved'), (r.value = s), t(s), e?.(s));
        }),
        (r.reject = (s) => {
            ((r.status = 'rejected'), n(s));
        }),
        r
    );
}
function Gh(e) {
    return typeof e?.message != 'string'
        ? !1
        : e.message.startsWith('Failed to fetch dynamically imported module') ||
              e.message.startsWith('error loading dynamically imported module') ||
              e.message.startsWith('Importing a module script failed');
}
function Qr(e) {
    return !!(e && typeof e == 'object' && typeof e.then == 'function');
}
const qh = /[\x00-\x1f\x7f"<>`{}]/g;
function Qh(e) {
    return e.replace(qh, (t) => '%' + t.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'));
}
function gc(e) {
    let t;
    try {
        t = decodeURI(e);
    } catch {
        t = e.replaceAll(/%[0-9A-F]{2}/gi, (n) => {
            try {
                return decodeURI(n);
            } catch {
                return n;
            }
        });
    }
    return Qh(t);
}
const Yh = ['http:', 'https:', 'mailto:', 'tel:'];
function ro(e, t) {
    if (!e) return !1;
    try {
        const n = new URL(e);
        return !t.has(n.protocol);
    } catch {
        return !1;
    }
}
const Xh = { '&': '\\u0026', '>': '\\u003e', '<': '\\u003c', '\u2028': '\\u2028', '\u2029': '\\u2029' },
    Jh = /[&><\u2028\u2029]/g;
function Zh(e) {
    return e.replace(Jh, (t) => Xh[t]);
}
function Or(e) {
    if (!e) return { path: e, handledProtocolRelativeURL: !1 };
    if (!/[%\\\x00-\x1f\x7f]/.test(e) && !e.startsWith('//')) return { path: e, handledProtocolRelativeURL: !1 };
    const t = /%25|%5C/gi;
    let n = 0,
        r = '',
        s;
    for (; (s = t.exec(e)) !== null;) ((r += gc(e.slice(n, s.index)) + s[0]), (n = t.lastIndex));
    r = r + gc(n ? e.slice(n) : e);
    let o = !1;
    return (
        r.startsWith('//') && ((o = !0), (r = '/' + r.replace(/^\/+/, ''))),
        { path: r, handledProtocolRelativeURL: o }
    );
}
function ep(e) {
    return /\s|[^\u0000-\u007F]/.test(e) ? e.replace(/\s|[^\u0000-\u007F]/gu, encodeURIComponent) : e;
}
function tp(e, t) {
    if (e === t) return !0;
    if (e.length !== t.length) return !1;
    for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
    return !0;
}
function xt() {
    throw new Error('Invariant failed');
}
function Yr(e) {
    const t = new Map();
    let n, r;
    const s = (o) => {
        o.next &&
            (o.prev
                ? ((o.prev.next = o.next), (o.next.prev = o.prev), (o.next = void 0), r && ((r.next = o), (o.prev = r)))
                : ((o.next.prev = void 0), (n = o.next), (o.next = void 0), r && ((o.prev = r), (r.next = o))),
            (r = o));
    };
    return {
        get(o) {
            const i = t.get(o);
            if (i) return (s(i), i.value);
        },
        set(o, i) {
            if (t.size >= e && n) {
                const d = n;
                (t.delete(d.key), d.next && ((n = d.next), (d.next.prev = void 0)), d === r && (r = void 0));
            }
            const a = t.get(o);
            if (a) ((a.value = i), s(a));
            else {
                const d = { key: o, value: i, prev: r };
                (r && (r.next = d), (r = d), n || (n = d), t.set(o, d));
            }
        },
        clear() {
            (t.clear(), (n = void 0), (r = void 0));
        },
    };
}
const wn = 4,
    bu = 5;
function np(e) {
    const t = e.indexOf('{');
    if (t === -1) return null;
    const n = e.indexOf('}', t);
    return n === -1 || t + 1 >= e.length ? null : [t, n];
}
function vu(e, t, n = new Uint16Array(6)) {
    const r = e.indexOf('/', t),
        s = r === -1 ? e.length : r,
        o = e.substring(t, s);
    if (!o || !o.includes('$')) return ((n[0] = 0), (n[1] = t), (n[2] = t), (n[3] = s), (n[4] = s), (n[5] = s), n);
    if (o === '$') {
        const a = e.length;
        return ((n[0] = 2), (n[1] = t), (n[2] = t), (n[3] = a), (n[4] = a), (n[5] = a), n);
    }
    if (o.charCodeAt(0) === 36) return ((n[0] = 1), (n[1] = t), (n[2] = t + 1), (n[3] = s), (n[4] = s), (n[5] = s), n);
    const i = np(o);
    if (i) {
        const [a, d] = i,
            u = o.charCodeAt(a + 1);
        if (u === 45) {
            if (a + 2 < o.length && o.charCodeAt(a + 2) === 36) {
                const l = a + 3,
                    c = d;
                if (l < c)
                    return (
                        (n[0] = 3),
                        (n[1] = t + a),
                        (n[2] = t + l),
                        (n[3] = t + c),
                        (n[4] = t + d + 1),
                        (n[5] = s),
                        n
                    );
            }
        } else if (u === 36) {
            const l = a + 1,
                c = a + 2;
            return c === d
                ? ((n[0] = 2), (n[1] = t + a), (n[2] = t + l), (n[3] = t + c), (n[4] = t + d + 1), (n[5] = e.length), n)
                : ((n[0] = 1), (n[1] = t + a), (n[2] = t + c), (n[3] = t + d), (n[4] = t + d + 1), (n[5] = s), n);
        }
    }
    return ((n[0] = 0), (n[1] = t), (n[2] = t), (n[3] = s), (n[4] = s), (n[5] = s), n);
}
function ko(e, t, n, r, s, o, i) {
    i?.(n);
    let a = r;
    {
        const d = n.fullPath ?? n.from,
            u = d.length,
            l = n.options?.caseSensitive ?? e,
            c = n.options?.params?.parse ?? n.options?.parseParams;
        for (; a < u;) {
            const p = vu(d, a, t);
            let h;
            const g = a,
                m = p[5];
            switch (((a = m + 1), o++, p[0])) {
                case 0: {
                    const y = d.substring(p[2], p[3]);
                    if (l) {
                        const b = s.static?.get(y);
                        if (b) h = b;
                        else {
                            s.static ??= new Map();
                            const R = $n(n.fullPath ?? n.from);
                            ((R.parent = s), (R.depth = o), (h = R), s.static.set(y, R));
                        }
                    } else {
                        const b = y.toLowerCase(),
                            R = s.staticInsensitive?.get(b);
                        if (R) h = R;
                        else {
                            s.staticInsensitive ??= new Map();
                            const w = $n(n.fullPath ?? n.from);
                            ((w.parent = s), (w.depth = o), (h = w), s.staticInsensitive.set(b, w));
                        }
                    }
                    break;
                }
                case 1: {
                    const y = d.substring(g, p[1]),
                        b = d.substring(p[4], m),
                        R = l && !!(y || b),
                        w = y ? (R ? y : y.toLowerCase()) : void 0,
                        E = b ? (R ? b : b.toLowerCase()) : void 0,
                        C =
                            !c &&
                            s.dynamic?.find(
                                (M) => !M.parse && M.caseSensitive === R && M.prefix === w && M.suffix === E
                            );
                    if (C) h = C;
                    else {
                        const M = Jo(1, n.fullPath ?? n.from, R, w, E);
                        ((h = M), (M.depth = o), (M.parent = s), (s.dynamic ??= []), s.dynamic.push(M));
                    }
                    break;
                }
                case 3: {
                    const y = d.substring(g, p[1]),
                        b = d.substring(p[4], m),
                        R = l && !!(y || b),
                        w = y ? (R ? y : y.toLowerCase()) : void 0,
                        E = b ? (R ? b : b.toLowerCase()) : void 0,
                        C =
                            !c &&
                            s.optional?.find(
                                (M) => !M.parse && M.caseSensitive === R && M.prefix === w && M.suffix === E
                            );
                    if (C) h = C;
                    else {
                        const M = Jo(3, n.fullPath ?? n.from, R, w, E);
                        ((h = M), (M.parent = s), (M.depth = o), (s.optional ??= []), s.optional.push(M));
                    }
                    break;
                }
                case 2: {
                    const y = d.substring(g, p[1]),
                        b = d.substring(p[4], m),
                        R = l && !!(y || b),
                        w = y ? (R ? y : y.toLowerCase()) : void 0,
                        E = b ? (R ? b : b.toLowerCase()) : void 0,
                        C = Jo(2, n.fullPath ?? n.from, R, w, E);
                    ((h = C), (C.parent = s), (C.depth = o), (s.wildcard ??= []), s.wildcard.push(C));
                }
            }
            s = h;
        }
        if (c && n.children && !n.isRoot && n.id && n.id.charCodeAt(n.id.lastIndexOf('/') + 1) === 95) {
            const p = $n(n.fullPath ?? n.from);
            ((p.kind = bu), (p.parent = s), o++, (p.depth = o), (s.pathless ??= []), s.pathless.push(p), (s = p));
        }
        const f = (n.path || !n.children) && !n.isRoot;
        if (f && d.endsWith('/')) {
            const p = $n(n.fullPath ?? n.from);
            ((p.kind = wn), (p.parent = s), o++, (p.depth = o), (s.index = p), (s = p));
        }
        ((s.parse = c ?? null),
            (s.priority = n.options?.params?.priority ?? 0),
            f && !s.route && ((s.route = n), (s.fullPath = n.fullPath ?? n.from)));
    }
    if (n.children) for (const d of n.children) ko(e, t, d, a, s, o, i);
}
function Xo(e, t) {
    if (e.parse && !t.parse) return -1;
    if (!e.parse && t.parse) return 1;
    if (e.parse && t.parse && (e.priority || t.priority)) return t.priority - e.priority;
    if (e.prefix && t.prefix && e.prefix !== t.prefix) {
        if (e.prefix.startsWith(t.prefix)) return -1;
        if (t.prefix.startsWith(e.prefix)) return 1;
    }
    if (e.suffix && t.suffix && e.suffix !== t.suffix) {
        if (e.suffix.endsWith(t.suffix)) return -1;
        if (t.suffix.endsWith(e.suffix)) return 1;
    }
    return e.prefix && !t.prefix
        ? -1
        : !e.prefix && t.prefix
          ? 1
          : e.suffix && !t.suffix
            ? -1
            : !e.suffix && t.suffix
              ? 1
              : e.caseSensitive && !t.caseSensitive
                ? -1
                : !e.caseSensitive && t.caseSensitive
                  ? 1
                  : 0;
}
function yn(e) {
    if (e.pathless) for (const t of e.pathless) yn(t);
    if (e.static) for (const t of e.static.values()) yn(t);
    if (e.staticInsensitive) for (const t of e.staticInsensitive.values()) yn(t);
    if (e.dynamic?.length) {
        e.dynamic.sort(Xo);
        for (const t of e.dynamic) yn(t);
    }
    if (e.optional?.length) {
        e.optional.sort(Xo);
        for (const t of e.optional) yn(t);
    }
    if (e.wildcard?.length) {
        e.wildcard.sort(Xo);
        for (const t of e.wildcard) yn(t);
    }
}
function $n(e) {
    return {
        kind: 0,
        depth: 0,
        pathless: null,
        index: null,
        static: null,
        staticInsensitive: null,
        dynamic: null,
        optional: null,
        wildcard: null,
        route: null,
        fullPath: e,
        parent: null,
        parse: null,
        priority: 0,
    };
}
function Jo(e, t, n, r, s) {
    return {
        kind: e,
        depth: 0,
        pathless: null,
        index: null,
        static: null,
        staticInsensitive: null,
        dynamic: null,
        optional: null,
        wildcard: null,
        route: null,
        fullPath: t,
        parent: null,
        parse: null,
        priority: 0,
        caseSensitive: n,
        prefix: r,
        suffix: s,
    };
}
function rp(e, t) {
    const n = $n('/'),
        r = new Uint16Array(6);
    for (const s of e) ko(!1, r, s, 1, n, 0);
    (yn(n), (t.masksTree = n), (t.flatCache = Yr(1e3)));
}
function sp(e, t) {
    e ||= '/';
    const n = t.flatCache.get(e);
    if (n) return n;
    const r = da(e, t.masksTree);
    return (t.flatCache.set(e, r), r);
}
function op(e, t, n, r, s) {
    ((e ||= '/'), (r ||= '/'));
    const o = t ? `case\0${e}` : e;
    let i = s.singleCache.get(o);
    return (
        i || ((i = $n('/')), ko(t, new Uint16Array(6), { from: e }, 1, i, 0), s.singleCache.set(o, i)),
        da(r, i, n)
    );
}
function ip(e, t, n = !1) {
    const r = n ? e : `nofuzz\0${e}`,
        s = t.matchCache.get(r);
    if (s !== void 0) return s;
    e ||= '/';
    let o;
    try {
        o = da(e, t.segmentTree, n);
    } catch (i) {
        if (i instanceof URIError) o = null;
        else throw i;
    }
    return (o && (o.branch = Su(o.route)), t.matchCache.set(r, o), o);
}
function ap(e) {
    return e === '/' ? e : e.replace(/\/{1,}$/, '');
}
function cp(e, t = !1, n) {
    const r = $n(e.fullPath),
        s = new Uint16Array(6),
        o = {},
        i = {};
    let a = 0;
    return (
        ko(t, s, e, 1, r, 0, (d) => {
            if ((n?.(d, a), d.id in o && xt(), (o[d.id] = d), a !== 0 && d.path)) {
                const u = ap(d.fullPath);
                (!i[u] || d.fullPath.endsWith('/')) && (i[u] = d);
            }
            a++;
        }),
        yn(r),
        {
            processedTree: {
                segmentTree: r,
                singleCache: Yr(1e3),
                matchCache: Yr(1e3),
                flatCache: null,
                masksTree: null,
            },
            routesById: o,
            routesByPath: i,
        }
    );
}
function da(e, t, n = !1) {
    const r = e.split('/'),
        s = up(e, r, t, n);
    if (!s) return null;
    const [o] = wu(e, r, s);
    return { route: s.node.route, rawParams: o };
}
function wu(e, t, n) {
    const r = lp(n.node);
    let s = null;
    const o = Object.create(null);
    let i = n.extract?.part ?? 0,
        a = n.extract?.node ?? 0,
        d = n.extract?.path ?? 0,
        u = n.extract?.segment ?? 0;
    for (; a < r.length; i++, a++, d++, u++) {
        const l = r[a];
        if (l.kind === wn) break;
        if (l.kind === bu) {
            (u--, i--, d--);
            continue;
        }
        const c = t[i],
            f = d;
        if ((c && (d += c.length), l.kind === 1)) {
            s ??= n.node.fullPath.split('/');
            const p = s[u],
                h = l.prefix?.length ?? 0;
            if (p.charCodeAt(h) === 123) {
                const g = l.suffix?.length ?? 0,
                    m = p.substring(h + 2, p.length - g - 1),
                    y = c.substring(h, c.length - g);
                o[m] = decodeURIComponent(y);
            } else {
                const g = p.substring(1);
                o[g] = decodeURIComponent(c);
            }
        } else if (l.kind === 3) {
            if (n.skipped & (1 << a)) {
                (i--, (d = f - 1));
                continue;
            }
            s ??= n.node.fullPath.split('/');
            const p = s[u],
                h = l.prefix?.length ?? 0,
                g = l.suffix?.length ?? 0,
                m = p.substring(h + 3, p.length - g - 1),
                y = l.suffix || l.prefix ? c.substring(h, c.length - g) : c;
            y && (o[m] = decodeURIComponent(y));
        } else if (l.kind === 2) {
            const p = l,
                h = e.substring(f + (p.prefix?.length ?? 0), e.length - (p.suffix?.length ?? 0)),
                g = decodeURIComponent(h);
            ((o['*'] = g), (o._splat = g));
            break;
        }
    }
    return (n.rawParams && Object.assign(o, n.rawParams), [o, { part: i, node: a, path: d, segment: u }]);
}
function Su(e) {
    const t = [e];
    for (; e.parentRoute;) ((e = e.parentRoute), t.push(e));
    return (t.reverse(), t);
}
function lp(e) {
    const t = Array(e.depth + 1);
    do ((t[e.depth] = e), (e = e.parent));
    while (e);
    return t;
}
function up(e, t, n, r) {
    if (e === '/' && n.index) return { node: n.index, skipped: 0 };
    const s = !qr(t),
        o = s && e !== '/',
        i = t.length - (s ? 1 : 0),
        a = [{ node: n, index: 1, skipped: 0, depth: 1, statics: 0, dynamics: 0, optionals: 0 }];
    let d = null,
        u = null;
    for (; a.length;) {
        const l = a.pop(),
            { node: c, index: f, skipped: p, depth: h, statics: g, dynamics: m, optionals: y } = l;
        let { extract: b, rawParams: R } = l;
        if (c.kind === 2 && c.route && !ws(u, l)) continue;
        if (c.parse) {
            if (!yc(e, t, l)) continue;
            ((R = l.rawParams), (b = l.extract));
        }
        r && c.route && c.kind !== wn && ws(d, l) && (d = l);
        const w = f === i;
        if (
            w &&
            (c.route && (!o || c.kind === wn || c.kind === 2) && ws(u, l) && (u = l),
            !c.optional && !c.wildcard && !c.index && !c.pathless)
        )
            continue;
        const E = w ? void 0 : t[f];
        let C;
        if (w && c.index) {
            const M = {
                node: c.index,
                index: f,
                skipped: p,
                depth: h + 1,
                statics: g,
                dynamics: m,
                optionals: y,
                extract: b,
                rawParams: R,
            };
            let S = !0;
            if ((c.index.parse && (yc(e, t, M) || (S = !1)), S)) {
                if (!m && !y && !p && dp(g, i)) return M;
                ws(u, M) && (u = M);
            }
        }
        if (c.wildcard)
            for (let M = c.wildcard.length - 1; M >= 0; M--) {
                const S = c.wildcard[M],
                    { prefix: P, suffix: I } = S;
                if (!(P && (w || !(S.caseSensitive ? E : (C ??= E.toLowerCase())).startsWith(P)))) {
                    if (I) {
                        if (w) continue;
                        const V = t.slice(f).join('/').slice(-I.length);
                        if ((S.caseSensitive ? V : V.toLowerCase()) !== I) continue;
                    }
                    a.push({
                        node: S,
                        index: i,
                        skipped: p,
                        depth: h + 1,
                        statics: g,
                        dynamics: m,
                        optionals: y,
                        extract: b,
                        rawParams: R,
                    });
                }
            }
        if (c.optional) {
            const M = p | (1 << h),
                S = h + 1;
            for (let P = c.optional.length - 1; P >= 0; P--) {
                const I = c.optional[P];
                a.push({
                    node: I,
                    index: f,
                    skipped: M,
                    depth: S,
                    statics: g,
                    dynamics: m,
                    optionals: y,
                    extract: b,
                    rawParams: R,
                });
            }
            if (!w)
                for (let P = c.optional.length - 1; P >= 0; P--) {
                    const I = c.optional[P],
                        { prefix: V, suffix: A } = I;
                    if (V || A) {
                        const O = I.caseSensitive ? E : (C ??= E.toLowerCase());
                        if ((V && !O.startsWith(V)) || (A && !O.endsWith(A))) continue;
                    }
                    a.push({
                        node: I,
                        index: f + 1,
                        skipped: p,
                        depth: S,
                        statics: g,
                        dynamics: m,
                        optionals: y + vs(i, f),
                        extract: b,
                        rawParams: R,
                    });
                }
        }
        if (!w && c.dynamic && E)
            for (let M = c.dynamic.length - 1; M >= 0; M--) {
                const S = c.dynamic[M],
                    { prefix: P, suffix: I } = S;
                if (P || I) {
                    const V = S.caseSensitive ? E : (C ??= E.toLowerCase());
                    if ((P && !V.startsWith(P)) || (I && !V.endsWith(I))) continue;
                }
                a.push({
                    node: S,
                    index: f + 1,
                    skipped: p,
                    depth: h + 1,
                    statics: g,
                    dynamics: m + vs(i, f),
                    optionals: y,
                    extract: b,
                    rawParams: R,
                });
            }
        if (!w && c.staticInsensitive) {
            const M = c.staticInsensitive.get((C ??= E.toLowerCase()));
            M &&
                a.push({
                    node: M,
                    index: f + 1,
                    skipped: p,
                    depth: h + 1,
                    statics: g + vs(i, f),
                    dynamics: m,
                    optionals: y,
                    extract: b,
                    rawParams: R,
                });
        }
        if (!w && c.static) {
            const M = c.static.get(E);
            M &&
                a.push({
                    node: M,
                    index: f + 1,
                    skipped: p,
                    depth: h + 1,
                    statics: g + vs(i, f),
                    dynamics: m,
                    optionals: y,
                    extract: b,
                    rawParams: R,
                });
        }
        if (c.pathless) {
            const M = h + 1;
            for (let S = c.pathless.length - 1; S >= 0; S--) {
                const P = c.pathless[S];
                a.push({
                    node: P,
                    index: f,
                    skipped: p,
                    depth: M,
                    statics: g,
                    dynamics: m,
                    optionals: y,
                    extract: b,
                    rawParams: R,
                });
            }
        }
    }
    if (u) return u;
    if (r && d) {
        let l = d.index;
        for (let f = 0; f < d.index; f++) l += t[f].length;
        const c = l === e.length ? '/' : e.slice(l);
        return ((d.rawParams ??= Object.create(null)), (d.rawParams['**'] = decodeURIComponent(c)), d);
    }
    return null;
}
function vs(e, t) {
    return 2 ** (e - t - 1);
}
function dp(e, t) {
    return e === 2 ** (t - 1) - 1;
}
function yc(e, t, n) {
    let r, s;
    try {
        [r, s] = wu(e, t, n);
    } catch {
        return null;
    }
    if (((n.rawParams = r), (n.extract = s), !n.node.parse)) return !0;
    try {
        if (n.node.parse(r) === !1) return null;
    } catch {}
    return !0;
}
function ws(e, t) {
    return e
        ? t.statics > e.statics ||
              (t.statics === e.statics &&
                  (t.dynamics > e.dynamics ||
                      (t.dynamics === e.dynamics &&
                          (t.optionals > e.optionals ||
                              (t.optionals === e.optionals &&
                                  ((t.node.kind === wn) > (e.node.kind === wn) ||
                                      ((t.node.kind === wn) == (e.node.kind === wn) && t.depth > e.depth)))))))
        : !0;
}
function Bs(e) {
    return fa(e.filter((t) => t !== void 0).join('/'));
}
function fa(e) {
    return e.replace(/\/{2,}/g, '/');
}
function xu(e) {
    return e === '/' ? e : e.replace(/^\/{1,}/, '');
}
function tn(e) {
    const t = e.length;
    return t > 1 && e[t - 1] === '/' ? e.replace(/\/{1,}$/, '') : e;
}
function Ru(e) {
    return tn(xu(e));
}
function so(e, t) {
    return e?.endsWith('/') && e !== '/' && e !== `${t}/` ? e.slice(0, -1) : e;
}
function fp(e, t, n) {
    return so(e, n) === so(t, n);
}
function hp({ base: e, to: t, trailingSlash: n = 'never', cache: r }) {
    const s = t.startsWith('/'),
        o = !s && t === '.';
    let i;
    if (r) {
        i = s ? t : o ? e : e + '\0' + t;
        const u = r.get(i);
        if (u) return u;
    }
    let a;
    if (o) a = e.split('/');
    else if (s) a = t.split('/');
    else {
        for (a = e.split('/'); a.length > 1 && qr(a) === '';) a.pop();
        const u = t.split('/');
        for (let l = 0, c = u.length; l < c; l++) {
            const f = u[l];
            f === '' ? (l ? l === c - 1 && a.push(f) : (a = [f])) : f === '..' ? a.pop() : f === '.' || a.push(f);
        }
    }
    a.length > 1 && (qr(a) === '' ? n === 'never' && a.pop() : n === 'always' && a.push(''));
    const d = fa(a.join('/')) || '/';
    return (i && r && r.set(i, d), d);
}
function pp(e) {
    const t = new Map(e.map((s) => [encodeURIComponent(s), s])),
        n = Array.from(t.keys())
            .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join('|'),
        r = new RegExp(n, 'g');
    return (s) => s.replace(r, (o) => t.get(o) ?? o);
}
function Zo(e, t, n) {
    const r = t[e];
    return typeof r != 'string'
        ? r
        : e === '_splat'
          ? /^[a-zA-Z0-9\-._~!/]*$/.test(r)
              ? r
              : r
                    .split('/')
                    .map((s) => vc(s, n))
                    .join('/')
          : vc(r, n);
}
function bc({ path: e, params: t, decoder: n, ...r }) {
    let s = !1;
    const o = Object.create(null);
    if (!e || e === '/') return { interpolatedPath: '/', usedParams: o, isMissingParams: s };
    if (!e.includes('$')) return { interpolatedPath: e, usedParams: o, isMissingParams: s };
    const i = e.length;
    let a = 0,
        d,
        u = '';
    for (; a < i;) {
        const l = a;
        d = vu(e, l, d);
        const c = d[5];
        if (((a = c + 1), l === c)) continue;
        const f = d[0];
        if (f === 0) {
            u += '/' + e.substring(l, c);
            continue;
        }
        if (f === 2) {
            const p = t._splat;
            ((o._splat = p), (o['*'] = p));
            const h = e.substring(l, d[1]),
                g = e.substring(d[4], c);
            if (!p) {
                ((s = !0), (h || g) && (u += '/' + h + g));
                continue;
            }
            const m = Zo('_splat', t, n);
            u += '/' + h + m + g;
            continue;
        }
        if (f === 1) {
            const p = e.substring(d[2], d[3]);
            (!s && !(p in t) && (s = !0), (o[p] = t[p]));
            const h = e.substring(l, d[1]),
                g = e.substring(d[4], c),
                m = Zo(p, t, n) ?? 'undefined';
            u += '/' + h + m + g;
            continue;
        }
        if (f === 3) {
            const p = e.substring(d[2], d[3]),
                h = t[p];
            if (h == null) continue;
            o[p] = h;
            const g = e.substring(l, d[1]),
                m = e.substring(d[4], c),
                y = Zo(p, t, n) ?? '';
            u += '/' + g + y + m;
            continue;
        }
    }
    return (e.endsWith('/') && (u += '/'), { usedParams: o, interpolatedPath: u || '/', isMissingParams: s });
}
function vc(e, t) {
    const n = encodeURIComponent(e);
    return t?.(n) ?? n;
}
function ha(e = {}) {
    if (((e.isNotFound = !0), e.throw)) throw e;
    return e;
}
function et(e) {
    return e?.isNotFound === !0;
}
function mp() {
    try {
        return sessionStorage;
    } catch {
        return;
    }
}
const gp = 'tsr-scroll-restoration-v1_3',
    Eu = mp();
function yp() {
    try {
        return JSON.parse(Eu?.getItem('tsr-scroll-restoration-v1_3') || '{}');
    } catch {
        return {};
    }
}
function bp() {
    try {
        Eu?.setItem(gp, JSON.stringify(hr));
    } catch {}
}
const hr = yp(),
    wc = 'data-scroll-restoration-id',
    vp = (e) => e.state.__TSR_key || e.href;
function wp(e) {
    const t = e.getAttribute(wc);
    if (t) return `[${wc}="${t}"]`;
    let n = '',
        r = e,
        s;
    for (; (s = r.parentNode);) {
        let o = 1,
            i = r;
        for (; (i = i.previousElementSibling);) o++;
        const a = `${r.localName}:nth-child(${o})`;
        ((n = n ? `${a} > ${n}` : a), (r = s));
    }
    return n;
}
let Ss = !1;
const $s = 'window';
function Ii(e) {
    try {
        return typeof e == 'function' ? e() : document.querySelector(e);
    } catch {}
}
function Sc(e) {
    const t = new Set();
    for (const n of e) {
        if (n === $s) continue;
        const r = Ii(n);
        r && t.add(r);
    }
    return t;
}
function Sp(e, t) {
    const n = e.options.scrollRestoration,
        r = e._scroll;
    n && (r.restoring = !0);
    const s = e.options.getScrollRestorationKey || vp,
        o = new Set(),
        i = (a) => {
            const d = (hr[a] ||= {});
            for (const u of o)
                u === document
                    ? (d[$s] = { scrollX, scrollY })
                    : u.isConnected && (d[wp(u)] = { scrollX: u.scrollLeft, scrollY: u.scrollTop });
        };
    (n &&
        !r.restoration &&
        ((r.restoration = !0),
        (Ss = !1),
        (history.scrollRestoration = 'manual'),
        document.addEventListener(
            'scroll',
            (a) => {
                Ss || o.add(a.target);
            },
            !0
        ),
        e.subscribe('onBeforeLoad', (a) => {
            (a.fromLocation && i(s(a.fromLocation)), o.clear());
        }),
        addEventListener('pagehide', () => {
            (i(s(e.stores.resolvedLocation.get() ?? e.stores.location.get())), bp());
        })),
        !r.reset &&
            ((r.reset = !0),
            e.subscribe('onRendered', (a) => {
                const d = e.options.scrollRestorationBehavior,
                    u = e.options.scrollToTopSelectors,
                    l = r.next,
                    c = r.hash;
                let f;
                if (
                    (o.clear(),
                    (r.next = !0),
                    (r.hash = !1),
                    typeof e.options.scrollRestoration == 'function' &&
                        !e.options.scrollRestoration({ location: e.latestLocation }))
                )
                    return;
                const p = s(a.toLocation),
                    h = a.fromLocation && s(a.fromLocation);
                if (r.restoring && h && h !== p) {
                    const g = hr[h];
                    if (g) {
                        let m = hr[p];
                        for (const y in g) {
                            if (y === $s) {
                                if (l) continue;
                            } else {
                                const b = Ii(y);
                                if (!b || (l && u && ((f ??= Sc(u)), f.has(b)))) continue;
                            }
                            (m || (m = hr[p] = {}), (m[y] ??= g[y]));
                        }
                    }
                }
                Ss = !0;
                try {
                    const g = a.toLocation.hash,
                        m = a.toLocation.state.__hashScrollIntoViewOptions ?? !0;
                    let y = !1;
                    if (l) {
                        !g && u && (f ??= Sc(u));
                        const b = g && m && c,
                            R = r.restoring ? hr[p] : void 0;
                        if (R)
                            for (const w in R) {
                                const { scrollX: E, scrollY: C } = R[w];
                                if (w === $s) {
                                    if (b) continue;
                                    (scrollTo({ top: C, left: E, behavior: d }), (y = !0));
                                } else {
                                    const M = Ii(w);
                                    M && ((M.scrollLeft = E), (M.scrollTop = C), f?.delete(M));
                                }
                            }
                        if (!g) {
                            const w = { top: 0, left: 0, behavior: d };
                            if ((y || scrollTo(w), f)) for (const E of f) E.scrollTo(w);
                        }
                    }
                    !y && g && m && document.getElementById(g)?.scrollIntoView(m);
                } finally {
                    Ss = !1;
                }
            })));
}
function Mu(e, t = String) {
    const n = new URLSearchParams();
    for (const r in e) {
        const s = e[r];
        s !== void 0 && n.set(r, t(s));
    }
    return n.toString();
}
function ei(e) {
    return e ? (e === 'false' ? !1 : e === 'true' ? !0 : +e * 0 === 0 && +e + '' === e ? +e : e) : '';
}
function xp(e) {
    const t = new URLSearchParams(e),
        n = Object.create(null);
    for (const [r, s] of t.entries()) {
        const o = n[r];
        o == null ? (n[r] = ei(s)) : Array.isArray(o) ? o.push(ei(s)) : (n[r] = [o, ei(s)]);
    }
    return n;
}
const Rp = Mp(JSON.parse),
    Ep = Cp(JSON.stringify, JSON.parse);
function Mp(e) {
    return (t) => {
        t[0] === '?' && (t = t.substring(1));
        const n = xp(t);
        for (const r in n) {
            const s = n[r];
            if (typeof s == 'string')
                try {
                    n[r] = e(s);
                } catch {}
        }
        return n;
    };
}
function Cp(e, t) {
    const n = typeof t == 'function';
    function r(s) {
        if (typeof s == 'object' && s !== null)
            try {
                return e(s);
            } catch {}
        else if (n && typeof s == 'string')
            try {
                return (t(s), e(s));
            } catch {}
        return s;
    }
    return (s) => {
        const o = Mu(s, r);
        return o ? `?${o}` : '';
    };
}
const Gn = '__root__';
function xr(e) {
    if (
        ((e.statusCode = e.statusCode || e.code || 307),
        !e._builtLocation && !e.reloadDocument && typeof e.href == 'string')
    )
        try {
            (new URL(e.href), (e.reloadDocument = !0));
        } catch {}
    const t = new Headers(e.headers);
    e.href && t.get('Location') === null && t.set('Location', e.href);
    const n = new Response(null, { status: e.statusCode, headers: t });
    if (((n.options = e), e.throw)) throw n;
    return n;
}
function ct(e) {
    return e instanceof Response && !!e.options;
}
function Cu(e) {
    if (e !== null && typeof e == 'object' && e.isSerializedRedirect) return xr(e);
}
function Pp(e) {
    return {
        input: ({ url: t }) => {
            for (const n of e) t = Fi(n, t);
            return t;
        },
        output: ({ url: t }) => {
            for (let n = e.length - 1; n >= 0; n--) t = Pu(e[n], t);
            return t;
        },
    };
}
function Tp(e) {
    const t = Ru(e.basepath),
        n = `/${t}`,
        r = e.caseSensitive ? n : n.toLowerCase(),
        s = `${r}/`;
    return {
        input: ({ url: o }) => {
            const i = e.caseSensitive ? o.pathname : o.pathname.toLowerCase();
            return (i === r ? (o.pathname = '/') : i.startsWith(s) && (o.pathname = o.pathname.slice(n.length)), o);
        },
        output: ({ url: o }) => ((o.pathname = Bs(['/', t, o.pathname])), o),
    };
}
function Fi(e, t) {
    const n = e?.input?.({ url: t });
    if (n) {
        if (typeof n == 'string') return new URL(n);
        if (n instanceof URL) return n;
    }
    return t;
}
function Pu(e, t) {
    const n = e?.output?.({ url: t });
    if (n) {
        if (typeof n == 'string') return new URL(n);
        if (n instanceof URL) return n;
    }
    return t;
}
function Ip(e, t) {
    const { createMutableStore: n, createReadonlyStore: r, batch: s, init: o } = t,
        i = new Map(),
        a = new Map(),
        d = new Map(),
        u = n(e.status),
        l = n(e.loadedAt),
        c = n(e.isLoading),
        f = n(e.isTransitioning),
        p = n(e.location),
        h = n(e.resolvedLocation),
        g = n(e.statusCode),
        m = n(e.redirect),
        y = n([]),
        b = n([]),
        R = n([]),
        w = r(() => ti(i, y.get())),
        E = r(() => ti(a, b.get())),
        C = r(() => ti(d, R.get())),
        M = r(() => y.get()[0]),
        S = r(() => y.get().some((B) => i.get(B)?.get().status === 'pending')),
        P = r(() => ({ locationHref: p.get().href, resolvedLocationHref: h.get()?.href, status: u.get() })),
        I = r(() => ({
            status: u.get(),
            loadedAt: l.get(),
            isLoading: c.get(),
            isTransitioning: f.get(),
            matches: w.get(),
            location: p.get(),
            resolvedLocation: h.get(),
            statusCode: g.get(),
            redirect: m.get(),
        })),
        V = Yr(64);
    function A(B) {
        let N = V.get(B);
        return (
            N ||
                ((N = r(() => {
                    const U = y.get();
                    for (const D of U) {
                        const X = i.get(D);
                        if (X && X.routeId === B) return X.get();
                    }
                })),
                V.set(B, N)),
            N
        );
    }
    const O = {
        status: u,
        loadedAt: l,
        isLoading: c,
        isTransitioning: f,
        location: p,
        resolvedLocation: h,
        statusCode: g,
        redirect: m,
        matchesId: y,
        pendingIds: b,
        cachedIds: R,
        matches: w,
        pendingMatches: E,
        cachedMatches: C,
        firstId: M,
        hasPending: S,
        matchRouteDeps: P,
        matchStores: i,
        pendingMatchStores: a,
        cachedMatchStores: d,
        __store: I,
        getRouteMatchStore: A,
        setMatches: L,
        setPending: k,
        setCached: _,
    };
    (L(e.matches), o?.(O));
    function L(B) {
        ni(B, i, y, n, s);
    }
    function k(B) {
        ni(B, a, b, n, s);
    }
    function _(B) {
        ni(B, d, R, n, s);
    }
    return O;
}
function ti(e, t) {
    const n = [];
    for (const r of t) {
        const s = e.get(r);
        s && n.push(s.get());
    }
    return n;
}
function ni(e, t, n, r, s) {
    const o = e.map((a) => a.id),
        i = new Set(o);
    s(() => {
        for (const a of t.keys()) i.has(a) || t.delete(a);
        for (const a of e) {
            const d = t.get(a.id);
            if (!d) {
                const u = r(a);
                ((u.routeId = a.routeId), t.set(a.id, u));
                continue;
            }
            ((d.routeId = a.routeId), d.get() !== a && d.set(a));
        }
        tp(n.get(), o) || n.set(o);
    });
}
const ki = (e) => {
        if (!e.rendered) return ((e.rendered = !0), e.onReady?.());
    },
    Fp = (e) => e.stores.matchesId.get().some((t) => e.stores.matchStores.get(t)?.get()._forcePending),
    Oo = (e, t) => !!(e.preload && !e.router.stores.matchStores.has(t)),
    qn = (e, t, n = !0) => {
        const r = { ...(e.router.options.context ?? {}) },
            s = n ? t : t - 1;
        for (let o = 0; o <= s; o++) {
            const i = e.matches[o];
            if (!i) continue;
            const a = e.router.getMatch(i.id);
            a && Object.assign(r, a.__routeContext, a.__beforeLoadContext);
        }
        return r;
    },
    xc = (e, t) => {
        if (!e.matches.length) return;
        const n = t.routeId,
            r = e.matches.findIndex((i) => i.routeId === e.router.routeTree.id),
            s = r >= 0 ? r : 0;
        let o = n ? e.matches.findIndex((i) => i.routeId === n) : (e.firstBadMatchIndex ?? e.matches.length - 1);
        o < 0 && (o = s);
        for (let i = o; i >= 0; i--) {
            const a = e.matches[i];
            if (e.router.looseRoutesById[a.routeId].options.notFoundComponent) return i;
        }
        return n ? o : s;
    },
    Sn = (e, t, n) => {
        if (!(!ct(n) && !et(n)))
            throw (
                (ct(n) && n.redirectHandled && !n.options.reloadDocument) ||
                    (t &&
                        (t._nonReactive.beforeLoadPromise?.resolve(),
                        t._nonReactive.loaderPromise?.resolve(),
                        (t._nonReactive.beforeLoadPromise = void 0),
                        (t._nonReactive.loaderPromise = void 0),
                        (t._nonReactive.error = n),
                        e.updateMatch(t.id, (r) => ({
                            ...r,
                            status: ct(n)
                                ? 'redirected'
                                : et(n)
                                  ? 'notFound'
                                  : r.status === 'pending'
                                    ? 'success'
                                    : r.status,
                            context: qn(e, t.index),
                            isFetching: !1,
                            error: n,
                        })),
                        et(n) && !n.routeId && (n.routeId = t.routeId),
                        t._nonReactive.loadPromise?.resolve()),
                    ct(n) &&
                        ((e.rendered = !0),
                        (n.options._fromLocation = e.location),
                        (n.redirectHandled = !0),
                        (n = e.router.resolveRedirect(n)))),
                n
            );
    },
    Tu = (e, t) => {
        const n = e.router.getMatch(t);
        return !!(!n || n._nonReactive.dehydrated);
    },
    Rc = (e, t, n) => {
        const r = qn(e, n);
        e.updateMatch(t, (s) => ({ ...s, context: r }));
    },
    Ar = (e, t, n) => {
        const { id: r, routeId: s } = e.matches[t],
            o = e.router.looseRoutesById[s];
        if (n instanceof Promise) throw n;
        ((e.firstBadMatchIndex ??= t), Sn(e, e.router.getMatch(r), n));
        try {
            o.options.onError?.(n);
        } catch (i) {
            ((n = i), Sn(e, e.router.getMatch(r), n));
        }
        (e.updateMatch(
            r,
            (i) => (
                i._nonReactive.beforeLoadPromise?.resolve(),
                (i._nonReactive.beforeLoadPromise = void 0),
                i._nonReactive.loadPromise?.resolve(),
                {
                    ...i,
                    error: n,
                    status: 'error',
                    isFetching: !1,
                    updatedAt: Date.now(),
                    abortController: new AbortController(),
                }
            )
        ),
            !e.preload && !ct(n) && !et(n) && (e.serialError ??= n));
    },
    Iu = (e, t, n, r) => {
        if (r._nonReactive.pendingTimeout !== void 0) return;
        const s = n.options.pendingMs ?? e.router.options.defaultPendingMs;
        if (
            e.onReady &&
            !Oo(e, t) &&
            (n.options.loader || n.options.beforeLoad || ku(n)) &&
            typeof s == 'number' &&
            s !== 1 / 0 &&
            (n.options.pendingComponent ?? e.router.options?.defaultPendingComponent)
        ) {
            const o = setTimeout(() => {
                ki(e);
            }, s);
            r._nonReactive.pendingTimeout = o;
        }
    },
    kp = (e, t, n) => {
        const r = e.router.getMatch(t);
        if (!r._nonReactive.beforeLoadPromise && !r._nonReactive.loaderPromise) return;
        Iu(e, t, n, r);
        const s = () => {
            const o = e.router.getMatch(t);
            o.preload && (o.status === 'redirected' || o.status === 'notFound') && Sn(e, o, o.error);
        };
        return r._nonReactive.beforeLoadPromise ? r._nonReactive.beforeLoadPromise.then(s) : s();
    },
    Op = (e, t, n, r) => {
        const s = e.router.getMatch(t);
        let o = s._nonReactive.loadPromise;
        s._nonReactive.loadPromise = er(() => {
            (o?.resolve(), (o = void 0));
        });
        const { paramsError: i, searchError: a } = s;
        (i && Ar(e, n, i), a && Ar(e, n, a), Iu(e, t, r, s));
        const d = new AbortController();
        let u = !1;
        const l = () => {
                u ||
                    ((u = !0),
                    e.updateMatch(t, (w) => ({
                        ...w,
                        isFetching: 'beforeLoad',
                        fetchCount: w.fetchCount + 1,
                        abortController: d,
                    })));
            },
            c = () => {
                (s._nonReactive.beforeLoadPromise?.resolve(),
                    (s._nonReactive.beforeLoadPromise = void 0),
                    e.updateMatch(t, (w) => ({ ...w, isFetching: !1 })));
            };
        if (!r.options.beforeLoad) {
            e.router.batch(() => {
                (l(), c());
            });
            return;
        }
        s._nonReactive.beforeLoadPromise = er();
        const f = { ...qn(e, n, !1), ...s.__routeContext },
            { search: p, params: h, cause: g } = s,
            m = Oo(e, t),
            y = {
                search: p,
                abortController: d,
                params: h,
                preload: m,
                context: f,
                location: e.location,
                navigate: (w) => e.router.navigate({ ...w, _fromLocation: e.location }),
                buildLocation: e.router.buildLocation,
                cause: m ? 'preload' : g,
                matches: e.matches,
                routeId: r.id,
                ...e.router.options.additionalContext,
            },
            b = (w) => {
                if (w === void 0) {
                    e.router.batch(() => {
                        (l(), c());
                    });
                    return;
                }
                ((ct(w) || et(w)) && (l(), Ar(e, n, w)),
                    e.router.batch(() => {
                        (l(), e.updateMatch(t, (E) => ({ ...E, __beforeLoadContext: w })), c());
                    }));
            };
        let R;
        try {
            if (((R = r.options.beforeLoad(y)), Qr(R)))
                return (
                    l(),
                    R.catch((w) => {
                        Ar(e, n, w);
                    }).then(b)
                );
        } catch (w) {
            (l(), Ar(e, n, w));
        }
        b(R);
    },
    Ap = (e, t) => {
        const { id: n, routeId: r } = e.matches[t],
            s = e.router.looseRoutesById[r],
            o = () => a(),
            i = () => Op(e, n, t, s),
            a = () => {
                if (Tu(e, n)) return;
                const d = kp(e, n, s);
                return Qr(d) ? d.then(i) : i();
            };
        return o();
    },
    _p = (e, t, n) => {
        const r = e.router.getMatch(t);
        if (!r || (!n.options.head && !n.options.scripts && !n.options.headers)) return;
        const s = {
            ssr: e.router.options.ssr,
            matches: e.matches,
            match: r,
            params: r.params,
            loaderData: r.loaderData,
        };
        return Promise.all([n.options.head?.(s), n.options.scripts?.(s), n.options.headers?.(s)]).then(([o, i, a]) => ({
            meta: o?.meta,
            links: o?.links,
            headScripts: o?.scripts,
            headers: a,
            scripts: i,
            styles: o?.styles,
        }));
    },
    Fu = (e, t, n, r, s) => {
        const o = t[r - 1],
            { params: i, loaderDeps: a, abortController: d, cause: u } = e.router.getMatch(n),
            l = qn(e, r),
            c = Oo(e, n);
        return {
            params: i,
            deps: a,
            preload: !!c,
            parentMatchPromise: o,
            abortController: d,
            context: l,
            location: e.location,
            navigate: (f) => e.router.navigate({ ...f, _fromLocation: e.location }),
            cause: c ? 'preload' : u,
            route: s,
            ...e.router.options.additionalContext,
        };
    },
    Ec = async (e, t, n, r, s) => {
        try {
            const o = e.router.getMatch(n);
            try {
                (!(mu ?? e.router.isServer) || o.ssr === !0) && Xr(s);
                const i = s.options.loader,
                    a = typeof i == 'function' ? i : i?.handler,
                    d = a?.(Fu(e, t, n, r, s)),
                    u = !!a && Qr(d);
                if (
                    ((u ||
                        s._lazyPromise ||
                        s._componentsPromise ||
                        s.options.head ||
                        s.options.scripts ||
                        s.options.headers ||
                        o._nonReactive.minPendingPromise) &&
                        e.updateMatch(n, (c) => ({ ...c, isFetching: 'loader' })),
                    a)
                ) {
                    const c = u ? await d : d;
                    (Sn(e, e.router.getMatch(n), c),
                        c !== void 0 && e.updateMatch(n, (f) => ({ ...f, loaderData: c })));
                }
                s._lazyPromise && (await s._lazyPromise);
                const l = o._nonReactive.minPendingPromise;
                (l && (await l),
                    s._componentsPromise && (await s._componentsPromise),
                    e.updateMatch(n, (c) => ({
                        ...c,
                        error: void 0,
                        context: qn(e, r),
                        status: 'success',
                        isFetching: !1,
                        updatedAt: Date.now(),
                    })));
            } catch (i) {
                let a = i;
                if (a?.name === 'AbortError') {
                    if (o.abortController.signal.aborted) {
                        (o._nonReactive.loaderPromise?.resolve(), (o._nonReactive.loaderPromise = void 0));
                        return;
                    }
                    e.updateMatch(n, (u) => ({
                        ...u,
                        status: u.status === 'pending' ? 'success' : u.status,
                        isFetching: !1,
                        context: qn(e, r),
                    }));
                    return;
                }
                const d = o._nonReactive.minPendingPromise;
                (d && (await d),
                    et(i) && (await s.options.notFoundComponent?.preload?.()),
                    Sn(e, e.router.getMatch(n), i));
                try {
                    s.options.onError?.(i);
                } catch (u) {
                    ((a = u), Sn(e, e.router.getMatch(n), u));
                }
                (!ct(a) && !et(a) && (await Xr(s, ['errorComponent'])),
                    e.updateMatch(n, (u) => ({ ...u, error: a, context: qn(e, r), status: 'error', isFetching: !1 })));
            }
        } catch (o) {
            const i = e.router.getMatch(n);
            (i && (i._nonReactive.loaderPromise = void 0), Sn(e, i, o));
        }
    },
    Lp = async (e, t, n) => {
        async function r(p, h, g, m, y) {
            const b = Date.now() - h.updatedAt,
                R = p
                    ? (y.options.preloadStaleTime ?? e.router.options.defaultPreloadStaleTime ?? 3e4)
                    : (y.options.staleTime ?? e.router.options.defaultStaleTime ?? 0),
                w = y.options.shouldReload,
                E = typeof w == 'function' ? w(Fu(e, t, s, n, y)) : w,
                { status: C, invalid: M } = m,
                S = b >= R && (!!e.forceStaleReload || m.cause === 'enter' || (g !== void 0 && g !== m.id));
            ((i = C === 'success' && (M || (E ?? S))),
                (p && y.options.preload === !1) ||
                    (i && !e.sync && l
                        ? ((a = !0),
                          (async () => {
                              try {
                                  await Ec(e, t, s, n, y);
                                  const P = e.router.getMatch(s);
                                  (P._nonReactive.loaderPromise?.resolve(),
                                      P._nonReactive.loadPromise?.resolve(),
                                      (P._nonReactive.loaderPromise = void 0),
                                      (P._nonReactive.loadPromise = void 0));
                              } catch (P) {
                                  ct(P) && (await e.router.navigate(P.options));
                              }
                          })())
                        : C !== 'success' || i
                          ? await Ec(e, t, s, n, y)
                          : Rc(e, s, n)));
        }
        const { id: s, routeId: o } = e.matches[n];
        let i = !1,
            a = !1;
        const d = e.router.looseRoutesById[o],
            u = d.options.loader,
            l =
                ((typeof u == 'function' ? void 0 : u?.staleReloadMode) ?? e.router.options.defaultStaleReloadMode) !==
                'blocking';
        if (Tu(e, s)) {
            if (!e.router.getMatch(s)) return e.matches[n];
            Rc(e, s, n);
        } else {
            const p = e.router.getMatch(s),
                h = e.router.stores.matchesId.get()[n],
                g =
                    ((h && e.router.stores.matchStores.get(h)) || null)?.routeId === o
                        ? h
                        : e.router.stores.matches.get().find((y) => y.routeId === o)?.id,
                m = Oo(e, s);
            if (p._nonReactive.loaderPromise) {
                if (p.status === 'success' && !e.sync && !p.preload && l) return p;
                await p._nonReactive.loaderPromise;
                const y = e.router.getMatch(s),
                    b = y._nonReactive.error || y.error;
                (b && Sn(e, y, b), y.status === 'pending' && (await r(m, p, g, y, d)));
            } else {
                const y = m && !e.router.stores.matchStores.has(s),
                    b = e.router.getMatch(s);
                ((b._nonReactive.loaderPromise = er()),
                    y !== b.preload && e.updateMatch(s, (R) => ({ ...R, preload: y })),
                    await r(m, p, g, b, d));
            }
        }
        const c = e.router.getMatch(s);
        (a ||
            (c._nonReactive.loaderPromise?.resolve(),
            c._nonReactive.loadPromise?.resolve(),
            (c._nonReactive.loadPromise = void 0)),
            clearTimeout(c._nonReactive.pendingTimeout),
            (c._nonReactive.pendingTimeout = void 0),
            a || (c._nonReactive.loaderPromise = void 0),
            (c._nonReactive.dehydrated = void 0));
        const f = a ? c.isFetching : !1;
        return f !== c.isFetching || c.invalid !== !1
            ? (e.updateMatch(s, (p) => ({ ...p, isFetching: f, invalid: !1 })), e.router.getMatch(s))
            : c;
    };
async function Mc(e) {
    const t = e,
        n = [];
    Fp(t.router) && ki(t);
    let r;
    for (let f = 0; f < t.matches.length; f++) {
        try {
            const p = Ap(t, f);
            Qr(p) && (await p);
        } catch (p) {
            if (ct(p)) throw p;
            if (et(p)) r = p;
            else if (!t.preload) throw p;
            break;
        }
        if (t.serialError || t.firstBadMatchIndex != null) break;
    }
    const s = t.firstBadMatchIndex ?? t.matches.length,
        o = r && !t.preload ? xc(t, r) : void 0,
        i = r && t.preload ? 0 : o !== void 0 ? Math.min(o + 1, s) : s;
    let a, d;
    for (let f = 0; f < i; f++) n.push(Lp(t, n, f));
    try {
        await Promise.all(n);
    } catch {
        const f = await Promise.allSettled(n);
        for (const p of f) {
            if (p.status !== 'rejected') continue;
            const h = p.reason;
            if (ct(h)) throw h;
            et(h) ? (a ??= h) : (d ??= h);
        }
        if (d !== void 0) throw d;
    }
    const u = a ?? (r && !t.preload ? r : void 0);
    let l = t.firstBadMatchIndex !== void 0 ? t.firstBadMatchIndex : t.matches.length - 1;
    if (!u && r && t.preload) return t.matches;
    if (u) {
        const f = xc(t, u);
        f === void 0 && xt();
        const p = t.matches[f],
            h = t.router.looseRoutesById[p.routeId],
            g = t.router.options?.defaultNotFoundComponent;
        (!h.options.notFoundComponent && g && (h.options.notFoundComponent = g), (u.routeId = p.routeId));
        const m = p.routeId === t.router.routeTree.id;
        (t.updateMatch(p.id, (y) => ({
            ...y,
            ...(m ? { status: 'success', globalNotFound: !0, error: void 0 } : { status: 'notFound', error: u }),
            isFetching: !1,
        })),
            (l = f),
            await Xr(h, ['notFoundComponent']));
    } else if (!t.preload) {
        const f = t.matches[0];
        f.globalNotFound ||
            (t.router.getMatch(f.id)?.globalNotFound &&
                t.updateMatch(f.id, (p) => ({ ...p, globalNotFound: !1, error: void 0 })));
    }
    if (t.serialError && t.firstBadMatchIndex !== void 0) {
        const f = t.router.looseRoutesById[t.matches[t.firstBadMatchIndex].routeId];
        await Xr(f, ['errorComponent']);
    }
    for (let f = 0; f <= l; f++) {
        const { id: p, routeId: h } = t.matches[f],
            g = t.router.looseRoutesById[h];
        try {
            const m = _p(t, p, g);
            if (m) {
                const y = await m;
                t.updateMatch(p, (b) => ({ ...b, ...y }));
            }
        } catch (m) {
            console.error(`Error executing head for route ${h}:`, m);
        }
    }
    const c = ki(t);
    if ((Qr(c) && (await c), u)) throw u;
    if (t.serialError && !t.preload && !t.onReady) throw t.serialError;
    return t.matches;
}
function Cc(e, t) {
    const n = t.map((r) => e.options[r]?.preload?.()).filter(Boolean);
    if (n.length !== 0) return Promise.all(n);
}
function Xr(e, t = zs) {
    !e._lazyLoaded &&
        e._lazyPromise === void 0 &&
        (e.lazyFn
            ? (e._lazyPromise = e.lazyFn().then((r) => {
                  const { id: s, ...o } = r.options;
                  (Object.assign(e.options, o), (e._lazyLoaded = !0), (e._lazyPromise = void 0));
              }))
            : (e._lazyLoaded = !0));
    const n = () =>
        e._componentsLoaded
            ? void 0
            : t === zs
              ? (() => {
                    if (e._componentsPromise === void 0) {
                        const r = Cc(e, zs);
                        r
                            ? (e._componentsPromise = r.then(() => {
                                  ((e._componentsLoaded = !0), (e._componentsPromise = void 0));
                              }))
                            : (e._componentsLoaded = !0);
                    }
                    return e._componentsPromise;
                })()
              : Cc(e, t);
    return e._lazyPromise ? e._lazyPromise.then(n) : n();
}
function ku(e) {
    for (const t of zs) if (e.options[t]?.preload) return !0;
    return !1;
}
const zs = ['component', 'errorComponent', 'pendingComponent', 'notFoundComponent'];
var Rn = '__TSR_index',
    Pc = 'popstate',
    Tc = 'beforeunload';
function Dp(e) {
    let t = e.getLocation();
    const n = new Set(),
        r = (i) => {
            ((t = e.getLocation()), n.forEach((a) => a({ location: t, action: i })));
        },
        s = (i) => {
            (e.notifyOnIndexChange ?? !0) ? r(i) : (t = e.getLocation());
        },
        o = async ({ task: i, navigateOpts: a, ...d }) => {
            if (a?.ignoreBlocker ?? !1) {
                i();
                return;
            }
            const u = e.getBlockers?.() ?? [],
                l = d.type === 'PUSH' || d.type === 'REPLACE';
            if (typeof document < 'u' && u.length && l)
                for (const c of u) {
                    const f = oo(d.path, d.state);
                    if (await c.blockerFn({ currentLocation: t, nextLocation: f, action: d.type })) {
                        e.onBlocked?.();
                        return;
                    }
                }
            i();
        };
    return {
        get location() {
            return t;
        },
        get length() {
            return e.getLength();
        },
        subscribers: n,
        subscribe: (i) => (
            n.add(i),
            () => {
                n.delete(i);
            }
        ),
        push: (i, a, d) => {
            const u = t.state[Rn];
            ((a = Ic(u + 1, a)),
                o({
                    task: () => {
                        (e.pushState(i, a), r({ type: 'PUSH' }));
                    },
                    navigateOpts: d,
                    type: 'PUSH',
                    path: i,
                    state: a,
                }));
        },
        replace: (i, a, d) => {
            const u = t.state[Rn];
            ((a = Ic(u, a)),
                o({
                    task: () => {
                        (e.replaceState(i, a), r({ type: 'REPLACE' }));
                    },
                    navigateOpts: d,
                    type: 'REPLACE',
                    path: i,
                    state: a,
                }));
        },
        go: (i, a) => {
            o({
                task: () => {
                    (e.go(i), s({ type: 'GO', index: i }));
                },
                navigateOpts: a,
                type: 'GO',
            });
        },
        back: (i) => {
            o({
                task: () => {
                    (e.back(i?.ignoreBlocker ?? !1), s({ type: 'BACK' }));
                },
                navigateOpts: i,
                type: 'BACK',
            });
        },
        forward: (i) => {
            o({
                task: () => {
                    (e.forward(i?.ignoreBlocker ?? !1), s({ type: 'FORWARD' }));
                },
                navigateOpts: i,
                type: 'FORWARD',
            });
        },
        canGoBack: () => t.state[Rn] !== 0,
        createHref: (i) => e.createHref(i),
        block: (i) => {
            if (!e.setBlockers) return () => {};
            const a = e.getBlockers?.() ?? [];
            return (
                e.setBlockers([...a, i]),
                () => {
                    const d = e.getBlockers?.() ?? [];
                    e.setBlockers?.(d.filter((u) => u !== i));
                }
            );
        },
        flush: () => e.flush?.(),
        destroy: () => e.destroy?.(),
        notify: r,
    };
}
function Ic(e, t) {
    t || (t = {});
    const n = pa();
    return { ...t, key: n, __TSR_key: n, [Rn]: e };
}
function Vp(e) {
    const t = typeof document < 'u' ? window : void 0,
        n = t.history.pushState,
        r = t.history.replaceState;
    let s = [];
    const o = () => s,
        i = (S) => (s = S),
        a = (S) => S,
        d = () => oo(`${t.location.pathname}${t.location.search}${t.location.hash}`, t.history.state);
    if (!t.history.state?.__TSR_key && !t.history.state?.key) {
        const S = pa();
        t.history.replaceState({ [Rn]: 0, key: S, __TSR_key: S }, '');
    }
    let u = d(),
        l,
        c = !1,
        f = !1,
        p = !1,
        h = !1;
    const g = () => u;
    let m, y;
    const b = () => {
            m &&
                ((M._ignoreSubscribers = !0),
                (m.isPush ? t.history.pushState : t.history.replaceState)(m.state, '', m.href),
                (M._ignoreSubscribers = !1),
                (m = void 0),
                (y = void 0),
                (l = void 0));
        },
        R = (S, P, I) => {
            const V = a(P);
            (y || (l = u),
                (u = oo(P, I)),
                (m = { href: V, state: I, isPush: m?.isPush || S === 'push' }),
                y || (y = Promise.resolve().then(() => b())));
        },
        w = (S) => {
            ((u = d()), M.notify({ type: S }));
        },
        E = async () => {
            if (f) {
                f = !1;
                return;
            }
            const S = d(),
                P = S.state[Rn] - u.state[Rn],
                I = P === 1,
                V = P === -1,
                A = (!I && !V) || c;
            c = !1;
            const O = A ? 'GO' : V ? 'BACK' : 'FORWARD',
                L = A ? { type: 'GO', index: P } : { type: V ? 'BACK' : 'FORWARD' };
            if (p) p = !1;
            else {
                const k = o();
                if (typeof document < 'u' && k.length) {
                    for (const _ of k)
                        if (await _.blockerFn({ currentLocation: u, nextLocation: S, action: O })) {
                            ((f = !0), t.history.go(1), M.notify(L));
                            return;
                        }
                }
            }
            ((u = d()), M.notify(L));
        },
        C = (S) => {
            if (h) {
                h = !1;
                return;
            }
            let P = !1;
            const I = o();
            if (typeof document < 'u' && I.length)
                for (const V of I) {
                    const A = V.enableBeforeUnload ?? !0;
                    if (A === !0) {
                        P = !0;
                        break;
                    }
                    if (typeof A == 'function' && A() === !0) {
                        P = !0;
                        break;
                    }
                }
            if (P) return (S.preventDefault(), (S.returnValue = ''));
        },
        M = Dp({
            getLocation: g,
            getLength: () => t.history.length,
            pushState: (S, P) => R('push', S, P),
            replaceState: (S, P) => R('replace', S, P),
            back: (S) => (S && (p = !0), (h = !0), t.history.back()),
            forward: (S) => {
                (S && (p = !0), (h = !0), t.history.forward());
            },
            go: (S) => {
                ((c = !0), t.history.go(S));
            },
            createHref: (S) => a(S),
            flush: b,
            destroy: () => {
                ((t.history.pushState = n),
                    (t.history.replaceState = r),
                    t.removeEventListener(Tc, C, { capture: !0 }),
                    t.removeEventListener(Pc, E));
            },
            onBlocked: () => {
                l && u !== l && (u = l);
            },
            getBlockers: o,
            setBlockers: i,
            notifyOnIndexChange: !1,
        });
    return (
        t.addEventListener(Tc, C, { capture: !0 }),
        t.addEventListener(Pc, E),
        (t.history.pushState = function (...S) {
            const P = n.apply(t.history, S);
            return (M._ignoreSubscribers || w('PUSH'), P);
        }),
        (t.history.replaceState = function (...S) {
            const P = r.apply(t.history, S);
            return (M._ignoreSubscribers || w('REPLACE'), P);
        }),
        M
    );
}
function Np(e) {
    let t = e.replace(/[\x00-\x1f\x7f]/g, '');
    return (t.startsWith('//') && (t = '/' + t.replace(/^\/+/, '')), t);
}
function oo(e, t) {
    const n = Np(e),
        r = n.indexOf('#'),
        s = n.indexOf('?'),
        o = pa();
    return {
        href: n,
        pathname: n.substring(0, r > 0 ? (s > 0 ? Math.min(r, s) : r) : s > 0 ? s : n.length),
        hash: r > -1 ? n.substring(r) : '',
        search: s > -1 ? n.slice(s, r === -1 ? void 0 : r) : '',
        state: t || { [Rn]: 0, key: o, __TSR_key: o },
    };
}
function pa() {
    return (Math.random() + 1).toString(36).substring(7);
}
function jp(e) {
    return e instanceof Error ? { name: e.name, message: e.message } : { data: e };
}
function yr(e, t) {
    const n = t,
        r = e;
    return {
        fromLocation: n,
        toLocation: r,
        pathChanged: n?.pathname !== r.pathname,
        hrefChanged: n?.href !== r.href,
        hashChanged: n?.hash !== r.hash,
    };
}
var Bp = class {
        constructor(e, t) {
            ((this.tempLocationKey = `${Math.round(Math.random() * 1e7)}`),
                (this._scroll = { next: !0 }),
                (this.shouldViewTransition = void 0),
                (this.isViewTransitionTypesSupported = void 0),
                (this.subscribers = new Set()),
                (this.routeBranchCache = new WeakMap()),
                (this.lightweightCache = new WeakMap()),
                (this.startTransition = (n) => n()),
                (this.update = (n) => {
                    const r = this.options,
                        s = this.basepath ?? r?.basepath ?? '/',
                        o = this.basepath === void 0,
                        i = r?.rewrite;
                    if (
                        ((this.options = { ...r, ...n }),
                        (this.isServer = this.options.isServer ?? typeof document > 'u'),
                        (this.protocolAllowlist = new Set(this.options.protocolAllowlist)),
                        this.options.pathParamsAllowedCharacters &&
                            (this.pathParamsDecoder = pp(this.options.pathParamsAllowedCharacters)),
                        (!this.history || (this.options.history && this.options.history !== this.history)) &&
                            (this.options.history ? (this.history = this.options.history) : (this.history = Vp())),
                        (this.origin = this.options.origin),
                        this.origin ||
                            (window?.origin && window.origin !== 'null'
                                ? (this.origin = window.origin)
                                : (this.origin = 'http://localhost')),
                        this.history && this.updateLatestLocation(),
                        this.options.routeTree !== this.routeTree)
                    ) {
                        this.routeTree = this.options.routeTree;
                        let l;
                        ((this.resolvePathCache = Yr(1e3)), (l = this.buildRouteTree()), this.setRoutes(l));
                    }
                    if (!this.stores && this.latestLocation) {
                        const l = this.getStoreConfig(this);
                        ((this.batch = l.batch), (this.stores = Ip(zp(this.latestLocation), l)), Sp(this));
                    }
                    let a = !1;
                    const d = this.options.basepath ?? '/',
                        u = this.options.rewrite;
                    if (o || s !== d || i !== u) {
                        this.basepath = d;
                        const l = [],
                            c = Ru(d);
                        (c && c !== '/' && l.push(Tp({ basepath: d })),
                            u && l.push(u),
                            (this.rewrite = l.length === 0 ? void 0 : l.length === 1 ? l[0] : Pp(l)),
                            this.history && this.updateLatestLocation(),
                            (a = !0));
                    }
                    (a && this.stores && this.stores.location.set(this.latestLocation),
                        typeof window < 'u' &&
                            'CSS' in window &&
                            typeof window.CSS?.supports == 'function' &&
                            (this.isViewTransitionTypesSupported = window.CSS.supports(
                                'selector(:active-view-transition-type(a))'
                            )));
                }),
                (this.updateLatestLocation = () => {
                    this.latestLocation = this.parseLocation(this.history.location, this.latestLocation);
                }),
                (this.buildRouteTree = () => {
                    const n = cp(this.routeTree, this.options.caseSensitive, (r, s) => {
                        r.init({ originalIndex: s });
                    });
                    return (this.options.routeMasks && rp(this.options.routeMasks, n.processedTree), n);
                }),
                (this.subscribe = (n, r) => {
                    const s = { eventType: n, fn: r };
                    return (
                        this.subscribers.add(s),
                        () => {
                            this.subscribers.delete(s);
                        }
                    );
                }),
                (this.emit = (n) => {
                    this.subscribers.forEach((r) => {
                        r.eventType === n.type && r.fn(n);
                    });
                }),
                (this.parseLocation = (n, r) => {
                    const s = ({ pathname: d, search: u, hash: l, href: c, state: f }) => {
                            if (!this.rewrite && !/[ \x00-\x1f\x7f\u0080-\uffff]/.test(d)) {
                                const y = this.options.parseSearch(u),
                                    b = this.options.stringifySearch(y);
                                return {
                                    href: d + b + l,
                                    publicHref: d + b + l,
                                    pathname: Or(d).path,
                                    external: !1,
                                    searchStr: b,
                                    search: Dn(r?.search, y),
                                    hash: Or(l.slice(1)).path,
                                    state: Bn(r?.state, f),
                                };
                            }
                            const p = new URL(c, this.origin),
                                h = Fi(this.rewrite, p),
                                g = this.options.parseSearch(h.search),
                                m = this.options.stringifySearch(g);
                            return (
                                (h.search = m),
                                {
                                    href: h.href.replace(h.origin, ''),
                                    publicHref: c,
                                    pathname: Or(h.pathname).path,
                                    external: !!this.rewrite && h.origin !== this.origin,
                                    searchStr: m,
                                    search: Dn(r?.search, g),
                                    hash: Or(h.hash.slice(1)).path,
                                    state: Bn(r?.state, f),
                                }
                            );
                        },
                        o = s(n),
                        { __tempLocation: i, __tempKey: a } = o.state;
                    if (i && (!a || a === this.tempLocationKey)) {
                        const d = s(i);
                        return (
                            (d.state.key = o.state.key),
                            (d.state.__TSR_key = o.state.__TSR_key),
                            delete d.state.__tempLocation,
                            { ...d, maskedLocation: o }
                        );
                    }
                    return o;
                }),
                (this.resolvePathWithBase = (n, r) =>
                    hp({
                        base: n,
                        to: r.includes('//') ? fa(r) : r,
                        trailingSlash: this.options.trailingSlash,
                        cache: this.resolvePathCache,
                    })),
                (this.matchRoutes = (n, r, s) =>
                    typeof n == 'string'
                        ? this.matchRoutesInternal({ pathname: n, search: r }, s)
                        : this.matchRoutesInternal(n, r)),
                (this.getMatchedRoutes = (n) =>
                    Up({ pathname: n, routesById: this.routesById, processedTree: this.processedTree })),
                (this.cancelMatch = (n) => {
                    const r = this.getMatch(n);
                    r &&
                        (r.abortController.abort(),
                        clearTimeout(r._nonReactive.pendingTimeout),
                        (r._nonReactive.pendingTimeout = void 0));
                }),
                (this.cancelMatches = () => {
                    (this.stores.pendingIds.get().forEach((n) => {
                        this.cancelMatch(n);
                    }),
                        this.stores.matchesId.get().forEach((n) => {
                            if (this.stores.pendingMatchStores.has(n)) return;
                            const r = this.stores.matchStores.get(n)?.get();
                            r && (r.status === 'pending' || r.isFetching === 'loader') && this.cancelMatch(n);
                        }));
                }),
                (this.buildLocation = (n) => {
                    const r = (o = {}) => {
                            const i = o._fromLocation || this.pendingBuiltLocation || this.latestLocation,
                                a = this.matchRoutesLightweight(i);
                            o.from;
                            const d = o.unsafeRelative === 'path' ? i.pathname : (o.from ?? a.fullPath),
                                u = o.to ? `${o.to}` : void 0,
                                l = a.search,
                                c = Object.assign(Object.create(null), a.params),
                                f = u?.charCodeAt(0) === 47 ? '/' : this.resolvePathWithBase(d, '.'),
                                p = u ? this.resolvePathWithBase(f, u) : f,
                                h =
                                    o.params === !1 || o.params === null
                                        ? Object.create(null)
                                        : (o.params ?? !0) === !0
                                          ? c
                                          : Object.assign(c, jn(o.params, c)),
                                g = this.routesByPath[tn(p)];
                            let m;
                            if (g) m = this.getRouteBranch(g);
                            else if (p.includes('$')) m = [];
                            else {
                                const V = this.getMatchedRoutes(p);
                                ((m = V.matchedRoutes),
                                    this.options.notFoundRoute &&
                                        (!V.foundRoute || (V.foundRoute.path !== '/' && V.routeParams['**'])) &&
                                        (m = [...m, this.options.notFoundRoute]));
                            }
                            if (m.length && yu(h))
                                for (const V of m) {
                                    const A = V.options.params?.stringify ?? V.options.stringifyParams;
                                    if (A)
                                        try {
                                            Object.assign(h, A(h));
                                        } catch {}
                                }
                            const y = n.leaveParams
                                ? p
                                : Or(
                                      bc({ path: p, params: h, decoder: this.pathParamsDecoder, server: this.isServer })
                                          .interpolatedPath
                                  ).path;
                            let b = l;
                            if (n._includeValidateSearch && this.options.search?.strict) {
                                const V = {};
                                (m.forEach((A) => {
                                    if (A.options.validateSearch)
                                        try {
                                            Object.assign(V, Us(A.options.validateSearch, { ...V, ...b }));
                                        } catch {}
                                }),
                                    (b = V));
                            }
                            ((b = Hp({
                                search: b,
                                dest: o,
                                destRoutes: m,
                                _includeValidateSearch: n._includeValidateSearch,
                            })),
                                (b = Dn(l, b)));
                            const R = this.options.stringifySearch(b),
                                w = o.hash === !0 ? i.hash : o.hash ? jn(o.hash, i.hash) : void 0,
                                E = w ? `#${w}` : '';
                            let C = o.state === !0 ? i.state : o.state ? jn(o.state, i.state) : {};
                            C = Bn(i.state, C);
                            const M = `${y}${R}${E}`;
                            let S,
                                P,
                                I = !1;
                            if (this.rewrite) {
                                const V = new URL(M, this.origin),
                                    A = Pu(this.rewrite, V);
                                ((S = V.href.replace(V.origin, '')),
                                    A.origin !== this.origin
                                        ? ((P = A.href), (I = !0))
                                        : (P = A.pathname + A.search + A.hash));
                            } else ((S = ep(M)), (P = S));
                            return {
                                publicHref: P,
                                href: S,
                                pathname: y,
                                search: b,
                                searchStr: R,
                                state: C,
                                hash: w ?? '',
                                external: I,
                                unmaskOnReload: o.unmaskOnReload,
                            };
                        },
                        s = (o = {}, i) => {
                            const a = r(o);
                            let d = i ? r(i) : void 0;
                            if (!d) {
                                const u = Object.create(null);
                                if (this.options.routeMasks) {
                                    const l = sp(a.pathname, this.processedTree);
                                    if (l) {
                                        Object.assign(u, l.rawParams);
                                        const { from: c, params: f, ...p } = l.route,
                                            h =
                                                f === !1 || f === null
                                                    ? Object.create(null)
                                                    : (f ?? !0) === !0
                                                      ? u
                                                      : Object.assign(u, jn(f, u));
                                        ((i = { from: n.from, ...p, params: h }), (d = r(i)));
                                    }
                                }
                            }
                            return (d && (a.maskedLocation = d), a);
                        };
                    return n.mask ? s(n, { from: n.from, ...n.mask }) : s(n);
                }),
                (this.commitLocation = async ({ viewTransition: n, ignoreBlocker: r, ...s }) => {
                    let o;
                    const i = () => {
                            const u = ['key', '__TSR_key', '__TSR_index', '__hashScrollIntoViewOptions'];
                            u.forEach((c) => {
                                s.state[c] = this.latestLocation.state[c];
                            });
                            const l = gt(s.state, this.latestLocation.state);
                            return (
                                u.forEach((c) => {
                                    delete s.state[c];
                                }),
                                l
                            );
                        },
                        a = tn(this.latestLocation.href) === tn(s.href);
                    let d = this.commitLocationPromise;
                    if (
                        ((this.commitLocationPromise = er(() => {
                            (d?.resolve(), (d = void 0));
                        })),
                        a && i())
                    )
                        this.load();
                    else {
                        let { maskedLocation: u, hashScrollIntoView: l, ...c } = s;
                        (u &&
                            ((c = {
                                ...u,
                                state: {
                                    ...u.state,
                                    __tempKey: void 0,
                                    __tempLocation: {
                                        ...c,
                                        search: c.searchStr,
                                        state: {
                                            ...c.state,
                                            __tempKey: void 0,
                                            __tempLocation: void 0,
                                            __TSR_key: void 0,
                                            key: void 0,
                                        },
                                    },
                                },
                            }),
                            (c.unmaskOnReload ?? this.options.unmaskOnReload ?? !1) &&
                                (c.state.__tempKey = this.tempLocationKey)),
                            (c.state.__hashScrollIntoViewOptions = l ?? this.options.defaultHashScrollIntoView ?? !0),
                            (this.shouldViewTransition = n),
                            (o = s.replace ? 'REPLACE' : 'PUSH'),
                            this.history[o === 'REPLACE' ? 'replace' : 'push'](c.publicHref, c.state, {
                                ignoreBlocker: r,
                            }));
                    }
                    return (
                        (this._scroll.next = s.resetScroll ?? !0),
                        this.history.subscribers.size || this.load(o ? { action: { type: o } } : void 0),
                        this.commitLocationPromise
                    );
                }),
                (this.buildAndCommitLocation = ({
                    replace: n,
                    resetScroll: r,
                    hashScrollIntoView: s,
                    viewTransition: o,
                    ignoreBlocker: i,
                    href: a,
                    ...d
                } = {}) => {
                    if (a) {
                        const c = this.history.location.state.__TSR_index,
                            f = oo(a, { __TSR_index: n ? c : c + 1 }),
                            p = new URL(f.pathname, this.origin);
                        ((d.to = Fi(this.rewrite, p).pathname),
                            (d.search = this.options.parseSearch(f.search)),
                            (d.hash = f.hash.slice(1)));
                    }
                    const u = this.buildLocation({ ...d, _includeValidateSearch: !0 });
                    this.pendingBuiltLocation = u;
                    const l = this.commitLocation({
                        ...u,
                        viewTransition: o,
                        replace: n,
                        resetScroll: r,
                        hashScrollIntoView: s,
                        ignoreBlocker: i,
                    });
                    return (
                        queueMicrotask(() => {
                            this.pendingBuiltLocation === u && (this.pendingBuiltLocation = void 0);
                        }),
                        l
                    );
                }),
                (this.navigate = async ({ to: n, reloadDocument: r, href: s, publicHref: o, ...i }) => {
                    let a = !1;
                    if (s)
                        try {
                            (new URL(`${s}`), (a = !0));
                        } catch {}
                    if ((a && !r && (r = !0), r)) {
                        if (n !== void 0 || !s) {
                            const u = this.buildLocation({ to: n, ...i });
                            ((s = s ?? u.publicHref), (o = o ?? u.publicHref));
                        }
                        const d = !a && o ? o : s;
                        if (ro(d, this.protocolAllowlist)) return;
                        if (!i.ignoreBlocker) {
                            const u = this.history.getBlockers?.() ?? [];
                            for (const l of u)
                                if (
                                    l?.blockerFn &&
                                    (await l.blockerFn({
                                        currentLocation: this.latestLocation,
                                        nextLocation: this.latestLocation,
                                        action: 'PUSH',
                                    }))
                                )
                                    return;
                        }
                        i.replace ? window.location.replace(d) : (window.location.href = d);
                        return;
                    }
                    return this.buildAndCommitLocation({ ...i, href: s, to: n, _isNavigate: !0 });
                }),
                (this.beforeLoad = () => {
                    (this.cancelMatches(), this.updateLatestLocation());
                    const n = this.matchRoutes(this.latestLocation),
                        r = this.stores.cachedMatches.get().filter((s) => !n.some((o) => o.id === s.id));
                    this.batch(() => {
                        (this.stores.status.set('pending'),
                            this.stores.statusCode.set(200),
                            this.stores.isLoading.set(!0),
                            this.stores.location.set(this.latestLocation),
                            this.stores.setPending(n),
                            this.stores.setCached(r));
                    });
                }),
                (this.load = async (n) => {
                    const r = n?.action?.type;
                    let s, o, i;
                    const a = this.stores.resolvedLocation.get() ?? this.stores.location.get();
                    for (
                        i = new Promise((u) => {
                            this.startTransition(async () => {
                                try {
                                    (this.beforeLoad(), r && (this._scroll.hash = r === 'PUSH' || r === 'REPLACE'));
                                    const l = this.latestLocation,
                                        c = yr(l, this.stores.resolvedLocation.get());
                                    (this.stores.redirect.get() || this.emit({ type: 'onBeforeNavigate', ...c }),
                                        this.emit({ type: 'onBeforeLoad', ...c }),
                                        await Mc({
                                            router: this,
                                            sync: n?.sync,
                                            forceStaleReload: a.href === l.href,
                                            matches: this.stores.pendingMatches.get(),
                                            location: l,
                                            updateMatch: this.updateMatch,
                                            onReady: async () => {
                                                this.startTransition(() => {
                                                    this.startViewTransition(async () => {
                                                        let f = null,
                                                            p = null,
                                                            h = null,
                                                            g = null;
                                                        this.batch(() => {
                                                            const m = this.stores.pendingMatches.get(),
                                                                y = m.length,
                                                                b = this.stores.matches.get();
                                                            f = y
                                                                ? b.filter(
                                                                      (E) => !this.stores.pendingMatchStores.has(E.id)
                                                                  )
                                                                : null;
                                                            const R = new Set();
                                                            for (const E of this.stores.pendingMatchStores.values())
                                                                E.routeId && R.add(E.routeId);
                                                            const w = new Set();
                                                            for (const E of this.stores.matchStores.values())
                                                                E.routeId && w.add(E.routeId);
                                                            ((p = y ? b.filter((E) => !R.has(E.routeId)) : null),
                                                                (h = y ? m.filter((E) => !w.has(E.routeId)) : null),
                                                                (g = y ? m.filter((E) => w.has(E.routeId)) : b),
                                                                this.stores.isLoading.set(!1),
                                                                this.stores.loadedAt.set(Date.now()),
                                                                y &&
                                                                    (this.stores.setMatches(m),
                                                                    this.stores.setPending([]),
                                                                    this.stores.setCached([
                                                                        ...this.stores.cachedMatches.get(),
                                                                        ...f.filter(
                                                                            (E) =>
                                                                                E.status !== 'error' &&
                                                                                E.status !== 'notFound' &&
                                                                                E.status !== 'redirected'
                                                                        ),
                                                                    ]),
                                                                    this.clearExpiredCache()));
                                                        });
                                                        for (const [m, y] of [
                                                            [p, 'onLeave'],
                                                            [h, 'onEnter'],
                                                            [g, 'onStay'],
                                                        ])
                                                            if (m)
                                                                for (const b of m)
                                                                    this.looseRoutesById[b.routeId].options[y]?.(b);
                                                    });
                                                });
                                            },
                                        }));
                                } catch (l) {
                                    ct(l)
                                        ? ((s = l), this.navigate({ ...s.options, replace: !0, ignoreBlocker: !0 }))
                                        : et(l) && (o = l);
                                    const c = s
                                        ? s.status
                                        : o
                                          ? 404
                                          : this.stores.matches.get().some((f) => f.status === 'error')
                                            ? 500
                                            : 200;
                                    this.batch(() => {
                                        (this.stores.statusCode.set(c), this.stores.redirect.set(s));
                                    });
                                }
                                (this.latestLoadPromise === i &&
                                    (this.commitLocationPromise?.resolve(),
                                    (this.latestLoadPromise = void 0),
                                    (this.commitLocationPromise = void 0)),
                                    u());
                            });
                        }),
                            this.latestLoadPromise = i,
                            await i;
                        this.latestLoadPromise && i !== this.latestLoadPromise;
                    )
                        await this.latestLoadPromise;
                    let d;
                    (this.hasNotFoundMatch()
                        ? (d = 404)
                        : this.stores.matches.get().some((u) => u.status === 'error') && (d = 500),
                        d !== void 0 && this.stores.statusCode.set(d));
                }),
                (this.startViewTransition = (n) => {
                    const r = this.shouldViewTransition ?? this.options.defaultViewTransition;
                    if (
                        ((this.shouldViewTransition = void 0),
                        r &&
                            typeof document < 'u' &&
                            'startViewTransition' in document &&
                            typeof document.startViewTransition == 'function')
                    ) {
                        let s;
                        if (typeof r == 'object' && this.isViewTransitionTypesSupported) {
                            const o = this.latestLocation,
                                i = this.stores.resolvedLocation.get(),
                                a = typeof r.types == 'function' ? r.types(yr(o, i)) : r.types;
                            if (a === !1) {
                                n();
                                return;
                            }
                            s = { update: n, types: a };
                        } else s = n;
                        document.startViewTransition(s);
                    } else n();
                }),
                (this.updateMatch = (n, r) => {
                    this.startTransition(() => {
                        const s = this.stores.pendingMatchStores.get(n);
                        if (s) {
                            s.set(r);
                            return;
                        }
                        const o = this.stores.matchStores.get(n);
                        if (o) {
                            o.set(r);
                            return;
                        }
                        const i = this.stores.cachedMatchStores.get(n);
                        if (i) {
                            const a = r(i.get());
                            a.status === 'redirected'
                                ? this.stores.cachedMatchStores.delete(n) &&
                                  this.stores.cachedIds.set((d) => d.filter((u) => u !== n))
                                : i.set(a);
                        }
                    });
                }),
                (this.getMatch = (n) =>
                    this.stores.cachedMatchStores.get(n)?.get() ??
                    this.stores.pendingMatchStores.get(n)?.get() ??
                    this.stores.matchStores.get(n)?.get()),
                (this.invalidate = (n) => {
                    const r = (s) =>
                        (n?.filter?.(s) ?? !0)
                            ? {
                                  ...s,
                                  invalid: !0,
                                  ...(n?.forcePending || s.status === 'error' || s.status === 'notFound'
                                      ? { status: 'pending', error: void 0 }
                                      : void 0),
                              }
                            : s;
                    return (
                        this.batch(() => {
                            (this.stores.setMatches(this.stores.matches.get().map(r)),
                                this.stores.setCached(this.stores.cachedMatches.get().map(r)),
                                this.stores.setPending(this.stores.pendingMatches.get().map(r)));
                        }),
                        (this.shouldViewTransition = !1),
                        this.load({ sync: n?.sync })
                    );
                }),
                (this.getParsedLocationHref = (n) => n.publicHref || '/'),
                (this.resolveRedirect = (n) => {
                    const r = n.headers.get('Location');
                    if (!n.options.href || n.options._builtLocation) {
                        const s = n.options._builtLocation ?? this.buildLocation(n.options),
                            o = this.getParsedLocationHref(s);
                        ((n.options.href = o), n.headers.set('Location', o));
                    } else if (r)
                        try {
                            const s = new URL(r);
                            if (this.origin && s.origin === this.origin) {
                                const o = s.pathname + s.search + s.hash;
                                ((n.options.href = o), n.headers.set('Location', o));
                            }
                        } catch {}
                    if (n.options.href && !n.options._builtLocation && ro(n.options.href, this.protocolAllowlist))
                        throw new Error('Redirect blocked: unsafe protocol');
                    return (n.headers.get('Location') || n.headers.set('Location', n.options.href), n);
                }),
                (this.clearCache = (n) => {
                    const r = n?.filter;
                    r !== void 0
                        ? this.stores.setCached(this.stores.cachedMatches.get().filter((s) => !r(s)))
                        : this.stores.setCached([]);
                }),
                (this.clearExpiredCache = () => {
                    const n = Date.now(),
                        r = (s) => {
                            const o = this.looseRoutesById[s.routeId];
                            if (!o.options.loader) return !0;
                            const i =
                                (s.preload
                                    ? (o.options.preloadGcTime ?? this.options.defaultPreloadGcTime)
                                    : (o.options.gcTime ?? this.options.defaultGcTime)) ?? 300 * 1e3;
                            return s.status === 'error' ? !0 : n - s.updatedAt >= i;
                        };
                    this.clearCache({ filter: r });
                }),
                (this.loadRouteChunk = Xr),
                (this.preloadRoute = async (n) => {
                    const r = n._builtLocation ?? this.buildLocation(n);
                    let s = this.matchRoutes(r, { throwOnError: !0, preload: !0, dest: n });
                    const o = new Set([...this.stores.matchesId.get(), ...this.stores.pendingIds.get()]),
                        i = new Set([...o, ...this.stores.cachedIds.get()]),
                        a = s.filter((d) => !i.has(d.id));
                    if (a.length) {
                        const d = this.stores.cachedMatches.get();
                        this.stores.setCached([...d, ...a]);
                    }
                    try {
                        return (
                            (s = await Mc({
                                router: this,
                                matches: s,
                                location: r,
                                preload: !0,
                                updateMatch: (d, u) => {
                                    o.has(d) ? (s = s.map((l) => (l.id === d ? u(l) : l))) : this.updateMatch(d, u);
                                },
                            })),
                            s
                        );
                    } catch (d) {
                        if (ct(d))
                            return d.options.reloadDocument
                                ? void 0
                                : await this.preloadRoute({ ...d.options, _fromLocation: r });
                        et(d) || console.error(d);
                        return;
                    }
                }),
                (this.matchRoute = (n, r) => {
                    const s = {
                            ...n,
                            to: n.to ? this.resolvePathWithBase(n.from || '', n.to) : void 0,
                            params: n.params || {},
                            leaveParams: !0,
                        },
                        o = this.buildLocation(s);
                    if (r?.pending && this.stores.status.get() !== 'pending') return !1;
                    const i = (r?.pending === void 0 ? !this.stores.isLoading.get() : r.pending)
                            ? this.latestLocation
                            : this.stores.resolvedLocation.get() || this.stores.location.get(),
                        a = op(o.pathname, r?.caseSensitive ?? !1, r?.fuzzy ?? !1, i.pathname, this.processedTree);
                    return !a || (n.params && !gt(a.rawParams, n.params, { partial: !0 }))
                        ? !1
                        : (r?.includeSearch ?? !0)
                          ? gt(i.search, o.search, { partial: !0 })
                              ? a.rawParams
                              : !1
                          : a.rawParams;
                }),
                (this.hasNotFoundMatch = () =>
                    this.stores.matches.get().some((n) => n.status === 'notFound' || n.globalNotFound)),
                (this.getStoreConfig = t),
                this.update({
                    defaultPreloadDelay: 50,
                    defaultPendingMs: 1e3,
                    defaultPendingMinMs: 500,
                    context: void 0,
                    ...e,
                    caseSensitive: e.caseSensitive ?? !1,
                    notFoundMode: e.notFoundMode ?? 'fuzzy',
                    stringifySearch: e.stringifySearch ?? Ep,
                    parseSearch: e.parseSearch ?? Rp,
                    protocolAllowlist: e.protocolAllowlist ?? Yh,
                }),
                typeof document < 'u' && (self.__TSR_ROUTER__ = this));
        }
        isShell() {
            return !!this.options.isShell;
        }
        isPrerendering() {
            return !!this.options.isPrerendering;
        }
        get state() {
            return this.stores.__store.get();
        }
        setRoutes({ routesById: e, routesByPath: t, processedTree: n }) {
            ((this.routesById = e), (this.routesByPath = t), (this.processedTree = n));
            const r = this.options.notFoundRoute;
            r && (r.init({ originalIndex: 99999999999 }), (this.routesById[r.id] = r));
        }
        getRouteBranch(e) {
            let t = this.routeBranchCache.get(e);
            return (t || ((t = Su(e)), this.routeBranchCache.set(e, t)), t);
        }
        get looseRoutesById() {
            return this.routesById;
        }
        getParentContext(e) {
            return e?.id ? (e.context ?? this.options.context ?? void 0) : (this.options.context ?? void 0);
        }
        matchRoutesInternal(e, t) {
            const n = this.getMatchedRoutes(e.pathname),
                { foundRoute: r, routeParams: s } = n;
            let { matchedRoutes: o } = n,
                i = !1;
            (r ? r.path !== '/' && s['**'] : tn(e.pathname)) &&
                (this.options.notFoundRoute ? (o = [...o, this.options.notFoundRoute]) : (i = !0));
            const a = i ? Kp(this.options.notFoundMode, o) : void 0,
                d = new Array(o.length),
                u = new Map();
            for (const l of this.stores.matchStores.values()) l.routeId && u.set(l.routeId, l.get());
            for (let l = 0; l < o.length; l++) {
                const c = o[l],
                    f = d[l - 1];
                let p, h, g;
                {
                    const A = f?.search ?? e.search,
                        O = f?._strictSearch ?? void 0;
                    try {
                        const L = Us(c.options.validateSearch, { ...A }) ?? void 0;
                        ((p = { ...A, ...L }), (h = { ...O, ...L }), (g = void 0));
                    } catch (L) {
                        let k = L;
                        if ((L instanceof io || (k = new io(L.message, { cause: L })), t?.throwOnError)) throw k;
                        ((p = A), (h = {}), (g = k));
                    }
                }
                const m = c.options.loaderDeps?.({ search: p }) ?? '',
                    y = m ? JSON.stringify(m) : '',
                    { interpolatedPath: b, usedParams: R } = bc({
                        path: c.fullPath,
                        params: s,
                        decoder: this.pathParamsDecoder,
                        server: this.isServer,
                    }),
                    w = c.id + b + y,
                    E = this.getMatch(w),
                    C = u.get(c.id),
                    M = E?._strictParams ?? R;
                let S;
                if (!E)
                    try {
                        Fc(c, M);
                    } catch (A) {
                        if ((et(A) || ct(A) ? (S = A) : (S = new $p(A.message, { cause: A })), t?.throwOnError))
                            throw S;
                    }
                Object.assign(s, M);
                const P = C ? 'stay' : 'enter';
                let I;
                if (E)
                    I = {
                        ...E,
                        cause: P,
                        params: C?.params ?? s,
                        _strictParams: M,
                        search: Dn(C ? C.search : E.search, p),
                        _strictSearch: h,
                    };
                else {
                    const A = c.options.loader || c.options.beforeLoad || c.lazyFn || ku(c) ? 'pending' : 'success';
                    I = {
                        id: w,
                        ssr: c.options.ssr,
                        index: l,
                        routeId: c.id,
                        params: C?.params ?? s,
                        _strictParams: M,
                        pathname: b,
                        updatedAt: Date.now(),
                        search: C ? Dn(C.search, p) : p,
                        _strictSearch: h,
                        searchError: void 0,
                        status: A,
                        isFetching: !1,
                        error: void 0,
                        paramsError: S,
                        __routeContext: void 0,
                        _nonReactive: { loadPromise: er() },
                        __beforeLoadContext: void 0,
                        context: {},
                        abortController: new AbortController(),
                        fetchCount: 0,
                        cause: P,
                        loaderDeps: C ? Bn(C.loaderDeps, m) : m,
                        invalid: !1,
                        preload: !1,
                        links: void 0,
                        scripts: void 0,
                        headScripts: void 0,
                        meta: void 0,
                        staticData: c.options.staticData || {},
                        fullPath: c.fullPath,
                    };
                }
                (t?.preload || (I.globalNotFound = a === c.id), (I.searchError = g));
                const V = this.getParentContext(f);
                ((I.context = { ...V, ...I.__routeContext, ...I.__beforeLoadContext }), (d[l] = I));
            }
            for (let l = 0; l < d.length; l++) {
                const c = d[l],
                    f = this.looseRoutesById[c.routeId],
                    p = this.getMatch(c.id),
                    h = u.get(c.routeId);
                if (((c.params = h ? Dn(h.params, s) : s), !p)) {
                    const g = d[l - 1],
                        m = this.getParentContext(g);
                    if (f.options.context) {
                        const y = {
                            deps: c.loaderDeps,
                            params: c.params,
                            context: m ?? {},
                            location: e,
                            navigate: (b) => this.navigate({ ...b, _fromLocation: e }),
                            buildLocation: this.buildLocation,
                            cause: c.cause,
                            abortController: c.abortController,
                            preload: !!c.preload,
                            matches: d,
                            routeId: f.id,
                        };
                        c.__routeContext = f.options.context(y) ?? void 0;
                    }
                    c.context = { ...m, ...c.__routeContext, ...c.__beforeLoadContext };
                }
            }
            return d;
        }
        matchRoutesLightweight(e) {
            const t = qr(this.stores.matchesId.get()),
                n = this.lightweightCache.get(e);
            if (n && n[0] === t) return n[1];
            const { matchedRoutes: r, routeParams: s } = this.getMatchedRoutes(e.pathname),
                o = qr(r),
                i = { ...e.search };
            for (const c of r)
                try {
                    Object.assign(i, Us(c.options.validateSearch, i));
                } catch {}
            const a = t && this.stores.matchStores.get(t)?.get(),
                d = a && a.routeId === o.id && a.pathname === e.pathname;
            let u;
            if (d) u = a.params;
            else {
                const c = Object.assign(Object.create(null), s);
                for (const f of r)
                    try {
                        Fc(f, c);
                    } catch {}
                u = c;
            }
            const l = { matchedRoutes: r, fullPath: o.fullPath, search: i, params: u };
            return (this.lightweightCache.set(e, [t, l]), l);
        }
    },
    io = class extends Error {},
    $p = class extends Error {};
function zp(e) {
    return {
        loadedAt: 0,
        isLoading: !1,
        isTransitioning: !1,
        status: 'idle',
        resolvedLocation: void 0,
        location: e,
        matches: [],
        statusCode: 200,
    };
}
function Us(e, t) {
    if (e == null) return {};
    if ('~standard' in e) {
        const n = e['~standard'].validate(t);
        if (n instanceof Promise) throw new io('Async validation not supported');
        if (n.issues) throw new io(JSON.stringify(n.issues, void 0, 2), { cause: n });
        return n.value;
    }
    return 'parse' in e ? e.parse(t) : typeof e == 'function' ? e(t) : {};
}
function Up({ pathname: e, routesById: t, processedTree: n }) {
    const r = Object.create(null),
        s = tn(e);
    let o;
    const i = ip(s, n, !0);
    return (
        i && ((o = i.route), Object.assign(r, i.rawParams)),
        { matchedRoutes: i?.branch || [t.__root__], routeParams: r, foundRoute: o }
    );
}
function Hp({ search: e, dest: t, destRoutes: n, _includeValidateSearch: r }) {
    return Wp(n)(e, t, r ?? !1);
}
function Wp(e) {
    let t, n;
    const r = [];
    for (const o of e) {
        const i = o.options;
        if ('search' in i) i.search?.middlewares && r.push(...i.search.middlewares);
        else if (i.preSearchFilters || i.postSearchFilters) {
            const d = ({ search: u, next: l }) => {
                const c = l(i.preSearchFilters ? i.preSearchFilters.reduce((f, p) => p(f), u) : u);
                return i.postSearchFilters ? i.postSearchFilters.reduce((f, p) => p(f), c) : c;
            };
            r.push(d);
        }
        const a = i.validateSearch;
        if (a) {
            const d = ({ search: u, next: l, meta: c }) => {
                const f = l(u);
                if (n)
                    try {
                        const p = Us(a, f);
                        if (c && p) for (const h in p) h in f || (c.defaulted ||= new Map()).set(h, p[h]);
                        return { ...f, ...p };
                    } catch {}
                return f;
            };
            r.push(d);
        }
    }
    const s = (o, i, a) => {
        if (o >= r.length) {
            if (!t.search) return {};
            if (t.search === !0) return i;
            const u = jn(t.search, i);
            return (a && (a.explicit = u), u);
        }
        const d = (u, l) => {
            if (l) {
                const c = a || {};
                return { search: s(o + 1, u, c), meta: c };
            }
            return s(o + 1, u, a);
        };
        return r[o]({ search: i, next: d, meta: a });
    };
    return function (i, a, d) {
        return ((t = a), (n = d), s(0, i));
    };
}
function Kp(e, t) {
    if (e !== 'root')
        for (let n = t.length - 1; n >= 0; n--) {
            const r = t[n];
            if (r.children) return r.id;
        }
    return Gn;
}
function Fc(e, t) {
    const n = e.options.params?.parse ?? e.options.parseParams;
    if (n) {
        const r = n(t);
        if (r === !1) throw new Error('Route params.parse returned false for a matched route');
        Object.assign(t, r);
    }
}
const Nt = Symbol.for('TSR_DEFERRED_PROMISE');
function Gp(e, t) {
    const n = e;
    return (
        n[Nt] ||
            ((n[Nt] = { status: 'pending' }),
            n
                .then((r) => {
                    ((n[Nt].status = 'success'), (n[Nt].data = r));
                })
                .catch((r) => {
                    ((n[Nt].status = 'error'), (n[Nt].error = { data: jp(r), __isServerError: !0 }));
                })),
        n
    );
}
const qp = 'Error preloading route! ☝️';
function Ou(e, t) {
    if (e) return typeof e == 'string' ? e : e[t];
}
function Qp(e) {
    return e?.scriptFormat ?? 'module';
}
function Yp(e, t, n) {
    const r = Xp(t),
        s = Ou(n, 'script') ?? r.crossOrigin;
    return {
        ...(Qp(e) === 'iife' ? { rel: 'preload', as: 'script' } : { rel: 'modulepreload' }),
        href: r.href,
        ...(s ? { crossOrigin: s } : {}),
    };
}
function Xp(e) {
    return typeof e == 'string' ? { href: e, crossOrigin: void 0 } : e;
}
function xs(e, t) {
    if (t.length === 0) return;
    if (t.length === 1) {
        e.push(t[0]);
        return;
    }
    const n = new Set();
    for (const r of t) {
        const s = JSON.stringify(r);
        n.has(s) || (n.add(s), e.push(r));
    }
}
function Jp(e) {
    return typeof e == 'string' ? { href: e, crossOrigin: void 0 } : e;
}
var Au = class {
        get to() {
            return this._to;
        }
        get id() {
            return this._id;
        }
        get path() {
            return this._path;
        }
        get fullPath() {
            return this._fullPath;
        }
        constructor(e) {
            if (
                ((this.init = (t) => {
                    this.originalIndex = t.originalIndex;
                    const n = this.options,
                        r = !n?.path && !n?.id;
                    ((this.parentRoute = this.options.getParentRoute?.()),
                        r ? (this._path = Gn) : this.parentRoute || xt());
                    let s = r ? Gn : n?.path;
                    s && s !== '/' && (s = xu(s));
                    const o = n?.id || s;
                    let i = r ? Gn : Bs([this.parentRoute.id === '__root__' ? '' : this.parentRoute.id, o]);
                    (s === '__root__' && (s = '/'), i !== '__root__' && (i = Bs(['/', i])));
                    const a = i === '__root__' ? '/' : Bs([this.parentRoute.fullPath, s]);
                    ((this._path = s), (this._id = i), (this._fullPath = a), (this._to = tn(a)));
                }),
                (this.addChildren = (t) => this._addFileChildren(t)),
                (this._addFileChildren = (t) => (
                    Array.isArray(t) && (this.children = t),
                    typeof t == 'object' && t !== null && (this.children = Object.values(t)),
                    this
                )),
                (this._addFileTypes = () => this),
                (this.updateLoader = (t) => (Object.assign(this.options, t), this)),
                (this.update = (t) => (Object.assign(this.options, t), this)),
                (this.lazy = (t) => ((this.lazyFn = t), this)),
                (this.redirect = (t) => xr({ from: this.fullPath, ...t })),
                (this.options = e || {}),
                (this.isRoot = !e?.getParentRoute),
                e?.id && e?.path)
            )
                throw new Error("Route cannot have both an 'id' and a 'path' option.");
        }
    },
    Zp = class {
        constructor({ id: e }) {
            ((this.notFound = (t) => ha({ routeId: this.id, ...t })),
                (this.redirect = (t) => xr({ from: this.id, ...t })),
                (this.id = e));
        }
    },
    em = class extends Au {
        constructor(e) {
            super(e);
        }
    },
    tm = ((e) => (
        (e[(e.AggregateError = 1)] = 'AggregateError'),
        (e[(e.ArrowFunction = 2)] = 'ArrowFunction'),
        (e[(e.ErrorPrototypeStack = 4)] = 'ErrorPrototypeStack'),
        (e[(e.ObjectAssign = 8)] = 'ObjectAssign'),
        (e[(e.BigIntTypedArray = 16)] = 'BigIntTypedArray'),
        (e[(e.RegExp = 32)] = 'RegExp'),
        e
    ))(tm || {}),
    on = Symbol.asyncIterator,
    _u = Symbol.hasInstance,
    br = Symbol.isConcatSpreadable,
    an = Symbol.iterator,
    Lu = Symbol.match,
    Du = Symbol.matchAll,
    Vu = Symbol.replace,
    Nu = Symbol.search,
    ju = Symbol.species,
    Bu = Symbol.split,
    $u = Symbol.toPrimitive,
    vr = Symbol.toStringTag,
    zu = Symbol.unscopables,
    Uu = {
        [on]: 0,
        [_u]: 1,
        [br]: 2,
        [an]: 3,
        [Lu]: 4,
        [Du]: 5,
        [Vu]: 6,
        [Nu]: 7,
        [ju]: 8,
        [Bu]: 9,
        [$u]: 10,
        [vr]: 11,
        [zu]: 12,
    },
    nm = { 0: on, 1: _u, 2: br, 3: an, 4: Lu, 5: Du, 6: Vu, 7: Nu, 8: ju, 9: Bu, 10: $u, 11: vr, 12: zu },
    x = void 0,
    rm = {
        2: !0,
        3: !1,
        1: x,
        0: null,
        4: -0,
        5: Number.POSITIVE_INFINITY,
        6: Number.NEGATIVE_INFINITY,
        7: Number.NaN,
    },
    sm = {
        0: 'Error',
        1: 'EvalError',
        2: 'RangeError',
        3: 'ReferenceError',
        4: 'SyntaxError',
        5: 'TypeError',
        6: 'URIError',
    },
    om = { 0: Error, 1: EvalError, 2: RangeError, 3: ReferenceError, 4: SyntaxError, 5: TypeError, 6: URIError };
function Me(e, t, n, r, s, o, i, a, d, u, l, c) {
    return { t: e, i: t, s: n, c: r, m: s, p: o, e: i, a, f: d, b: u, o: l, l: c };
}
function Tn(e) {
    return Me(2, x, e, x, x, x, x, x, x, x, x, x);
}
var Hu = Tn(2),
    Wu = Tn(3),
    im = Tn(1),
    am = Tn(0),
    cm = Tn(4),
    lm = Tn(5),
    um = Tn(6),
    dm = Tn(7);
function fm(e) {
    switch (e) {
        case '"':
            return '\\"';
        case '\\':
            return '\\\\';
        case `
`:
            return '\\n';
        case '\r':
            return '\\r';
        case '\b':
            return '\\b';
        case '	':
            return '\\t';
        case '\f':
            return '\\f';
        case '<':
            return '\\x3C';
        case '\u2028':
            return '\\u2028';
        case '\u2029':
            return '\\u2029';
        default:
            return x;
    }
}
function In(e) {
    let t = '',
        n = 0,
        r;
    for (let s = 0, o = e.length; s < o; s++) ((r = fm(e[s])), r && ((t += e.slice(n, s) + r), (n = s + 1)));
    return (n === 0 ? (t = e) : (t += e.slice(n)), t);
}
function hm(e) {
    switch (e) {
        case '\\\\':
            return '\\';
        case '\\"':
            return '"';
        case '\\n':
            return `
`;
        case '\\r':
            return '\r';
        case '\\b':
            return '\b';
        case '\\t':
            return '	';
        case '\\f':
            return '\f';
        case '\\x3C':
            return '<';
        case '\\u2028':
            return '\u2028';
        case '\\u2029':
            return '\u2029';
        default:
            return e;
    }
}
function Fn(e) {
    return e.replace(/(\\\\|\\"|\\n|\\r|\\b|\\t|\\f|\\u2028|\\u2029|\\x3C)/g, hm);
}
var Rs = '__SEROVAL_REFS__',
    Ku = new Map(),
    mr = new Map();
function Gu(e) {
    return Ku.has(e);
}
function pm(e) {
    return mr.has(e);
}
function mm(e) {
    if (Gu(e)) return Ku.get(e);
    throw new Km(e);
}
function gm(e) {
    if (pm(e)) return mr.get(e);
    throw new Gm(e);
}
typeof globalThis < 'u'
    ? Object.defineProperty(globalThis, Rs, { value: mr, configurable: !0, writable: !1, enumerable: !1 })
    : typeof window < 'u'
      ? Object.defineProperty(window, Rs, { value: mr, configurable: !0, writable: !1, enumerable: !1 })
      : typeof self < 'u'
        ? Object.defineProperty(self, Rs, { value: mr, configurable: !0, writable: !1, enumerable: !1 })
        : typeof global < 'u' &&
          Object.defineProperty(global, Rs, { value: mr, configurable: !0, writable: !1, enumerable: !1 });
function ma(e) {
    return e instanceof EvalError
        ? 1
        : e instanceof RangeError
          ? 2
          : e instanceof ReferenceError
            ? 3
            : e instanceof SyntaxError
              ? 4
              : e instanceof TypeError
                ? 5
                : e instanceof URIError
                  ? 6
                  : 0;
}
function ym(e) {
    let t = sm[ma(e)];
    return e.name !== t ? { name: e.name } : e.constructor.name !== t ? { name: e.constructor.name } : {};
}
function qu(e, t) {
    let n = ym(e),
        r = Object.getOwnPropertyNames(e);
    for (let s = 0, o = r.length, i; s < o; s++)
        ((i = r[s]),
            i !== 'name' &&
                i !== 'message' &&
                (i === 'stack' ? t & 4 && ((n = n || {}), (n[i] = e[i])) : ((n = n || {}), (n[i] = e[i]))));
    return n;
}
function Qu(e) {
    return Object.isFrozen(e) ? 3 : Object.isSealed(e) ? 2 : Object.isExtensible(e) ? 0 : 1;
}
function bm(e) {
    switch (e) {
        case Number.POSITIVE_INFINITY:
            return lm;
        case Number.NEGATIVE_INFINITY:
            return um;
    }
    return e !== e ? dm : Object.is(e, -0) ? cm : Me(0, x, e, x, x, x, x, x, x, x, x, x);
}
function Yu(e) {
    return Me(1, x, In(e), x, x, x, x, x, x, x, x, x);
}
function vm(e) {
    return Me(3, x, '' + e, x, x, x, x, x, x, x, x, x);
}
function wm(e) {
    return Me(4, e, x, x, x, x, x, x, x, x, x, x);
}
function Sm(e, t) {
    let n = t.valueOf();
    return Me(5, e, n !== n ? '' : t.toISOString(), x, x, x, x, x, x, x, x, x);
}
function xm(e, t) {
    return Me(6, e, x, In(t.source), t.flags, x, x, x, x, x, x, x);
}
function Rm(e, t) {
    return Me(17, e, Uu[t], x, x, x, x, x, x, x, x, x);
}
function Em(e, t) {
    return Me(18, e, In(mm(t)), x, x, x, x, x, x, x, x, x);
}
function Mm(e, t, n) {
    return Me(25, e, n, In(t), x, x, x, x, x, x, x, x);
}
function Cm(e, t, n) {
    return Me(9, e, x, x, x, x, x, n, x, x, Qu(t), x);
}
function Pm(e, t) {
    return Me(21, e, x, x, x, x, x, x, t, x, x, x);
}
function Tm(e, t, n) {
    return Me(15, e, x, t.constructor.name, x, x, x, x, n, t.byteOffset, x, t.length);
}
function Im(e, t, n) {
    return Me(16, e, x, t.constructor.name, x, x, x, x, n, t.byteOffset, x, t.byteLength);
}
function Fm(e, t, n) {
    return Me(20, e, x, x, x, x, x, x, n, t.byteOffset, x, t.byteLength);
}
function km(e, t, n) {
    return Me(13, e, ma(t), x, In(t.message), n, x, x, x, x, x, x);
}
function Om(e, t, n) {
    return Me(14, e, ma(t), x, In(t.message), n, x, x, x, x, x, x);
}
function Am(e, t) {
    return Me(7, e, x, x, x, x, x, t, x, x, x, x);
}
function _m(e, t) {
    return Me(28, x, x, x, x, x, x, [e, t], x, x, x, x);
}
function Lm(e, t) {
    return Me(30, x, x, x, x, x, x, [e, t], x, x, x, x);
}
function Dm(e, t, n) {
    return Me(31, e, x, x, x, x, x, n, t, x, x, x);
}
function Vm(e, t) {
    return Me(32, e, x, x, x, x, x, x, t, x, x, x);
}
function Nm(e, t) {
    return Me(33, e, x, x, x, x, x, x, t, x, x, x);
}
function jm(e, t) {
    return Me(34, e, x, x, x, x, x, x, t, x, x, x);
}
function Bm(e, t, n, r) {
    return Me(35, e, n, x, x, x, x, t, x, x, x, r);
}
var $m = { parsing: 1, serialization: 2, deserialization: 3 };
function zm(e) {
    return `Seroval Error (step: ${$m[e]})`;
}
var Um = (e, t) => zm(e),
    Xu = class extends Error {
        constructor(e, t) {
            (super(Um(e)), (this.cause = t));
        }
    },
    kc = class extends Xu {
        constructor(e) {
            super('parsing', e);
        }
    },
    Hm = class extends Xu {
        constructor(e) {
            super('deserialization', e);
        }
    };
function dn(e) {
    return `Seroval Error (specific: ${e})`;
}
var Ao = class extends Error {
        constructor(t) {
            (super(dn(1)), (this.value = t));
        }
    },
    Ju = class extends Error {
        constructor(e) {
            super(dn(2));
        }
    },
    Wm = class extends Error {
        constructor(t) {
            super(dn(3));
        }
    },
    us = class extends Error {
        constructor(e) {
            super(dn(4));
        }
    },
    Km = class extends Error {
        constructor(e) {
            (super(dn(5)), (this.value = e));
        }
    },
    Gm = class extends Error {
        constructor(e) {
            super(dn(6));
        }
    },
    qm = class extends Error {
        constructor(e) {
            super(dn(7));
        }
    },
    fn = class extends Error {
        constructor(e) {
            super(dn(8));
        }
    },
    Qm = class extends Error {
        constructor(e) {
            super(dn(9));
        }
    },
    Ym = class {
        constructor(e, t) {
            ((this.value = e), (this.replacement = t));
        }
    },
    _o = () => {
        let e = { p: 0, s: 0, f: 0 };
        return (
            (e.p = new Promise((t, n) => {
                ((e.s = t), (e.f = n));
            })),
            e
        );
    },
    Xm = (e, t) => {
        (e.s(t), (e.p.s = 1), (e.p.v = t));
    },
    Jm = (e, t) => {
        (e.f(t), (e.p.s = 2), (e.p.v = t));
    };
_o.toString();
Xm.toString();
Jm.toString();
var Zm = () => {
        let e = [],
            t = [],
            n = !0,
            r = !1,
            s = 0,
            o = (d, u, l) => {
                for (l = 0; l < s; l++) t[l] && t[l][u](d);
            },
            i = (d, u, l, c) => {
                for (u = 0, l = e.length; u < l; u++)
                    ((c = e[u]), !n && u === l - 1 ? d[r ? 'return' : 'throw'](c) : d.next(c));
            },
            a = (d, u) => (
                n && ((u = s++), (t[u] = d)),
                i(d),
                () => {
                    n && ((t[u] = t[s]), (t[s--] = void 0));
                }
            );
        return {
            __SEROVAL_STREAM__: !0,
            on: (d) => a(d),
            next: (d) => {
                n && (e.push(d), o(d, 'next'));
            },
            throw: (d) => {
                n && (e.push(d), o(d, 'throw'), (n = !1), (r = !1), (t.length = 0));
            },
            return: (d) => {
                n && (e.push(d), o(d, 'return'), (n = !1), (r = !0), (t.length = 0));
            },
        };
    },
    eg = (e) => (t) => () => {
        let n = 0,
            r = {
                [e]: () => r,
                next: () => {
                    if (n > t.d) return { done: !0, value: void 0 };
                    let s = n++,
                        o = t.v[s];
                    if (s === t.t) throw o;
                    return { done: s === t.d, value: o };
                },
            };
        return r;
    },
    tg = (e, t) => (n) => () => {
        let r = 0,
            s = -1,
            o = !1,
            i = [],
            a = [],
            d = (l = 0, c = a.length) => {
                for (; l < c; l++) a[l].s({ done: !0, value: void 0 });
            };
        n.on({
            next: (l) => {
                let c = a.shift();
                (c && c.s({ done: !1, value: l }), i.push(l));
            },
            throw: (l) => {
                let c = a.shift();
                (c && c.f(l), d(), (s = i.length), (o = !0), i.push(l));
            },
            return: (l) => {
                let c = a.shift();
                (c && c.s({ done: !0, value: l }), d(), (s = i.length), i.push(l));
            },
        });
        let u = {
            [e]: () => u,
            next: () => {
                if (s === -1) {
                    let f = r++;
                    if (f >= i.length) {
                        let p = t();
                        return (a.push(p), p.p);
                    }
                    return { done: !1, value: i[f] };
                }
                if (r > s) return { done: !0, value: void 0 };
                let l = r++,
                    c = i[l];
                if (l !== s) return { done: !1, value: c };
                if (o) throw c;
                return { done: !0, value: c };
            },
        };
        return u;
    },
    Zu = (e) => {
        let t = atob(e),
            n = t.length,
            r = new Uint8Array(n);
        for (let s = 0; s < n; s++) r[s] = t.charCodeAt(s);
        return r.buffer;
    };
Zu.toString();
function ng(e) {
    return '__SEROVAL_SEQUENCE__' in e;
}
function ed(e, t, n) {
    return { __SEROVAL_SEQUENCE__: !0, v: e, t, d: n };
}
function rg(e) {
    let t = [],
        n = -1,
        r = -1,
        s = e[an]();
    for (;;)
        try {
            let o = s.next();
            if ((t.push(o.value), o.done)) {
                r = t.length - 1;
                break;
            }
        } catch (o) {
            ((n = t.length), t.push(o));
        }
    return ed(t, n, r);
}
var sg = eg(an);
function og(e) {
    return sg(e);
}
var ig = {},
    ag = {},
    cg = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
function lg(e) {
    return '__SEROVAL_STREAM__' in e;
}
function sr() {
    return Zm();
}
function ug(e) {
    let t = sr(),
        n = e[on]();
    async function r() {
        try {
            let s = await n.next();
            s.done ? t.return(s.value) : (t.next(s.value), await r());
        } catch (s) {
            t.throw(s);
        }
    }
    return (r().catch(() => {}), t);
}
var dg = tg(on, _o);
function fg(e) {
    return dg(e);
}
async function hg(e) {
    try {
        return [1, await e];
    } catch (t) {
        return [0, t];
    }
}
function pg(e, t) {
    return {
        plugins: t.plugins,
        mode: e,
        marked: new Set(),
        features: 63 ^ (t.disabledFeatures || 0),
        refs: t.refs || new Map(),
        depthLimit: t.depthLimit || 1e3,
    };
}
function Hs(e, t) {
    e.marked.add(t);
}
function mg(e, t) {
    let n = e.refs.size;
    return (e.refs.set(t, n), n);
}
function Lo(e, t) {
    let n = e.refs.get(t);
    return n != null ? (Hs(e, n), { type: 1, value: wm(n) }) : { type: 0, value: mg(e, t) };
}
function ga(e, t) {
    let n = Lo(e, t);
    return n.type === 1 ? n : Gu(t) ? { type: 2, value: Em(n.value, t) } : n;
}
function zn(e, t) {
    let n = ga(e, t);
    if (n.type !== 0) return n.value;
    if (t in Uu) return Rm(n.value, t);
    throw new Ao(t);
}
function Do(e, t) {
    let n = Lo(e, cg[t]);
    return n.type === 1 ? n.value : Me(26, n.value, t, x, x, x, x, x, x, x, x, x);
}
function gg(e) {
    let t = Lo(e, ig);
    return t.type === 1 ? t.value : Me(27, t.value, x, x, x, x, x, x, zn(e, an), x, x, x);
}
function yg(e) {
    let t = Lo(e, ag);
    return t.type === 1 ? t.value : Me(29, t.value, x, x, x, x, x, [Do(e, 1), zn(e, on)], x, x, x, x);
}
function bg(e, t, n, r) {
    return Me(n ? 11 : 10, e, x, x, x, r, x, x, x, x, Qu(t), x);
}
function vg(e, t, n, r) {
    return Me(8, t, x, x, x, x, { k: n, v: r }, x, Do(e, 0), x, x, x);
}
function wg(e, t, n) {
    let r = new Uint8Array(n),
        s = '';
    for (let o = 0, i = r.length; o < i; o++) s += String.fromCharCode(r[o]);
    return Me(19, t, In(btoa(s)), x, x, x, x, x, Do(e, 5), x, x, x);
}
function Sg(e, t) {
    return { base: pg(e, t), child: void 0 };
}
var xg = class {
    constructor(e, t) {
        ((this._p = e), (this.depth = t));
    }
    parse(e) {
        return qe(this._p, this.depth, e);
    }
};
async function Rg(e, t, n) {
    let r = [];
    for (let s = 0, o = n.length; s < o; s++) s in n ? (r[s] = await qe(e, t, n[s])) : (r[s] = 0);
    return r;
}
async function Eg(e, t, n, r) {
    return Cm(n, r, await Rg(e, t, r));
}
async function ya(e, t, n) {
    let r = Object.entries(n),
        s = [],
        o = [];
    for (let i = 0, a = r.length; i < a; i++) (s.push(In(r[i][0])), o.push(await qe(e, t, r[i][1])));
    return (
        an in n && (s.push(zn(e.base, an)), o.push(_m(gg(e.base), await qe(e, t, rg(n))))),
        on in n && (s.push(zn(e.base, on)), o.push(Lm(yg(e.base), await qe(e, t, ug(n))))),
        vr in n && (s.push(zn(e.base, vr)), o.push(Yu(n[vr]))),
        br in n && (s.push(zn(e.base, br)), o.push(n[br] ? Hu : Wu)),
        { k: s, v: o }
    );
}
async function ri(e, t, n, r, s) {
    return bg(n, r, s, await ya(e, t, r));
}
async function Mg(e, t, n, r) {
    return Pm(n, await qe(e, t, r.valueOf()));
}
async function Cg(e, t, n, r) {
    return Tm(n, r, await qe(e, t, r.buffer));
}
async function Pg(e, t, n, r) {
    return Im(n, r, await qe(e, t, r.buffer));
}
async function Tg(e, t, n, r) {
    return Fm(n, r, await qe(e, t, r.buffer));
}
async function Oc(e, t, n, r) {
    let s = qu(r, e.base.features);
    return km(n, r, s ? await ya(e, t, s) : x);
}
async function Ig(e, t, n, r) {
    let s = qu(r, e.base.features);
    return Om(n, r, s ? await ya(e, t, s) : x);
}
async function Fg(e, t, n, r) {
    let s = [],
        o = [];
    for (let [i, a] of r.entries()) (s.push(await qe(e, t, i)), o.push(await qe(e, t, a)));
    return vg(e.base, n, s, o);
}
async function kg(e, t, n, r) {
    let s = [];
    for (let o of r.keys()) s.push(await qe(e, t, o));
    return Am(n, s);
}
async function td(e, t, n, r) {
    let s = e.base.plugins;
    if (s)
        for (let o = 0, i = s.length; o < i; o++) {
            let a = s[o];
            if (a.parse.async && a.test(r)) return Mm(n, a.tag, await a.parse.async(r, new xg(e, t), { id: n }));
        }
    return x;
}
async function Og(e, t, n, r) {
    let [s, o] = await hg(r);
    return Me(12, n, s, x, x, x, x, x, await qe(e, t, o), x, x, x);
}
function Ag(e, t, n, r, s) {
    let o = [],
        i = n.on({
            next: (a) => {
                (Hs(this.base, t),
                    qe(this, e, a).then(
                        (d) => {
                            o.push(Vm(t, d));
                        },
                        (d) => {
                            (s(d), i());
                        }
                    ));
            },
            throw: (a) => {
                (Hs(this.base, t),
                    qe(this, e, a).then(
                        (d) => {
                            (o.push(Nm(t, d)), r(o), i());
                        },
                        (d) => {
                            (s(d), i());
                        }
                    ));
            },
            return: (a) => {
                (Hs(this.base, t),
                    qe(this, e, a).then(
                        (d) => {
                            (o.push(jm(t, d)), r(o), i());
                        },
                        (d) => {
                            (s(d), i());
                        }
                    ));
            },
        });
}
async function _g(e, t, n, r) {
    return Dm(n, Do(e.base, 4), await new Promise(Ag.bind(e, t, n, r)));
}
async function Lg(e, t, n, r) {
    let s = [];
    for (let o = 0, i = r.v.length; o < i; o++) s[o] = await qe(e, t, r.v[o]);
    return Bm(n, s, r.t, r.d);
}
async function Dg(e, t, n, r) {
    if (Array.isArray(r)) return Eg(e, t, n, r);
    if (lg(r)) return _g(e, t, n, r);
    if (ng(r)) return Lg(e, t, n, r);
    let s = r.constructor;
    if (s === Ym) return qe(e, t, r.replacement);
    let o = await td(e, t, n, r);
    if (o) return o;
    switch (s) {
        case Object:
            return ri(e, t, n, r, !1);
        case x:
            return ri(e, t, n, r, !0);
        case Date:
            return Sm(n, r);
        case Error:
        case EvalError:
        case RangeError:
        case ReferenceError:
        case SyntaxError:
        case TypeError:
        case URIError:
            return Oc(e, t, n, r);
        case Number:
        case Boolean:
        case String:
        case BigInt:
            return Mg(e, t, n, r);
        case ArrayBuffer:
            return wg(e.base, n, r);
        case Int8Array:
        case Int16Array:
        case Int32Array:
        case Uint8Array:
        case Uint16Array:
        case Uint32Array:
        case Uint8ClampedArray:
        case Float32Array:
        case Float64Array:
            return Cg(e, t, n, r);
        case DataView:
            return Tg(e, t, n, r);
        case Map:
            return Fg(e, t, n, r);
        case Set:
            return kg(e, t, n, r);
    }
    if (s === Promise || r instanceof Promise) return Og(e, t, n, r);
    let i = e.base.features;
    if (i & 32 && s === RegExp) return xm(n, r);
    if (i & 16)
        switch (s) {
            case BigInt64Array:
            case BigUint64Array:
                return Pg(e, t, n, r);
        }
    if (i & 1 && typeof AggregateError < 'u' && (s === AggregateError || r instanceof AggregateError))
        return Ig(e, t, n, r);
    if (r instanceof Error) return Oc(e, t, n, r);
    if (an in r || on in r) return ri(e, t, n, r, !!s);
    throw new Ao(r);
}
async function Vg(e, t, n) {
    let r = ga(e.base, n);
    if (r.type !== 0) return r.value;
    let s = await td(e, t, r.value, n);
    if (s) return s;
    throw new Ao(n);
}
async function qe(e, t, n) {
    switch (typeof n) {
        case 'boolean':
            return n ? Hu : Wu;
        case 'undefined':
            return im;
        case 'string':
            return Yu(n);
        case 'number':
            return bm(n);
        case 'bigint':
            return vm(n);
        case 'object': {
            if (n) {
                let r = ga(e.base, n);
                return r.type === 0 ? await Dg(e, t + 1, r.value, n) : r.value;
            }
            return am;
        }
        case 'symbol':
            return zn(e.base, n);
        case 'function':
            return Vg(e, t, n);
        default:
            throw new Ao(n);
    }
}
async function Ng(e, t) {
    try {
        return await qe(e, 0, t);
    } catch (n) {
        throw n instanceof kc ? n : new kc(n);
    }
}
var jg = ((e) => ((e[(e.Vanilla = 1)] = 'Vanilla'), (e[(e.Cross = 2)] = 'Cross'), e))(jg || {});
function nd(e, t) {
    for (let n = 0, r = t.length; n < r; n++) {
        let s = t[n];
        e.has(s) || (e.add(s), s.extends && nd(e, s.extends));
    }
}
function rd(e) {
    if (e) {
        let t = new Set();
        return (nd(t, e), [...t]);
    }
}
function Bg(e) {
    switch (e) {
        case 'Int8Array':
            return Int8Array;
        case 'Int16Array':
            return Int16Array;
        case 'Int32Array':
            return Int32Array;
        case 'Uint8Array':
            return Uint8Array;
        case 'Uint16Array':
            return Uint16Array;
        case 'Uint32Array':
            return Uint32Array;
        case 'Uint8ClampedArray':
            return Uint8ClampedArray;
        case 'Float32Array':
            return Float32Array;
        case 'Float64Array':
            return Float64Array;
        case 'BigInt64Array':
            return BigInt64Array;
        case 'BigUint64Array':
            return BigUint64Array;
        default:
            throw new qm(e);
    }
}
var $g = 1e6,
    zg = 1e4,
    Ug = 2e4;
function sd(e, t) {
    switch (t) {
        case 3:
            return Object.freeze(e);
        case 1:
            return Object.preventExtensions(e);
        case 2:
            return Object.seal(e);
        default:
            return e;
    }
}
var Hg = 1e3;
function Wg(e, t) {
    var n;
    let r = t.refs || new Map();
    return (
        'types' in r || Object.assign(r, { types: new Map() }),
        {
            mode: e,
            plugins: t.plugins,
            refs: r,
            features: (n = t.features) != null ? n : 63 ^ (t.disabledFeatures || 0),
            depthLimit: t.depthLimit || Hg,
        }
    );
}
function Kg(e) {
    return { mode: 2, base: Wg(2, e), child: x };
}
var Gg = class {
    constructor(e, t) {
        ((this._p = e), (this.depth = t));
    }
    deserialize(e) {
        return Fe(this._p, this.depth, e);
    }
};
function od(e, t) {
    if (t < 0 || !Number.isFinite(t) || !Number.isInteger(t)) throw new fn({ t: 4, i: t });
    if (e.refs.has(t)) throw new Error('Conflicted ref id: ' + t);
}
function qg(e, t, n) {
    return (od(e.base, t), e.state.marked.has(t) && e.base.refs.set(t, n), n);
}
function Qg(e, t, n) {
    return (od(e.base, t), e.base.refs.set(t, n), n);
}
function Qe(e, t, n) {
    return e.mode === 1 ? qg(e, t, n) : Qg(e, t, n);
}
function Oi(e, t, n) {
    if (Object.hasOwn(t, n)) return t[n];
    throw new fn(e);
}
function Yg(e, t) {
    return Qe(e, t.i, gm(Fn(t.s)));
}
function Xg(e, t, n) {
    let r = n.a,
        s = r.length,
        o = Qe(e, n.i, new Array(s));
    for (let i = 0, a; i < s; i++) ((a = r[i]), a && (o[i] = Fe(e, t, a)));
    return (sd(o, n.o), o);
}
function Jg(e) {
    switch (e) {
        case 'constructor':
        case '__proto__':
        case 'prototype':
        case '__defineGetter__':
        case '__defineSetter__':
        case '__lookupGetter__':
        case '__lookupSetter__':
            return !1;
        default:
            return !0;
    }
}
function Zg(e) {
    switch (e) {
        case on:
        case br:
        case vr:
        case an:
            return !0;
        default:
            return !1;
    }
}
function Ac(e, t, n) {
    Jg(t) ? (e[t] = n) : Object.defineProperty(e, t, { value: n, configurable: !0, enumerable: !0, writable: !0 });
}
function ey(e, t, n, r, s) {
    if (typeof r == 'string') Ac(n, Fn(r), Fe(e, t, s));
    else {
        let o = Fe(e, t, r);
        switch (typeof o) {
            case 'string':
                Ac(n, o, Fe(e, t, s));
                break;
            case 'symbol':
                Zg(o) && (n[o] = Fe(e, t, s));
                break;
            default:
                throw new fn(r);
        }
    }
}
function id(e, t, n) {
    e.base.refs.types.set(t, n);
}
function ds(e, t, n, r) {
    if (e.base.refs.types.get(n) !== r) throw new fn(t);
}
function ad(e, t, n, r) {
    let s = n.k;
    if (s.length > 0) for (let o = 0, i = n.v, a = s.length; o < a; o++) ey(e, t, r, s[o], i[o]);
    return r;
}
function ty(e, t, n) {
    let r = Qe(e, n.i, n.t === 10 ? {} : Object.create(null));
    return (ad(e, t, n.p, r), sd(r, n.o), r);
}
function ny(e, t) {
    return Qe(e, t.i, new Date(t.s));
}
function ry(e, t) {
    if (e.base.features & 32) {
        let n = Fn(t.c);
        if (n.length > Ug) throw new fn(t);
        return Qe(e, t.i, new RegExp(n, t.m));
    }
    throw new Ju(t);
}
function sy(e, t, n) {
    let r = Qe(e, n.i, new Set());
    for (let s = 0, o = n.a, i = o.length; s < i; s++) r.add(Fe(e, t, o[s]));
    return r;
}
function oy(e, t, n) {
    let r = Qe(e, n.i, new Map());
    for (let s = 0, o = n.e.k, i = n.e.v, a = o.length; s < a; s++) r.set(Fe(e, t, o[s]), Fe(e, t, i[s]));
    return r;
}
function iy(e, t) {
    if (t.s.length > $g) throw new fn(t);
    return Qe(e, t.i, Zu(Fn(t.s)));
}
function ay(e, t, n) {
    var r;
    let s = Bg(n.c),
        o = Fe(e, t, n.f),
        i = (r = n.b) != null ? r : 0;
    if (i < 0 || i > o.byteLength) throw new fn(n);
    return Qe(e, n.i, new s(o, i, n.l));
}
function cy(e, t, n) {
    var r;
    let s = Fe(e, t, n.f),
        o = (r = n.b) != null ? r : 0;
    if (o < 0 || o > s.byteLength) throw new fn(n);
    return Qe(e, n.i, new DataView(s, o, n.l));
}
function cd(e, t, n, r) {
    if (n.p) {
        let s = ad(e, t, n.p, {});
        Object.defineProperties(r, Object.getOwnPropertyDescriptors(s));
    }
    return r;
}
function ly(e, t, n) {
    let r = Qe(e, n.i, new AggregateError([], Fn(n.m)));
    return cd(e, t, n, r);
}
function uy(e, t, n) {
    let r = Oi(n, om, n.s),
        s = Qe(e, n.i, new r(Fn(n.m)));
    return cd(e, t, n, s);
}
function dy(e, t, n) {
    let r = _o(),
        s = Qe(e, n.i, r.p),
        o = Fe(e, t, n.f);
    return (n.s ? r.s(o) : r.f(o), s);
}
function fy(e, t, n) {
    return Qe(e, n.i, Object(Fe(e, t, n.f)));
}
function hy(e, t, n) {
    let r = e.base.plugins;
    if (r) {
        let s = Fn(n.c);
        for (let o = 0, i = r.length; o < i; o++) {
            let a = r[o];
            if (a.tag === s) return Qe(e, n.i, a.deserialize(n.s, new Gg(e, t), { id: n.i }));
        }
    }
    throw new Wm(n.c);
}
function py(e, t) {
    let n = Qe(e, t.i, Qe(e, t.s, _o()).p);
    return (id(e, t.s, 22), n);
}
function my(e, t, n) {
    let r = e.base.refs.get(n.i);
    if (r) return (ds(e, n, n.i, 22), r.s(Fe(e, t, n.a[1])), x);
    throw new us('Promise');
}
function gy(e, t, n) {
    let r = e.base.refs.get(n.i);
    if (r) return (ds(e, n, n.i, 22), r.f(Fe(e, t, n.a[1])), x);
    throw new us('Promise');
}
function yy(e, t, n) {
    Fe(e, t, n.a[0]);
    let r = Fe(e, t, n.a[1]);
    return og(r);
}
function by(e, t, n) {
    Fe(e, t, n.a[0]);
    let r = Fe(e, t, n.a[1]);
    return fg(r);
}
function vy(e, t, n) {
    let r = Qe(e, n.i, sr());
    id(e, n.i, 31);
    let s = n.a,
        o = s.length;
    if (o) for (let i = 0; i < o; i++) Fe(e, t, s[i]);
    return r;
}
function wy(e, t, n) {
    let r = e.base.refs.get(n.i);
    if (r) return (ds(e, n, n.i, 31), r.next(Fe(e, t, n.f)), x);
    throw new us('Stream');
}
function Sy(e, t, n) {
    let r = e.base.refs.get(n.i);
    if (r) return (ds(e, n, n.i, 31), r.throw(Fe(e, t, n.f)), x);
    throw new us('Stream');
}
function xy(e, t, n) {
    let r = e.base.refs.get(n.i);
    if (r) return (ds(e, n, n.i, 31), r.return(Fe(e, t, n.f)), x);
    throw new us('Stream');
}
function Ry(e, t, n) {
    return (Fe(e, t, n.f), x);
}
function Ey(e, t, n) {
    return (Fe(e, t, n.a[1]), x);
}
function My(e, t, n) {
    let r = Qe(e, n.i, ed([], n.s, n.l));
    for (let s = 0, o = n.a.length; s < o; s++) r.v[s] = Fe(e, t, n.a[s]);
    return r;
}
function Fe(e, t, n) {
    if (t > e.base.depthLimit) throw new Qm(e.base.depthLimit);
    switch (((t += 1), n.t)) {
        case 2:
            return Oi(n, rm, n.s);
        case 0:
            return Number(n.s);
        case 1:
            return Fn(String(n.s));
        case 3:
            if (String(n.s).length > zg) throw new fn(n);
            return BigInt(n.s);
        case 4:
            return e.base.refs.get(n.i);
        case 18:
            return Yg(e, n);
        case 9:
            return Xg(e, t, n);
        case 10:
        case 11:
            return ty(e, t, n);
        case 5:
            return ny(e, n);
        case 6:
            return ry(e, n);
        case 7:
            return sy(e, t, n);
        case 8:
            return oy(e, t, n);
        case 19:
            return iy(e, n);
        case 16:
        case 15:
            return ay(e, t, n);
        case 20:
            return cy(e, t, n);
        case 14:
            return ly(e, t, n);
        case 13:
            return uy(e, t, n);
        case 12:
            return dy(e, t, n);
        case 17:
            return Oi(n, nm, n.s);
        case 21:
            return fy(e, t, n);
        case 25:
            return hy(e, t, n);
        case 22:
            return py(e, n);
        case 23:
            return my(e, t, n);
        case 24:
            return gy(e, t, n);
        case 28:
            return yy(e, t, n);
        case 30:
            return by(e, t, n);
        case 31:
            return vy(e, t, n);
        case 32:
            return wy(e, t, n);
        case 33:
            return Sy(e, t, n);
        case 34:
            return xy(e, t, n);
        case 27:
            return Ry(e, t, n);
        case 29:
            return Ey(e, t, n);
        case 35:
            return My(e, t, n);
        default:
            throw new Ju(n);
    }
}
function Cy(e, t) {
    try {
        return Fe(e, 0, t);
    } catch (n) {
        throw new Hm(n);
    }
}
var Py = () => T;
Py.toString();
function _c(e, t) {
    let n = rd(t.plugins),
        r = Kg({
            plugins: n,
            refs: t.refs,
            features: t.features,
            disabledFeatures: t.disabledFeatures,
            depthLimit: t.depthLimit,
        });
    return Cy(r, e);
}
async function Ty(e, t = {}) {
    let n = rd(t.plugins),
        r = Sg(1, { plugins: n, disabledFeatures: t.disabledFeatures });
    return { t: await Ng(r, e), f: r.base.features, m: Array.from(r.base.marked) };
}
function Iy(e) {
    return {
        tag: '$TSR/t/' + e.key,
        test: e.test,
        parse: {
            sync(t, n, r) {
                return { v: n.parse(e.toSerializable(t)) };
            },
            async async(t, n, r) {
                return { v: await n.parse(e.toSerializable(t)) };
            },
            stream(t, n, r) {
                return { v: n.parse(e.toSerializable(t)) };
            },
        },
        serialize: void 0,
        deserialize(t, n, r) {
            return e.fromSerializable(n.deserialize(t.v));
        },
    };
}
var Fy = class {
    constructor(e, t) {
        ((this.stream = e), (this.hint = t?.hint ?? 'binary'));
    }
};
const ao = globalThis.Buffer,
    ld = !!ao && typeof ao.from == 'function';
function ud(e) {
    if (e.length === 0) return '';
    if (ld) return ao.from(e).toString('base64');
    const t = 32768,
        n = [];
    for (let r = 0; r < e.length; r += t) {
        const s = e.subarray(r, r + t);
        n.push(String.fromCharCode.apply(null, s));
    }
    return btoa(n.join(''));
}
function dd(e) {
    if (e.length === 0) return new Uint8Array(0);
    if (ld) {
        const r = ao.from(e, 'base64');
        return new Uint8Array(r.buffer, r.byteOffset, r.byteLength);
    }
    const t = atob(e),
        n = new Uint8Array(t.length);
    for (let r = 0; r < t.length; r++) n[r] = t.charCodeAt(r);
    return n;
}
const _r = Object.create(null),
    Lr = Object.create(null),
    ky = (e) =>
        new ReadableStream({
            start(t) {
                e.on({
                    next(n) {
                        try {
                            t.enqueue(dd(n));
                        } catch {}
                    },
                    throw(n) {
                        t.error(n);
                    },
                    return() {
                        try {
                            t.close();
                        } catch {}
                    },
                });
            },
        }),
    Oy = new TextEncoder(),
    Ay = (e) =>
        new ReadableStream({
            start(t) {
                e.on({
                    next(n) {
                        try {
                            typeof n == 'string' ? t.enqueue(Oy.encode(n)) : t.enqueue(dd(n.$b64));
                        } catch {}
                    },
                    throw(n) {
                        t.error(n);
                    },
                    return() {
                        try {
                            t.close();
                        } catch {}
                    },
                });
            },
        }),
    _y =
        '(s=>new ReadableStream({start(c){s.on({next(b){try{const d=atob(b),a=new Uint8Array(d.length);for(let i=0;i<d.length;i++)a[i]=d.charCodeAt(i);c.enqueue(a)}catch(_){}},throw(e){c.error(e)},return(){try{c.close()}catch(_){}}})}}))',
    Ly =
        "(s=>{const e=new TextEncoder();return new ReadableStream({start(c){s.on({next(v){try{if(typeof v==='string'){c.enqueue(e.encode(v))}else{const d=atob(v.$b64),a=new Uint8Array(d.length);for(let i=0;i<d.length;i++)a[i]=d.charCodeAt(i);c.enqueue(a)}}catch(_){}},throw(x){c.error(x)},return(){try{c.close()}catch(_){}}})}})})";
function Lc(e) {
    const t = sr(),
        n = e.getReader();
    return (
        (async () => {
            try {
                for (;;) {
                    const { done: r, value: s } = await n.read();
                    if (r) {
                        t.return(void 0);
                        break;
                    }
                    t.next(ud(s));
                }
            } catch (r) {
                t.throw(r);
            } finally {
                n.releaseLock();
            }
        })(),
        t
    );
}
function Dc(e) {
    const t = sr(),
        n = e.getReader(),
        r = new TextDecoder('utf-8', { fatal: !0 });
    return (
        (async () => {
            try {
                for (;;) {
                    const { done: s, value: o } = await n.read();
                    if (s) {
                        try {
                            const i = r.decode();
                            i.length > 0 && t.next(i);
                        } catch {}
                        t.return(void 0);
                        break;
                    }
                    try {
                        const i = r.decode(o, { stream: !0 });
                        i.length > 0 && t.next(i);
                    } catch {
                        t.next({ $b64: ud(o) });
                    }
                }
            } catch (s) {
                t.throw(s);
            } finally {
                n.releaseLock();
            }
        })(),
        t
    );
}
const Dy = {
    tag: 'tss/RawStream',
    extends: [
        {
            tag: 'tss/RawStreamFactory',
            test(e) {
                return e === _r;
            },
            parse: {
                sync(e, t, n) {
                    return {};
                },
                async async(e, t, n) {
                    return {};
                },
                stream(e, t, n) {
                    return {};
                },
            },
            serialize(e, t, n) {
                return _y;
            },
            deserialize(e, t, n) {
                return _r;
            },
        },
        {
            tag: 'tss/RawStreamFactoryText',
            test(e) {
                return e === Lr;
            },
            parse: {
                sync(e, t, n) {
                    return {};
                },
                async async(e, t, n) {
                    return {};
                },
                stream(e, t, n) {
                    return {};
                },
            },
            serialize(e, t, n) {
                return Ly;
            },
            deserialize(e, t, n) {
                return Lr;
            },
        },
    ],
    test(e) {
        return e instanceof Fy;
    },
    parse: {
        sync(e, t, n) {
            const r = e.hint === 'text' ? Lr : _r;
            return { hint: t.parse(e.hint), factory: t.parse(r), stream: t.parse(sr()) };
        },
        async async(e, t, n) {
            const r = e.hint === 'text' ? Lr : _r,
                s = e.hint === 'text' ? Dc(e.stream) : Lc(e.stream);
            return { hint: await t.parse(e.hint), factory: await t.parse(r), stream: await t.parse(s) };
        },
        stream(e, t, n) {
            const r = e.hint === 'text' ? Lr : _r,
                s = e.hint === 'text' ? Dc(e.stream) : Lc(e.stream);
            return { hint: t.parse(e.hint), factory: t.parse(r), stream: t.parse(s) };
        },
    },
    serialize(e, t, n) {
        return '(' + t.serialize(e.factory) + ')(' + t.serialize(e.stream) + ')';
    },
    deserialize(e, t, n) {
        const r = t.deserialize(e.stream);
        return t.deserialize(e.hint) === 'text' ? Ay(r) : ky(r);
    },
};
function Vy(e) {
    return {
        tag: 'tss/RawStream',
        test: () => !1,
        parse: {},
        serialize() {
            throw new Error('RawStreamDeserializePlugin.serialize should not be called. Client only deserializes.');
        },
        deserialize(t, n, r) {
            return e(typeof n?.deserialize == 'function' ? n.deserialize(t.streamId) : t.streamId);
        },
    };
}
const Ny = {
    tag: '$TSR/Error',
    test(e) {
        return e instanceof Error;
    },
    parse: {
        sync(e, t) {
            return { message: t.parse(e.message) };
        },
        async async(e, t) {
            return { message: await t.parse(e.message) };
        },
        stream(e, t) {
            return { message: t.parse(e.message) };
        },
    },
    serialize(e, t) {
        return 'new Error(' + t.serialize(e.message) + ')';
    },
    deserialize(e, t) {
        return new Error(t.deserialize(e.message));
    },
};
var bn = {},
    fd = (e) =>
        new ReadableStream({
            start: (t) => {
                e.on({
                    next: (n) => {
                        try {
                            t.enqueue(n);
                        } catch {}
                    },
                    throw: (n) => {
                        t.error(n);
                    },
                    return: () => {
                        try {
                            t.close();
                        } catch {}
                    },
                });
            },
        }),
    jy = {
        tag: 'seroval-plugins/web/ReadableStreamFactory',
        test(e) {
            return e === bn;
        },
        parse: {
            sync() {
                return bn;
            },
            async async() {
                return await Promise.resolve(bn);
            },
            stream() {
                return bn;
            },
        },
        serialize() {
            return fd.toString();
        },
        deserialize() {
            return bn;
        },
    };
function Vc(e) {
    let t = sr(),
        n = e.getReader();
    async function r() {
        try {
            let s = await n.read();
            s.done ? t.return(s.value) : (t.next(s.value), await r());
        } catch (s) {
            t.throw(s);
        }
    }
    return (r().catch(() => {}), t);
}
var By = {
        tag: 'seroval/plugins/web/ReadableStream',
        extends: [jy],
        test(e) {
            return typeof ReadableStream > 'u' ? !1 : e instanceof ReadableStream;
        },
        parse: {
            sync(e, t) {
                return { factory: t.parse(bn), stream: t.parse(sr()) };
            },
            async async(e, t) {
                return { factory: await t.parse(bn), stream: await t.parse(Vc(e)) };
            },
            stream(e, t) {
                return { factory: t.parse(bn), stream: t.parse(Vc(e)) };
            },
        },
        serialize(e, t) {
            return '(' + t.serialize(e.factory) + ')(' + t.serialize(e.stream) + ')';
        },
        deserialize(e, t) {
            let n = t.deserialize(e.stream);
            return fd(n);
        },
    },
    $y = By;
const zy = [Ny, Dy, $y];
function Uy() {
    return [...(ua()?.serializationAdapters?.map(Iy) ?? []), ...zy];
}
var Nc = new TextDecoder(),
    Hy = new Uint8Array(0),
    jc = 16 * 1024 * 1024,
    Bc = 32 * 1024 * 1024,
    $c = 1024,
    zc = 1e5;
function Wy(e) {
    const t = new Map(),
        n = new Map(),
        r = new Set();
    let s = !1,
        o = null,
        i = 0,
        a;
    const d = new ReadableStream({
        start(c) {
            a = c;
        },
        cancel() {
            s = !0;
            try {
                o?.cancel();
            } catch {}
            (t.forEach((c) => {
                try {
                    c.error(new Error('Framed response cancelled'));
                } catch {}
            }),
                t.clear(),
                n.clear(),
                r.clear());
        },
    });
    function u(c) {
        const f = n.get(c);
        if (f) return f;
        if (r.has(c))
            return new ReadableStream({
                start(h) {
                    h.close();
                },
            });
        if (n.size >= $c) throw new Error(`Too many raw streams in framed response (max ${$c})`);
        const p = new ReadableStream({
            start(h) {
                t.set(c, h);
            },
            cancel() {
                (r.add(c), t.delete(c), n.delete(c));
            },
        });
        return (n.set(c, p), p);
    }
    function l(c) {
        return (u(c), t.get(c));
    }
    return (
        (async () => {
            const c = e.getReader();
            o = c;
            const f = [];
            let p = 0;
            function h() {
                if (p < 9) return null;
                const m = f[0];
                if (m.length >= 9)
                    return {
                        type: m[0],
                        streamId: ((m[1] << 24) | (m[2] << 16) | (m[3] << 8) | m[4]) >>> 0,
                        length: ((m[5] << 24) | (m[6] << 16) | (m[7] << 8) | m[8]) >>> 0,
                    };
                const y = new Uint8Array(9);
                let b = 0,
                    R = 9;
                for (let w = 0; w < f.length && R > 0; w++) {
                    const E = f[w],
                        C = Math.min(E.length, R);
                    (y.set(E.subarray(0, C), b), (b += C), (R -= C));
                }
                return {
                    type: y[0],
                    streamId: ((y[1] << 24) | (y[2] << 16) | (y[3] << 8) | y[4]) >>> 0,
                    length: ((y[5] << 24) | (y[6] << 16) | (y[7] << 8) | y[8]) >>> 0,
                };
            }
            function g(m) {
                if (m === 0) return Hy;
                const y = f[0];
                if (y && y.length >= m) {
                    const E = y.subarray(0, m);
                    return (y.length === m ? f.shift() : (f[0] = y.subarray(m)), (p -= m), E);
                }
                const b = new Uint8Array(m);
                let R = 0,
                    w = m;
                for (; w > 0 && f.length > 0;) {
                    const E = f[0];
                    if (!E) break;
                    const C = Math.min(E.length, w);
                    (b.set(E.subarray(0, C), R),
                        (R += C),
                        (w -= C),
                        C === E.length ? f.shift() : (f[0] = E.subarray(C)));
                }
                return ((p -= m), b);
            }
            try {
                for (;;) {
                    const { done: m, value: y } = await c.read();
                    if (s || m) break;
                    if (y) {
                        if (p + y.length > Bc) throw new Error(`Framed response buffer exceeded ${Bc} bytes`);
                        for (f.push(y), p += y.length; ;) {
                            const b = h();
                            if (!b) break;
                            const { type: R, streamId: w, length: E } = b;
                            if (R !== Xt.JSON && R !== Xt.CHUNK && R !== Xt.END && R !== Xt.ERROR)
                                throw new Error(`Unknown frame type: ${R}`);
                            if (R === Xt.JSON) {
                                if (w !== 0) throw new Error('Invalid JSON frame streamId (expected 0)');
                            } else if (w === 0) throw new Error('Invalid raw frame streamId (expected non-zero)');
                            if (E > jc) throw new Error(`Frame payload too large: ${E} bytes (max ${jc})`);
                            const C = 9 + E;
                            if (p < C) break;
                            if (++i > zc) throw new Error(`Too many frames in framed response (max ${zc})`);
                            g(9);
                            const M = g(E);
                            switch (R) {
                                case Xt.JSON:
                                    try {
                                        a.enqueue(Nc.decode(M));
                                    } catch {}
                                    break;
                                case Xt.CHUNK: {
                                    const S = l(w);
                                    S && S.enqueue(M);
                                    break;
                                }
                                case Xt.END: {
                                    const S = l(w);
                                    if ((r.add(w), S)) {
                                        try {
                                            S.close();
                                        } catch {}
                                        t.delete(w);
                                    }
                                    break;
                                }
                                case Xt.ERROR: {
                                    const S = l(w);
                                    if ((r.add(w), S)) {
                                        const P = Nc.decode(M);
                                        (S.error(new Error(P)), t.delete(w));
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
                if (p !== 0) throw new Error('Incomplete frame at end of framed response');
                try {
                    a.close();
                } catch {}
                (t.forEach((m) => {
                    try {
                        m.close();
                    } catch {}
                }),
                    t.clear());
            } catch (m) {
                try {
                    a.error(m);
                } catch {}
                (t.forEach((y) => {
                    try {
                        y.error(m);
                    } catch {}
                }),
                    t.clear());
            } finally {
                try {
                    c.releaseLock();
                } catch {}
                o = null;
            }
        })(),
        { getOrCreateStream: u, jsonChunks: d }
    );
}
var Jr = null;
async function Ai(e) {
    e.length > 0 && (await Promise.allSettled(e));
}
var Ky = Object.prototype.hasOwnProperty;
function hd(e) {
    for (const t in e) if (Ky.call(e, t)) return !0;
    return !1;
}
async function Gy(e, t, n) {
    Jr || (Jr = Uy());
    const r = t[0],
        s = r.fetch ?? n,
        o = r.data instanceof FormData ? 'formData' : 'payload',
        i = r.headers ? new Headers(r.headers) : new Headers();
    if (
        (i.set('x-tsr-serverFn', 'true'),
        o === 'payload' && i.set('accept', `${$h}, application/x-ndjson, application/json`),
        r.method === 'GET')
    ) {
        if (o === 'formData') throw new Error('FormData is not supported with GET requests');
        const d = await pd(r);
        if (d !== void 0) {
            const u = Mu({ payload: d });
            e.includes('?') ? (e += `&${u}`) : (e += `?${u}`);
        }
    }
    let a;
    if (r.method === 'POST') {
        const d = await qy(r);
        (d?.contentType && i.set('content-type', d.contentType), (a = d?.body));
    }
    return await Qy(async () => s(e, { method: r.method, headers: i, signal: r.signal, body: a }));
}
async function pd(e) {
    let t = !1;
    const n = {};
    if (
        (e.data !== void 0 && ((t = !0), (n.data = e.data)),
        e.context && hd(e.context) && ((t = !0), (n.context = e.context)),
        t)
    )
        return md(n);
}
async function md(e) {
    return JSON.stringify(await Promise.resolve(Ty(e, { plugins: Jr })));
}
async function qy(e) {
    if (e.data instanceof FormData) {
        let n;
        return (
            e.context && hd(e.context) && (n = await md(e.context)),
            n !== void 0 && e.data.set(Bh, n),
            { body: e.data }
        );
    }
    const t = await pd(e);
    if (t) return { body: t, contentType: 'application/json' };
}
async function Qy(e) {
    let t;
    try {
        t = await e();
    } catch (r) {
        if (r instanceof Response) t = r;
        else throw (console.log(r), r);
    }
    if (t.headers.get('x-tss-raw') === 'true') return t;
    const n = t.headers.get('content-type');
    if ((n || xt(), t.headers.get('x-tss-serialized'))) {
        let r;
        if (n.includes('application/x-tss-framed')) {
            if ((Hh(n), !t.body)) throw new Error('No response body for framed response');
            const { getOrCreateStream: s, jsonChunks: o } = Wy(t.body),
                i = [Vy(s), ...(Jr || [])],
                a = new Map();
            r = await Yy({
                jsonStream: o,
                onMessage: (d) => _c(d, { refs: a, plugins: i }),
                onError(d, u) {
                    console.error(d, u);
                },
            });
        } else if (n.includes('application/json')) {
            const s = await t.json(),
                o = [];
            ((r = _c(s, { plugins: Jr })), await Ai(o));
        }
        if ((r || xt(), r instanceof Error)) throw r;
        return r;
    }
    if (n.includes('application/json')) {
        const r = await t.json(),
            s = Cu(r);
        if (s) throw s;
        if (et(r)) throw r;
        return r;
    }
    if (!t.ok) throw new Error(await t.text());
    return t;
}
async function Yy({ jsonStream: e, onMessage: t, onError: n }) {
    const r = e.getReader(),
        { value: s, done: o } = await r.read();
    if (o || !s) throw new Error('Stream ended before first object');
    const i = JSON.parse(s);
    let a = !1;
    const d = (async () => {
        try {
            for (;;) {
                const { value: c, done: f } = await r.read();
                if (f) break;
                if (c)
                    try {
                        const p = [];
                        try {
                            t(JSON.parse(c));
                        } finally {
                        }
                        await Ai(p);
                    } catch (p) {
                        n?.(`Invalid JSON: ${c}`, p);
                    }
            }
        } catch (c) {
            a || n?.('Stream processing error:', c);
        }
    })();
    let u;
    const l = [];
    try {
        u = t(i);
    } catch (c) {
        throw ((a = !0), r.cancel().catch(() => {}), c);
    }
    return (
        await Ai(l),
        Promise.resolve(u).catch(() => {
            ((a = !0), r.cancel().catch(() => {}));
        }),
        d.finally(() => {
            try {
                r.releaseLock();
            } catch {}
        }),
        u
    );
}
function yt(e) {
    const t = '/_serverFn/' + e;
    return Object.assign(
        (...s) => {
            const o = ua()?.serverFns?.fetch;
            return Gy(t, s, o ?? fetch);
        },
        { url: t, serverFnMeta: { id: e }, [Ti]: !0 }
    );
}
var Xy = {
    key: '$TSS/serverfn',
    test: (e) => (typeof e != 'function' || !(Ti in e) ? !1 : !!e[Ti]),
    toSerializable: ({ serverFnMeta: e }) => ({ functionId: e.id }),
    fromSerializable: ({ functionId: e }) => yt(e),
};
function gd(e) {
    if (Array.isArray(e)) return e.flatMap((l) => gd(l));
    if (typeof e != 'string') return [];
    const t = [];
    let n = 0,
        r,
        s,
        o,
        i,
        a;
    const d = () => {
            for (; n < e.length && /\s/.test(e.charAt(n));) n += 1;
            return n < e.length;
        },
        u = () => ((s = e.charAt(n)), s !== '=' && s !== ';' && s !== ',');
    for (; n < e.length;) {
        for (r = n, a = !1; d();)
            if (((s = e.charAt(n)), s === ',')) {
                for (o = n, n += 1, d(), i = n; n < e.length && u();) n += 1;
                n < e.length && e.charAt(n) === '=' ? ((a = !0), (n = i), t.push(e.slice(r, o)), (r = n)) : (n = o + 1);
            } else n += 1;
        (!a || n >= e.length) && t.push(e.slice(r));
    }
    return t;
}
function Jy(e) {
    return e instanceof Headers ? e : Array.isArray(e) ? new Headers(e) : typeof e == 'object' ? new Headers(e) : null;
}
function Zy(...e) {
    return e.reduce((t, n) => {
        const r = Jy(n);
        if (!r) return t;
        for (const [s, o] of r.entries())
            s === 'set-cookie' ? gd(o).forEach((i) => t.append('set-cookie', i)) : t.set(s, o);
        return t;
    }, new Headers());
}
function Uc(e) {
    return e.replaceAll('\0', '/').replaceAll('�', '/');
}
function eb(e, t) {
    ((e.id = t.i),
        (e.__beforeLoadContext = t.b),
        (e.loaderData = t.l),
        (e.status = t.s),
        (e.ssr = t.ssr),
        (e.updatedAt = t.u),
        (e.error = t.e),
        t.g !== void 0 && (e.globalNotFound = t.g));
}
async function tb(e) {
    window.$_TSR || xt();
    const t = e.options.serializationAdapters;
    if (t?.length) {
        const m = new Map();
        (t.forEach((y) => {
            m.set(y.key, y.fromSerializable);
        }),
            (window.$_TSR.t = m),
            window.$_TSR.buffer.forEach((y) => y()));
    }
    ((window.$_TSR.initialized = !0), window.$_TSR.router || xt());
    const n = window.$_TSR.router;
    (n.matches.forEach((m) => {
        m.i = Uc(m.i);
    }),
        n.lastMatchId && (n.lastMatchId = Uc(n.lastMatchId)));
    const { manifest: r, dehydratedData: s, lastMatchId: o } = n;
    e.ssr = { manifest: r };
    const i = document.querySelector('meta[property="csp-nonce"]')?.content;
    ((e.options.ssr = { nonce: i }), await e.options.hydrate?.(s));
    const a = e.matchRoutes(e.stores.location.get()),
        d = Promise.all(a.map((m) => e.loadRouteChunk(e.looseRoutesById[m.routeId])));
    function u(m) {
        const y = e.looseRoutesById[m.routeId].options.pendingMinMs ?? e.options.defaultPendingMinMs;
        if (y) {
            const b = er();
            ((m._nonReactive.minPendingPromise = b),
                (m._forcePending = !0),
                setTimeout(() => {
                    (b.resolve(),
                        e.updateMatch(
                            m.id,
                            (R) => ((R._nonReactive.minPendingPromise = void 0), { ...R, _forcePending: void 0 })
                        ));
                }, y));
        }
    }
    function l(m) {
        const y = e.looseRoutesById[m.routeId];
        y && (y.options.ssr = m.ssr);
    }
    let c;
    (a.forEach((m) => {
        const y = n.matches.find((b) => b.i === m.id);
        if (!y) {
            ((m._nonReactive.dehydrated = !1), (m.ssr = !1), l(m));
            return;
        }
        (eb(m, y),
            l(m),
            (m._nonReactive.dehydrated = m.ssr !== !1),
            (m.ssr === 'data-only' || m.ssr === !1) && c === void 0 && ((c = m.index), u(m)));
    }),
        e.stores.setMatches(a));
    const f = e.stores.matches.get(),
        p = e.stores.location.get();
    await Promise.all(
        f.map(async (m) => {
            try {
                const y = e.looseRoutesById[m.routeId],
                    b = f[m.index - 1]?.context ?? e.options.context;
                if (y.options.context) {
                    const C = {
                        deps: m.loaderDeps,
                        params: m.params,
                        context: b ?? {},
                        location: p,
                        navigate: (M) => e.navigate({ ...M, _fromLocation: p }),
                        buildLocation: e.buildLocation,
                        cause: m.cause,
                        abortController: m.abortController,
                        preload: !1,
                        matches: a,
                        routeId: y.id,
                    };
                    m.__routeContext = y.options.context(C) ?? void 0;
                }
                m.context = { ...b, ...m.__routeContext, ...m.__beforeLoadContext };
                const R = { ssr: e.options.ssr, matches: f, match: m, params: m.params, loaderData: m.loaderData },
                    w = await y.options.head?.(R),
                    E = await y.options.scripts?.(R);
                ((m.meta = w?.meta),
                    (m.links = w?.links),
                    (m.headScripts = w?.scripts),
                    (m.styles = w?.styles),
                    (m.scripts = E));
            } catch (y) {
                if (et(y))
                    ((m.error = { isNotFound: !0 }),
                        console.error(`NotFound error during hydration for routeId: ${m.routeId}`, y));
                else throw ((m.error = y), console.error(`Error during hydration for route ${m.routeId}:`, y), y);
            }
        })
    );
    const h = a[a.length - 1].id !== o;
    if (!a.some((m) => m.ssr === !1) && !h)
        return (
            a.forEach((m) => {
                m._nonReactive.dehydrated = void 0;
            }),
            e.stores.resolvedLocation.set(e.stores.location.get()),
            d
        );
    const g = Promise.resolve()
        .then(() => e.load())
        .catch((m) => {
            console.error('Error during router hydration:', m);
        });
    if (h) {
        const m = a[1];
        (m || xt(),
            u(m),
            (m._displayPending = !0),
            (m._nonReactive.displayPendingPromise = g),
            g.then(() => {
                e.batch(() => {
                    (e.stores.status.get() === 'pending' &&
                        (e.stores.status.set('idle'), e.stores.resolvedLocation.set(e.stores.location.get())),
                        e.updateMatch(m.id, (y) => ({ ...y, _displayPending: void 0, displayPendingPromise: void 0 })));
                });
            }));
    }
    return d;
}
var Pr = class {
        constructor() {
            ((this.listeners = new Set()), (this.subscribe = this.subscribe.bind(this)));
        }
        subscribe(e) {
            return (
                this.listeners.add(e),
                this.onSubscribe(),
                () => {
                    (this.listeners.delete(e), this.onUnsubscribe());
                }
            );
        }
        hasListeners() {
            return this.listeners.size > 0;
        }
        onSubscribe() {}
        onUnsubscribe() {}
    },
    nb = class extends Pr {
        #t;
        #e;
        #n;
        constructor() {
            (super(),
                (this.#n = (e) => {
                    if (typeof window < 'u' && window.addEventListener) {
                        const t = () => e();
                        return (
                            window.addEventListener('visibilitychange', t, !1),
                            () => {
                                window.removeEventListener('visibilitychange', t);
                            }
                        );
                    }
                }));
        }
        onSubscribe() {
            this.#e || this.setEventListener(this.#n);
        }
        onUnsubscribe() {
            this.hasListeners() || (this.#e?.(), (this.#e = void 0));
        }
        setEventListener(e) {
            ((this.#n = e),
                this.#e?.(),
                (this.#e = e((t) => {
                    typeof t == 'boolean' ? this.setFocused(t) : this.onFocus();
                })));
        }
        setFocused(e) {
            this.#t !== e && ((this.#t = e), this.onFocus());
        }
        onFocus() {
            const e = this.isFocused();
            this.listeners.forEach((t) => {
                t(e);
            });
        }
        isFocused() {
            return typeof this.#t == 'boolean' ? this.#t : globalThis.document?.visibilityState !== 'hidden';
        }
    },
    ba = new nb(),
    rb = {
        setTimeout: (e, t) => setTimeout(e, t),
        clearTimeout: (e) => clearTimeout(e),
        setInterval: (e, t) => setInterval(e, t),
        clearInterval: (e) => clearInterval(e),
    },
    sb = class {
        #t = rb;
        #e = !1;
        setTimeoutProvider(e) {
            this.#t = e;
        }
        setTimeout(e, t) {
            return this.#t.setTimeout(e, t);
        }
        clearTimeout(e) {
            this.#t.clearTimeout(e);
        }
        setInterval(e, t) {
            return this.#t.setInterval(e, t);
        }
        clearInterval(e) {
            this.#t.clearInterval(e);
        }
    },
    Un = new sb();
function ob(e) {
    setTimeout(e, 0);
}
var ib = typeof window > 'u' || 'Deno' in globalThis;
function pt() {}
function ab(e, t) {
    return typeof e == 'function' ? e(t) : e;
}
function _i(e) {
    return typeof e == 'number' && e >= 0 && e !== 1 / 0;
}
function yd(e, t) {
    return Math.max(e + (t || 0) - Date.now(), 0);
}
function En(e, t) {
    return typeof e == 'function' ? e(t) : e;
}
function Ct(e, t) {
    return typeof e == 'function' ? e(t) : e;
}
function Hc(e, t) {
    const { type: n = 'all', exact: r, fetchStatus: s, predicate: o, queryKey: i, stale: a } = e;
    if (i) {
        if (r) {
            if (t.queryHash !== va(i, t.options)) return !1;
        } else if (!Zr(t.queryKey, i)) return !1;
    }
    if (n !== 'all') {
        const d = t.isActive();
        if ((n === 'active' && !d) || (n === 'inactive' && d)) return !1;
    }
    return !((typeof a == 'boolean' && t.isStale() !== a) || (s && s !== t.state.fetchStatus) || (o && !o(t)));
}
function Wc(e, t) {
    const { exact: n, status: r, predicate: s, mutationKey: o } = e;
    if (o) {
        if (!t.options.mutationKey) return !1;
        if (n) {
            if (tr(t.options.mutationKey) !== tr(o)) return !1;
        } else if (!Zr(t.options.mutationKey, o)) return !1;
    }
    return !((r && t.state.status !== r) || (s && !s(t)));
}
function va(e, t) {
    return (t?.queryKeyHashFn || tr)(e);
}
function tr(e) {
    return JSON.stringify(e, (t, n) =>
        Li(n)
            ? Object.keys(n)
                  .sort()
                  .reduce((r, s) => ((r[s] = n[s]), r), {})
            : n
    );
}
function Zr(e, t) {
    return e === t
        ? !0
        : typeof e != typeof t
          ? !1
          : e && t && typeof e == 'object' && typeof t == 'object'
            ? Object.keys(t).every((n) => Zr(e[n], t[n]))
            : !1;
}
var cb = Object.prototype.hasOwnProperty;
function bd(e, t, n = 0) {
    if (e === t) return e;
    if (n > 500) return t;
    const r = Kc(e) && Kc(t);
    if (!r && !(Li(e) && Li(t))) return t;
    const o = (r ? e : Object.keys(e)).length,
        i = r ? t : Object.keys(t),
        a = i.length,
        d = r ? new Array(a) : {};
    let u = 0;
    for (let l = 0; l < a; l++) {
        const c = r ? l : i[l],
            f = e[c],
            p = t[c];
        if (f === p) {
            ((d[c] = f), (r ? l < o : cb.call(e, c)) && u++);
            continue;
        }
        if (f === null || p === null || typeof f != 'object' || typeof p != 'object') {
            d[c] = p;
            continue;
        }
        const h = bd(f, p, n + 1);
        ((d[c] = h), h === f && u++);
    }
    return o === a && u === o ? e : d;
}
function co(e, t) {
    if (!t || Object.keys(e).length !== Object.keys(t).length) return !1;
    for (const n in e) if (e[n] !== t[n]) return !1;
    return !0;
}
function Kc(e) {
    return Array.isArray(e) && e.length === Object.keys(e).length;
}
function Li(e) {
    if (!Gc(e)) return !1;
    const t = e.constructor;
    if (t === void 0) return !0;
    const n = t.prototype;
    return !(!Gc(n) || !n.hasOwnProperty('isPrototypeOf') || Object.getPrototypeOf(e) !== Object.prototype);
}
function Gc(e) {
    return Object.prototype.toString.call(e) === '[object Object]';
}
function lb(e) {
    return new Promise((t) => {
        Un.setTimeout(t, e);
    });
}
function Di(e, t, n) {
    return typeof n.structuralSharing == 'function'
        ? n.structuralSharing(e, t)
        : n.structuralSharing !== !1
          ? bd(e, t)
          : t;
}
function ub(e, t, n = 0) {
    const r = [...e, t];
    return n && r.length > n ? r.slice(1) : r;
}
function db(e, t, n = 0) {
    const r = [t, ...e];
    return n && r.length > n ? r.slice(0, -1) : r;
}
var wa = Symbol();
function vd(e, t) {
    return !e.queryFn && t?.initialPromise
        ? () => t.initialPromise
        : !e.queryFn || e.queryFn === wa
          ? () => Promise.reject(new Error(`Missing queryFn: '${e.queryHash}'`))
          : e.queryFn;
}
function Sa(e, t) {
    return typeof e == 'function' ? e(...t) : !!e;
}
function fb(e, t, n) {
    let r = !1,
        s;
    return (
        Object.defineProperty(e, 'signal', {
            enumerable: !0,
            get: () => (
                (s ??= t()),
                r || ((r = !0), s.aborted ? n() : s.addEventListener('abort', n, { once: !0 })),
                s
            ),
        }),
        e
    );
}
var es = (() => {
    let e = () => ib;
    return {
        isServer() {
            return e();
        },
        setIsServer(t) {
            e = t;
        },
    };
})();
function Vi() {
    let e, t;
    const n = new Promise((s, o) => {
        ((e = s), (t = o));
    });
    ((n.status = 'pending'), n.catch(() => {}));
    function r(s) {
        (Object.assign(n, s), delete n.resolve, delete n.reject);
    }
    return (
        (n.resolve = (s) => {
            (r({ status: 'fulfilled', value: s }), e(s));
        }),
        (n.reject = (s) => {
            (r({ status: 'rejected', reason: s }), t(s));
        }),
        n
    );
}
var hb = ob;
function pb() {
    let e = [],
        t = 0,
        n = (a) => {
            a();
        },
        r = (a) => {
            a();
        },
        s = hb;
    const o = (a) => {
            t
                ? e.push(a)
                : s(() => {
                      n(a);
                  });
        },
        i = () => {
            const a = e;
            ((e = []),
                a.length &&
                    s(() => {
                        r(() => {
                            a.forEach((d) => {
                                n(d);
                            });
                        });
                    }));
        };
    return {
        batch: (a) => {
            let d;
            t++;
            try {
                d = a();
            } finally {
                (t--, t || i());
            }
            return d;
        },
        batchCalls:
            (a) =>
            (...d) => {
                o(() => {
                    a(...d);
                });
            },
        schedule: o,
        setNotifyFunction: (a) => {
            n = a;
        },
        setBatchNotifyFunction: (a) => {
            r = a;
        },
        setScheduler: (a) => {
            s = a;
        },
    };
}
var Ge = pb(),
    mb = class extends Pr {
        #t = !0;
        #e;
        #n;
        constructor() {
            (super(),
                (this.#n = (e) => {
                    if (typeof window < 'u' && window.addEventListener) {
                        const t = () => e(!0),
                            n = () => e(!1);
                        return (
                            window.addEventListener('online', t, !1),
                            window.addEventListener('offline', n, !1),
                            () => {
                                (window.removeEventListener('online', t), window.removeEventListener('offline', n));
                            }
                        );
                    }
                }));
        }
        onSubscribe() {
            this.#e || this.setEventListener(this.#n);
        }
        onUnsubscribe() {
            this.hasListeners() || (this.#e?.(), (this.#e = void 0));
        }
        setEventListener(e) {
            ((this.#n = e), this.#e?.(), (this.#e = e(this.setOnline.bind(this))));
        }
        setOnline(e) {
            this.#t !== e &&
                ((this.#t = e),
                this.listeners.forEach((n) => {
                    n(e);
                }));
        }
        isOnline() {
            return this.#t;
        }
    },
    lo = new mb();
function gb(e) {
    return Math.min(1e3 * 2 ** e, 3e4);
}
function wd(e) {
    return (e ?? 'online') === 'online' ? lo.isOnline() : !0;
}
var Ni = class extends Error {
    constructor(e) {
        (super('CancelledError'), (this.revert = e?.revert), (this.silent = e?.silent));
    }
};
function Sd(e) {
    let t = !1,
        n = 0,
        r;
    const s = Vi(),
        o = () => s.status !== 'pending',
        i = (g) => {
            if (!o()) {
                const m = new Ni(g);
                (f(m), e.onCancel?.(m));
            }
        },
        a = () => {
            t = !0;
        },
        d = () => {
            t = !1;
        },
        u = () => ba.isFocused() && (e.networkMode === 'always' || lo.isOnline()) && e.canRun(),
        l = () => wd(e.networkMode) && e.canRun(),
        c = (g) => {
            o() || (r?.(), s.resolve(g));
        },
        f = (g) => {
            o() || (r?.(), s.reject(g));
        },
        p = () =>
            new Promise((g) => {
                ((r = (m) => {
                    (o() || u()) && g(m);
                }),
                    e.onPause?.());
            }).then(() => {
                ((r = void 0), o() || e.onContinue?.());
            }),
        h = () => {
            if (o()) return;
            let g;
            const m = n === 0 ? e.initialPromise : void 0;
            try {
                g = m ?? e.fn();
            } catch (y) {
                g = Promise.reject(y);
            }
            Promise.resolve(g)
                .then(c)
                .catch((y) => {
                    if (o()) return;
                    const b = e.retry ?? (es.isServer() ? 0 : 3),
                        R = e.retryDelay ?? gb,
                        w = typeof R == 'function' ? R(n, y) : R,
                        E = b === !0 || (typeof b == 'number' && n < b) || (typeof b == 'function' && b(n, y));
                    if (t || !E) {
                        f(y);
                        return;
                    }
                    (n++,
                        e.onFail?.(n, y),
                        lb(w)
                            .then(() => (u() ? void 0 : p()))
                            .then(() => {
                                t ? f(y) : h();
                            }));
                });
        };
    return {
        promise: s,
        status: () => s.status,
        cancel: i,
        continue: () => (r?.(), s),
        cancelRetry: a,
        continueRetry: d,
        canStart: l,
        start: () => (l() ? h() : p().then(h), s),
    };
}
var xd = class {
    #t;
    destroy() {
        this.clearGcTimeout();
    }
    scheduleGc() {
        (this.clearGcTimeout(),
            _i(this.gcTime) &&
                (this.#t = Un.setTimeout(() => {
                    this.optionalRemove();
                }, this.gcTime)));
    }
    updateGcTime(e) {
        this.gcTime = Math.max(this.gcTime || 0, e ?? (es.isServer() ? 1 / 0 : 300 * 1e3));
    }
    clearGcTimeout() {
        this.#t !== void 0 && (Un.clearTimeout(this.#t), (this.#t = void 0));
    }
};
function yb(e) {
    return {
        onFetch: (t, n) => {
            const r = t.options,
                s = t.fetchOptions?.meta?.fetchMore?.direction,
                o = t.state.data?.pages || [],
                i = t.state.data?.pageParams || [];
            let a = { pages: [], pageParams: [] },
                d = 0;
            const u = async () => {
                let l = !1;
                const c = (h) => {
                        fb(
                            h,
                            () => t.signal,
                            () => (l = !0)
                        );
                    },
                    f = vd(t.options, t.fetchOptions),
                    p = async (h, g, m) => {
                        if (l) return Promise.reject(t.signal.reason);
                        if (g == null && h.pages.length) return Promise.resolve(h);
                        const b = (() => {
                                const C = {
                                    client: t.client,
                                    queryKey: t.queryKey,
                                    pageParam: g,
                                    direction: m ? 'backward' : 'forward',
                                    meta: t.options.meta,
                                };
                                return (c(C), C);
                            })(),
                            R = await f(b),
                            { maxPages: w } = t.options,
                            E = m ? db : ub;
                        return { pages: E(h.pages, R, w), pageParams: E(h.pageParams, g, w) };
                    };
                if (s && o.length) {
                    const h = s === 'backward',
                        g = h ? bb : qc,
                        m = { pages: o, pageParams: i },
                        y = g(r, m);
                    a = await p(m, y, h);
                } else {
                    const h = e ?? o.length;
                    do {
                        const g = d === 0 ? (i[0] ?? r.initialPageParam) : qc(r, a);
                        if (d > 0 && g == null) break;
                        ((a = await p(a, g)), d++);
                    } while (d < h);
                }
                return a;
            };
            t.options.persister
                ? (t.fetchFn = () =>
                      t.options.persister?.(
                          u,
                          { client: t.client, queryKey: t.queryKey, meta: t.options.meta, signal: t.signal },
                          n
                      ))
                : (t.fetchFn = u);
        },
    };
}
function qc(e, { pages: t, pageParams: n }) {
    const r = t.length - 1;
    return t.length > 0 ? e.getNextPageParam(t[r], t, n[r], n) : void 0;
}
function bb(e, { pages: t, pageParams: n }) {
    return t.length > 0 ? e.getPreviousPageParam?.(t[0], t, n[0], n) : void 0;
}
var vb = class extends xd {
    #t;
    #e;
    #n;
    #r;
    #o;
    #s;
    #i;
    #a;
    constructor(e) {
        (super(),
            (this.#a = !1),
            (this.#i = e.defaultOptions),
            this.setOptions(e.options),
            (this.observers = []),
            (this.#o = e.client),
            (this.#r = this.#o.getQueryCache()),
            (this.queryKey = e.queryKey),
            (this.queryHash = e.queryHash),
            (this.#e = Yc(this.options)),
            (this.state = e.state ?? this.#e),
            this.scheduleGc());
    }
    get meta() {
        return this.options.meta;
    }
    get queryType() {
        return this.#t;
    }
    get promise() {
        return this.#s?.promise;
    }
    setOptions(e) {
        if (
            ((this.options = { ...this.#i, ...e }),
            e?._type && (this.#t = e._type),
            this.updateGcTime(this.options.gcTime),
            this.state && this.state.data === void 0)
        ) {
            const t = Yc(this.options);
            t.data !== void 0 && (this.setState(Qc(t.data, t.dataUpdatedAt)), (this.#e = t));
        }
    }
    optionalRemove() {
        !this.observers.length && this.state.fetchStatus === 'idle' && this.#r.remove(this);
    }
    setData(e, t) {
        const n = Di(this.state.data, e, this.options);
        return (this.#c({ data: n, type: 'success', dataUpdatedAt: t?.updatedAt, manual: t?.manual }), n);
    }
    setState(e) {
        this.#c({ type: 'setState', state: e });
    }
    cancel(e) {
        const t = this.#s?.promise;
        return (this.#s?.cancel(e), t ? t.then(pt).catch(pt) : Promise.resolve());
    }
    destroy() {
        (super.destroy(), this.cancel({ silent: !0 }));
    }
    get resetState() {
        return this.#e;
    }
    reset() {
        (this.destroy(), this.setState(this.resetState));
    }
    isActive() {
        return this.observers.some((e) => Ct(e.options.enabled, this) !== !1);
    }
    isDisabled() {
        return this.getObserversCount() > 0 ? !this.isActive() : this.options.queryFn === wa || !this.isFetched();
    }
    isFetched() {
        return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
    }
    isStatic() {
        return this.getObserversCount() > 0
            ? this.observers.some((e) => En(e.options.staleTime, this) === 'static')
            : !1;
    }
    isStale() {
        return this.getObserversCount() > 0
            ? this.observers.some((e) => e.getCurrentResult().isStale)
            : this.state.data === void 0 || this.state.isInvalidated;
    }
    isStaleByTime(e = 0) {
        return this.state.data === void 0
            ? !0
            : e === 'static'
              ? !1
              : this.state.isInvalidated
                ? !0
                : !yd(this.state.dataUpdatedAt, e);
    }
    onFocus() {
        (this.observers.find((t) => t.shouldFetchOnWindowFocus())?.refetch({ cancelRefetch: !1 }), this.#s?.continue());
    }
    onOnline() {
        (this.observers.find((t) => t.shouldFetchOnReconnect())?.refetch({ cancelRefetch: !1 }), this.#s?.continue());
    }
    addObserver(e) {
        this.observers.includes(e) ||
            (this.observers.push(e),
            this.clearGcTimeout(),
            this.#r.notify({ type: 'observerAdded', query: this, observer: e }));
    }
    removeObserver(e) {
        this.observers.includes(e) &&
            ((this.observers = this.observers.filter((t) => t !== e)),
            this.observers.length ||
                (this.#s && (this.#a || this.#h() ? this.#s.cancel({ revert: !0 }) : this.#s.cancelRetry()),
                this.scheduleGc()),
            this.#r.notify({ type: 'observerRemoved', query: this, observer: e }));
    }
    getObserversCount() {
        return this.observers.length;
    }
    #h() {
        return this.state.fetchStatus === 'paused' && this.state.status === 'pending';
    }
    invalidate() {
        this.state.isInvalidated || this.#c({ type: 'invalidate' });
    }
    async fetch(e, t) {
        if (this.state.fetchStatus !== 'idle' && this.#s?.status() !== 'rejected') {
            if (this.state.data !== void 0 && t?.cancelRefetch) this.cancel({ silent: !0 });
            else if (this.#s) return (this.#s.continueRetry(), this.#s.promise);
        }
        if ((e && this.setOptions(e), !this.options.queryFn)) {
            const d = this.observers.find((u) => u.options.queryFn);
            d && this.setOptions(d.options);
        }
        const n = new AbortController(),
            r = (d) => {
                Object.defineProperty(d, 'signal', { enumerable: !0, get: () => ((this.#a = !0), n.signal) });
            },
            s = () => {
                const d = vd(this.options, t),
                    l = (() => {
                        const c = { client: this.#o, queryKey: this.queryKey, meta: this.meta };
                        return (r(c), c);
                    })();
                return ((this.#a = !1), this.options.persister ? this.options.persister(d, l, this) : d(l));
            },
            i = (() => {
                const d = {
                    fetchOptions: t,
                    options: this.options,
                    queryKey: this.queryKey,
                    client: this.#o,
                    state: this.state,
                    fetchFn: s,
                };
                return (r(d), d);
            })();
        ((this.#t === 'infinite' ? yb(this.options.pages) : this.options.behavior)?.onFetch(i, this),
            (this.#n = this.state),
            (this.state.fetchStatus === 'idle' || this.state.fetchMeta !== i.fetchOptions?.meta) &&
                this.#c({ type: 'fetch', meta: i.fetchOptions?.meta }),
            (this.#s = Sd({
                initialPromise: t?.initialPromise,
                fn: i.fetchFn,
                onCancel: (d) => {
                    (d instanceof Ni && d.revert && this.setState({ ...this.#n, fetchStatus: 'idle' }), n.abort());
                },
                onFail: (d, u) => {
                    this.#c({ type: 'failed', failureCount: d, error: u });
                },
                onPause: () => {
                    this.#c({ type: 'pause' });
                },
                onContinue: () => {
                    this.#c({ type: 'continue' });
                },
                retry: i.options.retry,
                retryDelay: i.options.retryDelay,
                networkMode: i.options.networkMode,
                canRun: () => !0,
            })));
        try {
            const d = await this.#s.start();
            if (d === void 0) throw new Error(`${this.queryHash} data is undefined`);
            return (
                this.setData(d),
                this.#r.config.onSuccess?.(d, this),
                this.#r.config.onSettled?.(d, this.state.error, this),
                d
            );
        } catch (d) {
            if (d instanceof Ni) {
                if (d.silent) return this.#s.promise;
                if (d.revert) {
                    if (this.state.data === void 0) throw d;
                    return this.state.data;
                }
            }
            throw (
                this.#c({ type: 'error', error: d }),
                this.#r.config.onError?.(d, this),
                this.#r.config.onSettled?.(this.state.data, d, this),
                d
            );
        } finally {
            this.scheduleGc();
        }
    }
    #c(e) {
        const t = (n) => {
            switch (e.type) {
                case 'failed':
                    return { ...n, fetchFailureCount: e.failureCount, fetchFailureReason: e.error };
                case 'pause':
                    return { ...n, fetchStatus: 'paused' };
                case 'continue':
                    return { ...n, fetchStatus: 'fetching' };
                case 'fetch':
                    return { ...n, ...Rd(n.data, this.options), fetchMeta: e.meta ?? null };
                case 'success':
                    const r = {
                        ...n,
                        ...Qc(e.data, e.dataUpdatedAt),
                        dataUpdateCount: n.dataUpdateCount + 1,
                        ...(!e.manual && { fetchStatus: 'idle', fetchFailureCount: 0, fetchFailureReason: null }),
                    };
                    return ((this.#n = e.manual ? r : void 0), r);
                case 'error':
                    const s = e.error;
                    return {
                        ...n,
                        error: s,
                        errorUpdateCount: n.errorUpdateCount + 1,
                        errorUpdatedAt: Date.now(),
                        fetchFailureCount: n.fetchFailureCount + 1,
                        fetchFailureReason: s,
                        fetchStatus: 'idle',
                        status: 'error',
                        isInvalidated: !0,
                    };
                case 'invalidate':
                    return { ...n, isInvalidated: !0 };
                case 'setState':
                    return { ...n, ...e.state };
            }
        };
        ((this.state = t(this.state)),
            Ge.batch(() => {
                (this.observers.forEach((n) => {
                    n.onQueryUpdate();
                }),
                    this.#r.notify({ query: this, type: 'updated', action: e }));
            }));
    }
};
function Rd(e, t) {
    return {
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchStatus: wd(t.networkMode) ? 'fetching' : 'paused',
        ...(e === void 0 && { error: null, status: 'pending' }),
    };
}
function Qc(e, t) {
    return { data: e, dataUpdatedAt: t ?? Date.now(), error: null, isInvalidated: !1, status: 'success' };
}
function Yc(e) {
    const t = typeof e.initialData == 'function' ? e.initialData() : e.initialData,
        n = t !== void 0,
        r = n ? (typeof e.initialDataUpdatedAt == 'function' ? e.initialDataUpdatedAt() : e.initialDataUpdatedAt) : 0;
    return {
        data: t,
        dataUpdateCount: 0,
        dataUpdatedAt: n ? (r ?? Date.now()) : 0,
        error: null,
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchMeta: null,
        isInvalidated: !1,
        status: n ? 'success' : 'pending',
        fetchStatus: 'idle',
    };
}
var wb = class extends Pr {
    constructor(e, t) {
        (super(),
            (this.options = t),
            (this.#t = e),
            (this.#a = null),
            (this.#i = Vi()),
            this.bindMethods(),
            this.setOptions(t));
    }
    #t;
    #e = void 0;
    #n = void 0;
    #r = void 0;
    #o;
    #s;
    #i;
    #a;
    #h;
    #c;
    #u;
    #d;
    #l;
    #f;
    #p = new Set();
    bindMethods() {
        this.refetch = this.refetch.bind(this);
    }
    onSubscribe() {
        this.listeners.size === 1 &&
            (this.#e.addObserver(this), Xc(this.#e, this.options) ? this.#m() : this.updateResult(), this.#v());
    }
    onUnsubscribe() {
        this.hasListeners() || this.destroy();
    }
    shouldFetchOnReconnect() {
        return ji(this.#e, this.options, this.options.refetchOnReconnect);
    }
    shouldFetchOnWindowFocus() {
        return ji(this.#e, this.options, this.options.refetchOnWindowFocus);
    }
    destroy() {
        ((this.listeners = new Set()), this.#w(), this.#S(), this.#e.removeObserver(this));
    }
    setOptions(e) {
        const t = this.options,
            n = this.#e;
        if (
            ((this.options = this.#t.defaultQueryOptions(e)),
            this.options.enabled !== void 0 &&
                typeof this.options.enabled != 'boolean' &&
                typeof this.options.enabled != 'function' &&
                typeof Ct(this.options.enabled, this.#e) != 'boolean')
        )
            throw new Error('Expected enabled to be a boolean or a callback that returns a boolean');
        (this.#x(),
            this.#e.setOptions(this.options),
            t._defaulted &&
                !co(this.options, t) &&
                this.#t.getQueryCache().notify({ type: 'observerOptionsUpdated', query: this.#e, observer: this }));
        const r = this.hasListeners();
        (r && Jc(this.#e, n, this.options, t) && this.#m(),
            this.updateResult(),
            r &&
                (this.#e !== n ||
                    Ct(this.options.enabled, this.#e) !== Ct(t.enabled, this.#e) ||
                    En(this.options.staleTime, this.#e) !== En(t.staleTime, this.#e)) &&
                this.#g());
        const s = this.#y();
        r &&
            (this.#e !== n || Ct(this.options.enabled, this.#e) !== Ct(t.enabled, this.#e) || s !== this.#f) &&
            this.#b(s);
    }
    getOptimisticResult(e) {
        const t = this.#t.getQueryCache().build(this.#t, e),
            n = this.createResult(t, e);
        return (xb(this, n) && ((this.#r = n), (this.#s = this.options), (this.#o = this.#e.state)), n);
    }
    getCurrentResult() {
        return this.#r;
    }
    trackResult(e, t) {
        return new Proxy(e, {
            get: (n, r) => (
                this.trackProp(r),
                t?.(r),
                r === 'promise' &&
                    (this.trackProp('data'),
                    !this.options.experimental_prefetchInRender &&
                        this.#i.status === 'pending' &&
                        this.#i.reject(new Error('experimental_prefetchInRender feature flag is not enabled'))),
                Reflect.get(n, r)
            ),
        });
    }
    trackProp(e) {
        this.#p.add(e);
    }
    getCurrentQuery() {
        return this.#e;
    }
    refetch({ ...e } = {}) {
        return this.fetch({ ...e });
    }
    fetchOptimistic(e) {
        const t = this.#t.defaultQueryOptions(e),
            n = this.#t.getQueryCache().build(this.#t, t);
        return n.fetch().then(() => this.createResult(n, t));
    }
    fetch(e) {
        return this.#m({ ...e, cancelRefetch: e.cancelRefetch ?? !0 }).then(() => (this.updateResult(), this.#r));
    }
    #m(e) {
        this.#x();
        let t = this.#e.fetch(this.options, e);
        return (e?.throwOnError || (t = t.catch(pt)), t);
    }
    #g() {
        this.#w();
        const e = En(this.options.staleTime, this.#e);
        if (es.isServer() || this.#r.isStale || !_i(e)) return;
        const n = yd(this.#r.dataUpdatedAt, e) + 1;
        this.#d = Un.setTimeout(() => {
            this.#r.isStale || this.updateResult();
        }, n);
    }
    #y() {
        return (
            (typeof this.options.refetchInterval == 'function'
                ? this.options.refetchInterval(this.#e)
                : this.options.refetchInterval) ?? !1
        );
    }
    #b(e) {
        (this.#S(),
            (this.#f = e),
            !(es.isServer() || Ct(this.options.enabled, this.#e) === !1 || !_i(this.#f) || this.#f === 0) &&
                (this.#l = Un.setInterval(() => {
                    (this.options.refetchIntervalInBackground || ba.isFocused()) && this.#m();
                }, this.#f)));
    }
    #v() {
        (this.#g(), this.#b(this.#y()));
    }
    #w() {
        this.#d !== void 0 && (Un.clearTimeout(this.#d), (this.#d = void 0));
    }
    #S() {
        this.#l !== void 0 && (Un.clearInterval(this.#l), (this.#l = void 0));
    }
    createResult(e, t) {
        const n = this.#e,
            r = this.options,
            s = this.#r,
            o = this.#o,
            i = this.#s,
            d = e !== n ? e.state : this.#n,
            { state: u } = e;
        let l = { ...u },
            c = !1,
            f;
        if (t._optimisticResults) {
            const S = this.hasListeners(),
                P = !S && Xc(e, t),
                I = S && Jc(e, n, t, r);
            ((P || I) && (l = { ...l, ...Rd(u.data, e.options) }),
                t._optimisticResults === 'isRestoring' && (l.fetchStatus = 'idle'));
        }
        let { error: p, errorUpdatedAt: h, status: g } = l;
        f = l.data;
        let m = !1;
        if (t.placeholderData !== void 0 && f === void 0 && g === 'pending') {
            let S;
            (s?.isPlaceholderData && t.placeholderData === i?.placeholderData
                ? ((S = s.data), (m = !0))
                : (S =
                      typeof t.placeholderData == 'function'
                          ? t.placeholderData(this.#u?.state.data, this.#u)
                          : t.placeholderData),
                S !== void 0 && ((g = 'success'), (f = Di(s?.data, S, t)), (c = !0)));
        }
        if (t.select && f !== void 0 && !m)
            if (s && f === o?.data && t.select === this.#h) f = this.#c;
            else
                try {
                    ((this.#h = t.select), (f = t.select(f)), (f = Di(s?.data, f, t)), (this.#c = f), (this.#a = null));
                } catch (S) {
                    this.#a = S;
                }
        this.#a && ((p = this.#a), (f = this.#c), (h = Date.now()), (g = 'error'));
        const y = l.fetchStatus === 'fetching',
            b = g === 'pending',
            R = g === 'error',
            w = b && y,
            E = f !== void 0,
            M = {
                status: g,
                fetchStatus: l.fetchStatus,
                isPending: b,
                isSuccess: g === 'success',
                isError: R,
                isInitialLoading: w,
                isLoading: w,
                data: f,
                dataUpdatedAt: l.dataUpdatedAt,
                error: p,
                errorUpdatedAt: h,
                failureCount: l.fetchFailureCount,
                failureReason: l.fetchFailureReason,
                errorUpdateCount: l.errorUpdateCount,
                isFetched: e.isFetched(),
                isFetchedAfterMount: l.dataUpdateCount > d.dataUpdateCount || l.errorUpdateCount > d.errorUpdateCount,
                isFetching: y,
                isRefetching: y && !b,
                isLoadingError: R && !E,
                isPaused: l.fetchStatus === 'paused',
                isPlaceholderData: c,
                isRefetchError: R && E,
                isStale: xa(e, t),
                refetch: this.refetch,
                promise: this.#i,
                isEnabled: Ct(t.enabled, e) !== !1,
            };
        if (this.options.experimental_prefetchInRender) {
            const S = M.data !== void 0,
                P = M.status === 'error' && !S,
                I = (O) => {
                    P ? O.reject(M.error) : S && O.resolve(M.data);
                },
                V = () => {
                    const O = (this.#i = M.promise = Vi());
                    I(O);
                },
                A = this.#i;
            switch (A.status) {
                case 'pending':
                    e.queryHash === n.queryHash && I(A);
                    break;
                case 'fulfilled':
                    (P || M.data !== A.value) && V();
                    break;
                case 'rejected':
                    (!P || M.error !== A.reason) && V();
                    break;
            }
        }
        return M;
    }
    updateResult() {
        const e = this.#r,
            t = this.createResult(this.#e, this.options);
        if (
            ((this.#o = this.#e.state),
            (this.#s = this.options),
            this.#o.data !== void 0 && (this.#u = this.#e),
            co(t, e))
        )
            return;
        this.#r = t;
        const n = () => {
            if (!e) return !0;
            const { notifyOnChangeProps: r } = this.options,
                s = typeof r == 'function' ? r() : r;
            if (s === 'all' || (!s && !this.#p.size)) return !0;
            const o = new Set(s ?? this.#p);
            return (
                this.options.throwOnError && o.add('error'),
                Object.keys(this.#r).some((i) => {
                    const a = i;
                    return this.#r[a] !== e[a] && o.has(a);
                })
            );
        };
        this.#R({ listeners: n() });
    }
    #x() {
        const e = this.#t.getQueryCache().build(this.#t, this.options);
        if (e === this.#e) return;
        const t = this.#e;
        ((this.#e = e), (this.#n = e.state), this.hasListeners() && (t?.removeObserver(this), e.addObserver(this)));
    }
    onQueryUpdate() {
        (this.updateResult(), this.hasListeners() && this.#v());
    }
    #R(e) {
        Ge.batch(() => {
            (e.listeners &&
                this.listeners.forEach((t) => {
                    t(this.#r);
                }),
                this.#t.getQueryCache().notify({ query: this.#e, type: 'observerResultsUpdated' }));
        });
    }
};
function Sb(e, t) {
    return (
        Ct(t.enabled, e) !== !1 &&
        e.state.data === void 0 &&
        !(e.state.status === 'error' && Ct(t.retryOnMount, e) === !1)
    );
}
function Xc(e, t) {
    return Sb(e, t) || (e.state.data !== void 0 && ji(e, t, t.refetchOnMount));
}
function ji(e, t, n) {
    if (Ct(t.enabled, e) !== !1 && En(t.staleTime, e) !== 'static') {
        const r = typeof n == 'function' ? n(e) : n;
        return r === 'always' || (r !== !1 && xa(e, t));
    }
    return !1;
}
function Jc(e, t, n, r) {
    return (e !== t || Ct(r.enabled, e) === !1) && (!n.suspense || e.state.status !== 'error') && xa(e, n);
}
function xa(e, t) {
    return Ct(t.enabled, e) !== !1 && e.isStaleByTime(En(t.staleTime, e));
}
function xb(e, t) {
    return !co(e.getCurrentResult(), t);
}
var Rb = class extends xd {
    #t;
    #e;
    #n;
    #r;
    constructor(e) {
        (super(),
            (this.#t = e.client),
            (this.mutationId = e.mutationId),
            (this.#n = e.mutationCache),
            (this.#e = []),
            (this.state = e.state || Ed()),
            this.setOptions(e.options),
            this.scheduleGc());
    }
    setOptions(e) {
        ((this.options = e), this.updateGcTime(this.options.gcTime));
    }
    get meta() {
        return this.options.meta;
    }
    addObserver(e) {
        this.#e.includes(e) ||
            (this.#e.push(e),
            this.clearGcTimeout(),
            this.#n.notify({ type: 'observerAdded', mutation: this, observer: e }));
    }
    removeObserver(e) {
        ((this.#e = this.#e.filter((t) => t !== e)),
            this.scheduleGc(),
            this.#n.notify({ type: 'observerRemoved', mutation: this, observer: e }));
    }
    optionalRemove() {
        this.#e.length || (this.state.status === 'pending' ? this.scheduleGc() : this.#n.remove(this));
    }
    continue() {
        return this.#r?.continue() ?? this.execute(this.state.variables);
    }
    async execute(e) {
        const t = () => {
                this.#o({ type: 'continue' });
            },
            n = { client: this.#t, meta: this.options.meta, mutationKey: this.options.mutationKey };
        this.#r = Sd({
            fn: () =>
                this.options.mutationFn
                    ? this.options.mutationFn(e, n)
                    : Promise.reject(new Error('No mutationFn found')),
            onFail: (o, i) => {
                this.#o({ type: 'failed', failureCount: o, error: i });
            },
            onPause: () => {
                this.#o({ type: 'pause' });
            },
            onContinue: t,
            retry: this.options.retry ?? 0,
            retryDelay: this.options.retryDelay,
            networkMode: this.options.networkMode,
            canRun: () => this.#n.canRun(this),
        });
        const r = this.state.status === 'pending',
            s = !this.#r.canStart();
        try {
            if (r) t();
            else {
                (this.#o({ type: 'pending', variables: e, isPaused: s }),
                    this.#n.config.onMutate && (await this.#n.config.onMutate(e, this, n)));
                const i = await this.options.onMutate?.(e, n);
                i !== this.state.context && this.#o({ type: 'pending', context: i, variables: e, isPaused: s });
            }
            const o = await this.#r.start();
            return (
                await this.#n.config.onSuccess?.(o, e, this.state.context, this, n),
                await this.options.onSuccess?.(o, e, this.state.context, n),
                await this.#n.config.onSettled?.(o, null, this.state.variables, this.state.context, this, n),
                await this.options.onSettled?.(o, null, e, this.state.context, n),
                this.#o({ type: 'success', data: o }),
                o
            );
        } catch (o) {
            try {
                await this.#n.config.onError?.(o, e, this.state.context, this, n);
            } catch (i) {
                Promise.reject(i);
            }
            try {
                await this.options.onError?.(o, e, this.state.context, n);
            } catch (i) {
                Promise.reject(i);
            }
            try {
                await this.#n.config.onSettled?.(void 0, o, this.state.variables, this.state.context, this, n);
            } catch (i) {
                Promise.reject(i);
            }
            try {
                await this.options.onSettled?.(void 0, o, e, this.state.context, n);
            } catch (i) {
                Promise.reject(i);
            }
            throw (this.#o({ type: 'error', error: o }), o);
        } finally {
            this.#n.runNext(this);
        }
    }
    #o(e) {
        const t = (n) => {
            switch (e.type) {
                case 'failed':
                    return { ...n, failureCount: e.failureCount, failureReason: e.error };
                case 'pause':
                    return { ...n, isPaused: !0 };
                case 'continue':
                    return { ...n, isPaused: !1 };
                case 'pending':
                    return {
                        ...n,
                        context: e.context,
                        data: void 0,
                        failureCount: 0,
                        failureReason: null,
                        error: null,
                        isPaused: e.isPaused,
                        status: 'pending',
                        variables: e.variables,
                        submittedAt: Date.now(),
                    };
                case 'success':
                    return {
                        ...n,
                        data: e.data,
                        failureCount: 0,
                        failureReason: null,
                        error: null,
                        status: 'success',
                        isPaused: !1,
                    };
                case 'error':
                    return {
                        ...n,
                        data: void 0,
                        error: e.error,
                        failureCount: n.failureCount + 1,
                        failureReason: e.error,
                        isPaused: !1,
                        status: 'error',
                    };
            }
        };
        ((this.state = t(this.state)),
            Ge.batch(() => {
                (this.#e.forEach((n) => {
                    n.onMutationUpdate(e);
                }),
                    this.#n.notify({ mutation: this, type: 'updated', action: e }));
            }));
    }
};
function Ed() {
    return {
        context: void 0,
        data: void 0,
        error: null,
        failureCount: 0,
        failureReason: null,
        isPaused: !1,
        status: 'idle',
        variables: void 0,
        submittedAt: 0,
    };
}
var Eb = class extends Pr {
    constructor(e = {}) {
        (super(), (this.config = e), (this.#t = new Set()), (this.#e = new Map()), (this.#n = 0));
    }
    #t;
    #e;
    #n;
    build(e, t, n) {
        const r = new Rb({
            client: e,
            mutationCache: this,
            mutationId: ++this.#n,
            options: e.defaultMutationOptions(t),
            state: n,
        });
        return (this.add(r), r);
    }
    add(e) {
        this.#t.add(e);
        const t = Es(e);
        if (typeof t == 'string') {
            const n = this.#e.get(t);
            n ? n.push(e) : this.#e.set(t, [e]);
        }
        this.notify({ type: 'added', mutation: e });
    }
    remove(e) {
        if (this.#t.delete(e)) {
            const t = Es(e);
            if (typeof t == 'string') {
                const n = this.#e.get(t);
                if (n)
                    if (n.length > 1) {
                        const r = n.indexOf(e);
                        r !== -1 && n.splice(r, 1);
                    } else n[0] === e && this.#e.delete(t);
            }
        }
        this.notify({ type: 'removed', mutation: e });
    }
    canRun(e) {
        const t = Es(e);
        if (typeof t == 'string') {
            const r = this.#e.get(t)?.find((s) => s.state.status === 'pending');
            return !r || r === e;
        } else return !0;
    }
    runNext(e) {
        const t = Es(e);
        return typeof t == 'string'
            ? (this.#e
                  .get(t)
                  ?.find((r) => r !== e && r.state.isPaused)
                  ?.continue() ?? Promise.resolve())
            : Promise.resolve();
    }
    clear() {
        Ge.batch(() => {
            (this.#t.forEach((e) => {
                this.notify({ type: 'removed', mutation: e });
            }),
                this.#t.clear(),
                this.#e.clear());
        });
    }
    getAll() {
        return Array.from(this.#t);
    }
    find(e) {
        const t = { exact: !0, ...e };
        return this.getAll().find((n) => Wc(t, n));
    }
    findAll(e = {}) {
        return this.getAll().filter((t) => Wc(e, t));
    }
    notify(e) {
        Ge.batch(() => {
            this.listeners.forEach((t) => {
                t(e);
            });
        });
    }
    resumePausedMutations() {
        const e = this.getAll().filter((t) => t.state.isPaused);
        return Ge.batch(() => Promise.all(e.map((t) => t.continue().catch(pt))));
    }
};
function Es(e) {
    return e.options.scope?.id;
}
var Mb = class extends Pr {
        #t;
        #e = void 0;
        #n;
        #r;
        constructor(t, n) {
            (super(), (this.#t = t), this.setOptions(n), this.bindMethods(), this.#o());
        }
        bindMethods() {
            ((this.mutate = this.mutate.bind(this)), (this.reset = this.reset.bind(this)));
        }
        setOptions(t) {
            const n = this.options;
            ((this.options = this.#t.defaultMutationOptions(t)),
                co(this.options, n) ||
                    this.#t
                        .getMutationCache()
                        .notify({ type: 'observerOptionsUpdated', mutation: this.#n, observer: this }),
                n?.mutationKey && this.options.mutationKey && tr(n.mutationKey) !== tr(this.options.mutationKey)
                    ? this.reset()
                    : this.#n?.state.status === 'pending' && this.#n.setOptions(this.options));
        }
        onUnsubscribe() {
            this.hasListeners() || this.#n?.removeObserver(this);
        }
        onMutationUpdate(t) {
            (this.#o(), this.#s(t));
        }
        getCurrentResult() {
            return this.#e;
        }
        reset() {
            (this.#n?.removeObserver(this), (this.#n = void 0), this.#o(), this.#s());
        }
        mutate(t, n) {
            return (
                (this.#r = n),
                this.#n?.removeObserver(this),
                (this.#n = this.#t.getMutationCache().build(this.#t, this.options)),
                this.#n.addObserver(this),
                this.#n.execute(t)
            );
        }
        #o() {
            const t = this.#n?.state ?? Ed();
            this.#e = {
                ...t,
                isPending: t.status === 'pending',
                isSuccess: t.status === 'success',
                isError: t.status === 'error',
                isIdle: t.status === 'idle',
                mutate: this.mutate,
                reset: this.reset,
            };
        }
        #s(t) {
            Ge.batch(() => {
                if (this.#r && this.hasListeners()) {
                    const n = this.#e.variables,
                        r = this.#e.context,
                        s = { client: this.#t, meta: this.options.meta, mutationKey: this.options.mutationKey };
                    if (t?.type === 'success') {
                        try {
                            this.#r.onSuccess?.(t.data, n, r, s);
                        } catch (o) {
                            Promise.reject(o);
                        }
                        try {
                            this.#r.onSettled?.(t.data, null, n, r, s);
                        } catch (o) {
                            Promise.reject(o);
                        }
                    } else if (t?.type === 'error') {
                        try {
                            this.#r.onError?.(t.error, n, r, s);
                        } catch (o) {
                            Promise.reject(o);
                        }
                        try {
                            this.#r.onSettled?.(void 0, t.error, n, r, s);
                        } catch (o) {
                            Promise.reject(o);
                        }
                    }
                }
                this.listeners.forEach((n) => {
                    n(this.#e);
                });
            });
        }
    },
    Md = class extends Pr {
        constructor(e = {}) {
            (super(), (this.config = e), (this.#t = new Map()));
        }
        #t;
        build(e, t, n) {
            const r = t.queryKey,
                s = t.queryHash ?? va(r, t);
            let o = this.get(s);
            return (
                o ||
                    ((o = new vb({
                        client: e,
                        queryKey: r,
                        queryHash: s,
                        options: e.defaultQueryOptions(t),
                        state: n,
                        defaultOptions: e.getQueryDefaults(r),
                    })),
                    this.add(o)),
                o
            );
        }
        add(e) {
            this.#t.has(e.queryHash) || (this.#t.set(e.queryHash, e), this.notify({ type: 'added', query: e }));
        }
        remove(e) {
            const t = this.#t.get(e.queryHash);
            t && (e.destroy(), t === e && this.#t.delete(e.queryHash), this.notify({ type: 'removed', query: e }));
        }
        clear() {
            Ge.batch(() => {
                this.getAll().forEach((e) => {
                    this.remove(e);
                });
            });
        }
        get(e) {
            return this.#t.get(e);
        }
        getAll() {
            return [...this.#t.values()];
        }
        find(e) {
            const t = { exact: !0, ...e };
            return this.getAll().find((n) => Hc(t, n));
        }
        findAll(e = {}) {
            const t = this.getAll();
            return Object.keys(e).length > 0 ? t.filter((n) => Hc(e, n)) : t;
        }
        notify(e) {
            Ge.batch(() => {
                this.listeners.forEach((t) => {
                    t(e);
                });
            });
        }
        onFocus() {
            Ge.batch(() => {
                this.getAll().forEach((e) => {
                    e.onFocus();
                });
            });
        }
        onOnline() {
            Ge.batch(() => {
                this.getAll().forEach((e) => {
                    e.onOnline();
                });
            });
        }
    },
    Cb = class {
        #t;
        #e;
        #n;
        #r;
        #o;
        #s;
        #i;
        #a;
        constructor(e = {}) {
            ((this.#t = e.queryCache || new Md()),
                (this.#e = e.mutationCache || new Eb()),
                (this.#n = e.defaultOptions || {}),
                (this.#r = new Map()),
                (this.#o = new Map()),
                (this.#s = 0));
        }
        mount() {
            (this.#s++,
                this.#s === 1 &&
                    ((this.#i = ba.subscribe(async (e) => {
                        e && (await this.resumePausedMutations(), this.#t.onFocus());
                    })),
                    (this.#a = lo.subscribe(async (e) => {
                        e && (await this.resumePausedMutations(), this.#t.onOnline());
                    }))));
        }
        unmount() {
            (this.#s--, this.#s === 0 && (this.#i?.(), (this.#i = void 0), this.#a?.(), (this.#a = void 0)));
        }
        isFetching(e) {
            return this.#t.findAll({ ...e, fetchStatus: 'fetching' }).length;
        }
        isMutating(e) {
            return this.#e.findAll({ ...e, status: 'pending' }).length;
        }
        getQueryData(e) {
            const t = this.defaultQueryOptions({ queryKey: e });
            return this.#t.get(t.queryHash)?.state.data;
        }
        ensureQueryData(e) {
            const t = this.defaultQueryOptions(e),
                n = this.#t.build(this, t),
                r = n.state.data;
            return r === void 0
                ? this.fetchQuery(e)
                : (e.revalidateIfStale && n.isStaleByTime(En(t.staleTime, n)) && this.prefetchQuery(t),
                  Promise.resolve(r));
        }
        getQueriesData(e) {
            return this.#t.findAll(e).map(({ queryKey: t, state: n }) => {
                const r = n.data;
                return [t, r];
            });
        }
        setQueryData(e, t, n) {
            const r = this.defaultQueryOptions({ queryKey: e }),
                o = this.#t.get(r.queryHash)?.state.data,
                i = ab(t, o);
            if (i !== void 0) return this.#t.build(this, r).setData(i, { ...n, manual: !0 });
        }
        setQueriesData(e, t, n) {
            return Ge.batch(() => this.#t.findAll(e).map(({ queryKey: r }) => [r, this.setQueryData(r, t, n)]));
        }
        getQueryState(e) {
            const t = this.defaultQueryOptions({ queryKey: e });
            return this.#t.get(t.queryHash)?.state;
        }
        removeQueries(e) {
            const t = this.#t;
            Ge.batch(() => {
                t.findAll(e).forEach((n) => {
                    t.remove(n);
                });
            });
        }
        resetQueries(e, t) {
            const n = this.#t;
            return Ge.batch(
                () => (
                    n.findAll(e).forEach((r) => {
                        r.reset();
                    }),
                    this.refetchQueries({ type: 'active', ...e }, t)
                )
            );
        }
        cancelQueries(e, t = {}) {
            const n = { revert: !0, ...t },
                r = Ge.batch(() => this.#t.findAll(e).map((s) => s.cancel(n)));
            return Promise.all(r).then(pt).catch(pt);
        }
        invalidateQueries(e, t = {}) {
            return Ge.batch(
                () => (
                    this.#t.findAll(e).forEach((n) => {
                        n.invalidate();
                    }),
                    e?.refetchType === 'none'
                        ? Promise.resolve()
                        : this.refetchQueries({ ...e, type: e?.refetchType ?? e?.type ?? 'active' }, t)
                )
            );
        }
        refetchQueries(e, t = {}) {
            const n = { ...t, cancelRefetch: t.cancelRefetch ?? !0 },
                r = Ge.batch(() =>
                    this.#t
                        .findAll(e)
                        .filter((s) => !s.isDisabled() && !s.isStatic())
                        .map((s) => {
                            let o = s.fetch(void 0, n);
                            return (
                                n.throwOnError || (o = o.catch(pt)),
                                s.state.fetchStatus === 'paused' ? Promise.resolve() : o
                            );
                        })
                );
            return Promise.all(r).then(pt);
        }
        fetchQuery(e) {
            const t = this.defaultQueryOptions(e);
            t.retry === void 0 && (t.retry = !1);
            const n = this.#t.build(this, t);
            return n.isStaleByTime(En(t.staleTime, n)) ? n.fetch(t) : Promise.resolve(n.state.data);
        }
        prefetchQuery(e) {
            return this.fetchQuery(e).then(pt).catch(pt);
        }
        fetchInfiniteQuery(e) {
            return ((e._type = 'infinite'), this.fetchQuery(e));
        }
        prefetchInfiniteQuery(e) {
            return this.fetchInfiniteQuery(e).then(pt).catch(pt);
        }
        ensureInfiniteQueryData(e) {
            return ((e._type = 'infinite'), this.ensureQueryData(e));
        }
        resumePausedMutations() {
            return lo.isOnline() ? this.#e.resumePausedMutations() : Promise.resolve();
        }
        getQueryCache() {
            return this.#t;
        }
        getMutationCache() {
            return this.#e;
        }
        getDefaultOptions() {
            return this.#n;
        }
        setDefaultOptions(e) {
            this.#n = e;
        }
        setQueryDefaults(e, t) {
            this.#r.set(tr(e), { queryKey: e, defaultOptions: t });
        }
        getQueryDefaults(e) {
            const t = [...this.#r.values()],
                n = {};
            return (
                t.forEach((r) => {
                    Zr(e, r.queryKey) && Object.assign(n, r.defaultOptions);
                }),
                n
            );
        }
        setMutationDefaults(e, t) {
            this.#o.set(tr(e), { mutationKey: e, defaultOptions: t });
        }
        getMutationDefaults(e) {
            const t = [...this.#o.values()],
                n = {};
            return (
                t.forEach((r) => {
                    Zr(e, r.mutationKey) && Object.assign(n, r.defaultOptions);
                }),
                n
            );
        }
        defaultQueryOptions(e) {
            if (e._defaulted) return e;
            const t = { ...this.#n.queries, ...this.getQueryDefaults(e.queryKey), ...e, _defaulted: !0 };
            return (
                t.queryHash || (t.queryHash = va(t.queryKey, t)),
                t.refetchOnReconnect === void 0 && (t.refetchOnReconnect = t.networkMode !== 'always'),
                t.throwOnError === void 0 && (t.throwOnError = !!t.suspense),
                !t.networkMode && t.persister && (t.networkMode = 'offlineFirst'),
                t.queryFn === wa && (t.enabled = !1),
                t
            );
        }
        defaultMutationOptions(e) {
            return e?._defaulted
                ? e
                : {
                      ...this.#n.mutations,
                      ...(e?.mutationKey && this.getMutationDefaults(e.mutationKey)),
                      ...e,
                      _defaulted: !0,
                  };
        }
        clear() {
            (this.#t.clear(), this.#e.clear());
        }
    },
    Cd = v.createContext(void 0),
    Pd = (e) => {
        const t = v.useContext(Cd);
        if (!t) throw new Error('No QueryClient set, use QueryClientProvider to set one');
        return t;
    },
    Pb = ({ client: e, children: t }) => (
        v.useEffect(
            () => (
                e.mount(),
                () => {
                    e.unmount();
                }
            ),
            [e]
        ),
        F.jsx(Cd.Provider, { value: e, children: t })
    ),
    Td = v.createContext(!1),
    Tb = () => v.useContext(Td);
Td.Provider;
function Ib() {
    let e = !1;
    return {
        clearReset: () => {
            e = !1;
        },
        reset: () => {
            e = !0;
        },
        isReset: () => e,
    };
}
var Fb = v.createContext(Ib()),
    Id = () => v.useContext(Fb),
    kb = (e, t, n) => {
        const r =
            n?.state.error && typeof e.throwOnError == 'function'
                ? Sa(e.throwOnError, [n.state.error, n])
                : e.throwOnError;
        (e.suspense || e.experimental_prefetchInRender || r) && (t.isReset() || (e.retryOnMount = !1));
    },
    Ob = (e) => {
        v.useEffect(() => {
            e.clearReset();
        }, [e]);
    },
    Ab = ({ result: e, errorResetBoundary: t, throwOnError: n, query: r, suspense: s }) =>
        e.isError && !t.isReset() && !e.isFetching && r && ((s && e.data === void 0) || Sa(n, [e.error, r])),
    _b = (e, t) => t.state.data === void 0,
    Lb = (e) => {
        if (e.suspense) {
            const n = (s) => (s === 'static' ? s : Math.max(s ?? 1e3, 1e3)),
                r = e.staleTime;
            ((e.staleTime = typeof r == 'function' ? (...s) => n(r(...s)) : n(r)),
                typeof e.gcTime == 'number' && (e.gcTime = Math.max(e.gcTime, 1e3)));
        }
    },
    Db = (e, t) => e.isLoading && e.isFetching && !t,
    Vb = (e, t) => e?.suspense && t.isPending,
    Zc = (e, t, n) =>
        t.fetchOptimistic(e).catch(() => {
            n.clearReset();
        });
function Nb(e, t, n) {
    const r = Tb(),
        s = Id(),
        o = Pd(),
        i = o.defaultQueryOptions(e);
    o.getDefaultOptions().queries?._experimental_beforeQuery?.(i);
    const a = o.getQueryCache().get(i.queryHash),
        d = e.subscribed !== !1;
    ((i._optimisticResults = r ? 'isRestoring' : d ? 'optimistic' : void 0), Lb(i), kb(i, s, a), Ob(s));
    const u = !o.getQueryCache().get(i.queryHash),
        [l] = v.useState(() => new t(o, i)),
        c = l.getOptimisticResult(i),
        f = !r && d;
    if (
        (v.useSyncExternalStore(
            v.useCallback(
                (p) => {
                    const h = f ? l.subscribe(Ge.batchCalls(p)) : pt;
                    return (l.updateResult(), h);
                },
                [l, f]
            ),
            () => l.getCurrentResult(),
            () => l.getCurrentResult()
        ),
        v.useEffect(() => {
            l.setOptions(i);
        }, [i, l]),
        Vb(i, c))
    )
        throw Zc(i, l, s);
    if (Ab({ result: c, errorResetBoundary: s, throwOnError: i.throwOnError, query: a, suspense: i.suspense }))
        throw c.error;
    return (
        o.getDefaultOptions().queries?._experimental_afterQuery?.(i, c),
        i.experimental_prefetchInRender &&
            !es.isServer() &&
            Db(c, r) &&
            (u ? Zc(i, l, s) : a?.promise)?.catch(pt).finally(() => {
                l.updateResult();
            }),
        i.notifyOnChangeProps ? c : l.trackResult(c)
    );
}
function rC(e, t) {
    return Nb({ ...e, enabled: !0, suspense: !0, throwOnError: _b, placeholderData: void 0 }, wb);
}
function sC(e, t) {
    const n = Pd(),
        [r] = v.useState(() => new Mb(n, e));
    v.useEffect(() => {
        r.setOptions(e);
    }, [r, e]);
    const s = v.useSyncExternalStore(
            v.useCallback((i) => r.subscribe(Ge.batchCalls(i)), [r]),
            () => r.getCurrentResult(),
            () => r.getCurrentResult()
        ),
        o = v.useCallback(
            (i, a) => {
                r.mutate(i, a).catch(pt);
            },
            [r]
        );
    if (s.error && Sa(r.options.throwOnError, [s.error])) throw s.error;
    return { ...s, mutate: o, mutateAsync: s.mutate };
}
var uo = v.use,
    Ur = typeof window < 'u' ? v.useLayoutEffect : v.useEffect;
function si(e) {
    const t = v.useRef({ value: e, prev: null }),
        n = t.current.value;
    return (e !== n && (t.current = { value: e, prev: n }), t.current.prev);
}
function jb(e, t, n = {}, r = {}) {
    v.useEffect(() => {
        if (!e.current || r.disabled || typeof IntersectionObserver != 'function') return;
        const s = new IntersectionObserver(([o]) => {
            t(o);
        }, n);
        return (
            s.observe(e.current),
            () => {
                s.disconnect();
            }
        );
    }, [t, n, r.disabled, e]);
}
function Bb(e) {
    const t = v.useRef(null);
    return (v.useImperativeHandle(e, () => t.current, []), t);
}
function $b({ promise: e }) {
    if (uo) return uo(e);
    const t = Gp(e);
    if (t[Nt].status === 'pending') throw t;
    if (t[Nt].status === 'error') throw t[Nt].error;
    return t[Nt].data;
}
function zb(e) {
    const t = F.jsx(Ub, { ...e });
    return e.fallback ? F.jsx(v.Suspense, { fallback: e.fallback, children: t }) : t;
}
function Ub(e) {
    const t = $b(e);
    return e.children(t);
}
function Ra(e) {
    const t = e.errorComponent ?? Ea;
    return F.jsx(Hb, {
        getResetKey: e.getResetKey,
        onCatch: e.onCatch,
        children: ({ error: n, reset: r }) => (n ? v.createElement(t, { error: n, reset: r }) : e.children),
    });
}
var Hb = class extends v.Component {
    constructor(...e) {
        (super(...e), (this.state = { error: null }));
    }
    static getDerivedStateFromProps(e, t) {
        const n = e.getResetKey();
        return t.error && t.resetKey !== n ? { resetKey: n, error: null } : { resetKey: n };
    }
    static getDerivedStateFromError(e) {
        return { error: e };
    }
    reset() {
        this.setState({ error: null });
    }
    componentDidCatch(e, t) {
        this.props.onCatch && this.props.onCatch(e, t);
    }
    render() {
        return this.props.children({
            error: this.state.error,
            reset: () => {
                this.reset();
            },
        });
    }
};
function Ea({ error: e }) {
    const [t, n] = v.useState(!1);
    return F.jsxs('div', {
        style: { padding: '.5rem', maxWidth: '100%' },
        children: [
            F.jsxs('div', {
                style: { display: 'flex', alignItems: 'center', gap: '.5rem' },
                children: [
                    F.jsx('strong', { style: { fontSize: '1rem' }, children: 'Something went wrong!' }),
                    F.jsx('button', {
                        style: {
                            appearance: 'none',
                            fontSize: '.6em',
                            border: '1px solid currentColor',
                            padding: '.1rem .2rem',
                            fontWeight: 'bold',
                            borderRadius: '.25rem',
                        },
                        onClick: () => n((r) => !r),
                        children: t ? 'Hide Error' : 'Show Error',
                    }),
                ],
            }),
            F.jsx('div', { style: { height: '.25rem' } }),
            t
                ? F.jsx('div', {
                      children: F.jsx('pre', {
                          style: {
                              fontSize: '.7em',
                              border: '1px solid red',
                              borderRadius: '.25rem',
                              padding: '.3rem',
                              color: 'red',
                              overflow: 'auto',
                          },
                          children: e.message ? F.jsx('code', { children: e.message }) : null,
                      }),
                  })
                : null,
        ],
    });
}
function Wb({ children: e, fallback: t = null }) {
    return Ma() ? F.jsx(K.Fragment, { children: e }) : F.jsx(K.Fragment, { children: t });
}
function Ma() {
    return K.useSyncExternalStore(
        Kb,
        () => !0,
        () => !1
    );
}
function Kb() {
    return () => {};
}
var Fd = v.createContext(null);
function Ye(e) {
    return v.useContext(Fd);
}
var Vo = v.createContext(void 0),
    Gb = v.createContext(void 0),
    De = ((e) => (
        (e[(e.None = 0)] = 'None'),
        (e[(e.Mutable = 1)] = 'Mutable'),
        (e[(e.Watching = 2)] = 'Watching'),
        (e[(e.RecursedCheck = 4)] = 'RecursedCheck'),
        (e[(e.Recursed = 8)] = 'Recursed'),
        (e[(e.Dirty = 16)] = 'Dirty'),
        (e[(e.Pending = 32)] = 'Pending'),
        e
    ))(De || {});
function qb({ update: e, notify: t, unwatched: n }) {
    return { link: r, unlink: s, propagate: o, checkDirty: i, shallowPropagate: a };
    function r(u, l, c) {
        const f = l.depsTail;
        if (f !== void 0 && f.dep === u) return;
        const p = f !== void 0 ? f.nextDep : l.deps;
        if (p !== void 0 && p.dep === u) {
            ((p.version = c), (l.depsTail = p));
            return;
        }
        const h = u.subsTail;
        if (h !== void 0 && h.version === c && h.sub === l) return;
        const g =
            (l.depsTail =
            u.subsTail =
                { version: c, dep: u, sub: l, prevDep: f, nextDep: p, prevSub: h, nextSub: void 0 });
        (p !== void 0 && (p.prevDep = g),
            f !== void 0 ? (f.nextDep = g) : (l.deps = g),
            h !== void 0 ? (h.nextSub = g) : (u.subs = g));
    }
    function s(u, l = u.sub) {
        const c = u.dep,
            f = u.prevDep,
            p = u.nextDep,
            h = u.nextSub,
            g = u.prevSub;
        return (
            p !== void 0 ? (p.prevDep = f) : (l.depsTail = f),
            f !== void 0 ? (f.nextDep = p) : (l.deps = p),
            h !== void 0 ? (h.prevSub = g) : (c.subsTail = g),
            g !== void 0 ? (g.nextSub = h) : (c.subs = h) === void 0 && n(c),
            p
        );
    }
    function o(u) {
        let l = u.nextSub,
            c;
        e: do {
            const f = u.sub;
            let p = f.flags;
            if (
                (p & 60
                    ? p & 12
                        ? p & 4
                            ? !(p & 48) && d(u, f)
                                ? ((f.flags = p | 40), (p &= 1))
                                : (p = 0)
                            : (f.flags = (p & -9) | 32)
                        : (p = 0)
                    : (f.flags = p | 32),
                p & 2 && t(f),
                p & 1)
            ) {
                const h = f.subs;
                if (h !== void 0) {
                    const g = (u = h).nextSub;
                    g !== void 0 && ((c = { value: l, prev: c }), (l = g));
                    continue;
                }
            }
            if ((u = l) !== void 0) {
                l = u.nextSub;
                continue;
            }
            for (; c !== void 0;)
                if (((u = c.value), (c = c.prev), u !== void 0)) {
                    l = u.nextSub;
                    continue e;
                }
            break;
        } while (!0);
    }
    function i(u, l) {
        let c,
            f = 0,
            p = !1;
        e: do {
            const h = u.dep,
                g = h.flags;
            if (l.flags & 16) p = !0;
            else if ((g & 17) === 17) {
                if (e(h)) {
                    const m = h.subs;
                    (m.nextSub !== void 0 && a(m), (p = !0));
                }
            } else if ((g & 33) === 33) {
                ((u.nextSub !== void 0 || u.prevSub !== void 0) && (c = { value: u, prev: c }),
                    (u = h.deps),
                    (l = h),
                    ++f);
                continue;
            }
            if (!p) {
                const m = u.nextDep;
                if (m !== void 0) {
                    u = m;
                    continue;
                }
            }
            for (; f--;) {
                const m = l.subs,
                    y = m.nextSub !== void 0;
                if ((y ? ((u = c.value), (c = c.prev)) : (u = m), p)) {
                    if (e(l)) {
                        (y && a(m), (l = u.sub));
                        continue;
                    }
                    p = !1;
                } else l.flags &= -33;
                l = u.sub;
                const b = u.nextDep;
                if (b !== void 0) {
                    u = b;
                    continue e;
                }
            }
            return p;
        } while (!0);
    }
    function a(u) {
        do {
            const l = u.sub,
                c = l.flags;
            (c & 48) === 32 && ((l.flags = c | 16), (c & 6) === 2 && t(l));
        } while ((u = u.nextSub) !== void 0);
    }
    function d(u, l) {
        let c = l.depsTail;
        for (; c !== void 0;) {
            if (c === u) return !0;
            c = c.prevDep;
        }
        return !1;
    }
}
function Qb(e, t, n) {
    const r = typeof e == 'object',
        s = r ? e : void 0;
    return {
        next: (r ? e.next : e)?.bind(s),
        error: (r ? e.error : t)?.bind(s),
        complete: (r ? e.complete : n)?.bind(s),
    };
}
const Bi = [];
let Ws = 0;
const {
    link: el,
    unlink: Yb,
    propagate: Xb,
    checkDirty: kd,
    shallowPropagate: tl,
} = qb({
    update(e) {
        return e._update();
    },
    notify(e) {
        ((Bi[$i++] = e), (e.flags &= ~De.Watching));
    },
    unwatched(e) {
        e.depsTail !== void 0 && ((e.depsTail = void 0), (e.flags = De.Mutable | De.Dirty), fo(e));
    },
});
let Ms = 0,
    $i = 0,
    Dt,
    zi = 0;
function Od(e) {
    try {
        (++zi, e());
    } finally {
        --zi || Ad();
    }
}
function fo(e) {
    const t = e.depsTail;
    let n = t !== void 0 ? t.nextDep : e.deps;
    for (; n !== void 0;) n = Yb(n, e);
}
function Ad() {
    if (!(zi > 0)) {
        for (; Ms < $i;) {
            const e = Bi[Ms];
            ((Bi[Ms++] = void 0), e.notify());
        }
        ((Ms = 0), ($i = 0));
    }
}
function nl(e, t) {
    const n = typeof e == 'function',
        r = e,
        s = {
            _snapshot: n ? void 0 : e,
            subs: void 0,
            subsTail: void 0,
            deps: void 0,
            depsTail: void 0,
            flags: n ? De.None : De.Mutable,
            get() {
                return (Dt !== void 0 && el(s, Dt, Ws), s._snapshot);
            },
            subscribe(o) {
                const i = Qb(o),
                    a = { current: !1 },
                    d = Jb(() => {
                        (s.get(), a.current ? i.next?.(s._snapshot) : (a.current = !0));
                    });
                return {
                    unsubscribe: () => {
                        d.stop();
                    },
                };
            },
            _update(o) {
                const i = Dt,
                    a = t?.compare ?? Object.is;
                if (n) ((Dt = s), ++Ws, (s.depsTail = void 0));
                else if (o === void 0) return !1;
                n && (s.flags = De.Mutable | De.RecursedCheck);
                try {
                    const d = s._snapshot,
                        u = typeof o == 'function' ? o(d) : o === void 0 && n ? r(d) : o;
                    return d === void 0 || !a(d, u) ? ((s._snapshot = u), !0) : !1;
                } finally {
                    ((Dt = i), n && (s.flags &= ~De.RecursedCheck), fo(s));
                }
            },
        };
    return (
        n
            ? ((s.flags = De.Mutable | De.Dirty),
              (s.get = function () {
                  const o = s.flags;
                  if (o & De.Dirty || (o & De.Pending && kd(s.deps, s))) {
                      if (s._update()) {
                          const i = s.subs;
                          i !== void 0 && tl(i);
                      }
                  } else o & De.Pending && (s.flags = o & ~De.Pending);
                  return (Dt !== void 0 && el(s, Dt, Ws), s._snapshot);
              }))
            : (s.set = function (o) {
                  if (s._update(o)) {
                      const i = s.subs;
                      i !== void 0 && (Xb(i), tl(i), Ad());
                  }
              }),
        s
    );
}
function Jb(e) {
    const t = () => {
            const r = Dt;
            ((Dt = n), ++Ws, (n.depsTail = void 0), (n.flags = De.Watching | De.RecursedCheck));
            try {
                return e();
            } finally {
                ((Dt = r), (n.flags &= ~De.RecursedCheck), fo(n));
            }
        },
        n = {
            deps: void 0,
            depsTail: void 0,
            subs: void 0,
            subsTail: void 0,
            flags: De.Watching | De.RecursedCheck,
            notify() {
                const r = this.flags;
                r & De.Dirty || (r & De.Pending && kd(this.deps, this)) ? t() : (this.flags = De.Watching);
            },
            stop() {
                ((this.flags = De.None), (this.depsTail = void 0), fo(this));
            },
        };
    return (t(), n);
}
function Zb(e, t) {
    return e === t;
}
function je(e, t, n = Zb) {
    const r = v.useCallback(
            (i) => {
                if (!e) return () => {};
                const { unsubscribe: a } = e.subscribe(i);
                return a;
            },
            [e]
        ),
        s = v.useCallback(() => e?.get(), [e]);
    return la.useSyncExternalStoreWithSelector(r, s, s, t, n);
}
var oi = {
    get() {},
    subscribe() {
        return { unsubscribe() {} };
    },
};
function ev(e, t) {
    const n = v.useRef();
    return (r) => {
        const s = e?.select ? e.select(r) : r;
        return (e?.structuralSharing ?? t.options.defaultStructuralSharing) ? (n.current = Bn(n.current, s)) : s;
    };
}
function kn(e) {
    const t = Ye(),
        n = v.useContext(e.from ? Gb : Vo),
        r = e.from ? t.stores.getRouteMatchStore(e.from) : t.stores.matchStores.get(n),
        s = ev(e, t),
        o = je(r ?? oi, (i) => (i ? s(i) : oi));
    if (o !== oi) return o;
    (e.shouldThrow ?? !0) && xt();
}
function Ca(e) {
    return kn({
        from: e.from,
        strict: e.strict,
        structuralSharing: e.structuralSharing,
        select: (t) => (e.select ? e.select(t.loaderData) : t.loaderData),
    });
}
function Pa(e) {
    const { select: t, ...n } = e;
    return kn({ ...n, select: (r) => (t ? t(r.loaderDeps) : r.loaderDeps) });
}
function Ta(e) {
    return kn({
        from: e.from,
        shouldThrow: e.shouldThrow,
        structuralSharing: e.structuralSharing,
        strict: e.strict,
        select: (t) => {
            const n = e.strict === !1 ? t.params : t._strictParams;
            return e.select ? e.select(n) : n;
        },
    });
}
function Ia(e) {
    return kn({
        from: e.from,
        strict: e.strict,
        shouldThrow: e.shouldThrow,
        structuralSharing: e.structuralSharing,
        select: (t) => (e.select ? e.select(t.search) : t.search),
    });
}
function Fa(e) {
    const t = Ye();
    return v.useCallback((n) => t.navigate({ ...n, from: n.from ?? e?.from }), [e?.from, t]);
}
function ka(e) {
    return kn({ ...e, select: (t) => (e.select ? e.select(t.context) : t.context) });
}
function tv(e, t) {
    const n = Ye(),
        r = Bb(t),
        {
            activeProps: s,
            inactiveProps: o,
            activeOptions: i,
            to: a,
            preload: d,
            preloadDelay: u,
            preloadIntentProximity: l,
            hashScrollIntoView: c,
            replace: f,
            startTransition: p,
            resetScroll: h,
            viewTransition: g,
            children: m,
            target: y,
            disabled: b,
            style: R,
            className: w,
            onClick: E,
            onBlur: C,
            onFocus: M,
            onMouseEnter: S,
            onMouseLeave: P,
            onTouchStart: I,
            ignoreBlocker: V,
            params: A,
            search: O,
            hash: L,
            state: k,
            mask: _,
            reloadDocument: B,
            unsafeRelative: N,
            from: U,
            _fromLocation: D,
            ...X
        } = e,
        Z = Ma(),
        Y = v.useMemo(
            () => e,
            [n, e.from, e._fromLocation, e.hash, e.to, e.search, e.params, e.state, e.mask, e.unsafeRelative]
        ),
        Q = je(
            n.stores.location,
            (j) => j,
            (j, se) => j.href === se.href
        ),
        H = v.useMemo(() => {
            const j = { _fromLocation: Q, ...Y };
            return n.buildLocation(j);
        }, [n, Q, Y]),
        q = H.maskedLocation ? H.maskedLocation.publicHref : H.publicHref,
        pe = H.maskedLocation ? H.maskedLocation.external : H.external,
        z = v.useMemo(() => av(q, pe, n.history, b), [b, pe, q, n.history]),
        J = v.useMemo(() => {
            if (z?.external) return ro(z.href, n.protocolAllowlist) ? void 0 : z.href;
            if (!cv(a) && !(typeof a != 'string' || a.indexOf(':') === -1))
                try {
                    return (new URL(a), ro(a, n.protocolAllowlist) ? void 0 : a);
                } catch {}
        }, [a, z, n.protocolAllowlist]),
        ge = v.useMemo(() => {
            if (J) return !1;
            if (i?.exact) {
                if (!fp(Q.pathname, H.pathname, n.basepath)) return !1;
            } else {
                const j = so(Q.pathname, n.basepath),
                    se = so(H.pathname, n.basepath);
                if (!(j.startsWith(se) && (j.length === se.length || j[se.length] === '/'))) return !1;
            }
            return (i?.includeSearch ?? !0) &&
                !gt(Q.search, H.search, { partial: !i?.exact, ignoreUndefined: !i?.explicitUndefined })
                ? !1
                : i?.includeHash
                  ? Z && Q.hash === H.hash
                  : !0;
        }, [
            i?.exact,
            i?.explicitUndefined,
            i?.includeHash,
            i?.includeSearch,
            Q,
            J,
            Z,
            H.hash,
            H.pathname,
            H.search,
            n.basepath,
        ]),
        we = ge ? (jn(s, {}) ?? nv) : ii,
        W = ge ? ii : (jn(o, {}) ?? ii),
        ie = [w, we.className, W.className].filter(Boolean).join(' '),
        ue = (R || we.style || W.style) && { ...R, ...we.style, ...W.style },
        [Ce, Ee] = v.useState(!1),
        re = v.useRef(!1),
        ce = e.reloadDocument || J ? !1 : (d ?? n.options.defaultPreload),
        ee = u ?? n.options.defaultPreloadDelay ?? 0,
        ye = v.useCallback(() => {
            n.preloadRoute({ ...Y, _builtLocation: H }).catch((j) => {
                (console.warn(j), console.warn(qp));
            });
        }, [n, Y, H]);
    (jb(
        r,
        v.useCallback(
            (j) => {
                j?.isIntersecting && ye();
            },
            [ye]
        ),
        iv,
        { disabled: !!b || ce !== 'viewport' }
    ),
        v.useEffect(() => {
            re.current || (!b && ce === 'render' && (ye(), (re.current = !0)));
        }, [b, ye, ce]));
    const ke = (j) => {
        const se = j.currentTarget.getAttribute('target'),
            G = y !== void 0 ? y : se;
        if (!b && !lv(j) && !j.defaultPrevented && (!G || G === '_self') && j.button === 0) {
            (j.preventDefault(),
                Pn.flushSync(() => {
                    Ee(!0);
                }));
            const he = n.subscribe('onResolved', () => {
                (he(), Ee(!1));
            });
            n.navigate({
                ...Y,
                replace: f,
                resetScroll: h,
                hashScrollIntoView: c,
                startTransition: p,
                viewTransition: g,
                ignoreBlocker: V,
            });
        }
    };
    if (J)
        return {
            ...X,
            ref: r,
            href: J,
            ...(m && { children: m }),
            ...(y && { target: y }),
            ...(b && { disabled: b }),
            ...(R && { style: R }),
            ...(w && { className: w }),
            ...(E && { onClick: E }),
            ...(C && { onBlur: C }),
            ...(M && { onFocus: M }),
            ...(S && { onMouseEnter: S }),
            ...(P && { onMouseLeave: P }),
            ...(I && { onTouchStart: I }),
        };
    const ae = (j) => {
            if (b || ce !== 'intent') return;
            if (!ee) {
                ye();
                return;
            }
            const se = j.currentTarget;
            if (Dr.has(se)) return;
            const G = setTimeout(() => {
                (Dr.delete(se), ye());
            }, ee);
            Dr.set(se, G);
        },
        Ve = (j) => {
            b || ce !== 'intent' || ye();
        },
        $ = (j) => {
            if (b || !ce || !ee) return;
            const se = j.currentTarget,
                G = Dr.get(se);
            G && (clearTimeout(G), Dr.delete(se));
        };
    return {
        ...X,
        ...we,
        ...W,
        href: z?.href,
        ref: r,
        onClick: fr([E, ke]),
        onBlur: fr([C, $]),
        onFocus: fr([M, ae]),
        onMouseEnter: fr([S, ae]),
        onMouseLeave: fr([P, $]),
        onTouchStart: fr([I, Ve]),
        disabled: !!b,
        target: y,
        ...(ue && { style: ue }),
        ...(ie && { className: ie }),
        ...(b && rv),
        ...(ge && sv),
        ...(Z && Ce && ov),
    };
}
var ii = {},
    nv = { className: 'active' },
    rv = { role: 'link', 'aria-disabled': !0 },
    sv = { 'data-status': 'active', 'aria-current': 'page' },
    ov = { 'data-transitioning': 'transitioning' },
    Dr = new WeakMap(),
    iv = { rootMargin: '100px' },
    fr = (e) => (t) => {
        for (const n of e)
            if (n) {
                if (t.defaultPrevented) return;
                n(t);
            }
    };
function av(e, t, n, r) {
    if (!r) return t ? { href: e, external: !0 } : { href: n.createHref(e) || '/', external: !1 };
}
function cv(e) {
    if (typeof e != 'string') return !1;
    const t = e.charCodeAt(0);
    return t === 47 ? e.charCodeAt(1) !== 47 : t === 46;
}
var No = v.forwardRef((e, t) => {
    const { _asChild: n, ...r } = e,
        { type: s, ...o } = tv(r, t),
        i = typeof r.children == 'function' ? r.children({ isActive: o['data-status'] === 'active' }) : r.children;
    if (!n) {
        const { disabled: a, ...d } = o;
        return v.createElement('a', d, i);
    }
    return v.createElement(n, o, i);
});
function lv(e) {
    return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function oC(e) {
    return new uv({ id: e });
}
var uv = class extends Zp {
        constructor({ id: e }) {
            (super({ id: e }),
                (this.useMatch = (t) =>
                    kn({ select: t?.select, from: this.id, structuralSharing: t?.structuralSharing })),
                (this.useRouteContext = (t) => ka({ ...t, from: this.id })),
                (this.useSearch = (t) =>
                    Ia({ select: t?.select, structuralSharing: t?.structuralSharing, from: this.id })),
                (this.useParams = (t) =>
                    Ta({ select: t?.select, structuralSharing: t?.structuralSharing, from: this.id })),
                (this.useLoaderDeps = (t) => Pa({ ...t, from: this.id, strict: !1 })),
                (this.useLoaderData = (t) => Ca({ ...t, from: this.id, strict: !1 })),
                (this.useNavigate = () => Fa({ from: Ye().routesById[this.id].fullPath })),
                (this.notFound = (t) => ha({ routeId: this.id, ...t })),
                (this.Link = K.forwardRef((t, n) => {
                    const r = Ye().routesById[this.id].fullPath;
                    return F.jsx(No, { ref: n, from: r, ...t });
                })));
        }
    },
    dv = class extends Au {
        constructor(t) {
            (super(t),
                (this.useMatch = (n) =>
                    kn({ select: n?.select, from: this.id, structuralSharing: n?.structuralSharing })),
                (this.useRouteContext = (n) => ka({ ...n, from: this.id })),
                (this.useSearch = (n) =>
                    Ia({ select: n?.select, structuralSharing: n?.structuralSharing, from: this.id })),
                (this.useParams = (n) =>
                    Ta({ select: n?.select, structuralSharing: n?.structuralSharing, from: this.id })),
                (this.useLoaderDeps = (n) => Pa({ ...n, from: this.id })),
                (this.useLoaderData = (n) => Ca({ ...n, from: this.id })),
                (this.useNavigate = () => Fa({ from: this.fullPath })),
                (this.Link = K.forwardRef((n, r) => F.jsx(No, { ref: r, from: this.fullPath, ...n }))));
        }
    };
function fv(e) {
    return new dv(e);
}
function hv() {
    return (e) => mv(e);
}
var pv = class extends em {
    constructor(e) {
        (super(e),
            (this.useMatch = (t) => kn({ select: t?.select, from: this.id, structuralSharing: t?.structuralSharing })),
            (this.useRouteContext = (t) => ka({ ...t, from: this.id })),
            (this.useSearch = (t) => Ia({ select: t?.select, structuralSharing: t?.structuralSharing, from: this.id })),
            (this.useParams = (t) => Ta({ select: t?.select, structuralSharing: t?.structuralSharing, from: this.id })),
            (this.useLoaderDeps = (t) => Pa({ ...t, from: this.id })),
            (this.useLoaderData = (t) => Ca({ ...t, from: this.id })),
            (this.useNavigate = () => Fa({ from: this.fullPath })),
            (this.Link = K.forwardRef((t, n) => F.jsx(No, { ref: n, from: this.fullPath, ...t }))));
    }
};
function mv(e) {
    return new pv(e);
}
function Ht(e) {
    return new gv(e, { silent: !0 }).createRoute;
}
var gv = class {
    constructor(e, t) {
        ((this.path = e),
            (this.createRoute = (n) => {
                const r = fv(n);
                return ((r.isRoot = !1), r);
            }),
            (this.silent = t?.silent));
    }
};
function Wt(e, t) {
    let n, r, s, o;
    const i = () => (
            n ||
                (n = e()
                    .then((d) => {
                        ((n = void 0), (r = d[t]));
                    })
                    .catch((d) => {
                        if (
                            ((s = d), Gh(s) && s instanceof Error && typeof window < 'u' && typeof sessionStorage < 'u')
                        ) {
                            const u = `tanstack_router_reload:${s.message}`;
                            sessionStorage.getItem(u) || (sessionStorage.setItem(u, '1'), (o = !0));
                        }
                    })),
            n
        ),
        a = function (u) {
            if (o) throw (window.location.reload(), new Promise(() => {}));
            if (s) throw s;
            if (!r)
                if (uo) uo(i());
                else throw i();
            return v.createElement(r, u);
        };
    return ((a.preload = i), a);
}
function yv(e) {
    const t = Ye(),
        n = `not-found-${je(t.stores.location, (r) => r.pathname)}-${je(t.stores.status, (r) => r)}`;
    return F.jsx(Ra, {
        getResetKey: () => n,
        onCatch: (r, s) => {
            if (et(r)) e.onCatch?.(r, s);
            else throw r;
        },
        errorComponent: ({ error: r }) => {
            if (et(r)) return e.fallback?.(r);
            throw r;
        },
        children: e.children,
    });
}
function bv() {
    return F.jsx('p', { children: 'Not Found' });
}
function pr(e) {
    return F.jsx(F.Fragment, { children: e.children });
}
function _d(e, t, n) {
    return t.options.notFoundComponent
        ? F.jsx(t.options.notFoundComponent, { ...n })
        : e.options.defaultNotFoundComponent
          ? F.jsx(e.options.defaultNotFoundComponent, { ...n })
          : F.jsx(bv, {});
}
function vv(e) {
    return null;
}
function wv() {
    return (vv(Ye()), null);
}
var Sv = (e, t) => e.routeId === t.routeId && e._displayPending === t._displayPending,
    xv = (e, t) => e[0] === t[0] && e[1] === t[1],
    Ld = v.memo(function ({ matchId: t }) {
        const n = Ye(),
            r = n.stores.matchStores.get(t);
        r || xt();
        const s = je(n.stores.loadedAt, (i) => i),
            o = je(r, (i) => i, Sv);
        return F.jsx(Rv, {
            router: n,
            matchId: t,
            resetKey: s,
            matchState: v.useMemo(() => {
                const i = o.routeId,
                    a = n.routesById[i].parentRoute?.id;
                return { routeId: i, ssr: o.ssr, _displayPending: o._displayPending, parentRouteId: a };
            }, [o._displayPending, o.routeId, o.ssr, n.routesById]),
        });
    });
function Rv({ router: e, matchId: t, resetKey: n, matchState: r }) {
    const s = e.routesById[r.routeId],
        o = s.options.pendingComponent ?? e.options.defaultPendingComponent,
        i = o ? F.jsx(o, {}) : null,
        a = s.options.errorComponent ?? e.options.defaultErrorComponent,
        d = s.options.onCatch ?? e.options.defaultOnCatch,
        u = s.isRoot
            ? (s.options.notFoundComponent ?? e.options.notFoundRoute?.options.component)
            : s.options.notFoundComponent,
        l = r.ssr === !1 || r.ssr === 'data-only',
        c =
            (!s.isRoot || s.options.wrapInSuspense || l) &&
            (s.options.wrapInSuspense ?? o ?? (s.options.errorComponent?.preload || l))
                ? v.Suspense
                : pr,
        f = a ? Ra : pr,
        p = u ? yv : pr;
    return F.jsxs(s.isRoot ? (s.options.shellComponent ?? pr) : pr, {
        children: [
            F.jsx(Vo.Provider, {
                value: t,
                children: F.jsx(c, {
                    fallback: i,
                    children: F.jsx(f, {
                        getResetKey: () => n,
                        errorComponent: a || Ea,
                        onCatch: (h, g) => {
                            if (et(h)) throw ((h.routeId ??= r.routeId), h);
                            d?.(h, g);
                        },
                        children: F.jsx(p, {
                            fallback: (h) => {
                                if (
                                    ((h.routeId ??= r.routeId),
                                    !u || (h.routeId && h.routeId !== r.routeId) || (!h.routeId && !s.isRoot))
                                )
                                    throw h;
                                return v.createElement(u, h);
                            },
                            children:
                                l || r._displayPending
                                    ? F.jsx(Wb, { fallback: i, children: F.jsx(rl, { matchId: t }) })
                                    : F.jsx(rl, { matchId: t }),
                        }),
                    }),
                }),
            }),
            r.parentRouteId === Gn
                ? F.jsxs(F.Fragment, {
                      children: [F.jsx(Ev, {}), e.options.scrollRestoration && mu ? F.jsx(wv, {}) : null],
                  })
                : null,
        ],
    });
}
function Ev() {
    const e = Ye(),
        t = v.useRef();
    return (
        Ur(() => {
            const n = e.stores.resolvedLocation.get(),
                r = t.current;
            (n && (!r || r.href !== n.href) && e.emit({ type: 'onRendered', ...yr(e.stores.location.get(), r ?? n) }),
                (t.current = n));
        }, [je(e.stores.resolvedLocation, (n) => n?.state.__TSR_key), e]),
        null
    );
}
var rl = v.memo(function ({ matchId: t }) {
        const n = Ye(),
            r = (l, c) => n.getMatch(l.id)?._nonReactive[c] ?? l._nonReactive[c],
            s = n.stores.matchStores.get(t);
        s || xt();
        const o = je(s, (l) => l),
            i = o.routeId,
            a = n.routesById[i],
            d = v.useMemo(() => {
                const l = (n.routesById[i].options.remountDeps ?? n.options.defaultRemountDeps)?.({
                    routeId: i,
                    loaderDeps: o.loaderDeps,
                    params: o._strictParams,
                    search: o._strictSearch,
                });
                return l ? JSON.stringify(l) : void 0;
            }, [i, o.loaderDeps, o._strictParams, o._strictSearch, n.options.defaultRemountDeps, n.routesById]),
            u = v.useMemo(() => {
                const l = a.options.component ?? n.options.defaultComponent;
                return l ? F.jsx(l, {}, d) : F.jsx(Dd, {});
            }, [d, a.options.component, n.options.defaultComponent]);
        if (o._displayPending) throw r(o, 'displayPendingPromise');
        if (o._forcePending) throw r(o, 'minPendingPromise');
        if (o.status === 'pending') {
            const l = a.options.pendingMinMs ?? n.options.defaultPendingMinMs;
            if (l) {
                const c = n.getMatch(o.id);
                if (c && !c._nonReactive.minPendingPromise) {
                    const f = er();
                    ((c._nonReactive.minPendingPromise = f),
                        setTimeout(() => {
                            (f.resolve(), (c._nonReactive.minPendingPromise = void 0));
                        }, l));
                }
            }
            throw r(o, 'loadPromise');
        }
        if (o.status === 'notFound') return (et(o.error) || xt(), _d(n, a, o.error));
        if (o.status === 'redirected') throw (ct(o.error) || xt(), r(o, 'loadPromise'));
        if (o.status === 'error') throw o.error;
        return u;
    }),
    Dd = v.memo(function () {
        const t = Ye(),
            n = v.useContext(Vo);
        let r,
            s = !1,
            o;
        {
            const u = n ? t.stores.matchStores.get(n) : void 0;
            (([r, s] = je(u, (l) => [l?.routeId, l?.globalNotFound ?? !1], xv)),
                (o = je(t.stores.matchesId, (l) => l[l.findIndex((c) => c === n) + 1])));
        }
        const i = r ? t.routesById[r] : void 0,
            a = t.options.defaultPendingComponent ? F.jsx(t.options.defaultPendingComponent, {}) : null;
        if (s) return (i || xt(), _d(t, i, void 0));
        if (!o) return null;
        const d = F.jsx(Ld, { matchId: o });
        return r === Gn ? F.jsx(v.Suspense, { fallback: a, children: d }) : d;
    });
function Mv() {
    const e = Ye(),
        t = v.useRef({ router: e, mounted: !1 }),
        [n, r] = v.useState(!1),
        s = je(e.stores.isLoading, (c) => c),
        o = je(e.stores.hasPending, (c) => c),
        i = si(s),
        a = s || n || o,
        d = si(a),
        u = s || o,
        l = si(u);
    return (
        (e.startTransition = (c) => {
            (r(!0),
                v.startTransition(() => {
                    (c(), r(!1));
                }));
        }),
        v.useEffect(() => {
            const c = e.history.subscribe(e.load),
                f = e.buildLocation({
                    to: e.latestLocation.pathname,
                    search: !0,
                    params: !0,
                    hash: !0,
                    state: !0,
                    _includeValidateSearch: !0,
                });
            return (
                tn(e.latestLocation.publicHref) !== tn(f.publicHref) && e.commitLocation({ ...f, replace: !0 }),
                () => {
                    c();
                }
            );
        }, [e, e.history]),
        Ur(() => {
            if ((typeof window < 'u' && e.ssr) || (t.current.router === e && t.current.mounted)) return;
            ((t.current = { router: e, mounted: !0 }),
                (async () => {
                    try {
                        await e.load();
                    } catch (f) {
                        console.error(f);
                    }
                })());
        }, [e]),
        Ur(() => {
            i && !s && e.emit({ type: 'onLoad', ...yr(e.stores.location.get(), e.stores.resolvedLocation.get()) });
        }, [i, e, s]),
        Ur(() => {
            l &&
                !u &&
                e.emit({ type: 'onBeforeRouteMount', ...yr(e.stores.location.get(), e.stores.resolvedLocation.get()) });
        }, [u, l, e]),
        Ur(() => {
            if (d && !a) {
                const c = yr(e.stores.location.get(), e.stores.resolvedLocation.get());
                (e.emit({ type: 'onResolved', ...c }),
                    Od(() => {
                        (e.stores.status.set('idle'), e.stores.resolvedLocation.set(e.stores.location.get()));
                    }));
            }
        }, [a, d, e]),
        null
    );
}
function Cv() {
    const e = Ye(),
        t = e.routesById[Gn].options.pendingComponent ?? e.options.defaultPendingComponent,
        n = t ? F.jsx(t, {}) : null,
        r = F.jsxs(typeof document < 'u' && e.ssr ? pr : v.Suspense, {
            fallback: n,
            children: [F.jsx(Mv, {}), F.jsx(Pv, {})],
        });
    return e.options.InnerWrap ? F.jsx(e.options.InnerWrap, { children: r }) : r;
}
function Pv() {
    const e = Ye(),
        t = je(e.stores.firstId, (s) => s),
        n = je(e.stores.loadedAt, (s) => s),
        r = t ? F.jsx(Ld, { matchId: t }) : null;
    return F.jsx(Vo.Provider, {
        value: t,
        children: e.options.disableGlobalCatchBoundary
            ? r
            : F.jsx(Ra, { getResetKey: () => n, errorComponent: Ea, onCatch: void 0, children: r }),
    });
}
var Tv = (e) => ({ createMutableStore: nl, createReadonlyStore: nl, batch: Od }),
    Iv = (e) => new Fv(e),
    Fv = class extends Bp {
        constructor(e) {
            super(e, Tv);
        }
    };
function kv({ router: e, children: t, ...n }) {
    yu(n) && e.update({ ...e.options, ...n, context: { ...e.options.context, ...n.context } });
    const r = F.jsx(Fd.Provider, { value: e, children: t });
    return e.options.Wrap ? F.jsx(e.options.Wrap, { children: r }) : r;
}
function Ov({ router: e, ...t }) {
    return F.jsx(kv, { router: e, ...t, children: F.jsx(Cv, {}) });
}
function sl(e, t) {
    if (t)
        for (const [n, r] of Object.entries(t))
            n !== 'suppressHydrationWarning' &&
                r !== void 0 &&
                r !== !1 &&
                e.setAttribute(n, typeof r == 'boolean' ? '' : String(r));
}
function Vd(e) {
    const { attrs: t, children: n, nonce: r, preventScriptHoist: s } = e;
    switch (e.tag) {
        case 'title':
            return F.jsx('title', { ...t, suppressHydrationWarning: !0, children: n });
        case 'meta':
            return F.jsx('meta', { ...t, suppressHydrationWarning: !0 });
        case 'link':
            return F.jsx('link', {
                ...t,
                precedence: t?.precedence ?? (t?.rel === 'stylesheet' ? 'default' : void 0),
                nonce: r,
                suppressHydrationWarning: !0,
            });
        case 'style':
            return (e.inlineCss, F.jsx('style', { ...t, dangerouslySetInnerHTML: { __html: n }, nonce: r }));
        case 'script':
            return F.jsx(Av, { attrs: t, preventScriptHoist: s, children: n });
        default:
            return null;
    }
}
function Av({ attrs: e, children: t, preventScriptHoist: n }) {
    Ye();
    const r = Ma(),
        s = typeof e?.type == 'string' && e.type !== '' && e.type !== 'text/javascript' && e.type !== 'module';
    if (
        (v.useEffect(() => {
            if (!s) {
                if (e?.src) {
                    const o = (() => {
                        try {
                            const a = document.baseURI || window.location.href;
                            return new URL(e.src, a).href;
                        } catch {
                            return e.src;
                        }
                    })();
                    for (const a of document.querySelectorAll('script[src]')) if (a.src === o) return;
                    const i = document.createElement('script');
                    return (sl(i, e), document.head.appendChild(i), () => i.remove());
                }
                if (typeof t == 'string') {
                    const o = typeof e?.type == 'string' ? e.type : 'text/javascript',
                        i = typeof e?.nonce == 'string' ? e.nonce : void 0;
                    for (const d of document.querySelectorAll('script:not([src])')) {
                        if (!(d instanceof HTMLScriptElement)) continue;
                        const u = d.getAttribute('type') ?? 'text/javascript',
                            l = d.getAttribute('nonce') ?? void 0;
                        if (d.textContent === t && u === o && l === i) return;
                    }
                    const a = document.createElement('script');
                    return ((a.textContent = t), sl(a, e), document.head.appendChild(a), () => a.remove());
                }
            }
        }, [e, t, s]),
        s && typeof t == 'string')
    )
        return F.jsx('script', { ...e, suppressHydrationWarning: !0, dangerouslySetInnerHTML: { __html: t } });
    if (!r) {
        if (e?.src) return F.jsx('script', { ...e, suppressHydrationWarning: !0 });
        if (typeof t == 'string')
            return F.jsx('script', { ...e, dangerouslySetInnerHTML: { __html: t }, suppressHydrationWarning: !0 });
    }
    return null;
}
var _v = (e) => {
    const t = Ye(),
        n = t.options.ssr?.nonce,
        r = je(t.stores.matches, (c) => c.map((f) => f.meta).filter((f) => f !== void 0), gt),
        s = v.useMemo(() => {
            const c = [],
                f = {};
            let p;
            for (let h = r.length - 1; h >= 0; h--) {
                const g = r[h];
                for (let m = g.length - 1; m >= 0; m--) {
                    const y = g[m];
                    if (y)
                        if (y.title) p || (p = { tag: 'title', children: y.title });
                        else if ('script:ld+json' in y)
                            try {
                                const b = JSON.stringify(y['script:ld+json']);
                                c.push({ tag: 'script', attrs: { type: 'application/ld+json' }, children: Zh(b) });
                            } catch {}
                        else {
                            const b = y.name ?? y.property;
                            if (b) {
                                if (f[b]) continue;
                                f[b] = !0;
                            }
                            c.push({ tag: 'meta', attrs: { ...y, nonce: n } });
                        }
                }
            }
            return (
                p && c.push(p),
                n && c.push({ tag: 'meta', attrs: { property: 'csp-nonce', content: n } }),
                c.reverse(),
                c
            );
        }, [r, n]),
        o = je(
            t.stores.matches,
            (c) =>
                c
                    .flatMap((f) => f.links ?? [])
                    .filter((f) => f !== void 0)
                    .map((f) => ({ tag: 'link', attrs: { ...f, nonce: n } })),
            gt
        ),
        i = je(
            t.stores.matches,
            (c) => {
                const f = t.ssr?.manifest,
                    p = [];
                return (
                    f &&
                        (c.forEach((h) => {
                            f.routes[h.routeId]?.css?.forEach((g) => {
                                const m = Jp(g);
                                p.push({
                                    tag: 'link',
                                    attrs: {
                                        rel: 'stylesheet',
                                        ...m,
                                        crossOrigin: Ou(e, 'stylesheet') ?? m.crossOrigin,
                                        suppressHydrationWarning: !0,
                                        nonce: n,
                                    },
                                });
                            });
                        }),
                        f.inlineStyle &&
                            p.push({
                                tag: 'style',
                                attrs: { ...f.inlineStyle.attrs, nonce: n },
                                children: f.inlineStyle.children,
                                inlineCss: !0,
                            })),
                    p
                );
            },
            gt
        ),
        a = je(
            t.stores.matches,
            (c) => {
                const f = [],
                    p = t.ssr?.manifest;
                return (
                    p &&
                        c.forEach((h) => {
                            p.routes[h.routeId]?.preloads?.forEach((g) => {
                                f.push({ tag: 'link', attrs: { ...Yp(p, g, e), nonce: n } });
                            });
                        }),
                    f
                );
            },
            gt
        ),
        d = je(
            t.stores.matches,
            (c) =>
                c
                    .flatMap((f) => f.styles ?? [])
                    .filter((f) => f !== void 0)
                    .map(({ children: f, ...p }) => ({ tag: 'style', attrs: { ...p, nonce: n }, children: f })),
            gt
        ),
        u = je(
            t.stores.matches,
            (c) =>
                c
                    .flatMap((f) => f.headScripts ?? [])
                    .filter((f) => f !== void 0)
                    .map(({ children: f, ...p }) => ({ tag: 'script', attrs: { ...p, nonce: n }, children: f })),
            gt
        ),
        l = [];
    return (xs(l, s), l.push(...a), xs(l, o), l.push(...i), xs(l, d), xs(l, u), l);
};
function Lv(e) {
    const t = _v(e.assetCrossOrigin),
        n = Ye().options.ssr?.nonce;
    return F.jsx(F.Fragment, {
        children: t.map((r) => v.createElement(Vd, { ...r, key: `tsr-meta-${JSON.stringify(r)}`, nonce: n })),
    });
}
var Dv = () => {
    const e = Ye(),
        t = e.options.ssr?.nonce,
        n = (o) => {
            const i = [],
                a = e.ssr?.manifest;
            if (!a) return [];
            for (const d of o) {
                const u = a.routes[d.routeId]?.scripts;
                if (u)
                    for (const l of u)
                        i.push({
                            tag: 'script',
                            attrs: { ...l.attrs, nonce: t },
                            children: l.children,
                            ...(typeof l.attrs?.src == 'string' ? { preventScriptHoist: !0 } : {}),
                        });
            }
            return i;
        },
        r = (o) =>
            o
                .map((i) => i.scripts)
                .flat(1)
                .filter(Boolean)
                .map(({ children: i, ...a }) => ({
                    tag: 'script',
                    attrs: { ...a, suppressHydrationWarning: !0, nonce: t },
                    children: i,
                })),
        s = je(e.stores.matches, n, gt);
    return Vv(e, je(e.stores.matches, r, gt), s);
};
function Vv(e, t, n) {
    const r = [...t, ...n];
    return F.jsx(F.Fragment, {
        children: r.map((s, o) => v.createElement(Vd, { ...s, key: `tsr-scripts-${s.tag}-${o}` })),
    });
}
class Nv extends Error {
    name = 'KyError';
    get isKyError() {
        return !0;
    }
}
class jv extends Nv {
    name = 'HTTPError';
    response;
    request;
    options;
    data;
    constructor(t, n, r) {
        const s = t.status || t.status === 0 ? t.status : '',
            o = t.statusText ?? '',
            i = `${s} ${o}`.trim(),
            a = i ? `status code ${i}` : 'an unknown error';
        (super(`Request failed with ${a}: ${n.method} ${n.url}`),
            (this.response = t),
            (this.request = n),
            (this.options = r));
    }
}
const Bv = (e, t) => e instanceof t || e?.name === t.name;
function $v(e) {
    return Bv(e, jv);
}
function zv(e) {
    if (typeof document > 'u') return;
    let t = document.head || document.getElementsByTagName('head')[0],
        n = document.createElement('style');
    ((n.type = 'text/css'),
        t.appendChild(n),
        n.styleSheet ? (n.styleSheet.cssText = e) : n.appendChild(document.createTextNode(e)));
}
const Uv = (e) => {
        switch (e) {
            case 'success':
                return Kv;
            case 'info':
                return qv;
            case 'warning':
                return Gv;
            case 'error':
                return Qv;
            default:
                return null;
        }
    },
    Hv = Array(12).fill(0),
    Wv = ({ visible: e, className: t }) =>
        K.createElement(
            'div',
            { className: ['sonner-loading-wrapper', t].filter(Boolean).join(' '), 'data-visible': e },
            K.createElement(
                'div',
                { className: 'sonner-spinner' },
                Hv.map((n, r) => K.createElement('div', { className: 'sonner-loading-bar', key: `spinner-bar-${r}` }))
            )
        ),
    Kv = K.createElement(
        'svg',
        { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20', fill: 'currentColor', height: '20', width: '20' },
        K.createElement('path', {
            fillRule: 'evenodd',
            d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z',
            clipRule: 'evenodd',
        })
    ),
    Gv = K.createElement(
        'svg',
        { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor', height: '20', width: '20' },
        K.createElement('path', {
            fillRule: 'evenodd',
            d: 'M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z',
            clipRule: 'evenodd',
        })
    ),
    qv = K.createElement(
        'svg',
        { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20', fill: 'currentColor', height: '20', width: '20' },
        K.createElement('path', {
            fillRule: 'evenodd',
            d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z',
            clipRule: 'evenodd',
        })
    ),
    Qv = K.createElement(
        'svg',
        { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20', fill: 'currentColor', height: '20', width: '20' },
        K.createElement('path', {
            fillRule: 'evenodd',
            d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z',
            clipRule: 'evenodd',
        })
    ),
    Yv = K.createElement(
        'svg',
        {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '12',
            height: '12',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '1.5',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
        },
        K.createElement('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
        K.createElement('line', { x1: '6', y1: '6', x2: '18', y2: '18' })
    ),
    Xv = () => {
        const [e, t] = K.useState(document.hidden);
        return (
            K.useEffect(() => {
                const n = () => {
                    t(document.hidden);
                };
                return (
                    document.addEventListener('visibilitychange', n),
                    () => window.removeEventListener('visibilitychange', n)
                );
            }, []),
            e
        );
    };
let Ui = 1;
class Jv {
    constructor() {
        ((this.subscribe = (t) => (
            this.subscribers.push(t),
            () => {
                const n = this.subscribers.indexOf(t);
                this.subscribers.splice(n, 1);
            }
        )),
            (this.publish = (t) => {
                this.subscribers.forEach((n) => n(t));
            }),
            (this.addToast = (t) => {
                (this.publish(t), (this.toasts = [...this.toasts, t]));
            }),
            (this.create = (t) => {
                var n;
                const { message: r, ...s } = t,
                    o = typeof t?.id == 'number' || ((n = t.id) == null ? void 0 : n.length) > 0 ? t.id : Ui++,
                    i = this.toasts.find((d) => d.id === o),
                    a = t.dismissible === void 0 ? !0 : t.dismissible;
                return (
                    this.dismissedToasts.has(o) && this.dismissedToasts.delete(o),
                    i
                        ? (this.toasts = this.toasts.map((d) =>
                              d.id === o
                                  ? (this.publish({ ...d, ...t, id: o, title: r }),
                                    { ...d, ...t, id: o, dismissible: a, title: r })
                                  : d
                          ))
                        : this.addToast({ title: r, ...s, dismissible: a, id: o }),
                    o
                );
            }),
            (this.dismiss = (t) => (
                t
                    ? (this.dismissedToasts.add(t),
                      requestAnimationFrame(() => this.subscribers.forEach((n) => n({ id: t, dismiss: !0 }))))
                    : this.toasts.forEach((n) => {
                          this.subscribers.forEach((r) => r({ id: n.id, dismiss: !0 }));
                      }),
                t
            )),
            (this.message = (t, n) => this.create({ ...n, message: t })),
            (this.error = (t, n) => this.create({ ...n, message: t, type: 'error' })),
            (this.success = (t, n) => this.create({ ...n, type: 'success', message: t })),
            (this.info = (t, n) => this.create({ ...n, type: 'info', message: t })),
            (this.warning = (t, n) => this.create({ ...n, type: 'warning', message: t })),
            (this.loading = (t, n) => this.create({ ...n, type: 'loading', message: t })),
            (this.promise = (t, n) => {
                if (!n) return;
                let r;
                n.loading !== void 0 &&
                    (r = this.create({
                        ...n,
                        promise: t,
                        type: 'loading',
                        message: n.loading,
                        description: typeof n.description != 'function' ? n.description : void 0,
                    }));
                const s = Promise.resolve(t instanceof Function ? t() : t);
                let o = r !== void 0,
                    i;
                const a = s
                        .then(async (u) => {
                            if (((i = ['resolve', u]), K.isValidElement(u)))
                                ((o = !1), this.create({ id: r, type: 'default', message: u }));
                            else if (e0(u) && !u.ok) {
                                o = !1;
                                const c =
                                        typeof n.error == 'function'
                                            ? await n.error(`HTTP error! status: ${u.status}`)
                                            : n.error,
                                    f =
                                        typeof n.description == 'function'
                                            ? await n.description(`HTTP error! status: ${u.status}`)
                                            : n.description,
                                    h = typeof c == 'object' && !K.isValidElement(c) ? c : { message: c };
                                this.create({ id: r, type: 'error', description: f, ...h });
                            } else if (u instanceof Error) {
                                o = !1;
                                const c = typeof n.error == 'function' ? await n.error(u) : n.error,
                                    f = typeof n.description == 'function' ? await n.description(u) : n.description,
                                    h = typeof c == 'object' && !K.isValidElement(c) ? c : { message: c };
                                this.create({ id: r, type: 'error', description: f, ...h });
                            } else if (n.success !== void 0) {
                                o = !1;
                                const c = typeof n.success == 'function' ? await n.success(u) : n.success,
                                    f = typeof n.description == 'function' ? await n.description(u) : n.description,
                                    h = typeof c == 'object' && !K.isValidElement(c) ? c : { message: c };
                                this.create({ id: r, type: 'success', description: f, ...h });
                            }
                        })
                        .catch(async (u) => {
                            if (((i = ['reject', u]), n.error !== void 0)) {
                                o = !1;
                                const l = typeof n.error == 'function' ? await n.error(u) : n.error,
                                    c = typeof n.description == 'function' ? await n.description(u) : n.description,
                                    p = typeof l == 'object' && !K.isValidElement(l) ? l : { message: l };
                                this.create({ id: r, type: 'error', description: c, ...p });
                            }
                        })
                        .finally(() => {
                            (o && (this.dismiss(r), (r = void 0)), n.finally == null || n.finally.call(n));
                        }),
                    d = () => new Promise((u, l) => a.then(() => (i[0] === 'reject' ? l(i[1]) : u(i[1]))).catch(l));
                return typeof r != 'string' && typeof r != 'number' ? { unwrap: d } : Object.assign(r, { unwrap: d });
            }),
            (this.custom = (t, n) => {
                const r = n?.id || Ui++;
                return (this.create({ jsx: t(r), id: r, ...n }), r);
            }),
            (this.getActiveToasts = () => this.toasts.filter((t) => !this.dismissedToasts.has(t.id))),
            (this.subscribers = []),
            (this.toasts = []),
            (this.dismissedToasts = new Set()));
    }
}
const vt = new Jv(),
    Zv = (e, t) => {
        const n = t?.id || Ui++;
        return (vt.addToast({ title: e, ...t, id: n }), n);
    },
    e0 = (e) =>
        e &&
        typeof e == 'object' &&
        'ok' in e &&
        typeof e.ok == 'boolean' &&
        'status' in e &&
        typeof e.status == 'number',
    t0 = Zv,
    n0 = () => vt.toasts,
    r0 = () => vt.getActiveToasts(),
    ol = Object.assign(
        t0,
        {
            success: vt.success,
            info: vt.info,
            warning: vt.warning,
            error: vt.error,
            custom: vt.custom,
            message: vt.message,
            promise: vt.promise,
            dismiss: vt.dismiss,
            loading: vt.loading,
        },
        { getHistory: n0, getToasts: r0 }
    );
zv(
    "[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}"
);
function Cs(e) {
    return e.label !== void 0;
}
const s0 = 3,
    o0 = '24px',
    i0 = '16px',
    il = 4e3,
    a0 = 356,
    c0 = 14,
    l0 = 45,
    u0 = 200;
function _t(...e) {
    return e.filter(Boolean).join(' ');
}
function d0(e) {
    const [t, n] = e.split('-'),
        r = [];
    return (t && r.push(t), n && r.push(n), r);
}
const f0 = (e) => {
    var t, n, r, s, o, i, a, d, u;
    const {
            invert: l,
            toast: c,
            unstyled: f,
            interacting: p,
            setHeights: h,
            visibleToasts: g,
            heights: m,
            index: y,
            toasts: b,
            expanded: R,
            removeToast: w,
            defaultRichColors: E,
            closeButton: C,
            style: M,
            cancelButtonStyle: S,
            actionButtonStyle: P,
            className: I = '',
            descriptionClassName: V = '',
            duration: A,
            position: O,
            gap: L,
            expandByDefault: k,
            classNames: _,
            icons: B,
            closeButtonAriaLabel: N = 'Close toast',
        } = e,
        [U, D] = K.useState(null),
        [X, Z] = K.useState(null),
        [Y, Q] = K.useState(!1),
        [H, q] = K.useState(!1),
        [pe, z] = K.useState(!1),
        [J, ge] = K.useState(!1),
        [we, W] = K.useState(!1),
        [ie, ue] = K.useState(0),
        [Ce, Ee] = K.useState(0),
        re = K.useRef(c.duration || A || il),
        ce = K.useRef(null),
        ee = K.useRef(null),
        ye = y === 0,
        ke = y + 1 <= g,
        ae = c.type,
        Ve = c.dismissible !== !1,
        $ = c.className || '',
        j = c.descriptionClassName || '',
        se = K.useMemo(() => m.findIndex((le) => le.toastId === c.id) || 0, [m, c.id]),
        G = K.useMemo(() => {
            var le;
            return (le = c.closeButton) != null ? le : C;
        }, [c.closeButton, C]),
        he = K.useMemo(() => c.duration || A || il, [c.duration, A]),
        ut = K.useRef(0),
        Ue = K.useRef(0),
        He = K.useRef(0),
        nt = K.useRef(null),
        [It, cr] = O.split('-'),
        _n = K.useMemo(() => m.reduce((le, Oe, Ne) => (Ne >= se ? le : le + Oe.height), 0), [m, se]),
        Ln = Xv(),
        lr = c.invert || l,
        hn = ae === 'loading';
    ((Ue.current = K.useMemo(() => se * L + _n, [se, _n])),
        K.useEffect(() => {
            re.current = he;
        }, [he]),
        K.useEffect(() => {
            Q(!0);
        }, []),
        K.useEffect(() => {
            const le = ee.current;
            if (le) {
                const Oe = le.getBoundingClientRect().height;
                return (
                    Ee(Oe),
                    h((Ne) => [{ toastId: c.id, height: Oe, position: c.position }, ...Ne]),
                    () => h((Ne) => Ne.filter((Je) => Je.toastId !== c.id))
                );
            }
        }, [h, c.id]),
        K.useLayoutEffect(() => {
            if (!Y) return;
            const le = ee.current,
                Oe = le.style.height;
            le.style.height = 'auto';
            const Ne = le.getBoundingClientRect().height;
            ((le.style.height = Oe),
                Ee(Ne),
                h((Je) =>
                    Je.find(($e) => $e.toastId === c.id)
                        ? Je.map(($e) => ($e.toastId === c.id ? { ...$e, height: Ne } : $e))
                        : [{ toastId: c.id, height: Ne, position: c.position }, ...Je]
                ));
        }, [Y, c.title, c.description, h, c.id, c.jsx, c.action, c.cancel]));
    const Se = K.useCallback(() => {
        (q(!0),
            ue(Ue.current),
            h((le) => le.filter((Oe) => Oe.toastId !== c.id)),
            setTimeout(() => {
                w(c);
            }, u0));
    }, [c, w, h, Ue]);
    (K.useEffect(() => {
        if ((c.promise && ae === 'loading') || c.duration === 1 / 0 || c.type === 'loading') return;
        let le;
        return (
            R || p || Ln
                ? (() => {
                      if (He.current < ut.current) {
                          const Je = new Date().getTime() - ut.current;
                          re.current = re.current - Je;
                      }
                      He.current = new Date().getTime();
                  })()
                : re.current !== 1 / 0 &&
                  ((ut.current = new Date().getTime()),
                  (le = setTimeout(() => {
                      (c.onAutoClose == null || c.onAutoClose.call(c, c), Se());
                  }, re.current))),
            () => clearTimeout(le)
        );
    }, [R, p, c, ae, Ln, Se]),
        K.useEffect(() => {
            c.delete && (Se(), c.onDismiss == null || c.onDismiss.call(c, c));
        }, [Se, c.delete]));
    function rt() {
        var le;
        if (B?.loading) {
            var Oe;
            return K.createElement(
                'div',
                {
                    className: _t(
                        _?.loader,
                        c == null || (Oe = c.classNames) == null ? void 0 : Oe.loader,
                        'sonner-loader'
                    ),
                    'data-visible': ae === 'loading',
                },
                B.loading
            );
        }
        return K.createElement(Wv, {
            className: _t(_?.loader, c == null || (le = c.classNames) == null ? void 0 : le.loader),
            visible: ae === 'loading',
        });
    }
    const Ft = c.icon || B?.[ae] || Uv(ae);
    var dt, kt;
    return K.createElement(
        'li',
        {
            tabIndex: 0,
            ref: ee,
            className: _t(
                I,
                $,
                _?.toast,
                c == null || (t = c.classNames) == null ? void 0 : t.toast,
                _?.default,
                _?.[ae],
                c == null || (n = c.classNames) == null ? void 0 : n[ae]
            ),
            'data-sonner-toast': '',
            'data-rich-colors': (dt = c.richColors) != null ? dt : E,
            'data-styled': !(c.jsx || c.unstyled || f),
            'data-mounted': Y,
            'data-promise': !!c.promise,
            'data-swiped': we,
            'data-removed': H,
            'data-visible': ke,
            'data-y-position': It,
            'data-x-position': cr,
            'data-index': y,
            'data-front': ye,
            'data-swiping': pe,
            'data-dismissible': Ve,
            'data-type': ae,
            'data-invert': lr,
            'data-swipe-out': J,
            'data-swipe-direction': X,
            'data-expanded': !!(R || (k && Y)),
            'data-testid': c.testId,
            style: {
                '--index': y,
                '--toasts-before': y,
                '--z-index': b.length - y,
                '--offset': `${H ? ie : Ue.current}px`,
                '--initial-height': k ? 'auto' : `${Ce}px`,
                ...M,
                ...c.style,
            },
            onDragEnd: () => {
                (z(!1), D(null), (nt.current = null));
            },
            onPointerDown: (le) => {
                le.button !== 2 &&
                    (hn ||
                        !Ve ||
                        ((ce.current = new Date()),
                        ue(Ue.current),
                        le.target.setPointerCapture(le.pointerId),
                        le.target.tagName !== 'BUTTON' && (z(!0), (nt.current = { x: le.clientX, y: le.clientY }))));
            },
            onPointerUp: () => {
                var le, Oe, Ne;
                if (J || !Ve) return;
                nt.current = null;
                const Je = Number(
                        ((le = ee.current) == null
                            ? void 0
                            : le.style.getPropertyValue('--swipe-amount-x').replace('px', '')) || 0
                    ),
                    pn = Number(
                        ((Oe = ee.current) == null
                            ? void 0
                            : Oe.style.getPropertyValue('--swipe-amount-y').replace('px', '')) || 0
                    ),
                    $e = new Date().getTime() - ((Ne = ce.current) == null ? void 0 : Ne.getTime()),
                    it = U === 'x' ? Je : pn,
                    ur = Math.abs(it) / $e;
                if (Math.abs(it) >= l0 || ur > 0.11) {
                    (ue(Ue.current),
                        c.onDismiss == null || c.onDismiss.call(c, c),
                        Z(U === 'x' ? (Je > 0 ? 'right' : 'left') : pn > 0 ? 'down' : 'up'),
                        Se(),
                        ge(!0));
                    return;
                } else {
                    var ft, bt;
                    ((ft = ee.current) == null || ft.style.setProperty('--swipe-amount-x', '0px'),
                        (bt = ee.current) == null || bt.style.setProperty('--swipe-amount-y', '0px'));
                }
                (W(!1), z(!1), D(null));
            },
            onPointerMove: (le) => {
                var Oe, Ne, Je;
                if (!nt.current || !Ve || ((Oe = window.getSelection()) == null ? void 0 : Oe.toString().length) > 0)
                    return;
                const $e = le.clientY - nt.current.y,
                    it = le.clientX - nt.current.x;
                var ur;
                const ft = (ur = e.swipeDirections) != null ? ur : d0(O);
                !U && (Math.abs(it) > 1 || Math.abs($e) > 1) && D(Math.abs(it) > Math.abs($e) ? 'x' : 'y');
                let bt = { x: 0, y: 0 };
                const bs = (Yt) => 1 / (1.5 + Math.abs(Yt) / 20);
                if (U === 'y') {
                    if (ft.includes('top') || ft.includes('bottom'))
                        if ((ft.includes('top') && $e < 0) || (ft.includes('bottom') && $e > 0)) bt.y = $e;
                        else {
                            const Yt = $e * bs($e);
                            bt.y = Math.abs(Yt) < Math.abs($e) ? Yt : $e;
                        }
                } else if (U === 'x' && (ft.includes('left') || ft.includes('right')))
                    if ((ft.includes('left') && it < 0) || (ft.includes('right') && it > 0)) bt.x = it;
                    else {
                        const Yt = it * bs(it);
                        bt.x = Math.abs(Yt) < Math.abs(it) ? Yt : it;
                    }
                ((Math.abs(bt.x) > 0 || Math.abs(bt.y) > 0) && W(!0),
                    (Ne = ee.current) == null || Ne.style.setProperty('--swipe-amount-x', `${bt.x}px`),
                    (Je = ee.current) == null || Je.style.setProperty('--swipe-amount-y', `${bt.y}px`));
            },
        },
        G && !c.jsx && ae !== 'loading'
            ? K.createElement(
                  'button',
                  {
                      'aria-label': N,
                      'data-disabled': hn,
                      'data-close-button': !0,
                      onClick:
                          hn || !Ve
                              ? () => {}
                              : () => {
                                    (Se(), c.onDismiss == null || c.onDismiss.call(c, c));
                                },
                      className: _t(_?.closeButton, c == null || (r = c.classNames) == null ? void 0 : r.closeButton),
                  },
                  (kt = B?.close) != null ? kt : Yv
              )
            : null,
        (ae || c.icon || c.promise) && c.icon !== null && (B?.[ae] !== null || c.icon)
            ? K.createElement(
                  'div',
                  {
                      'data-icon': '',
                      className: _t(_?.icon, c == null || (s = c.classNames) == null ? void 0 : s.icon),
                  },
                  c.promise || (c.type === 'loading' && !c.icon) ? c.icon || rt() : null,
                  c.type !== 'loading' ? Ft : null
              )
            : null,
        K.createElement(
            'div',
            {
                'data-content': '',
                className: _t(_?.content, c == null || (o = c.classNames) == null ? void 0 : o.content),
            },
            K.createElement(
                'div',
                {
                    'data-title': '',
                    className: _t(_?.title, c == null || (i = c.classNames) == null ? void 0 : i.title),
                },
                c.jsx ? c.jsx : typeof c.title == 'function' ? c.title() : c.title
            ),
            c.description
                ? K.createElement(
                      'div',
                      {
                          'data-description': '',
                          className: _t(
                              V,
                              j,
                              _?.description,
                              c == null || (a = c.classNames) == null ? void 0 : a.description
                          ),
                      },
                      typeof c.description == 'function' ? c.description() : c.description
                  )
                : null
        ),
        K.isValidElement(c.cancel)
            ? c.cancel
            : c.cancel && Cs(c.cancel)
              ? K.createElement(
                    'button',
                    {
                        'data-button': !0,
                        'data-cancel': !0,
                        style: c.cancelButtonStyle || S,
                        onClick: (le) => {
                            Cs(c.cancel) &&
                                Ve &&
                                (c.cancel.onClick == null || c.cancel.onClick.call(c.cancel, le), Se());
                        },
                        className: _t(
                            _?.cancelButton,
                            c == null || (d = c.classNames) == null ? void 0 : d.cancelButton
                        ),
                    },
                    c.cancel.label
                )
              : null,
        K.isValidElement(c.action)
            ? c.action
            : c.action && Cs(c.action)
              ? K.createElement(
                    'button',
                    {
                        'data-button': !0,
                        'data-action': !0,
                        style: c.actionButtonStyle || P,
                        onClick: (le) => {
                            Cs(c.action) &&
                                (c.action.onClick == null || c.action.onClick.call(c.action, le),
                                !le.defaultPrevented && Se());
                        },
                        className: _t(
                            _?.actionButton,
                            c == null || (u = c.classNames) == null ? void 0 : u.actionButton
                        ),
                    },
                    c.action.label
                )
              : null
    );
};
function al() {
    if (typeof window > 'u' || typeof document > 'u') return 'ltr';
    const e = document.documentElement.getAttribute('dir');
    return e === 'auto' || !e ? window.getComputedStyle(document.documentElement).direction : e;
}
function h0(e, t) {
    const n = {};
    return (
        [e, t].forEach((r, s) => {
            const o = s === 1,
                i = o ? '--mobile-offset' : '--offset',
                a = o ? i0 : o0;
            function d(u) {
                ['top', 'right', 'bottom', 'left'].forEach((l) => {
                    n[`${i}-${l}`] = typeof u == 'number' ? `${u}px` : u;
                });
            }
            typeof r == 'number' || typeof r == 'string'
                ? d(r)
                : typeof r == 'object'
                  ? ['top', 'right', 'bottom', 'left'].forEach((u) => {
                        r[u] === void 0
                            ? (n[`${i}-${u}`] = a)
                            : (n[`${i}-${u}`] = typeof r[u] == 'number' ? `${r[u]}px` : r[u]);
                    })
                  : d(a);
        }),
        n
    );
}
const p0 = K.forwardRef(function (t, n) {
        const {
                id: r,
                invert: s,
                position: o = 'bottom-right',
                hotkey: i = ['altKey', 'KeyT'],
                expand: a,
                closeButton: d,
                className: u,
                offset: l,
                mobileOffset: c,
                theme: f = 'light',
                richColors: p,
                duration: h,
                style: g,
                visibleToasts: m = s0,
                toastOptions: y,
                dir: b = al(),
                gap: R = c0,
                icons: w,
                containerAriaLabel: E = 'Notifications',
            } = t,
            [C, M] = K.useState([]),
            S = K.useMemo(() => (r ? C.filter((Y) => Y.toasterId === r) : C.filter((Y) => !Y.toasterId)), [C, r]),
            P = K.useMemo(
                () => Array.from(new Set([o].concat(S.filter((Y) => Y.position).map((Y) => Y.position)))),
                [S, o]
            ),
            [I, V] = K.useState([]),
            [A, O] = K.useState(!1),
            [L, k] = K.useState(!1),
            [_, B] = K.useState(
                f !== 'system'
                    ? f
                    : typeof window < 'u' &&
                        window.matchMedia &&
                        window.matchMedia('(prefers-color-scheme: dark)').matches
                      ? 'dark'
                      : 'light'
            ),
            N = K.useRef(null),
            U = i.join('+').replace(/Key/g, '').replace(/Digit/g, ''),
            D = K.useRef(null),
            X = K.useRef(!1),
            Z = K.useCallback((Y) => {
                M((Q) => {
                    var H;
                    return (
                        ((H = Q.find((q) => q.id === Y.id)) != null && H.delete) || vt.dismiss(Y.id),
                        Q.filter(({ id: q }) => q !== Y.id)
                    );
                });
            }, []);
        return (
            K.useEffect(
                () =>
                    vt.subscribe((Y) => {
                        if (Y.dismiss) {
                            requestAnimationFrame(() => {
                                M((Q) => Q.map((H) => (H.id === Y.id ? { ...H, delete: !0 } : H)));
                            });
                            return;
                        }
                        setTimeout(() => {
                            Nh.flushSync(() => {
                                M((Q) => {
                                    const H = Q.findIndex((q) => q.id === Y.id);
                                    return H !== -1
                                        ? [...Q.slice(0, H), { ...Q[H], ...Y }, ...Q.slice(H + 1)]
                                        : [Y, ...Q];
                                });
                            });
                        });
                    }),
                [C]
            ),
            K.useEffect(() => {
                if (f !== 'system') {
                    B(f);
                    return;
                }
                if (
                    (f === 'system' &&
                        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
                            ? B('dark')
                            : B('light')),
                    typeof window > 'u')
                )
                    return;
                const Y = window.matchMedia('(prefers-color-scheme: dark)');
                try {
                    Y.addEventListener('change', ({ matches: Q }) => {
                        B(Q ? 'dark' : 'light');
                    });
                } catch {
                    Y.addListener(({ matches: H }) => {
                        try {
                            B(H ? 'dark' : 'light');
                        } catch (q) {
                            console.error(q);
                        }
                    });
                }
            }, [f]),
            K.useEffect(() => {
                C.length <= 1 && O(!1);
            }, [C]),
            K.useEffect(() => {
                const Y = (Q) => {
                    var H;
                    if (i.every((z) => Q[z] || Q.code === z)) {
                        var pe;
                        (O(!0), (pe = N.current) == null || pe.focus());
                    }
                    Q.code === 'Escape' &&
                        (document.activeElement === N.current ||
                            ((H = N.current) != null && H.contains(document.activeElement))) &&
                        O(!1);
                };
                return (document.addEventListener('keydown', Y), () => document.removeEventListener('keydown', Y));
            }, [i]),
            K.useEffect(() => {
                if (N.current)
                    return () => {
                        D.current && (D.current.focus({ preventScroll: !0 }), (D.current = null), (X.current = !1));
                    };
            }, [N.current]),
            K.createElement(
                'section',
                {
                    ref: n,
                    'aria-label': `${E} ${U}`,
                    tabIndex: -1,
                    'aria-live': 'polite',
                    'aria-relevant': 'additions text',
                    'aria-atomic': 'false',
                    suppressHydrationWarning: !0,
                },
                P.map((Y, Q) => {
                    var H;
                    const [q, pe] = Y.split('-');
                    return S.length
                        ? K.createElement(
                              'ol',
                              {
                                  key: Y,
                                  dir: b === 'auto' ? al() : b,
                                  tabIndex: -1,
                                  ref: N,
                                  className: u,
                                  'data-sonner-toaster': !0,
                                  'data-sonner-theme': _,
                                  'data-y-position': q,
                                  'data-x-position': pe,
                                  style: {
                                      '--front-toast-height': `${((H = I[0]) == null ? void 0 : H.height) || 0}px`,
                                      '--width': `${a0}px`,
                                      '--gap': `${R}px`,
                                      ...g,
                                      ...h0(l, c),
                                  },
                                  onBlur: (z) => {
                                      X.current &&
                                          !z.currentTarget.contains(z.relatedTarget) &&
                                          ((X.current = !1),
                                          D.current && (D.current.focus({ preventScroll: !0 }), (D.current = null)));
                                  },
                                  onFocus: (z) => {
                                      (z.target instanceof HTMLElement && z.target.dataset.dismissible === 'false') ||
                                          X.current ||
                                          ((X.current = !0), (D.current = z.relatedTarget));
                                  },
                                  onMouseEnter: () => O(!0),
                                  onMouseMove: () => O(!0),
                                  onMouseLeave: () => {
                                      L || O(!1);
                                  },
                                  onDragEnd: () => O(!1),
                                  onPointerDown: (z) => {
                                      (z.target instanceof HTMLElement && z.target.dataset.dismissible === 'false') ||
                                          k(!0);
                                  },
                                  onPointerUp: () => k(!1),
                              },
                              S.filter((z) => (!z.position && Q === 0) || z.position === Y).map((z, J) => {
                                  var ge, we;
                                  return K.createElement(f0, {
                                      key: z.id,
                                      icons: w,
                                      index: J,
                                      toast: z,
                                      defaultRichColors: p,
                                      duration: (ge = y?.duration) != null ? ge : h,
                                      className: y?.className,
                                      descriptionClassName: y?.descriptionClassName,
                                      invert: s,
                                      visibleToasts: m,
                                      closeButton: (we = y?.closeButton) != null ? we : d,
                                      interacting: L,
                                      position: Y,
                                      style: y?.style,
                                      unstyled: y?.unstyled,
                                      classNames: y?.classNames,
                                      cancelButtonStyle: y?.cancelButtonStyle,
                                      actionButtonStyle: y?.actionButtonStyle,
                                      closeButtonAriaLabel: y?.closeButtonAriaLabel,
                                      removeToast: Z,
                                      toasts: S.filter((W) => W.position == z.position),
                                      heights: I.filter((W) => W.position == z.position),
                                      setHeights: V,
                                      expandByDefault: a,
                                      gap: R,
                                      expanded: A,
                                      swipeDirections: t.swipeDirections,
                                  });
                              })
                          )
                        : null;
                })
            )
        );
    }),
    m0 = '<appName>_ADMIN_Theme',
    Nd = 'Uh-oh, something went wrong.',
    g0 = '/dashboard',
    aC = ['head', 'team_lead', 'buyer', 'designer', 'bdm'],
    cC = ['active', 'invited', 'disabled'],
    Ke = { head: 'head', teamLead: 'team_lead', buyer: 'buyer', designer: 'designer', bdm: 'bdm' },
    jd = new Cb({
        defaultOptions: {
            queries: { retry: !1, refetchOnWindowFocus: !1, throwOnError: !0 },
            mutations: { retry: !1 },
        },
        queryCache: new Md({
            onError(e, t) {
                const n = t.state.data !== void 0;
                if (n && $v(e) && e.data !== void 0) {
                    const r = typeof e.data == 'string' ? e.data : e.data.message;
                    ol.error(r || e.message);
                } else n && e instanceof Error && ol.error(e?.message || Nd);
            },
        }),
    }),
    Bd = () => null;
function vn(e) {
    const t = v.useRef(e);
    return (
        (t.current = e),
        v.useMemo(
            () =>
                Object.freeze({
                    get current() {
                        return t.current;
                    },
                }),
            []
        )
    );
}
function y0(e) {
    const t = vn(e);
    v.useEffect(
        () => () => {
            t.current();
        },
        []
    );
}
function b0(e, t, n, r = 0) {
    const s = v.useRef(void 0),
        o = v.useRef(void 0),
        i = v.useRef(e),
        a = v.useRef(void 0),
        d = () => {
            (s.current && (clearTimeout(s.current), (s.current = void 0)),
                o.current && (clearTimeout(o.current), (o.current = void 0)));
        };
    return (
        y0(d),
        v.useEffect(() => {
            i.current = e;
        }, t),
        v.useMemo(() => {
            const u = () => {
                    if ((d(), !a.current)) return;
                    const c = a.current;
                    ((a.current = void 0), i.current.apply(c.this, c.args));
                },
                l = function (...c) {
                    (s.current && clearTimeout(s.current),
                        (a.current = { args: c, this: this }),
                        (s.current = setTimeout(u, n)),
                        r > 0 && !o.current && (o.current = setTimeout(u, r)));
                };
            return (
                Object.defineProperties(l, {
                    length: { value: e.length },
                    name: { value: `${e.name || 'anonymous'}__debounced__${n}` },
                }),
                l
            );
        }, [n, r, ...t])
    );
}
const Ks = () => {},
    Mn = typeof globalThis < 'u' && typeof navigator < 'u' && typeof document < 'u';
function $d(e, ...t) {
    e?.addEventListener?.(...t);
}
function zd(e, ...t) {
    e?.removeEventListener?.(...t);
}
const v0 = (e, t) => Object.hasOwn(e, t);
function Ud() {
    const e = v.useRef(!0);
    return (
        v.useEffect(() => {
            e.current = !1;
        }, []),
        e.current
    );
}
function w0(e = !1) {
    const t = v.useRef(e),
        n = v.useCallback(() => t.current, []);
    return (
        v.useEffect(
            () => (
                (t.current = !0),
                () => {
                    t.current = !1;
                }
            ),
            []
        ),
        n
    );
}
const S0 = Mn ? v.useLayoutEffect : v.useEffect;
function x0(e, t) {
    const n = Ud();
    v.useEffect(n ? Ks : e, t);
}
function R0(e) {
    return (typeof e == 'function' && (e = e()), e);
}
function E0(e, t) {
    return typeof e == 'function' ? e(t) : e;
}
function Hd(...e) {
    return e.length === 1 ? R0(e[0]) : E0(e[0], e[1]);
}
function lC(e, t, n = 0) {
    const [r, s] = v.useState(e);
    return [r, b0(s, [], t, n)];
}
function uC(e = !1, t = !0) {
    const [n, r] = v.useState(e),
        s = vn(t);
    return [
        n,
        v.useCallback((o) => {
            r((i) =>
                o === void 0 ||
                (s.current &&
                    typeof o == 'object' &&
                    (o.constructor.name === 'SyntheticBaseEvent' || typeof o._reactName == 'string'))
                    ? !i
                    : !!Hd(o, i)
            );
        }, []),
    ];
}
const Qn = new Map(),
    Gs = (e, t, n, r) => {
        const s = Qn.get(e)?.get(t);
        if (!(s === void 0 || s.size === 0)) for (const o of s) o !== r && o(n);
    },
    Wd = (e) => {
        e.storageArea && e.key && e.newValue && Gs(e.storageArea, e.key, e.newValue);
    },
    M0 = (e, t, n) => {
        Mn && Qn.size === 0 && $d(globalThis, 'storage', Wd, { passive: !0 });
        let r = Qn.get(e);
        r || ((r = new Map()), Qn.set(e, r));
        let s = r.get(t);
        (s || ((s = new Set()), r.set(t, s)), s.add(n));
    },
    C0 = (e, t, n) => {
        const r = Qn.get(e);
        if (!r) return;
        const s = r.get(t);
        s &&
            (s.delete(n),
            s.size === 0 && r.delete(t),
            r.size === 0 && Qn.delete(e),
            Mn && Qn.size === 0 && zd(globalThis, 'storage', Wd));
    },
    P0 = { defaultValue: null, initializeWithValue: !0 };
function T0(e, t, n) {
    const r = vn({ ...P0, ...n }),
        s = (h, g) => (r.current.parse ?? F0)(h, g),
        o = (h) => (r.current.stringify ?? I0)(h),
        i = vn({
            fetchRaw: () => e.getItem(t),
            fetch: () => s(i.current.fetchRaw(), r.current.defaultValue),
            remove() {
                e.removeItem(t);
            },
            store(h) {
                const g = o(h);
                return (g !== null && e.setItem(t, g), g);
            },
        }),
        a = Ud(),
        [d, u] = v.useState(r.current?.initializeWithValue && a ? i.current.fetch() : void 0),
        l = vn(d),
        c = vn({
            fetch() {
                u(i.current.fetch());
            },
            setRawVal(h) {
                u(s(h, r.current.defaultValue));
            },
        });
    (x0(() => {
        c.current.fetch();
    }, [t]),
        v.useEffect(() => {
            r.current.initializeWithValue || c.current.fetch();
        }, []),
        S0(() => {
            const h = c.current.setRawVal;
            return (
                M0(e, t, h),
                () => {
                    C0(e, t, h);
                }
            );
        }, [e, t]));
    const f = vn({
            set(h) {
                if (!Mn) return;
                const g = Hd(h, l.current),
                    m = i.current.store(g);
                m !== null && Gs(e, t, m);
            },
            delete() {
                Mn && (i.current.remove(), Gs(e, t, null));
            },
            fetch() {
                Mn && Gs(e, t, i.current.fetchRaw());
            },
        }),
        p = v.useMemo(
            () => ({
                set: (h) => {
                    f.current.set(h);
                },
                remove() {
                    f.current.delete();
                },
                fetch() {
                    f.current.fetch();
                },
            }),
            []
        );
    return v.useMemo(() => ({ value: d, ...p }), [d]);
}
const I0 = (e) => {
        if (e === null) return null;
        try {
            return JSON.stringify(e);
        } catch (t) {
            return (console.warn(t), null);
        }
    },
    F0 = (e, t) => {
        if (e === null) return t;
        try {
            return JSON.parse(e);
        } catch (n) {
            return (console.warn(n), t);
        }
    };
let Hi;
try {
    Hi = Mn && !!globalThis.localStorage;
} catch {
    Hi = !1;
}
const k0 = Hi ? (e, t) => T0(localStorage, e, t) : (e, t) => ({ value: void 0, set: Ks, remove: Ks, fetch: Ks }),
    Rr = new Map(),
    Kd = (e) => {
        const t = matchMedia(e),
            n = new Set(),
            r = () => {
                for (const s of n) s(t.matches);
            };
        return (t.addEventListener('change', r, { passive: !0 }), { mql: t, dispatchers: n, listener: r });
    },
    O0 = (e, t) => {
        let n = Rr.get(e);
        (n || ((n = Kd(e)), Rr.set(e, n)), n.dispatchers.add(t), t(n.mql.matches));
    },
    A0 = (e, t) => {
        const n = Rr.get(e);
        if (n) {
            const { mql: r, dispatchers: s, listener: o } = n;
            (s.delete(t),
                s.size === 0 &&
                    (Rr.delete(e), r.removeEventListener ? r.removeEventListener('change', o) : r.removeListener(o)));
        }
    };
function _0(e, t = {}) {
    let { initializeWithValue: n = !0 } = t;
    Mn || (n = !1);
    const [r, s] = v.useState(() => {
        if (n) {
            let o = Rr.get(e);
            return (o || ((o = Kd(e)), Rr.set(e, o)), o.mql.matches);
        }
    });
    return (
        v.useEffect(
            () => (
                O0(e, s),
                () => {
                    A0(e, s);
                }
            ),
            [e]
        ),
        r
    );
}
function dC(e, ...t) {
    const n = w0(),
        r = vn(t[1]),
        s = v.useMemo(
            () =>
                function (...o) {
                    n() &&
                        (typeof r.current == 'function'
                            ? r.current.apply(this, o)
                            : typeof r.current.handleEvent == 'function' && r.current.handleEvent.apply(this, o));
                },
            []
        );
    v.useEffect(() => {
        const o = L0(e) ? e.current : e;
        if (!o) return;
        const i = t.slice(2);
        return (
            $d(o, t[0], s, ...i),
            () => {
                zd(o, t[0], s, ...i);
            }
        );
    }, [e, t[0]]);
}
function L0(e) {
    return e !== null && typeof e == 'object' && v0(e, 'current');
}
const D0 = () => {
        const e = document.createElement('style');
        return (
            e.appendChild(
                document.createTextNode(
                    '*,*::before,*::after{-webkit-transition:none!important;transition:none!important}'
                )
            ),
            document.head.appendChild(e),
            () => {
                (window.getComputedStyle(document.body),
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            e.remove();
                        });
                    }));
            }
        );
    },
    V0 = (e) => {
        const t = v.use(e);
        if (!e.displayName) throw new Error('Context.displayName is not set, it must be set for useSafeContext');
        if (t === void 0) {
            const n = e.displayName.split('Context')[0];
            throw new TypeError(`use${n}Context must be used within a ${n}Provider`);
        }
        return t;
    },
    Oa = v.createContext({});
Oa.displayName = 'ThemeProviderContext';
function N0(e) {
    const t = Xe.c(17),
        { children: n, defaultTheme: r, storageKey: s } = e,
        o = r === void 0 ? 'system' : r,
        i = s === void 0 ? m0 : s;
    let a;
    t[0] !== o ? ((a = { defaultValue: o }), (t[0] = o), (t[1] = a)) : (a = t[1]);
    const { value: d, set: u } = k0(i, a),
        l = _0('(prefers-color-scheme: dark)'),
        c = d ?? o,
        f = (c === 'system' && l) || c === 'dark';
    let p;
    t[2] !== l || t[3] !== d
        ? ((p = function () {
              const b = window.document.documentElement,
                  R = D0();
              (b.classList.remove('light', 'dark'),
                  d === 'system' || (d !== 'dark' && d !== 'light')
                      ? b.classList.add(l ? 'dark' : 'light')
                      : b.classList.add(d),
                  R());
          }),
          (t[2] = l),
          (t[3] = d),
          (t[4] = p))
        : (p = t[4]);
    let h;
    (t[5] !== o || t[6] !== l || t[7] !== d
        ? ((h = [d, l, o]), (t[5] = o), (t[6] = l), (t[7] = d), (t[8] = h))
        : (h = t[8]),
        v.useLayoutEffect(p, h));
    let g;
    t[9] !== f || t[10] !== l || t[11] !== u || t[12] !== c
        ? ((g = { theme: c, setTheme: u, isPrefersDarkTheme: l, isDarkTheme: f }),
          (t[9] = f),
          (t[10] = l),
          (t[11] = u),
          (t[12] = c),
          (t[13] = g))
        : (g = t[13]);
    let m;
    return (
        t[14] !== n || t[15] !== g
            ? ((m = F.jsx(Oa, { value: g, children: n })), (t[14] = n), (t[15] = g), (t[16] = m))
            : (m = t[16]),
        m
    );
}
const j0 = () => V0(Oa),
    B0 = () => {
        const e = Xe.c(2);
        let t, n;
        (e[0] === Symbol.for('react.memo_cache_sentinel')
            ? ((t = function () {
                  document.getElementById('initial-style')?.remove();
              }),
              (n = []),
              (e[0] = t),
              (e[1] = n))
            : ((t = e[0]), (n = e[1])),
            v.useLayoutEffect(t, n));
    };
function Gd(e) {
    var t,
        n,
        r = '';
    if (typeof e == 'string' || typeof e == 'number') r += e;
    else if (typeof e == 'object')
        if (Array.isArray(e)) {
            var s = e.length;
            for (t = 0; t < s; t++) e[t] && (n = Gd(e[t])) && (r && (r += ' '), (r += n));
        } else for (n in e) e[n] && (r && (r += ' '), (r += n));
    return r;
}
function qd() {
    for (var e, t, n = 0, r = '', s = arguments.length; n < s; n++)
        (e = arguments[n]) && (t = Gd(e)) && (r && (r += ' '), (r += t));
    return r;
}
const $0 = (e, t) => {
        const n = new Array(e.length + t.length);
        for (let r = 0; r < e.length; r++) n[r] = e[r];
        for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
        return n;
    },
    z0 = (e, t) => ({ classGroupId: e, validator: t }),
    Qd = (e = new Map(), t = null, n) => ({ nextPart: e, validators: t, classGroupId: n }),
    ho = '-',
    cl = [],
    U0 = 'arbitrary..',
    H0 = (e) => {
        const t = K0(e),
            { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
        return {
            getClassGroupId: (i) => {
                if (i.startsWith('[') && i.endsWith(']')) return W0(i);
                const a = i.split(ho),
                    d = a[0] === '' && a.length > 1 ? 1 : 0;
                return Yd(a, d, t);
            },
            getConflictingClassGroupIds: (i, a) => {
                if (a) {
                    const d = r[i],
                        u = n[i];
                    return d ? (u ? $0(u, d) : d) : u || cl;
                }
                return n[i] || cl;
            },
        };
    },
    Yd = (e, t, n) => {
        if (e.length - t === 0) return n.classGroupId;
        const s = e[t],
            o = n.nextPart.get(s);
        if (o) {
            const u = Yd(e, t + 1, o);
            if (u) return u;
        }
        const i = n.validators;
        if (i === null) return;
        const a = t === 0 ? e.join(ho) : e.slice(t).join(ho),
            d = i.length;
        for (let u = 0; u < d; u++) {
            const l = i[u];
            if (l.validator(a)) return l.classGroupId;
        }
    },
    W0 = (e) =>
        e.slice(1, -1).indexOf(':') === -1
            ? void 0
            : (() => {
                  const t = e.slice(1, -1),
                      n = t.indexOf(':'),
                      r = t.slice(0, n);
                  return r ? U0 + r : void 0;
              })(),
    K0 = (e) => {
        const { theme: t, classGroups: n } = e;
        return G0(n, t);
    },
    G0 = (e, t) => {
        const n = Qd();
        for (const r in e) {
            const s = e[r];
            Aa(s, n, r, t);
        }
        return n;
    },
    Aa = (e, t, n, r) => {
        const s = e.length;
        for (let o = 0; o < s; o++) {
            const i = e[o];
            q0(i, t, n, r);
        }
    },
    q0 = (e, t, n, r) => {
        if (typeof e == 'string') {
            Q0(e, t, n);
            return;
        }
        if (typeof e == 'function') {
            Y0(e, t, n, r);
            return;
        }
        X0(e, t, n, r);
    },
    Q0 = (e, t, n) => {
        const r = e === '' ? t : Xd(t, e);
        r.classGroupId = n;
    },
    Y0 = (e, t, n, r) => {
        if (J0(e)) {
            Aa(e(r), t, n, r);
            return;
        }
        (t.validators === null && (t.validators = []), t.validators.push(z0(n, e)));
    },
    X0 = (e, t, n, r) => {
        const s = Object.entries(e),
            o = s.length;
        for (let i = 0; i < o; i++) {
            const [a, d] = s[i];
            Aa(d, Xd(t, a), n, r);
        }
    },
    Xd = (e, t) => {
        let n = e;
        const r = t.split(ho),
            s = r.length;
        for (let o = 0; o < s; o++) {
            const i = r[o];
            let a = n.nextPart.get(i);
            (a || ((a = Qd()), n.nextPart.set(i, a)), (n = a));
        }
        return n;
    },
    J0 = (e) => 'isThemeGetter' in e && e.isThemeGetter === !0,
    Z0 = (e) => {
        if (e < 1) return { get: () => {}, set: () => {} };
        let t = 0,
            n = Object.create(null),
            r = Object.create(null);
        const s = (o, i) => {
            ((n[o] = i), t++, t > e && ((t = 0), (r = n), (n = Object.create(null))));
        };
        return {
            get(o) {
                let i = n[o];
                if (i !== void 0) return i;
                if ((i = r[o]) !== void 0) return (s(o, i), i);
            },
            set(o, i) {
                o in n ? (n[o] = i) : s(o, i);
            },
        };
    },
    Wi = '!',
    ll = ':',
    ew = [],
    ul = (e, t, n, r, s) => ({
        modifiers: e,
        hasImportantModifier: t,
        baseClassName: n,
        maybePostfixModifierPosition: r,
        isExternal: s,
    }),
    tw = (e) => {
        const { prefix: t, experimentalParseClassName: n } = e;
        let r = (s) => {
            const o = [];
            let i = 0,
                a = 0,
                d = 0,
                u;
            const l = s.length;
            for (let g = 0; g < l; g++) {
                const m = s[g];
                if (i === 0 && a === 0) {
                    if (m === ll) {
                        (o.push(s.slice(d, g)), (d = g + 1));
                        continue;
                    }
                    if (m === '/') {
                        u = g;
                        continue;
                    }
                }
                m === '[' ? i++ : m === ']' ? i-- : m === '(' ? a++ : m === ')' && a--;
            }
            const c = o.length === 0 ? s : s.slice(d);
            let f = c,
                p = !1;
            c.endsWith(Wi) ? ((f = c.slice(0, -1)), (p = !0)) : c.startsWith(Wi) && ((f = c.slice(1)), (p = !0));
            const h = u && u > d ? u - d : void 0;
            return ul(o, p, f, h);
        };
        if (t) {
            const s = t + ll,
                o = r;
            r = (i) => (i.startsWith(s) ? o(i.slice(s.length)) : ul(ew, !1, i, void 0, !0));
        }
        if (n) {
            const s = r;
            r = (o) => n({ className: o, parseClassName: s });
        }
        return r;
    },
    nw = (e) => {
        const t = new Map();
        return (
            e.orderSensitiveModifiers.forEach((n, r) => {
                t.set(n, 1e6 + r);
            }),
            (n) => {
                const r = [];
                let s = [];
                for (let o = 0; o < n.length; o++) {
                    const i = n[o],
                        a = i[0] === '[',
                        d = t.has(i);
                    a || d ? (s.length > 0 && (s.sort(), r.push(...s), (s = [])), r.push(i)) : s.push(i);
                }
                return (s.length > 0 && (s.sort(), r.push(...s)), r);
            }
        );
    },
    rw = (e) => ({
        cache: Z0(e.cacheSize),
        parseClassName: tw(e),
        sortModifiers: nw(e),
        postfixLookupClassGroupIds: sw(e),
        ...H0(e),
    }),
    sw = (e) => {
        const t = Object.create(null),
            n = e.postfixLookupClassGroups;
        if (n) for (let r = 0; r < n.length; r++) t[n[r]] = !0;
        return t;
    },
    ow = /\s+/,
    iw = (e, t) => {
        const {
                parseClassName: n,
                getClassGroupId: r,
                getConflictingClassGroupIds: s,
                sortModifiers: o,
                postfixLookupClassGroupIds: i,
            } = t,
            a = [],
            d = e.trim().split(ow);
        let u = '';
        for (let l = d.length - 1; l >= 0; l -= 1) {
            const c = d[l],
                {
                    isExternal: f,
                    modifiers: p,
                    hasImportantModifier: h,
                    baseClassName: g,
                    maybePostfixModifierPosition: m,
                } = n(c);
            if (f) {
                u = c + (u.length > 0 ? ' ' + u : u);
                continue;
            }
            let y = !!m,
                b;
            if (y) {
                const M = g.substring(0, m);
                b = r(M);
                const S = b && i[b] ? r(g) : void 0;
                S && S !== b && ((b = S), (y = !1));
            } else b = r(g);
            if (!b) {
                if (!y) {
                    u = c + (u.length > 0 ? ' ' + u : u);
                    continue;
                }
                if (((b = r(g)), !b)) {
                    u = c + (u.length > 0 ? ' ' + u : u);
                    continue;
                }
                y = !1;
            }
            const R = p.length === 0 ? '' : p.length === 1 ? p[0] : o(p).join(':'),
                w = h ? R + Wi : R,
                E = w + b;
            if (a.indexOf(E) > -1) continue;
            a.push(E);
            const C = s(b, y);
            for (let M = 0; M < C.length; ++M) {
                const S = C[M];
                a.push(w + S);
            }
            u = c + (u.length > 0 ? ' ' + u : u);
        }
        return u;
    },
    aw = (...e) => {
        let t = 0,
            n,
            r,
            s = '';
        for (; t < e.length;) (n = e[t++]) && (r = Jd(n)) && (s && (s += ' '), (s += r));
        return s;
    },
    Jd = (e) => {
        if (typeof e == 'string') return e;
        let t,
            n = '';
        for (let r = 0; r < e.length; r++) e[r] && (t = Jd(e[r])) && (n && (n += ' '), (n += t));
        return n;
    },
    cw = (e, ...t) => {
        let n, r, s, o;
        const i = (d) => {
                const u = t.reduce((l, c) => c(l), e());
                return ((n = rw(u)), (r = n.cache.get), (s = n.cache.set), (o = a), a(d));
            },
            a = (d) => {
                const u = r(d);
                if (u) return u;
                const l = iw(d, n);
                return (s(d, l), l);
            };
        return ((o = i), (...d) => o(aw(...d)));
    },
    lw = [],
    We = (e) => {
        const t = (n) => n[e] || lw;
        return ((t.isThemeGetter = !0), t);
    },
    Zd = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
    ef = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
    uw = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,
    dw = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
    fw =
        /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
    hw = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
    pw = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
    mw = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
    mn = (e) => uw.test(e),
    be = (e) => !!e && !Number.isNaN(Number(e)),
    Lt = (e) => !!e && Number.isInteger(Number(e)),
    ai = (e) => e.endsWith('%') && be(e.slice(0, -1)),
    Jt = (e) => dw.test(e),
    tf = () => !0,
    gw = (e) => fw.test(e) && !hw.test(e),
    _a = () => !1,
    yw = (e) => pw.test(e),
    bw = (e) => mw.test(e),
    vw = (e) => !te(e) && !ne(e),
    ww = (e) =>
        e.startsWith('@container') &&
        ((e[10] === '/' && e[11] !== void 0) ||
            (e[11] === 's' && e[16] !== void 0 && e.startsWith('-size/', 10)) ||
            (e[11] === 'n' && e[18] !== void 0 && e.startsWith('-normal/', 10))),
    Sw = (e) => On(e, sf, _a),
    te = (e) => Zd.test(e),
    Vn = (e) => On(e, of, gw),
    dl = (e) => On(e, Iw, be),
    xw = (e) => On(e, cf, tf),
    Rw = (e) => On(e, af, _a),
    fl = (e) => On(e, nf, _a),
    Ew = (e) => On(e, rf, bw),
    Ps = (e) => On(e, lf, yw),
    ne = (e) => ef.test(e),
    Vr = (e) => or(e, of),
    Mw = (e) => or(e, af),
    hl = (e) => or(e, nf),
    Cw = (e) => or(e, sf),
    Pw = (e) => or(e, rf),
    Ts = (e) => or(e, lf, !0),
    Tw = (e) => or(e, cf, !0),
    On = (e, t, n) => {
        const r = Zd.exec(e);
        return r ? (r[1] ? t(r[1]) : n(r[2])) : !1;
    },
    or = (e, t, n = !1) => {
        const r = ef.exec(e);
        return r ? (r[1] ? t(r[1]) : n) : !1;
    },
    nf = (e) => e === 'position' || e === 'percentage',
    rf = (e) => e === 'image' || e === 'url',
    sf = (e) => e === 'length' || e === 'size' || e === 'bg-size',
    of = (e) => e === 'length',
    Iw = (e) => e === 'number',
    af = (e) => e === 'family-name',
    cf = (e) => e === 'number' || e === 'weight',
    lf = (e) => e === 'shadow',
    Fw = () => {
        const e = We('color'),
            t = We('font'),
            n = We('text'),
            r = We('font-weight'),
            s = We('tracking'),
            o = We('leading'),
            i = We('breakpoint'),
            a = We('container'),
            d = We('spacing'),
            u = We('radius'),
            l = We('shadow'),
            c = We('inset-shadow'),
            f = We('text-shadow'),
            p = We('drop-shadow'),
            h = We('blur'),
            g = We('perspective'),
            m = We('aspect'),
            y = We('ease'),
            b = We('animate'),
            R = () => ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column'],
            w = () => [
                'center',
                'top',
                'bottom',
                'left',
                'right',
                'top-left',
                'left-top',
                'top-right',
                'right-top',
                'bottom-right',
                'right-bottom',
                'bottom-left',
                'left-bottom',
            ],
            E = () => [...w(), ne, te],
            C = () => ['auto', 'hidden', 'clip', 'visible', 'scroll'],
            M = () => ['auto', 'contain', 'none'],
            S = () => [ne, te, d],
            P = () => [mn, 'full', 'auto', ...S()],
            I = () => [Lt, 'none', 'subgrid', ne, te],
            V = () => ['auto', { span: ['full', Lt, ne, te] }, Lt, ne, te],
            A = () => [Lt, 'auto', ne, te],
            O = () => ['auto', 'min', 'max', 'fr', ne, te],
            L = () => [
                'start',
                'end',
                'center',
                'between',
                'around',
                'evenly',
                'stretch',
                'baseline',
                'center-safe',
                'end-safe',
            ],
            k = () => ['start', 'end', 'center', 'stretch', 'center-safe', 'end-safe'],
            _ = () => ['auto', ...S()],
            B = () => [mn, 'auto', 'full', 'dvw', 'dvh', 'lvw', 'lvh', 'svw', 'svh', 'min', 'max', 'fit', ...S()],
            N = () => [mn, 'screen', 'full', 'dvw', 'lvw', 'svw', 'min', 'max', 'fit', ...S()],
            U = () => [mn, 'screen', 'full', 'lh', 'dvh', 'lvh', 'svh', 'min', 'max', 'fit', ...S()],
            D = () => [e, ne, te],
            X = () => [...w(), hl, fl, { position: [ne, te] }],
            Z = () => ['no-repeat', { repeat: ['', 'x', 'y', 'space', 'round'] }],
            Y = () => ['auto', 'cover', 'contain', Cw, Sw, { size: [ne, te] }],
            Q = () => [ai, Vr, Vn],
            H = () => ['', 'none', 'full', u, ne, te],
            q = () => ['', be, Vr, Vn],
            pe = () => ['solid', 'dashed', 'dotted', 'double'],
            z = () => [
                'normal',
                'multiply',
                'screen',
                'overlay',
                'darken',
                'lighten',
                'color-dodge',
                'color-burn',
                'hard-light',
                'soft-light',
                'difference',
                'exclusion',
                'hue',
                'saturation',
                'color',
                'luminosity',
            ],
            J = () => [be, ai, hl, fl],
            ge = () => ['', 'none', h, ne, te],
            we = () => ['none', be, ne, te],
            W = () => ['none', be, ne, te],
            ie = () => [be, ne, te],
            ue = () => [mn, 'full', ...S()];
        return {
            cacheSize: 500,
            theme: {
                animate: ['spin', 'ping', 'pulse', 'bounce'],
                aspect: ['video'],
                blur: [Jt],
                breakpoint: [Jt],
                color: [tf],
                container: [Jt],
                'drop-shadow': [Jt],
                ease: ['in', 'out', 'in-out'],
                font: [vw],
                'font-weight': [
                    'thin',
                    'extralight',
                    'light',
                    'normal',
                    'medium',
                    'semibold',
                    'bold',
                    'extrabold',
                    'black',
                ],
                'inset-shadow': [Jt],
                leading: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'],
                perspective: ['dramatic', 'near', 'normal', 'midrange', 'distant', 'none'],
                radius: [Jt],
                shadow: [Jt],
                spacing: ['px', be],
                text: [Jt],
                'text-shadow': [Jt],
                tracking: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'],
            },
            classGroups: {
                aspect: [{ aspect: ['auto', 'square', mn, te, ne, m] }],
                container: ['container'],
                'container-type': [{ '@container': ['', 'normal', 'size', ne, te] }],
                'container-named': [ww],
                columns: [{ columns: [be, te, ne, a] }],
                'break-after': [{ 'break-after': R() }],
                'break-before': [{ 'break-before': R() }],
                'break-inside': [{ 'break-inside': ['auto', 'avoid', 'avoid-page', 'avoid-column'] }],
                'box-decoration': [{ 'box-decoration': ['slice', 'clone'] }],
                box: [{ box: ['border', 'content'] }],
                display: [
                    'block',
                    'inline-block',
                    'inline',
                    'flex',
                    'inline-flex',
                    'table',
                    'inline-table',
                    'table-caption',
                    'table-cell',
                    'table-column',
                    'table-column-group',
                    'table-footer-group',
                    'table-header-group',
                    'table-row-group',
                    'table-row',
                    'flow-root',
                    'grid',
                    'inline-grid',
                    'contents',
                    'list-item',
                    'hidden',
                ],
                sr: ['sr-only', 'not-sr-only'],
                float: [{ float: ['right', 'left', 'none', 'start', 'end'] }],
                clear: [{ clear: ['left', 'right', 'both', 'none', 'start', 'end'] }],
                isolation: ['isolate', 'isolation-auto'],
                'object-fit': [{ object: ['contain', 'cover', 'fill', 'none', 'scale-down'] }],
                'object-position': [{ object: E() }],
                overflow: [{ overflow: C() }],
                'overflow-x': [{ 'overflow-x': C() }],
                'overflow-y': [{ 'overflow-y': C() }],
                overscroll: [{ overscroll: M() }],
                'overscroll-x': [{ 'overscroll-x': M() }],
                'overscroll-y': [{ 'overscroll-y': M() }],
                position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
                inset: [{ inset: P() }],
                'inset-x': [{ 'inset-x': P() }],
                'inset-y': [{ 'inset-y': P() }],
                start: [{ 'inset-s': P(), start: P() }],
                end: [{ 'inset-e': P(), end: P() }],
                'inset-bs': [{ 'inset-bs': P() }],
                'inset-be': [{ 'inset-be': P() }],
                top: [{ top: P() }],
                right: [{ right: P() }],
                bottom: [{ bottom: P() }],
                left: [{ left: P() }],
                visibility: ['visible', 'invisible', 'collapse'],
                z: [{ z: [Lt, 'auto', ne, te] }],
                basis: [{ basis: [mn, 'full', 'auto', a, ...S()] }],
                'flex-direction': [{ flex: ['row', 'row-reverse', 'col', 'col-reverse'] }],
                'flex-wrap': [{ flex: ['nowrap', 'wrap', 'wrap-reverse'] }],
                flex: [{ flex: [be, mn, 'auto', 'initial', 'none', te] }],
                grow: [{ grow: ['', be, ne, te] }],
                shrink: [{ shrink: ['', be, ne, te] }],
                order: [{ order: [Lt, 'first', 'last', 'none', ne, te] }],
                'grid-cols': [{ 'grid-cols': I() }],
                'col-start-end': [{ col: V() }],
                'col-start': [{ 'col-start': A() }],
                'col-end': [{ 'col-end': A() }],
                'grid-rows': [{ 'grid-rows': I() }],
                'row-start-end': [{ row: V() }],
                'row-start': [{ 'row-start': A() }],
                'row-end': [{ 'row-end': A() }],
                'grid-flow': [{ 'grid-flow': ['row', 'col', 'dense', 'row-dense', 'col-dense'] }],
                'auto-cols': [{ 'auto-cols': O() }],
                'auto-rows': [{ 'auto-rows': O() }],
                gap: [{ gap: S() }],
                'gap-x': [{ 'gap-x': S() }],
                'gap-y': [{ 'gap-y': S() }],
                'justify-content': [{ justify: [...L(), 'normal'] }],
                'justify-items': [{ 'justify-items': [...k(), 'normal'] }],
                'justify-self': [{ 'justify-self': ['auto', ...k()] }],
                'align-content': [{ content: ['normal', ...L()] }],
                'align-items': [{ items: [...k(), { baseline: ['', 'last'] }] }],
                'align-self': [{ self: ['auto', ...k(), { baseline: ['', 'last'] }] }],
                'place-content': [{ 'place-content': L() }],
                'place-items': [{ 'place-items': [...k(), 'baseline'] }],
                'place-self': [{ 'place-self': ['auto', ...k()] }],
                p: [{ p: S() }],
                px: [{ px: S() }],
                py: [{ py: S() }],
                ps: [{ ps: S() }],
                pe: [{ pe: S() }],
                pbs: [{ pbs: S() }],
                pbe: [{ pbe: S() }],
                pt: [{ pt: S() }],
                pr: [{ pr: S() }],
                pb: [{ pb: S() }],
                pl: [{ pl: S() }],
                m: [{ m: _() }],
                mx: [{ mx: _() }],
                my: [{ my: _() }],
                ms: [{ ms: _() }],
                me: [{ me: _() }],
                mbs: [{ mbs: _() }],
                mbe: [{ mbe: _() }],
                mt: [{ mt: _() }],
                mr: [{ mr: _() }],
                mb: [{ mb: _() }],
                ml: [{ ml: _() }],
                'space-x': [{ 'space-x': S() }],
                'space-x-reverse': ['space-x-reverse'],
                'space-y': [{ 'space-y': S() }],
                'space-y-reverse': ['space-y-reverse'],
                size: [{ size: B() }],
                'inline-size': [{ inline: ['auto', ...N()] }],
                'min-inline-size': [{ 'min-inline': ['auto', ...N()] }],
                'max-inline-size': [{ 'max-inline': ['none', ...N()] }],
                'block-size': [{ block: ['auto', ...U()] }],
                'min-block-size': [{ 'min-block': ['auto', ...U()] }],
                'max-block-size': [{ 'max-block': ['none', ...U()] }],
                w: [{ w: [a, 'screen', ...B()] }],
                'min-w': [{ 'min-w': [a, 'screen', 'none', ...B()] }],
                'max-w': [{ 'max-w': [a, 'screen', 'none', 'prose', { screen: [i] }, ...B()] }],
                h: [{ h: ['screen', 'lh', ...B()] }],
                'min-h': [{ 'min-h': ['screen', 'lh', 'none', ...B()] }],
                'max-h': [{ 'max-h': ['screen', 'lh', ...B()] }],
                'font-size': [{ text: ['base', n, Vr, Vn] }],
                'font-smoothing': ['antialiased', 'subpixel-antialiased'],
                'font-style': ['italic', 'not-italic'],
                'font-weight': [{ font: [r, Tw, xw] }],
                'font-stretch': [
                    {
                        'font-stretch': [
                            'ultra-condensed',
                            'extra-condensed',
                            'condensed',
                            'semi-condensed',
                            'normal',
                            'semi-expanded',
                            'expanded',
                            'extra-expanded',
                            'ultra-expanded',
                            ai,
                            te,
                        ],
                    },
                ],
                'font-family': [{ font: [Mw, Rw, t] }],
                'font-features': [{ 'font-features': [te] }],
                'fvn-normal': ['normal-nums'],
                'fvn-ordinal': ['ordinal'],
                'fvn-slashed-zero': ['slashed-zero'],
                'fvn-figure': ['lining-nums', 'oldstyle-nums'],
                'fvn-spacing': ['proportional-nums', 'tabular-nums'],
                'fvn-fraction': ['diagonal-fractions', 'stacked-fractions'],
                tracking: [{ tracking: [s, ne, te] }],
                'line-clamp': [{ 'line-clamp': [be, 'none', ne, dl] }],
                leading: [{ leading: [o, ...S()] }],
                'list-image': [{ 'list-image': ['none', ne, te] }],
                'list-style-position': [{ list: ['inside', 'outside'] }],
                'list-style-type': [{ list: ['disc', 'decimal', 'none', ne, te] }],
                'text-alignment': [{ text: ['left', 'center', 'right', 'justify', 'start', 'end'] }],
                'placeholder-color': [{ placeholder: D() }],
                'text-color': [{ text: D() }],
                'text-decoration': ['underline', 'overline', 'line-through', 'no-underline'],
                'text-decoration-style': [{ decoration: [...pe(), 'wavy'] }],
                'text-decoration-thickness': [{ decoration: [be, 'from-font', 'auto', ne, Vn] }],
                'text-decoration-color': [{ decoration: D() }],
                'underline-offset': [{ 'underline-offset': [be, 'auto', ne, te] }],
                'text-transform': ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
                'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],
                'text-wrap': [{ text: ['wrap', 'nowrap', 'balance', 'pretty'] }],
                indent: [{ indent: S() }],
                'tab-size': [{ tab: [Lt, ne, te] }],
                'vertical-align': [
                    {
                        align: [
                            'baseline',
                            'top',
                            'middle',
                            'bottom',
                            'text-top',
                            'text-bottom',
                            'sub',
                            'super',
                            ne,
                            te,
                        ],
                    },
                ],
                whitespace: [{ whitespace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces'] }],
                break: [{ break: ['normal', 'words', 'all', 'keep'] }],
                wrap: [{ wrap: ['break-word', 'anywhere', 'normal'] }],
                hyphens: [{ hyphens: ['none', 'manual', 'auto'] }],
                content: [{ content: ['none', ne, te] }],
                'bg-attachment': [{ bg: ['fixed', 'local', 'scroll'] }],
                'bg-clip': [{ 'bg-clip': ['border', 'padding', 'content', 'text'] }],
                'bg-origin': [{ 'bg-origin': ['border', 'padding', 'content'] }],
                'bg-position': [{ bg: X() }],
                'bg-repeat': [{ bg: Z() }],
                'bg-size': [{ bg: Y() }],
                'bg-image': [
                    {
                        bg: [
                            'none',
                            {
                                linear: [{ to: ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'] }, Lt, ne, te],
                                radial: ['', ne, te],
                                conic: [Lt, ne, te],
                            },
                            Pw,
                            Ew,
                        ],
                    },
                ],
                'bg-color': [{ bg: D() }],
                'gradient-from-pos': [{ from: Q() }],
                'gradient-via-pos': [{ via: Q() }],
                'gradient-to-pos': [{ to: Q() }],
                'gradient-from': [{ from: D() }],
                'gradient-via': [{ via: D() }],
                'gradient-to': [{ to: D() }],
                rounded: [{ rounded: H() }],
                'rounded-s': [{ 'rounded-s': H() }],
                'rounded-e': [{ 'rounded-e': H() }],
                'rounded-t': [{ 'rounded-t': H() }],
                'rounded-r': [{ 'rounded-r': H() }],
                'rounded-b': [{ 'rounded-b': H() }],
                'rounded-l': [{ 'rounded-l': H() }],
                'rounded-ss': [{ 'rounded-ss': H() }],
                'rounded-se': [{ 'rounded-se': H() }],
                'rounded-ee': [{ 'rounded-ee': H() }],
                'rounded-es': [{ 'rounded-es': H() }],
                'rounded-tl': [{ 'rounded-tl': H() }],
                'rounded-tr': [{ 'rounded-tr': H() }],
                'rounded-br': [{ 'rounded-br': H() }],
                'rounded-bl': [{ 'rounded-bl': H() }],
                'border-w': [{ border: q() }],
                'border-w-x': [{ 'border-x': q() }],
                'border-w-y': [{ 'border-y': q() }],
                'border-w-s': [{ 'border-s': q() }],
                'border-w-e': [{ 'border-e': q() }],
                'border-w-bs': [{ 'border-bs': q() }],
                'border-w-be': [{ 'border-be': q() }],
                'border-w-t': [{ 'border-t': q() }],
                'border-w-r': [{ 'border-r': q() }],
                'border-w-b': [{ 'border-b': q() }],
                'border-w-l': [{ 'border-l': q() }],
                'divide-x': [{ 'divide-x': q() }],
                'divide-x-reverse': ['divide-x-reverse'],
                'divide-y': [{ 'divide-y': q() }],
                'divide-y-reverse': ['divide-y-reverse'],
                'border-style': [{ border: [...pe(), 'hidden', 'none'] }],
                'divide-style': [{ divide: [...pe(), 'hidden', 'none'] }],
                'border-color': [{ border: D() }],
                'border-color-x': [{ 'border-x': D() }],
                'border-color-y': [{ 'border-y': D() }],
                'border-color-s': [{ 'border-s': D() }],
                'border-color-e': [{ 'border-e': D() }],
                'border-color-bs': [{ 'border-bs': D() }],
                'border-color-be': [{ 'border-be': D() }],
                'border-color-t': [{ 'border-t': D() }],
                'border-color-r': [{ 'border-r': D() }],
                'border-color-b': [{ 'border-b': D() }],
                'border-color-l': [{ 'border-l': D() }],
                'divide-color': [{ divide: D() }],
                'outline-style': [{ outline: [...pe(), 'none', 'hidden'] }],
                'outline-offset': [{ 'outline-offset': [be, ne, te] }],
                'outline-w': [{ outline: ['', be, Vr, Vn] }],
                'outline-color': [{ outline: D() }],
                shadow: [{ shadow: ['', 'none', l, Ts, Ps] }],
                'shadow-color': [{ shadow: D() }],
                'inset-shadow': [{ 'inset-shadow': ['none', c, Ts, Ps] }],
                'inset-shadow-color': [{ 'inset-shadow': D() }],
                'ring-w': [{ ring: q() }],
                'ring-w-inset': ['ring-inset'],
                'ring-color': [{ ring: D() }],
                'ring-offset-w': [{ 'ring-offset': [be, Vn] }],
                'ring-offset-color': [{ 'ring-offset': D() }],
                'inset-ring-w': [{ 'inset-ring': q() }],
                'inset-ring-color': [{ 'inset-ring': D() }],
                'text-shadow': [{ 'text-shadow': ['none', f, Ts, Ps] }],
                'text-shadow-color': [{ 'text-shadow': D() }],
                opacity: [{ opacity: [be, ne, te] }],
                'mix-blend': [{ 'mix-blend': [...z(), 'plus-darker', 'plus-lighter'] }],
                'bg-blend': [{ 'bg-blend': z() }],
                'mask-clip': [
                    { 'mask-clip': ['border', 'padding', 'content', 'fill', 'stroke', 'view'] },
                    'mask-no-clip',
                ],
                'mask-composite': [{ mask: ['add', 'subtract', 'intersect', 'exclude'] }],
                'mask-image-linear-pos': [{ 'mask-linear': [be] }],
                'mask-image-linear-from-pos': [{ 'mask-linear-from': J() }],
                'mask-image-linear-to-pos': [{ 'mask-linear-to': J() }],
                'mask-image-linear-from-color': [{ 'mask-linear-from': D() }],
                'mask-image-linear-to-color': [{ 'mask-linear-to': D() }],
                'mask-image-t-from-pos': [{ 'mask-t-from': J() }],
                'mask-image-t-to-pos': [{ 'mask-t-to': J() }],
                'mask-image-t-from-color': [{ 'mask-t-from': D() }],
                'mask-image-t-to-color': [{ 'mask-t-to': D() }],
                'mask-image-r-from-pos': [{ 'mask-r-from': J() }],
                'mask-image-r-to-pos': [{ 'mask-r-to': J() }],
                'mask-image-r-from-color': [{ 'mask-r-from': D() }],
                'mask-image-r-to-color': [{ 'mask-r-to': D() }],
                'mask-image-b-from-pos': [{ 'mask-b-from': J() }],
                'mask-image-b-to-pos': [{ 'mask-b-to': J() }],
                'mask-image-b-from-color': [{ 'mask-b-from': D() }],
                'mask-image-b-to-color': [{ 'mask-b-to': D() }],
                'mask-image-l-from-pos': [{ 'mask-l-from': J() }],
                'mask-image-l-to-pos': [{ 'mask-l-to': J() }],
                'mask-image-l-from-color': [{ 'mask-l-from': D() }],
                'mask-image-l-to-color': [{ 'mask-l-to': D() }],
                'mask-image-x-from-pos': [{ 'mask-x-from': J() }],
                'mask-image-x-to-pos': [{ 'mask-x-to': J() }],
                'mask-image-x-from-color': [{ 'mask-x-from': D() }],
                'mask-image-x-to-color': [{ 'mask-x-to': D() }],
                'mask-image-y-from-pos': [{ 'mask-y-from': J() }],
                'mask-image-y-to-pos': [{ 'mask-y-to': J() }],
                'mask-image-y-from-color': [{ 'mask-y-from': D() }],
                'mask-image-y-to-color': [{ 'mask-y-to': D() }],
                'mask-image-radial': [{ 'mask-radial': [ne, te] }],
                'mask-image-radial-from-pos': [{ 'mask-radial-from': J() }],
                'mask-image-radial-to-pos': [{ 'mask-radial-to': J() }],
                'mask-image-radial-from-color': [{ 'mask-radial-from': D() }],
                'mask-image-radial-to-color': [{ 'mask-radial-to': D() }],
                'mask-image-radial-shape': [{ 'mask-radial': ['circle', 'ellipse'] }],
                'mask-image-radial-size': [
                    { 'mask-radial': [{ closest: ['side', 'corner'], farthest: ['side', 'corner'] }] },
                ],
                'mask-image-radial-pos': [{ 'mask-radial-at': w() }],
                'mask-image-conic-pos': [{ 'mask-conic': [be] }],
                'mask-image-conic-from-pos': [{ 'mask-conic-from': J() }],
                'mask-image-conic-to-pos': [{ 'mask-conic-to': J() }],
                'mask-image-conic-from-color': [{ 'mask-conic-from': D() }],
                'mask-image-conic-to-color': [{ 'mask-conic-to': D() }],
                'mask-mode': [{ mask: ['alpha', 'luminance', 'match'] }],
                'mask-origin': [{ 'mask-origin': ['border', 'padding', 'content', 'fill', 'stroke', 'view'] }],
                'mask-position': [{ mask: X() }],
                'mask-repeat': [{ mask: Z() }],
                'mask-size': [{ mask: Y() }],
                'mask-type': [{ 'mask-type': ['alpha', 'luminance'] }],
                'mask-image': [{ mask: ['none', ne, te] }],
                filter: [{ filter: ['', 'none', ne, te] }],
                blur: [{ blur: ge() }],
                brightness: [{ brightness: [be, ne, te] }],
                contrast: [{ contrast: [be, ne, te] }],
                'drop-shadow': [{ 'drop-shadow': ['', 'none', p, Ts, Ps] }],
                'drop-shadow-color': [{ 'drop-shadow': D() }],
                grayscale: [{ grayscale: ['', be, ne, te] }],
                'hue-rotate': [{ 'hue-rotate': [be, ne, te] }],
                invert: [{ invert: ['', be, ne, te] }],
                saturate: [{ saturate: [be, ne, te] }],
                sepia: [{ sepia: ['', be, ne, te] }],
                'backdrop-filter': [{ 'backdrop-filter': ['', 'none', ne, te] }],
                'backdrop-blur': [{ 'backdrop-blur': ge() }],
                'backdrop-brightness': [{ 'backdrop-brightness': [be, ne, te] }],
                'backdrop-contrast': [{ 'backdrop-contrast': [be, ne, te] }],
                'backdrop-grayscale': [{ 'backdrop-grayscale': ['', be, ne, te] }],
                'backdrop-hue-rotate': [{ 'backdrop-hue-rotate': [be, ne, te] }],
                'backdrop-invert': [{ 'backdrop-invert': ['', be, ne, te] }],
                'backdrop-opacity': [{ 'backdrop-opacity': [be, ne, te] }],
                'backdrop-saturate': [{ 'backdrop-saturate': [be, ne, te] }],
                'backdrop-sepia': [{ 'backdrop-sepia': ['', be, ne, te] }],
                'border-collapse': [{ border: ['collapse', 'separate'] }],
                'border-spacing': [{ 'border-spacing': S() }],
                'border-spacing-x': [{ 'border-spacing-x': S() }],
                'border-spacing-y': [{ 'border-spacing-y': S() }],
                'table-layout': [{ table: ['auto', 'fixed'] }],
                caption: [{ caption: ['top', 'bottom'] }],
                transition: [{ transition: ['', 'all', 'colors', 'opacity', 'shadow', 'transform', 'none', ne, te] }],
                'transition-behavior': [{ transition: ['normal', 'discrete'] }],
                duration: [{ duration: [be, 'initial', ne, te] }],
                ease: [{ ease: ['linear', 'initial', y, ne, te] }],
                delay: [{ delay: [be, ne, te] }],
                animate: [{ animate: ['none', b, ne, te] }],
                backface: [{ backface: ['hidden', 'visible'] }],
                perspective: [{ perspective: [g, ne, te] }],
                'perspective-origin': [{ 'perspective-origin': E() }],
                rotate: [{ rotate: we() }],
                'rotate-x': [{ 'rotate-x': we() }],
                'rotate-y': [{ 'rotate-y': we() }],
                'rotate-z': [{ 'rotate-z': we() }],
                scale: [{ scale: W() }],
                'scale-x': [{ 'scale-x': W() }],
                'scale-y': [{ 'scale-y': W() }],
                'scale-z': [{ 'scale-z': W() }],
                'scale-3d': ['scale-3d'],
                skew: [{ skew: ie() }],
                'skew-x': [{ 'skew-x': ie() }],
                'skew-y': [{ 'skew-y': ie() }],
                transform: [{ transform: [ne, te, '', 'none', 'gpu', 'cpu'] }],
                'transform-origin': [{ origin: E() }],
                'transform-style': [{ transform: ['3d', 'flat'] }],
                translate: [{ translate: ue() }],
                'translate-x': [{ 'translate-x': ue() }],
                'translate-y': [{ 'translate-y': ue() }],
                'translate-z': [{ 'translate-z': ue() }],
                'translate-none': ['translate-none'],
                zoom: [{ zoom: [Lt, ne, te] }],
                accent: [{ accent: D() }],
                appearance: [{ appearance: ['none', 'auto'] }],
                'caret-color': [{ caret: D() }],
                'color-scheme': [{ scheme: ['normal', 'dark', 'light', 'light-dark', 'only-dark', 'only-light'] }],
                cursor: [
                    {
                        cursor: [
                            'auto',
                            'default',
                            'pointer',
                            'wait',
                            'text',
                            'move',
                            'help',
                            'not-allowed',
                            'none',
                            'context-menu',
                            'progress',
                            'cell',
                            'crosshair',
                            'vertical-text',
                            'alias',
                            'copy',
                            'no-drop',
                            'grab',
                            'grabbing',
                            'all-scroll',
                            'col-resize',
                            'row-resize',
                            'n-resize',
                            'e-resize',
                            's-resize',
                            'w-resize',
                            'ne-resize',
                            'nw-resize',
                            'se-resize',
                            'sw-resize',
                            'ew-resize',
                            'ns-resize',
                            'nesw-resize',
                            'nwse-resize',
                            'zoom-in',
                            'zoom-out',
                            ne,
                            te,
                        ],
                    },
                ],
                'field-sizing': [{ 'field-sizing': ['fixed', 'content'] }],
                'pointer-events': [{ 'pointer-events': ['auto', 'none'] }],
                resize: [{ resize: ['none', '', 'y', 'x'] }],
                'scroll-behavior': [{ scroll: ['auto', 'smooth'] }],
                'scrollbar-thumb-color': [{ 'scrollbar-thumb': D() }],
                'scrollbar-track-color': [{ 'scrollbar-track': D() }],
                'scrollbar-gutter': [{ 'scrollbar-gutter': ['auto', 'stable', 'both'] }],
                'scrollbar-w': [{ scrollbar: ['auto', 'thin', 'none'] }],
                'scroll-m': [{ 'scroll-m': S() }],
                'scroll-mx': [{ 'scroll-mx': S() }],
                'scroll-my': [{ 'scroll-my': S() }],
                'scroll-ms': [{ 'scroll-ms': S() }],
                'scroll-me': [{ 'scroll-me': S() }],
                'scroll-mbs': [{ 'scroll-mbs': S() }],
                'scroll-mbe': [{ 'scroll-mbe': S() }],
                'scroll-mt': [{ 'scroll-mt': S() }],
                'scroll-mr': [{ 'scroll-mr': S() }],
                'scroll-mb': [{ 'scroll-mb': S() }],
                'scroll-ml': [{ 'scroll-ml': S() }],
                'scroll-p': [{ 'scroll-p': S() }],
                'scroll-px': [{ 'scroll-px': S() }],
                'scroll-py': [{ 'scroll-py': S() }],
                'scroll-ps': [{ 'scroll-ps': S() }],
                'scroll-pe': [{ 'scroll-pe': S() }],
                'scroll-pbs': [{ 'scroll-pbs': S() }],
                'scroll-pbe': [{ 'scroll-pbe': S() }],
                'scroll-pt': [{ 'scroll-pt': S() }],
                'scroll-pr': [{ 'scroll-pr': S() }],
                'scroll-pb': [{ 'scroll-pb': S() }],
                'scroll-pl': [{ 'scroll-pl': S() }],
                'snap-align': [{ snap: ['start', 'end', 'center', 'align-none'] }],
                'snap-stop': [{ snap: ['normal', 'always'] }],
                'snap-type': [{ snap: ['none', 'x', 'y', 'both'] }],
                'snap-strictness': [{ snap: ['mandatory', 'proximity'] }],
                touch: [{ touch: ['auto', 'none', 'manipulation'] }],
                'touch-x': [{ 'touch-pan': ['x', 'left', 'right'] }],
                'touch-y': [{ 'touch-pan': ['y', 'up', 'down'] }],
                'touch-pz': ['touch-pinch-zoom'],
                select: [{ select: ['none', 'text', 'all', 'auto'] }],
                'will-change': [{ 'will-change': ['auto', 'scroll', 'contents', 'transform', ne, te] }],
                fill: [{ fill: ['none', ...D()] }],
                'stroke-w': [{ stroke: [be, Vr, Vn, dl] }],
                stroke: [{ stroke: ['none', ...D()] }],
                'forced-color-adjust': [{ 'forced-color-adjust': ['auto', 'none'] }],
            },
            conflictingClassGroups: {
                'container-named': ['container-type'],
                overflow: ['overflow-x', 'overflow-y'],
                overscroll: ['overscroll-x', 'overscroll-y'],
                inset: ['inset-x', 'inset-y', 'inset-bs', 'inset-be', 'start', 'end', 'top', 'right', 'bottom', 'left'],
                'inset-x': ['right', 'left'],
                'inset-y': ['top', 'bottom'],
                flex: ['basis', 'grow', 'shrink'],
                gap: ['gap-x', 'gap-y'],
                p: ['px', 'py', 'ps', 'pe', 'pbs', 'pbe', 'pt', 'pr', 'pb', 'pl'],
                px: ['pr', 'pl'],
                py: ['pt', 'pb'],
                m: ['mx', 'my', 'ms', 'me', 'mbs', 'mbe', 'mt', 'mr', 'mb', 'ml'],
                mx: ['mr', 'ml'],
                my: ['mt', 'mb'],
                size: ['w', 'h'],
                'font-size': ['leading'],
                'fvn-normal': ['fvn-ordinal', 'fvn-slashed-zero', 'fvn-figure', 'fvn-spacing', 'fvn-fraction'],
                'fvn-ordinal': ['fvn-normal'],
                'fvn-slashed-zero': ['fvn-normal'],
                'fvn-figure': ['fvn-normal'],
                'fvn-spacing': ['fvn-normal'],
                'fvn-fraction': ['fvn-normal'],
                'line-clamp': ['display', 'overflow'],
                rounded: [
                    'rounded-s',
                    'rounded-e',
                    'rounded-t',
                    'rounded-r',
                    'rounded-b',
                    'rounded-l',
                    'rounded-ss',
                    'rounded-se',
                    'rounded-ee',
                    'rounded-es',
                    'rounded-tl',
                    'rounded-tr',
                    'rounded-br',
                    'rounded-bl',
                ],
                'rounded-s': ['rounded-ss', 'rounded-es'],
                'rounded-e': ['rounded-se', 'rounded-ee'],
                'rounded-t': ['rounded-tl', 'rounded-tr'],
                'rounded-r': ['rounded-tr', 'rounded-br'],
                'rounded-b': ['rounded-br', 'rounded-bl'],
                'rounded-l': ['rounded-tl', 'rounded-bl'],
                'border-spacing': ['border-spacing-x', 'border-spacing-y'],
                'border-w': [
                    'border-w-x',
                    'border-w-y',
                    'border-w-s',
                    'border-w-e',
                    'border-w-bs',
                    'border-w-be',
                    'border-w-t',
                    'border-w-r',
                    'border-w-b',
                    'border-w-l',
                ],
                'border-w-x': ['border-w-r', 'border-w-l'],
                'border-w-y': ['border-w-t', 'border-w-b'],
                'border-color': [
                    'border-color-x',
                    'border-color-y',
                    'border-color-s',
                    'border-color-e',
                    'border-color-bs',
                    'border-color-be',
                    'border-color-t',
                    'border-color-r',
                    'border-color-b',
                    'border-color-l',
                ],
                'border-color-x': ['border-color-r', 'border-color-l'],
                'border-color-y': ['border-color-t', 'border-color-b'],
                translate: ['translate-x', 'translate-y', 'translate-none'],
                'translate-none': ['translate', 'translate-x', 'translate-y', 'translate-z'],
                'scroll-m': [
                    'scroll-mx',
                    'scroll-my',
                    'scroll-ms',
                    'scroll-me',
                    'scroll-mbs',
                    'scroll-mbe',
                    'scroll-mt',
                    'scroll-mr',
                    'scroll-mb',
                    'scroll-ml',
                ],
                'scroll-mx': ['scroll-mr', 'scroll-ml'],
                'scroll-my': ['scroll-mt', 'scroll-mb'],
                'scroll-p': [
                    'scroll-px',
                    'scroll-py',
                    'scroll-ps',
                    'scroll-pe',
                    'scroll-pbs',
                    'scroll-pbe',
                    'scroll-pt',
                    'scroll-pr',
                    'scroll-pb',
                    'scroll-pl',
                ],
                'scroll-px': ['scroll-pr', 'scroll-pl'],
                'scroll-py': ['scroll-pt', 'scroll-pb'],
                touch: ['touch-x', 'touch-y', 'touch-pz'],
                'touch-x': ['touch'],
                'touch-y': ['touch'],
                'touch-pz': ['touch'],
            },
            conflictingClassGroupModifiers: { 'font-size': ['leading'] },
            postfixLookupClassGroups: ['container-type'],
            orderSensitiveModifiers: [
                '*',
                '**',
                'after',
                'backdrop',
                'before',
                'details-content',
                'file',
                'first-letter',
                'first-line',
                'marker',
                'placeholder',
                'selection',
            ],
        };
    },
    kw = cw(Fw),
    Kt = (...e) => kw(qd(e));
function Ow(e) {
    const t = Xe.c(13);
    let n, r, s;
    t[0] !== e
        ? (({ className: n, style: s, ...r } = e), (t[0] = e), (t[1] = n), (t[2] = r), (t[3] = s))
        : ((n = t[1]), (r = t[2]), (s = t[3]));
    const { theme: o } = j0();
    let i;
    t[4] !== n ? ((i = Kt('group/toast', n)), (t[4] = n), (t[5] = i)) : (i = t[5]);
    let a;
    t[6] !== s
        ? ((a = {
              ...s,
              '--normal-bg': 'var(--popover)',
              '--normal-text': 'var(--popover-foreground)',
              '--normal-border': 'var(--border)',
          }),
          (t[6] = s),
          (t[7] = a))
        : (a = t[7]);
    const d = a;
    let u;
    return (
        t[8] !== r || t[9] !== i || t[10] !== d || t[11] !== o
            ? ((u = F.jsx(p0, { ...r, theme: o, className: i, style: d })),
              (t[8] = r),
              (t[9] = i),
              (t[10] = d),
              (t[11] = o),
              (t[12] = u))
            : (u = t[12]),
        u
    );
}
const pl = {};
function Gt(e, t) {
    const n = v.useRef(pl);
    return (n.current === pl && (n.current = e(t)), n);
}
const Ki = [];
let Gi;
function Aw() {
    return Gi;
}
function _w(e) {
    Ki.push(e);
}
function uf(e) {
    const t = (n, r) => {
        const s = Gt(Dw).current;
        let o;
        try {
            Gi = s;
            for (const i of Ki) i.before(s);
            o = e(n, r);
            for (const i of Ki) i.after(s);
            s.didInitialize = !0;
        } finally {
            Gi = void 0;
        }
        return o;
    };
    return ((t.displayName = e.displayName || e.name), t);
}
function Lw(e) {
    return v.forwardRef(uf(e));
}
function Dw() {
    return { didInitialize: !1 };
}
const Vw = () => {},
    fe = typeof document < 'u' ? v.useLayoutEffect : Vw;
function Nw(e, t) {
    return function (r, ...s) {
        const o = new URL(e);
        return (
            o.searchParams.set('code', r.toString()),
            s.forEach((i) => o.searchParams.append('args[]', i)),
            `${t} error #${r}; visit ${o} for the full message.`
        );
    };
}
const ir = Nw('https://base-ui.com/production-error', 'Base UI'),
    df = v.createContext(void 0);
function fs(e) {
    const t = v.useContext(df);
    if (t === void 0 && !e) throw new Error(ir(72));
    return t;
}
const jw = [];
function La(e) {
    v.useEffect(e, jw);
}
const Nr = 0;
class cn {
    static create() {
        return new cn();
    }
    currentId = Nr;
    start(t, n) {
        (this.clear(),
            (this.currentId = setTimeout(() => {
                ((this.currentId = Nr), n());
            }, t)));
    }
    isStarted() {
        return this.currentId !== Nr;
    }
    clear = () => {
        this.currentId !== Nr && (clearTimeout(this.currentId), (this.currentId = Nr));
    };
    disposeEffect = () => this.clear;
}
function Ut() {
    const e = Gt(cn.create).current;
    return (La(e.disposeEffect), e);
}
function Bw() {
    return typeof navigator > 'u'
        ? { userAgent: '', platform: '', maxTouchPoints: 0 }
        : {
              userAgent: navigator.userAgent,
              platform: navigator.platform ?? '',
              maxTouchPoints: navigator.maxTouchPoints ?? 0,
          };
}
const { userAgent: $w, platform: zw, maxTouchPoints: Uw } = Bw(),
    jo = $w.toLowerCase(),
    ts = zw.toLowerCase(),
    ff = /^i(os$|p)/.test(ts) || (ts === 'macintel' && Uw > 1),
    ml = 'android',
    qi = ts === ml || jo.includes(ml),
    hf = !ff && ts.startsWith('mac');
ts.startsWith('win');
const Hw = hf || ff,
    Tr = typeof CSS < 'u' && !!CSS.supports?.('-webkit-backdrop-filter:none'),
    fC = !Tr && jo.includes('firefox');
!Tr && jo.includes('chrom');
const Ww = Hw,
    pf = /jsdom|happydom/.test(jo);
function Pt(e) {
    (e.preventDefault(), e.stopPropagation());
}
function Kw(e) {
    return 'nativeEvent' in e;
}
function mf(e) {
    return e.pointerType === '' && e.isTrusted
        ? !0
        : qi && e.pointerType
          ? e.type === 'click' && e.buttons === 1
          : e.detail === 0 && !e.pointerType;
}
function gf(e) {
    return pf
        ? !1
        : (!qi && e.width === 0 && e.height === 0) ||
              (qi &&
                  e.width === 1 &&
                  e.height === 1 &&
                  e.pressure === 0 &&
                  e.detail === 0 &&
                  e.pointerType === 'mouse') ||
              (e.width < 1 && e.height < 1 && e.pressure === 0 && e.detail === 0 && e.pointerType === 'touch');
}
function nr(e, t) {
    const n = ['mouse', 'pen'];
    return (t || n.push('', void 0), n.includes(e));
}
function Gw(e) {
    const t = e.type;
    return t === 'click' || t === 'mousedown' || t === 'keydown' || t === 'keyup';
}
function Bo() {
    return typeof window < 'u';
}
function ot(e) {
    return Da(e) ? (e.nodeName || '').toLowerCase() : '#document';
}
function tt(e) {
    var t;
    return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function qt(e) {
    var t;
    return (t = (Da(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Da(e) {
    return Bo() ? e instanceof Node || e instanceof tt(e).Node : !1;
}
function ve(e) {
    return Bo() ? e instanceof Element || e instanceof tt(e).Element : !1;
}
function Le(e) {
    return Bo() ? e instanceof HTMLElement || e instanceof tt(e).HTMLElement : !1;
}
function Er(e) {
    return !Bo() || typeof ShadowRoot > 'u' ? !1 : e instanceof ShadowRoot || e instanceof tt(e).ShadowRoot;
}
function hs(e) {
    const { overflow: t, overflowX: n, overflowY: r, display: s } = Mt(e);
    return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && s !== 'inline' && s !== 'contents';
}
function qw(e) {
    return /^(table|td|th)$/.test(ot(e));
}
function $o(e) {
    try {
        if (e.matches(':popover-open')) return !0;
    } catch {}
    try {
        return e.matches(':modal');
    } catch {
        return !1;
    }
}
const Qw = /transform|translate|scale|rotate|perspective|filter/,
    Yw = /paint|layout|strict|content/,
    Nn = (e) => !!e && e !== 'none';
let ci;
function Va(e) {
    const t = ve(e) ? Mt(e) : e;
    return (
        Nn(t.transform) ||
        Nn(t.translate) ||
        Nn(t.scale) ||
        Nn(t.rotate) ||
        Nn(t.perspective) ||
        (!Na() && (Nn(t.backdropFilter) || Nn(t.filter))) ||
        Qw.test(t.willChange || '') ||
        Yw.test(t.contain || '')
    );
}
function Xw(e) {
    let t = ln(e);
    for (; Le(t) && !sn(t);) {
        if (Va(t)) return t;
        if ($o(t)) return null;
        t = ln(t);
    }
    return null;
}
function Na() {
    return (
        ci == null && (ci = typeof CSS < 'u' && CSS.supports && CSS.supports('-webkit-backdrop-filter', 'none')),
        ci
    );
}
function sn(e) {
    return /^(html|body|#document)$/.test(ot(e));
}
function Mt(e) {
    return tt(e).getComputedStyle(e);
}
function zo(e) {
    return ve(e)
        ? { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop }
        : { scrollLeft: e.scrollX, scrollTop: e.scrollY };
}
function ln(e) {
    if (ot(e) === 'html') return e;
    const t = e.assignedSlot || e.parentNode || (Er(e) && e.host) || qt(e);
    return Er(t) ? t.host : t;
}
function yf(e) {
    const t = ln(e);
    return sn(t) ? (e.ownerDocument ? e.ownerDocument.body : e.body) : Le(t) && hs(t) ? t : yf(t);
}
function ns(e, t, n) {
    var r;
    (t === void 0 && (t = []), n === void 0 && (n = !0));
    const s = yf(e),
        o = s === ((r = e.ownerDocument) == null ? void 0 : r.body),
        i = tt(s);
    if (o) {
        const a = Qi(i);
        return t.concat(i, i.visualViewport || [], hs(s) ? s : [], a && n ? ns(a) : []);
    } else return t.concat(s, ns(s, [], n));
}
function Qi(e) {
    return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
const Yi = 'data-base-ui-focusable',
    bf =
        "input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])",
    Yn = 'ArrowLeft',
    Xn = 'ArrowRight',
    ja = 'ArrowUp',
    Uo = 'ArrowDown';
function wt(e) {
    let t = e.activeElement;
    for (; t?.shadowRoot?.activeElement != null;) t = t.shadowRoot.activeElement;
    return t;
}
function de(e, t) {
    if (!e || !t) return !1;
    const n = t.getRootNode?.();
    if (e.contains(t)) return !0;
    if (n && Er(n)) {
        let r = t;
        for (; r;) {
            if (e === r) return !0;
            r = r.parentNode || r.host;
        }
    }
    return !1;
}
function Rt(e) {
    return 'composedPath' in e ? e.composedPath()[0] : e.target;
}
function po(e, t) {
    if (!ve(e)) return !1;
    const n = e;
    if (t.hasElement(n)) return !n.hasAttribute('data-trigger-disabled');
    for (const [, r] of t.entries()) if (de(r, n)) return !r.hasAttribute('data-trigger-disabled');
    return !1;
}
function li(e, t) {
    if (t == null) return !1;
    if ('composedPath' in e) return e.composedPath().includes(t);
    const n = e;
    return n.target != null && t.contains(n.target);
}
function Jw(e) {
    return e.matches('html,body');
}
function Ho(e) {
    return Le(e) && e.matches(bf);
}
function Zw(e) {
    return e?.closest(`button,a[href],[role="button"],select,[tabindex]:not([tabindex="-1"]),${bf}`) != null;
}
function Xi(e) {
    return e ? e.getAttribute('role') === 'combobox' && Ho(e) : !1;
}
function eS(e) {
    if (!e || pf) return !0;
    try {
        return e.matches(':focus-visible');
    } catch {
        return !0;
    }
}
function Ji(e) {
    return e ? (e.hasAttribute(Yi) ? e : e.querySelector(`[${Yi}]`) || e) : null;
}
function tS(e, t) {
    return t != null && !nr(t) ? 0 : typeof e == 'function' ? e() : e;
}
function Mr(e, t, n) {
    const r = tS(e, n);
    return typeof r == 'number' ? r : r?.[t];
}
function gl(e) {
    return typeof e == 'function' ? e() : e;
}
function vf(e, t) {
    return t || e === 'click' || e === 'mousedown';
}
function nS(e) {
    return e?.includes('mouse') && e !== 'mousedown';
}
function wf() {}
const rS = Object.freeze([]),
    lt = Object.freeze({}),
    Ba = 'none',
    ps = 'trigger-press',
    St = 'trigger-hover',
    qs = 'trigger-focus',
    Sf = 'outside-press',
    hC = 'item-press',
    pC = 'close-press',
    mC = 'input-change',
    gC = 'input-clear',
    yC = 'input-press',
    $a = 'focus-out',
    za = 'escape-key',
    yl = 'list-navigation',
    bC = 'cancel-open',
    vC = 'sibling-open',
    sS = 'disabled',
    oS = 'imperative-action',
    wC = 'window-resize';
function Ie(e, t, n, r) {
    let s = !1,
        o = !1;
    const i = r ?? lt;
    return {
        reason: e,
        event: t ?? new Event('base-ui'),
        cancel() {
            s = !0;
        },
        allowPropagation() {
            o = !0;
        },
        get isCanceled() {
            return s;
        },
        get isPropagationAllowed() {
            return o;
        },
        trigger: n,
        ...i,
    };
}
function SC(e, t, n) {
    const r = n ?? lt;
    return { reason: e, event: t ?? new Event('base-ui'), ...r };
}
const xf = v.createContext({
    hasProvider: !1,
    timeoutMs: 0,
    delayRef: { current: 0 },
    initialDelayRef: { current: 0 },
    timeout: new cn(),
    currentIdRef: { current: null },
    currentContextRef: { current: null },
});
function iS(e, t) {
    e.current = t.current;
}
function aS(e) {
    const { children: t, delay: n, timeoutMs: r = 0 } = e,
        s = v.useRef(n),
        o = v.useRef(n),
        i = v.useRef(null),
        a = v.useRef(null),
        d = Ut();
    return (
        fe(() => {
            if (((o.current = n), !i.current)) {
                s.current = n;
                return;
            }
            s.current = { open: Mr(s.current, 'open'), close: Mr(n, 'close') };
        }, [n, i, s, o]),
        F.jsx(xf.Provider, {
            value: v.useMemo(
                () => ({
                    hasProvider: !0,
                    delayRef: s,
                    initialDelayRef: o,
                    currentIdRef: i,
                    timeoutMs: r,
                    currentContextRef: a,
                    timeout: d,
                }),
                [r, d]
            ),
            children: t,
        })
    );
}
function cS(e, t = { open: !1 }) {
    const { open: n } = t,
        r = 'rootStore' in e ? e.rootStore : e,
        s = r.useState('floatingId'),
        o = v.useContext(xf),
        {
            currentIdRef: i,
            delayRef: a,
            timeoutMs: d,
            initialDelayRef: u,
            currentContextRef: l,
            hasProvider: c,
            timeout: f,
        } = o,
        [p, h] = v.useState(!1),
        g = v.useRef(n),
        m = v.useRef(!1);
    return (
        fe(() => {
            g.current = n;
        }, [n]),
        fe(
            () => () => {
                m.current = !0;
            },
            []
        ),
        fe(() => {
            function y() {
                (m.current || h(!1),
                    l.current?.setIsInstantPhase(!1),
                    (i.current = null),
                    (l.current = null),
                    (a.current = u.current),
                    f.clear());
            }
            if (i.current && !n && i.current === s) {
                if ((h(!1), d)) {
                    const b = s;
                    return (
                        f.start(d, () => {
                            r.select('open') || (i.current && i.current !== b) || y();
                        }),
                        () => {
                            (g.current || i.current !== b) && f.clear();
                        }
                    );
                }
                y();
            }
        }, [n, s, i, a, d, u, l, f, r]),
        fe(() => {
            if (!n) return;
            const y = l.current,
                b = i.current;
            (f.clear(),
                (l.current = { onOpenChange: r.setOpen, setIsInstantPhase: h }),
                (i.current = s),
                (a.current = { open: 0, close: Mr(u.current, 'close') }),
                b !== null && b !== s
                    ? (h(!0), y?.setIsInstantPhase(!0), y?.onOpenChange(!1, Ie(Ba)))
                    : (h(!1), y?.setIsInstantPhase(!1)));
        }, [n, s, r, i, a, u, l, f]),
        fe(
            () => () => {
                if (i.current === s) {
                    if (((l.current = null), !g.current)) return;
                    ((i.current = null), iS(a, u), f.clear());
                }
            },
            [l, i, a, s, u, f]
        ),
        v.useMemo(() => ({ hasProvider: c, delayRef: a, isInstantPhase: p }), [c, a, p])
    );
}
function xe(e, t, n, r) {
    return (
        e.addEventListener(t, n, r),
        () => {
            e.removeEventListener(t, n, r);
        }
    );
}
function $t(...e) {
    return () => {
        for (let t = 0; t < e.length; t += 1) {
            const n = e[t];
            n && n();
        }
    };
}
function mo(e, t, n, r) {
    const s = Gt(Rf).current;
    return (uS(s, e, t, n, r) && Ef(s, [e, t, n, r]), s.callback);
}
function lS(e) {
    const t = Gt(Rf).current;
    return (dS(t, e) && Ef(t, e), t.callback);
}
function Rf() {
    return { callback: null, cleanup: null, refs: [] };
}
function uS(e, t, n, r, s) {
    return e.refs[0] !== t || e.refs[1] !== n || e.refs[2] !== r || e.refs[3] !== s;
}
function dS(e, t) {
    return e.refs.length !== t.length || e.refs.some((n, r) => n !== t[r]);
}
function Ef(e, t) {
    if (((e.refs = t), t.every((n) => n == null))) {
        e.callback = null;
        return;
    }
    e.callback = (n) => {
        if ((e.cleanup && (e.cleanup(), (e.cleanup = null)), n != null)) {
            const r = Array(t.length).fill(null);
            for (let s = 0; s < t.length; s += 1) {
                const o = t[s];
                if (o != null)
                    switch (typeof o) {
                        case 'function': {
                            const i = o(n);
                            typeof i == 'function' && (r[s] = i);
                            break;
                        }
                        case 'object': {
                            o.current = n;
                            break;
                        }
                    }
            }
            e.cleanup = () => {
                for (let s = 0; s < t.length; s += 1) {
                    const o = t[s];
                    if (o != null)
                        switch (typeof o) {
                            case 'function': {
                                const i = r[s];
                                typeof i == 'function' ? i() : o(null);
                                break;
                            }
                            case 'object': {
                                o.current = null;
                                break;
                            }
                        }
                }
            };
        }
    };
}
function ze(e) {
    const t = Gt(fS, e).current;
    return ((t.next = e), fe(t.effect), t);
}
function fS(e) {
    const t = {
        current: e,
        next: e,
        effect: () => {
            t.current = t.next;
        },
    };
    return t;
}
const Ua = { ...du },
    ui = Ua.useInsertionEffect,
    hS = ui && ui !== Ua.useLayoutEffect ? ui : (e) => e();
function me(e) {
    const t = Gt(pS).current;
    return ((t.next = e), hS(t.effect), t.trampoline);
}
function pS() {
    const e = {
        next: void 0,
        callback: mS,
        trampoline: (...t) => e.callback?.(...t),
        effect: () => {
            e.callback = e.next;
        },
    };
    return e;
}
function mS() {}
const Is = null;
class gS {
    callbacks = [];
    callbacksCount = 0;
    nextId = 1;
    startId = 1;
    isScheduled = !1;
    tick = (t) => {
        this.isScheduled = !1;
        const n = this.callbacks,
            r = this.callbacksCount;
        if (((this.callbacks = []), (this.callbacksCount = 0), (this.startId = this.nextId), r > 0))
            for (let s = 0; s < n.length; s += 1) n[s]?.(t);
    };
    request(t) {
        const n = this.nextId;
        return (
            (this.nextId += 1),
            this.callbacks.push(t),
            (this.callbacksCount += 1),
            !this.isScheduled && (requestAnimationFrame(this.tick), (this.isScheduled = !0)),
            n
        );
    }
    cancel(t) {
        const n = t - this.startId;
        n < 0 || n >= this.callbacks.length || ((this.callbacks[n] = null), (this.callbacksCount -= 1));
    }
}
const Fs = new gS();
class en {
    static create() {
        return new en();
    }
    static request(t) {
        return Fs.request(t);
    }
    static cancel(t) {
        return Fs.cancel(t);
    }
    currentId = Is;
    request(t) {
        (this.cancel(),
            (this.currentId = Fs.request(() => {
                ((this.currentId = Is), t());
            })));
    }
    cancel = () => {
        this.currentId !== Is && (Fs.cancel(this.currentId), (this.currentId = Is));
    };
    disposeEffect = () => this.cancel;
}
function rs() {
    const e = Gt(en.create).current;
    return (La(e.disposeEffect), e);
}
function _e(e) {
    return e?.ownerDocument || document;
}
const Mf = {
        clipPath: 'inset(50%)',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        border: 0,
        padding: 0,
        width: 1,
        height: 1,
        margin: -1,
    },
    yS = { ...Mf, position: 'fixed', top: 0, left: 0 },
    xC = { ...Mf, position: 'absolute' },
    go = v.forwardRef(function (t, n) {
        const [r, s] = v.useState();
        fe(() => {
            Ww && Tr && s('button');
        }, []);
        const o = { tabIndex: 0, role: r };
        return F.jsx('span', {
            ...t,
            ref: n,
            style: yS,
            'aria-hidden': r ? void 0 : !0,
            ...o,
            'data-base-ui-focus-guard': '',
        });
    }),
    bS = ['top', 'right', 'bottom', 'left'],
    Cr = Math.min,
    Tt = Math.max,
    yo = Math.round,
    Hn = Math.floor,
    zt = (e) => ({ x: e, y: e }),
    vS = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
function Zi(e, t, n) {
    return Tt(e, Cr(t, n));
}
function un(e, t) {
    return typeof e == 'function' ? e(t) : e;
}
function Et(e) {
    return e.split('-')[0];
}
function An(e) {
    return e.split('-')[1];
}
function Ha(e) {
    return e === 'x' ? 'y' : 'x';
}
function Wa(e) {
    return e === 'y' ? 'height' : 'width';
}
function At(e) {
    const t = e[0];
    return t === 't' || t === 'b' ? 'y' : 'x';
}
function Ka(e) {
    return Ha(At(e));
}
function wS(e, t, n) {
    n === void 0 && (n = !1);
    const r = An(e),
        s = Ka(e),
        o = Wa(s);
    let i = s === 'x' ? (r === (n ? 'end' : 'start') ? 'right' : 'left') : r === 'start' ? 'bottom' : 'top';
    return (t.reference[o] > t.floating[o] && (i = bo(i)), [i, bo(i)]);
}
function SS(e) {
    const t = bo(e);
    return [ea(e), t, ea(t)];
}
function ea(e) {
    return e.includes('start') ? e.replace('start', 'end') : e.replace('end', 'start');
}
const bl = ['left', 'right'],
    vl = ['right', 'left'],
    xS = ['top', 'bottom'],
    RS = ['bottom', 'top'];
function ES(e, t, n) {
    switch (e) {
        case 'top':
        case 'bottom':
            return n ? (t ? vl : bl) : t ? bl : vl;
        case 'left':
        case 'right':
            return t ? xS : RS;
        default:
            return [];
    }
}
function MS(e, t, n, r) {
    const s = An(e);
    let o = ES(Et(e), n === 'start', r);
    return (s && ((o = o.map((i) => i + '-' + s)), t && (o = o.concat(o.map(ea)))), o);
}
function bo(e) {
    const t = Et(e);
    return vS[t] + e.slice(t.length);
}
function CS(e) {
    return { top: 0, right: 0, bottom: 0, left: 0, ...e };
}
function Cf(e) {
    return typeof e != 'number' ? CS(e) : { top: e, right: e, bottom: e, left: e };
}
function vo(e) {
    const { x: t, y: n, width: r, height: s } = e;
    return { width: r, height: s, top: n, left: t, right: t + r, bottom: n + s, x: t, y: n };
}
function ks(e, t, n) {
    return Math.floor(e / t) !== n;
}
function wo(e, t) {
    return t < 0 || t >= e.length;
}
function di(e, t) {
    return ht(e.current, { disabledIndices: t });
}
function wl(e, t) {
    return ht(e.current, { decrement: !0, startingIndex: e.current.length, disabledIndices: t });
}
function ht(e, { startingIndex: t = -1, decrement: n = !1, disabledIndices: r, amount: s = 1 } = {}) {
    let o = t;
    do o += n ? -s : s;
    while (o >= 0 && o <= e.length - 1 && So(e, o, r));
    return o;
}
function RC(
    e,
    {
        event: t,
        orientation: n,
        loopFocus: r,
        onLoop: s,
        rtl: o,
        cols: i,
        disabledIndices: a,
        minIndex: d,
        maxIndex: u,
        prevIndex: l,
        stopEvent: c = !1,
    }
) {
    let f = l,
        p;
    if ((t.key === ja ? (p = 'up') : t.key === Uo && (p = 'down'), p)) {
        const h = [],
            g = [];
        let m = !1,
            y = 0;
        {
            let P = null,
                I = -1;
            e.forEach((V, A) => {
                if (V == null) return;
                y += 1;
                const O = V.closest('[role="row"]');
                (O && (m = !0), (O !== P || I === -1) && ((P = O), (I += 1), (h[I] = [])), h[I].push(A), (g[A] = I));
            });
        }
        let b = !1,
            R = 0;
        if (m)
            for (const P of h) {
                const I = P.length;
                (I > R && (R = I), I !== i && (b = !0));
            }
        const w = b && y < e.length,
            E = R || i,
            C = (P) => {
                if (!b || l === -1) return;
                const I = g[l];
                if (I == null) return;
                const V = h[I].indexOf(l),
                    A = P === 'up' ? -1 : 1;
                for (let O = I + A, L = 0; L < h.length; L += 1, O += A) {
                    if (O < 0 || O >= h.length) {
                        if (!r || w) return;
                        if (((O = O < 0 ? h.length - 1 : 0), s)) {
                            const _ = Math.min(V, h[O].length - 1),
                                B = h[O][_] ?? h[O][0],
                                N = s(t, l, B);
                            O = g[N] ?? O;
                        }
                    }
                    const k = h[O];
                    for (let _ = Math.min(V, k.length - 1); _ >= 0; _ -= 1) {
                        const B = k[_];
                        if (!So(e, B, a)) return B;
                    }
                }
            },
            M = (P) => {
                if (!w || l === -1) return;
                const I = l % E,
                    V = P === 'up' ? -E : E,
                    A = u - (u % E),
                    O = Hn(u / E) + 1;
                for (let L = l - I + V, k = 0; k < O; k += 1, L += V) {
                    if (L < 0 || L > u) {
                        if (!r) return;
                        L = L < 0 ? A : 0;
                    }
                    const _ = Math.min(L + E - 1, u);
                    for (let B = Math.min(L + I, _); B >= L; B -= 1) if (!So(e, B, a)) return B;
                }
            };
        c && Pt(t);
        const S = C(p) ?? M(p);
        if (S !== void 0) f = S;
        else if (l === -1) f = p === 'up' ? u : d;
        else if (((f = ht(e, { startingIndex: l, amount: E, decrement: p === 'up', disabledIndices: a })), r)) {
            if (p === 'up' && (l - E < d || f < 0)) {
                const P = l % E,
                    I = u % E,
                    V = u - (I - P);
                (I === P ? (f = u) : (f = I > P ? V : V - E), s && (f = s(t, l, f)));
            }
            p === 'down' &&
                l + E > u &&
                ((f = ht(e, { startingIndex: (l % E) - E, amount: E, disabledIndices: a })), s && (f = s(t, l, f)));
        }
        wo(e, f) && (f = l);
    }
    if (n === 'both') {
        const h = Hn(l / i);
        (t.key === (o ? Yn : Xn) &&
            (c && Pt(t),
            l % i !== i - 1
                ? ((f = ht(e, { startingIndex: l, disabledIndices: a })),
                  r &&
                      ks(f, i, h) &&
                      ((f = ht(e, { startingIndex: l - (l % i) - 1, disabledIndices: a })), s && (f = s(t, l, f))))
                : r && ((f = ht(e, { startingIndex: l - (l % i) - 1, disabledIndices: a })), s && (f = s(t, l, f))),
            ks(f, i, h) && (f = l)),
            t.key === (o ? Xn : Yn) &&
                (c && Pt(t),
                l % i !== 0
                    ? ((f = ht(e, { startingIndex: l, decrement: !0, disabledIndices: a })),
                      r &&
                          ks(f, i, h) &&
                          ((f = ht(e, { startingIndex: l + (i - (l % i)), decrement: !0, disabledIndices: a })),
                          s && (f = s(t, l, f))))
                    : r &&
                      ((f = ht(e, { startingIndex: l + (i - (l % i)), decrement: !0, disabledIndices: a })),
                      s && (f = s(t, l, f))),
                ks(f, i, h) && (f = l)));
        const g = Hn(u / i) === h;
        wo(e, f) &&
            (r && g
                ? ((f = t.key === (o ? Xn : Yn) ? u : ht(e, { startingIndex: l - (l % i) - 1, disabledIndices: a })),
                  s && (f = s(t, l, f)))
                : (f = l));
    }
    return f;
}
function So(e, t, n) {
    if (typeof n == 'function' ? n(t) : (n?.includes(t) ?? !1)) return !0;
    const s = e[t];
    return s ? (Wo(s) ? !n && (s.hasAttribute('disabled') || s.getAttribute('aria-disabled') === 'true') : !0) : !1;
}
function PS(e) {
    return e.visibility === 'hidden' || e.visibility === 'collapse';
}
function Wo(e, t = e ? Mt(e) : null) {
    return !e || !e.isConnected || !t || PS(t)
        ? !1
        : typeof e.checkVisibility == 'function'
          ? e.checkVisibility()
          : t.display !== 'none' && t.display !== 'contents';
}
const TS =
    'a[href],button,input,select,textarea,summary,details,iframe,object,embed,[tabindex],[contenteditable]:not([contenteditable="false"]),audio[controls],video[controls]';
function IS(e) {
    const t = e.assignedSlot;
    if (t) return t;
    if (e.parentElement) return e.parentElement;
    const n = e.getRootNode();
    return Er(n) ? n.host : null;
}
function ta(e) {
    for (const t of Array.from(e.children)) if (ot(t) === 'summary') return t;
    return null;
}
function FS(e, t) {
    const n = ta(t);
    return !!n && (e === n || de(n, e));
}
function Pf(e) {
    const t = e ? ot(e) : '';
    return (
        e != null &&
        e.matches(TS) &&
        (t !== 'summary' ||
            (e.parentElement != null && ot(e.parentElement) === 'details' && ta(e.parentElement) === e)) &&
        (t !== 'details' || ta(e) == null) &&
        (t !== 'input' || e.type !== 'hidden')
    );
}
function Tf(e) {
    if (!Pf(e) || !e.isConnected || e.matches(':disabled')) return !1;
    for (let t = e; t; t = IS(t)) {
        const n = t !== e,
            r = ot(t) === 'slot';
        if (
            t.hasAttribute('inert') ||
            (n && ot(t) === 'details' && !t.open && !FS(e, t)) ||
            t.hasAttribute('hidden') ||
            (!r && !kS(t, n))
        )
            return !1;
    }
    return !0;
}
function kS(e, t) {
    const n = Mt(e);
    return t ? n.display !== 'none' : Wo(e, n);
}
function If(e) {
    const t = e.tabIndex;
    if (t < 0) {
        const n = ot(e);
        if (n === 'details' || n === 'audio' || n === 'video' || (Le(e) && e.isContentEditable)) return 0;
    }
    return t;
}
function fi(e) {
    if (ot(e) !== 'input') return null;
    const t = e;
    return t.type === 'radio' && t.name !== '' ? t : null;
}
function OS(e, t) {
    const n = fi(e);
    if (!n) return !0;
    const r = t.find((s) => {
        const o = fi(s);
        return o?.name === n.name && o.form === n.form && o.checked;
    });
    return r
        ? r === n
        : t.find((s) => {
              const o = fi(s);
              return o?.name === n.name && o.form === n.form;
          }) === n;
}
function Ff(e) {
    if (Le(e) && ot(e) === 'slot') {
        const t = e.assignedElements({ flatten: !0 });
        if (t.length > 0) return t;
    }
    return Le(e) && e.shadowRoot ? Array.from(e.shadowRoot.children) : Array.from(e.children);
}
function kf(e, t) {
    Ff(e).forEach((n) => {
        (Pf(n) && t.push(n), kf(n, t));
    });
}
function Of(e, t, n) {
    Ff(e).forEach((r) => {
        (Le(r) && r.matches(t) && n.push(r), Of(r, t, n));
    });
}
function Ga(e) {
    return Tf(e) && If(e) >= 0;
}
function Af(e) {
    const t = [];
    return (kf(e, t), t.filter(Tf));
}
function ms(e) {
    const t = Af(e);
    return t.filter((n) => If(n) >= 0 && OS(n, t));
}
function _f(e, t) {
    const n = ms(e),
        r = n.length;
    if (r === 0) return;
    const s = wt(_e(e)),
        o = n.indexOf(s),
        i = o === -1 ? (t === 1 ? 0 : r - 1) : o + t;
    return n[i];
}
function Lf(e) {
    return _f(_e(e).body, 1) || e;
}
function Df(e) {
    return _f(_e(e).body, -1) || e;
}
function Vf(e, t) {
    if (!e) return null;
    const n = ms(_e(e).body),
        r = n.length;
    if (r === 0) return null;
    const s = n.indexOf(e);
    if (s === -1) return null;
    const o = (s + t + r) % r;
    return n[o];
}
function EC(e) {
    return Vf(e, 1);
}
function MC(e) {
    return Vf(e, -1);
}
function Kr(e, t) {
    const n = t || e.currentTarget,
        r = e.relatedTarget;
    return !r || !de(n, r);
}
function AS(e) {
    ms(e).forEach((n) => {
        ((n.dataset.tabindex = n.getAttribute('tabindex') || ''), n.setAttribute('tabindex', '-1'));
    });
}
function Sl(e) {
    const t = [];
    (Of(e, '[data-tabindex]', t),
        t.forEach((n) => {
            const r = n.dataset.tabindex;
            (delete n.dataset.tabindex, r ? n.setAttribute('tabindex', r) : n.removeAttribute('tabindex'));
        }));
}
function Cn(e, t, n = !0) {
    return e.filter((s) => s.parentId === t).flatMap((s) => [...(!n || s.context?.open ? [s] : []), ...Cn(e, s.id, n)]);
}
function xl(e, t) {
    let n = [],
        r = e.find((s) => s.id === t)?.parentId;
    for (; r;) {
        const s = e.find((o) => o.id === r);
        ((r = s?.parentId), s && (n = n.concat(s)));
    }
    return n;
}
function ss(e) {
    return `data-base-ui-${e}`;
}
let Os = 0;
function Qs(e, t = {}) {
    const { preventScroll: n = !1, sync: r = !1, shouldFocus: s } = t;
    cancelAnimationFrame(Os);
    function o() {
        (s && !s()) || e?.focus({ preventScroll: n });
    }
    if (r) return (o(), wf);
    const i = requestAnimationFrame(o);
    return (
        (Os = i),
        () => {
            Os === i && (cancelAnimationFrame(i), (Os = 0));
        }
    );
}
const hi = { inert: new WeakMap(), 'aria-hidden': new WeakMap() },
    Rl = 'data-base-ui-inert',
    na = { inert: new WeakSet(), 'aria-hidden': new WeakSet() };
let jr = new WeakMap(),
    pi = 0;
function _S(e) {
    return na[e];
}
function Nf(e) {
    return e ? (Er(e) ? e.host : Nf(e.parentNode)) : null;
}
const El = (e, t) =>
        t
            .map((n) => {
                if (e.contains(n)) return n;
                const r = Nf(n);
                return e.contains(r) ? r : null;
            })
            .filter((n) => n != null),
    Ml = (e) => {
        const t = new Set();
        return (
            e.forEach((n) => {
                let r = n;
                for (; r && !t.has(r);) (t.add(r), (r = r.parentNode));
            }),
            t
        );
    },
    Cl = (e, t, n) => {
        const r = [],
            s = (o) => {
                !o ||
                    n.has(o) ||
                    Array.from(o.children).forEach((i) => {
                        ot(i) !== 'script' && (t.has(i) ? s(i) : r.push(i));
                    });
            };
        return (s(e), r);
    };
function LS(e, t, n, r, { mark: s = !0 }) {
    let o = null;
    r ? (o = 'inert') : n && (o = 'aria-hidden');
    let i = null,
        a = null;
    const d = El(t, e),
        u = s ? Cl(t, Ml(d), new Set(d)) : [],
        l = [],
        c = [];
    if (o) {
        const f = hi[o],
            p = _S(o);
        ((a = p), (i = f));
        const h = El(t, Array.from(t.querySelectorAll('[aria-live]'))),
            g = d.concat(h);
        Cl(t, Ml(g), new Set(g)).forEach((y) => {
            const b = y.getAttribute(o),
                R = b !== null && b !== 'false',
                w = (f.get(y) || 0) + 1;
            (f.set(y, w), l.push(y), w === 1 && R && p.add(y), R || y.setAttribute(o, o === 'inert' ? '' : 'true'));
        });
    }
    return (
        s &&
            u.forEach((f) => {
                const p = (jr.get(f) || 0) + 1;
                (jr.set(f, p), c.push(f), p === 1 && f.setAttribute(Rl, ''));
            }),
        (pi += 1),
        () => {
            (i &&
                l.forEach((f) => {
                    const h = (i.get(f) || 0) - 1;
                    (i.set(f, h), h || (!a?.has(f) && o && f.removeAttribute(o), a?.delete(f)));
                }),
                s &&
                    c.forEach((f) => {
                        const p = (jr.get(f) || 0) - 1;
                        (jr.set(f, p), p || f.removeAttribute(Rl));
                    }),
                (pi -= 1),
                pi ||
                    ((hi.inert = new WeakMap()),
                    (hi['aria-hidden'] = new WeakMap()),
                    (na.inert = new WeakSet()),
                    (na['aria-hidden'] = new WeakSet()),
                    (jr = new WeakMap())));
        }
    );
}
function Pl(e, t = {}) {
    const { ariaHidden: n = !1, inert: r = !1, mark: s = !0 } = t,
        o = _e(e[0]).body;
    return LS(e, o, n, r, { mark: s });
}
let Tl = 0;
function DS(e, t = 'mui') {
    const [n, r] = v.useState(e),
        s = e || n;
    return (
        v.useEffect(() => {
            n == null && ((Tl += 1), r(`${t}-${Tl}`));
        }, [n, t]),
        s
    );
}
const Il = Ua.useId;
function gs(e, t) {
    if (Il !== void 0) {
        const n = Il();
        return e ?? (t ? `${t}-${n}` : n);
    }
    return DS(e, t);
}
const VS = parseInt(v.version, 10);
function qa(e) {
    return VS >= e;
}
function Fl(e) {
    if (!v.isValidElement(e)) return null;
    const t = e,
        n = t.props;
    return (qa(19) ? n?.ref : t.ref) ?? null;
}
function ra(e, t) {
    if (e && !t) return e;
    if (!e && t) return t;
    if (e || t) return { ...e, ...t };
}
function NS(e, t) {
    const n = {};
    for (const r in e) {
        const s = e[r];
        if (t?.hasOwnProperty(r)) {
            const o = t[r](s);
            o != null && Object.assign(n, o);
            continue;
        }
        s === !0 ? (n[`data-${r.toLowerCase()}`] = '') : s && (n[`data-${r.toLowerCase()}`] = s.toString());
    }
    return n;
}
function jS(e, t) {
    return typeof e == 'function' ? e(t) : e;
}
function BS(e, t) {
    return typeof e == 'function' ? e(t) : e;
}
const Qa = {};
function wr(e, t, n, r, s) {
    if (!n && !r && !s && !e) return xo(t);
    let o = xo(e);
    return (t && (o = Hr(o, t)), n && (o = Hr(o, n)), r && (o = Hr(o, r)), s && (o = Hr(o, s)), o);
}
function $S(e) {
    if (e.length === 0) return Qa;
    if (e.length === 1) return xo(e[0]);
    let t = xo(e[0]);
    for (let n = 1; n < e.length; n += 1) t = Hr(t, e[n]);
    return t;
}
function xo(e) {
    return Ya(e) ? { ...Bf(e, Qa) } : zS(e);
}
function Hr(e, t) {
    return Ya(t) ? Bf(t, e) : US(e, t);
}
function zS(e) {
    const t = { ...e };
    for (const n in t) {
        const r = t[n];
        jf(n, r) && (t[n] = $f(r));
    }
    return t;
}
function US(e, t) {
    if (!t) return e;
    for (const n in t) {
        const r = t[n];
        switch (n) {
            case 'style': {
                e[n] = ra(e.style, r);
                break;
            }
            case 'className': {
                e[n] = zf(e.className, r);
                break;
            }
            default:
                jf(n, r) ? (e[n] = HS(e[n], r)) : (e[n] = r);
        }
    }
    return e;
}
function jf(e, t) {
    const n = e.charCodeAt(0),
        r = e.charCodeAt(1),
        s = e.charCodeAt(2);
    return n === 111 && r === 110 && s >= 65 && s <= 90 && (typeof t == 'function' || typeof t > 'u');
}
function Ya(e) {
    return typeof e == 'function';
}
function Bf(e, t) {
    return Ya(e) ? e(t) : (e ?? Qa);
}
function HS(e, t) {
    return t
        ? e
            ? (...n) => {
                  const r = n[0];
                  if (Uf(r)) {
                      const o = r;
                      Ro(o);
                      const i = t(...n);
                      return (o.baseUIHandlerPrevented || e?.(...n), i);
                  }
                  const s = t(...n);
                  return (e?.(...n), s);
              }
            : $f(t)
        : e;
}
function $f(e) {
    return (
        e &&
        ((...t) => {
            const n = t[0];
            return (Uf(n) && Ro(n), e(...t));
        })
    );
}
function Ro(e) {
    return (
        (e.preventBaseUIHandler = () => {
            e.baseUIHandlerPrevented = !0;
        }),
        e
    );
}
function zf(e, t) {
    return t ? (e ? t + ' ' + e : t) : e;
}
function Uf(e) {
    return e != null && typeof e == 'object' && 'nativeEvent' in e;
}
function Ir(e, t, n = {}) {
    const r = t.render,
        s = WS(t, n);
    if (n.enabled === !1) return null;
    const o = n.state ?? lt;
    return qS(e, r, s, o);
}
function WS(e, t = {}) {
    const { className: n, style: r, render: s } = e,
        { state: o = lt, ref: i, props: a, stateAttributesMapping: d, enabled: u = !0 } = t,
        l = u ? jS(n, o) : void 0,
        c = u ? BS(r, o) : void 0,
        f = u ? NS(o, d) : lt,
        p = u && a ? KS(a) : void 0,
        h = u ? (ra(f, p) ?? {}) : lt;
    return (
        typeof document < 'u' &&
            (u
                ? Array.isArray(i)
                    ? (h.ref = lS([h.ref, Fl(s), ...i]))
                    : (h.ref = mo(h.ref, Fl(s), i))
                : mo(null, null)),
        u ? (l !== void 0 && (h.className = zf(h.className, l)), c !== void 0 && (h.style = ra(h.style, c)), h) : lt
    );
}
function KS(e) {
    return Array.isArray(e) ? $S(e) : wr(void 0, e);
}
const GS = Symbol.for('react.lazy');
function qS(e, t, n, r) {
    if (t) {
        if (typeof t == 'function') return t(n, r);
        const s = wr(n, t.props);
        s.ref = n.ref;
        let o = t;
        return (o?.$$typeof === GS && (o = v.Children.toArray(t)[0]), v.cloneElement(o, s));
    }
    if (e && typeof e == 'string') return QS(e, n);
    throw new Error(ir(8));
}
function QS(e, t) {
    return e === 'button'
        ? v.createElement('button', { type: 'button', ...t, key: t.key })
        : e === 'img'
          ? v.createElement('img', { alt: '', ...t, key: t.key })
          : v.createElement(e, t);
}
const CC = 500,
    PC = 500,
    YS = { style: { transition: 'none' } },
    XS = 'data-base-ui-click-trigger',
    TC = { fallbackAxisSide: 'none' },
    JS = { fallbackAxisSide: 'end' },
    ZS = { clipPath: 'inset(50%)', position: 'fixed', top: 0, left: 0 },
    Hf = v.createContext(null),
    Wf = () => v.useContext(Hf),
    ex = ss('portal');
function Kf(e = {}) {
    const { ref: t, container: n, componentProps: r = lt, elementProps: s } = e,
        o = gs(),
        a = Wf()?.portalNode,
        [d, u] = v.useState(null),
        [l, c] = v.useState(null),
        f = me((m) => {
            m !== null && c(m);
        }),
        p = v.useRef(null);
    fe(() => {
        if (n === null) {
            p.current && ((p.current = null), c(null), u(null));
            return;
        }
        if (o == null) return;
        const m = (n && (Da(n) ? n : n.current)) ?? a ?? document.body;
        if (m == null) {
            p.current && ((p.current = null), c(null), u(null));
            return;
        }
        p.current !== m && ((p.current = m), c(null), u(m));
    }, [n, a, o]);
    const h = Ir('div', r, { ref: [t, f], props: [{ id: o, [ex]: '' }, s] });
    return { portalNode: l, portalSubtree: d && h ? Pn.createPortal(h, d) : null };
}
const IC = v.forwardRef(function (t, n) {
    const { render: r, className: s, style: o, children: i, container: a, renderGuards: d, ...u } = t,
        { portalNode: l, portalSubtree: c } = Kf({ container: a, ref: n, componentProps: t, elementProps: u }),
        f = v.useRef(null),
        p = v.useRef(null),
        h = v.useRef(null),
        g = v.useRef(null),
        [m, y] = v.useState(null),
        b = v.useRef(!1),
        R = m?.modal,
        w = m?.open,
        E = typeof d == 'boolean' ? d : !!m && !m.modal && m.open && !!l;
    (v.useEffect(() => {
        if (!l || R) return;
        function M(S) {
            l &&
                S.relatedTarget &&
                Kr(S) &&
                (S.type === 'focusin' ? b.current && (Sl(l), (b.current = !1)) : (AS(l), (b.current = !0)));
        }
        return $t(xe(l, 'focusin', M, !0), xe(l, 'focusout', M, !0));
    }, [l, R]),
        fe(() => {
            !l || w !== !0 || !b.current || (Sl(l), (b.current = !1));
        }, [w, l]));
    const C = v.useMemo(
        () => ({
            beforeOutsideRef: f,
            afterOutsideRef: p,
            beforeInsideRef: h,
            afterInsideRef: g,
            portalNode: l,
            setFocusManagerState: y,
        }),
        [l]
    );
    return F.jsxs(v.Fragment, {
        children: [
            c,
            F.jsxs(Hf.Provider, {
                value: C,
                children: [
                    E &&
                        l &&
                        F.jsx(go, {
                            'data-type': 'outside',
                            ref: f,
                            onFocus: (M) => {
                                if (Kr(M, l)) h.current?.focus();
                                else {
                                    const S = m ? m.domReference : null;
                                    Df(S)?.focus();
                                }
                            },
                        }),
                    E && l && F.jsx('span', { 'aria-owns': l.id, style: ZS }),
                    l && Pn.createPortal(i, l),
                    E &&
                        l &&
                        F.jsx(go, {
                            'data-type': 'outside',
                            ref: p,
                            onFocus: (M) => {
                                if (Kr(M, l)) g.current?.focus();
                                else {
                                    const S = m ? m.domReference : null;
                                    (Lf(S)?.focus(), m?.closeOnFocusOut && m?.onOpenChange(!1, Ie($a, M.nativeEvent)));
                                }
                            },
                        }),
                ],
            }),
        ],
    });
});
function Gf() {
    const e = new Map();
    return {
        emit(t, n) {
            e.get(t)?.forEach((r) => r(n));
        },
        on(t, n) {
            (e.has(t) || e.set(t, new Set()), e.get(t).add(n));
        },
        off(t, n) {
            e.get(t)?.delete(n);
        },
    };
}
class tx {
    nodesRef = { current: [] };
    events = Gf();
    addNode(t) {
        this.nodesRef.current.push(t);
    }
    removeNode(t) {
        const n = this.nodesRef.current.findIndex((r) => r === t);
        n !== -1 && this.nodesRef.current.splice(n, 1);
    }
}
const qf = v.createContext(null),
    Qf = v.createContext(null),
    Fr = () => v.useContext(qf)?.id || null,
    ar = (e) => {
        const t = v.useContext(Qf);
        return e ?? t;
    };
function FC(e) {
    const t = gs(),
        n = ar(e),
        r = Fr();
    return (
        fe(() => {
            if (!t) return;
            const s = { id: t, parentId: r };
            return (
                n?.addNode(s),
                () => {
                    n?.removeNode(s);
                }
            );
        }, [n, t, r]),
        t
    );
}
function kC(e) {
    const { children: t, id: n } = e,
        r = Fr();
    return F.jsx(qf.Provider, { value: v.useMemo(() => ({ id: n, parentId: r }), [n, r]), children: t });
}
function OC(e) {
    const { children: t, externalTree: n } = e,
        r = Gt(() => n ?? new tx()).current;
    return F.jsx(Qf.Provider, { value: r, children: t });
}
function Zt(e) {
    return e == null ? e : 'current' in e ? e.current : e;
}
function nx(e, t) {
    const n = tt(Rt(e));
    return e instanceof n.KeyboardEvent
        ? 'keyboard'
        : e instanceof n.FocusEvent
          ? t || 'keyboard'
          : 'pointerType' in e
            ? e.pointerType || 'keyboard'
            : 'touches' in e
              ? 'touch'
              : e instanceof n.MouseEvent
                ? t || (e.detail === 0 ? 'keyboard' : 'mouse')
                : '';
}
const kl = 20;
let xn = [];
function Xa() {
    xn = xn.filter((e) => e.deref()?.isConnected);
}
function Ol(e) {
    (Xa(), e && ot(e) !== 'body' && (xn.push(new WeakRef(e)), xn.length > kl && (xn = xn.slice(-kl))));
}
function Al() {
    return (Xa(), xn[xn.length - 1]?.deref());
}
function rx(e) {
    return e ? (Ga(e) ? e : ms(e)[0] || e) : null;
}
function _l(e) {
    if ((e.hasAttribute('tabindex') && !e.hasAttribute('data-tabindex')) || !e.getAttribute('role')?.includes('dialog'))
        return;
    const n = Af(e).filter((s) => {
            const o = s.getAttribute('data-tabindex') || '';
            return Ga(s) || (s.hasAttribute('data-tabindex') && !o.startsWith('-'));
        }),
        r = e.getAttribute('tabindex');
    n.length === 0
        ? r !== '0' && (e.setAttribute('tabindex', '0'), e.setAttribute('data-tabindex', '0'))
        : (r !== '-1' || (e.hasAttribute('data-tabindex') && e.getAttribute('data-tabindex') !== '-1')) &&
          (e.setAttribute('tabindex', '-1'), e.setAttribute('data-tabindex', '-1'));
}
function AC(e) {
    const {
            context: t,
            children: n,
            disabled: r = !1,
            initialFocus: s = !0,
            returnFocus: o = !0,
            restoreFocus: i = !1,
            modal: a = !0,
            closeOnFocusOut: d = !0,
            openInteractionType: u = '',
            nextFocusableElement: l,
            previousFocusableElement: c,
            beforeContentFocusGuardRef: f,
            externalTree: p,
            getInsideElements: h,
        } = e,
        g = 'rootStore' in t ? t.rootStore : t,
        m = g.useState('open'),
        y = g.useState('domReferenceElement'),
        b = g.useState('floatingElement'),
        { events: R, dataRef: w } = g.context,
        E = me(() => w.current.floatingContext?.nodeId),
        C = s === !1,
        M = Xi(y) && C,
        S = ze(s),
        P = ze(o),
        I = ze(u),
        V = ze(m),
        A = ar(p),
        O = Wf(),
        L = v.useRef(!1),
        k = v.useRef(!1),
        _ = v.useRef(!1),
        B = v.useRef(null),
        N = v.useRef(''),
        U = v.useRef(''),
        D = v.useRef(null),
        X = v.useRef(null),
        Z = mo(D, f, O?.beforeInsideRef),
        Y = mo(X, O?.afterInsideRef),
        Q = Ut(),
        H = Ut(),
        q = rs(),
        pe = O != null,
        z = Ji(b),
        J = me((W = z) => (W ? ms(W) : [])),
        ge = me(() => h?.().filter((W) => W != null) ?? []);
    (v.useEffect(() => {
        if (r || !a) return;
        function W(ue) {
            ue.key === 'Tab' && de(z, wt(_e(z))) && J().length === 0 && !M && Pt(ue);
        }
        const ie = _e(z);
        return xe(ie, 'keydown', W);
    }, [r, z, a, M, J]),
        v.useEffect(() => {
            if (r || !m) return;
            const W = _e(z);
            function ie() {
                _.current = !1;
            }
            function ue(Ee) {
                const re = Rt(Ee),
                    ce = ge(),
                    ee = de(b, re) || de(y, re) || de(O?.portalNode, re) || ce.some((ye) => ye === re || de(ye, re));
                ((_.current = !ee),
                    (U.current = Ee.pointerType || 'keyboard'),
                    re?.closest(`[${XS}]`) &&
                        ((k.current = !0),
                        H.start(0, () => {
                            k.current = !1;
                        })));
            }
            function Ce() {
                U.current = 'keyboard';
            }
            return $t(
                xe(W, 'pointerdown', ue, !0),
                xe(W, 'pointerup', ie, !0),
                xe(W, 'pointercancel', ie, !0),
                xe(W, 'keydown', Ce, !0),
                ie
            );
        }, [r, b, y, z, m, O, H, ge]),
        v.useEffect(() => {
            if (r || !d) return;
            const W = _e(z);
            function ie() {
                ((k.current = !0),
                    H.start(0, () => {
                        k.current = !1;
                    }));
            }
            function ue(ce) {
                const ee = Rt(ce);
                Ga(ee) && (B.current = ee);
            }
            function Ce(ce) {
                const ee = ce.relatedTarget,
                    ye = ce.currentTarget,
                    ke = Rt(ce);
                (a && ee == null && ke != null && de(b, ke) && Ol(ke),
                    queueMicrotask(() => {
                        const ae = E(),
                            Ve = g.context.triggerElements,
                            $ = ge(),
                            j =
                                ee?.hasAttribute(ss('focus-guard')) &&
                                [
                                    D.current,
                                    X.current,
                                    O?.beforeInsideRef.current,
                                    O?.afterInsideRef.current,
                                    O?.beforeOutsideRef.current,
                                    O?.afterOutsideRef.current,
                                    Zt(c),
                                    Zt(l),
                                ].includes(ee),
                            se = !(
                                de(y, ee) ||
                                de(b, ee) ||
                                de(ee, b) ||
                                de(O?.portalNode, ee) ||
                                $.some((G) => G === ee || de(G, ee)) ||
                                (ee != null && Ve.hasElement(ee)) ||
                                Ve.hasMatchingElement((G) => de(G, ee)) ||
                                j ||
                                (A &&
                                    (Cn(A.nodesRef.current, ae).find(
                                        (G) =>
                                            de(G.context?.elements.floating, ee) ||
                                            de(G.context?.elements.domReference, ee)
                                    ) ||
                                        xl(A.nodesRef.current, ae).find(
                                            (G) =>
                                                [
                                                    G.context?.elements.floating,
                                                    Ji(G.context?.elements.floating),
                                                ].includes(ee) || G.context?.elements.domReference === ee
                                        )))
                            );
                        if ((ye === y && z && _l(z), i && ye !== y && !Wo(ke) && wt(W) === W.body)) {
                            if (Le(z) && (z.focus(), i === 'popup')) {
                                q.request(() => {
                                    z.focus();
                                });
                                return;
                            }
                            const G = J(),
                                he = B.current,
                                ut = (he && G.includes(he) ? he : null) || G[G.length - 1] || z;
                            Le(ut) && ut.focus();
                        }
                        if (w.current.insideReactTree) {
                            w.current.insideReactTree = !1;
                            return;
                        }
                        (M || !a) &&
                            ee &&
                            se &&
                            !k.current &&
                            (M || ee !== Al()) &&
                            ((L.current = !0), g.setOpen(!1, Ie($a, ce)));
                    }));
            }
            function Ee() {
                _.current ||
                    ((w.current.insideReactTree = !0),
                    Q.start(0, () => {
                        w.current.insideReactTree = !1;
                    }));
            }
            const re = Le(y) ? y : null;
            if (!(!b && !re))
                return $t(
                    re && xe(re, 'focusout', Ce),
                    re && xe(re, 'pointerdown', ie),
                    b && xe(b, 'focusin', ue),
                    b && xe(b, 'focusout', Ce),
                    b && O && xe(b, 'focusout', Ee, !0)
                );
        }, [r, y, b, z, a, A, O, g, d, i, J, M, E, w, Q, H, q, l, c, ge]),
        v.useEffect(() => {
            if (r || !b || !m) return;
            const W = Array.from(O?.portalNode?.querySelectorAll(`[${ss('portal')}]`) || []),
                ue = (A ? xl(A.nodesRef.current, E()) : []).find((ye) => Xi(ye.context?.elements.domReference || null))
                    ?.context?.elements.domReference,
                Ee = [
                    ...[
                        b,
                        ...W,
                        D.current,
                        X.current,
                        O?.beforeOutsideRef.current,
                        O?.afterOutsideRef.current,
                        ...ge(),
                    ],
                    ue,
                    Zt(c),
                    Zt(l),
                    M ? y : null,
                ].filter((ye) => ye != null),
                re = Pl(Ee, { ariaHidden: a || M, mark: !1 }),
                ce = [b, ...W].filter((ye) => ye != null),
                ee = Pl(ce);
            return () => {
                (ee(), re());
            };
        }, [m, r, y, b, a, O, M, A, E, l, c, ge]),
        fe(() => {
            if (!m || r || !Le(z)) return;
            const W = _e(z),
                ie = wt(W);
            queueMicrotask(() => {
                const ue = S.current,
                    Ce = typeof ue == 'function' ? ue(I.current || '') : ue;
                if (Ce === void 0 || Ce === !1 || de(z, ie)) return;
                let re = null;
                const ce = () => (re == null && (re = J(z)), re[0] || z);
                let ee;
                (Ce === !0 || Ce === null ? (ee = ce()) : (ee = Zt(Ce)), (ee = ee || ce()));
                const ye = de(z, wt(W));
                Qs(ee, {
                    preventScroll: ee === z,
                    shouldFocus() {
                        if (!V.current) return !1;
                        if (ye) return !0;
                        const ke = wt(W);
                        return !(ke !== ee && de(z, ke));
                    },
                });
            });
        }, [r, m, z, J, S, I, V]),
        fe(() => {
            if (r || !z) return;
            const W = _e(z),
                ie = wt(W),
                ue = I.current == null;
            Ol(ie);
            function Ce(re) {
                if (
                    (re.open || (N.current = nx(re.nativeEvent, U.current)),
                    re.reason === St && re.nativeEvent.type === 'mouseleave' && (L.current = !0),
                    re.reason === Sf)
                )
                    if (re.nested) L.current = !1;
                    else if (mf(re.nativeEvent) || gf(re.nativeEvent)) L.current = !1;
                    else {
                        let ce = !1;
                        (_e(z)
                            .createElement('div')
                            .focus({
                                get preventScroll() {
                                    return ((ce = !0), !1);
                                },
                            }),
                            ce ? (L.current = !1) : (L.current = !0));
                    }
            }
            R.on('openchange', Ce);
            function Ee() {
                const re = P.current;
                let ce = typeof re == 'function' ? re(N.current) : re;
                if (ce === void 0 || ce === !1) return null;
                ce === null && (ce = !0);
                const ee = y?.isConnected ? y : null,
                    ye = ie?.isConnected && ot(ie) !== 'body' ? ie : null;
                let ke = ue ? ye || ee : ee || ye;
                return (ke || (ke = Al() || null), typeof ce == 'boolean' ? ke : Zt(ce) || ke || null);
            }
            return () => {
                R.off('openchange', Ce);
                const re = wt(W),
                    ce = ge(),
                    ee =
                        de(b, re) ||
                        ce.some((ae) => ae === re || de(ae, re)) ||
                        (A && Cn(A.nodesRef.current, E(), !1).some((ae) => de(ae.context?.elements.floating, re))),
                    ye = P.current,
                    ke = Ee();
                queueMicrotask(() => {
                    const ae = rx(ke),
                        Ve = typeof ye != 'boolean';
                    (ye &&
                        !L.current &&
                        Le(ae) &&
                        (!(!Ve && ae !== re && re !== W.body) || ee) &&
                        ae.focus({ preventScroll: !0 }),
                        (L.current = !1));
                });
            };
        }, [r, b, z, P, I, R, A, y, E, ge]),
        fe(() => {
            if (!Tr || m || !b) return;
            const W = wt(_e(b));
            !Le(W) || !Ho(W) || (de(b, W) && W.blur());
        }, [m, b]),
        fe(() => {
            if (!(r || !O))
                return (
                    O.setFocusManagerState({
                        modal: a,
                        closeOnFocusOut: d,
                        open: m,
                        onOpenChange: g.setOpen,
                        domReference: y,
                    }),
                    () => {
                        O.setFocusManagerState(null);
                    }
                );
        }, [r, O, a, m, g, d, y]),
        fe(() => {
            if (!(r || !z))
                return (
                    _l(z),
                    () => {
                        queueMicrotask(Xa);
                    }
                );
        }, [r, z]));
    const we = !r && (a ? !M : !0) && (pe || a);
    return F.jsxs(v.Fragment, {
        children: [
            we &&
                F.jsx(go, {
                    'data-type': 'inside',
                    ref: Z,
                    onFocus: (W) => {
                        if (a) {
                            const ie = J();
                            Qs(ie[ie.length - 1]);
                        } else
                            O?.portalNode &&
                                ((L.current = !1),
                                Kr(W, O.portalNode) ? Lf(y)?.focus() : Zt(c ?? O.beforeOutsideRef)?.focus());
                    },
                }),
            n,
            we &&
                F.jsx(go, {
                    'data-type': 'inside',
                    ref: Y,
                    onFocus: (W) => {
                        a
                            ? Qs(J()[0])
                            : O?.portalNode &&
                              (d && (L.current = !0),
                              Kr(W, O.portalNode) ? Df(y)?.focus() : Zt(l ?? O.afterOutsideRef)?.focus());
                    },
                }),
        ],
    });
}
function _C(e, t = {}) {
    const {
            enabled: n = !0,
            event: r = 'click',
            toggle: s = !0,
            ignoreMouse: o = !1,
            stickIfOpen: i = !0,
            touchOpenDelay: a = 0,
            reason: d = ps,
        } = t,
        u = 'rootStore' in e ? e.rootStore : e,
        l = u.context.dataRef,
        c = v.useRef(void 0),
        f = rs(),
        p = Ut(),
        h = v.useMemo(() => {
            function g(y, b, R, w) {
                const E = Ie(d, b, R);
                y && w === 'touch' && a > 0
                    ? p.start(a, () => {
                          u.setOpen(!0, E);
                      })
                    : u.setOpen(y, E);
            }
            function m(y, b, R) {
                const w = l.current.openEvent,
                    E = u.select('domReferenceElement') !== b;
                return (y && E) || !y || !s ? !0 : w && i ? !R(w.type) : !1;
            }
            return {
                onPointerDown(y) {
                    c.current = y.pointerType;
                },
                onMouseDown(y) {
                    const b = c.current,
                        R = y.nativeEvent,
                        w = u.select('open');
                    if (y.button !== 0 || r === 'click' || (nr(b, !0) && o)) return;
                    const E = m(w, y.currentTarget, (S) => S === 'click' || S === 'mousedown'),
                        C = Rt(R);
                    if (Ho(C)) {
                        g(E, R, C, b);
                        return;
                    }
                    const M = y.currentTarget;
                    f.request(() => {
                        g(E, R, M, b);
                    });
                },
                onClick(y) {
                    if (r === 'mousedown-only') return;
                    const b = c.current;
                    if (r === 'mousedown' && b) {
                        c.current = void 0;
                        return;
                    }
                    if (nr(b, !0) && o) return;
                    const R = u.select('open'),
                        w = m(
                            R,
                            y.currentTarget,
                            (E) => E === 'click' || E === 'mousedown' || E === 'keydown' || E === 'keyup'
                        );
                    g(w, y.nativeEvent, y.currentTarget, b);
                },
                onKeyDown() {
                    c.current = void 0;
                },
            };
        }, [l, r, o, d, u, i, s, f, p, a]);
    return v.useMemo(() => (n ? { reference: h } : lt), [n, h]);
}
function sx(e, t) {
    let n = null,
        r = null,
        s = !1;
    return {
        contextElement: e || void 0,
        getBoundingClientRect() {
            const o = e?.getBoundingClientRect() || { width: 0, height: 0, x: 0, y: 0 },
                i = t.axis === 'x' || t.axis === 'both',
                a = t.axis === 'y' || t.axis === 'both',
                d =
                    ['mouseenter', 'mousemove'].includes(t.dataRef.current.openEvent?.type || '') &&
                    t.pointerType !== 'touch';
            let u = o.width,
                l = o.height,
                c = o.x,
                f = o.y;
            return (
                n == null && t.x && i && (n = o.x - t.x),
                r == null && t.y && a && (r = o.y - t.y),
                (c -= n || 0),
                (f -= r || 0),
                (u = 0),
                (l = 0),
                !s || d
                    ? ((u = t.axis === 'y' ? o.width : 0),
                      (l = t.axis === 'x' ? o.height : 0),
                      (c = i && t.x != null ? t.x : c),
                      (f = a && t.y != null ? t.y : f))
                    : s && !d && ((l = t.axis === 'x' ? o.height : l), (u = t.axis === 'y' ? o.width : u)),
                (s = !0),
                { width: u, height: l, x: c, y: f, top: f, right: c + u, bottom: f + l, left: c }
            );
        },
    };
}
function Ll(e) {
    return e != null && e.clientX != null;
}
function ox(e, t = {}) {
    const { enabled: n = !0, axis: r = 'both' } = t,
        s = 'rootStore' in e ? e.rootStore : e,
        o = s.useState('open'),
        i = s.useState('floatingElement'),
        a = s.useState('domReferenceElement'),
        d = s.context.dataRef,
        u = v.useRef(!1),
        l = v.useRef(null),
        [c, f] = v.useState(),
        [p, h] = v.useState([]),
        g = me((w) => {
            s.set('positionReference', w);
        }),
        m = me((w, E, C) => {
            u.current ||
                (d.current.openEvent && !Ll(d.current.openEvent)) ||
                s.set('positionReference', sx(C ?? a, { x: w, y: E, axis: r, dataRef: d, pointerType: c }));
        }),
        y = me((w) => {
            o
                ? l.current || (m(w.clientX, w.clientY, w.currentTarget), h([]))
                : m(w.clientX, w.clientY, w.currentTarget);
        }),
        b = nr(c) ? i : o;
    (v.useEffect(() => {
        if (!n) {
            g(a);
            return;
        }
        if (!b) return;
        function w() {
            (l.current?.(), (l.current = null));
        }
        const E = tt(i);
        function C(M) {
            const S = Rt(M);
            de(i, S) ? w() : m(M.clientX, M.clientY);
        }
        return (!d.current.openEvent || Ll(d.current.openEvent) ? (l.current = xe(E, 'mousemove', C)) : g(a), w);
    }, [b, n, i, d, a, s, m, g, p]),
        v.useEffect(
            () => () => {
                s.set('positionReference', null);
            },
            [s]
        ),
        v.useEffect(() => {
            n && !i && (u.current = !1);
        }, [n, i]),
        v.useEffect(() => {
            !n && o && (u.current = !0);
        }, [n, o]));
    const R = v.useMemo(() => {
        function w(E) {
            f(E.pointerType);
        }
        return { onPointerDown: w, onPointerEnter: w, onMouseMove: y, onMouseEnter: y };
    }, [y]);
    return v.useMemo(() => (n ? { reference: R, trigger: R } : {}), [n, R]);
}
function ix() {
    return !1;
}
function ax(e) {
    return {
        escapeKey: typeof e == 'boolean' ? e : (e?.escapeKey ?? !1),
        outsidePress: typeof e == 'boolean' ? e : (e?.outsidePress ?? !0),
    };
}
function cx(e, t = {}) {
    const {
            enabled: n = !0,
            escapeKey: r = !0,
            outsidePress: s = !0,
            outsidePressEvent: o = 'sloppy',
            referencePress: i = ix,
            bubbles: a,
            externalTree: d,
        } = t,
        u = 'rootStore' in e ? e.rootStore : e,
        l = u.useState('open'),
        c = u.useState('floatingElement'),
        { dataRef: f } = u.context,
        p = ar(d),
        h = me(typeof s == 'function' ? s : () => !1),
        g = typeof s == 'function' ? h : s,
        m = g !== !1,
        y = me(() => o),
        { escapeKey: b, outsidePress: R } = ax(a),
        w = v.useRef(!1),
        E = v.useRef(!1),
        C = v.useRef(!1),
        M = v.useRef(!1),
        S = v.useRef(''),
        P = v.useRef(null),
        I = Ut(),
        V = Ut(),
        A = me(() => {
            (V.clear(), (f.current.insideReactTree = !1));
        }),
        O = me((Z) => {
            const Y = f.current.floatingContext?.nodeId;
            return (p ? Cn(p.nodesRef.current, Y) : []).some((H) => H.context?.open && !H.context.dataRef.current[Z]);
        }),
        L = me((Z) => li(Z, u.select('floatingElement')) || li(Z, u.select('domReferenceElement'))),
        k = me((Z) => {
            i() && u.setOpen(!1, Ie(ps, Z.nativeEvent));
        }),
        _ = me((Z) => {
            if (!l || !n || !r || Z.key !== 'Escape' || M.current || (!b && O('__escapeKeyBubbles'))) return;
            const Y = Kw(Z) ? Z.nativeEvent : Z,
                Q = Ie(za, Y);
            (u.setOpen(!1, Q),
                Q.isCanceled || Z.preventDefault(),
                !b && !Q.isPropagationAllowed && Z.stopPropagation());
        }),
        B = me(() => {
            ((f.current.insideReactTree = !0), V.start(0, A));
        }),
        N = me((Z) => {
            if (!l || !n || Z.button !== 0) return;
            const Y = Rt(Z.nativeEvent);
            de(u.select('floatingElement'), Y) && (w.current || ((w.current = !0), (E.current = !1)));
        }),
        U = me((Z) => {
            !l || !n || ((Z.defaultPrevented || Z.nativeEvent.defaultPrevented) && w.current && (E.current = !0));
        });
    (v.useEffect(() => {
        if (!l || !n) return;
        ((f.current.__escapeKeyBubbles = b), (f.current.__outsidePressBubbles = R));
        const Z = new cn(),
            Y = new cn();
        function Q() {
            (Z.clear(), (M.current = !0));
        }
        function H() {
            Z.start(Tr ? 5 : 0, () => {
                M.current = !1;
            });
        }
        function q() {
            ((C.current = !0),
                Y.start(0, () => {
                    C.current = !1;
                }));
        }
        function pe() {
            ((w.current = !1), (E.current = !1));
        }
        function z() {
            const $ = S.current,
                j = $ === 'pen' || !$ ? 'mouse' : $,
                se = y(),
                G = typeof se == 'function' ? se() : se;
            return typeof G == 'string' ? G : G[j];
        }
        function J($) {
            const j = z();
            return (j === 'intentional' && $.type !== 'click') || (j === 'sloppy' && $.type === 'click');
        }
        function ge($) {
            const j = f.current.floatingContext?.nodeId,
                se = p && Cn(p.nodesRef.current, j).some((G) => li($, G.context?.elements.floating));
            return L($) || se;
        }
        function we($) {
            if (J($)) {
                ($.type !== 'click' && !L($) && (Y.clear(), (C.current = !1)), A());
                return;
            }
            if (f.current.insideReactTree) {
                A();
                return;
            }
            const j = Rt($),
                se = `[${ss('inert')}]`,
                G = ve(j) ? j.getRootNode() : null,
                he = Array.from((Er(G) ? G : _e(u.select('floatingElement'))).querySelectorAll(se)),
                ut = u.context.triggerElements;
            if (j && (ut.hasElement(j) || ut.hasMatchingElement((He) => de(He, j)))) return;
            let Ue = ve(j) ? j : null;
            for (; Ue && !sn(Ue);) {
                const He = ln(Ue);
                if (sn(He) || !ve(He)) break;
                Ue = He;
            }
            if (!(
                he.length &&
                ve(j) &&
                !Jw(j) &&
                !de(j, u.select('floatingElement')) &&
                he.every((He) => !de(Ue, He))
            )) {
                if (Le(j) && !('touches' in $)) {
                    const He = sn(j),
                        nt = Mt(j),
                        It = /auto|scroll/,
                        cr = He || It.test(nt.overflowX),
                        _n = He || It.test(nt.overflowY),
                        Ln = cr && j.clientWidth > 0 && j.scrollWidth > j.clientWidth,
                        lr = _n && j.clientHeight > 0 && j.scrollHeight > j.clientHeight,
                        hn = nt.direction === 'rtl',
                        Se = lr && (hn ? $.offsetX <= j.offsetWidth - j.clientWidth : $.offsetX > j.clientWidth),
                        rt = Ln && $.offsetY > j.clientHeight;
                    if (Se || rt) return;
                }
                if (!ge($)) {
                    if (z() === 'intentional' && C.current) {
                        (Y.clear(), (C.current = !1));
                        return;
                    }
                    (typeof g == 'function' && !g($)) || O('__outsidePressBubbles') || (u.setOpen(!1, Ie(Sf, $)), A());
                }
            }
        }
        function W($) {
            z() !== 'sloppy' || $.pointerType === 'touch' || !u.select('open') || !n || L($) || we($);
        }
        function ie($) {
            if (z() !== 'sloppy' || !u.select('open') || !n || L($)) return;
            const j = $.touches[0];
            j &&
                ((P.current = {
                    startTime: Date.now(),
                    startX: j.clientX,
                    startY: j.clientY,
                    dismissOnTouchEnd: !1,
                    dismissOnMouseDown: !0,
                }),
                I.start(1e3, () => {
                    P.current && ((P.current.dismissOnTouchEnd = !1), (P.current.dismissOnMouseDown = !1));
                }));
        }
        function ue($, j) {
            const se = Rt($);
            if (!se) return;
            const G = xe(se, $.type, () => {
                (j($), G());
            });
        }
        function Ce($) {
            ((S.current = 'touch'), ue($, ie));
        }
        function Ee($) {
            (I.clear(),
                $.type === 'pointerdown' && (S.current = $.pointerType),
                !($.type === 'mousedown' && P.current && !P.current.dismissOnMouseDown) &&
                    ue($, (j) => {
                        j.type === 'pointerdown' ? W(j) : we(j);
                    }));
        }
        function re($) {
            if (!w.current) return;
            const j = E.current;
            if ((pe(), z() === 'intentional')) {
                if ($.type === 'pointercancel') {
                    j && q();
                    return;
                }
                if (!ge($)) {
                    if (j) {
                        q();
                        return;
                    }
                    (typeof g == 'function' && !g($)) || (Y.clear(), (C.current = !0), A());
                }
            }
        }
        function ce($) {
            if (z() !== 'sloppy' || !P.current || L($)) return;
            const j = $.touches[0];
            if (!j) return;
            const se = Math.abs(j.clientX - P.current.startX),
                G = Math.abs(j.clientY - P.current.startY),
                he = Math.sqrt(se * se + G * G);
            (he > 5 && (P.current.dismissOnTouchEnd = !0), he > 10 && (we($), I.clear(), (P.current = null)));
        }
        function ee($) {
            ue($, ce);
        }
        function ye($) {
            z() !== 'sloppy' ||
                !P.current ||
                L($) ||
                (P.current.dismissOnTouchEnd && we($), I.clear(), (P.current = null));
        }
        function ke($) {
            ue($, ye);
        }
        const ae = _e(c),
            Ve = $t(
                r && $t(xe(ae, 'keydown', _), xe(ae, 'compositionstart', Q), xe(ae, 'compositionend', H)),
                m &&
                    $t(
                        xe(ae, 'click', Ee, !0),
                        xe(ae, 'pointerdown', Ee, !0),
                        xe(ae, 'pointerup', re, !0),
                        xe(ae, 'pointercancel', re, !0),
                        xe(ae, 'mousedown', Ee, !0),
                        xe(ae, 'mouseup', re, !0),
                        xe(ae, 'touchstart', Ce, !0),
                        xe(ae, 'touchmove', ee, !0),
                        xe(ae, 'touchend', ke, !0)
                    )
            );
        return () => {
            (Ve(), Z.clear(), Y.clear(), pe(), (C.current = !1));
        };
    }, [f, c, r, m, g, l, n, b, R, _, A, y, O, L, p, u, I]),
        v.useEffect(A, [g, A]));
    const D = v.useMemo(() => ({ onKeyDown: _, onPointerDown: k, onClick: k }), [_, k]),
        X = v.useMemo(
            () => ({
                onKeyDown: _,
                onPointerDown: U,
                onMouseDown: U,
                onClickCapture: B,
                onMouseDownCapture(Z) {
                    (B(), N(Z));
                },
                onPointerDownCapture(Z) {
                    (B(), N(Z));
                },
                onMouseUpCapture: B,
                onTouchEndCapture: B,
                onTouchMoveCapture: B,
            }),
            [_, B, N, U]
        );
    return v.useMemo(() => (n ? { reference: D, floating: X, trigger: D } : {}), [n, D, X]);
}
function Dl(e, t, n) {
    let { reference: r, floating: s } = e;
    const o = At(t),
        i = Ka(t),
        a = Wa(i),
        d = Et(t),
        u = o === 'y',
        l = r.x + r.width / 2 - s.width / 2,
        c = r.y + r.height / 2 - s.height / 2,
        f = r[a] / 2 - s[a] / 2;
    let p;
    switch (d) {
        case 'top':
            p = { x: l, y: r.y - s.height };
            break;
        case 'bottom':
            p = { x: l, y: r.y + r.height };
            break;
        case 'right':
            p = { x: r.x + r.width, y: c };
            break;
        case 'left':
            p = { x: r.x - s.width, y: c };
            break;
        default:
            p = { x: r.x, y: r.y };
    }
    switch (An(t)) {
        case 'start':
            p[i] -= f * (n && u ? -1 : 1);
            break;
        case 'end':
            p[i] += f * (n && u ? -1 : 1);
            break;
    }
    return p;
}
async function lx(e, t) {
    var n;
    t === void 0 && (t = {});
    const { x: r, y: s, platform: o, rects: i, elements: a, strategy: d } = e,
        {
            boundary: u = 'clippingAncestors',
            rootBoundary: l = 'viewport',
            elementContext: c = 'floating',
            altBoundary: f = !1,
            padding: p = 0,
        } = un(t, e),
        h = Cf(p),
        m = a[f ? (c === 'floating' ? 'reference' : 'floating') : c],
        y = vo(
            await o.getClippingRect({
                element:
                    (n = await (o.isElement == null ? void 0 : o.isElement(m))) == null || n
                        ? m
                        : m.contextElement ||
                          (await (o.getDocumentElement == null ? void 0 : o.getDocumentElement(a.floating))),
                boundary: u,
                rootBoundary: l,
                strategy: d,
            })
        ),
        b = c === 'floating' ? { x: r, y: s, width: i.floating.width, height: i.floating.height } : i.reference,
        R = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(a.floating)),
        w = (await (o.isElement == null ? void 0 : o.isElement(R)))
            ? (await (o.getScale == null ? void 0 : o.getScale(R))) || { x: 1, y: 1 }
            : { x: 1, y: 1 },
        E = vo(
            o.convertOffsetParentRelativeRectToViewportRelativeRect
                ? await o.convertOffsetParentRelativeRectToViewportRelativeRect({
                      elements: a,
                      rect: b,
                      offsetParent: R,
                      strategy: d,
                  })
                : b
        );
    return {
        top: (y.top - E.top + h.top) / w.y,
        bottom: (E.bottom - y.bottom + h.bottom) / w.y,
        left: (y.left - E.left + h.left) / w.x,
        right: (E.right - y.right + h.right) / w.x,
    };
}
const ux = 50,
    dx = async (e, t, n) => {
        const { placement: r = 'bottom', strategy: s = 'absolute', middleware: o = [], platform: i } = n,
            a = i.detectOverflow ? i : { ...i, detectOverflow: lx },
            d = await (i.isRTL == null ? void 0 : i.isRTL(t));
        let u = await i.getElementRects({ reference: e, floating: t, strategy: s }),
            { x: l, y: c } = Dl(u, r, d),
            f = r,
            p = 0;
        const h = {};
        for (let g = 0; g < o.length; g++) {
            const m = o[g];
            if (!m) continue;
            const { name: y, fn: b } = m,
                {
                    x: R,
                    y: w,
                    data: E,
                    reset: C,
                } = await b({
                    x: l,
                    y: c,
                    initialPlacement: r,
                    placement: f,
                    strategy: s,
                    middlewareData: h,
                    rects: u,
                    platform: a,
                    elements: { reference: e, floating: t },
                });
            ((l = R ?? l),
                (c = w ?? c),
                (h[y] = { ...h[y], ...E }),
                C &&
                    p < ux &&
                    (p++,
                    typeof C == 'object' &&
                        (C.placement && (f = C.placement),
                        C.rects &&
                            (u =
                                C.rects === !0
                                    ? await i.getElementRects({ reference: e, floating: t, strategy: s })
                                    : C.rects),
                        ({ x: l, y: c } = Dl(u, f, d))),
                    (g = -1)));
        }
        return { x: l, y: c, placement: f, strategy: s, middlewareData: h };
    },
    fx = function (e) {
        return (
            e === void 0 && (e = {}),
            {
                name: 'flip',
                options: e,
                async fn(t) {
                    var n, r;
                    const {
                            placement: s,
                            middlewareData: o,
                            rects: i,
                            initialPlacement: a,
                            platform: d,
                            elements: u,
                        } = t,
                        {
                            mainAxis: l = !0,
                            crossAxis: c = !0,
                            fallbackPlacements: f,
                            fallbackStrategy: p = 'bestFit',
                            fallbackAxisSideDirection: h = 'none',
                            flipAlignment: g = !0,
                            ...m
                        } = un(e, t);
                    if ((n = o.arrow) != null && n.alignmentOffset) return {};
                    const y = Et(s),
                        b = At(a),
                        R = Et(a) === a,
                        w = await (d.isRTL == null ? void 0 : d.isRTL(u.floating)),
                        E = f || (R || !g ? [bo(a)] : SS(a)),
                        C = h !== 'none';
                    !f && C && E.push(...MS(a, g, h, w));
                    const M = [a, ...E],
                        S = await d.detectOverflow(t, m),
                        P = [];
                    let I = ((r = o.flip) == null ? void 0 : r.overflows) || [];
                    if ((l && P.push(S[y]), c)) {
                        const L = wS(s, i, w);
                        P.push(S[L[0]], S[L[1]]);
                    }
                    if (((I = [...I, { placement: s, overflows: P }]), !P.every((L) => L <= 0))) {
                        var V, A;
                        const L = (((V = o.flip) == null ? void 0 : V.index) || 0) + 1,
                            k = M[L];
                        if (
                            k &&
                            (!(c === 'alignment' ? b !== At(k) : !1) ||
                                I.every((N) => (At(N.placement) === b ? N.overflows[0] > 0 : !0)))
                        )
                            return { data: { index: L, overflows: I }, reset: { placement: k } };
                        let _ =
                            (A = I.filter((B) => B.overflows[0] <= 0).sort(
                                (B, N) => B.overflows[1] - N.overflows[1]
                            )[0]) == null
                                ? void 0
                                : A.placement;
                        if (!_)
                            switch (p) {
                                case 'bestFit': {
                                    var O;
                                    const B =
                                        (O = I.filter((N) => {
                                            if (C) {
                                                const U = At(N.placement);
                                                return U === b || U === 'y';
                                            }
                                            return !0;
                                        })
                                            .map((N) => [
                                                N.placement,
                                                N.overflows.filter((U) => U > 0).reduce((U, D) => U + D, 0),
                                            ])
                                            .sort((N, U) => N[1] - U[1])[0]) == null
                                            ? void 0
                                            : O[0];
                                    B && (_ = B);
                                    break;
                                }
                                case 'initialPlacement':
                                    _ = a;
                                    break;
                            }
                        if (s !== _) return { reset: { placement: _ } };
                    }
                    return {};
                },
            }
        );
    };
function Vl(e, t) {
    return { top: e.top - t.height, right: e.right - t.width, bottom: e.bottom - t.height, left: e.left - t.width };
}
function Nl(e) {
    return bS.some((t) => e[t] >= 0);
}
const hx = function (e) {
        return (
            e === void 0 && (e = {}),
            {
                name: 'hide',
                options: e,
                async fn(t) {
                    const { rects: n, platform: r } = t,
                        { strategy: s = 'referenceHidden', ...o } = un(e, t);
                    switch (s) {
                        case 'referenceHidden': {
                            const i = await r.detectOverflow(t, { ...o, elementContext: 'reference' }),
                                a = Vl(i, n.reference);
                            return { data: { referenceHiddenOffsets: a, referenceHidden: Nl(a) } };
                        }
                        case 'escaped': {
                            const i = await r.detectOverflow(t, { ...o, altBoundary: !0 }),
                                a = Vl(i, n.floating);
                            return { data: { escapedOffsets: a, escaped: Nl(a) } };
                        }
                        default:
                            return {};
                    }
                },
            }
        );
    },
    Yf = new Set(['left', 'top']);
async function px(e, t) {
    const { placement: n, platform: r, elements: s } = e,
        o = await (r.isRTL == null ? void 0 : r.isRTL(s.floating)),
        i = Et(n),
        a = An(n),
        d = At(n) === 'y',
        u = Yf.has(i) ? -1 : 1,
        l = o && d ? -1 : 1,
        c = un(t, e);
    let {
        mainAxis: f,
        crossAxis: p,
        alignmentAxis: h,
    } = typeof c == 'number'
        ? { mainAxis: c, crossAxis: 0, alignmentAxis: null }
        : { mainAxis: c.mainAxis || 0, crossAxis: c.crossAxis || 0, alignmentAxis: c.alignmentAxis };
    return (
        a && typeof h == 'number' && (p = a === 'end' ? h * -1 : h),
        d ? { x: p * l, y: f * u } : { x: f * u, y: p * l }
    );
}
const mx = function (e) {
        return (
            e === void 0 && (e = 0),
            {
                name: 'offset',
                options: e,
                async fn(t) {
                    var n, r;
                    const { x: s, y: o, placement: i, middlewareData: a } = t,
                        d = await px(t, e);
                    return i === ((n = a.offset) == null ? void 0 : n.placement) &&
                        (r = a.arrow) != null &&
                        r.alignmentOffset
                        ? {}
                        : { x: s + d.x, y: o + d.y, data: { ...d, placement: i } };
                },
            }
        );
    },
    gx = function (e) {
        return (
            e === void 0 && (e = {}),
            {
                name: 'shift',
                options: e,
                async fn(t) {
                    const { x: n, y: r, placement: s, platform: o } = t,
                        {
                            mainAxis: i = !0,
                            crossAxis: a = !1,
                            limiter: d = {
                                fn: (y) => {
                                    let { x: b, y: R } = y;
                                    return { x: b, y: R };
                                },
                            },
                            ...u
                        } = un(e, t),
                        l = { x: n, y: r },
                        c = await o.detectOverflow(t, u),
                        f = At(Et(s)),
                        p = Ha(f);
                    let h = l[p],
                        g = l[f];
                    if (i) {
                        const y = p === 'y' ? 'top' : 'left',
                            b = p === 'y' ? 'bottom' : 'right',
                            R = h + c[y],
                            w = h - c[b];
                        h = Zi(R, h, w);
                    }
                    if (a) {
                        const y = f === 'y' ? 'top' : 'left',
                            b = f === 'y' ? 'bottom' : 'right',
                            R = g + c[y],
                            w = g - c[b];
                        g = Zi(R, g, w);
                    }
                    const m = d.fn({ ...t, [p]: h, [f]: g });
                    return { ...m, data: { x: m.x - n, y: m.y - r, enabled: { [p]: i, [f]: a } } };
                },
            }
        );
    },
    yx = function (e) {
        return (
            e === void 0 && (e = {}),
            {
                options: e,
                fn(t) {
                    const { x: n, y: r, placement: s, rects: o, middlewareData: i } = t,
                        { offset: a = 0, mainAxis: d = !0, crossAxis: u = !0 } = un(e, t),
                        l = { x: n, y: r },
                        c = At(s),
                        f = Ha(c);
                    let p = l[f],
                        h = l[c];
                    const g = un(a, t),
                        m = typeof g == 'number' ? { mainAxis: g, crossAxis: 0 } : { mainAxis: 0, crossAxis: 0, ...g };
                    if (d) {
                        const R = f === 'y' ? 'height' : 'width',
                            w = o.reference[f] - o.floating[R] + m.mainAxis,
                            E = o.reference[f] + o.reference[R] - m.mainAxis;
                        p < w ? (p = w) : p > E && (p = E);
                    }
                    if (u) {
                        var y, b;
                        const R = f === 'y' ? 'width' : 'height',
                            w = Yf.has(Et(s)),
                            E =
                                o.reference[c] -
                                o.floating[R] +
                                ((w && ((y = i.offset) == null ? void 0 : y[c])) || 0) +
                                (w ? 0 : m.crossAxis),
                            C =
                                o.reference[c] +
                                o.reference[R] +
                                (w ? 0 : ((b = i.offset) == null ? void 0 : b[c]) || 0) -
                                (w ? m.crossAxis : 0);
                        h < E ? (h = E) : h > C && (h = C);
                    }
                    return { [f]: p, [c]: h };
                },
            }
        );
    },
    bx = function (e) {
        return (
            e === void 0 && (e = {}),
            {
                name: 'size',
                options: e,
                async fn(t) {
                    var n, r;
                    const { placement: s, rects: o, platform: i, elements: a } = t,
                        { apply: d = () => {}, ...u } = un(e, t),
                        l = await i.detectOverflow(t, u),
                        c = Et(s),
                        f = An(s),
                        p = At(s) === 'y',
                        { width: h, height: g } = o.floating;
                    let m, y;
                    c === 'top' || c === 'bottom'
                        ? ((m = c),
                          (y =
                              f === ((await (i.isRTL == null ? void 0 : i.isRTL(a.floating))) ? 'start' : 'end')
                                  ? 'left'
                                  : 'right'))
                        : ((y = c), (m = f === 'end' ? 'top' : 'bottom'));
                    const b = g - l.top - l.bottom,
                        R = h - l.left - l.right,
                        w = Cr(g - l[m], b),
                        E = Cr(h - l[y], R),
                        C = !t.middlewareData.shift;
                    let M = w,
                        S = E;
                    if (
                        ((n = t.middlewareData.shift) != null && n.enabled.x && (S = R),
                        (r = t.middlewareData.shift) != null && r.enabled.y && (M = b),
                        C && !f)
                    ) {
                        const I = Tt(l.left, 0),
                            V = Tt(l.right, 0),
                            A = Tt(l.top, 0),
                            O = Tt(l.bottom, 0);
                        p
                            ? (S = h - 2 * (I !== 0 || V !== 0 ? I + V : Tt(l.left, l.right)))
                            : (M = g - 2 * (A !== 0 || O !== 0 ? A + O : Tt(l.top, l.bottom)));
                    }
                    await d({ ...t, availableWidth: S, availableHeight: M });
                    const P = await i.getDimensions(a.floating);
                    return h !== P.width || g !== P.height ? { reset: { rects: !0 } } : {};
                },
            }
        );
    };
function Xf(e) {
    const t = Mt(e);
    let n = parseFloat(t.width) || 0,
        r = parseFloat(t.height) || 0;
    const s = Le(e),
        o = s ? e.offsetWidth : n,
        i = s ? e.offsetHeight : r,
        a = yo(n) !== o || yo(r) !== i;
    return (a && ((n = o), (r = i)), { width: n, height: r, $: a });
}
function Ja(e) {
    return ve(e) ? e : e.contextElement;
}
function Sr(e) {
    const t = Ja(e);
    if (!Le(t)) return zt(1);
    const n = t.getBoundingClientRect(),
        { width: r, height: s, $: o } = Xf(t);
    let i = (o ? yo(n.width) : n.width) / r,
        a = (o ? yo(n.height) : n.height) / s;
    return ((!i || !Number.isFinite(i)) && (i = 1), (!a || !Number.isFinite(a)) && (a = 1), { x: i, y: a });
}
const vx = zt(0);
function Jf(e) {
    const t = tt(e);
    return !Na() || !t.visualViewport ? vx : { x: t.visualViewport.offsetLeft, y: t.visualViewport.offsetTop };
}
function wx(e, t, n) {
    return (t === void 0 && (t = !1), !n || (t && n !== tt(e)) ? !1 : t);
}
function rr(e, t, n, r) {
    (t === void 0 && (t = !1), n === void 0 && (n = !1));
    const s = e.getBoundingClientRect(),
        o = Ja(e);
    let i = zt(1);
    t && (r ? ve(r) && (i = Sr(r)) : (i = Sr(e)));
    const a = wx(o, n, r) ? Jf(o) : zt(0);
    let d = (s.left + a.x) / i.x,
        u = (s.top + a.y) / i.y,
        l = s.width / i.x,
        c = s.height / i.y;
    if (o) {
        const f = tt(o),
            p = r && ve(r) ? tt(r) : r;
        let h = f,
            g = Qi(h);
        for (; g && r && p !== h;) {
            const m = Sr(g),
                y = g.getBoundingClientRect(),
                b = Mt(g),
                R = y.left + (g.clientLeft + parseFloat(b.paddingLeft)) * m.x,
                w = y.top + (g.clientTop + parseFloat(b.paddingTop)) * m.y;
            ((d *= m.x), (u *= m.y), (l *= m.x), (c *= m.y), (d += R), (u += w), (h = tt(g)), (g = Qi(h)));
        }
    }
    return vo({ width: l, height: c, x: d, y: u });
}
function Ko(e, t) {
    const n = zo(e).scrollLeft;
    return t ? t.left + n : rr(qt(e)).left + n;
}
function Zf(e, t) {
    const n = e.getBoundingClientRect(),
        r = n.left + t.scrollLeft - Ko(e, n),
        s = n.top + t.scrollTop;
    return { x: r, y: s };
}
function Sx(e) {
    let { elements: t, rect: n, offsetParent: r, strategy: s } = e;
    const o = s === 'fixed',
        i = qt(r),
        a = t ? $o(t.floating) : !1;
    if (r === i || (a && o)) return n;
    let d = { scrollLeft: 0, scrollTop: 0 },
        u = zt(1);
    const l = zt(0),
        c = Le(r);
    if ((c || (!c && !o)) && ((ot(r) !== 'body' || hs(i)) && (d = zo(r)), c)) {
        const p = rr(r);
        ((u = Sr(r)), (l.x = p.x + r.clientLeft), (l.y = p.y + r.clientTop));
    }
    const f = i && !c && !o ? Zf(i, d) : zt(0);
    return {
        width: n.width * u.x,
        height: n.height * u.y,
        x: n.x * u.x - d.scrollLeft * u.x + l.x + f.x,
        y: n.y * u.y - d.scrollTop * u.y + l.y + f.y,
    };
}
function xx(e) {
    return Array.from(e.getClientRects());
}
function Rx(e) {
    const t = qt(e),
        n = zo(e),
        r = e.ownerDocument.body,
        s = Tt(t.scrollWidth, t.clientWidth, r.scrollWidth, r.clientWidth),
        o = Tt(t.scrollHeight, t.clientHeight, r.scrollHeight, r.clientHeight);
    let i = -n.scrollLeft + Ko(e);
    const a = -n.scrollTop;
    return (
        Mt(r).direction === 'rtl' && (i += Tt(t.clientWidth, r.clientWidth) - s),
        { width: s, height: o, x: i, y: a }
    );
}
const jl = 25;
function Ex(e, t) {
    const n = tt(e),
        r = qt(e),
        s = n.visualViewport;
    let o = r.clientWidth,
        i = r.clientHeight,
        a = 0,
        d = 0;
    if (s) {
        ((o = s.width), (i = s.height));
        const l = Na();
        (!l || (l && t === 'fixed')) && ((a = s.offsetLeft), (d = s.offsetTop));
    }
    const u = Ko(r);
    if (u <= 0) {
        const l = r.ownerDocument,
            c = l.body,
            f = getComputedStyle(c),
            p = (l.compatMode === 'CSS1Compat' && parseFloat(f.marginLeft) + parseFloat(f.marginRight)) || 0,
            h = Math.abs(r.clientWidth - c.clientWidth - p);
        h <= jl && (o -= h);
    } else u <= jl && (o += u);
    return { width: o, height: i, x: a, y: d };
}
function Mx(e, t) {
    const n = rr(e, !0, t === 'fixed'),
        r = n.top + e.clientTop,
        s = n.left + e.clientLeft,
        o = Le(e) ? Sr(e) : zt(1),
        i = e.clientWidth * o.x,
        a = e.clientHeight * o.y,
        d = s * o.x,
        u = r * o.y;
    return { width: i, height: a, x: d, y: u };
}
function Bl(e, t, n) {
    let r;
    if (t === 'viewport') r = Ex(e, n);
    else if (t === 'document') r = Rx(qt(e));
    else if (ve(t)) r = Mx(t, n);
    else {
        const s = Jf(e);
        r = { x: t.x - s.x, y: t.y - s.y, width: t.width, height: t.height };
    }
    return vo(r);
}
function eh(e, t) {
    const n = ln(e);
    return n === t || !ve(n) || sn(n) ? !1 : Mt(n).position === 'fixed' || eh(n, t);
}
function Cx(e, t) {
    const n = t.get(e);
    if (n) return n;
    let r = ns(e, [], !1).filter((a) => ve(a) && ot(a) !== 'body'),
        s = null;
    const o = Mt(e).position === 'fixed';
    let i = o ? ln(e) : e;
    for (; ve(i) && !sn(i);) {
        const a = Mt(i),
            d = Va(i);
        (!d && a.position === 'fixed' && (s = null),
            (
                o
                    ? !d && !s
                    : (!d && a.position === 'static' && !!s && (s.position === 'absolute' || s.position === 'fixed')) ||
                      (hs(i) && !d && eh(e, i))
            )
                ? (r = r.filter((l) => l !== i))
                : (s = a),
            (i = ln(i)));
    }
    return (t.set(e, r), r);
}
function Px(e) {
    let { element: t, boundary: n, rootBoundary: r, strategy: s } = e;
    const i = [...(n === 'clippingAncestors' ? ($o(t) ? [] : Cx(t, this._c)) : [].concat(n)), r],
        a = Bl(t, i[0], s);
    let d = a.top,
        u = a.right,
        l = a.bottom,
        c = a.left;
    for (let f = 1; f < i.length; f++) {
        const p = Bl(t, i[f], s);
        ((d = Tt(p.top, d)), (u = Cr(p.right, u)), (l = Cr(p.bottom, l)), (c = Tt(p.left, c)));
    }
    return { width: u - c, height: l - d, x: c, y: d };
}
function Tx(e) {
    const { width: t, height: n } = Xf(e);
    return { width: t, height: n };
}
function Ix(e, t, n) {
    const r = Le(t),
        s = qt(t),
        o = n === 'fixed',
        i = rr(e, !0, o, t);
    let a = { scrollLeft: 0, scrollTop: 0 };
    const d = zt(0);
    function u() {
        d.x = Ko(s);
    }
    if (r || (!r && !o))
        if (((ot(t) !== 'body' || hs(s)) && (a = zo(t)), r)) {
            const p = rr(t, !0, o, t);
            ((d.x = p.x + t.clientLeft), (d.y = p.y + t.clientTop));
        } else s && u();
    o && !r && s && u();
    const l = s && !r && !o ? Zf(s, a) : zt(0),
        c = i.left + a.scrollLeft - d.x - l.x,
        f = i.top + a.scrollTop - d.y - l.y;
    return { x: c, y: f, width: i.width, height: i.height };
}
function mi(e) {
    return Mt(e).position === 'static';
}
function $l(e, t) {
    if (!Le(e) || Mt(e).position === 'fixed') return null;
    if (t) return t(e);
    let n = e.offsetParent;
    return (qt(e) === n && (n = n.ownerDocument.body), n);
}
function th(e, t) {
    const n = tt(e);
    if ($o(e)) return n;
    if (!Le(e)) {
        let s = ln(e);
        for (; s && !sn(s);) {
            if (ve(s) && !mi(s)) return s;
            s = ln(s);
        }
        return n;
    }
    let r = $l(e, t);
    for (; r && qw(r) && mi(r);) r = $l(r, t);
    return r && sn(r) && mi(r) && !Va(r) ? n : r || Xw(e) || n;
}
const Fx = async function (e) {
    const t = this.getOffsetParent || th,
        n = this.getDimensions,
        r = await n(e.floating);
    return {
        reference: Ix(e.reference, await t(e.floating), e.strategy),
        floating: { x: 0, y: 0, width: r.width, height: r.height },
    };
};
function kx(e) {
    return Mt(e).direction === 'rtl';
}
const Ox = {
    convertOffsetParentRelativeRectToViewportRelativeRect: Sx,
    getDocumentElement: qt,
    getClippingRect: Px,
    getOffsetParent: th,
    getElementRects: Fx,
    getClientRects: xx,
    getDimensions: Tx,
    getScale: Sr,
    isElement: ve,
    isRTL: kx,
};
function nh(e, t) {
    return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function Ax(e, t) {
    let n = null,
        r;
    const s = qt(e);
    function o() {
        var a;
        (clearTimeout(r), (a = n) == null || a.disconnect(), (n = null));
    }
    function i(a, d) {
        (a === void 0 && (a = !1), d === void 0 && (d = 1), o());
        const u = e.getBoundingClientRect(),
            { left: l, top: c, width: f, height: p } = u;
        if ((a || t(), !f || !p)) return;
        const h = Hn(c),
            g = Hn(s.clientWidth - (l + f)),
            m = Hn(s.clientHeight - (c + p)),
            y = Hn(l),
            R = { rootMargin: -h + 'px ' + -g + 'px ' + -m + 'px ' + -y + 'px', threshold: Tt(0, Cr(1, d)) || 1 };
        let w = !0;
        function E(C) {
            const M = C[0].intersectionRatio;
            if (M !== d) {
                if (!w) return i();
                M
                    ? i(!1, M)
                    : (r = setTimeout(() => {
                          i(!1, 1e-7);
                      }, 1e3));
            }
            (M === 1 && !nh(u, e.getBoundingClientRect()) && i(), (w = !1));
        }
        try {
            n = new IntersectionObserver(E, { ...R, root: s.ownerDocument });
        } catch {
            n = new IntersectionObserver(E, R);
        }
        n.observe(e);
    }
    return (i(!0), o);
}
function zl(e, t, n, r) {
    r === void 0 && (r = {});
    const {
            ancestorScroll: s = !0,
            ancestorResize: o = !0,
            elementResize: i = typeof ResizeObserver == 'function',
            layoutShift: a = typeof IntersectionObserver == 'function',
            animationFrame: d = !1,
        } = r,
        u = Ja(e),
        l = s || o ? [...(u ? ns(u) : []), ...(t ? ns(t) : [])] : [];
    l.forEach((y) => {
        (s && y.addEventListener('scroll', n, { passive: !0 }), o && y.addEventListener('resize', n));
    });
    const c = u && a ? Ax(u, n) : null;
    let f = -1,
        p = null;
    i &&
        ((p = new ResizeObserver((y) => {
            let [b] = y;
            (b &&
                b.target === u &&
                p &&
                t &&
                (p.unobserve(t),
                cancelAnimationFrame(f),
                (f = requestAnimationFrame(() => {
                    var R;
                    (R = p) == null || R.observe(t);
                }))),
                n());
        })),
        u && !d && p.observe(u),
        t && p.observe(t));
    let h,
        g = d ? rr(e) : null;
    d && m();
    function m() {
        const y = rr(e);
        (g && !nh(g, y) && n(), (g = y), (h = requestAnimationFrame(m)));
    }
    return (
        n(),
        () => {
            var y;
            (l.forEach((b) => {
                (s && b.removeEventListener('scroll', n), o && b.removeEventListener('resize', n));
            }),
                c?.(),
                (y = p) == null || y.disconnect(),
                (p = null),
                d && cancelAnimationFrame(h));
        }
    );
}
const _x = mx,
    Lx = gx,
    Dx = fx,
    Vx = bx,
    Nx = hx,
    jx = yx,
    Bx = (e, t, n) => {
        const r = new Map(),
            s = { platform: Ox, ...n },
            o = { ...s.platform, _c: r };
        return dx(e, t, { ...s, platform: o });
    };
var $x = typeof document < 'u',
    zx = function () {},
    Ys = $x ? v.useLayoutEffect : zx;
function Eo(e, t) {
    if (e === t) return !0;
    if (typeof e != typeof t) return !1;
    if (typeof e == 'function' && e.toString() === t.toString()) return !0;
    let n, r, s;
    if (e && t && typeof e == 'object') {
        if (Array.isArray(e)) {
            if (((n = e.length), n !== t.length)) return !1;
            for (r = n; r-- !== 0;) if (!Eo(e[r], t[r])) return !1;
            return !0;
        }
        if (((s = Object.keys(e)), (n = s.length), n !== Object.keys(t).length)) return !1;
        for (r = n; r-- !== 0;) if (!{}.hasOwnProperty.call(t, s[r])) return !1;
        for (r = n; r-- !== 0;) {
            const o = s[r];
            if (!(o === '_owner' && e.$$typeof) && !Eo(e[o], t[o])) return !1;
        }
        return !0;
    }
    return e !== e && t !== t;
}
function rh(e) {
    return typeof window > 'u' ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Ul(e, t) {
    const n = rh(e);
    return Math.round(t * n) / n;
}
function gi(e) {
    const t = v.useRef(e);
    return (
        Ys(() => {
            t.current = e;
        }),
        t
    );
}
function Ux(e) {
    e === void 0 && (e = {});
    const {
            placement: t = 'bottom',
            strategy: n = 'absolute',
            middleware: r = [],
            platform: s,
            elements: { reference: o, floating: i } = {},
            transform: a = !0,
            whileElementsMounted: d,
            open: u,
        } = e,
        [l, c] = v.useState({ x: 0, y: 0, strategy: n, placement: t, middlewareData: {}, isPositioned: !1 }),
        [f, p] = v.useState(r);
    Eo(f, r) || p(r);
    const [h, g] = v.useState(null),
        [m, y] = v.useState(null),
        b = v.useCallback((N) => {
            N !== C.current && ((C.current = N), g(N));
        }, []),
        R = v.useCallback((N) => {
            N !== M.current && ((M.current = N), y(N));
        }, []),
        w = o || h,
        E = i || m,
        C = v.useRef(null),
        M = v.useRef(null),
        S = v.useRef(l),
        P = d != null,
        I = gi(d),
        V = gi(s),
        A = gi(u),
        O = v.useCallback(() => {
            if (!C.current || !M.current) return;
            const N = { placement: t, strategy: n, middleware: f };
            (V.current && (N.platform = V.current),
                Bx(C.current, M.current, N).then((U) => {
                    const D = { ...U, isPositioned: A.current !== !1 };
                    L.current &&
                        !Eo(S.current, D) &&
                        ((S.current = D),
                        Pn.flushSync(() => {
                            c(D);
                        }));
                }));
        }, [f, t, n, V, A]);
    Ys(() => {
        u === !1 && S.current.isPositioned && ((S.current.isPositioned = !1), c((N) => ({ ...N, isPositioned: !1 })));
    }, [u]);
    const L = v.useRef(!1);
    (Ys(
        () => (
            (L.current = !0),
            () => {
                L.current = !1;
            }
        ),
        []
    ),
        Ys(() => {
            if ((w && (C.current = w), E && (M.current = E), w && E)) {
                if (I.current) return I.current(w, E, O);
                O();
            }
        }, [w, E, O, I, P]));
    const k = v.useMemo(() => ({ reference: C, floating: M, setReference: b, setFloating: R }), [b, R]),
        _ = v.useMemo(() => ({ reference: w, floating: E }), [w, E]),
        B = v.useMemo(() => {
            const N = { position: n, left: 0, top: 0 };
            if (!_.floating) return N;
            const U = Ul(_.floating, l.x),
                D = Ul(_.floating, l.y);
            return a
                ? {
                      ...N,
                      transform: 'translate(' + U + 'px, ' + D + 'px)',
                      ...(rh(_.floating) >= 1.5 && { willChange: 'transform' }),
                  }
                : { position: n, left: U, top: D };
        }, [n, a, _.floating, l.x, l.y]);
    return v.useMemo(() => ({ ...l, update: O, refs: k, elements: _, floatingStyles: B }), [l, O, k, _, B]);
}
const Hx = (e, t) => {
        const n = _x(e);
        return { name: n.name, fn: n.fn, options: [e, t] };
    },
    Wx = (e, t) => {
        const n = Lx(e);
        return { name: n.name, fn: n.fn, options: [e, t] };
    },
    Kx = (e, t) => ({ fn: jx(e).fn, options: [e, t] }),
    Gx = (e, t) => {
        const n = Dx(e);
        return { name: n.name, fn: n.fn, options: [e, t] };
    },
    qx = (e, t) => {
        const n = Vx(e);
        return { name: n.name, fn: n.fn, options: [e, t] };
    },
    Qx = (e, t) => {
        const n = Nx(e);
        return { name: n.name, fn: n.fn, options: [e, t] };
    };
function Yx(e) {
    const t = v.useRef(!0);
    t.current && ((t.current = !1), e());
}
const Re = (e, t, n, r, s, o, ...i) => {
        if (i.length > 0) throw new Error(ir(1));
        let a;
        if (e) a = e;
        else throw new Error('Missing arguments');
        return a;
    },
    Xx = qa(19),
    Jx = Xx ? eR : tR;
function sh(e, t, n, r, s) {
    return Jx(e, t, n, r, s);
}
function Zx(e, t, n, r, s) {
    const o = v.useCallback(() => t(e.getSnapshot(), n, r, s), [e, t, n, r, s]);
    return fu.useSyncExternalStore(e.subscribe, o, o);
}
_w({
    before(e) {
        ((e.syncIndex = 0),
            e.didInitialize ||
                ((e.syncTick = 1),
                (e.syncHooks = []),
                (e.didChangeStore = !0),
                (e.getSnapshot = () => {
                    let t = !1;
                    for (let n = 0; n < e.syncHooks.length; n += 1) {
                        const r = e.syncHooks[n],
                            s = r.selector(r.store.state, r.a1, r.a2, r.a3);
                        Object.is(r.value, s) || ((t = !0), (r.value = s));
                    }
                    return (t && (e.syncTick += 1), e.syncTick);
                })));
    },
    after(e) {
        e.syncHooks.length > 0 &&
            (e.didChangeStore &&
                ((e.didChangeStore = !1),
                (e.subscribe = (t) => {
                    const n = new Set();
                    for (const s of e.syncHooks) n.add(s.store);
                    const r = [];
                    for (const s of n) r.push(s.subscribe(t));
                    return () => {
                        for (const s of r) s();
                    };
                })),
            fu.useSyncExternalStore(e.subscribe, e.getSnapshot, e.getSnapshot));
    },
});
function eR(e, t, n, r, s) {
    const o = Aw();
    if (!o) return Zx(e, t, n, r, s);
    const i = o.syncIndex;
    o.syncIndex += 1;
    let a;
    return (
        o.didInitialize
            ? ((a = o.syncHooks[i]),
              (a.store !== e ||
                  a.selector !== t ||
                  !Object.is(a.a1, n) ||
                  !Object.is(a.a2, r) ||
                  !Object.is(a.a3, s)) &&
                  (a.store !== e && (o.didChangeStore = !0),
                  (a.store = e),
                  (a.selector = t),
                  (a.a1 = n),
                  (a.a2 = r),
                  (a.a3 = s),
                  (a.value = t(e.getSnapshot(), n, r, s))))
            : ((a = { store: e, selector: t, a1: n, a2: r, a3: s, value: t(e.getSnapshot(), n, r, s) }),
              o.syncHooks.push(a)),
        a.value
    );
}
function tR(e, t, n, r, s) {
    return la.useSyncExternalStoreWithSelector(e.subscribe, e.getSnapshot, e.getSnapshot, (o) => t(o, n, r, s));
}
let nR = class {
    constructor(t) {
        ((this.state = t), (this.listeners = new Set()), (this.updateTick = 0));
    }
    subscribe = (t) => (
        this.listeners.add(t),
        () => {
            this.listeners.delete(t);
        }
    );
    getSnapshot = () => this.state;
    setState(t) {
        if (this.state === t) return;
        ((this.state = t), (this.updateTick += 1));
        const n = this.updateTick;
        for (const r of this.listeners) {
            if (n !== this.updateTick) return;
            r(t);
        }
    }
    update(t) {
        for (const n in t)
            if (!Object.is(this.state[n], t[n])) {
                this.setState({ ...this.state, ...t });
                return;
            }
    }
    set(t, n) {
        Object.is(this.state[t], n) || this.setState({ ...this.state, [t]: n });
    }
    notifyAll() {
        const t = { ...this.state };
        this.setState(t);
    }
    use(t, n, r, s) {
        return sh(this, t, n, r, s);
    }
};
class oh extends nR {
    constructor(t, n = {}, r) {
        (super(t), (this.context = n), (this.selectors = r));
    }
    useSyncedValue(t, n) {
        v.useDebugValue(t);
        const r = this;
        fe(() => {
            r.state[t] !== n && r.set(t, n);
        }, [r, t, n]);
    }
    useSyncedValueWithCleanup(t, n) {
        const r = this;
        fe(
            () => (
                r.state[t] !== n && r.set(t, n),
                () => {
                    r.set(t, void 0);
                }
            ),
            [r, t, n]
        );
    }
    useSyncedValues(t) {
        const n = this,
            r = Object.values(t);
        fe(() => {
            n.update(t);
        }, [n, ...r]);
    }
    useControlledProp(t, n) {
        v.useDebugValue(t);
        const r = this,
            s = n !== void 0;
        fe(() => {
            s && !Object.is(r.state[t], n) && r.setState({ ...r.state, [t]: n });
        }, [r, t, n, s]);
    }
    select(t, n, r, s) {
        const o = this.selectors[t];
        return o(this.state, n, r, s);
    }
    useState(t, n, r, s) {
        return (v.useDebugValue(t), sh(this, this.selectors[t], n, r, s));
    }
    useContextCallback(t, n) {
        v.useDebugValue(t);
        const r = me(n ?? wf);
        this.context[t] = r;
    }
    useStateSetter(t) {
        const n = v.useRef(void 0);
        return (
            n.current === void 0 &&
                (n.current = (r) => {
                    this.set(t, r);
                }),
            n.current
        );
    }
    observe(t, n) {
        let r;
        typeof t == 'function' ? (r = t) : (r = this.selectors[t]);
        let s = r(this.state);
        return (
            n(s, s, this),
            this.subscribe((o) => {
                const i = r(o);
                if (!Object.is(s, i)) {
                    const a = s;
                    ((s = i), n(i, a, this));
                }
            })
        );
    }
}
const rR = {
    open: Re((e) => e.open),
    transitionStatus: Re((e) => e.transitionStatus),
    domReferenceElement: Re((e) => e.domReferenceElement),
    referenceElement: Re((e) => e.positionReference ?? e.referenceElement),
    floatingElement: Re((e) => e.floatingElement),
    floatingId: Re((e) => e.floatingId),
};
class Go extends oh {
    constructor(t) {
        const { syncOnly: n, nested: r, onOpenChange: s, triggerElements: o, ...i } = t;
        (super(
            { ...i, positionReference: i.referenceElement, domReferenceElement: i.referenceElement },
            { onOpenChange: s, dataRef: { current: {} }, events: Gf(), nested: r, triggerElements: o },
            rR
        ),
            (this.syncOnly = n));
    }
    syncOpenEvent = (t, n) => {
        (!t || !this.state.open || (n != null && Gw(n))) && (this.context.dataRef.current.openEvent = t ? n : void 0);
    };
    dispatchOpenChange = (t, n) => {
        this.syncOpenEvent(t, n.event);
        const r = {
            open: t,
            reason: n.reason,
            nativeEvent: n.event,
            nested: this.context.nested,
            triggerElement: n.trigger,
        };
        this.context.events.emit('openchange', r);
    };
    setOpen = (t, n) => {
        if (this.syncOnly) {
            this.context.onOpenChange?.(t, n);
            return;
        }
        (this.dispatchOpenChange(t, n), this.context.onOpenChange?.(t, n));
    };
}
function sR(e) {
    const {
            popupStore: t,
            treatPopupAsFloatingElement: n = !1,
            floatingRootContext: r,
            floatingId: s,
            nested: o,
            onOpenChange: i,
        } = e,
        a = t.useState('open'),
        d = t.useState('activeTriggerElement'),
        u = t.useState(n ? 'popupElement' : 'positionerElement'),
        l = t.context.triggerElements,
        c = i,
        f = v.useRef(null);
    r === void 0 &&
        f.current === null &&
        (f.current = new Go({
            open: a,
            transitionStatus: void 0,
            referenceElement: d,
            floatingElement: u,
            triggerElements: l,
            onOpenChange: c,
            floatingId: s,
            syncOnly: !0,
            nested: o,
        }));
    const p = r ?? f.current;
    return (
        t.useSyncedValue('floatingId', s),
        fe(() => {
            const h = { open: a, floatingId: s, referenceElement: d, floatingElement: u };
            (ve(d) && (h.domReferenceElement = d),
                p.state.positionReference === p.state.referenceElement && (h.positionReference = d),
                p.update(h));
        }, [a, s, d, u, p]),
        (p.context.onOpenChange = c),
        (p.context.nested = o),
        p
    );
}
function oR(e, t = !1, n = !1) {
    const [r, s] = v.useState(e && t ? 'idle' : void 0),
        [o, i] = v.useState(e);
    return (
        e && !o && (i(!0), s('starting')),
        !e && o && r !== 'ending' && !n && s('ending'),
        !e && !o && r === 'ending' && s(void 0),
        fe(() => {
            if (!e && o && r !== 'ending' && n) {
                const a = en.request(() => {
                    s('ending');
                });
                return () => {
                    en.cancel(a);
                };
            }
        }, [e, o, r, n]),
        fe(() => {
            if (!e || t) return;
            const a = en.request(() => {
                s(void 0);
            });
            return () => {
                en.cancel(a);
            };
        }, [t, e]),
        fe(() => {
            if (!e || !t) return;
            e && o && r !== 'idle' && s('starting');
            const a = en.request(() => {
                s('idle');
            });
            return () => {
                en.cancel(a);
            };
        }, [t, e, o, r]),
        { mounted: o, setMounted: i, transitionStatus: r }
    );
}
let os = (function (e) {
    return ((e.startingStyle = 'data-starting-style'), (e.endingStyle = 'data-ending-style'), e);
})({});
const iR = { [os.startingStyle]: '' },
    aR = { [os.endingStyle]: '' },
    cR = {
        transitionStatus(e) {
            return e === 'starting' ? iR : e === 'ending' ? aR : null;
        },
    };
function lR(e, t = !1, n = !0) {
    const r = rs();
    return me((s, o = null) => {
        r.cancel();
        const i = Zt(e);
        if (i == null) return;
        const a = i,
            d = () => {
                Pn.flushSync(s);
            };
        if (typeof a.getAnimations != 'function' || globalThis.BASE_UI_ANIMATIONS_DISABLED) {
            s();
            return;
        }
        function u() {
            Promise.all(a.getAnimations().map((l) => l.finished))
                .then(() => {
                    o?.aborted || d();
                })
                .catch(() => {
                    if (n) {
                        o?.aborted || d();
                        return;
                    }
                    const l = a.getAnimations();
                    !o?.aborted && l.length > 0 && l.some((c) => c.pending || c.playState !== 'finished') && u();
                });
        }
        if (t) {
            const l = os.startingStyle;
            if (!a.hasAttribute(l)) {
                r.request(u);
                return;
            }
            const c = new MutationObserver(() => {
                a.hasAttribute(l) || (c.disconnect(), u());
            });
            (c.observe(a, { attributes: !0, attributeFilter: [l] }),
                o?.addEventListener('abort', () => c.disconnect(), { once: !0 }));
            return;
        }
        r.request(u);
    });
}
function ih(e) {
    const { enabled: t = !0, open: n, ref: r, onComplete: s } = e,
        o = me(s),
        i = lR(r, n, !1);
    v.useEffect(() => {
        if (!t) return;
        const a = new AbortController();
        return (
            i(o, a.signal),
            () => {
                a.abort();
            }
        );
    }, [t, n, o, i]);
}
const uR = { tabIndex: -1, [Yi]: '' };
function DC(e) {
    return (t) => (t === 'touch' ? e.current : !0);
}
function dR(e, t, n = !1) {
    const r = gs(),
        s = Fr() != null,
        o = v.useRef(null);
    e === void 0 && o.current === null && (o.current = t(r, s));
    const i = e ?? o.current;
    return (
        sR({
            popupStore: i,
            treatPopupAsFloatingElement: n,
            floatingRootContext: i.state.floatingRootContext,
            floatingId: r,
            nested: s,
            onOpenChange: i.setOpen,
        }),
        { store: i, internalStore: o.current }
    );
}
function fR(e, t) {
    const n = v.useRef(null),
        r = v.useRef(null);
    return v.useCallback(
        (s) => {
            if (e === void 0) return;
            let o = !1;
            if (n.current !== null) {
                const i = n.current,
                    a = r.current,
                    d = t.context.triggerElements.getById(i);
                (a && d === a && (t.context.triggerElements.delete(i), (o = !0)),
                    (n.current = null),
                    (r.current = null));
            }
            if ((s !== null && ((n.current = e), (r.current = s), t.context.triggerElements.add(e, s), (o = !0)), o)) {
                const i = t.context.triggerElements.size;
                t.select('open') && t.state.triggerCount !== i && t.set('triggerCount', i);
            }
        },
        [t, e]
    );
}
function hR(e, t, n, r = !1) {
    t ? (e.preventUnmountingOnClose = !1) : r && (e.preventUnmountingOnClose = !0);
    const s = n?.id ?? null;
    (s || t) && ((e.activeTriggerId = s), (e.activeTriggerElement = n ?? null));
}
function pR(e) {
    let t = !1;
    return (
        (e.preventUnmountOnClose = () => {
            t = !0;
        }),
        () => t
    );
}
function mR(e, t, n, r = {}) {
    const s = n.reason,
        o = s === St,
        i = t && s === qs,
        a = !t && (s === ps || s === za),
        d = pR(n);
    if ((e.context.onOpenChange?.(t, n), n.isCanceled)) return;
    (r.onBeforeDispatch?.(), e.state.floatingRootContext.dispatchOpenChange(t, n));
    const u = () => {
        const l = { ...r.extraState, open: t };
        (i ? (l.instantType = 'focus') : a ? (l.instantType = 'dismiss') : o && (l.instantType = void 0),
            hR(l, t, n.trigger, d()),
            e.update(l));
    };
    o ? Pn.flushSync(u) : u();
}
function gR(e, t, n, r) {
    Yx(() => {
        t === void 0 &&
            e.state.open === !1 &&
            n &&
            (e.state = { ...e.state, open: !0, activeTriggerId: r, preventUnmountingOnClose: !1 });
    });
}
function yR(e, t, n, r) {
    const s = n.useState('isMountedByTrigger', e),
        o = fR(e, n),
        i = me((a) => {
            if ((o(a), !a)) return;
            const d = n.select('open'),
                u = n.select('activeTriggerId');
            if (u === e) {
                n.update({ activeTriggerElement: a, ...(d ? r : null) });
                return;
            }
            u == null && d && n.update({ activeTriggerId: e, activeTriggerElement: a, ...r });
        });
    return (
        fe(() => {
            s && n.update({ activeTriggerElement: t.current, ...r });
        }, [s, n, t, ...Object.values(r)]),
        { registerTrigger: i, isMountedByThisTrigger: s }
    );
}
function bR(e, t = {}) {
    const { closeOnActiveTriggerUnmount: n = !1 } = t,
        r = e.useState('open'),
        s = e.useState('triggerCount');
    fe(() => {
        if (!r) {
            e.state.triggerCount !== 0 && e.set('triggerCount', 0);
            return;
        }
        const o = e.context.triggerElements.size,
            i = {};
        e.state.triggerCount !== o && (i.triggerCount = o);
        const a = e.select('activeTriggerId');
        let d = null;
        if (a) {
            const u = e.context.triggerElements.getById(a);
            u ? u !== e.state.activeTriggerElement && (i.activeTriggerElement = u) : (d = a);
        }
        if (!d && !a && o === 1) {
            const u = e.context.triggerElements.entries().next();
            if (!u.done) {
                const [l, c] = u.value;
                ((i.activeTriggerId = l), (i.activeTriggerElement = c));
            }
        }
        ((i.triggerCount !== void 0 || i.activeTriggerId !== void 0 || i.activeTriggerElement !== void 0) &&
            e.update(i),
            d &&
                n &&
                queueMicrotask(() => {
                    if (
                        e.select('open') &&
                        e.select('activeTriggerId') === d &&
                        !e.context.triggerElements.getById(d)
                    ) {
                        const u = Ie(Ba);
                        (e.setOpen(!1, u),
                            u.isCanceled || e.update({ activeTriggerId: null, activeTriggerElement: null }));
                    }
                }));
    }, [r, e, s, n]);
}
function vR(e, t, n) {
    const { mounted: r, setMounted: s, transitionStatus: o } = oR(e),
        i = t.useState('preventUnmountingOnClose'),
        a = e ? !1 : i;
    t.useSyncedValues({ mounted: r, transitionStatus: o, preventUnmountingOnClose: a });
    const d = me(() => {
        (s(!1),
            t.update({ activeTriggerId: null, activeTriggerElement: null, mounted: !1, preventUnmountingOnClose: !1 }),
            n?.(),
            t.context.onOpenChangeComplete?.(!1));
    });
    return (
        ih({
            enabled: r && !e && !a,
            open: e,
            ref: t.context.popupRef,
            onComplete() {
                e || d();
            },
        }),
        { forceUnmount: d, transitionStatus: o }
    );
}
function wR(e, t) {
    (e.useSyncedValues(t),
        fe(
            () => () => {
                e.update({ activeTriggerProps: lt, inactiveTriggerProps: lt, popupProps: lt });
            },
            [e]
        ));
}
function VC(e, t) {
    (fe(() => {
        !t && e.state.openMethod !== null && e.set('openMethod', null);
    }, [t, e]),
        fe(
            () => () => {
                e.state.openMethod !== null && e.set('openMethod', null);
            },
            [e]
        ));
}
class Za {
    constructor() {
        ((this.elementsSet = new Set()), (this.idMap = new Map()));
    }
    add(t, n) {
        const r = this.idMap.get(t);
        r !== n && (r !== void 0 && this.elementsSet.delete(r), this.elementsSet.add(n), this.idMap.set(t, n));
    }
    delete(t) {
        const n = this.idMap.get(t);
        n && (this.elementsSet.delete(n), this.idMap.delete(t));
    }
    hasElement(t) {
        return this.elementsSet.has(t);
    }
    hasMatchingElement(t) {
        for (const n of this.elementsSet) if (t(n)) return !0;
        return !1;
    }
    getById(t) {
        return this.idMap.get(t);
    }
    entries() {
        return this.idMap.entries();
    }
    elements() {
        return this.elementsSet.values();
    }
    get size() {
        return this.idMap.size;
    }
}
function SR() {
    return new Go({
        open: !1,
        transitionStatus: void 0,
        floatingElement: null,
        referenceElement: null,
        triggerElements: new Za(),
        floatingId: void 0,
        syncOnly: !1,
        nested: !1,
        onOpenChange: void 0,
    });
}
function xR() {
    return {
        open: !1,
        openProp: void 0,
        mounted: !1,
        transitionStatus: void 0,
        floatingRootContext: SR(),
        floatingId: void 0,
        triggerCount: 0,
        preventUnmountingOnClose: !1,
        payload: void 0,
        activeTriggerId: null,
        activeTriggerElement: null,
        triggerIdProp: void 0,
        popupElement: null,
        positionerElement: null,
        activeTriggerProps: lt,
        inactiveTriggerProps: lt,
        popupProps: lt,
    };
}
function RR(e, t, n = !1) {
    return new Go({
        open: !1,
        transitionStatus: void 0,
        floatingElement: null,
        referenceElement: null,
        triggerElements: e,
        floatingId: t,
        syncOnly: !0,
        nested: n,
        onOpenChange: void 0,
    });
}
const Gr = Re((e) => e.triggerIdProp ?? e.activeTriggerId),
    ec = Re((e) => e.openProp ?? e.open),
    Hl = Re((e) => (e.popupElement?.id ?? e.floatingId) || void 0);
function ah(e, t) {
    return t !== void 0 && ec(e) && Gr(e) === t;
}
function ER(e, t) {
    return ah(e, t) ? !0 : t !== void 0 && ec(e) && Gr(e) == null && e.triggerCount === 1;
}
const MR = {
    open: ec,
    mounted: Re((e) => e.mounted),
    transitionStatus: Re((e) => e.transitionStatus),
    floatingRootContext: Re((e) => e.floatingRootContext),
    triggerCount: Re((e) => e.triggerCount),
    preventUnmountingOnClose: Re((e) => e.preventUnmountingOnClose),
    payload: Re((e) => e.payload),
    activeTriggerId: Gr,
    activeTriggerElement: Re((e) => (e.mounted ? e.activeTriggerElement : null)),
    popupId: Hl,
    isTriggerActive: Re((e, t) => t !== void 0 && Gr(e) === t),
    isOpenedByTrigger: Re((e, t) => ah(e, t)),
    isMountedByTrigger: Re((e, t) => t !== void 0 && Gr(e) === t && e.mounted),
    triggerProps: Re((e, t) => (t ? e.activeTriggerProps : e.inactiveTriggerProps)),
    triggerPopupId: Re((e, t) => (ER(e, t) ? Hl(e) : void 0)),
    popupProps: Re((e) => e.popupProps),
    popupElement: Re((e) => e.popupElement),
    positionerElement: Re((e) => e.positionerElement),
};
function CR(e) {
    const { open: t = !1, onOpenChange: n, elements: r = {} } = e,
        s = gs(),
        o = Fr() != null,
        i = Gt(
            () =>
                new Go({
                    open: t,
                    transitionStatus: void 0,
                    onOpenChange: n,
                    referenceElement: r.reference ?? null,
                    floatingElement: r.floating ?? null,
                    triggerElements: new Za(),
                    floatingId: s,
                    syncOnly: !1,
                    nested: o,
                })
        ).current;
    return (
        fe(() => {
            const a = { open: t, floatingId: s };
            (r.reference !== void 0 &&
                ((a.referenceElement = r.reference), (a.domReferenceElement = ve(r.reference) ? r.reference : null)),
                r.floating !== void 0 && (a.floatingElement = r.floating),
                i.update(a));
        }, [t, s, r.reference, r.floating, i]),
        (i.context.onOpenChange = n),
        (i.context.nested = o),
        i
    );
}
function PR(e = {}) {
    const { nodeId: t, externalTree: n } = e,
        r = CR(e),
        s = e.rootContext || r,
        o = s.useState('referenceElement'),
        i = s.useState('floatingElement'),
        a = s.useState('domReferenceElement'),
        d = s.useState('open'),
        u = s.useState('floatingId'),
        [l, c] = v.useState(null),
        [f, p] = v.useState(void 0),
        [h, g] = v.useState(void 0),
        m = v.useRef(null),
        y = ar(n),
        b = v.useMemo(() => ({ reference: o, floating: i, domReference: a }), [o, i, a]),
        R = Ux({ ...e, elements: { ...b, ...(l && { reference: l }) } }),
        w = ve(f) ? f : null,
        E = h === void 0 ? s.state.floatingElement : h;
    (s.useSyncedValue('referenceElement', f ?? null),
        s.useSyncedValue('domReferenceElement', f === void 0 ? a : w),
        s.useSyncedValue('floatingElement', E));
    const C = v.useCallback(
            (A) => {
                const O = ve(A)
                    ? {
                          getBoundingClientRect: () => A.getBoundingClientRect(),
                          getClientRects: () => A.getClientRects(),
                          contextElement: A,
                      }
                    : A;
                (c(O), R.refs.setReference(O));
            },
            [R.refs]
        ),
        M = v.useCallback(
            (A) => {
                ((ve(A) || A === null) && ((m.current = A), p(A)),
                    (ve(R.refs.reference.current) || R.refs.reference.current === null || (A !== null && !ve(A))) &&
                        R.refs.setReference(A));
            },
            [R.refs, p]
        ),
        S = v.useCallback(
            (A) => {
                (g(A), R.refs.setFloating(A));
            },
            [R.refs]
        ),
        P = v.useMemo(
            () => ({ ...R.refs, setReference: M, setFloating: S, setPositionReference: C, domReference: m }),
            [R.refs, M, S, C]
        ),
        I = v.useMemo(() => ({ ...R.elements, domReference: a }), [R.elements, a]),
        V = v.useMemo(
            () => ({
                ...R,
                dataRef: s.context.dataRef,
                open: d,
                onOpenChange: s.setOpen,
                events: s.context.events,
                floatingId: u,
                refs: P,
                elements: I,
                nodeId: t,
                rootStore: s,
            }),
            [R, P, I, t, s, d, u]
        );
    return (
        fe(() => {
            a && (m.current = a);
        }, [a]),
        fe(() => {
            s.context.dataRef.current.floatingContext = V;
            const A = y?.nodesRef.current.find((O) => O.id === t);
            A && (A.context = V);
        }),
        v.useMemo(() => ({ ...R, context: V, refs: P, elements: I, rootStore: s }), [R, P, I, V, s])
    );
}
const yi = hf && Tr;
function TR(e, t = {}) {
    const { enabled: n = !0, delay: r } = t,
        s = 'rootStore' in e ? e.rootStore : e,
        { events: o, dataRef: i } = s.context,
        a = v.useRef(!1),
        d = v.useRef(null),
        u = v.useRef(!0),
        l = Ut();
    (v.useEffect(() => {
        const f = s.select('domReferenceElement');
        if (!n) return;
        const p = tt(f);
        function h() {
            const y = s.select('domReferenceElement');
            !s.select('open') && Le(y) && y === wt(_e(y)) && (a.current = !0);
        }
        function g() {
            u.current = !0;
        }
        function m() {
            u.current = !1;
        }
        return $t(xe(p, 'blur', h), yi && xe(p, 'keydown', g, !0), yi && xe(p, 'pointerdown', m, !0));
    }, [s, n]),
        v.useEffect(() => {
            if (!n) return;
            function f(p) {
                if (p.reason === ps || p.reason === za) {
                    const h = s.select('domReferenceElement');
                    ve(h) && ((d.current = h), (a.current = !0));
                }
            }
            return (
                o.on('openchange', f),
                () => {
                    o.off('openchange', f);
                }
            );
        }, [o, n, s]));
    const c = v.useMemo(() => {
        function f() {
            ((a.current = !1), (d.current = null));
        }
        return {
            onMouseLeave() {
                f();
            },
            onFocus(p) {
                const h = p.currentTarget;
                if (a.current) {
                    if (d.current === h) return;
                    f();
                }
                const g = Rt(p.nativeEvent);
                if (ve(g)) {
                    if (yi && !p.relatedTarget) {
                        if (!u.current && !Ho(g)) return;
                    } else if (!eS(g)) return;
                }
                const m = po(p.relatedTarget, s.context.triggerElements),
                    { nativeEvent: y, currentTarget: b } = p,
                    R = typeof r == 'function' ? r() : r;
                if ((s.select('open') && m) || R === 0 || R === void 0) {
                    s.setOpen(!0, Ie(qs, y, b));
                    return;
                }
                l.start(R, () => {
                    a.current || s.setOpen(!0, Ie(qs, y, b));
                });
            },
            onBlur(p) {
                f();
                const h = p.relatedTarget,
                    g = p.nativeEvent,
                    m = ve(h) && h.hasAttribute(ss('focus-guard')) && h.getAttribute('data-type') === 'outside';
                l.start(0, () => {
                    const y = s.select('domReferenceElement'),
                        b = wt(_e(y));
                    (!h && b === y) ||
                        de(i.current.floatingContext?.refs.floating.current, b) ||
                        de(y, b) ||
                        m ||
                        po(h ?? b, s.context.triggerElements) ||
                        s.setOpen(!1, Ie(qs, g));
                });
            },
        };
    }, [i, r, s, l]);
    return v.useMemo(() => (n ? { reference: c, trigger: c } : {}), [n, c]);
}
class tc {
    constructor() {
        ((this.pointerType = void 0),
            (this.interactedInside = !1),
            (this.handler = void 0),
            (this.blockMouseMove = !0),
            (this.performedPointerEventsMutation = !1),
            (this.pointerEventsScopeElement = null),
            (this.pointerEventsReferenceElement = null),
            (this.pointerEventsFloatingElement = null),
            (this.restTimeoutPending = !1),
            (this.openChangeTimeout = new cn()),
            (this.restTimeout = new cn()),
            (this.handleCloseOptions = void 0));
    }
    static create() {
        return new tc();
    }
    dispose = () => {
        (this.openChangeTimeout.clear(), this.restTimeout.clear());
    };
    disposeEffect = () => this.dispose;
}
const Mo = new WeakMap();
function Co(e) {
    if (!e.performedPointerEventsMutation) return;
    const t = e.pointerEventsScopeElement;
    (t &&
        Mo.get(t) === e &&
        (e.pointerEventsScopeElement?.style.removeProperty('pointer-events'),
        e.pointerEventsReferenceElement?.style.removeProperty('pointer-events'),
        e.pointerEventsFloatingElement?.style.removeProperty('pointer-events'),
        Mo.delete(t)),
        (e.performedPointerEventsMutation = !1),
        (e.pointerEventsScopeElement = null),
        (e.pointerEventsReferenceElement = null),
        (e.pointerEventsFloatingElement = null));
}
function ch(e, t) {
    const { scopeElement: n, referenceElement: r, floatingElement: s } = t,
        o = Mo.get(n);
    (o && o !== e && Co(o),
        Co(e),
        (e.performedPointerEventsMutation = !0),
        (e.pointerEventsScopeElement = n),
        (e.pointerEventsReferenceElement = r),
        (e.pointerEventsFloatingElement = s),
        Mo.set(n, e),
        (n.style.pointerEvents = 'none'),
        (r.style.pointerEvents = 'auto'),
        (s.style.pointerEvents = 'auto'));
}
function nc(e) {
    const t = e.context.dataRef.current,
        n = Gt(() => t.hoverInteractionState ?? tc.create()).current;
    return (
        t.hoverInteractionState || (t.hoverInteractionState = n),
        La(t.hoverInteractionState.disposeEffect),
        t.hoverInteractionState
    );
}
function IR(e, t = {}) {
    const { enabled: n = !0, closeDelay: r = 0, nodeId: s } = t,
        o = 'rootStore' in e ? e.rootStore : e,
        i = o.useState('open'),
        a = o.useState('floatingElement'),
        d = o.useState('domReferenceElement'),
        { dataRef: u } = o.context,
        l = ar(),
        c = Fr(),
        f = nc(o),
        p = Ut(),
        h = me(() => vf(u.current.openEvent?.type, f.interactedInside)),
        g = me(() => nS(u.current.openEvent?.type)),
        m = me(() => {
            Co(f);
        });
    (fe(() => {
        i || ((f.pointerType = void 0), (f.restTimeoutPending = !1), (f.interactedInside = !1), m());
    }, [i, f, m]),
        v.useEffect(() => m, [m]),
        fe(() => {
            if (n && i && f.handleCloseOptions?.blockPointerEvents && g() && ve(d) && a) {
                const y = d,
                    b = a,
                    R = _e(a),
                    w = l?.nodesRef.current.find((S) => S.id === c)?.context?.elements.floating;
                w && (w.style.pointerEvents = '');
                const E = f.pointerEventsScopeElement !== b ? f.pointerEventsScopeElement : null,
                    C = w !== b ? w : null,
                    M = f.handleCloseOptions?.getScope?.() ?? E ?? C ?? y.closest('[data-rootownerid]') ?? R.body;
                return (
                    ch(f, { scopeElement: M, referenceElement: y, floatingElement: b }),
                    () => {
                        m();
                    }
                );
            }
        }, [n, i, d, a, f, g, l, c, m]),
        v.useEffect(() => {
            if (!n) return;
            function y() {
                return !!(l && c && Cn(l.nodesRef.current, c).length > 0);
            }
            function b(S) {
                const P = Mr(r, 'close', f.pointerType),
                    I = () => {
                        (o.setOpen(!1, Ie(St, S)), l?.events.emit('floating.closed', S));
                    };
                P ? f.openChangeTimeout.start(P, I) : (f.openChangeTimeout.clear(), I());
            }
            function R(S) {
                const P = Rt(S);
                if (!Zw(P)) {
                    f.interactedInside = !1;
                    return;
                }
                f.interactedInside = P?.closest('[aria-haspopup]') != null;
            }
            function w() {
                (f.openChangeTimeout.clear(), p.clear(), l?.events.off('floating.closed', C), m());
            }
            function E(S) {
                if (y() && l) {
                    l.events.on('floating.closed', C);
                    return;
                }
                if (po(S.relatedTarget, o.context.triggerElements)) return;
                const P = u.current.floatingContext?.nodeId ?? s,
                    I = S.relatedTarget;
                if (!(
                    l &&
                    P &&
                    ve(I) &&
                    Cn(l.nodesRef.current, P, !1).some((A) => de(A.context?.elements.floating, I))
                )) {
                    if (f.handler) {
                        f.handler(S);
                        return;
                    }
                    (m(), g() && !h() && b(S));
                }
            }
            function C(S) {
                !l ||
                    !c ||
                    y() ||
                    p.start(0, () => {
                        (l.events.off('floating.closed', C),
                            o.setOpen(!1, Ie(St, S)),
                            l.events.emit('floating.closed', S));
                    });
            }
            const M = a;
            return $t(
                M && xe(M, 'mouseenter', w),
                M && xe(M, 'mouseleave', E),
                M && xe(M, 'pointerdown', R, !0),
                () => {
                    l?.events.off('floating.closed', C);
                }
            );
        }, [n, a, o, u, r, s, g, h, m, f, l, c, p]));
}
const FR = { current: null };
function kR(e, t = {}) {
    const {
            enabled: n = !0,
            delay: r = 0,
            handleClose: s = null,
            mouseOnly: o = !1,
            restMs: i = 0,
            move: a = !0,
            triggerElementRef: d = FR,
            externalTree: u,
            isActiveTrigger: l = !0,
            getHandleCloseContext: c,
            isClosing: f,
            shouldOpen: p,
        } = t,
        h = 'rootStore' in e ? e.rootStore : e,
        { dataRef: g, events: m } = h.context,
        y = ar(u),
        b = nc(h),
        R = v.useRef(!1),
        w = ze(s),
        E = ze(r),
        C = ze(i),
        M = ze(n),
        S = ze(p),
        P = ze(f),
        I = me(() => vf(g.current.openEvent?.type, b.interactedInside)),
        V = me(() => S.current?.() !== !1),
        A = me((k, _, B) => {
            const N = h.context.triggerElements;
            if (N.hasElement(_)) return !k || !de(k, _);
            if (!ve(B)) return !1;
            const U = B;
            return N.hasMatchingElement((D) => de(D, U)) && (!k || !de(k, U));
        }),
        O = me(() => {
            if (!b.handler) return;
            (_e(h.select('domReferenceElement')).removeEventListener('mousemove', b.handler), (b.handler = void 0));
        }),
        L = me(() => {
            Co(b);
        });
    return (
        l && (b.handleCloseOptions = w.current?.__options),
        v.useEffect(() => O, [O]),
        v.useEffect(() => {
            if (!n) return;
            function k(_) {
                _.open
                    ? (R.current = !1)
                    : ((R.current = _.reason === St),
                      O(),
                      b.openChangeTimeout.clear(),
                      b.restTimeout.clear(),
                      (b.blockMouseMove = !0),
                      (b.restTimeoutPending = !1));
            }
            return (
                m.on('openchange', k),
                () => {
                    m.off('openchange', k);
                }
            );
        }, [n, m, b, O]),
        v.useEffect(() => {
            if (!n) return;
            function k(U, D = !0) {
                const X = Mr(E.current, 'close', b.pointerType);
                X
                    ? b.openChangeTimeout.start(X, () => {
                          (h.setOpen(!1, Ie(St, U)), y?.events.emit('floating.closed', U));
                      })
                    : D &&
                      (b.openChangeTimeout.clear(), h.setOpen(!1, Ie(St, U)), y?.events.emit('floating.closed', U));
            }
            const _ = d.current ?? (l ? h.select('domReferenceElement') : null);
            if (!ve(_)) return;
            function B(U) {
                if ((b.openChangeTimeout.clear(), (b.blockMouseMove = !1), o && !nr(b.pointerType))) return;
                const D = gl(C.current),
                    X = Mr(E.current, 'open', b.pointerType),
                    Z = Rt(U),
                    Y = U.currentTarget ?? null,
                    Q = h.select('domReferenceElement');
                let H = Y;
                if (ve(Z) && !h.context.triggerElements.hasElement(Z)) {
                    for (const ue of h.context.triggerElements.elements())
                        if (de(ue, Z)) {
                            H = ue;
                            break;
                        }
                }
                ve(Y) && ve(Q) && !h.context.triggerElements.hasElement(Y) && de(Y, Q) && (H = Q);
                const q = H == null ? !1 : A(Q, H, Z),
                    pe = h.select('open'),
                    z = P.current?.() ?? h.select('transitionStatus') === 'ending',
                    J = !pe && z && R.current,
                    ge = !q && ve(H) && ve(Q) && de(Q, H) && J,
                    we = D > 0 && !X,
                    W = (q && (pe || J)) || ge,
                    ie = !pe || q;
                if (W) {
                    V() && h.setOpen(!0, Ie(St, U, H));
                    return;
                }
                we ||
                    (X
                        ? b.openChangeTimeout.start(X, () => {
                              ie && V() && h.setOpen(!0, Ie(St, U, H));
                          })
                        : ie && V() && h.setOpen(!0, Ie(St, U, H)));
            }
            function N(U) {
                if (I()) {
                    L();
                    return;
                }
                O();
                const D = h.select('domReferenceElement'),
                    X = _e(D);
                (b.restTimeout.clear(), (b.restTimeoutPending = !1));
                const Z = g.current.floatingContext ?? c?.();
                if (po(U.relatedTarget, h.context.triggerElements)) return;
                if (w.current && Z) {
                    h.select('open') || b.openChangeTimeout.clear();
                    const Q = d.current;
                    ((b.handler = w.current({
                        ...Z,
                        tree: y,
                        x: U.clientX,
                        y: U.clientY,
                        onClose() {
                            (L(), O(), M.current && !I() && Q === h.select('domReferenceElement') && k(U, !0));
                        },
                    })),
                        X.addEventListener('mousemove', b.handler),
                        b.handler(U));
                    return;
                }
                (b.pointerType !== 'touch' || !de(h.select('floatingElement'), U.relatedTarget)) && k(U);
            }
            return a
                ? $t(xe(_, 'mousemove', B, { once: !0 }), xe(_, 'mouseenter', B), xe(_, 'mouseleave', N))
                : $t(xe(_, 'mouseenter', B), xe(_, 'mouseleave', N));
        }, [O, L, g, E, h, n, w, b, l, A, I, o, a, C, d, y, M, c, P, V]),
        v.useMemo(() => {
            if (!n) return;
            function k(_) {
                b.pointerType = _.pointerType;
            }
            return {
                onPointerDown: k,
                onPointerEnter: k,
                onMouseMove(_) {
                    const { nativeEvent: B } = _,
                        N = _.currentTarget,
                        U = h.select('domReferenceElement'),
                        D = h.select('open'),
                        X = A(U, N, _.target);
                    if (o && !nr(b.pointerType)) return;
                    if (D && X && b.handleCloseOptions?.blockPointerEvents) {
                        const Q = h.select('floatingElement');
                        if (Q) {
                            const H = b.handleCloseOptions?.getScope?.() ?? N.ownerDocument.body;
                            ch(b, { scopeElement: H, referenceElement: N, floatingElement: Q });
                        }
                    }
                    const Z = gl(C.current);
                    if ((D && !X) || Z === 0 || (!X && b.restTimeoutPending && _.movementX ** 2 + _.movementY ** 2 < 2))
                        return;
                    b.restTimeout.clear();
                    function Y() {
                        if (((b.restTimeoutPending = !1), I())) return;
                        const Q = h.select('open');
                        !b.blockMouseMove && (!Q || X) && V() && h.setOpen(!0, Ie(St, B, N));
                    }
                    b.pointerType === 'touch'
                        ? Pn.flushSync(() => {
                              Y();
                          })
                        : X && D
                          ? Y()
                          : ((b.restTimeoutPending = !0), b.restTimeout.start(Z, Y));
                },
            };
        }, [n, b, I, A, o, h, C, V])
    );
}
const OR = 'Escape';
function qo(e, t, n) {
    switch (e) {
        case 'vertical':
            return t;
        case 'horizontal':
            return n;
        default:
            return t || n;
    }
}
function As(e, t) {
    return qo(t, e === ja || e === Uo, e === Yn || e === Xn);
}
function bi(e, t, n) {
    return qo(t, e === Uo, n ? e === Yn : e === Xn) || e === 'Enter' || e === ' ' || e === '';
}
function AR(e, t, n) {
    return qo(t, n ? e === Yn : e === Xn, e === Uo);
}
function _R(e, t, n, r) {
    const s = n ? e === Xn : e === Yn,
        o = e === ja;
    return t === 'both' || (t === 'horizontal' && r) ? e === OR : qo(t, s, o);
}
function NC(e, t) {
    const {
            listRef: n,
            activeIndex: r,
            onNavigate: s = () => {},
            enabled: o = !0,
            selectedIndex: i = null,
            allowEscape: a = !1,
            loopFocus: d = !1,
            nested: u = !1,
            rtl: l = !1,
            virtual: c = !1,
            focusItemOnOpen: f = 'auto',
            focusItemOnHover: p = !0,
            openOnArrowKeyDown: h = !0,
            disabledIndices: g = void 0,
            orientation: m = 'vertical',
            parentOrientation: y,
            id: b,
            resetOnPointerLeave: R = !0,
            externalTree: w,
            grid: E,
        } = t,
        C = E != null,
        M = 'rootStore' in e ? e.rootStore : e,
        S = M.useState('open'),
        P = M.useState('floatingElement'),
        I = M.useState('domReferenceElement'),
        V = M.context.dataRef,
        A = Ji(P),
        O = Xi(I),
        L = ze(A),
        k = Fr(),
        _ = ar(w),
        B = v.useRef(f),
        N = v.useRef(i ?? -1),
        U = v.useRef(null),
        D = v.useRef(!0),
        X = me(($) => {
            s(N.current === -1 ? null : N.current, $);
        }),
        Z = v.useRef(!!P),
        Y = v.useRef(S),
        Q = v.useRef(!1),
        H = v.useRef(!1),
        q = v.useRef(null),
        pe = ze(g),
        z = ze(S),
        J = ze(i),
        ge = ze(R),
        we = rs(),
        W = rs(),
        ie = me(() => {
            function $(he) {
                c ? _?.events.emit('virtualfocus', he) : (q.current = Qs(he, { sync: Q.current, preventScroll: !0 }));
            }
            const j = n.current[N.current],
                se = H.current;
            (j && $(j),
                (Q.current ? (he) => he() : (he) => we.request(he))(() => {
                    const he = n.current[N.current] || j;
                    if (!he) return;
                    (j || $(he),
                        ee && (se || !D.current) && he.scrollIntoView?.({ block: 'nearest', inline: 'nearest' }));
                }));
        });
    (fe(() => {
        V.current.orientation = m;
    }, [V, m]),
        fe(() => {
            o &&
                (S && P
                    ? ((N.current = i ?? -1), B.current && i != null && ((H.current = !0), X()))
                    : Z.current && ((N.current = -1), X()));
        }, [o, S, P, i, X]),
        fe(() => {
            if (o) {
                if (!S) {
                    Q.current = !1;
                    return;
                }
                if (P)
                    if (r == null) {
                        if (((Q.current = !1), J.current != null)) return;
                        if (
                            (Z.current && ((N.current = -1), ie()),
                            (!Y.current || !Z.current) &&
                                B.current &&
                                (U.current != null || (B.current === !0 && U.current == null)))
                        ) {
                            let $ = 0;
                            const j = () => {
                                n.current[0] == null
                                    ? ($ < 2 && ($ ? (G) => W.request(G) : queueMicrotask)(j), ($ += 1))
                                    : ((N.current = U.current == null || bi(U.current, m, l) || u ? di(n) : wl(n)),
                                      (U.current = null),
                                      X());
                            };
                            j();
                        }
                    } else wo(n.current, r) || ((N.current = r), ie(), (H.current = !1));
            }
        }, [o, S, P, r, J, u, n, m, l, X, ie, W]),
        fe(() => {
            if (!o || P || !_ || c || !Z.current) return;
            const $ = _.nodesRef.current,
                j = $.find((he) => he.id === k)?.context?.elements.floating,
                se = wt(_e(I ?? j ?? null)),
                G = $.some((he) => he.context && de(he.context.elements.floating, se));
            j && !G && D.current && j.focus({ preventScroll: !0 });
        }, [o, P, I, _, k, c]),
        fe(() => {
            ((Y.current = S), (Z.current = !!P));
        }),
        fe(() => {
            S || ((U.current = null), (B.current = f));
        }, [S, f]));
    const ue = r != null,
        Ce = me(($) => {
            if (!z.current) return;
            const j = n.current.indexOf($.currentTarget);
            j !== -1 && (N.current !== j || r !== j) && ((N.current = j), X($));
        }),
        Ee = me(() => y ?? _?.nodesRef.current.find(($) => $.id === k)?.context?.dataRef?.current.orientation),
        re = me(() => di(n, pe.current)),
        ce = me(($) => {
            if (((D.current = !1), (Q.current = !0), $.which === 229 || (!z.current && $.currentTarget === L.current)))
                return;
            if (u && _R($.key, m, l, C)) {
                (As($.key, Ee()) || Pt($),
                    M.setOpen(!1, Ie(yl, $.nativeEvent)),
                    Le(I) && (c ? _?.events.emit('virtualfocus', I) : I.focus()));
                return;
            }
            const j = N.current,
                se = di(n, g),
                G = wl(n, g);
            if (
                (O ||
                    ($.key === 'Home' && (Pt($), (N.current = se), X($)),
                    $.key === 'End' && (Pt($), (N.current = G), X($))),
                E != null)
            ) {
                const he = E($, N.current, n, m, d, l, g, se, G);
                if ((he != null && ((N.current = he), X($)), m === 'both')) return;
            }
            if (As($.key, m)) {
                if ((Pt($), S && !c && wt($.currentTarget.ownerDocument) === $.currentTarget)) {
                    ((N.current = bi($.key, m, l) ? se : G), X($));
                    return;
                }
                (bi($.key, m, l)
                    ? d
                        ? j >= G
                            ? a && j !== n.current.length
                                ? (N.current = -1)
                                : ((Q.current = !1), (N.current = se))
                            : (N.current = ht(n.current, { startingIndex: j, disabledIndices: g }))
                        : (N.current = Math.min(G, ht(n.current, { startingIndex: j, disabledIndices: g })))
                    : d
                      ? j <= se
                          ? a && j !== -1
                              ? (N.current = n.current.length)
                              : ((Q.current = !1), (N.current = G))
                          : (N.current = ht(n.current, { startingIndex: j, decrement: !0, disabledIndices: g }))
                      : (N.current = Math.max(
                            se,
                            ht(n.current, { startingIndex: j, decrement: !0, disabledIndices: g })
                        )),
                    wo(n.current, N.current) && (N.current = -1),
                    X($));
            }
        }),
        ee = v.useMemo(
            () => ({
                onFocus(j) {
                    ((Q.current = !0), Ce(j));
                },
                onClick: ({ currentTarget: j }) => j.focus({ preventScroll: !0 }),
                onMouseMove(j) {
                    ((Q.current = !0), (H.current = !1), p && Ce(j));
                },
                onPointerLeave(j) {
                    if (!z.current || !D.current || j.pointerType === 'touch') return;
                    Q.current = !0;
                    const se = j.relatedTarget;
                    if (
                        !(!p || n.current.includes(se)) &&
                        ge.current &&
                        (q.current?.(), (q.current = null), (N.current = -1), X(j), !c)
                    ) {
                        const G = L.current,
                            he = wt(_e(G));
                        G && de(G, he) && G.focus({ preventScroll: !0 });
                    }
                },
            }),
            [Ce, z, L, p, n, X, ge, c]
        ),
        ye = v.useMemo(() => c && S && ue && { 'aria-activedescendant': `${b}-${r}` }, [c, S, ue, b, r]),
        ke = v.useMemo(
            () => ({
                'aria-orientation': m === 'both' ? void 0 : m,
                ...(O ? {} : ye),
                onKeyDown($) {
                    if ($.key === 'Tab' && $.shiftKey && S && !c) {
                        const j = Rt($.nativeEvent);
                        if (j && !de(L.current, j)) return;
                        (Pt($), M.setOpen(!1, Ie($a, $.nativeEvent)), Le(I) && I.focus());
                        return;
                    }
                    ce($);
                },
                onPointerMove() {
                    D.current = !0;
                },
            }),
            [ye, ce, L, m, O, M, S, c, I]
        ),
        ae = v.useMemo(() => {
            function $(G) {
                M.setOpen(!0, Ie(yl, G.nativeEvent, G.currentTarget));
            }
            function j(G) {
                f === 'auto' && mf(G.nativeEvent) && (B.current = !c);
            }
            function se(G) {
                ((B.current = f), f === 'auto' && gf(G.nativeEvent) && (B.current = !0));
            }
            return {
                onKeyDown(G) {
                    const he = M.select('open');
                    D.current = !1;
                    const ut = G.key.startsWith('Arrow'),
                        Ue = AR(G.key, Ee(), l),
                        He = As(G.key, m),
                        nt = (u ? Ue : He) || G.key === 'Enter' || G.key.trim() === '';
                    if (c && he) return ce(G);
                    if (!(!he && !h && ut)) {
                        if (nt) {
                            const It = As(G.key, Ee());
                            U.current = u && It ? null : G.key;
                        }
                        if (u) {
                            Ue && (Pt(G), he ? ((N.current = re()), X(G)) : $(G));
                            return;
                        }
                        He &&
                            (J.current != null && (N.current = J.current), Pt(G), !he && h ? $(G) : ce(G), he && X(G));
                    }
                },
                onFocus(G) {
                    M.select('open') && !c && ((N.current = -1), X(G));
                },
                onPointerDown: se,
                onPointerEnter: se,
                onMouseDown: j,
                onClick: j,
            };
        }, [ce, f, re, u, X, M, h, m, Ee, l, J, c]),
        Ve = v.useMemo(() => ({ ...ye, ...ae }), [ye, ae]);
    return v.useMemo(() => (o ? { reference: Ve, floating: ke, item: ee, trigger: ae } : {}), [o, Ve, ke, ae, ee]);
}
function jC(e, t) {
    const {
            listRef: n,
            elementsRef: r,
            activeIndex: s,
            onMatch: o,
            disabledIndices: i,
            onTyping: a,
            enabled: d = !0,
            resetMs: u = 750,
            selectedIndex: l = null,
        } = t,
        c = 'rootStore' in e ? e.rootStore : e,
        f = c.useState('open'),
        p = Ut(),
        h = v.useRef(''),
        g = v.useRef(l ?? s ?? -1),
        m = v.useRef(null),
        y = me((w) => {
            function E(L) {
                const k = r?.current[L];
                return !k || Wo(k);
            }
            function C(L) {
                return E(L) ? i == null || !So(rS, L, i) : !1;
            }
            function M(L, k, _ = 0) {
                if (L.length === 0) return -1;
                const B = ((_ % L.length) + L.length) % L.length,
                    N = k.toLowerCase();
                for (let U = 0; U < L.length; U += 1) {
                    const D = (B + U) % L.length;
                    if (!(!L[D]?.toLowerCase().startsWith(N) || !C(D))) return D;
                }
                return -1;
            }
            const S = n.current;
            if (
                (h.current.length > 0 && w.key === ' ' && (Pt(w), a?.(!0)),
                h.current.length > 0 && h.current[0] !== ' ' && M(S, h.current) === -1 && w.key !== ' ' && a?.(!1),
                S == null || w.key.length !== 1 || w.ctrlKey || w.metaKey || w.altKey)
            )
                return;
            f && w.key !== ' ' && (Pt(w), a?.(!0));
            const P = h.current === '';
            (P && (g.current = l ?? s ?? -1),
                S.every((L, k) => (L && C(k) ? L[0]?.toLowerCase() !== L[1]?.toLowerCase() : !0)) &&
                    h.current === w.key &&
                    ((h.current = ''), (g.current = m.current)),
                (h.current += w.key),
                p.start(u, () => {
                    ((h.current = ''), (g.current = m.current), a?.(!1));
                }));
            const A = ((P ? (l ?? s ?? -1) : g.current) ?? 0) + 1,
                O = M(S, h.current, A);
            O !== -1 ? (o?.(O), (m.current = O)) : w.key !== ' ' && ((h.current = ''), a?.(!1));
        }),
        b = me((w) => {
            const E = w.relatedTarget,
                C = c.select('domReferenceElement'),
                M = c.select('floatingElement');
            de(C, E) || de(M, E) || (p.clear(), (h.current = ''), (g.current = m.current), a?.(!1));
        });
    (fe(() => {
        (!f && l !== null) || (p.clear(), (m.current = null), h.current !== '' && (h.current = ''));
    }, [f, l, p]),
        fe(() => {
            f && h.current === '' && (g.current = l ?? s ?? -1);
        }, [f, l, s]));
    const R = v.useMemo(() => ({ onKeyDown: y, onBlur: b }), [y, b]);
    return v.useMemo(() => (d ? { reference: R, floating: R } : {}), [d, R]);
}
const Wl = 0.1,
    LR = Wl * Wl,
    Te = 0.5;
function _s(e, t, n, r, s, o) {
    return r >= t != o >= t && e <= ((s - n) * (t - r)) / (o - r) + n;
}
function Ls(e, t, n, r, s, o, i, a, d, u) {
    let l = !1;
    return (
        _s(e, t, n, r, s, o) && (l = !l),
        _s(e, t, s, o, i, a) && (l = !l),
        _s(e, t, i, a, d, u) && (l = !l),
        _s(e, t, d, u, n, r) && (l = !l),
        l
    );
}
function DR(e, t, n) {
    return e >= n.x && e <= n.x + n.width && t >= n.y && t <= n.y + n.height;
}
function Ds(e, t, n, r, s, o) {
    const i = Math.min(n, s),
        a = Math.max(n, s),
        d = Math.min(r, o),
        u = Math.max(r, o);
    return e >= i && e <= a && t >= d && t <= u;
}
function VR(e = {}) {
    const { blockPointerEvents: t = !1 } = e,
        n = new cn(),
        r = ({ x: s, y: o, placement: i, elements: a, onClose: d, nodeId: u, tree: l }) => {
            const c = i?.split('-')[0];
            let f = !1,
                p = null,
                h = null,
                g = typeof performance < 'u' ? performance.now() : 0;
            function m(b, R) {
                const w = performance.now(),
                    E = w - g;
                if (p === null || h === null || E === 0) return ((p = b), (h = R), (g = w), !1);
                const C = b - p,
                    M = R - h,
                    S = C * C + M * M,
                    P = E * E * LR;
                return ((p = b), (h = R), (g = w), S < P);
            }
            function y() {
                (n.clear(), d());
            }
            return function (R) {
                n.clear();
                const w = a.domReference,
                    E = a.floating;
                if (!w || !E || c == null || s == null || o == null) return;
                const { clientX: C, clientY: M } = R,
                    S = Rt(R),
                    P = R.type === 'mouseleave',
                    I = de(E, S),
                    V = de(w, S);
                if (I && ((f = !0), !P)) return;
                if (V && ((f = !1), !P)) {
                    f = !0;
                    return;
                }
                if (P && ve(R.relatedTarget) && de(E, R.relatedTarget)) return;
                function A() {
                    return !!(l && Cn(l.nodesRef.current, u).length > 0);
                }
                function O() {
                    A() || y();
                }
                if (A()) return;
                const L = w.getBoundingClientRect(),
                    k = E.getBoundingClientRect(),
                    _ = s > k.right - k.width / 2,
                    B = o > k.bottom - k.height / 2,
                    N = k.width > L.width,
                    U = k.height > L.height,
                    D = (N ? L : k).left,
                    X = (N ? L : k).right,
                    Z = (U ? L : k).top,
                    Y = (U ? L : k).bottom;
                if (
                    (c === 'top' && o >= L.bottom - 1) ||
                    (c === 'bottom' && o <= L.top + 1) ||
                    (c === 'left' && s >= L.right - 1) ||
                    (c === 'right' && s <= L.left + 1)
                ) {
                    O();
                    return;
                }
                let Q = !1;
                switch (c) {
                    case 'top':
                        Q = Ds(C, M, D, L.top + 1, X, k.bottom - 1);
                        break;
                    case 'bottom':
                        Q = Ds(C, M, D, k.top + 1, X, L.bottom - 1);
                        break;
                    case 'left':
                        Q = Ds(C, M, k.right - 1, Y, L.left + 1, Z);
                        break;
                    case 'right':
                        Q = Ds(C, M, L.right - 1, Y, k.left + 1, Z);
                        break;
                }
                if (Q) return;
                if (f && !DR(C, M, L)) {
                    O();
                    return;
                }
                if (!P && m(C, M)) {
                    O();
                    return;
                }
                let H = !1;
                switch (c) {
                    case 'top': {
                        const q = N ? Te / 2 : Te * 4,
                            pe = N || _ ? s + q : s - q,
                            z = N ? s - q : _ ? s + q : s - q,
                            J = o + Te + 1,
                            ge = _ || N ? k.bottom - Te : k.top,
                            we = _ ? (N ? k.bottom - Te : k.top) : k.bottom - Te;
                        H = Ls(C, M, pe, J, z, J, k.left, ge, k.right, we);
                        break;
                    }
                    case 'bottom': {
                        const q = N ? Te / 2 : Te * 4,
                            pe = N || _ ? s + q : s - q,
                            z = N ? s - q : _ ? s + q : s - q,
                            J = o - Te,
                            ge = _ || N ? k.top + Te : k.bottom,
                            we = _ ? (N ? k.top + Te : k.bottom) : k.top + Te;
                        H = Ls(C, M, pe, J, z, J, k.left, ge, k.right, we);
                        break;
                    }
                    case 'left': {
                        const q = U ? Te / 2 : Te * 4,
                            pe = U || B ? o + q : o - q,
                            z = U ? o - q : B ? o + q : o - q,
                            J = s + Te + 1,
                            ge = B || U ? k.right - Te : k.left,
                            we = B ? (U ? k.right - Te : k.left) : k.right - Te;
                        H = Ls(C, M, ge, k.top, we, k.bottom, J, pe, J, z);
                        break;
                    }
                    case 'right': {
                        const q = U ? Te / 2 : Te * 4,
                            pe = U || B ? o + q : o - q,
                            z = U ? o - q : B ? o + q : o - q,
                            J = s - Te,
                            ge = B || U ? k.left + Te : k.right,
                            we = B ? (U ? k.left + Te : k.right) : k.left + Te;
                        H = Ls(C, M, J, pe, J, z, ge, k.top, we, k.bottom);
                        break;
                    }
                }
                H ? f || n.start(40, O) : O();
            };
        };
    return ((r.__options = { ...e, blockPointerEvents: t }), r);
}
const NR = {
    ...MR,
    disabled: Re((e) => e.disabled),
    instantType: Re((e) => e.instantType),
    isInstantPhase: Re((e) => e.isInstantPhase),
    trackCursorAxis: Re((e) => e.trackCursorAxis),
    disableHoverablePopup: Re((e) => e.disableHoverablePopup),
    lastOpenChangeReason: Re((e) => e.openChangeReason),
    closeOnClick: Re((e) => e.closeOnClick),
    closeDelay: Re((e) => e.closeDelay),
    hasViewport: Re((e) => e.hasViewport),
};
class rc extends oh {
    constructor(t, n, r = !1) {
        const s = new Za(),
            o = { ...jR(), ...t };
        ((o.floatingRootContext = RR(s, n, r)),
            super(
                o,
                { popupRef: v.createRef(), onOpenChange: void 0, onOpenChangeComplete: void 0, triggerElements: s },
                NR
            ));
    }
    setOpen = (t, n) => {
        mR(this, t, n, { extraState: { openChangeReason: n.reason } });
    };
    cancelPendingOpen(t) {
        this.state.floatingRootContext.dispatchOpenChange(!1, Ie(ps, t));
    }
    static useStore(t, n) {
        return dR(t, (s, o) => new rc(n, s, o)).store;
    }
}
function jR() {
    return {
        ...xR(),
        disabled: !1,
        instantType: void 0,
        isInstantPhase: !1,
        trackCursorAxis: 'none',
        disableHoverablePopup: !1,
        openChangeReason: null,
        closeOnClick: !0,
        closeDelay: 0,
        hasViewport: !1,
    };
}
const BR = uf(function (t) {
    const {
            disabled: n = !1,
            defaultOpen: r = !1,
            open: s,
            disableHoverablePopup: o = !1,
            trackCursorAxis: i = 'none',
            actionsRef: a,
            onOpenChange: d,
            onOpenChangeComplete: u,
            handle: l,
            triggerId: c,
            defaultTriggerId: f = null,
            children: p,
        } = t,
        h = rc.useStore(l?.store, { open: r, openProp: s, activeTriggerId: f, triggerIdProp: c });
    (gR(h, s, r, f),
        h.useControlledProp('openProp', s),
        h.useControlledProp('triggerIdProp', c),
        h.useContextCallback('onOpenChange', d),
        h.useContextCallback('onOpenChangeComplete', u));
    const g = h.useState('open'),
        m = !n && g,
        y = h.useState('activeTriggerId'),
        b = h.useState('mounted'),
        R = h.useState('payload');
    (h.useSyncedValues({ trackCursorAxis: i, disableHoverablePopup: o }),
        h.useSyncedValue('disabled', n),
        bR(h, { closeOnActiveTriggerUnmount: !0 }));
    const { forceUnmount: w, transitionStatus: E } = vR(m, h),
        C = h.useState('isInstantPhase'),
        M = h.useState('instantType'),
        S = h.useState('lastOpenChangeReason'),
        P = v.useRef(null);
    (fe(() => {
        g && n && h.setOpen(!1, Ie(sS));
    }, [g, n, h]),
        fe(() => {
            (E === 'ending' && S === Ba) || (E !== 'ending' && C)
                ? (M !== 'delay' && (P.current = M), h.set('instantType', 'delay'))
                : P.current !== null && (h.set('instantType', P.current), (P.current = null));
        }, [E, C, S, M, h]),
        fe(() => {
            m && y == null && h.set('payload', void 0);
        }, [h, y, m]));
    const I = v.useCallback(() => {
        h.setOpen(!1, Ie(oS));
    }, [h]);
    v.useImperativeHandle(a, () => ({ unmount: w, close: I }), [w, I]);
    const V = m || b || (!n && i !== 'none');
    return F.jsxs(df.Provider, {
        value: h,
        children: [
            V && F.jsx($R, { store: h, disabled: n, trackCursorAxis: i }),
            typeof p == 'function' ? p({ payload: R }) : p,
        ],
    });
});
function $R({ store: e, disabled: t, trackCursorAxis: n }) {
    const r = e.useState('floatingRootContext'),
        s = cx(r, { enabled: !t, referencePress: () => e.select('closeOnClick') }),
        o = ox(r, { enabled: !t && n !== 'none', axis: n === 'none' ? void 0 : n }),
        i = v.useMemo(() => wr(o.reference, s.reference), [o.reference, s.reference]),
        a = v.useMemo(() => wr(o.trigger, s.trigger), [o.trigger, s.trigger]),
        d = v.useMemo(() => wr(uR, o.floating, s.floating), [o.floating, s.floating]);
    return (wR(e, { activeTriggerProps: i, inactiveTriggerProps: a, popupProps: d }), null);
}
let sc = (function (e) {
        return (
            (e.open = 'data-open'),
            (e.closed = 'data-closed'),
            (e[(e.startingStyle = os.startingStyle)] = 'startingStyle'),
            (e[(e.endingStyle = os.endingStyle)] = 'endingStyle'),
            (e.anchorHidden = 'data-anchor-hidden'),
            (e.side = 'data-side'),
            (e.align = 'data-align'),
            e
        );
    })({}),
    Po = (function (e) {
        return ((e.popupOpen = 'data-popup-open'), (e.pressed = 'data-pressed'), e);
    })({});
const zR = { [Po.popupOpen]: '' },
    UR = { [Po.popupOpen]: '', [Po.pressed]: '' },
    HR = { [sc.open]: '' },
    WR = { [sc.closed]: '' },
    KR = { [sc.anchorHidden]: '' },
    GR = {
        open(e) {
            return e ? zR : null;
        },
    },
    BC = {
        open(e) {
            return e ? UR : null;
        },
    },
    oc = {
        open(e) {
            return e ? HR : WR;
        },
        anchorHidden(e) {
            return e ? KR : null;
        },
    };
function qR(e) {
    return gs(e, 'base-ui');
}
const lh = v.createContext(void 0);
function QR() {
    return v.useContext(lh);
}
let YR = (function (e) {
    return ((e[(e.popupOpen = Po.popupOpen)] = 'popupOpen'), (e.triggerDisabled = 'data-trigger-disabled'), e);
})({});
const XR = 600,
    uh = 'data-base-ui-tooltip-trigger';
function Kl(e) {
    if ('composedPath' in e) {
        const n = e.composedPath();
        for (let r = 0; r < n.length; r += 1) {
            const s = n[r];
            if (ve(s)) return s;
        }
    }
    const t = e.target;
    return ve(t) ? t : null;
}
function JR(e) {
    let t = e;
    for (; t;) {
        if (t.hasAttribute(uh)) return t;
        const n = t.parentElement;
        if (n) {
            t = n;
            continue;
        }
        const r = t.getRootNode();
        t = 'host' in r && ve(r.host) ? r.host : null;
    }
    return null;
}
const ZR = Lw(function (t, n) {
        const {
                render: r,
                className: s,
                style: o,
                handle: i,
                payload: a,
                disabled: d,
                delay: u,
                closeOnClick: l = !0,
                closeDelay: c,
                id: f,
                ...p
            } = t,
            h = fs(!0),
            g = i?.store ?? h;
        if (!g) throw new Error(ir(82));
        const m = qR(f),
            y = g.useState('isTriggerActive', m),
            b = g.useState('isOpenedByTrigger', m),
            R = g.useState('floatingRootContext'),
            w = v.useRef(null),
            E = u ?? XR,
            C = c ?? 0,
            { registerTrigger: M, isMountedByThisTrigger: S } = yR(m, w, g, {
                payload: a,
                closeOnClick: l,
                closeDelay: C,
            }),
            P = QR(),
            { delayRef: I, isInstantPhase: V, hasProvider: A } = cS(R, { open: b }),
            O = nc(R);
        g.useSyncedValue('isInstantPhase', V);
        const L = g.useState('disabled'),
            k = d ?? L,
            _ = ze(k),
            B = g.useState('trackCursorAxis'),
            N = g.useState('disableHoverablePopup'),
            U = v.useRef(!1),
            D = Ut(),
            X = v.useRef(void 0);
        function Z() {
            const W = P?.delay,
                ie = typeof I.current == 'object' ? I.current.open : void 0;
            let ue = E;
            return (A && (ie !== 0 ? (ue = u ?? W ?? E) : (ue = 0)), ue);
        }
        function Y(W) {
            const ie = w.current;
            if (!ie || !W) return !1;
            const ue = JR(W);
            return ue !== null && ue !== ie && de(ie, ue);
        }
        function Q(W) {
            const ie = Y(W);
            return (
                (U.current = ie),
                ie && (O.openChangeTimeout.clear(), O.restTimeout.clear(), (O.restTimeoutPending = !1), D.clear()),
                ie
            );
        }
        const H = kR(R, {
                enabled: !k,
                mouseOnly: !0,
                move: !1,
                handleClose: !N && B !== 'both' ? VR() : null,
                restMs: Z,
                delay() {
                    const W = typeof I.current == 'object' ? I.current.close : void 0;
                    let ie = C;
                    return (c == null && A && (ie = W), { close: ie });
                },
                triggerElementRef: w,
                isActiveTrigger: y,
                isClosing: () => g.select('transitionStatus') === 'ending',
                shouldOpen() {
                    return !U.current;
                },
            }),
            q = TR(R, { enabled: !k }).reference,
            pe = (W) => {
                const ie = U.current,
                    ue = Kl(W),
                    Ce = Q(ue),
                    Ee = w.current,
                    re = Ee && ue && de(Ee, ue);
                if (Ce && g.select('open') && g.select('lastOpenChangeReason') === St) {
                    g.setOpen(!1, Ie(St, W));
                    return;
                }
                if (ie && !Ce && re && !_.current && !g.select('open') && Ee && nr(X.current)) {
                    const ce = () => {
                            !U.current && !_.current && !g.select('open') && g.setOpen(!0, Ie(St, W, Ee));
                        },
                        ee = Z();
                    ee === 0 ? (D.clear(), ce()) : D.start(ee, ce);
                }
            },
            z = g.useState('triggerProps', S);
        return Ir('button', t, {
            state: { open: b },
            ref: [n, M, w],
            props: [
                H,
                q,
                S || B !== 'none' ? z : void 0,
                {
                    onMouseOver(W) {
                        pe(W.nativeEvent);
                    },
                    onFocus(W) {
                        Y(Kl(W.nativeEvent)) && W.preventBaseUIHandler();
                    },
                    onMouseLeave() {
                        ((U.current = !1), D.clear(), (X.current = void 0));
                    },
                    onPointerEnter(W) {
                        X.current = W.pointerType;
                    },
                    onPointerDown(W) {
                        ((X.current = W.pointerType),
                            g.set('closeOnClick', l),
                            l && !g.select('open') && g.cancelPendingOpen(W.nativeEvent));
                    },
                    onClick(W) {
                        l && !g.select('open') && g.cancelPendingOpen(W.nativeEvent);
                    },
                    id: m,
                    [YR.triggerDisabled]: k ? '' : void 0,
                    [uh]: k ? void 0 : '',
                },
                p,
            ],
            stateAttributesMapping: GR,
        });
    }),
    dh = v.createContext(void 0);
function eE() {
    const e = v.useContext(dh);
    if (e === void 0) throw new Error(ir(70));
    return e;
}
const tE = v.forwardRef(function (t, n) {
        const { children: r, container: s, className: o, render: i, style: a, ...d } = t,
            { portalNode: u, portalSubtree: l } = Kf({ container: s, ref: n, componentProps: t, elementProps: d });
        return !l && !u ? null : F.jsxs(v.Fragment, { children: [l, u && Pn.createPortal(r, u)] });
    }),
    nE = v.forwardRef(function (t, n) {
        const { keepMounted: r = !1, ...s } = t;
        return fs().useState('mounted') || r
            ? F.jsx(dh.Provider, { value: r, children: F.jsx(tE, { ref: n, ...s }) })
            : null;
    }),
    fh = v.createContext(void 0);
function hh() {
    const e = v.useContext(fh);
    if (e === void 0) throw new Error(ir(71));
    return e;
}
const rE = v.createContext(void 0);
function sE() {
    return v.useContext(rE)?.direction ?? 'ltr';
}
const oE = (e) => ({
        name: 'arrow',
        options: e,
        async fn(t) {
            const { x: n, y: r, placement: s, rects: o, platform: i, elements: a, middlewareData: d } = t,
                { element: u, padding: l = 0, offsetParent: c = 'real' } = un(e, t) || {};
            if (u == null) return {};
            const f = Cf(l),
                p = { x: n, y: r },
                h = Ka(s),
                g = Wa(h),
                m = await i.getDimensions(u),
                y = h === 'y',
                b = y ? 'top' : 'left',
                R = y ? 'bottom' : 'right',
                w = y ? 'clientHeight' : 'clientWidth',
                E = o.reference[g] + o.reference[h] - p[h] - o.floating[g],
                C = p[h] - o.reference[h],
                M = c === 'real' ? await i.getOffsetParent?.(u) : a.floating;
            let S = a.floating[w] || o.floating[g];
            (!S || !(await i.isElement?.(M))) && (S = a.floating[w] || o.floating[g]);
            const P = E / 2 - C / 2,
                I = S / 2 - m[g] / 2 - 1,
                V = Math.min(f[b], I),
                A = Math.min(f[R], I),
                O = V,
                L = S - m[g] - A,
                k = S / 2 - m[g] / 2 + P,
                _ = Zi(O, k, L),
                B = !d.arrow && An(s) != null && k !== _ && o.reference[g] / 2 - (k < O ? V : A) - m[g] / 2 < 0,
                N = B ? (k < O ? k - O : k - L) : 0;
            return {
                [h]: p[h] + N,
                data: { [h]: _, centerOffset: k - _ - N, ...(B && { alignmentOffset: N }) },
                reset: B,
            };
        },
    }),
    iE = (e, t) => ({ ...oE(e), options: [e, t] }),
    aE = Qx().fn,
    cE = {
        name: 'hide',
        async fn(e) {
            const { width: t, height: n, x: r, y: s } = e.rects.reference,
                o = t === 0 && n === 0 && r === 0 && s === 0;
            return { data: { referenceHidden: (await aE(e)).data?.referenceHidden || o } };
        },
    },
    Xs = { sideX: 'left', sideY: 'top' },
    lE = {
        name: 'adaptiveOrigin',
        async fn(e) {
            const {
                    x: t,
                    y: n,
                    rects: { floating: r },
                    elements: { floating: s },
                    platform: o,
                    strategy: i,
                    placement: a,
                } = e,
                d = tt(s),
                u = d.getComputedStyle(s);
            if (!(u.transitionDuration !== '0s' && u.transitionDuration !== '')) return { x: t, y: n, data: Xs };
            const c = await o.getOffsetParent?.(s);
            let f = { width: 0, height: 0 };
            if (i === 'fixed' && d?.visualViewport)
                f = { width: d.visualViewport.width, height: d.visualViewport.height };
            else if (c === d) {
                const b = _e(s);
                f = { width: b.documentElement.clientWidth, height: b.documentElement.clientHeight };
            } else (await o.isElement?.(c)) && (f = await o.getDimensions(c));
            const p = Et(a);
            let h = t,
                g = n;
            (p === 'left' && (h = f.width - (t + r.width)), p === 'top' && (g = f.height - (n + r.height)));
            const m = p === 'left' ? 'right' : Xs.sideX,
                y = p === 'top' ? 'bottom' : Xs.sideY;
            return { x: h, y: g, data: { sideX: m, sideY: y } };
        },
    };
function ph(e, t, n) {
    const r = e === 'inline-start' || e === 'inline-end';
    return {
        top: 'top',
        right: r ? (n ? 'inline-start' : 'inline-end') : 'right',
        bottom: 'bottom',
        left: r ? (n ? 'inline-end' : 'inline-start') : 'left',
    }[t];
}
function Gl(e, t, n) {
    const { rects: r, placement: s } = e;
    return {
        side: ph(t, Et(s), n),
        align: An(s) || 'center',
        anchor: { width: r.reference.width, height: r.reference.height },
        positioner: { width: r.floating.width, height: r.floating.height },
    };
}
function uE(e) {
    const {
            anchor: t,
            positionMethod: n = 'absolute',
            side: r = 'bottom',
            sideOffset: s = 0,
            align: o = 'center',
            alignOffset: i = 0,
            collisionBoundary: a,
            collisionPadding: d = 5,
            sticky: u = !1,
            arrowPadding: l = 5,
            disableAnchorTracking: c = !1,
            inline: f,
            keepMounted: p = !1,
            floatingRootContext: h,
            mounted: g,
            collisionAvoidance: m,
            shiftCrossAxis: y = !1,
            nodeId: b,
            adaptiveOrigin: R,
            lazyFlip: w = !1,
            externalTree: E,
        } = e,
        [C, M] = v.useState(null);
    !g && C !== null && M(null);
    const S = m.side || 'flip',
        P = m.align || 'flip',
        I = m.fallbackAxisSide || 'end',
        V = typeof t == 'function' ? t : void 0,
        A = me(V),
        O = V ? A : t,
        L = ze(t),
        k = ze(g),
        B = sE() === 'rtl',
        N =
            C ||
            {
                top: 'top',
                right: 'right',
                bottom: 'bottom',
                left: 'left',
                'inline-end': B ? 'left' : 'right',
                'inline-start': B ? 'right' : 'left',
            }[r],
        U = o === 'center' ? N : `${N}-${o}`;
    let D = d;
    const X = 1,
        Z = r === 'bottom' ? X : 0,
        Y = r === 'top' ? X : 0,
        Q = r === 'right' ? X : 0,
        H = r === 'left' ? X : 0;
    typeof D == 'number'
        ? (D = { top: D + Z, right: D + H, bottom: D + Y, left: D + Q })
        : D &&
          (D = {
              top: (D.top || 0) + Z,
              right: (D.right || 0) + H,
              bottom: (D.bottom || 0) + Y,
              left: (D.left || 0) + Q,
          });
    const q = { boundary: a === 'clipping-ancestors' ? 'clippingAncestors' : a, padding: D },
        pe = v.useRef(null),
        z = ze(s),
        J = ze(i),
        ge = typeof s != 'function' ? s : 0,
        we = typeof i != 'function' ? i : 0,
        W = [];
    (f && W.push(f),
        W.push(
            Hx(
                (Se) => {
                    const rt = Gl(Se, r, B),
                        Ft = typeof z.current == 'function' ? z.current(rt) : z.current,
                        dt = typeof J.current == 'function' ? J.current(rt) : J.current;
                    return { mainAxis: Ft, crossAxis: dt, alignmentAxis: dt };
                },
                [ge, we, B, r]
            )
        ));
    const ie = P === 'none' && S !== 'shift',
        ue = !ie && (u || y || S === 'shift'),
        Ce =
            S === 'none'
                ? null
                : Gx({
                      ...q,
                      padding: { top: D.top + X, right: D.right + X, bottom: D.bottom + X, left: D.left + X },
                      mainAxis: !y && S === 'flip',
                      crossAxis: P === 'flip' ? 'alignment' : !1,
                      fallbackAxisSideDirection: I,
                  }),
        Ee = ie
            ? null
            : Wx(
                  (Se) => {
                      const rt = _e(Se.elements.floating).documentElement;
                      return {
                          ...q,
                          rootBoundary: y ? { x: 0, y: 0, width: rt.clientWidth, height: rt.clientHeight } : void 0,
                          mainAxis: P !== 'none',
                          crossAxis: ue,
                          limiter:
                              u || y
                                  ? void 0
                                  : Kx((Ft) => {
                                        if (!pe.current) return {};
                                        const { width: dt, height: kt } = pe.current.getBoundingClientRect(),
                                            le = At(Et(Ft.placement)),
                                            Oe = le === 'y' ? dt : kt,
                                            Ne = le === 'y' ? D.left + D.right : D.top + D.bottom;
                                        return { offset: Oe / 2 + Ne / 2 };
                                    }),
                      };
                  },
                  [q, u, y, D, P]
              );
    (S === 'shift' || P === 'shift' || o === 'center' ? W.push(Ee, Ce) : W.push(Ce, Ee),
        W.push(
            qx({
                ...q,
                apply({ elements: { floating: Se }, availableWidth: rt, availableHeight: Ft, rects: dt }) {
                    if (!k.current) return;
                    const kt = Se.style;
                    (kt.setProperty('--available-width', `${rt}px`), kt.setProperty('--available-height', `${Ft}px`));
                    const le = tt(Se).devicePixelRatio || 1,
                        { x: Oe, y: Ne, width: Je, height: pn } = dt.reference,
                        $e = (Math.round((Oe + Je) * le) - Math.round(Oe * le)) / le,
                        it = (Math.round((Ne + pn) * le) - Math.round(Ne * le)) / le;
                    (kt.setProperty('--anchor-width', `${$e}px`), kt.setProperty('--anchor-height', `${it}px`));
                },
            }),
            iE(
                (Se) => ({
                    element: pe.current || _e(Se.elements.floating).createElement('div'),
                    padding: l,
                    offsetParent: 'floating',
                }),
                [l]
            ),
            {
                name: 'transformOrigin',
                fn(Se) {
                    const { elements: rt, middlewareData: Ft, placement: dt, rects: kt, y: le } = Se,
                        Oe = Et(dt),
                        Ne = At(Oe),
                        Je = pe.current,
                        pn = Ft.arrow?.x || 0,
                        $e = Ft.arrow?.y || 0,
                        it = Je?.clientWidth || 0,
                        ur = Je?.clientHeight || 0,
                        ft = pn + it / 2,
                        bt = $e + ur / 2,
                        bs = Math.abs(Ft.shift?.y || 0),
                        Yt = kt.reference.height / 2,
                        dr = typeof s == 'function' ? s(Gl(Se, r, B)) : s,
                        Lh = bs > dr,
                        Dh = {
                            top: `${ft}px calc(100% + ${dr}px)`,
                            bottom: `${ft}px ${-dr}px`,
                            left: `calc(100% + ${dr}px) ${bt}px`,
                            right: `${-dr}px ${bt}px`,
                        }[Oe],
                        Vh = `${ft}px ${kt.reference.y + Yt - le}px`;
                    return (rt.floating.style.setProperty('--transform-origin', ue && Ne === 'y' && Lh ? Vh : Dh), {});
                },
            },
            cE,
            R
        ),
        fe(() => {
            !g &&
                h &&
                h.update({
                    referenceElement: null,
                    floatingElement: null,
                    domReferenceElement: null,
                    positionReference: null,
                });
        }, [g, h]));
    const re = v.useMemo(
            () => ({
                elementResize: !c && typeof ResizeObserver < 'u',
                layoutShift: !c && typeof IntersectionObserver < 'u',
            }),
            [c]
        ),
        {
            refs: ce,
            elements: ee,
            x: ye,
            y: ke,
            middlewareData: ae,
            update: Ve,
            placement: $,
            context: j,
            isPositioned: se,
            floatingStyles: G,
        } = PR({
            rootContext: h,
            open: p ? g : void 0,
            placement: U,
            middleware: W,
            strategy: n,
            whileElementsMounted: p ? void 0 : (...Se) => zl(...Se, re),
            nodeId: b,
            externalTree: E,
        }),
        { sideX: he, sideY: ut } = ae.adaptiveOrigin || Xs,
        Ue = se ? n : 'fixed',
        He = v.useMemo(() => {
            const Se = R ? { position: Ue, [he]: ye, [ut]: ke } : { position: Ue, ...G };
            return (se || (Se.opacity = 0), Se);
        }, [R, Ue, he, ye, ut, ke, G, se]),
        nt = v.useRef(null);
    (fe(() => {
        if (!g) return;
        const Se = L.current,
            rt = typeof Se == 'function' ? Se() : Se,
            dt = (ql(rt) ? rt.current : rt) || null || null;
        dt !== nt.current && (ce.setPositionReference(dt), (nt.current = dt));
    }, [g, ce, O, L]),
        v.useEffect(() => {
            if (!g) return;
            const Se = L.current;
            typeof Se != 'function' &&
                ql(Se) &&
                Se.current !== nt.current &&
                (ce.setPositionReference(Se.current), (nt.current = Se.current));
        }, [g, ce, O, L]),
        v.useEffect(() => {
            if (p && g && ee.reference && ee.floating) return zl(ee.reference, ee.floating, Ve, re);
        }, [p, g, ee, Ve, re]));
    const It = Et($),
        cr = ph(r, It, B),
        _n = An($) || 'center',
        Ln = !!ae.hide?.referenceHidden;
    fe(() => {
        w && g && se && M(It);
    }, [w, g, se, It]);
    const lr = v.useMemo(() => ({ position: 'absolute', top: ae.arrow?.y, left: ae.arrow?.x }), [ae.arrow]),
        hn = ae.arrow?.centerOffset !== 0;
    return v.useMemo(
        () => ({
            positionerStyles: He,
            arrowStyles: lr,
            arrowRef: pe,
            arrowUncentered: hn,
            side: cr,
            align: _n,
            physicalSide: It,
            anchorHidden: Ln,
            refs: ce,
            context: j,
            isPositioned: se,
            update: Ve,
        }),
        [He, lr, pe, hn, cr, _n, It, Ln, ce, j, se, Ve]
    );
}
function ql(e) {
    return e != null && 'current' in e;
}
function mh(e) {
    return e === 'starting' ? YS : lt;
}
function dE(e, t, { styles: n, transitionStatus: r, props: s, refs: o, hidden: i, inert: a = !1 }) {
    const d = { ...n };
    return (
        a && (d.pointerEvents = 'none'),
        Ir('div', e, {
            state: t,
            ref: o,
            props: [{ role: 'presentation', hidden: i, style: d }, mh(r), s],
            stateAttributesMapping: oc,
        })
    );
}
const fE = v.forwardRef(function (t, n) {
        const {
                render: r,
                className: s,
                anchor: o,
                positionMethod: i = 'absolute',
                side: a = 'top',
                align: d = 'center',
                sideOffset: u = 0,
                alignOffset: l = 0,
                collisionBoundary: c = 'clipping-ancestors',
                collisionPadding: f = 5,
                arrowPadding: p = 5,
                sticky: h = !1,
                disableAnchorTracking: g = !1,
                collisionAvoidance: m = JS,
                style: y,
                ...b
            } = t,
            R = fs(),
            w = eE(),
            E = R.useState('open'),
            C = R.useState('mounted'),
            M = R.useState('trackCursorAxis'),
            S = R.useState('disableHoverablePopup'),
            P = R.useState('floatingRootContext'),
            I = R.useState('instantType'),
            V = R.useState('transitionStatus'),
            A = R.useState('hasViewport'),
            O = uE({
                anchor: o,
                positionMethod: i,
                floatingRootContext: P,
                mounted: C,
                side: a,
                sideOffset: u,
                align: d,
                alignOffset: l,
                collisionBoundary: c,
                collisionPadding: f,
                sticky: h,
                arrowPadding: p,
                disableAnchorTracking: g,
                keepMounted: w,
                collisionAvoidance: m,
                adaptiveOrigin: A ? lE : void 0,
            }),
            L = v.useMemo(
                () => ({
                    open: E,
                    side: O.side,
                    align: O.align,
                    anchorHidden: O.anchorHidden,
                    instant: M !== 'none' ? 'tracking-cursor' : I,
                }),
                [E, O.side, O.align, O.anchorHidden, M, I]
            ),
            k = dE(t, L, {
                styles: O.positionerStyles,
                transitionStatus: V,
                props: b,
                refs: [n, R.useStateSetter('positionerElement')],
                hidden: !C,
                inert: !E || M === 'both' || S,
            });
        return F.jsx(fh.Provider, { value: O, children: k });
    }),
    hE = { ...oc, ...cR },
    pE = v.forwardRef(function (t, n) {
        const { render: r, className: s, style: o, ...i } = t,
            a = fs(),
            { side: d, align: u } = hh(),
            l = a.useState('open'),
            c = a.useState('instantType'),
            f = a.useState('transitionStatus'),
            p = a.useState('popupProps'),
            h = a.useState('floatingRootContext'),
            g = a.useState('disabled'),
            m = a.useState('closeDelay');
        (ih({
            open: l,
            ref: a.context.popupRef,
            onComplete() {
                l && a.context.onOpenChangeComplete?.(!0);
            },
        }),
            IR(h, { enabled: !g, closeDelay: m }));
        const y = a.useStateSetter('popupElement');
        return Ir('div', t, {
            state: { open: l, side: d, align: u, instant: c, transitionStatus: f },
            ref: [n, a.context.popupRef, y],
            props: [p, mh(f), i],
            stateAttributesMapping: hE,
        });
    }),
    mE = v.forwardRef(function (t, n) {
        const { render: r, className: s, style: o, ...i } = t,
            a = fs(),
            { arrowRef: d, side: u, align: l, arrowUncentered: c, arrowStyles: f } = hh(),
            p = a.useState('open'),
            h = a.useState('instantType');
        return Ir('div', t, {
            state: { open: p, side: u, align: l, uncentered: c, instant: h },
            ref: [n, d],
            props: [{ style: f, 'aria-hidden': !0 }, i],
            stateAttributesMapping: oc,
        });
    }),
    gE = function (t) {
        const { delay: n, closeDelay: r, timeout: s = 400 } = t,
            o = v.useMemo(() => ({ delay: n, closeDelay: r }), [n, r]),
            i = v.useMemo(() => ({ open: n, close: r }), [n, r]);
        return F.jsx(lh.Provider, { value: o, children: F.jsx(aS, { delay: i, timeoutMs: s, children: t.children }) });
    };
function $C(e) {
    return qa(19) ? e : e ? 'true' : void 0;
}
function zC(e) {
    const [t, n] = v.useState({ current: e, previous: null });
    return (e !== t.current && n({ current: e, previous: t.current }), t.previous);
}
function yE(e) {
    const t = Xe.c(6);
    let n, r;
    t[0] !== e ? (({ delay: r, ...n } = e), (t[0] = e), (t[1] = n), (t[2] = r)) : ((n = t[1]), (r = t[2]));
    const s = r === void 0 ? 0 : r;
    let o;
    return (
        t[3] !== s || t[4] !== n
            ? ((o = F.jsx(gE, { 'data-slot': 'tooltip-provider', delay: s, ...n })), (t[3] = s), (t[4] = n), (t[5] = o))
            : (o = t[5]),
        o
    );
}
function UC(e) {
    const t = Xe.c(2);
    let n;
    return (t[0] !== e ? ((n = F.jsx(BR, { 'data-slot': 'tooltip', ...e })), (t[0] = e), (t[1] = n)) : (n = t[1]), n);
}
function HC(e) {
    const t = Xe.c(2);
    let n;
    return (
        t[0] !== e ? ((n = F.jsx(ZR, { 'data-slot': 'tooltip-trigger', ...e })), (t[0] = e), (t[1] = n)) : (n = t[1]),
        n
    );
}
function WC(e) {
    const t = Xe.c(21);
    let n, r, s, o, i, a, d;
    t[0] !== e
        ? (({ className: r, side: o, sideOffset: i, align: a, alignOffset: d, children: n, ...s } = e),
          (t[0] = e),
          (t[1] = n),
          (t[2] = r),
          (t[3] = s),
          (t[4] = o),
          (t[5] = i),
          (t[6] = a),
          (t[7] = d))
        : ((n = t[1]), (r = t[2]), (s = t[3]), (o = t[4]), (i = t[5]), (a = t[6]), (d = t[7]));
    const u = o === void 0 ? 'top' : o,
        l = i === void 0 ? 8 : i,
        c = a === void 0 ? 'center' : a,
        f = d === void 0 ? 0 : d;
    let p;
    t[8] !== r
        ? ((p = Kt(
              'motion-safe:data-open:animate-in motion-safe:data-open:fade-in-0 motion-safe:data-open:zoom-in-95 motion-safe:data-[state=delayed-open]:animate-in motion-safe:data-[state=delayed-open]:fade-in-0 motion-safe:data-[state=delayed-open]:zoom-in-95 motion-safe:data-closed:animate-out motion-safe:data-closed:fade-out-0 motion-safe:data-closed:zoom-out-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs has-data-[slot=kbd]:pr-1.5 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm motion-safe:data-[side=inline-start]:slide-in-from-right-2 motion-safe:data-[side=inline-end]:slide-in-from-left-2 w-fit max-w-xs origin-(--transform-origin) bg-foreground text-background',
              r
          )),
          (t[8] = r),
          (t[9] = p))
        : (p = t[9]);
    let h;
    t[10] === Symbol.for('react.memo_cache_sentinel')
        ? ((h = F.jsx(mE, {
              className:
                  'size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-xs data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5',
          })),
          (t[10] = h))
        : (h = t[10]);
    let g;
    t[11] !== n || t[12] !== s || t[13] !== p
        ? ((g = F.jsxs(pE, { 'data-slot': 'tooltip-content', className: p, ...s, children: [n, h] })),
          (t[11] = n),
          (t[12] = s),
          (t[13] = p),
          (t[14] = g))
        : (g = t[14]);
    let m;
    return (
        t[15] !== c || t[16] !== f || t[17] !== u || t[18] !== l || t[19] !== g
            ? ((m = F.jsx(nE, {
                  children: F.jsx(fE, {
                      align: c,
                      alignOffset: f,
                      side: u,
                      sideOffset: l,
                      className: 'isolate',
                      children: g,
                  }),
              })),
              (t[15] = c),
              (t[16] = f),
              (t[17] = u),
              (t[18] = l),
              (t[19] = g),
              (t[20] = m))
            : (m = t[20]),
        m
    );
}
const bE = `
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
`,
    vE = `
:root { --initial-bg: rgb(255 255 255); }
html.dark { --initial-bg: rgb(25 25 26); }
html { font-family: "Geist", sans-serif; }
body { background-color: var(--initial-bg); margin: 0; position: relative; }
`,
    wE = Bd,
    SE = Bd,
    Qo = hv()({
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
        shellComponent: xE,
        component: RE,
    });
function xE(e) {
    const t = Xe.c(8),
        { children: n } = e;
    let r, s;
    t[0] === Symbol.for('react.memo_cache_sentinel')
        ? ((r = F.jsx(Lv, {})),
          (s = F.jsx('script', { dangerouslySetInnerHTML: { __html: bE } })),
          (t[0] = r),
          (t[1] = s))
        : ((r = t[0]), (s = t[1]));
    let o;
    t[2] === Symbol.for('react.memo_cache_sentinel')
        ? ((o = F.jsxs('head', {
              children: [r, s, F.jsx('style', { id: 'initial-style', dangerouslySetInnerHTML: { __html: vE } })],
          })),
          (t[2] = o))
        : (o = t[2]);
    let i;
    t[3] !== n
        ? ((i = F.jsx('div', { id: 'root', className: 'flex flex-col h-dvh isolate', children: n })),
          (t[3] = n),
          (t[4] = i))
        : (i = t[4]);
    let a;
    t[5] === Symbol.for('react.memo_cache_sentinel') ? ((a = F.jsx(Dv, {})), (t[5] = a)) : (a = t[5]);
    let d;
    return (
        t[6] !== i
            ? ((d = F.jsxs('html', {
                  lang: 'en',
                  className: 'font-sans',
                  children: [
                      o,
                      F.jsxs('body', {
                          className: 'text-foreground bg-background antialiased relative',
                          children: [i, a],
                      }),
                  ],
              })),
              (t[6] = i),
              (t[7] = d))
            : (d = t[7]),
        d
    );
}
function RE() {
    const e = Xe.c(3);
    B0();
    let t;
    e[0] === Symbol.for('react.memo_cache_sentinel') ? ((t = F.jsx(Dd, {})), (e[0] = t)) : (t = e[0]);
    let n;
    e[1] === Symbol.for('react.memo_cache_sentinel')
        ? ((n = F.jsxs(yE, {
              children: [t, F.jsx(Ow, { richColors: !0, closeButton: !0, swipeDirections: ['bottom'] })],
          })),
          (e[1] = n))
        : (n = e[1]);
    let r;
    return (
        e[2] === Symbol.for('react.memo_cache_sentinel')
            ? ((r = F.jsx(Pb, {
                  client: jd,
                  children: F.jsxs(N0, {
                      children: [
                          n,
                          F.jsxs(v.Suspense, {
                              children: [F.jsx(wE, { position: 'bottom-right' }), F.jsx(SE, { position: 'bottom' })],
                          }),
                      ],
                  }),
              })),
              (e[2] = r))
            : (r = e[2]),
        r
    );
}
const EE = 'modulepreload',
    ME = function (e) {
        return '/' + e;
    },
    Ql = {},
    Qt = function (t, n, r) {
        let s = Promise.resolve();
        if (n && n.length > 0) {
            let d = function (u) {
                return Promise.all(
                    u.map((l) =>
                        Promise.resolve(l).then(
                            (c) => ({ status: 'fulfilled', value: c }),
                            (c) => ({ status: 'rejected', reason: c })
                        )
                    )
                );
            };
            document.getElementsByTagName('link');
            const i = document.querySelector('meta[property=csp-nonce]'),
                a = i?.nonce || i?.getAttribute('nonce');
            s = d(
                n.map((u) => {
                    if (((u = ME(u)), u in Ql)) return;
                    Ql[u] = !0;
                    const l = u.endsWith('.css'),
                        c = l ? '[rel="stylesheet"]' : '';
                    if (document.querySelector(`link[href="${u}"]${c}`)) return;
                    const f = document.createElement('link');
                    if (
                        ((f.rel = l ? 'stylesheet' : EE),
                        l || (f.as = 'script'),
                        (f.crossOrigin = ''),
                        (f.href = u),
                        a && f.setAttribute('nonce', a),
                        document.head.appendChild(f),
                        l)
                    )
                        return new Promise((p, h) => {
                            (f.addEventListener('load', p),
                                f.addEventListener('error', () => h(new Error(`Unable to preload CSS for ${u}`))));
                        });
                })
            );
        }
        function o(i) {
            const a = new Event('vite:preloadError', { cancelable: !0 });
            if (((a.payload = i), window.dispatchEvent(a), !a.defaultPrevented)) throw i;
        }
        return s.then((i) => {
            for (const a of i || []) a.status === 'rejected' && o(a.reason);
            return t().catch(o);
        });
    };
function Yl(e) {
    return e !== '__proto__' && e !== 'constructor' && e !== 'prototype';
}
function sa(e, t) {
    const n = Object.create(null);
    if (e) for (const r of Object.keys(e)) Yl(r) && (n[r] = e[r]);
    if (t && typeof t == 'object') for (const r of Object.keys(t)) Yl(r) && (n[r] = t[r]);
    return n;
}
function gh(e) {
    return Object.create(null);
}
var yh = () => {
        throw new Error('createServerOnlyFn() functions can only be called on the server!');
    },
    st = (e, t) => {
        const n = t || e || {};
        typeof n.method > 'u' && (n.method = 'GET');
        const r = (i) => st(void 0, { ...n, validator: i, inputValidator: i });
        return Object.assign((i) => st(void 0, { ...n, ...i }), {
            options: n,
            middleware: (i) => {
                const a = [...(n.middleware || [])];
                i.map((u) => {
                    dc in u ? u.options.middleware && a.push(...u.options.middleware) : a.push(u);
                });
                const d = st(void 0, { ...n, middleware: a });
                return ((d[dc] = !0), d);
            },
            validator: r,
            inputValidator: r,
            handler: (...i) => {
                const [a, d] = i,
                    u = { ...n, extractedFn: a, serverFn: d },
                    l = [...(u.middleware || []), TE(u)];
                return (
                    (a.method = n.method),
                    Object.assign(
                        async (c) => {
                            const f = await Xl(l, 'client', {
                                    ...a,
                                    ...u,
                                    data: c?.data,
                                    headers: c?.headers,
                                    signal: c?.signal,
                                    fetch: c?.fetch,
                                    context: gh(),
                                }),
                                p = Cu(f.error);
                            if (p) throw p;
                            if (f.error) throw f.error;
                            return f.result;
                        },
                        {
                            ...a,
                            method: n.method,
                            __executeServer: async (c) => {
                                const f = yh(),
                                    p = f.contextAfterGlobalMiddlewares;
                                return await Xl(l, 'server', {
                                    ...a,
                                    ...c,
                                    serverFnMeta: a.serverFnMeta,
                                    context: sa(c.context, p),
                                    request: f.request,
                                }).then((h) => ({ result: h.result, error: h.error, context: h.sendContext }));
                            },
                        }
                    )
                );
            },
        });
    };
async function Xl(e, t, n) {
    let r = CE([...(ua()?.functionMiddleware || []), ...e]);
    if (t === 'server') {
        const o = yh();
        o?.executedRequestMiddlewares && (r = r.filter((i) => !o.executedRequestMiddlewares.has(i)));
    }
    const s = async (o) => {
        const i = r.shift();
        if (!i) return o;
        try {
            let a = 'validator' in i.options ? i.options.validator : void 0;
            (!a && 'inputValidator' in i.options && (a = i.options.inputValidator),
                a && t === 'server' && (o.data = await PE(a, o.data)));
            let d;
            if (
                (t === 'client'
                    ? 'client' in i.options && (d = i.options.client)
                    : 'server' in i.options && (d = i.options.server),
                d)
            ) {
                const l = await d({
                    ...o,
                    next: async (c = {}) => {
                        const f = await s({
                            ...o,
                            ...c,
                            context: sa(o.context, c.context),
                            sendContext: sa(o.sendContext, c.sendContext),
                            headers: Zy(o.headers, c.headers),
                            _callSiteFetch: o._callSiteFetch,
                            fetch: o._callSiteFetch ?? c.fetch ?? o.fetch,
                            result: c.result !== void 0 ? c.result : c instanceof Response ? c : o.result,
                            error: c.error ?? o.error,
                        });
                        if (f.error) throw f.error;
                        return f;
                    },
                });
                if (ct(l)) return { ...o, error: l };
                if (l instanceof Response) return { ...o, result: l };
                if (!l)
                    throw new Error(
                        'User middleware returned undefined. You must call next() or return a result in your middlewares.'
                    );
                return l;
            }
            return s(o);
        } catch (a) {
            return { ...o, error: a };
        }
    };
    return s({
        ...n,
        headers: n.headers || {},
        sendContext: n.sendContext || {},
        context: n.context || gh(),
        _callSiteFetch: n.fetch,
    });
}
function CE(e, t = 100) {
    const n = new Set(),
        r = [],
        s = (o, i) => {
            if (i > t)
                throw new Error(`Middleware nesting depth exceeded maximum of ${t}. Check for circular references.`);
            o.forEach((a) => {
                (a.options.middleware && s(a.options.middleware, i + 1), n.has(a) || (n.add(a), r.push(a)));
            });
        };
    return (s(e, 0), r);
}
async function PE(e, t) {
    if (e == null) return {};
    if ('~standard' in e) {
        const n = await e['~standard'].validate(t);
        if (n.issues) throw new Error(JSON.stringify(n.issues, void 0, 2));
        return n.value;
    }
    if ('parse' in e) return e.parse(t);
    if (typeof e == 'function') return e(t);
    throw new Error('Invalid validator type!');
}
function TE(e) {
    return {
        '~types': void 0,
        options: {
            inputValidator: e.validator ?? e.inputValidator,
            client: async ({ next: t, sendContext: n, fetch: r, ...s }) => {
                const o = { ...s, context: n, fetch: r };
                return t(await e.extractedFn?.(o));
            },
            server: async ({ next: t, ...n }) => {
                const r = await e.serverFn?.(n);
                return t({ ...n, result: r });
            },
        },
    };
}
const IE = st({ method: 'POST' }).handler(yt('ebfc11faca05eae0aa69ac0fed4d252bd151c9caf5e3b97f56c115ee04adcf98')),
    FE = st({ method: 'POST' }).handler(yt('de679316d5ed59ce667549d45bf242b425b91745d24de4534c58ef303c01d680')),
    kE = st({ method: 'POST' }).handler(yt('541821caf8acb648a6880b1dd1a4064ae0cde067de0c012d4e72e79439c9d1a3')),
    OE = st({ method: 'GET' }).handler(yt('61e62bee5fe070e3d3451243793279e26aa2ea6e59850d90ff70cb33d287d148')),
    jt = {
        all: ['auth'],
        meQueryKey() {
            return [...jt.all, 'me'];
        },
        loginMutationKey() {
            return [...jt.all, 'login'];
        },
        activateMutationKey() {
            return [...jt.all, 'activate'];
        },
        logoutMutationKey() {
            return [...jt.all, 'logout'];
        },
    },
    ic = () => ({
        queryKey: jt.meQueryKey(),
        queryFn() {
            return OE();
        },
        staleTime: 0,
    }),
    KC = () => ({
        mutationKey: jt.loginMutationKey(),
        mutationFn(e) {
            return IE({ data: e });
        },
        onSuccess(e, t, n, { client: r }) {
            r.setQueryData(jt.meQueryKey(), e);
        },
    }),
    GC = () => ({
        mutationKey: jt.activateMutationKey(),
        mutationFn(e) {
            return FE({ data: e });
        },
        onSuccess(e, t, n, { client: r }) {
            r.setQueryData(jt.meQueryKey(), e);
        },
    }),
    qC = () => ({
        mutationKey: jt.logoutMutationKey(),
        mutationFn() {
            return kE();
        },
    }),
    AE = () => Qt(() => import('./route-CvpCBWE5.js'), __vite__mapDeps([0, 1, 2])),
    _E = Ht('/_unauthenticated')({
        validateSearch: hu({
            redirect: pu()
                .refine((e) => e.startsWith('/') && !e.startsWith('//'))
                .optional()
                .catch(''),
        }),
        async beforeLoad({ context: { queryClient: e }, search: t }) {
            let n = null;
            try {
                n = await e.ensureQueryData(ic());
            } catch {}
            if (n) throw xr({ to: t.redirect || g0, replace: !0 });
        },
        component: Wt(AE, 'component'),
    }),
    LE = () => Qt(() => import('./route-b0KtfCgL.js'), __vite__mapDeps([3, 1, 2])),
    DE = Ht('/_public')({
        async beforeLoad({ context: { queryClient: e } }) {
            try {
                const t = await e.ensureQueryData(ic());
                if (t) return { auth: { me: t, isAuthenticated: !0 } };
            } catch {}
            return { auth: { me: null, isAuthenticated: !1 } };
        },
        component: Wt(LE, 'component'),
    }),
    VE = () => Qt(() => import('./route-Bxa2kfp4.js'), __vite__mapDeps([4, 1, 5, 6, 7, 2])),
    NE = Ht('/_authenticated')({
        async beforeLoad({ context: { queryClient: e }, location: t }) {
            const n = { to: '/login', search: { redirect: t.href }, replace: !0 };
            try {
                const r = await e.ensureQueryData(ic());
                if (!r) throw xr(n);
                return { auth: { isAuthenticated: !0, me: r } };
            } catch (r) {
                throw ct(r) ? r : xr(n);
            }
        },
        component: Wt(VE, 'component'),
    }),
    jE = () => Qt(() => import('./index-BE_a3b1D.js'), __vite__mapDeps([8, 1, 2])),
    BE = Ht('/_public/')({ component: Wt(jE, 'component') }),
    $E = () => Qt(() => import('./index-CaxdFBgf.js'), __vite__mapDeps([9, 1, 10, 2, 11, 7, 6])),
    zE = Ht('/_unauthenticated/login/')({ component: Wt($E, 'component') }),
    UE = () => Qt(() => import('./index-DyMSxq9l.js'), __vite__mapDeps([12, 1, 10, 11, 7, 6, 2])),
    HE = Ht('/_unauthenticated/activate/')({
        validateSearch: hu({ token: pu().optional().catch('') }),
        component: Wt(UE, 'component'),
    }),
    QC = {
        [Ke.head]: { id: Ke.head, label: 'Head' },
        [Ke.teamLead]: { id: Ke.teamLead, label: 'Team Lead' },
        [Ke.buyer]: { id: Ke.buyer, label: 'Buyer' },
        [Ke.designer]: { id: Ke.designer, label: 'Designer' },
        [Ke.bdm]: { id: Ke.bdm, label: 'BDM' },
    },
    WE = {
        admin: { view: [Ke.head] },
        merchants: { view: [Ke.teamLead, Ke.head], item: { view: [Ke.teamLead, Ke.head], update: [Ke.head] } },
        vouchers: { view: [Ke.head], update: [Ke.head], item: { view: [Ke.head] } },
    },
    KE = (e, t) => {
        const n = e.split('.'),
            r = structuredClone(WE),
            s = n.reduce((o, i) => o[i], r);
        return Array.isArray(s) && s.includes(t);
    },
    ac = (e, t) => {
        if (!KE(e, t)) throw ha();
    },
    GE = () => Qt(() => import('./index-DPQbE8CJ.js'), __vite__mapDeps([13, 1, 14, 5, 6, 2])),
    qE = Ht('/_authenticated/vouchers/')({
        beforeLoad({ context: { auth: e } }) {
            ac('vouchers.view', e.me.role);
        },
        component: Wt(GE, 'component'),
    }),
    QE = () => Qt(() => import('./index-Mm-D9E6O.js'), __vite__mapDeps([15, 1, 14, 5, 6, 2])),
    YE = Ht('/_authenticated/merchants/')({
        beforeLoad({ context: { auth: e } }) {
            ac('merchants.view', e.me.role);
        },
        component: Wt(QE, 'component'),
    }),
    XE = () => Qt(() => import('./index-B5JXjj6F.js'), __vite__mapDeps([16, 1, 14, 5, 6, 2])),
    JE = Ht('/_authenticated/dashboard/')({ component: Wt(XE, 'component') }),
    ZE = st({ method: 'GET' }).handler(yt('6d69451eee36ff58fb791cbb4eec0f15e3ea56b6b1cf8d46d959d43547a6fbb3')),
    e1 = st({ method: 'GET' }).handler(yt('45893ca7f6a1a2b0ddd1eab61ee06e5568c27b0977a5c12f1b0e803535312e74')),
    t1 = st({ method: 'POST' }).handler(yt('f1629487f63b203d7703bbab0987d78ec5a5fd55b5f1da4a061f8891d9dff976')),
    n1 = st({ method: 'POST' }).handler(yt('234f4cead3236d9dbf1e5435c147da848cc8d58286433eb3fe7f127f9f6cee98')),
    r1 = st({ method: 'POST' }).handler(yt('11a07940daad52d178b28c761c31f13e0abf489057b0545f01b18e88f37e23e8')),
    s1 = st({ method: 'POST' }).handler(yt('5dae9ea880ac4b6fc903edbb803c9a8f7204127c6bbeded7b8286402673f232d')),
    o1 = st({ method: 'POST' }).handler(yt('eed2d0a904899c29f8b6f308600676242b268d9827ca9d37fd051a72a96ab871')),
    i1 = st({ method: 'POST' }).handler(yt('c9fe8570b6ba7c14cef30cfedd5a8ed7e79b6654992f280c6569c005a92691e1')),
    a1 = st({ method: 'POST' }).handler(yt('c4e96b41d3c28bedef7426fc9a09126d4197153b4285d64558a96b563da0c38a')),
    c1 = st({ method: 'POST' }).handler(yt('ba37af0122d3475dd1b7289425ea54d9ddeecd11372fa2e7f24fbd03f12ddca0')),
    Pe = {
        all: ['admin'],
        usersQueryKey() {
            return [...Pe.all, 'users'];
        },
        teamsQueryKey() {
            return [...Pe.all, 'teams'];
        },
        createUserMutationKey() {
            return [...Pe.all, 'create-user'];
        },
        resendInvitationMutationKey() {
            return [...Pe.all, 'resend-invitation'];
        },
        updateUserMutationKey() {
            return [...Pe.all, 'update-user'];
        },
        deleteUserMutationKey() {
            return [...Pe.all, 'delete-user'];
        },
        createTeamMutationKey() {
            return [...Pe.all, 'create-team'];
        },
        updateTeamMutationKey() {
            return [...Pe.all, 'update-team'];
        },
        deleteTeamMutationKey() {
            return [...Pe.all, 'delete-team'];
        },
        setTeamLeadMutationKey() {
            return [...Pe.all, 'set-team-lead'];
        },
    },
    l1 = () => ({
        queryKey: Pe.usersQueryKey(),
        queryFn() {
            return ZE();
        },
    }),
    u1 = () => ({
        queryKey: Pe.teamsQueryKey(),
        queryFn() {
            return e1();
        },
    }),
    YC = () => ({
        mutationKey: Pe.createUserMutationKey(),
        mutationFn(e) {
            return n1({ data: e });
        },
        onSuccess(e, t, n, { client: r }) {
            r.invalidateQueries({ queryKey: Pe.usersQueryKey() });
        },
    }),
    XC = () => ({
        mutationKey: Pe.deleteUserMutationKey(),
        mutationFn(e) {
            return r1({ data: e });
        },
        onSuccess(e, t, n, { client: r }) {
            (r.invalidateQueries({ queryKey: Pe.usersQueryKey() }),
                r.invalidateQueries({ queryKey: Pe.teamsQueryKey() }));
        },
    }),
    JC = () => ({
        mutationKey: Pe.resendInvitationMutationKey(),
        mutationFn(e) {
            return s1({ data: e });
        },
    }),
    ZC = () => ({
        mutationKey: Pe.updateUserMutationKey(),
        mutationFn(e) {
            return o1({ data: e });
        },
        onSuccess(e, t, n, { client: r }) {
            r.invalidateQueries({ queryKey: Pe.usersQueryKey() });
        },
    }),
    eP = () => ({
        mutationKey: Pe.createTeamMutationKey(),
        mutationFn(e) {
            return t1({ data: e });
        },
        onSuccess(e, t, n, { client: r }) {
            r.invalidateQueries({ queryKey: Pe.teamsQueryKey() });
        },
    }),
    tP = () => ({
        mutationKey: Pe.updateTeamMutationKey(),
        mutationFn(e) {
            return i1({ data: e });
        },
        onSuccess(e, t, n, { client: r }) {
            r.invalidateQueries({ queryKey: Pe.teamsQueryKey() });
        },
    }),
    nP = () => ({
        mutationKey: Pe.deleteTeamMutationKey(),
        mutationFn(e) {
            return a1({ data: e });
        },
        onSuccess(e, t, n, { client: r }) {
            (r.invalidateQueries({ queryKey: Pe.teamsQueryKey() }),
                r.invalidateQueries({ queryKey: Pe.usersQueryKey() }));
        },
    }),
    rP = () => ({
        mutationKey: Pe.setTeamLeadMutationKey(),
        mutationFn(e) {
            return c1({ data: e });
        },
        onSuccess(e, t, n, { client: r }) {
            (r.invalidateQueries({ queryKey: Pe.teamsQueryKey() }),
                r.invalidateQueries({ queryKey: Pe.usersQueryKey() }));
        },
    }),
    d1 = () => Qt(() => import('./index-CG7XaCY0.js'), __vite__mapDeps([17, 1, 14, 5, 6, 2, 11, 7])),
    f1 = Ht('/_authenticated/admin/')({
        beforeLoad({ context: { auth: e } }) {
            ac('admin.view', e.me.role);
        },
        async loader({ context: { queryClient: e } }) {
            await Promise.all([e.ensureQueryData(l1()), e.ensureQueryData(u1())]);
        },
        component: Wt(d1, 'component'),
    }),
    cc = _E.update({ id: '/_unauthenticated', getParentRoute: () => Qo }),
    bh = DE.update({ id: '/_public', getParentRoute: () => Qo }),
    ys = NE.update({ id: '/_authenticated', getParentRoute: () => Qo }),
    h1 = BE.update({ id: '/', path: '/', getParentRoute: () => bh }),
    p1 = zE.update({ id: '/login/', path: '/login/', getParentRoute: () => cc }),
    m1 = HE.update({ id: '/activate/', path: '/activate/', getParentRoute: () => cc }),
    g1 = qE.update({ id: '/vouchers/', path: '/vouchers/', getParentRoute: () => ys }),
    y1 = YE.update({ id: '/merchants/', path: '/merchants/', getParentRoute: () => ys }),
    b1 = JE.update({ id: '/dashboard/', path: '/dashboard/', getParentRoute: () => ys }),
    v1 = f1.update({ id: '/admin/', path: '/admin/', getParentRoute: () => ys }),
    w1 = {
        AuthenticatedAdminIndexRoute: v1,
        AuthenticatedDashboardIndexRoute: b1,
        AuthenticatedMerchantsIndexRoute: y1,
        AuthenticatedVouchersIndexRoute: g1,
    },
    S1 = ys._addFileChildren(w1),
    x1 = { PublicIndexRoute: h1 },
    R1 = bh._addFileChildren(x1),
    E1 = { UnauthenticatedActivateIndexRoute: m1, UnauthenticatedLoginIndexRoute: p1 },
    M1 = cc._addFileChildren(E1),
    C1 = { AuthenticatedRouteRoute: S1, PublicRouteRoute: R1, UnauthenticatedRouteRoute: M1 },
    P1 = Qo._addFileChildren(C1);
const vh = (...e) =>
    e
        .filter((t, n, r) => !!t && t.trim() !== '' && r.indexOf(t) === n)
        .join(' ')
        .trim();
const T1 = (e) => e.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const I1 = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (t, n, r) => (r ? r.toUpperCase() : n.toLowerCase()));
const Jl = (e) => {
    const t = I1(e);
    return t.charAt(0).toUpperCase() + t.slice(1);
};
var vi = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};
const F1 = (e) => {
        for (const t in e) if (t.startsWith('aria-') || t === 'role' || t === 'title') return !0;
        return !1;
    },
    k1 = v.createContext({}),
    O1 = () => v.useContext(k1),
    A1 = v.forwardRef(
        (
            {
                color: e,
                size: t,
                strokeWidth: n,
                absoluteStrokeWidth: r,
                className: s = '',
                children: o,
                iconNode: i,
                ...a
            },
            d
        ) => {
            const {
                    size: u = 24,
                    strokeWidth: l = 2,
                    absoluteStrokeWidth: c = !1,
                    color: f = 'currentColor',
                    className: p = '',
                } = O1() ?? {},
                h = (r ?? c) ? (Number(n ?? l) * 24) / Number(t ?? u) : (n ?? l);
            return v.createElement(
                'svg',
                {
                    ref: d,
                    ...vi,
                    width: t ?? u ?? vi.width,
                    height: t ?? u ?? vi.height,
                    stroke: e ?? f,
                    strokeWidth: h,
                    className: vh('lucide', p, s),
                    ...(!o && !F1(a) && { 'aria-hidden': 'true' }),
                    ...a,
                },
                [...i.map(([g, m]) => v.createElement(g, m)), ...(Array.isArray(o) ? o : [o])]
            );
        }
    );
const Be = (e, t) => {
    const n = v.forwardRef(({ className: r, ...s }, o) =>
        v.createElement(A1, { ref: o, iconNode: t, className: vh(`lucide-${T1(Jl(e))}`, `lucide-${e}`, r), ...s })
    );
    return ((n.displayName = Jl(e)), n);
};
const _1 = [['path', { d: 'M20 6 9 17l-5-5', key: '1gmf2c' }]],
    sP = Be('check', _1);
const L1 = [['path', { d: 'm9 18 6-6-6-6', key: 'mthhwq' }]],
    oP = Be('chevron-right', L1);
const D1 = [
        ['path', { d: 'm7 15 5 5 5-5', key: '1hf1tw' }],
        ['path', { d: 'm7 9 5-5 5 5', key: 'sgt6xg' }],
    ],
    iP = Be('chevrons-up-down', D1);
const V1 = [['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }]],
    aP = Be('circle', V1);
const N1 = [
        ['rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2', key: '17jyea' }],
        ['path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2', key: 'zix9uf' }],
    ],
    cP = Be('copy', N1);
const j1 = [
        [
            'path',
            {
                d: 'M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49',
                key: 'ct8e1f',
            },
        ],
        ['path', { d: 'M14.084 14.158a3 3 0 0 1-4.242-4.242', key: '151rxh' }],
        [
            'path',
            {
                d: 'M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143',
                key: '13bj9a',
            },
        ],
        ['path', { d: 'm2 2 20 20', key: '1ooewy' }],
    ],
    lP = Be('eye-off', j1);
const B1 = [
        [
            'path',
            {
                d: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0',
                key: '1nclc0',
            },
        ],
        ['circle', { cx: '12', cy: '12', r: '3', key: '1v7zrd' }],
    ],
    uP = Be('eye', B1);
const $1 = [
        [
            'path',
            {
                d: 'M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z',
                key: '1oefj6',
            },
        ],
        ['path', { d: 'M14 2v5a1 1 0 0 0 1 1h5', key: 'wfsgrz' }],
        ['circle', { cx: '11.5', cy: '14.5', r: '2.5', key: '1bq0ko' }],
        ['path', { d: 'M13.3 16.3 15 18', key: '2quom7' }],
    ],
    z1 = Be('file-search', $1);
const U1 = [
        ['path', { d: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8', key: '5wwlr5' }],
        [
            'path',
            {
                d: 'M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
                key: 'r6nss1',
            },
        ],
    ],
    H1 = Be('house', U1);
const W1 = [
        ['rect', { width: '7', height: '9', x: '3', y: '3', rx: '1', key: '10lvy0' }],
        ['rect', { width: '7', height: '5', x: '14', y: '3', rx: '1', key: '16une8' }],
        ['rect', { width: '7', height: '9', x: '14', y: '12', rx: '1', key: '1hutg5' }],
        ['rect', { width: '7', height: '5', x: '3', y: '16', rx: '1', key: 'ldoo1y' }],
    ],
    dP = Be('layout-dashboard', W1);
const K1 = [['path', { d: 'M21 12a9 9 0 1 1-6.219-8.56', key: '13zald' }]],
    G1 = Be('loader-circle', K1);
const q1 = [
        ['path', { d: 'm10 17 5-5-5-5', key: '1bsop3' }],
        ['path', { d: 'M15 12H3', key: '6jk70r' }],
        ['path', { d: 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4', key: 'u53s6r' }],
    ],
    fP = Be('log-in', q1);
const Q1 = [
        ['path', { d: 'm16 17 5-5-5-5', key: '1bji2h' }],
        ['path', { d: 'M21 12H9', key: 'dn1m92' }],
        ['path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', key: '1uf3rs' }],
    ],
    hP = Be('log-out', Q1);
const Y1 = [
        ['path', { d: 'm15 9-6 6', key: '1uzhvr' }],
        [
            'path',
            {
                d: 'M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z',
                key: '2d38gg',
            },
        ],
        ['path', { d: 'm9 9 6 6', key: 'z0biqf' }],
    ],
    X1 = Be('octagon-x', Y1);
const J1 = [
        ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2', key: 'afitv7' }],
        ['path', { d: 'M9 3v18', key: 'fh3hqa' }],
    ],
    pP = Be('panel-left', J1);
const Z1 = [
        ['path', { d: 'M5 12h14', key: '1ays0h' }],
        ['path', { d: 'M12 5v14', key: 's699le' }],
    ],
    mP = Be('plus', Z1);
const eM = [
        ['path', { d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8', key: '1357e3' }],
        ['path', { d: 'M3 3v5h5', key: '1xhq8a' }],
    ],
    tM = Be('rotate-ccw', eM);
const nM = [
        [
            'path',
            {
                d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
                key: 'oel41y',
            },
        ],
        ['path', { d: 'M6.376 18.91a6 6 0 0 1 11.249.003', key: 'hnjrf2' }],
        ['circle', { cx: '12', cy: '11', r: '4', key: '1gt34v' }],
    ],
    gP = Be('shield-user', nM);
const rM = [
        ['path', { d: 'M16 10a4 4 0 0 1-8 0', key: '1ltviw' }],
        ['path', { d: 'M3.103 6.034h17.794', key: 'awc11p' }],
        [
            'path',
            {
                d: 'M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z',
                key: 'o988cm',
            },
        ],
    ],
    yP = Be('shopping-bag', rM);
const sM = [
        ['circle', { cx: '12', cy: '12', r: '4', key: '4exip2' }],
        ['path', { d: 'M12 2v2', key: 'tus03m' }],
        ['path', { d: 'M12 20v2', key: '1lh1kg' }],
        ['path', { d: 'm4.93 4.93 1.41 1.41', key: '149t6j' }],
        ['path', { d: 'm17.66 17.66 1.41 1.41', key: 'ptbguv' }],
        ['path', { d: 'M2 12h2', key: '1t8f8n' }],
        ['path', { d: 'M20 12h2', key: '1q8mjw' }],
        ['path', { d: 'm6.34 17.66-1.41 1.41', key: '1m8zz5' }],
        ['path', { d: 'm19.07 4.93-1.41 1.41', key: '1shlcs' }],
    ],
    bP = Be('sun', sM);
const oM = [
        ['path', { d: 'm3.173 8.18 11-5a2 2 0 0 1 2.647.993L18.56 8', key: '15hfpj' }],
        ['path', { d: 'M6 10V8', key: '1y41hn' }],
        ['path', { d: 'M6 14v1', key: 'cao2tf' }],
        ['path', { d: 'M6 19v2', key: '1loha6' }],
        ['rect', { x: '2', y: '8', width: '20', height: '13', rx: '2', key: 'p3bz5l' }],
    ],
    vP = Be('tickets', oM);
const iM = [
        ['path', { d: 'M18 6 6 18', key: '1bl5f8' }],
        ['path', { d: 'm6 6 12 12', key: 'd8bk6v' }],
    ],
    wP = Be('x', iM),
    aM = v.createContext(void 0);
function cM(e = !1) {
    const t = v.useContext(aM);
    if (t === void 0 && !e) throw new Error(ir(16));
    return t;
}
function lM(e) {
    const { focusableWhenDisabled: t, disabled: n, composite: r = !1, tabIndex: s = 0, isNativeButton: o } = e,
        i = r && t !== !1,
        a = r && t === !1;
    return {
        props: v.useMemo(() => {
            const u = {
                onKeyDown(l) {
                    n && t && l.key !== 'Tab' && l.preventDefault();
                },
            };
            return (
                r || ((u.tabIndex = s), !o && n && (u.tabIndex = t ? s : -1)),
                ((o && (t || i)) || (!o && n)) && (u['aria-disabled'] = n),
                o && (!t || a) && (u.disabled = n),
                u
            );
        }, [r, n, t, i, a, o, s]),
    };
}
function uM(e = {}) {
    const { disabled: t = !1, focusableWhenDisabled: n, tabIndex: r = 0, native: s = !0, composite: o } = e,
        i = v.useRef(null),
        a = cM(!0),
        d = o ?? a !== void 0,
        { props: u } = lM({ focusableWhenDisabled: n, disabled: t, composite: d, tabIndex: r, isNativeButton: s }),
        l = v.useCallback(() => {
            const p = i.current;
            wi(p) && d && t && u.disabled === void 0 && p.disabled && (p.disabled = !1);
        }, [t, u.disabled, d]);
    fe(l, [l]);
    const c = v.useCallback(
            (p = {}) => {
                const { onClick: h, onMouseDown: g, onKeyUp: m, onKeyDown: y, onPointerDown: b, ...R } = p;
                return wr(
                    {
                        onClick(w) {
                            if (t) {
                                w.preventDefault();
                                return;
                            }
                            h?.(w);
                        },
                        onMouseDown(w) {
                            t || g?.(w);
                        },
                        onKeyDown(w) {
                            if (t || (Ro(w), y?.(w), w.baseUIHandlerPrevented)) return;
                            const E = w.target === w.currentTarget,
                                C = w.currentTarget,
                                M = wi(C),
                                S = !s && dM(C),
                                P = E && (s ? M : !S),
                                I = w.key === 'Enter',
                                V = w.key === ' ',
                                A = C.getAttribute('role'),
                                O = A?.startsWith('menuitem') || A === 'option' || A === 'gridcell';
                            if (E && d && V) {
                                if (w.defaultPrevented && O) return;
                                (w.preventDefault(),
                                    S || (s && M)
                                        ? (C.click(), w.preventBaseUIHandler())
                                        : P && (h?.(w), w.preventBaseUIHandler()));
                                return;
                            }
                            P && (!s && (V || I) && w.preventDefault(), !s && I && h?.(w));
                        },
                        onKeyUp(w) {
                            if (!t) {
                                if (
                                    (Ro(w),
                                    m?.(w),
                                    w.target === w.currentTarget && s && d && wi(w.currentTarget) && w.key === ' ')
                                ) {
                                    w.preventDefault();
                                    return;
                                }
                                w.baseUIHandlerPrevented ||
                                    (w.target === w.currentTarget && !s && !d && w.key === ' ' && h?.(w));
                            }
                        },
                        onPointerDown(w) {
                            if (t) {
                                w.preventDefault();
                                return;
                            }
                            b?.(w);
                        },
                    },
                    s ? { type: 'button' } : { role: 'button' },
                    u,
                    R
                );
            },
            [t, u, d, s]
        ),
        f = me((p) => {
            ((i.current = p), l());
        });
    return { getButtonProps: c, buttonRef: f };
}
function wi(e) {
    return Le(e) && e.tagName === 'BUTTON';
}
function dM(e) {
    return !!(e?.tagName === 'A' && e?.href);
}
const fM = v.forwardRef(function (t, n) {
    const {
            render: r,
            className: s,
            disabled: o = !1,
            focusableWhenDisabled: i = !1,
            nativeButton: a = !0,
            style: d,
            ...u
        } = t,
        { getButtonProps: l, buttonRef: c } = uM({ disabled: o, focusableWhenDisabled: i, native: a });
    return Ir('button', t, { state: { disabled: o }, ref: [n, c], props: [u, l] });
});
function wh(e) {
    const t = Xe.c(8);
    let n, r;
    t[0] !== e ? (({ className: n, ...r } = e), (t[0] = e), (t[1] = n), (t[2] = r)) : ((n = t[1]), (r = t[2]));
    let s;
    t[3] !== n ? ((s = Kt('motion-safe:animate-spin', n)), (t[3] = n), (t[4] = s)) : (s = t[4]);
    let o;
    return (
        t[5] !== r || t[6] !== s
            ? ((o = F.jsx(G1, { className: s, ...r })), (t[5] = r), (t[6] = s), (t[7] = o))
            : (o = t[7]),
        o
    );
}
const Zl = (e) => (typeof e == 'boolean' ? `${e}` : e === 0 ? '0' : e),
    eu = qd,
    Sh = (e, t) => (n) => {
        var r;
        if (t?.variants == null) return eu(e, n?.class, n?.className);
        const { variants: s, defaultVariants: o } = t,
            i = Object.keys(s).map((u) => {
                const l = n?.[u],
                    c = o?.[u];
                if (l === null) return null;
                const f = Zl(l) || Zl(c);
                return s[u][f];
            }),
            a =
                n &&
                Object.entries(n).reduce((u, l) => {
                    let [c, f] = l;
                    return (f === void 0 || (u[c] = f), u);
                }, {}),
            d =
                t == null || (r = t.compoundVariants) === null || r === void 0
                    ? void 0
                    : r.reduce((u, l) => {
                          let { class: c, className: f, ...p } = l;
                          return Object.entries(p).every((h) => {
                              let [g, m] = h;
                              return Array.isArray(m) ? m.includes({ ...o, ...a }[g]) : { ...o, ...a }[g] === m;
                          })
                              ? [...u, c, f]
                              : u;
                      }, []);
        return eu(e, i, d, n?.class, n?.className);
    },
    hM = Sh(
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-lg border border-transparent bg-clip-padding text-sm font-medium aria-invalid:ring-3 active:translate-y-px [&_svg:not([class*='size-'])]:size-4 group/button relative inline-flex shrink-0 items-center justify-center whitespace-nowrap motion-safe:transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
                    xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
                    sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
                    lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
                    icon: 'size-8',
                    'icon-xs':
                        "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
                    'icon-sm': 'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
                    'icon-lg': 'size-9',
                },
            },
            defaultVariants: { variant: 'default', size: 'default' },
        }
    );
function xh(e) {
    const t = Xe.c(20);
    let n, r, s, o, i, a, d;
    t[0] !== e
        ? (({ className: r, children: n, variant: d, size: a, isLoading: o, disabled: s, ...i } = e),
          (t[0] = e),
          (t[1] = n),
          (t[2] = r),
          (t[3] = s),
          (t[4] = o),
          (t[5] = i),
          (t[6] = a),
          (t[7] = d))
        : ((n = t[1]), (r = t[2]), (s = t[3]), (o = t[4]), (i = t[5]), (a = t[6]), (d = t[7]));
    let u;
    t[8] !== r || t[9] !== a || t[10] !== d
        ? ((u = Kt(hM({ variant: d, size: a, className: r }))), (t[8] = r), (t[9] = a), (t[10] = d), (t[11] = u))
        : (u = t[11]);
    const l = s || o;
    let c;
    t[12] !== n || t[13] !== o
        ? ((c = o
              ? F.jsxs('span', {
                    children: [
                        F.jsx('span', { className: 'contents invisible', children: n }),
                        F.jsx('span', { className: 'sr-only', children: n }),
                        F.jsx('span', {
                            className: 'flex justify-center items-center absolute inset-0',
                            children: F.jsx(wh, {}),
                        }),
                    ],
                })
              : n),
          (t[12] = n),
          (t[13] = o),
          (t[14] = c))
        : (c = t[14]);
    let f;
    return (
        t[15] !== i || t[16] !== u || t[17] !== l || t[18] !== c
            ? ((f = F.jsx(fM, { 'data-slot': 'button', className: u, disabled: l, ...i, children: c })),
              (t[15] = i),
              (t[16] = u),
              (t[17] = l),
              (t[18] = c),
              (t[19] = f))
            : (f = t[19]),
        f
    );
}
const pM = Sh('mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0', {
    variants: {
        variant: {
            default: 'bg-transparent',
            icon: "bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-4",
        },
    },
    defaultVariants: { variant: 'default' },
});
function Rh(e) {
    const t = Xe.c(8);
    let n, r;
    t[0] !== e ? (({ className: n, ...r } = e), (t[0] = e), (t[1] = n), (t[2] = r)) : ((n = t[1]), (r = t[2]));
    let s;
    t[3] !== n
        ? ((s = Kt(
              'gap-4 rounded-xl border-dashed p-6 flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance',
              n
          )),
          (t[3] = n),
          (t[4] = s))
        : (s = t[4]);
    let o;
    return (
        t[5] !== r || t[6] !== s
            ? ((o = F.jsx('div', { 'data-slot': 'empty', className: s, ...r })), (t[5] = r), (t[6] = s), (t[7] = o))
            : (o = t[7]),
        o
    );
}
function Eh(e) {
    const t = Xe.c(8);
    let n, r;
    t[0] !== e ? (({ className: n, ...r } = e), (t[0] = e), (t[1] = n), (t[2] = r)) : ((n = t[1]), (r = t[2]));
    let s;
    t[3] !== n ? ((s = Kt('gap-2 flex max-w-sm flex-col items-center', n)), (t[3] = n), (t[4] = s)) : (s = t[4]);
    let o;
    return (
        t[5] !== r || t[6] !== s
            ? ((o = F.jsx('header', { 'data-slot': 'empty-header', className: s, ...r })),
              (t[5] = r),
              (t[6] = s),
              (t[7] = o))
            : (o = t[7]),
        o
    );
}
function Mh(e) {
    const t = Xe.c(11);
    let n, r, s;
    t[0] !== e
        ? (({ className: n, variant: s, ...r } = e), (t[0] = e), (t[1] = n), (t[2] = r), (t[3] = s))
        : ((n = t[1]), (r = t[2]), (s = t[3]));
    const o = s === void 0 ? 'default' : s;
    let i;
    t[4] !== n || t[5] !== o
        ? ((i = Kt(pM({ variant: o, className: n }))), (t[4] = n), (t[5] = o), (t[6] = i))
        : (i = t[6]);
    let a;
    return (
        t[7] !== r || t[8] !== i || t[9] !== o
            ? ((a = F.jsx('div', { 'data-slot': 'empty-icon', 'data-variant': o, className: i, ...r })),
              (t[7] = r),
              (t[8] = i),
              (t[9] = o),
              (t[10] = a))
            : (a = t[10]),
        a
    );
}
function Ch(e) {
    const t = Xe.c(10);
    let n, r, s;
    t[0] !== e
        ? (({ className: r, children: n, ...s } = e), (t[0] = e), (t[1] = n), (t[2] = r), (t[3] = s))
        : ((n = t[1]), (r = t[2]), (s = t[3]));
    let o;
    t[4] !== r ? ((o = Kt('text-sm font-medium tracking-tight', r)), (t[4] = r), (t[5] = o)) : (o = t[5]);
    let i;
    return (
        t[6] !== n || t[7] !== s || t[8] !== o
            ? ((i = F.jsx('h2', { 'data-slot': 'empty-title', className: o, ...s, children: n })),
              (t[6] = n),
              (t[7] = s),
              (t[8] = o),
              (t[9] = i))
            : (i = t[9]),
        i
    );
}
function Ph(e) {
    const t = Xe.c(8);
    let n, r;
    t[0] !== e ? (({ className: n, ...r } = e), (t[0] = e), (t[1] = n), (t[2] = r)) : ((n = t[1]), (r = t[2]));
    let s;
    t[3] !== n
        ? ((s = Kt(
              'text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
              n
          )),
          (t[3] = n),
          (t[4] = s))
        : (s = t[4]);
    let o;
    return (
        t[5] !== r || t[6] !== s
            ? ((o = F.jsx('p', { 'data-slot': 'empty-description', className: s, ...r })),
              (t[5] = r),
              (t[6] = s),
              (t[7] = o))
            : (o = t[7]),
        o
    );
}
function Th(e) {
    const t = Xe.c(8);
    let n, r;
    t[0] !== e ? (({ className: n, ...r } = e), (t[0] = e), (t[1] = n), (t[2] = r)) : ((n = t[1]), (r = t[2]));
    let s;
    t[3] !== n
        ? ((s = Kt('gap-2.5 text-sm flex w-full max-w-sm min-w-0 flex-col items-center text-balance', n)),
          (t[3] = n),
          (t[4] = s))
        : (s = t[4]);
    let o;
    return (
        t[5] !== r || t[6] !== s
            ? ((o = F.jsx('div', { 'data-slot': 'empty-content', className: s, ...r })),
              (t[5] = r),
              (t[6] = s),
              (t[7] = o))
            : (o = t[7]),
        o
    );
}
function mM(e) {
    const t = Xe.c(15),
        { error: n } = e,
        r = Ye(),
        s = Id();
    let o, i;
    (t[0] !== s
        ? ((o = function () {
              s.reset();
          }),
          (i = [s]),
          (t[0] = s),
          (t[1] = o),
          (t[2] = i))
        : ((o = t[1]), (i = t[2])),
        v.useEffect(o, i));
    let a, d;
    t[3] === Symbol.for('react.memo_cache_sentinel')
        ? ((a = F.jsx(Mh, { variant: 'icon', children: F.jsx(X1, {}) })),
          (d = F.jsx(Ch, { className: 'text-4xl', children: 'Error' })),
          (t[3] = a),
          (t[4] = d))
        : ((a = t[3]), (d = t[4]));
    const u = n.message || Nd;
    let l;
    t[5] !== u
        ? ((l = F.jsxs(Eh, {
              className: 'max-w-2xl',
              children: [a, d, F.jsx(Ph, { className: 'text-xl', children: u })],
          })),
          (t[5] = u),
          (t[6] = l))
        : (l = t[6]);
    let c;
    t[7] !== r
        ? ((c = () => {
              r.invalidate();
          }),
          (t[7] = r),
          (t[8] = c))
        : (c = t[8]);
    let f;
    t[9] === Symbol.for('react.memo_cache_sentinel')
        ? ((f = F.jsx(tM, { 'aria-hidden': !0 })), (t[9] = f))
        : (f = t[9]);
    let p;
    t[10] !== c
        ? ((p = F.jsx(Th, { className: 'max-w-2xl', children: F.jsxs(xh, { onClick: c, children: [f, 'Retry'] }) })),
          (t[10] = c),
          (t[11] = p))
        : (p = t[11]);
    let h;
    return (
        t[12] !== l || t[13] !== p
            ? ((h = F.jsxs(Rh, { children: [l, p] })), (t[12] = l), (t[13] = p), (t[14] = h))
            : (h = t[14]),
        h
    );
}
function gM() {
    const e = Xe.c(2);
    let t;
    e[0] === Symbol.for('react.memo_cache_sentinel')
        ? ((t = F.jsxs(Eh, {
              className: 'max-w-2xl',
              children: [
                  F.jsx(Mh, { variant: 'icon', children: F.jsx(z1, {}) }),
                  F.jsx(Ch, { className: 'text-4xl', children: '404' }),
                  F.jsx(Ph, { className: 'text-xl', children: 'Page Not Found' }),
              ],
          })),
          (e[0] = t))
        : (t = e[0]);
    let n;
    return (
        e[1] === Symbol.for('react.memo_cache_sentinel')
            ? ((n = F.jsxs(Rh, {
                  children: [
                      t,
                      F.jsx(Th, {
                          className: 'max-w-2xl',
                          children: F.jsx(xh, {
                              nativeButton: !1,
                              render: F.jsxs(No, {
                                  to: '/dashboard',
                                  children: [F.jsx(H1, { 'aria-hidden': !0 }), 'Go back to the main page'],
                              }),
                          }),
                      }),
                  ],
              })),
              (e[1] = n))
            : (n = e[1]),
        n
    );
}
function yM() {
    return Iv({
        routeTree: P1,
        context: { queryClient: jd, auth: { isAuthenticated: !1, me: null } },
        defaultPreload: 'intent',
        defaultPreloadStaleTime: 0,
        scrollRestoration: !0,
        defaultPendingMs: 100,
        defaultPendingMinMs: 500,
        defaultNotFoundComponent: gM,
        defaultErrorComponent: mM,
        defaultPendingComponent() {
            return F.jsx(wh, { className: 'size-16 m-auto' });
        },
    });
}
async function bM() {
    const e = await yM();
    let t;
    return (
        (t = []),
        (window.__TSS_START_OPTIONS__ = { serializationAdapters: t }),
        t.push(Xy),
        e.options.serializationAdapters && t.push(...e.options.serializationAdapters),
        e.update({ basepath: '', serializationAdapters: t }),
        e.stores.matchesId.get().length || (await tb(e)),
        e
    );
}
var vM = bM;
async function wM() {
    const e = await vM();
    return (window.$_TSR?.h(), e);
}
var Si;
function SM() {
    return (Si || (Si = wM()), F.jsx(zb, { promise: Si, children: (e) => F.jsx(Ov, { router: e }) }));
}
v.startTransition(() => {
    jh.hydrateRoot(document, F.jsx(v.StrictMode, { children: F.jsx(SM, {}) }));
});
let oe = (function (e) {
    return (
        (e[(e.None = 0)] = 'None'),
        (e[(e.Mutable = 1)] = 'Mutable'),
        (e[(e.Watching = 2)] = 'Watching'),
        (e[(e.RecursedCheck = 4)] = 'RecursedCheck'),
        (e[(e.Recursed = 8)] = 'Recursed'),
        (e[(e.Dirty = 16)] = 'Dirty'),
        (e[(e.Pending = 32)] = 'Pending'),
        e
    );
})({});
function xM({ update: e, notify: t, unwatched: n }) {
    return { link: r, unlink: s, propagate: o, checkDirty: i, shallowPropagate: a };
    function r(u, l, c) {
        const f = l.depsTail;
        if (f !== void 0 && f.dep === u) return;
        const p = f !== void 0 ? f.nextDep : l.deps;
        if (p !== void 0 && p.dep === u) {
            ((p.version = c), (l.depsTail = p));
            return;
        }
        const h = u.subsTail;
        if (h !== void 0 && h.version === c && h.sub === l) return;
        const g =
            (l.depsTail =
            u.subsTail =
                { version: c, dep: u, sub: l, prevDep: f, nextDep: p, prevSub: h, nextSub: void 0 });
        (p !== void 0 && (p.prevDep = g),
            f !== void 0 ? (f.nextDep = g) : (l.deps = g),
            h !== void 0 ? (h.nextSub = g) : (u.subs = g));
    }
    function s(u, l = u.sub) {
        const c = u.dep,
            f = u.prevDep,
            p = u.nextDep,
            h = u.nextSub,
            g = u.prevSub;
        return (
            p !== void 0 ? (p.prevDep = f) : (l.depsTail = f),
            f !== void 0 ? (f.nextDep = p) : (l.deps = p),
            h !== void 0 ? (h.prevSub = g) : (c.subsTail = g),
            g !== void 0 ? (g.nextSub = h) : (c.subs = h) === void 0 && n(c),
            p
        );
    }
    function o(u) {
        let l = u.nextSub,
            c;
        e: do {
            const f = u.sub;
            let p = f.flags;
            if (
                (p & (oe.RecursedCheck | oe.Recursed | oe.Dirty | oe.Pending)
                    ? p & (oe.RecursedCheck | oe.Recursed)
                        ? p & oe.RecursedCheck
                            ? !(p & (oe.Dirty | oe.Pending)) && d(u, f)
                                ? ((f.flags = p | (oe.Recursed | oe.Pending)), (p &= oe.Mutable))
                                : (p = oe.None)
                            : (f.flags = (p & ~oe.Recursed) | oe.Pending)
                        : (p = oe.None)
                    : (f.flags = p | oe.Pending),
                p & oe.Watching && t(f),
                p & oe.Mutable)
            ) {
                const h = f.subs;
                if (h !== void 0) {
                    const g = (u = h).nextSub;
                    g !== void 0 && ((c = { value: l, prev: c }), (l = g));
                    continue;
                }
            }
            if ((u = l) !== void 0) {
                l = u.nextSub;
                continue;
            }
            for (; c !== void 0;)
                if (((u = c.value), (c = c.prev), u !== void 0)) {
                    l = u.nextSub;
                    continue e;
                }
            break;
        } while (!0);
    }
    function i(u, l) {
        let c,
            f = 0,
            p = !1;
        e: do {
            const h = u.dep,
                g = h.flags;
            if (l.flags & oe.Dirty) p = !0;
            else if ((g & (oe.Mutable | oe.Dirty)) === (oe.Mutable | oe.Dirty)) {
                if (e(h)) {
                    const m = h.subs;
                    (m.nextSub !== void 0 && a(m), (p = !0));
                }
            } else if ((g & (oe.Mutable | oe.Pending)) === (oe.Mutable | oe.Pending)) {
                ((u.nextSub !== void 0 || u.prevSub !== void 0) && (c = { value: u, prev: c }),
                    (u = h.deps),
                    (l = h),
                    ++f);
                continue;
            }
            if (!p) {
                const m = u.nextDep;
                if (m !== void 0) {
                    u = m;
                    continue;
                }
            }
            for (; f--;) {
                const m = l.subs,
                    y = m.nextSub !== void 0;
                if ((y ? ((u = c.value), (c = c.prev)) : (u = m), p)) {
                    if (e(l)) {
                        (y && a(m), (l = u.sub));
                        continue;
                    }
                    p = !1;
                } else l.flags &= ~oe.Pending;
                l = u.sub;
                const b = u.nextDep;
                if (b !== void 0) {
                    u = b;
                    continue e;
                }
            }
            return p;
        } while (!0);
    }
    function a(u) {
        do {
            const l = u.sub,
                c = l.flags;
            (c & (oe.Pending | oe.Dirty)) === oe.Pending &&
                ((l.flags = c | oe.Dirty), (c & (oe.Watching | oe.RecursedCheck)) === oe.Watching && t(l));
        } while ((u = u.nextSub) !== void 0);
    }
    function d(u, l) {
        let c = l.depsTail;
        for (; c !== void 0;) {
            if (c === u) return !0;
            c = c.prevDep;
        }
        return !1;
    }
}
function lc(e, t, n) {
    const r = typeof e == 'object',
        s = r ? e : void 0;
    return {
        next: (r ? e.next : e)?.bind(s),
        error: (r ? e.error : t)?.bind(s),
        complete: (r ? e.complete : n)?.bind(s),
    };
}
const oa = [];
let Js = 0;
const {
    link: tu,
    unlink: RM,
    propagate: EM,
    checkDirty: Ih,
    shallowPropagate: nu,
} = xM({
    update(e) {
        return e._update();
    },
    notify(e) {
        ((oa[ia++] = e), (e.flags &= ~oe.Watching));
    },
    unwatched(e) {
        e.depsTail !== void 0 && ((e.depsTail = void 0), (e.flags = oe.Mutable | oe.Dirty), To(e));
    },
});
let Vs = 0,
    ia = 0,
    Vt,
    aa = 0;
function Ze(e) {
    try {
        (++aa, e());
    } finally {
        --aa || Fh();
    }
}
function To(e) {
    const t = e.depsTail;
    let n = t !== void 0 ? t.nextDep : e.deps;
    for (; n !== void 0;) n = RM(n, e);
}
function Fh() {
    if (!(aa > 0)) {
        for (; Vs < ia;) {
            const e = oa[Vs];
            ((oa[Vs++] = void 0), e.notify());
        }
        ((Vs = 0), (ia = 0));
    }
}
function kh(e, t) {
    const n = typeof e == 'function',
        r = e,
        s = {
            _snapshot: n ? void 0 : e,
            subs: void 0,
            subsTail: void 0,
            deps: void 0,
            depsTail: void 0,
            flags: n ? oe.None : oe.Mutable,
            get() {
                return (Vt !== void 0 && tu(s, Vt, Js), s._snapshot);
            },
            subscribe(o) {
                const i = lc(o),
                    a = { current: !1 },
                    d = MM(() => {
                        (s.get(), a.current ? i.next?.(s._snapshot) : (a.current = !0));
                    });
                return {
                    unsubscribe: () => {
                        d.stop();
                    },
                };
            },
            _update(o) {
                const i = Vt,
                    a = Object.is;
                if (n) ((Vt = s), ++Js, (s.depsTail = void 0));
                else if (o === void 0) return !1;
                n && (s.flags = oe.Mutable | oe.RecursedCheck);
                try {
                    const d = s._snapshot,
                        u = typeof o == 'function' ? o(d) : o === void 0 && n ? r(d) : o;
                    return d === void 0 || !a(d, u) ? ((s._snapshot = u), !0) : !1;
                } finally {
                    ((Vt = i), n && (s.flags &= ~oe.RecursedCheck), To(s));
                }
            },
        };
    return (
        n
            ? ((s.flags = oe.Mutable | oe.Dirty),
              (s.get = function () {
                  const o = s.flags;
                  if (o & oe.Dirty || (o & oe.Pending && Ih(s.deps, s))) {
                      if (s._update()) {
                          const i = s.subs;
                          i !== void 0 && nu(i);
                      }
                  } else o & oe.Pending && (s.flags = o & ~oe.Pending);
                  return (Vt !== void 0 && tu(s, Vt, Js), s._snapshot);
              }))
            : (s.set = function (o) {
                  if (s._update(o)) {
                      const i = s.subs;
                      i !== void 0 && (EM(i), nu(i), Fh());
                  }
              }),
        s
    );
}
function MM(e) {
    const t = () => {
            const r = Vt;
            ((Vt = n), ++Js, (n.depsTail = void 0), (n.flags = oe.Watching | oe.RecursedCheck));
            try {
                return e();
            } finally {
                ((Vt = r), (n.flags &= ~oe.RecursedCheck), To(n));
            }
        },
        n = {
            deps: void 0,
            depsTail: void 0,
            subs: void 0,
            subsTail: void 0,
            flags: oe.Watching | oe.RecursedCheck,
            notify() {
                const r = this.flags;
                r & oe.Dirty || (r & oe.Pending && Ih(this.deps, this)) ? t() : (this.flags = oe.Watching);
            },
            stop() {
                ((this.flags = oe.None), (this.depsTail = void 0), To(this));
            },
        };
    return (t(), n);
}
var CM = class {
        constructor(e, t) {
            ((this.atom = kh(e)),
                (this.get = this.get.bind(this)),
                (this.setState = this.setState.bind(this)),
                (this.subscribe = this.subscribe.bind(this)),
                t && (this.actions = t(this)));
        }
        setState(e) {
            this.atom.set(e);
        }
        get state() {
            return this.atom.get();
        }
        get() {
            return this.state;
        }
        subscribe(e) {
            return this.atom.subscribe(lc(e));
        }
    },
    PM = class {
        constructor(e) {
            this.atom = kh(e);
        }
        get state() {
            return this.atom.get();
        }
        get() {
            return this.state;
        }
        subscribe(e) {
            return this.atom.subscribe(lc(e));
        }
    };
function Wn(e, t) {
    return typeof e == 'function' ? new PM(e) : new CM(e);
}
var TM = class {
    constructor(e, t) {
        ((this.fn = e),
            (this.options = t),
            (this.lastExecutionTime = 0),
            (this.isPending = !1),
            (this.maybeExecute = (...n) => {
                const r = Date.now() - this.lastExecutionTime;
                if (this.options.leading && r >= this.options.wait) this.execute(...n);
                else if (((this.lastArgs = n), !this.timeoutId && this.options.trailing)) {
                    const s = this.options.wait - r;
                    ((this.isPending = !0),
                        (this.timeoutId = setTimeout(() => {
                            this.lastArgs !== void 0 && this.execute(...this.lastArgs);
                        }, s)));
                }
            }),
            (this.execute = (...n) => {
                (this.fn(...n),
                    this.options.onExecute?.(n, this),
                    (this.lastExecutionTime = Date.now()),
                    this.clearTimeout(),
                    (this.lastArgs = void 0),
                    (this.isPending = !1));
            }),
            (this.flush = () => {
                this.isPending && this.lastArgs && this.execute(...this.lastArgs);
            }),
            (this.cancel = () => {
                (this.clearTimeout(), (this.lastArgs = void 0), (this.isPending = !1));
            }),
            (this.clearTimeout = () => {
                this.timeoutId && (clearTimeout(this.timeoutId), (this.timeoutId = void 0));
            }),
            this.options.leading === void 0 &&
                this.options.trailing === void 0 &&
                ((this.options.leading = !0), (this.options.trailing = !0)));
    }
};
function IM(e, t) {
    return new TM(e, t).maybeExecute;
}
var FM = class {
    #t = !0;
    #e;
    #n;
    #r;
    #o;
    #s;
    #i;
    #a;
    #h = 0;
    #c = 5;
    #u = !1;
    #d = !1;
    #l = null;
    #f = () => {
        (this.debugLog('Connected to event bus'),
            (this.#s = !0),
            (this.#u = !1),
            this.debugLog('Emitting queued events', this.#o),
            this.#o.forEach((e) => this.emitEventToBus(e)),
            (this.#o = []),
            this.stopConnectLoop(),
            this.#n().removeEventListener('tanstack-connect-success', this.#f));
    };
    #p = () => {
        if (this.#h < this.#c) {
            (this.#h++, this.dispatchCustomEvent('tanstack-connect', {}));
            return;
        }
        (this.#n().removeEventListener('tanstack-connect', this.#p),
            (this.#d = !0),
            this.debugLog('Max retries reached, giving up on connection'),
            this.stopConnectLoop());
    };
    #m = () => {
        this.#u || ((this.#u = !0), this.#n().addEventListener('tanstack-connect-success', this.#f), this.#p());
    };
    constructor({ pluginId: e, debug: t = !1, enabled: n = !0, reconnectEveryMs: r = 300 }) {
        ((this.#e = e),
            (this.#t = n),
            (this.#n = this.getGlobalTarget),
            (this.#r = t),
            this.debugLog(' Initializing event subscription for plugin', this.#e),
            (this.#o = []),
            (this.#s = !1),
            (this.#d = !1),
            (this.#i = null),
            (this.#a = r));
    }
    startConnectLoop() {
        this.#i !== null ||
            this.#s ||
            (this.debugLog(`Starting connect loop (every ${this.#a}ms)`), (this.#i = setInterval(this.#p, this.#a)));
    }
    stopConnectLoop() {
        ((this.#u = !1),
            this.#i !== null &&
                (clearInterval(this.#i), (this.#i = null), (this.#o = []), this.debugLog('Stopped connect loop')));
    }
    debugLog(...e) {
        this.#r && console.log(`🌴 [tanstack-devtools:${this.#e}-plugin]`, ...e);
    }
    getGlobalTarget() {
        if (typeof globalThis < 'u' && globalThis.__TANSTACK_EVENT_TARGET__)
            return (this.debugLog('Using global event target'), globalThis.__TANSTACK_EVENT_TARGET__);
        if (typeof window < 'u' && typeof window.addEventListener < 'u')
            return (this.debugLog('Using window as event target'), window);
        const e = typeof EventTarget < 'u' ? new EventTarget() : void 0;
        return typeof e > 'u' || typeof e.addEventListener > 'u'
            ? (this.debugLog('No event mechanism available, running in non-web environment'),
              { addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => !1 })
            : (this.debugLog('Using new EventTarget as fallback'), e);
    }
    getPluginId() {
        return this.#e;
    }
    dispatchCustomEventShim(e, t) {
        try {
            const n = new Event(e, { detail: t });
            this.#n().dispatchEvent(n);
        } catch {
            this.debugLog('Failed to dispatch shim event');
        }
    }
    dispatchCustomEvent(e, t) {
        try {
            this.#n().dispatchEvent(new CustomEvent(e, { detail: t }));
        } catch {
            this.dispatchCustomEventShim(e, t);
        }
    }
    emitEventToBus(e) {
        (this.debugLog('Emitting event to client bus', e), this.dispatchCustomEvent('tanstack-dispatch-event', e));
    }
    createEventPayload(e, t) {
        return { type: `${this.#e}:${e}`, payload: t, pluginId: this.#e };
    }
    emit(e, t) {
        if (!this.#t) {
            this.debugLog('Event bus client is disabled, not emitting event', e, t);
            return;
        }
        if (
            (this.#l &&
                (this.debugLog('Emitting event to internal event target', e, t),
                this.#l.dispatchEvent(new CustomEvent(`${this.#e}:${e}`, { detail: this.createEventPayload(e, t) }))),
            this.#d)
        ) {
            this.debugLog('Previously failed to connect, not emitting to bus');
            return;
        }
        if (!this.#s) {
            (this.debugLog('Bus not available, will be pushed as soon as connected'),
                this.#o.push(this.createEventPayload(e, t)),
                typeof CustomEvent < 'u' && !this.#u && (this.#m(), this.startConnectLoop()));
            return;
        }
        return this.emitEventToBus(this.createEventPayload(e, t));
    }
    on(e, t, n) {
        const r = n?.withEventTarget ?? !1,
            s = `${this.#e}:${e}`;
        if (
            (r &&
                (this.#l || (this.#l = new EventTarget()),
                this.#l.addEventListener(s, (i) => {
                    t(i.detail);
                })),
            !this.#t)
        )
            return (this.debugLog('Event bus client is disabled, not registering event', s), () => {});
        const o = (i) => {
            (this.debugLog('Received event from bus', i.detail), t(i.detail));
        };
        return (
            this.#n().addEventListener(s, o),
            this.debugLog('Registered event to bus', s),
            () => {
                (r && this.#l?.removeEventListener(s, o), this.#n().removeEventListener(s, o));
            }
        );
    }
    onAll(e) {
        if (!this.#t) return (this.debugLog('Event bus client is disabled, not registering event'), () => {});
        const t = (n) => {
            const r = n.detail;
            e(r);
        };
        return (
            this.#n().addEventListener('tanstack-devtools-global', t),
            () => this.#n().removeEventListener('tanstack-devtools-global', t)
        );
    }
    onAllPluginEvents(e) {
        if (!this.#t) return (this.debugLog('Event bus client is disabled, not registering event'), () => {});
        const t = (n) => {
            const r = n.detail;
            (this.#e && r.pluginId !== this.#e) || e(r);
        };
        return (
            this.#n().addEventListener('tanstack-devtools-global', t),
            () => this.#n().removeEventListener('tanstack-devtools-global', t)
        );
    }
};
class kM extends FM {
    constructor() {
        super({ pluginId: 'form-devtools', reconnectEveryMs: 1e3 });
    }
}
const Ot = new kM();
function kr(e, t) {
    return typeof e == 'function' ? e(t) : e;
}
function gr(e, t) {
    return Yo(t).reduce((r, s) => {
        if (r === null) return null;
        if (typeof r < 'u') return r[s];
    }, e);
}
function Br(e, t, n) {
    const r = Yo(t);
    function s(o) {
        if (!r.length) return kr(n, o);
        const i = r.shift();
        if (typeof i == 'string' || (typeof i == 'number' && !Array.isArray(o)))
            return typeof o == 'object' ? (o === null && (o = {}), { ...o, [i]: s(o[i]) }) : { [i]: s() };
        if (Array.isArray(o) && typeof i == 'number') {
            const a = o.slice(0, i);
            return [...(a.length ? a : new Array(i)), s(o[i]), ...o.slice(i + 1)];
        }
        return [...new Array(i), s()];
    }
    return s(e);
}
function OM(e, t) {
    const n = Yo(t);
    function r(s) {
        if (!s) return;
        if (n.length === 1) {
            const i = n[0];
            if (Array.isArray(s) && typeof i == 'number') return s.filter((u, l) => l !== i);
            const { [i]: a, ...d } = s;
            return d;
        }
        const o = n.shift();
        if ((typeof o == 'string' || (typeof o == 'number' && !Array.isArray(s))) && typeof s == 'object')
            return { ...s, [o]: r(s[o]) };
        if (typeof o == 'number' && Array.isArray(s)) {
            if (o >= s.length) return s;
            const i = s.slice(0, o);
            return [...(i.length ? i : new Array(o)), r(s[o]), ...s.slice(o + 1)];
        }
        throw new Error('It seems we have created an infinite loop in deleteBy. ');
    }
    return r(e);
}
const ru = 46,
    xi = 91,
    Ri = 93,
    su = 48,
    AM = 57;
function Yo(e) {
    if (Array.isArray(e)) return [...e];
    if (typeof e != 'string') throw new Error('Path must be a string.');
    const t = e.length,
        n = [];
    let r = t > 0 && e.charCodeAt(0) === xi ? 1 : 0,
        s = !0,
        o = -1;
    for (let i = r; i <= t; i++) {
        const a = i < t ? e.charCodeAt(i) : -1;
        if (i === t || a === ru || a === xi || a === Ri) {
            const d = i - r;
            if (d > 0) {
                const u = s && (d === 1 || e.charCodeAt(r) !== su),
                    l = e.slice(r, i);
                if (u) {
                    const c = parseInt(l, 10);
                    d <= 15 || String(c) === l ? n.push(c) : n.push(l);
                } else n.push(l);
            } else o !== Ri && !(o === -1 && a === Ri) && !(o === a && (a === ru || a === xi)) && n.push('');
            ((r = i + 1), (s = !0));
        } else (a < su || a > AM) && (s = !1);
        o = a;
    }
    return (n.length || n.push(''), n);
}
function ou(e, t) {
    return e.length === 0 ? t : t.length === 0 ? e : t.startsWith('[') || t.startsWith('.') ? e + t : `${e}.${t}`;
}
function _M(e) {
    return !(Array.isArray(e) && e.length === 0);
}
function is(e, t) {
    const n = (r) => r.validators.filter(Boolean).map((s) => ({ cause: s.cause, validate: s.fn }));
    return t.validationLogic({
        form: t.form,
        group: t.group,
        validators: t.validators,
        event: { type: e, fieldName: t.fieldName, async: !1 },
        runValidation: n,
    });
}
function as(e, t) {
    const { asyncDebounceMs: n } = t,
        { onBlurAsyncDebounceMs: r, onChangeAsyncDebounceMs: s, onDynamicAsyncDebounceMs: o } = t.validators || {},
        i = n ?? 0,
        a = (d) =>
            d.validators.filter(Boolean).map((u) => {
                const l = u?.cause || e;
                let c = i;
                switch (l) {
                    case 'change':
                        c = s ?? i;
                        break;
                    case 'blur':
                        c = r ?? i;
                        break;
                    case 'dynamic':
                        c = o ?? i;
                        break;
                    case 'submit':
                        c = 0;
                        break;
                }
                return (e === 'submit' && (c = 0), { cause: l, validate: u.fn, debounceMs: c });
            });
    return t.validationLogic({
        form: t.form,
        group: t.group,
        validators: t.validators,
        event: { type: e, fieldName: t.fieldName, async: !0 },
        runValidation: a,
    });
}
const Zs = (e) => !!e && typeof e == 'object' && 'fields' in e;
function nn(e, t) {
    if (Object.is(e, t)) return !0;
    if (typeof e != 'object' || e === null || typeof t != 'object' || t === null) return !1;
    if (e instanceof Date && t instanceof Date) return e.getTime() === t.getTime();
    if (e instanceof Map && t instanceof Map) {
        if (e.size !== t.size) return !1;
        for (const [s, o] of e) if (!t.has(s) || !Object.is(o, t.get(s))) return !1;
        return !0;
    }
    if (e instanceof Set && t instanceof Set) {
        if (e.size !== t.size) return !1;
        for (const s of e) if (!t.has(s)) return !1;
        return !0;
    }
    const n = Object.keys(e),
        r = Object.keys(t);
    if (
        n.length !== r.length ||
        (n.length === 0 &&
            !Array.isArray(e) &&
            !Array.isArray(t) &&
            (Object.getPrototypeOf(e) !== Object.prototype || Object.getPrototypeOf(t) !== Object.prototype))
    )
        return !1;
    for (const s of n) if (!r.includes(s) || !nn(e[s], t[s])) return !1;
    return !0;
}
const ca = ({ newFormValidatorError: e, isPreviousErrorFromFormValidator: t, previousErrorValue: n }) =>
        e
            ? { newErrorValue: e, newSource: 'form' }
            : t
              ? { newErrorValue: void 0, newSource: void 0 }
              : n
                ? { newErrorValue: n, newSource: 'field' }
                : { newErrorValue: void 0, newSource: void 0 },
    Io = ({ formLevelError: e, fieldLevelError: t }) =>
        t
            ? { newErrorValue: t, newSource: 'field' }
            : e
              ? { newErrorValue: e, newSource: 'form' }
              : { newErrorValue: void 0, newSource: void 0 };
function mt(e, t) {
    return e == null ? t : { ...e, ...t };
}
let Kn = 256;
const eo = [];
let Ns;
for (; Kn--;) eo[Kn] = (Kn + 256).toString(16).substring(1);
function Oh() {
    let e = 0,
        t,
        n = '';
    if (!Ns || Kn + 16 > 256) {
        for (Ns = new Array(256), e = 256; e--;) Ns[e] = (256 * Math.random()) | 0;
        ((e = 0), (Kn = 0));
    }
    for (; e < 16; e++)
        ((t = Ns[Kn + e]),
            e === 6 ? (n += eo[(t & 15) | 64]) : e === 8 ? (n += eo[(t & 63) | 128]) : (n += eo[t]),
            e & 1 && e > 1 && e < 11 && (n += '-'));
    return (Kn++, n);
}
const LM = IM((e) => Ot.emit('form-state', { id: e.formId, state: e.store.state }), { wait: 300 });
function Wr(e) {
    if (e === null || typeof e != 'object') return e;
    if (e instanceof Date) return new Date(e.getTime());
    if (Array.isArray(e)) {
        const n = [];
        for (let r = 0; r < e.length; r++) n[r] = Wr(e[r]);
        return n;
    }
    if (e instanceof Map) {
        const n = new Map();
        return (
            e.forEach((r, s) => {
                n.set(s, Wr(r));
            }),
            n
        );
    }
    if (e instanceof Set) {
        const n = new Set();
        return (
            e.forEach((r) => {
                n.add(Wr(r));
            }),
            n
        );
    }
    const t = {};
    for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = Wr(e[n]));
    return t;
}
function Jn(e, t) {
    return t === e || t.startsWith(`${e}.`) || t.startsWith(`${e}[`);
}
const Bt = (e) => {
    if (!e.validators) return e.runValidation({ validators: [], form: e.form });
    const t = e.event.async,
        n = t ? void 0 : { fn: e.validators.onMount, cause: 'mount' },
        r = { fn: t ? e.validators.onChangeAsync : e.validators.onChange, cause: 'change' },
        s = { fn: t ? e.validators.onBlurAsync : e.validators.onBlur, cause: 'blur' },
        o = { fn: t ? e.validators.onSubmitAsync : e.validators.onSubmit, cause: 'submit' },
        i = t ? void 0 : { fn: () => {}, cause: 'server' };
    switch (e.event.type) {
        case 'mount':
            return e.runValidation({ validators: [n], form: e.form });
        case 'submit':
            return e.runValidation({ validators: [r, s, o, i], form: e.form });
        case 'server':
            return e.runValidation({ validators: [], form: e.form });
        case 'blur':
            return e.runValidation({ validators: [s, i], form: e.form });
        case 'change':
            return e.runValidation({ validators: [r, i], form: e.form });
        default:
            throw new Error(`Unknown validation event type: ${e.event.type}`);
    }
};
function DM(e, t) {
    const n = new Map();
    for (const r of e) {
        const s = r.path ?? [];
        let o = t,
            i = '';
        for (let a = 0; a < s.length; a++) {
            const d = s[a];
            if (d === void 0) continue;
            const u = typeof d == 'object' ? d.key : d,
                l = Number(u);
            (Array.isArray(o) && !Number.isNaN(l) ? (i += `[${l}]`) : (i += (a > 0 ? '.' : '') + String(u)),
                typeof o == 'object' && o !== null ? (o = o[u]) : (o = void 0));
        }
        n.set(i, (n.get(i) ?? []).concat(r));
    }
    return Object.fromEntries(n);
}
const iu = (e, t) => {
        const n = DM(e, t);
        return { form: n, fields: n };
    },
    Zn = {
        validate({ value: e, validationSource: t }, n) {
            const r = n['~standard'].validate(e);
            if (r instanceof Promise) throw new Error('async function passed to sync validator');
            if (r.issues) return t === 'field' ? r.issues : iu(r.issues, e);
        },
        async validateAsync({ value: e, validationSource: t }, n) {
            const r = await n['~standard'].validate(e);
            if (r.issues) return t === 'field' ? r.issues : iu(r.issues, e);
        },
    },
    uc = (e) => !!e && '~standard' in e,
    at = {
        isValidating: !1,
        isTouched: !1,
        isBlurred: !1,
        isDirty: !1,
        isPristine: !0,
        isValid: !0,
        isDefaultValue: !0,
        errors: [],
        errorMap: {},
        errorSourceMap: {},
        _arrayVersion: 0,
        _pendingValidationsCount: 0,
    };
function gn(e) {
    function t(c) {
        const f = e.getFieldMeta(c) ?? at;
        e.setFieldMeta(c, { ...f, _arrayVersion: (f._arrayVersion || 0) + 1 });
    }
    function n(c, f, p) {
        t(c);
        const h = a(c, f, 'move', p),
            g = Math.min(f, p),
            m = Math.max(f, p);
        for (let b = g; b <= m; b++) h.push(i(c, b));
        const y = Object.keys(e.fieldInfo).reduce(
            (b, R) => (R.startsWith(i(c, f)) && b.set(R, e.getFieldMeta(R)), b),
            new Map()
        );
        (u(h, f < p ? 'up' : 'down'),
            Object.keys(e.fieldInfo)
                .filter((b) => b.startsWith(i(c, p)))
                .forEach((b) => {
                    const R = b.replace(i(c, p), i(c, f)),
                        w = y.get(R);
                    w && e.setFieldMeta(b, w);
                }));
    }
    function r(c, f) {
        t(c);
        const p = a(c, f, 'remove');
        u(p, 'up');
    }
    function s(c, f, p) {
        (t(c),
            a(c, f, 'swap', p).forEach((g) => {
                if (!g.toString().startsWith(i(c, f))) return;
                const m = g.toString().replace(i(c, f), i(c, p)),
                    [y, b] = [e.getFieldMeta(g), e.getFieldMeta(m)];
                (y && e.setFieldMeta(m, y), b && e.setFieldMeta(g, b));
            }));
    }
    function o(c, f) {
        t(c);
        const p = a(c, f, 'insert');
        (u(p, 'down'),
            p.forEach((h) => {
                h.toString().startsWith(i(c, f)) && e.setFieldMeta(h, l());
            }));
    }
    function i(c, f) {
        return `${c}[${f}]`;
    }
    function a(c, f, p, h) {
        const g = [i(c, f)];
        switch (p) {
            case 'swap':
                g.push(i(c, h));
                break;
            case 'move': {
                const [m, y] = [Math.min(f, h), Math.max(f, h)];
                for (let b = m; b <= y; b++) g.push(i(c, b));
                break;
            }
            default: {
                const m = e.getFieldValue(c),
                    y = Array.isArray(m) ? m.length : 0;
                for (let b = f + 1; b < y; b++) g.push(i(c, b));
                break;
            }
        }
        return Object.keys(e.fieldInfo).filter((m) => g.some((y) => m.startsWith(y)));
    }
    function d(c, f) {
        return c.replace(/\[(\d+)\]/, (p, h) => {
            const g = parseInt(h, 10);
            return `[${f === 'up' ? g + 1 : Math.max(0, g - 1)}]`;
        });
    }
    function u(c, f) {
        (f === 'up' ? c : [...c].reverse()).forEach((h) => {
            const g = d(h.toString(), f),
                m = e.getFieldMeta(g);
            m ? e.setFieldMeta(h, m) : e.setFieldMeta(h, l());
        });
    }
    const l = () => at;
    return { bumpArrayVersion: t, handleArrayMove: n, handleArrayRemove: r, handleArraySwap: s, handleArrayInsert: o };
}
function Ei(e) {
    return {
        values: e.values ?? {},
        errorMap: e.errorMap ?? {},
        fieldMetaBase: e.fieldMetaBase ?? {},
        formGroupStateBase: e.formGroupStateBase ?? {},
        isSubmitted: e.isSubmitted ?? !1,
        isSubmitting: e.isSubmitting ?? !1,
        isValidating: e.isValidating ?? !1,
        submissionAttempts: e.submissionAttempts ?? 0,
        isSubmitSuccessful: e.isSubmitSuccessful ?? !1,
        validationMetaMap: e.validationMetaMap ?? {
            onChange: void 0,
            onBlur: void 0,
            onSubmit: void 0,
            onMount: void 0,
            onServer: void 0,
            onDynamic: void 0,
        },
    };
}
class au {
    constructor(t) {
        ((this.options = {}),
            (this.fieldInfo = {}),
            (this.formGroupApis = new Set()),
            (this.mount = () => {
                const o = this.store.subscribe(() => {
                        LM(this);
                    }),
                    i = Ot.on('request-form-state', (c) => {
                        c.payload.id === this._formId &&
                            Ot.emit('form-api', { id: this._formId, state: this.store.state, options: this.options });
                    }),
                    a = Ot.on('request-form-reset', (c) => {
                        c.payload.id === this._formId && this.reset();
                    }),
                    d = Ot.on('request-form-force-submit', (c) => {
                        c.payload.id === this._formId &&
                            ((this._devtoolsSubmissionOverride = !0),
                            this.handleSubmit(),
                            (this._devtoolsSubmissionOverride = !1));
                    }),
                    u = () => {
                        (d(), a(), i(), o.unsubscribe(), Ot.emit('form-unmounted', { id: this._formId }));
                    };
                this.options.listeners?.onMount?.({ formApi: this });
                const { onMount: l } = this.options.validators || {};
                return (
                    Ot.emit('form-api', { id: this._formId, state: this.store.state, options: this.options }),
                    l && this.validateSync('mount'),
                    u
                );
            }),
            (this.update = (o) => {
                if (!o) return;
                const i = this.options;
                this.options = o;
                const a = o.defaultValues && !nn(o.defaultValues, i.defaultValues) && !this.state.isTouched,
                    d = !nn(o.defaultState, i.defaultState) && !this.state.isTouched;
                if (!(!a && !d)) {
                    if (
                        (Ze(() => {
                            this.baseStore.setState(() =>
                                Ei(
                                    Object.assign(
                                        {},
                                        this.state,
                                        d ? o.defaultState : {},
                                        a ? { values: o.defaultValues } : {}
                                    )
                                )
                            );
                        }),
                        a)
                    ) {
                        const u = gn(this);
                        for (const l of Object.keys(this.fieldInfo))
                            Array.isArray(this.getFieldValue(l)) && u.bumpArrayVersion(l);
                    }
                    Ot.emit('form-api', { id: this._formId, state: this.store.state, options: this.options });
                }
            }),
            (this.reset = (o, i) => {
                const { fieldMeta: a } = this.state,
                    d = this.resetFieldMeta(a);
                (o && !i?.keepDefaultValues && (this.options = { ...this.options, defaultValues: o }),
                    this.baseStore.setState(() => {
                        let u = o ?? this.options.defaultValues ?? this.options.defaultState?.values;
                        return (
                            o ||
                                Object.values(this.fieldInfo).forEach((l) => {
                                    l.instance &&
                                        l.instance.options.defaultValue !== void 0 &&
                                        (u = Br(u, l.instance.name, l.instance.options.defaultValue));
                                }),
                            Ei({ ...this.options.defaultState, values: u, fieldMetaBase: d })
                        );
                    }));
            }),
            (this.validateAllFields = async (o) => {
                const i = [];
                return (
                    Ze(() => {
                        Object.values(this.fieldInfo).forEach((d) => {
                            if (!d.instance) return;
                            const u = d.instance;
                            (i.push(
                                Promise.resolve().then(() =>
                                    u.validate(o, { skipFormValidation: !0, skipGroupValidation: !0 })
                                )
                            ),
                                d.instance.store.state.meta.isTouched ||
                                    d.instance.setMeta((l) => ({ ...l, isTouched: !0 })));
                        });
                    }),
                    (await Promise.all(i)).flat()
                );
            }),
            (this.validateArrayFieldsStartingFrom = async (o, i, a) => {
                const d = this.getFieldValue(o),
                    u = Array.isArray(d) ? Math.max(d.length - 1, 0) : null,
                    l = [`${o}[${i}]`];
                for (let h = i + 1; h <= (u ?? 0); h++) l.push(`${o}[${h}]`);
                const c = Object.keys(this.fieldInfo).filter((h) => l.some((g) => h.startsWith(g))),
                    f = [];
                return (
                    Ze(() => {
                        c.forEach((h) => {
                            f.push(Promise.resolve().then(() => this.validateField(h, a)));
                        });
                    }),
                    (await Promise.all(f)).flat()
                );
            }),
            (this.validateField = (o, i) => {
                const a = this.fieldInfo[o]?.instance;
                if (!a) {
                    const { hasErrored: d } = this.validateSync(i);
                    return d && !this.options.asyncAlways
                        ? (this.getFieldMeta(o)?.errors ?? [])
                        : this.validateAsync(i).then(() => this.getFieldMeta(o)?.errors ?? []);
                }
                return (a.store.state.meta.isTouched || a.setMeta((d) => ({ ...d, isTouched: !0 })), a.validate(i));
            }),
            (this.validateSync = (o, i) => {
                const a = is(o, {
                    ...this.options,
                    form: this,
                    group: i?.group,
                    validationLogic: this.options.validationLogic || Bt,
                });
                let d = !1;
                const u = {};
                return (
                    Ze(() => {
                        for (const f of a) {
                            if (!f.validate) continue;
                            const p = this.runValidator({
                                    validate: f.validate,
                                    value: { value: this.state.values, formApi: this, validationSource: 'form' },
                                    type: 'validate',
                                }),
                                { formError: h, fieldErrors: g } = to(p),
                                m = $r(f.cause);
                            let y = new Set([...Object.keys(this.state.fieldMeta), ...Object.keys(g || {})]);
                            i?.filterFieldNames && (y = new Set([...y].filter(i.filterFieldNames)));
                            for (const b of y) {
                                if (this.baseStore.state.fieldMetaBase[b] === void 0 && !g?.[b]) continue;
                                const R = this.getFieldMeta(b) ?? at,
                                    { errorMap: w, errorSourceMap: E } = R,
                                    C = g?.[b],
                                    { newErrorValue: M, newSource: S } = ca({
                                        newFormValidatorError: C,
                                        isPreviousErrorFromFormValidator: E?.[m] === 'form',
                                        previousErrorValue: w?.[m],
                                    });
                                (S === 'form' && (u[b] = { ...u[b], [m]: C }),
                                    w?.[m] !== M &&
                                        this.setFieldMeta(b, (P = at) => ({
                                            ...P,
                                            errorMap: { ...P.errorMap, [m]: M },
                                            errorSourceMap: { ...P.errorSourceMap, [m]: S },
                                        })));
                            }
                            (i?.dontUpdateFormErrorMap ||
                                (this.state.errorMap?.[m] !== h &&
                                    this.baseStore.setState((b) => ({ ...b, errorMap: { ...b.errorMap, [m]: h } }))),
                                (h || g) && (d = !0));
                        }
                        if (i?.dontUpdateFormErrorMap) return;
                        const l = $r('submit');
                        this.state.errorMap?.[l] &&
                            o !== 'submit' &&
                            !d &&
                            this.baseStore.setState((f) => ({ ...f, errorMap: { ...f.errorMap, [l]: void 0 } }));
                        const c = $r('server');
                        this.state.errorMap?.[c] &&
                            o !== 'server' &&
                            !d &&
                            this.baseStore.setState((f) => ({ ...f, errorMap: { ...f.errorMap, [c]: void 0 } }));
                    }),
                    { hasErrored: d, fieldsErrorMap: u }
                );
            }),
            (this.validateAsync = async (o, i) => {
                const a = as(o, {
                    ...this.options,
                    form: this,
                    group: i?.group,
                    validationLogic: this.options.validationLogic || Bt,
                });
                this.state.isFormValidating || this.baseStore.setState((f) => ({ ...f, isFormValidating: !0 }));
                const d = [];
                let u;
                for (const f of a) {
                    if (!f.validate) continue;
                    const p = $r(f.cause);
                    this.state.validationMetaMap[p]?.lastAbortController.abort();
                    const g = new AbortController();
                    ((this.state.validationMetaMap[p] = { lastAbortController: g }),
                        d.push(
                            new Promise(async (m) => {
                                let y;
                                try {
                                    y = await new Promise((M, S) => {
                                        setTimeout(async () => {
                                            if (g.signal.aborted) return M(void 0);
                                            try {
                                                M(
                                                    await this.runValidator({
                                                        validate: f.validate,
                                                        value: {
                                                            value: this.state.values,
                                                            formApi: this,
                                                            validationSource: 'form',
                                                            signal: g.signal,
                                                        },
                                                        type: 'validateAsync',
                                                    })
                                                );
                                            } catch (P) {
                                                S(P);
                                            }
                                        }, f.debounceMs);
                                    });
                                } catch (M) {
                                    y = M;
                                }
                                const { formError: b, fieldErrors: R } = to(y);
                                R && (u = u ? { ...u, ...R } : R);
                                const w = $r(f.cause),
                                    E = new Set([...Object.keys(this.state.fieldMeta), ...Object.keys(u || {})]);
                                let C = Array.from(E);
                                i?.filterFieldNames && (C = C.filter(i.filterFieldNames));
                                for (const M of C) {
                                    if (this.baseStore.state.fieldMetaBase[M] === void 0 && !u?.[M]) continue;
                                    const S = this.getFieldMeta(M) ?? at,
                                        { errorMap: P, errorSourceMap: I } = S,
                                        V = u?.[M],
                                        { newErrorValue: A, newSource: O } = ca({
                                            newFormValidatorError: V,
                                            isPreviousErrorFromFormValidator: I?.[w] === 'form',
                                            previousErrorValue: P?.[w],
                                        });
                                    P?.[w] !== A &&
                                        this.setFieldMeta(M, (L = at) => ({
                                            ...L,
                                            errorMap: { ...L.errorMap, [w]: A },
                                            errorSourceMap: { ...L.errorSourceMap, [w]: O },
                                        }));
                                }
                                (i?.dontUpdateFormErrorMap ||
                                    this.baseStore.setState((M) => ({ ...M, errorMap: { ...M.errorMap, [w]: b } })),
                                    m(u ? { fieldErrors: u, errorMapKey: w } : void 0));
                            })
                        ));
                }
                let l = [];
                const c = {};
                if (d.length) {
                    l = await Promise.all(d);
                    for (const f of l)
                        if (f?.fieldErrors) {
                            const { errorMapKey: p } = f;
                            for (const [h, g] of Object.entries(f.fieldErrors)) {
                                const y = { ...(c[h] || {}), [p]: g };
                                c[h] = y;
                            }
                        }
                }
                return (this.baseStore.setState((f) => ({ ...f, isFormValidating: !1 })), c);
            }),
            (this.validate = (o, i) => {
                const { hasErrored: a, fieldsErrorMap: d } = this.validateSync(o, i);
                return a && !this.options.asyncAlways ? d : this.validateAsync(o, i);
            }),
            (this._handleSubmit = async (o) => {
                (this.baseStore.setState((d) => ({
                    ...d,
                    isSubmitted: !1,
                    submissionAttempts: d.submissionAttempts + 1,
                    isSubmitSuccessful: !1,
                })),
                    Ze(() => {
                        Object.values(this.fieldInfo).forEach((d) => {
                            d.instance &&
                                (d.instance.store.state.meta.isTouched ||
                                    d.instance.setMeta((u) => ({ ...u, isTouched: !0 })));
                        });
                    }));
                const i = o ?? this.options.onSubmitMeta;
                if (
                    !this.state.canSubmit &&
                    !this._devtoolsSubmissionOverride &&
                    this.baseStore.state.submissionAttempts <= 1
                ) {
                    this.options.onSubmitInvalid?.({ value: this.state.values, formApi: this, meta: i });
                    return;
                }
                this.baseStore.setState((d) => ({ ...d, isSubmitting: !0 }));
                const a = () => {
                    this.baseStore.setState((d) => ({ ...d, isSubmitting: !1 }));
                };
                if ((await this.validateAllFields('submit'), !this.state.isFieldsValid)) {
                    (a(),
                        this.options.onSubmitInvalid?.({ value: this.state.values, formApi: this, meta: i }),
                        Ot.emit('form-submission', {
                            id: this._formId,
                            submissionAttempt: this.state.submissionAttempts,
                            successful: !1,
                            stage: 'validateAllFields',
                            errors: Object.values(this.state.fieldMeta)
                                .map((d) => d.errors)
                                .flat(),
                        }));
                    return;
                }
                if ((await this.validate('submit'), !this.state.isValid)) {
                    (a(),
                        this.options.onSubmitInvalid?.({ value: this.state.values, formApi: this, meta: i }),
                        Ot.emit('form-submission', {
                            id: this._formId,
                            submissionAttempt: this.state.submissionAttempts,
                            successful: !1,
                            stage: 'validate',
                            errors: this.state.errors,
                        }));
                    return;
                }
                (Ze(() => {
                    Object.values(this.fieldInfo).forEach((d) => {
                        d.instance?.triggerOnSubmitListener();
                    });
                }),
                    this.options.listeners?.onSubmit?.({ formApi: this, meta: i }));
                try {
                    (await this.options.onSubmit?.({ value: this.state.values, formApi: this, meta: i }),
                        Ze(() => {
                            (this.baseStore.setState((d) => ({ ...d, isSubmitted: !0, isSubmitSuccessful: !0 })),
                                Ot.emit('form-submission', {
                                    id: this._formId,
                                    submissionAttempt: this.state.submissionAttempts,
                                    successful: !0,
                                }),
                                a());
                        }));
                } catch (d) {
                    throw (
                        this.baseStore.setState((u) => ({ ...u, isSubmitSuccessful: !1 })),
                        Ot.emit('form-submission', {
                            id: this._formId,
                            submissionAttempt: this.state.submissionAttempts,
                            successful: !1,
                            stage: 'inflight',
                            onError: d,
                        }),
                        a(),
                        d
                    );
                }
            }),
            (this.getFieldValue = (o) => gr(this.state.values, o)),
            (this.getFieldMeta = (o) => this.state.fieldMeta[o]),
            (this.getFormGroupMeta = (o) => this.formGroupMetaDerived.state[o]),
            (this.getFieldInfo = (o) =>
                (this.fieldInfo[o] ||= {
                    instance: null,
                    validationMetaMap: {
                        onChange: void 0,
                        onBlur: void 0,
                        onSubmit: void 0,
                        onMount: void 0,
                        onServer: void 0,
                        onDynamic: void 0,
                    },
                })),
            (this.setFieldMeta = (o, i) => {
                this.baseStore.setState((a) => ({
                    ...a,
                    fieldMetaBase: { ...a.fieldMetaBase, [o]: kr(i, a.fieldMetaBase[o]) },
                }));
            }),
            (this.resetFieldMeta = (o) =>
                Object.keys(o).reduce((i, a) => {
                    const d = a;
                    return ((i[d] = at), i);
                }, {})),
            (this.setFieldValue = (o, i, a) => {
                const d = a?.dontUpdateMeta ?? !1,
                    u = a?.dontRunListeners ?? !1,
                    l = a?.dontValidate ?? !1;
                (Ze(() => {
                    (d ||
                        this.setFieldMeta(o, (c) => ({
                            ...c,
                            isTouched: !0,
                            isDirty: !0,
                            errorMap: { ...c?.errorMap, onMount: void 0 },
                        })),
                        this.baseStore.setState((c) => ({ ...c, values: Br(c.values, o, i) })));
                }),
                    u || this.getFieldInfo(o).instance?.triggerOnChangeListener(),
                    l || this.validateField(o, 'change'));
            }),
            (this.deleteField = (o) => {
                const a = [
                    ...Object.keys(this.fieldInfo).filter((d) => {
                        const u = o.toString();
                        return d !== u && d.startsWith(u);
                    }),
                    o,
                ];
                this.baseStore.setState((d) => {
                    const u = { ...d };
                    return (
                        a.forEach((l) => {
                            ((u.values = OM(u.values, l)), delete this.fieldInfo[l], delete u.fieldMetaBase[l]);
                        }),
                        u
                    );
                });
            }),
            (this.pushFieldValue = (o, i, a) => {
                (this.setFieldValue(o, (d) => [...(Array.isArray(d) ? d : []), i], a), gn(this).bumpArrayVersion(o));
            }),
            (this.insertFieldValue = async (o, i, a, d) => {
                this.setFieldValue(o, (l) => [...l.slice(0, i), a, ...l.slice(i)], mt(d, { dontValidate: !0 }));
                const u = d?.dontValidate ?? !1;
                (u || (await this.validateField(o, 'change')),
                    gn(this).handleArrayInsert(o, i),
                    u || (await this.validateArrayFieldsStartingFrom(o, i, 'change')));
            }),
            (this.replaceFieldValue = async (o, i, a, d) => {
                (this.setFieldValue(o, (l) => l.map((c, f) => (f === i ? a : c)), mt(d, { dontValidate: !0 })),
                    gn(this).bumpArrayVersion(o),
                    (d?.dontValidate ?? !1) ||
                        (await this.validateField(o, 'change'),
                        await this.validateArrayFieldsStartingFrom(o, i, 'change')));
            }),
            (this.removeFieldValue = async (o, i, a) => {
                const d = this.getFieldValue(o),
                    u = Array.isArray(d) ? Math.max(d.length - 1, 0) : null;
                if (
                    (this.setFieldValue(o, (c) => c.filter((f, p) => p !== i), mt(a, { dontValidate: !0 })),
                    gn(this).handleArrayRemove(o, i),
                    u !== null)
                ) {
                    const c = `${o}[${u}]`;
                    this.deleteField(c);
                }
                (a?.dontValidate ?? !1) ||
                    (await this.validateField(o, 'change'), await this.validateArrayFieldsStartingFrom(o, i, 'change'));
            }),
            (this.swapFieldValues = (o, i, a, d) => {
                (this.setFieldValue(
                    o,
                    (l) => {
                        const c = l[i],
                            f = l[a];
                        return Br(Br(l, `${i}`, f), `${a}`, c);
                    },
                    mt(d, { dontValidate: !0 })
                ),
                    gn(this).handleArraySwap(o, i, a),
                    (d?.dontValidate ?? !1) ||
                        (this.validateField(o, 'change'),
                        this.validateField(`${o}[${i}]`, 'change'),
                        this.validateField(`${o}[${a}]`, 'change')));
            }),
            (this.moveFieldValues = (o, i, a, d) => {
                (this.setFieldValue(
                    o,
                    (l) => {
                        const c = [...l];
                        return (c.splice(a, 0, c.splice(i, 1)[0]), c);
                    },
                    mt(d, { dontValidate: !0 })
                ),
                    gn(this).handleArrayMove(o, i, a),
                    (d?.dontValidate ?? !1) ||
                        (this.validateField(o, 'change'),
                        this.validateField(`${o}[${i}]`, 'change'),
                        this.validateField(`${o}[${a}]`, 'change')));
            }),
            (this.clearFieldValues = (o, i) => {
                const a = this.getFieldValue(o),
                    d = Array.isArray(a) ? Math.max(a.length - 1, 0) : null;
                if ((this.setFieldValue(o, [], mt(i, { dontValidate: !0 })), gn(this).bumpArrayVersion(o), d !== null))
                    for (let l = 0; l <= d; l++) {
                        const c = `${o}[${l}]`;
                        this.deleteField(c);
                    }
                (i?.dontValidate ?? !1) || this.validateField(o, 'change');
            }),
            (this.resetField = (o) => {
                this.baseStore.setState((i) => {
                    const a = this.getFieldInfo(o).instance?.options.defaultValue,
                        d = gr(this.options.defaultValues, o),
                        u = a ?? d;
                    return {
                        ...i,
                        fieldMetaBase: { ...i.fieldMetaBase, [o]: at },
                        values: u !== void 0 ? Br(i.values, o, u) : i.values,
                    };
                });
            }),
            (this.setErrorMap = (o) => {
                Ze(() => {
                    Object.entries(o).forEach(([i, a]) => {
                        const d = i;
                        if (Zs(a)) {
                            const { formError: u, fieldErrors: l } = to(a);
                            for (const c of Object.keys(this.fieldInfo))
                                this.getFieldMeta(c) &&
                                    this.setFieldMeta(c, (p) => ({
                                        ...p,
                                        errorMap: { ...p.errorMap, [d]: l?.[c] },
                                        errorSourceMap: { ...p.errorSourceMap, [d]: 'form' },
                                    }));
                            this.baseStore.setState((c) => ({ ...c, errorMap: { ...c.errorMap, [d]: u } }));
                        } else this.baseStore.setState((u) => ({ ...u, errorMap: { ...u.errorMap, [d]: a } }));
                    });
                });
            }),
            (this.getAllErrors = () => ({
                form: { errors: this.state.errors, errorMap: this.state.errorMap },
                fields: Object.entries(this.state.fieldMeta).reduce(
                    (o, [i, a]) => (
                        Object.keys(a).length && a.errors.length && (o[i] = { errors: a.errors, errorMap: a.errorMap }),
                        o
                    ),
                    {}
                ),
            })),
            (this.parseValuesWithSchema = (o) =>
                Zn.validate({ value: this.state.values, validationSource: 'form' }, o)),
            (this.parseValuesWithSchemaAsync = (o) =>
                Zn.validateAsync({ value: this.state.values, validationSource: 'form' }, o)),
            (this.timeoutIds = { validations: {}, listeners: {}, formListeners: {} }),
            (this._formId = t?.formId ?? Oh()),
            (this._devtoolsSubmissionOverride = !1));
        let n = Ei({ ...t?.defaultState, values: t?.defaultValues ?? t?.defaultState?.values });
        if (t?.transform) {
            n = t.transform({ state: n }).state;
            for (const o of Object.keys(n.errorMap)) {
                const i = n.errorMap[o];
                if (!(i === void 0 || !Zs(i)))
                    for (const a of Object.keys(i.fields)) {
                        const d = i.fields[a];
                        if (d === void 0) continue;
                        const u = n.fieldMetaBase[a];
                        n.fieldMetaBase[a] = {
                            isTouched: !1,
                            isValidating: !1,
                            isBlurred: !1,
                            isDirty: !1,
                            _arrayVersion: 0,
                            _pendingValidationsCount: 0,
                            ...(u ?? {}),
                            errorSourceMap: { ...(u?.errorSourceMap ?? {}), onChange: 'form' },
                            errorMap: { ...(u?.errorMap ?? {}), [o]: d },
                        };
                    }
            }
        }
        this.baseStore = Wn(n);
        let r;
        ((this.fieldMetaDerived = Wn((o) => {
            const i = this.baseStore.get();
            let a = 0;
            const d = {};
            for (const u of Object.keys(i.fieldMetaBase)) {
                const l = i.fieldMetaBase[u],
                    c = r?.fieldMetaBase[u],
                    f = o?.[u],
                    p = gr(i.values, u);
                let h = f?.errors;
                if (!c || l.errorMap !== c.errorMap) {
                    h = Object.values(l.errorMap ?? {}).filter((R) => R !== void 0);
                    const b = this.getFieldInfo(u)?.instance;
                    (!b || !b.options.disableErrorFlat) && (h = h.flat(1));
                }
                const g = !_M(h),
                    m = !l.isDirty,
                    y = nn(
                        p,
                        this.getFieldInfo(u)?.instance?.options.defaultValue ?? gr(this.options.defaultValues, u)
                    );
                if (f && f.isPristine === m && f.isValid === g && f.isDefaultValue === y && f.errors === h && l === c) {
                    ((d[u] = f), a++);
                    continue;
                }
                d[u] = { ...l, errors: h ?? [], isPristine: m, isValid: g, isDefaultValue: y };
            }
            return Object.keys(i.fieldMetaBase).length
                ? o && a === Object.keys(i.fieldMetaBase).length
                    ? o
                    : ((r = this.baseStore.get()), d)
                : d;
        })),
            (this.formGroupMetaDerived = Wn((o) => {
                const i = this.baseStore.get(),
                    a = this.fieldMetaDerived.get(),
                    d = {};
                for (const u of this.formGroupApis) {
                    const l = u.name,
                        c = i.formGroupStateBase[l] ?? {
                            isSubmitted: !1,
                            isSubmitting: !1,
                            isValidating: !1,
                            submissionAttempts: 0,
                            isSubmitSuccessful: !1,
                        },
                        f = a[l];
                    let p = !1,
                        h = !0,
                        g = !1,
                        m = !1,
                        y = !0,
                        b = !1;
                    for (const k in a) {
                        if (k === l || !Jn(l, k)) continue;
                        const _ = a[k];
                        _ &&
                            (_.isValidating && (p = !0),
                            _.isValid || (h = !1),
                            _.isTouched && (g = !0),
                            _.isBlurred && (m = !0),
                            _.isDefaultValue || (y = !1),
                            _.isDirty && (b = !0));
                    }
                    const R = !b,
                        w = !!p || c.isValidating,
                        E = f?.errorMap ?? {},
                        C = f?.errorSourceMap ?? {},
                        M = !!(
                            E.onMount ||
                            Object.entries(a).some(([k, _]) => _ && k !== l && Jn(l, k) && _.errorMap.onMount)
                        ),
                        S = o?.[l];
                    let P = S?.errors ?? [];
                    (!S || S.__srcErrorMap !== E) &&
                        (P = Object.values(E).reduce((k, _) => {
                            if (_ === void 0) return k;
                            if (_ && typeof _ == 'object' && 'fields' in _) {
                                const B = _.group;
                                return (B !== void 0 && k.push(B), k);
                            }
                            return (k.push(_), k);
                        }, []));
                    const I = P.length === 0,
                        V = h && I,
                        A = u.options.canSubmitWhenInvalid ?? !1,
                        O = (c.submissionAttempts === 0 && !g && !M) || (!w && !c.isSubmitting && V) || A;
                    if (
                        S &&
                        S.errorMap === E &&
                        S.errorSourceMap === C &&
                        S.errors === P &&
                        S.isFieldsValidating === p &&
                        S.isFieldsValid === h &&
                        S.isGroupValid === I &&
                        S.isValid === V &&
                        S.canSubmit === O &&
                        S.isTouched === g &&
                        S.isBlurred === m &&
                        S.isPristine === R &&
                        S.isDefaultValue === y &&
                        S.isDirty === b &&
                        S.isValidating === w &&
                        S.isSubmitting === c.isSubmitting &&
                        S.isSubmitted === c.isSubmitted &&
                        S.submissionAttempts === c.submissionAttempts &&
                        S.isSubmitSuccessful === c.isSubmitSuccessful
                    ) {
                        d[l] = S;
                        continue;
                    }
                    const L = {
                        ...c,
                        errorMap: E,
                        errorSourceMap: C,
                        _arrayVersion: f?._arrayVersion ?? 0,
                        isTouched: g,
                        isBlurred: m,
                        isDirty: b,
                        isPristine: R,
                        isDefaultValue: y,
                        isValid: V,
                        errors: P,
                        isValidating: w,
                        isFieldsValidating: p,
                        isFieldsValid: h,
                        isGroupValid: I,
                        canSubmit: O,
                    };
                    (Object.defineProperty(L, '__srcErrorMap', { value: E, enumerable: !1, configurable: !0 }),
                        (d[l] = L));
                }
                return d;
            })));
        let s;
        ((this.store = Wn((o) => {
            const i = this.baseStore.get(),
                a = this.fieldMetaDerived.get(),
                d = Object.values(a).filter(Boolean),
                u = d.some((I) => I.isValidating),
                l = d.every((I) => I.isValid),
                c = d.some((I) => I.isTouched),
                f = d.some((I) => I.isBlurred),
                p = d.every((I) => I.isDefaultValue),
                h = c && i.errorMap?.onMount,
                g = d.some((I) => I.isDirty),
                m = !g,
                y = !!(i.errorMap?.onMount || d.some((I) => I?.errorMap?.onMount)),
                b = !!u;
            let R = o?.errors ?? [];
            (!s || i.errorMap !== s.errorMap) &&
                (R = Object.values(i.errorMap).reduce(
                    (I, V) => (V === void 0 ? I : V && Zs(V) ? (I.push(V.form), I) : (I.push(V), I)),
                    []
                ));
            const w = R.length === 0,
                E = l && w,
                C = this.options.canSubmitWhenInvalid ?? !1,
                M = (i.submissionAttempts === 0 && !c && !y) || (!b && !i.isSubmitting && E) || C;
            let S = i.errorMap;
            if (
                (h && ((R = R.filter((I) => I !== i.errorMap.onMount)), (S = Object.assign(S, { onMount: void 0 }))),
                o &&
                    s &&
                    o.errorMap === S &&
                    o.fieldMeta === this.fieldMetaDerived.state &&
                    o.errors === R &&
                    o.isFieldsValidating === u &&
                    o.isFieldsValid === l &&
                    o.isFormValid === w &&
                    o.isValid === E &&
                    o.canSubmit === M &&
                    o.isTouched === c &&
                    o.isBlurred === f &&
                    o.isPristine === m &&
                    o.isDefaultValue === p &&
                    o.isDirty === g &&
                    nn(s, i))
            )
                return o;
            const P = {
                ...i,
                errorMap: S,
                fieldMeta: this.fieldMetaDerived.state,
                errors: R,
                isFieldsValidating: u,
                isFieldsValid: l,
                isFormValid: w,
                isValid: E,
                canSubmit: M,
                isTouched: c,
                isBlurred: f,
                isPristine: m,
                isDefaultValue: p,
                isDirty: g,
            };
            return ((s = this.baseStore.get()), P);
        })),
            (this.handleSubmit = this.handleSubmit.bind(this)),
            this.update(t || {}));
    }
    get state() {
        return this.store.state;
    }
    get formId() {
        return this._formId;
    }
    runValidator(t) {
        return uc(t.validate) ? Zn[t.type](t.value, t.validate) : t.validate(t.value);
    }
    handleSubmit(t) {
        return this._handleSubmit(t);
    }
}
function to(e) {
    if (e) {
        if (Zs(e)) {
            const t = to(e.form).formError,
                n = e.fields;
            return { formError: t, fieldErrors: n };
        }
        return { formError: e };
    }
    return { formError: void 0 };
}
function $r(e) {
    switch (e) {
        case 'submit':
            return 'onSubmit';
        case 'blur':
            return 'onBlur';
        case 'mount':
            return 'onMount';
        case 'server':
            return 'onServer';
        case 'dynamic':
            return 'onDynamic';
        default:
            return 'onChange';
    }
}
class cs {
    constructor(t) {
        ((this.options = {}),
            (this.mount = () => {
                this.options.defaultValue !== void 0 &&
                    !this.getMeta().isTouched &&
                    this.form.setFieldValue(this.name, this.options.defaultValue, { dontUpdateMeta: !0 });
                const n = this.getInfo();
                ((n.instance = this), this.update(this.options));
                const { onMount: r } = this.options.validators || {};
                if (r) {
                    const s = this.runValidator({
                        validate: r,
                        value: { value: this.state.value, fieldApi: this, validationSource: 'field' },
                        type: 'validate',
                    });
                    s &&
                        this.setMeta((o) => ({
                            ...o,
                            errorMap: { ...o?.errorMap, onMount: s },
                            errorSourceMap: { ...o?.errorSourceMap, onMount: 'field' },
                        }));
                }
                return (
                    this.options.listeners?.onMount?.({ value: this.state.value, fieldApi: this }),
                    () => {
                        for (const [o, i] of Object.entries(this.timeoutIds.validations))
                            i && (clearTimeout(i), (this.timeoutIds.validations[o] = null));
                        for (const [o, i] of Object.entries(this.timeoutIds.listeners))
                            i && (clearTimeout(i), (this.timeoutIds.listeners[o] = null));
                        for (const [o, i] of Object.entries(this.timeoutIds.formListeners))
                            i && (clearTimeout(i), (this.timeoutIds.formListeners[o] = null));
                        const s = this.form.fieldInfo[this.name];
                        if (s && s.instance === this) {
                            for (const [o, i] of Object.entries(s.validationMetaMap))
                                (i?.lastAbortController.abort(), (s.validationMetaMap[o] = void 0));
                            (this.form.baseStore.setState((o) => ({
                                ...o,
                                fieldMetaBase: {
                                    ...o.fieldMetaBase,
                                    [this.name]: {
                                        ...at,
                                        isTouched: o.fieldMetaBase[this.name]?.isTouched ?? at.isTouched,
                                        isBlurred: o.fieldMetaBase[this.name]?.isBlurred ?? at.isBlurred,
                                        isDirty: o.fieldMetaBase[this.name]?.isDirty ?? at.isDirty,
                                    },
                                },
                            })),
                                (s.instance = null),
                                this.options.listeners?.onUnmount?.({ value: this.state.value, fieldApi: this }),
                                this.form.options.listeners?.onFieldUnmount?.({ formApi: this.form, fieldApi: this }));
                        }
                    }
                );
            }),
            (this.update = (n) => {
                if (
                    ((this.options = n),
                    (this.name = n.name),
                    !this.state.meta.isTouched && this.options.defaultValue !== void 0)
                ) {
                    const r = this.form.getFieldValue(this.name);
                    nn(r, n.defaultValue) ||
                        this.form.setFieldValue(this.name, n.defaultValue, {
                            dontUpdateMeta: !0,
                            dontValidate: !0,
                            dontRunListeners: !0,
                        });
                }
                this.form.getFieldMeta(this.name) || this.form.setFieldMeta(this.name, this.state.meta);
            }),
            (this.getValue = () => this.form.getFieldValue(this.name)),
            (this.setValue = (n, r) => {
                (this.form.setFieldValue(this.name, n, mt(r, { dontRunListeners: !0, dontValidate: !0 })),
                    r?.dontRunListeners || this.triggerOnChangeListener(),
                    r?.dontValidate || this.validate('change'));
            }),
            (this.getMeta = () => this.store.state.meta),
            (this.setMeta = (n) => this.form.setFieldMeta(this.name, n)),
            (this.getInfo = () => this.form.getFieldInfo(this.name)),
            (this.pushValue = (n, r) => {
                (this.form.pushFieldValue(this.name, n, mt(r, { dontRunListeners: !0 })),
                    r?.dontRunListeners || this.triggerOnChangeListener());
            }),
            (this.insertValue = (n, r, s) => {
                (this.form.insertFieldValue(this.name, n, r, mt(s, { dontRunListeners: !0 })),
                    s?.dontRunListeners || this.triggerOnChangeListener());
            }),
            (this.replaceValue = (n, r, s) => {
                (this.form.replaceFieldValue(this.name, n, r, mt(s, { dontRunListeners: !0 })),
                    s?.dontRunListeners || this.triggerOnChangeListener());
            }),
            (this.removeValue = (n, r) => {
                (this.form.removeFieldValue(this.name, n, mt(r, { dontRunListeners: !0 })),
                    r?.dontRunListeners || this.triggerOnChangeListener());
            }),
            (this.swapValues = (n, r, s) => {
                (this.form.swapFieldValues(this.name, n, r, mt(s, { dontRunListeners: !0 })),
                    s?.dontRunListeners || this.triggerOnChangeListener());
            }),
            (this.moveValue = (n, r, s) => {
                (this.form.moveFieldValues(this.name, n, r, mt(s, { dontRunListeners: !0 })),
                    s?.dontRunListeners || this.triggerOnChangeListener());
            }),
            (this.clearValues = (n) => {
                (this.form.clearFieldValues(this.name, mt(n, { dontRunListeners: !0 })),
                    n?.dontRunListeners || this.triggerOnChangeListener());
            }),
            (this.getLinkedFields = (n) => {
                const r = Object.values(this.form.fieldInfo),
                    s = [];
                for (const o of r) {
                    if (!o.instance || !(o.instance instanceof cs)) continue;
                    const { onChangeListenTo: i, onBlurListenTo: a } = o.instance.options.validators || {};
                    (n === 'change' && i?.includes(this.name) && s.push(o.instance),
                        n === 'blur' && a?.includes(this.name) && s.push(o.instance));
                }
                return s;
            }),
            (this.validateSync = (n, r) => {
                const s = is(n, {
                        ...this.options,
                        form: this.form,
                        fieldName: this.name,
                        validationLogic: this.form.options.validationLogic || Bt,
                    }),
                    i = this.getLinkedFields(n).reduce((u, l) => {
                        const c = is(n, {
                            ...l.options,
                            form: l.form,
                            fieldName: l.name,
                            validationLogic: l.form.options.validationLogic || Bt,
                        });
                        return (
                            c.forEach((f) => {
                                f.field = l;
                            }),
                            u.concat(c)
                        );
                    }, []);
                let a = !1;
                Ze(() => {
                    const u = (l, c) => {
                        const f = zr(c.cause),
                            p = c.validate
                                ? cu(
                                      l.runValidator({
                                          validate: c.validate,
                                          value: { value: l.store.state.value, validationSource: 'field', fieldApi: l },
                                          type: 'validate',
                                      })
                                  )
                                : void 0,
                            h = r[f],
                            { newErrorValue: g, newSource: m } = Io({ formLevelError: h, fieldLevelError: p });
                        (l.state.meta.errorMap?.[f] !== g &&
                            l.setMeta((y) => ({
                                ...y,
                                errorMap: { ...y.errorMap, [f]: g },
                                errorSourceMap: { ...y.errorSourceMap, [f]: m },
                            })),
                            g && (a = !0));
                    };
                    for (const l of s) u(this, l);
                    for (const l of i) l.validate && u(l.field, l);
                });
                const d = zr('submit');
                return (
                    this.state.meta.errorMap?.[d] &&
                        n !== 'submit' &&
                        !a &&
                        this.setMeta((u) => ({
                            ...u,
                            errorMap: { ...u.errorMap, [d]: void 0 },
                            errorSourceMap: { ...u.errorSourceMap, [d]: void 0 },
                        })),
                    { hasErrored: a }
                );
            }),
            (this.validateAsync = async (n, r) => {
                const s = as(n, {
                        ...this.options,
                        form: this.form,
                        fieldName: this.name,
                        validationLogic: this.form.options.validationLogic || Bt,
                    }),
                    o = await r,
                    a = this.getLinkedFields(n).reduce((h, g) => {
                        const m = as(n, {
                            ...g.options,
                            form: g.form,
                            fieldName: g.name,
                            validationLogic: g.form.options.validationLogic || Bt,
                        });
                        return (
                            m.forEach((y) => {
                                y.field = g;
                            }),
                            h.concat(m)
                        );
                    }, []),
                    d = [],
                    u = [],
                    l = s.some((h) => h.validate),
                    c = Array.from(new Set(a.filter((h) => h.validate).map((h) => h.field)));
                Ze(() => {
                    l && this.startValidation();
                    for (const h of c) h.startValidation();
                });
                const f = (h, g, m) => {
                    const y = zr(g.cause),
                        b = h.getInfo();
                    b.validationMetaMap[y]?.lastAbortController.abort();
                    const w = new AbortController();
                    ((b.validationMetaMap[y] = { lastAbortController: w }),
                        m.push(
                            new Promise(async (E) => {
                                let C;
                                try {
                                    C = await new Promise((V, A) => {
                                        (h.timeoutIds.validations[g.cause] &&
                                            (clearTimeout(h.timeoutIds.validations[g.cause]), h.endValidation()),
                                            (h.timeoutIds.validations[g.cause] = setTimeout(async () => {
                                                if (w.signal.aborted) return V(void 0);
                                                try {
                                                    V(
                                                        await this.runValidator({
                                                            validate: g.validate,
                                                            value: {
                                                                value: h.store.state.value,
                                                                fieldApi: h,
                                                                signal: w.signal,
                                                                validationSource: 'field',
                                                            },
                                                            type: 'validateAsync',
                                                        })
                                                    );
                                                } catch (O) {
                                                    A(O);
                                                }
                                            }, g.debounceMs)));
                                    });
                                } catch (V) {
                                    C = V;
                                }
                                if (w.signal.aborted) return E(void 0);
                                const M = cu(C),
                                    S = o[h.name]?.[y],
                                    { newErrorValue: P, newSource: I } = Io({ formLevelError: S, fieldLevelError: M });
                                if (h.getInfo().instance !== h) return E(void 0);
                                (h.setMeta((V) => ({
                                    ...V,
                                    errorMap: { ...V?.errorMap, [y]: P },
                                    errorSourceMap: { ...V.errorSourceMap, [y]: I },
                                })),
                                    E(P));
                            })
                        ));
                };
                for (const h of s) h.validate && f(this, h, d);
                for (const h of a) h.validate && f(h.field, h, u);
                let p = [];
                return (
                    (d.length || u.length) && ((p = await Promise.all(d)), await Promise.all(u)),
                    Ze(() => {
                        l && this.endValidation();
                        for (const h of c) h.endValidation();
                    }),
                    p.filter(Boolean)
                );
            }),
            (this.validate = (n, r) => {
                if (!this.state.meta.isTouched) return [];
                const s = r?.skipGroupValidation
                    ? []
                    : Array.from(this.form.formGroupApis).filter((f) => this.name.startsWith(f.name));
                let i =
                    (r?.skipFormValidation ? { fieldsErrorMap: {} } : this.form.validateSync(n)).fieldsErrorMap[
                        this.name
                    ] ?? {};
                if (!r?.skipFormValidation)
                    for (const f of s) {
                        if (f.state.meta.submissionAttempts === 0) continue;
                        const { fieldsErrorMap: p } = this.form.validateSync(n, {
                            group: f,
                            dontUpdateFormErrorMap: !0,
                            filterFieldNames: (h) => Jn(f.name, h),
                        });
                        i = { ...i, ...(p[this.name] ?? {}) };
                    }
                const { hasErrored: a } = this.validateSync(n, i),
                    d = new WeakMap();
                for (const f of s) {
                    const { hasErrored: p } = f.validateSync(n, {}, { skipRelatedFieldValidation: !0 });
                    d.set(f, p);
                }
                if (a && !this.options.asyncAlways) {
                    this.getInfo().validationMetaMap[zr(n)]?.lastAbortController.abort();
                    const f = [];
                    for (const p of s)
                        (p.getInfo().validationMetaMap[zr(n)]?.lastAbortController.abort(),
                            f.push(p.state.meta.errors));
                    return [...this.state.meta.errors, ...f.flat()];
                }
                const u = r?.skipFormValidation ? Promise.resolve({}) : this.form.validateAsync(n),
                    l = this.validateAsync(n, u),
                    c = [];
                for (const f of s)
                    (d.get(f) && !f.options.asyncAlways) ||
                        c.push(f.validateAsync(n, u, { skipRelatedFieldValidation: !0 }));
                return c.length === 0 ? l : Promise.all([l, ...c]).then((f) => f.flat());
            }),
            (this.handleChange = (n) => {
                this.setValue(n);
            }),
            (this.handleBlur = () => {
                (this.state.meta.isTouched || this.setMeta((r) => ({ ...r, isTouched: !0 })),
                    this.state.meta.isBlurred || this.setMeta((r) => ({ ...r, isBlurred: !0 })),
                    this.validate('blur'),
                    this.triggerOnBlurListener());
            }),
            (this.setErrorMap = (n) => {
                this.setMeta((r) => ({ ...r, errorMap: { ...r.errorMap, ...n } }));
            }),
            (this.parseValueWithSchema = (n) => Zn.validate({ value: this.state.value, validationSource: 'field' }, n)),
            (this.parseValueWithSchemaAsync = (n) =>
                Zn.validateAsync({ value: this.state.value, validationSource: 'field' }, n)),
            (this.triggerOnBlurListener = () => {
                const n = this.form.options.listeners?.onBlurDebounceMs;
                n && n > 0
                    ? (this.timeoutIds.formListeners.blur && clearTimeout(this.timeoutIds.formListeners.blur),
                      (this.timeoutIds.formListeners.blur = setTimeout(() => {
                          this.form.options.listeners?.onBlur?.({ formApi: this.form, fieldApi: this });
                      }, n)))
                    : this.form.options.listeners?.onBlur?.({ formApi: this.form, fieldApi: this });
                const r = this.options.listeners?.onBlurDebounceMs;
                r && r > 0
                    ? (this.timeoutIds.listeners.blur && clearTimeout(this.timeoutIds.listeners.blur),
                      (this.timeoutIds.listeners.blur = setTimeout(() => {
                          this.options.listeners?.onBlur?.({ value: this.state.value, fieldApi: this });
                      }, r)))
                    : this.options.listeners?.onBlur?.({ value: this.state.value, fieldApi: this });
            }),
            (this.triggerOnChangeListener = () => {
                const n = this.form.options.listeners?.onChangeDebounceMs;
                n && n > 0
                    ? (this.timeoutIds.formListeners.change && clearTimeout(this.timeoutIds.formListeners.change),
                      (this.timeoutIds.formListeners.change = setTimeout(() => {
                          this.form.options.listeners?.onChange?.({ formApi: this.form, fieldApi: this });
                      }, n)))
                    : this.form.options.listeners?.onChange?.({ formApi: this.form, fieldApi: this });
                const r = this.options.listeners?.onChangeDebounceMs;
                r && r > 0
                    ? (this.timeoutIds.listeners.change && clearTimeout(this.timeoutIds.listeners.change),
                      (this.timeoutIds.listeners.change = setTimeout(() => {
                          this.options.listeners?.onChange?.({ value: this.state.value, fieldApi: this });
                      }, r)))
                    : this.options.listeners?.onChange?.({ value: this.state.value, fieldApi: this });
                for (const s of this.form.formGroupApis) Jn(s.name, this.name) && s.triggerOnChangeListener();
            }),
            (this.triggerOnSubmitListener = () => {
                this.options.listeners?.onSubmit?.({ value: this.state.value, fieldApi: this });
            }),
            (this.form = t.form),
            (this.name = t.name),
            (this.options = t),
            (this.timeoutIds = { validations: {}, listeners: {}, formListeners: {} }),
            (this.store = Wn((n) => {
                this.form.store.get();
                const r = this.form.getFieldMeta(this.name) ?? { ...at, ...t.defaultMeta };
                let s = this.form.getFieldValue(this.name);
                return (
                    !r.isTouched &&
                        s === void 0 &&
                        this.options.defaultValue !== void 0 &&
                        !nn(s, this.options.defaultValue) &&
                        (s = this.options.defaultValue),
                    n && n.value === s && n.meta === r ? n : { value: s, meta: r }
                );
            })));
    }
    get state() {
        return this.store.state;
    }
    runValidator(t) {
        return uc(t.validate) ? Zn[t.type](t.value, t.validate) : t.validate(t.value);
    }
    startValidation() {
        this.setMeta((t) => {
            const n = t._pendingValidationsCount + 1;
            return { ...t, _pendingValidationsCount: n, isValidating: n > 0 && !t.isValidating ? !0 : t.isValidating };
        });
    }
    endValidation() {
        this.setMeta((t) => {
            const n = Math.max(0, t._pendingValidationsCount - 1);
            return { ...t, _pendingValidationsCount: n, isValidating: n === 0 && t.isValidating ? !1 : t.isValidating };
        });
    }
}
function cu(e) {
    if (e) return e;
}
function zr(e) {
    switch (e) {
        case 'submit':
            return 'onSubmit';
        case 'blur':
            return 'onBlur';
        case 'mount':
            return 'onMount';
        case 'server':
            return 'onServer';
        case 'dynamic':
            return 'onDynamic';
        default:
            return 'onChange';
    }
}
function Mi(e) {
    return {
        isSubmitted: e.isSubmitted ?? !1,
        isSubmitting: e.isSubmitting ?? !1,
        isValidating: e.isValidating ?? !1,
        submissionAttempts: e.submissionAttempts ?? 0,
        isSubmitSuccessful: e.isSubmitSuccessful ?? !1,
    };
}
function VM(e) {
    return {
        ...at,
        ...e,
        errors: [],
        isPristine: !0,
        isValid: !0,
        isDefaultValue: !0,
        isFieldsValidating: !1,
        isFieldsValid: !0,
        isGroupValid: !0,
        canSubmit: !0,
        isSubmitting: !1,
        isSubmitted: !1,
        isValidating: !1,
        submissionAttempts: 0,
        isSubmitSuccessful: !1,
    };
}
class ls {
    constructor(t) {
        ((this.options = {}),
            (this.setFormGroupState = (n) => {
                this.form.baseStore.setState((r) => {
                    const s = r.formGroupStateBase[this.name] ?? Mi({});
                    return { ...r, formGroupStateBase: { ...r.formGroupStateBase, [this.name]: n(s) } };
                });
            }),
            (this._lastDistributedFieldNames = {}),
            (this.update = (n) => {
                if (
                    ((this.options = n),
                    (this.name = n.name),
                    !this.state.meta.isTouched && this.options.defaultValue !== void 0)
                ) {
                    const r = this.form.getFieldValue(this.name);
                    nn(r, n.defaultValue) ||
                        this.form.setFieldValue(this.name, n.defaultValue, {
                            dontUpdateMeta: !0,
                            dontValidate: !0,
                            dontRunListeners: !0,
                        });
                }
                this.form.getFieldMeta(this.name) ||
                    this.form.setFieldMeta(this.name, { ...at, ...this.options.defaultMeta });
            }),
            (this.mount = () => {
                (this.update(this.options),
                    this.form.formGroupApis.add(this),
                    (this.fieldInfo.instance = this),
                    this.form.baseStore.setState((r) => ({
                        ...r,
                        formGroupStateBase: {
                            ...r.formGroupStateBase,
                            [this.name]: r.formGroupStateBase[this.name] ?? Mi({ ...this.options.defaultState }),
                        },
                    })));
                const { onMount: n } = this.options.validators || {};
                if (n) {
                    const r = this.runValidator({
                        validate: n,
                        value: { value: this.state.value, groupApi: this, validationSource: 'form' },
                        type: 'validate',
                    });
                    let s = r,
                        o;
                    Pi(r) && ((s = r.group), (o = r.fields));
                    const i = Ci(s);
                    (i &&
                        this.setMeta((a) => ({
                            ...a,
                            errorMap: { ...a.errorMap, onMount: i },
                            errorSourceMap: { ...a.errorSourceMap, onMount: 'field' },
                        })),
                        this.distributeFieldErrors('onMount', o));
                }
                return (
                    this.options.listeners?.onMount?.({ value: this.state.value, groupApi: this }),
                    () => {
                        for (const [r, s] of Object.entries(this.timeoutIds.validations))
                            s && (clearTimeout(s), (this.timeoutIds.validations[r] = null));
                        for (const [r, s] of Object.entries(this.timeoutIds.listeners))
                            s && (clearTimeout(s), (this.timeoutIds.listeners[r] = null));
                        for (const [r, s] of Object.entries(this.timeoutIds.formListeners))
                            s && (clearTimeout(s), (this.timeoutIds.formListeners[r] = null));
                        if (this.fieldInfo.instance === this) {
                            for (const [r, s] of Object.entries(this.fieldInfo.validationMetaMap))
                                (s?.lastAbortController.abort(), (this.fieldInfo.validationMetaMap[r] = void 0));
                            (this.form.formGroupApis.delete(this),
                                this.form.baseStore.setState((r) => ({
                                    ...r,
                                    formGroupStateBase: { ...r.formGroupStateBase, [this.name]: Mi({}) },
                                })),
                                (this.fieldInfo.instance = null),
                                this.options.listeners?.onUnmount?.({ value: this.state.value, groupApi: this }));
                        }
                    }
                );
            }),
            (this.setValue = (n, r) => {
                (this.form.setFieldValue(this.name, n, mt(r, { dontRunListeners: !0, dontValidate: !0 })),
                    r?.dontRunListeners || this.triggerOnChangeListener(),
                    r?.dontValidate || this.validate('change'));
            }),
            (this.getMeta = () => this.store.state.meta),
            (this.setMeta = (n) => this.form.setFieldMeta(this.name, n)),
            (this.getInfo = () => this.fieldInfo),
            (this.getRelatedFields = () => {
                const n = Object.values(this.form.fieldInfo),
                    r = [];
                for (const s of n)
                    s.instance &&
                        s.instance instanceof cs &&
                        s.instance.name.startsWith(this.name) &&
                        r.push(s.instance);
                return r;
            }),
            (this.getRelatedFieldMetasDerived = () => {
                const n = Object.entries(this.form.fieldMetaDerived.state),
                    r = [];
                for (const [s, o] of n) s !== this.name && Jn(this.name, s) && r.push({ ...o, name: s });
                return r;
            }),
            (this.buildChildFieldName = (n) =>
                n === '' ? this.name : n.startsWith('[') ? `${this.name}${n}` : `${this.name}.${n}`),
            (this.distributeFieldErrors = (n, r) => {
                const s = this._lastDistributedFieldNames[n] ?? new Set(),
                    o = new Set();
                if (r)
                    for (const [d, u] of Object.entries(r)) u == null || u === !1 || o.add(this.buildChildFieldName(d));
                const i = new Set([...s, ...o]);
                let a = !1;
                for (const d of i) {
                    const u = d.startsWith(this.name + '[') ? d.slice(this.name.length) : d.slice(this.name.length + 1),
                        l = r?.[u],
                        c = this.form.getFieldMeta(d);
                    if (!c && !l) continue;
                    const f = c?.errorMap[n],
                        p = c?.errorSourceMap[n] === 'form',
                        { newErrorValue: h, newSource: g } = ca({
                            newFormValidatorError: l,
                            isPreviousErrorFromFormValidator: p,
                            previousErrorValue: f,
                        });
                    (h && (a = !0),
                        !(f === h && c?.errorSourceMap[n] === g) &&
                            this.form.setFieldMeta(d, (m = at) => ({
                                ...m,
                                errorMap: { ...m.errorMap, [n]: h },
                                errorSourceMap: { ...m.errorSourceMap, [n]: g },
                            })));
                }
                return ((this._lastDistributedFieldNames[n] = o), a);
            }),
            (this.validateSync = (n, r, s = {}) => {
                const o = is(n, {
                        ...this.options,
                        form: this.form,
                        group: this,
                        validationLogic: this.options.validationLogic || this.form.options.validationLogic || Bt,
                    }),
                    a = (s.skipRelatedFieldValidation ? [] : this.getRelatedFields()).reduce((l, c) => {
                        const f = is(n, {
                            ...c.options,
                            form: c.form,
                            validationLogic: c.form.options.validationLogic || Bt,
                        });
                        return (
                            f.forEach((p) => {
                                p.field = c;
                            }),
                            l.concat(f)
                        );
                    }, []);
                let d = !1;
                Ze(() => {
                    const l = (c, f) => {
                        const p = js(f.cause),
                            h = c === this;
                        let g;
                        f.validate &&
                            (g = c.runValidator({
                                validate: f.validate,
                                value: {
                                    value: c.store.state.value,
                                    validationSource: h ? 'form' : 'field',
                                    ...(c instanceof ls ? { groupApi: c } : { fieldApi: c }),
                                },
                                type: 'validate',
                            }));
                        let m = g,
                            y;
                        h && Pi(g) && ((m = g.group), (y = g.fields));
                        const b = Ci(m),
                            R = r[p],
                            { newErrorValue: w, newSource: E } = Io({ formLevelError: R, fieldLevelError: b });
                        (c.state.meta.errorMap?.[p] !== w &&
                            c.setMeta((C) => ({
                                ...C,
                                errorMap: { ...C.errorMap, [p]: w },
                                errorSourceMap: { ...C.errorSourceMap, [p]: E },
                            })),
                            w && (d = !0),
                            h && this.distributeFieldErrors(p, y) && (d = !0));
                    };
                    for (const c of o) l(this, c);
                    for (const c of a) c.validate && l(c.field, c);
                });
                const u = js('submit');
                return (
                    this.state.meta.errorMap?.[u] &&
                        n !== 'submit' &&
                        !d &&
                        this.setMeta((l) => ({
                            ...l,
                            errorMap: { ...l.errorMap, [u]: void 0 },
                            errorSourceMap: { ...l.errorSourceMap, [u]: void 0 },
                        })),
                    { hasErrored: d }
                );
            }),
            (this.validateAsync = async (n, r, s = {}) => {
                const o = as(n, {
                        ...this.options,
                        form: this.form,
                        group: this,
                        validationLogic: this.options.validationLogic || this.form.options.validationLogic || Bt,
                    }),
                    i = await r,
                    a = s.skipRelatedFieldValidation ? [] : this.getRelatedFields(),
                    d = a.reduce((h, g) => {
                        const m = as(n, {
                            ...g.options,
                            form: g.form,
                            validationLogic: g.form.options.validationLogic || Bt,
                        });
                        return (
                            m.forEach((y) => {
                                y.field = g;
                            }),
                            h.concat(m)
                        );
                    }, []),
                    u = [],
                    l = [],
                    c = o.some((h) => h.validate) || d.some((h) => h.validate);
                if (c) {
                    this.state.meta.isValidating || this.setMeta((h) => ({ ...h, isValidating: !0 }));
                    for (const h of a) h.setMeta((g) => ({ ...g, isValidating: !0 }));
                }
                const f = (h, g, m) => {
                    const y = js(g.cause),
                        b = h.getInfo();
                    b.validationMetaMap[y]?.lastAbortController.abort();
                    const w = new AbortController();
                    b.validationMetaMap[y] = { lastAbortController: w };
                    const E = h === this;
                    m.push(
                        new Promise(async (C) => {
                            let M;
                            try {
                                M = await new Promise((L, k) => {
                                    (h.timeoutIds.validations[g.cause] &&
                                        clearTimeout(h.timeoutIds.validations[g.cause]),
                                        (h.timeoutIds.validations[g.cause] = setTimeout(async () => {
                                            if (w.signal.aborted) return L(void 0);
                                            try {
                                                L(
                                                    await this.runValidator({
                                                        validate: g.validate,
                                                        value: {
                                                            value: h.store.state.value,
                                                            signal: w.signal,
                                                            validationSource: E ? 'form' : 'field',
                                                            ...(h instanceof ls ? { groupApi: h } : { fieldApi: h }),
                                                        },
                                                        type: 'validateAsync',
                                                    })
                                                );
                                            } catch (_) {
                                                k(_);
                                            }
                                        }, g.debounceMs)));
                                });
                            } catch (L) {
                                M = L;
                            }
                            if (w.signal.aborted) return C(void 0);
                            let S = M,
                                P;
                            E && Pi(M) && ((S = M.group), (P = M.fields));
                            const I = Ci(S),
                                V = i[h.name]?.[y],
                                { newErrorValue: A, newSource: O } = Io({ formLevelError: V, fieldLevelError: I });
                            if (h.getInfo().instance !== h) return C(void 0);
                            (h.setMeta((L) => ({
                                ...L,
                                errorMap: { ...L?.errorMap, [y]: A },
                                errorSourceMap: { ...L.errorSourceMap, [y]: O },
                            })),
                                E && this.distributeFieldErrors(y, P),
                                C(A));
                        })
                    );
                };
                for (const h of o) h.validate && f(this, h, u);
                for (const h of d) h.validate && f(h.field, h, l);
                let p = [];
                if (((u.length || l.length) && ((p = await Promise.all(u)), await Promise.all(l)), c)) {
                    this.setMeta((h) => ({ ...h, isValidating: !1 }));
                    for (const h of a) h.setMeta((g) => ({ ...g, isValidating: !1 }));
                }
                return p.filter(Boolean);
            }),
            (this.validateAllFields = async (n) => {
                const r = [];
                return (
                    Ze(() => {
                        Object.values(this.getRelatedFields()).forEach((o) => {
                            (r.push(
                                Promise.resolve().then(() =>
                                    o.validate(n, { skipFormValidation: !0, skipGroupValidation: !0 })
                                )
                            ),
                                o.store.state.meta.isTouched || o.setMeta((i) => ({ ...i, isTouched: !0 })));
                        });
                    }),
                    (await Promise.all(r)).flat()
                );
            }),
            (this.validateArrayFieldsStartingFrom = (n, r, s) => this.form.validateArrayFieldsStartingFrom(n, r, s)),
            (this.validateField = (n, r) => this.form.validateField(n, r)),
            (this.getFieldValue = (n) => this.form.getFieldValue(n)),
            (this.getFieldMeta = (n) => this.form.getFieldMeta(n)),
            (this.setFieldMeta = (n, r) => this.form.setFieldMeta(n, r)),
            (this.setFieldValue = (n, r) => this.form.setFieldValue(n, r)),
            (this.deleteField = (n) => this.form.deleteField(n)),
            (this.pushFieldValue = (n, r) => this.form.pushFieldValue(n, r)),
            (this.insertFieldValue = (n, r, s) => this.form.insertFieldValue(n, r, s)),
            (this.replaceFieldValue = (n, r, s) => this.form.replaceFieldValue(n, r, s)),
            (this.swapFieldValues = (n, r, s) => this.form.swapFieldValues(n, r, s)),
            (this.moveFieldValues = (n, r, s) => this.form.moveFieldValues(n, r, s)),
            (this.clearFieldValues = (n) => this.form.clearFieldValues(n)),
            (this.resetField = (n) => this.form.resetField(n)),
            (this.removeFieldValue = (n, r) => this.form.removeFieldValue(n, r)),
            (this.areRelatedFieldsValid = () =>
                Object.values(this.getRelatedFields()).every((n) => n.state.meta.isValid)),
            (this.validate = (n, r) => {
                const { fieldsErrorMap: s } = r?.skipFormValidation
                        ? { fieldsErrorMap: {} }
                        : this.form.validateSync(n, {
                              dontUpdateFormErrorMap: !0,
                              filterFieldNames: (a) => Jn(this.name, a),
                          }),
                    { hasErrored: o } = this.validateSync(n, s[this.name] ?? {}, {
                        skipRelatedFieldValidation: r?.skipRelatedFieldValidation,
                    });
                if (o && !this.options.asyncAlways)
                    return (
                        this.getInfo().validationMetaMap[js(n)]?.lastAbortController.abort(),
                        this.state.meta.errors
                    );
                const i = r?.skipFormValidation
                    ? Promise.resolve({})
                    : this.form.validateAsync(n, {
                          dontUpdateFormErrorMap: !0,
                          filterFieldNames: (a) => Jn(this.name, a),
                      });
                return this.validateAsync(n, i, { skipRelatedFieldValidation: r?.skipRelatedFieldValidation });
            }),
            (this.triggerOnChangeListener = () => {
                const n = this.form.options.listeners?.onChangeGroupDebounceMs;
                n && n > 0
                    ? (this.timeoutIds.formListeners.change && clearTimeout(this.timeoutIds.formListeners.change),
                      (this.timeoutIds.formListeners.change = setTimeout(() => {
                          this.form.options.listeners?.onChangeGroup?.({ formApi: this.form, groupApi: this });
                      }, n)))
                    : this.form.options.listeners?.onChangeGroup?.({ formApi: this.form, groupApi: this });
                const r = this.options.listeners?.onChangeDebounceMs;
                r && r > 0
                    ? (this.timeoutIds.listeners.change && clearTimeout(this.timeoutIds.listeners.change),
                      (this.timeoutIds.listeners.change = setTimeout(() => {
                          this.options.listeners?.onChange?.({ value: this.state.value, groupApi: this });
                      }, r)))
                    : this.options.listeners?.onChange?.({ value: this.state.value, groupApi: this });
            }),
            (this.triggerOnSubmitListener = () => {
                this.options.listeners?.onSubmit?.({ value: this.state.value, groupApi: this });
            }),
            (this._handleSubmit = async (n) => {
                (this.setFormGroupState((o) => ({
                    ...o,
                    isSubmitted: !1,
                    submissionAttempts: o.submissionAttempts + 1,
                    isSubmitSuccessful: !1,
                })),
                    Ze(() => {
                        Object.values(this.getRelatedFields()).forEach((o) => {
                            o.state.meta.isTouched || o.setMeta((i) => ({ ...i, isTouched: !0 }));
                        });
                    }));
                const r = n ?? this.options.onSubmitMeta;
                this.setFormGroupState((o) => ({ ...o, isSubmitting: !0 }));
                const s = () => {
                    this.setFormGroupState((o) => ({ ...o, isSubmitting: !1 }));
                };
                if ((await this.validateAllFields('submit'), !this.areRelatedFieldsValid())) {
                    (s(), this.options.onGroupSubmitInvalid?.({ value: this.state.value, groupApi: this, meta: r }));
                    return;
                }
                if (
                    (await this.validate('submit', { skipRelatedFieldValidation: !0 }),
                    !this.areRelatedFieldsValid() || !this.state.meta.isValid)
                ) {
                    (s(), this.options.onGroupSubmitInvalid?.({ value: this.state.value, groupApi: this, meta: r }));
                    return;
                }
                (Ze(() => {
                    Object.values(this.getRelatedFields()).forEach((o) => {
                        o.options.listeners?.onGroupSubmit?.({ value: o.state.value, fieldApi: o });
                    });
                }),
                    this.options.listeners?.onSubmit?.({ groupApi: this, value: this.state.value }));
                try {
                    (await this.options.onGroupSubmit?.({ value: this.state.value, groupApi: this, meta: r }),
                        Ze(() => {
                            (this.setFormGroupState((o) => ({ ...o, isSubmitted: !0, isSubmitSuccessful: !0 })), s());
                        }));
                } catch (o) {
                    throw (this.setFormGroupState((i) => ({ ...i, isSubmitSuccessful: !1 })), s(), o);
                }
            }),
            (this.form = t.form),
            (this.name = t.name),
            (this.options = t),
            (this.timeoutIds = { validations: {}, listeners: {}, formListeners: {} }),
            (this.fieldInfo = {
                instance: null,
                validationMetaMap: {
                    onChange: void 0,
                    onBlur: void 0,
                    onSubmit: void 0,
                    onMount: void 0,
                    onServer: void 0,
                    onDynamic: void 0,
                },
            }),
            (this.store = Wn((n) => {
                (this.form.formGroupMetaDerived.get(), this.form.baseStore.get());
                const r = this.form.getFormGroupMeta(this.name) ?? VM(t.defaultMeta);
                let s = this.form.getFieldValue(this.name);
                return (
                    !r.isTouched &&
                        s === void 0 &&
                        this.options.defaultValue !== void 0 &&
                        !nn(s, this.options.defaultValue) &&
                        (s = this.options.defaultValue),
                    n && n.value === s && n.meta === r ? n : { value: s, meta: r }
                );
            })),
            (this.handleSubmit = this.handleSubmit.bind(this)));
    }
    get state() {
        return this.store.state;
    }
    runValidator(t) {
        if (uc(t.validate)) {
            const n = Zn[t.type](t.value, t.validate);
            return t.type === 'validate' ? lu(n) : n.then(lu);
        }
        return t.validate(t.value);
    }
    handleSubmit(t) {
        return this._handleSubmit(t);
    }
}
function Ci(e) {
    if (e) return e;
}
function Pi(e) {
    return !!e && typeof e == 'object' && 'fields' in e;
}
function lu(e) {
    if (!e || typeof e != 'object' || (!('form' in e) && !('fields' in e))) return e;
    const { form: t, fields: n, ...r } = e;
    return { ...r, group: t, fields: n };
}
function js(e) {
    switch (e) {
        case 'submit':
            return 'onSubmit';
        case 'blur':
            return 'onBlur';
        case 'mount':
            return 'onMount';
        case 'server':
            return 'onServer';
        case 'dynamic':
            return 'onDynamic';
        default:
            return 'onChange';
    }
}
class Fo {
    constructor(t) {
        if (
            ((this.getFormFieldName = (n) => {
                if (typeof this.fieldsMap == 'string') return ou(this.fieldsMap, n);
                const r = Yo(n)[0];
                if (typeof r != 'string') return '';
                const s = n.slice(r.length),
                    o = this.fieldsMap[r];
                return ou(o, s);
            }),
            (this.getFormFieldOptions = (n) => {
                const r = { ...n },
                    s = r.validators;
                if (((r.name = this.getFormFieldName(n.name)), s && (s.onChangeListenTo || s.onBlurListenTo))) {
                    const o = { ...s },
                        i = (a) => {
                            if (a) return a.map((d) => this.getFormFieldName(d));
                        };
                    ((o.onChangeListenTo = i(s.onChangeListenTo)),
                        (o.onBlurListenTo = i(s.onBlurListenTo)),
                        (r.validators = o));
                }
                return r;
            }),
            (this.mount = () => () => {}),
            (this.validateArrayFieldsStartingFrom = async (n, r, s) =>
                this.form.validateArrayFieldsStartingFrom(this.getFormFieldName(n), r, s)),
            (this.validateField = (n, r) => this.form.validateField(this.getFormFieldName(n), r)),
            (this.getFieldValue = (n) => this.form.getFieldValue(this.getFormFieldName(n))),
            (this.getFieldMeta = (n) => this.form.getFieldMeta(this.getFormFieldName(n))),
            (this.setFieldMeta = (n, r) => this.form.setFieldMeta(this.getFormFieldName(n), r)),
            (this.setFieldValue = (n, r, s) => this.form.setFieldValue(this.getFormFieldName(n), r, s)),
            (this.deleteField = (n) => this.form.deleteField(this.getFormFieldName(n))),
            (this.pushFieldValue = (n, r, s) => this.form.pushFieldValue(this.getFormFieldName(n), r, s)),
            (this.insertFieldValue = async (n, r, s, o) =>
                this.form.insertFieldValue(this.getFormFieldName(n), r, s, o)),
            (this.replaceFieldValue = async (n, r, s, o) =>
                this.form.replaceFieldValue(this.getFormFieldName(n), r, s, o)),
            (this.removeFieldValue = async (n, r, s) => this.form.removeFieldValue(this.getFormFieldName(n), r, s)),
            (this.swapFieldValues = (n, r, s, o) => this.form.swapFieldValues(this.getFormFieldName(n), r, s, o)),
            (this.moveFieldValues = (n, r, s, o) => this.form.moveFieldValues(this.getFormFieldName(n), r, s, o)),
            (this.clearFieldValues = (n, r) => this.form.clearFieldValues(this.getFormFieldName(n), r)),
            (this.resetField = (n) => this.form.resetField(this.getFormFieldName(n))),
            (this.validateAllFields = (n) => this.form.validateAllFields(n)),
            t.form instanceof Fo)
        ) {
            const n = t.form;
            if (((this.form = n.form), typeof t.fields == 'string')) this.fieldsMap = n.getFormFieldName(t.fields);
            else {
                const r = { ...t.fields };
                for (const s in r) r[s] = n.getFormFieldName(r[s]);
                this.fieldsMap = r;
            }
        } else ((this.form = t.form), (this.fieldsMap = t.fields));
        this.store = Wn(() => {
            const n = this.form.store.get();
            let r;
            if (typeof this.fieldsMap == 'string') r = gr(n.values, this.fieldsMap);
            else {
                r = {};
                const s = this.fieldsMap;
                for (const o in s) r[o] = gr(n.values, s[o]);
            }
            return { values: r };
        });
    }
    get state() {
        return this.store.state;
    }
    async handleSubmit(t) {
        return this.form.handleSubmit(t);
    }
}
function NM(e, t) {
    if (!t) return;
    const n = Object.assign({}, e, { state: Wr(e.state) });
    (t(n),
        n.fieldInfo !== e.fieldInfo && (e.fieldInfo = n.fieldInfo),
        n.options !== e.options && (e.options = n.options));
    const s = Object.keys({
        values: null,
        validationMetaMap: null,
        fieldMetaBase: null,
        formGroupStateBase: null,
        isSubmitting: null,
        isSubmitted: null,
        isValidating: null,
        submissionAttempts: null,
        isSubmitSuccessful: null,
        _force_re_eval: null,
    }).reduce((o, i) => (e.state[i] !== n.state[i] && (o[i] = n.state[i]), o), {});
    return (
        Ze(() => {
            (Object.keys(s).length && e.baseStore.setState((o) => ({ ...o, ...s })),
                n.state.errorMap !== e.state.errorMap && e.setErrorMap(n.state.errorMap));
        }),
        n
    );
}
function jM(e, t) {
    return e === t;
}
function Ae(e, t = (r) => r, n) {
    const r = jM,
        s = v.useCallback(
            (i) => {
                const { unsubscribe: a } = e.subscribe(i);
                return a;
            },
            [e]
        ),
        o = v.useCallback(() => e.get(), [e]);
    return la.useSyncExternalStoreWithSelector(s, o, o, t, r);
}
const rn = typeof window < 'u' ? v.useLayoutEffect : v.useEffect;
function BM(e) {
    const [t, n] = v.useState(() => ({ form: e.form, name: e.name })),
        [r, s] = v.useState(() => new cs({ ...e }));
    (t.form !== e.form || t.name !== e.name) && (s(new cs({ ...e })), n({ form: e.form, name: e.name }));
    const o = Ae(r.store, e.mode === 'array' ? (p) => p.meta._arrayVersion || 0 : (p) => p.value),
        i = Ae(r.store, (p) => p.meta.isTouched),
        a = Ae(r.store, (p) => p.meta.isBlurred),
        d = Ae(r.store, (p) => p.meta.isDirty),
        u = Ae(r.store, (p) => p.meta.errorMap),
        l = Ae(r.store, (p) => p.meta.errorSourceMap),
        c = Ae(r.store, (p) => p.meta.isValidating),
        f = v.useMemo(
            () => ({
                ...r,
                get state() {
                    return {
                        value: e.mode === 'array' ? r.state.value : o,
                        get meta() {
                            return {
                                ...r.state.meta,
                                isTouched: i,
                                isBlurred: a,
                                isDirty: d,
                                errorMap: u,
                                errorSourceMap: l,
                                isValidating: c,
                            };
                        },
                    };
                },
            }),
            [r, e.mode, o, i, a, d, u, l, c]
        );
    return (
        rn(r.mount, [r]),
        rn(() => {
            r.update(e);
        }),
        f
    );
}
const $M = ({ children: e, ...t }) => {
    const n = BM(t),
        r = v.useMemo(() => kr(e, n), [e, n]);
    return F.jsx(F.Fragment, { children: r });
};
function zM() {
    return v.useState(() => Oh())[0];
}
const UM = du,
    HM = v.version.split('.')[0] === '17' ? zM : UM.useId;
function WM(e) {
    const [t, n] = v.useState(() => ({ form: e.form, name: e.name })),
        [r, s] = v.useState(() => new ls({ ...e }));
    (t.form !== e.form || t.name !== e.name) && (s(new ls({ ...e })), n({ form: e.form, name: e.name }));
    const o = Ae(r.store, (C) => C.value),
        i = Ae(r.store, (C) => C.meta.isTouched),
        a = Ae(r.store, (C) => C.meta.isBlurred),
        d = Ae(r.store, (C) => C.meta.isDirty),
        u = Ae(r.store, (C) => C.meta.errorMap),
        l = Ae(r.store, (C) => C.meta.errorSourceMap),
        c = Ae(r.store, (C) => C.meta.isValidating),
        f = Ae(r.store, (C) => C.meta.isSubmitting),
        p = Ae(r.store, (C) => C.meta.isSubmitted),
        h = Ae(r.store, (C) => C.meta.submissionAttempts),
        g = Ae(r.store, (C) => C.meta.isSubmitSuccessful),
        m = Ae(r.store, (C) => C.meta.canSubmit),
        y = Ae(r.store, (C) => C.meta.isValid),
        b = Ae(r.store, (C) => C.meta.isFieldsValid),
        R = Ae(r.store, (C) => C.meta.isFieldsValidating),
        w = Ae(r.store, (C) => C.meta.isGroupValid),
        E = v.useMemo(
            () => ({
                ...r,
                handleSubmit: (...S) => r._handleSubmit(...S),
                get state() {
                    return {
                        ...r.state,
                        value: o,
                        get meta() {
                            return {
                                ...r.state.meta,
                                isTouched: i,
                                isBlurred: a,
                                isDirty: d,
                                errorMap: u,
                                errorSourceMap: l,
                                isValidating: c,
                                isSubmitting: f,
                                isSubmitted: p,
                                submissionAttempts: h,
                                isSubmitSuccessful: g,
                                canSubmit: m,
                                isValid: y,
                                isFieldsValid: b,
                                isFieldsValidating: R,
                                isGroupValid: w,
                            };
                        },
                    };
                },
            }),
            [r, o, i, a, d, u, l, c, f, p, h, g, m, y, b, R, w]
        );
    return (
        rn(r.mount, [r]),
        rn(() => {
            r.update(e);
        }),
        E
    );
}
const KM = ({ children: e, ...t }) => {
    const n = WM(t),
        r = v.useMemo(() => kr(e, n), [e, n]);
    return F.jsx(F.Fragment, { children: r });
};
function GM({ form: e, selector: t = (r) => r, children: n }) {
    const r = Ae(e.store, t);
    return F.jsx(F.Fragment, { children: kr(n, r) });
}
function qM(e) {
    const t = HM(),
        [n, r] = v.useState(e?.formId),
        [s, o] = v.useState(() => new au({ ...e, formId: e?.formId ?? t }));
    if (n !== e?.formId) {
        const d = e?.formId ?? t;
        (o(new au({ ...e, formId: d })), r(d));
    }
    const i = v.useMemo(() => {
        const d = {
            ...s,
            handleSubmit: (...u) => s._handleSubmit(...u),
            get formId() {
                return s._formId;
            },
            get state() {
                return s.store.state;
            },
        };
        return (
            (d.Field = function (l) {
                return F.jsx($M, { ...l, form: s });
            }),
            (d.FormGroup = function (l) {
                return F.jsx(KM, { ...l, form: s });
            }),
            (d.Subscribe = function (l) {
                return F.jsx(GM, { form: s, selector: l.selector, children: l.children });
            }),
            d
        );
    }, [s]);
    (rn(s.mount, []),
        rn(() => {
            s.update(e);
        }));
    const a = v.useRef(!1);
    return (
        rn(() => {
            a.current && e?.transform && NM(s, e.transform);
        }, [s, e?.transform]),
        rn(() => {
            a.current = !0;
        }),
        i
    );
}
function QM({ lens: e, selector: t = (r) => r, children: n }) {
    const r = Ae(e.store, t);
    return F.jsx(F.Fragment, { children: kr(n, r) });
}
function YM(e) {
    const [t] = v.useState(() => {
        const n = new Fo(e),
            r = e.form instanceof Fo ? e.form.form : e.form,
            s = n;
        return (
            (s.AppForm = function (i) {
                return F.jsx(r.AppForm, { ...i });
            }),
            (s.AppField = function (i) {
                return F.jsx(r.AppField, { ...t.getFormFieldOptions(i) });
            }),
            (s.Field = function (i) {
                return F.jsx(r.Field, { ...t.getFormFieldOptions(i) });
            }),
            (s.Subscribe = function (i) {
                return F.jsx(QM, { lens: t, selector: i.selector, children: i.children });
            }),
            Object.assign(s, { ...e.formComponents })
        );
    });
    return (rn(t.mount, [t]), t);
}
const uu = v.createContext(null),
    Ah = v.createContext(null);
function _h() {
    const e = v.useContext(Ah);
    if (!e) throw new Error('`formContext` only works when within a `formComponent` passed to `createFormHook`');
    return e;
}
function SP() {
    function e() {
        const t = v.useContext(uu);
        if (!t) throw new Error('`fieldContext` only works when within a `fieldComponent` passed to `createFormHook`');
        return t;
    }
    return { fieldContext: uu, useFieldContext: e, useFormContext: _h, formContext: Ah };
}
function XM({ fieldComponents: e, fieldContext: t, formContext: n, formComponents: r }) {
    function s(u) {
        const l = qM(u),
            c = v.useMemo(
                () =>
                    ({ children: h }) =>
                        F.jsx(n.Provider, { value: l, children: h }),
                [l]
            ),
            f = v.useMemo(
                () =>
                    ({ children: g, ...m }) =>
                        F.jsx(l.Field, {
                            ...m,
                            children: (y) => F.jsx(t.Provider, { value: y, children: g(Object.assign(y, e)) }),
                        }),
                [l]
            );
        return v.useMemo(() => Object.assign(l, { AppField: f, AppForm: c, ...r }), [l, f, c]);
    }
    function o({ render: u, props: l }) {
        return function (f) {
            return u({ ...l, ...f });
        };
    }
    function i({ render: u, props: l, defaultValues: c }) {
        return function (p) {
            const h = v.useMemo(
                    () => ({ form: p.form, fields: p.fields, defaultValues: c, formComponents: r }),
                    [p.form, p.fields]
                ),
                g = YM(h);
            return u({ ...l, ...p, group: g });
        };
    }
    function a(u) {
        return _h();
    }
    function d(u) {
        return XM({
            fieldContext: t,
            formContext: n,
            fieldComponents: { ...e, ...u.fieldComponents },
            formComponents: { ...r, ...u.formComponents },
        });
    }
    return { useAppForm: s, withForm: o, withFieldGroup: i, useTypedAppFormContext: a, extendForm: d };
}
export {
    vR as $,
    St as A,
    $C as B,
    kC as C,
    TC as D,
    vC as E,
    AC as F,
    me as G,
    oR as H,
    Za as I,
    MR as J,
    Gt as K,
    dP as L,
    lt as M,
    tx as N,
    Dd as O,
    JS as P,
    xR as Q,
    oh as R,
    yP as S,
    vP as T,
    Re as U,
    uf as V,
    gR as W,
    gs as X,
    FC as Y,
    Fr as Z,
    bR as _,
    gP as a,
    RC as a$,
    pR as a0,
    qs as a1,
    ps as a2,
    za as a3,
    hR as a4,
    $a as a5,
    yl as a6,
    sR as a7,
    oS as a8,
    cx as a9,
    BC as aA,
    go as aB,
    PC as aC,
    fR as aD,
    GR as aE,
    Kt as aF,
    aP as aG,
    oP as aH,
    Fa as aI,
    Ye as aJ,
    Pd as aK,
    sC as aL,
    qC as aM,
    hP as aN,
    wf as aO,
    QC as aP,
    j0 as aQ,
    bP as aR,
    iP as aS,
    xh as aT,
    fP as aU,
    KC as aV,
    ol as aW,
    g0 as aX,
    GC as aY,
    aC as aZ,
    cC as a_,
    sE as aa,
    NC as ab,
    rS as ac,
    jC as ad,
    CC as ae,
    uR as af,
    wR as ag,
    OC as ah,
    cM as ai,
    Le as aj,
    sn as ak,
    ln as al,
    Kr as am,
    EC as an,
    de as ao,
    Lf as ap,
    MC as aq,
    _e as ar,
    Lw as as,
    ar as at,
    yR as au,
    bC as av,
    kR as aw,
    VR as ax,
    _C as ay,
    TR as az,
    No as b,
    HC as b$,
    wo as b0,
    nR as b1,
    sh as b2,
    ze as b3,
    SC as b4,
    gC as b5,
    mC as b6,
    Rt as b7,
    Ba as b8,
    CR as b9,
    u1 as bA,
    wt as bB,
    SP as bC,
    zC as bD,
    Ji as bE,
    rs as bF,
    tt as bG,
    Tr as bH,
    xe as bI,
    Ox as bJ,
    vo as bK,
    wC as bL,
    mf as bM,
    Qt as bN,
    XM as bO,
    pf as bP,
    sc as bQ,
    DC as bR,
    VC as bS,
    RR as bT,
    dR as bU,
    wP as bV,
    _0 as bW,
    dC as bX,
    V0 as bY,
    pP as bZ,
    WC as b_,
    yC as ba,
    Yx as bb,
    xC as bc,
    yS as bd,
    pC as be,
    Pt as bf,
    fC as bg,
    qi as bh,
    ve as bi,
    Zw as bj,
    ff as bk,
    lC as bl,
    sP as bm,
    rP as bn,
    tP as bo,
    nP as bp,
    eP as bq,
    cP as br,
    YC as bs,
    ZC as bt,
    JC as bu,
    Sh as bv,
    XC as bw,
    mP as bx,
    rC as by,
    l1 as bz,
    wr as c,
    UC as c0,
    cn as c1,
    hs as c2,
    en as c3,
    uC as c4,
    lP as c5,
    uP as c6,
    mo as d,
    Ir as e,
    ir as f,
    oC as g,
    KE as h,
    hC as i,
    qR as j,
    ih as k,
    IR as l,
    hf as m,
    mh as n,
    Sf as o,
    oc as p,
    Ie as q,
    IC as r,
    lR as s,
    cR as t,
    uM as u,
    uE as v,
    lE as w,
    Ut as x,
    fe as y,
    dE as z,
};
