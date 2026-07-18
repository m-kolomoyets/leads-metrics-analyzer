import { d as bo, u as Ee, b as go, C as ho, a as mo, g as vo, c as xo } from './getPseudoElementBounds-D7ePV0js.js';
import {
    g as ao,
    c as Ce,
    k as co,
    m as fo,
    u as ft,
    i as io,
    f as ke,
    j as lo,
    d as oo,
    n as po,
    b as pt,
    h as ro,
    a as Se,
    e as so,
    l as uo,
    S as ze,
} from './index-BgIF0Ych.js';
import {
    U as _,
    ac as _e,
    as as _n,
    t as $e,
    az as $n,
    T as $t,
    a5 as Ae,
    J as an,
    aq as An,
    N as at,
    x as be,
    a7 as bn,
    aE as Bn,
    m as Bt,
    V as cn,
    ad as Cn,
    aw as ct,
    f as de,
    ar as De,
    _ as dn,
    au as Dn,
    L as Dt,
    ay as dt,
    z as en,
    ak as En,
    aR as eo,
    b as et,
    ao as Fe,
    $ as fn,
    at as Fn,
    a3 as gn,
    aH as Gn,
    p as Gt,
    k as He,
    a4 as hn,
    aC as Hn,
    a as Ht,
    ae as In,
    Z as it,
    aA as Je,
    am as jn,
    aO as Jn,
    P as Jt,
    an as kn,
    aJ as Kn,
    o as Kt,
    i as Le,
    Q as ln,
    av as Ln,
    S as Lt,
    ai as lt,
    y as me,
    a2 as mn,
    af as Mn,
    C as nn,
    ap as Nn,
    O as no,
    u as nt,
    G as Oe,
    R as on,
    aj as On,
    d as ot,
    A as Pe,
    a0 as pn,
    ag as Pn,
    e as Q,
    X as qe,
    aB as Qe,
    aM as qn,
    aP as Qn,
    D as qt,
    v as Qt,
    c as Re,
    K as rn,
    aa as Rn,
    Y as rt,
    I as sn,
    ab as Sn,
    H as st,
    j as Te,
    aF as te,
    B as tn,
    ah as Tn,
    aS as to,
    g as tt,
    q as ue,
    W as un,
    aG as Un,
    l as Ut,
    ax as ut,
    M as ve,
    a8 as vn,
    aI as Vn,
    n as Vt,
    al as wn,
    aL as Wn,
    r as Wt,
    a1 as Xe,
    a6 as xn,
    aN as Xn,
    s as Xt,
    E as ye,
    a9 as yn,
    aK as Yn,
    F as Yt,
    aD as zn,
    aQ as Zn,
    h as zt,
    w as Zt,
} from './index-CATHI92X.js';
import { I as Ro, C as yo } from './useScrollLock-BrgHxV8m.js';
import { j as c, c as M, r as u, a as We } from './vendor-react-1kp2ER4x.js';
import './vendor-zod-D40u6Zl6.js';

const So = (t) => {
        const e = document.cookie.split(';');
        for (let n of e) if (((n = n.trim()), n.startsWith(`${t}=`))) return n.substring(t.length + 1);
        return null;
    },
    Co = [
        { label: 'Dashboard', Icon: Dt, linkProps: { to: '/dashboard' } },
        { label: 'Merchants', Icon: Lt, linkProps: { to: '/merchants' }, rolePermissionKey: 'merchants.view' },
        { label: 'Vouchers', Icon: $t, linkProps: { to: '/vouchers' }, rolePermissionKey: 'vouchers.view' },
        { label: 'Admin', Icon: Ht, linkProps: { to: '/admin' }, rolePermissionKey: 'admin.view' },
    ];
function Io(t) {
    const e = M.c(16);
    let n, o, s, a;
    e[0] !== t
        ? (({ activeProps: o, activeOptions: n, tooltipText: a, ...s } = t),
          (e[0] = t),
          (e[1] = n),
          (e[2] = o),
          (e[3] = s),
          (e[4] = a))
        : ((n = e[1]), (o = e[2]), (s = e[3]), (a = e[4]));
    let i;
    e[5] !== n ? ((i = { exact: !0, ...n }), (e[5] = n), (e[6] = i)) : (i = e[6]);
    let l;
    e[7] !== o
        ? ((l = { className: 'bg-sidebar-accent text-sidebar-accent-foreground', ...o }), (e[7] = o), (e[8] = l))
        : (l = e[8]);
    let r;
    e[9] !== s || e[10] !== i || e[11] !== l
        ? ((r = c.jsx(et, { activeOptions: i, activeProps: l, ...s })),
          (e[9] = s),
          (e[10] = i),
          (e[11] = l),
          (e[12] = r))
        : (r = e[12]);
    let f;
    return (
        e[13] !== r || e[14] !== a
            ? ((f = c.jsx(ze, { tooltip: a, render: r })), (e[13] = r), (e[14] = a), (e[15] = f))
            : (f = e[15]),
        f
    );
}
const Mo = tt('/_authenticated');
function Po() {
    const t = M.c(6),
        { setOpenMobile: e } = ft();
    let n;
    t[0] === Symbol.for('react.memo_cache_sentinel')
        ? ((n = {
              select(i) {
                  return i.auth.me.role;
              },
          }),
          (t[0] = n))
        : (n = t[0]);
    const o = Mo.useRouteContext(n);
    let s;
    t[1] !== o || t[2] !== e
        ? ((s = Co.map((i) =>
              i?.rolePermissionKey && !zt(i.rolePermissionKey, o)
                  ? null
                  : c.jsx(
                        Se,
                        {
                            onClick: () => {
                                e(!1);
                            },
                            children: c.jsxs(Io, {
                                tooltipText: i.label,
                                ...i.linkProps,
                                children: [c.jsx(i.Icon, { className: 'size-4' }), i.label],
                            }),
                        },
                        i.label
                    )
          )),
          (t[1] = o),
          (t[2] = e),
          (t[3] = s))
        : (s = t[3]);
    let a;
    return (
        t[4] !== s ? ((a = c.jsx(pt, { children: c.jsx(Ce, { children: s }) })), (t[4] = s), (t[5] = a)) : (a = t[5]),
        a
    );
}
function To() {
    const t = M.c(1);
    let e;
    return (
        t[0] === Symbol.for('react.memo_cache_sentinel')
            ? ((e = c.jsx(pt, { children: c.jsx(Ce, { children: Array.from({ length: 7 }).map(Oo) }) })), (t[0] = e))
            : (e = t[0]),
        e
    );
}
function Oo(t, e) {
    return c.jsx(Se, { children: c.jsx(oo, { showIcon: !0 }) }, e);
}
const mt = u.createContext(void 0);
function we(t) {
    const e = u.useContext(mt);
    if (e === void 0 && !t) throw new Error(de(33));
    return e;
}
const gt = u.createContext(void 0);
function ie(t) {
    const e = u.useContext(gt);
    if (e === void 0 && !t) throw new Error(de(36));
    return e;
}
const Eo = u.createContext(void 0);
function je(t = !0) {
    const e = u.useContext(Eo);
    if (e === void 0 && !t) throw new Error(de(25));
    return e;
}
function wo(t) {
    const {
            closeOnClick: e,
            highlighted: n,
            id: o,
            nodeId: s,
            store: a,
            typingRef: i,
            itemRef: l,
            itemMetadata: r,
        } = t,
        { events: f } = a.useState('floatingTreeRoot'),
        p = a.useState('open'),
        h = je(!0),
        x = h !== void 0;
    return u.useMemo(
        () => ({
            id: o,
            role: 'menuitem',
            tabIndex: p && n ? 0 : -1,
            onKeyDown(b) {
                b.key === ' ' && i?.current && b.preventDefault();
            },
            onMouseMove(b) {
                s && f.emit('itemhover', { nodeId: s, target: b.currentTarget });
            },
            onClick(b) {
                e && f.emit('close', { domEvent: b, reason: Le });
            },
            onMouseUp(b) {
                if (h) {
                    const R = h.initialCursorPointRef.current;
                    if (
                        ((h.initialCursorPointRef.current = null),
                        (x && R && Math.abs(b.clientX - R.x) <= 1 && Math.abs(b.clientY - R.y) <= 1) ||
                            (x && !Bt && b.button === 2))
                    )
                        return;
                }
                l.current &&
                    a.context.allowMouseUpTriggerRef.current &&
                    (!x || b.button === 2) &&
                    (!r || r.type === 'regular-item') &&
                    l.current.click();
            },
        }),
        [e, n, o, f, s, p, a, i, l, h, x, r]
    );
}
const ht = { type: 'regular-item' };
function Be(t) {
    const {
            closeOnClick: e,
            disabled: n = !1,
            highlighted: o,
            id: s,
            store: a,
            typingRef: i = a.context.typingRef,
            nativeButton: l,
            itemMetadata: r,
            nodeId: f,
        } = t,
        p = a.useState('disabled'),
        h = n || p,
        x = u.useRef(null),
        { getButtonProps: b, buttonRef: R } = nt({ disabled: h, focusableWhenDisabled: !0, native: l, composite: !0 }),
        O = wo({
            closeOnClick: e,
            highlighted: o,
            id: s,
            nodeId: f,
            store: a,
            typingRef: i,
            itemRef: x,
            itemMetadata: r,
        }),
        m = u.useCallback(
            (y) =>
                Re(
                    O,
                    {
                        onMouseEnter() {
                            r.type === 'submenu-trigger' && r.setActive();
                        },
                    },
                    y,
                    b
                ),
            [O, b, r]
        ),
        v = ot(x, R);
    return u.useMemo(() => ({ getItemProps: m, itemRef: v }), [m, v]);
}
let Ze = (function (t) {
    return (
        (t.checked = 'data-checked'),
        (t.unchecked = 'data-unchecked'),
        (t.disabled = 'data-disabled'),
        (t.highlighted = 'data-highlighted'),
        t
    );
})({});
const xt = {
        checked(t) {
            return t ? { [Ze.checked]: '' } : { [Ze.unchecked]: '' };
        },
        ...$e,
    },
    bt = u.createContext(void 0),
    jo = u.forwardRef(function (e, n) {
        const { render: o, className: s, style: a, ...i } = e,
            [l, r] = u.useState(void 0),
            f = Q('div', e, { ref: n, props: { role: 'group', 'aria-labelledby': l, ...i } });
        return c.jsx(bt.Provider, { value: r, children: f });
    }),
    ko = u.forwardRef(function (e, n) {
        const {
                render: o,
                className: s,
                id: a,
                label: i,
                nativeButton: l = !1,
                disabled: r = !1,
                closeOnClick: f = !0,
                style: p,
                ...h
            } = e,
            x = Ee({ label: i }),
            b = we(!0),
            R = Te(a),
            { store: O } = ie(),
            m = O.useState('isActive', x.index),
            v = O.useState('itemProps'),
            { getItemProps: y, itemRef: g } = Be({
                closeOnClick: f,
                disabled: r,
                highlighted: m,
                id: R,
                store: O,
                nativeButton: l,
                nodeId: b?.context.nodeId,
                itemMetadata: ht,
            });
        return Q('div', e, { state: { disabled: r, highlighted: m }, props: [v, h, y], ref: [g, n, x.ref] });
    }),
    No = { ...Gt, ...$e },
    Ao = u.forwardRef(function (e, n) {
        const { render: o, className: s, style: a, finalFocus: i, ...l } = e,
            { store: r } = ie(),
            { side: f, align: p } = we(),
            h = mo() != null,
            x = r.useState('open'),
            b = r.useState('transitionStatus'),
            R = r.useState('popupProps'),
            O = r.useState('mounted'),
            m = r.useState('instantType'),
            v = r.useState('activeTriggerElement'),
            y = r.useState('parent'),
            g = r.useState('lastOpenChangeReason'),
            E = r.useState('rootId'),
            $ = r.useState('floatingRootContext'),
            d = r.useState('floatingTreeRoot'),
            j = r.useState('closeDelay'),
            P = r.useState('activeTriggerElement'),
            H = r.useState('hoverEnabled'),
            C = r.useState('disabled'),
            k = r.useState('openMethod'),
            N = y.type === 'context-menu';
        (He({
            open: x,
            ref: r.context.popupRef,
            onComplete() {
                x && r.context.onOpenChangeComplete?.(!0);
            },
        }),
            u.useEffect(() => {
                function D(I) {
                    r.setOpen(!1, ue(I.reason, I.domEvent));
                }
                return (
                    d.events.on('close', D),
                    () => {
                        d.events.off('close', D);
                    }
                );
            }, [d.events, r]),
            Ut($, { enabled: H && !C && !N && y.type !== 'menubar', closeDelay: j }));
        const L = u.useCallback(
                (D) => {
                    r.set('popupElement', D);
                },
                [r]
            ),
            B = { transitionStatus: b, side: f, align: p, open: x, nested: y.type === 'menu', instant: m },
            F = Q('div', e, {
                state: B,
                ref: [n, r.context.popupRef, L],
                stateAttributesMapping: No,
                props: [
                    R,
                    {
                        onKeyDown(D) {
                            h && yo.has(D.key) && D.stopPropagation();
                        },
                    },
                    Vt(b),
                    l,
                    { 'data-rootownerid': E },
                ],
            });
        let G = y.type === void 0 || N;
        return (
            (v || (y.type === 'menubar' && g !== Kt)) && (G = !0),
            c.jsx(Yt, {
                context: $,
                openInteractionType: k,
                modal: N,
                disabled: !O,
                returnFocus: i === void 0 ? G : i,
                initialFocus: y.type !== 'menu',
                restoreFocus: !0,
                externalTree: y.type !== 'menubar' ? d : void 0,
                previousFocusableElement: P,
                nextFocusableElement: y.type === void 0 ? r.context.triggerFocusTargetRef : void 0,
                beforeContentFocusGuardRef: y.type === void 0 ? r.context.beforeContentFocusGuardRef : void 0,
                children: F,
            })
        );
    }),
    vt = u.createContext(void 0);
function _o() {
    const t = u.useContext(vt);
    if (t === void 0) throw new Error(de(32));
    return t;
}
const Fo = u.forwardRef(function (e, n) {
        const { keepMounted: o = !1, ...s } = e,
            { store: a } = ie();
        return a.useState('mounted') || o
            ? c.jsx(vt.Provider, { value: o, children: c.jsx(Wt, { ref: n, ...s }) })
            : null;
    }),
    Do = u.forwardRef(function (e, n) {
        const {
                anchor: o,
                positionMethod: s = 'absolute',
                className: a,
                render: i,
                side: l,
                align: r,
                sideOffset: f = 0,
                alignOffset: p = 0,
                collisionBoundary: h = 'clipping-ancestors',
                collisionPadding: x = 5,
                arrowPadding: b = 5,
                sticky: R = !1,
                disableAnchorTracking: O = !1,
                collisionAvoidance: m = qt,
                style: v,
                ...y
            } = e,
            { store: g } = ie(),
            E = _o(),
            $ = je(!0),
            d = g.useState('parent'),
            j = g.useState('floatingRootContext'),
            P = g.useState('floatingTreeRoot'),
            H = g.useState('mounted'),
            C = g.useState('open'),
            k = g.useState('modal'),
            N = g.useState('openMethod'),
            L = g.useState('activeTriggerElement'),
            B = g.useState('transitionStatus'),
            F = g.useState('positionerElement'),
            G = g.useState('instantType'),
            D = g.useState('hasViewport'),
            I = g.useState('lastOpenChangeReason'),
            V = g.useState('floatingNodeId'),
            Y = g.useState('floatingParentNodeId'),
            le = j.useState('domReferenceElement'),
            Z = u.useRef(null),
            q = Xt(F, !1, !1);
        let ne = o,
            oe = f,
            fe = p,
            z = r,
            ee = m;
        d.type === 'context-menu' &&
            ((ne = o ?? d.context?.anchor),
            (z = z ?? 'start'),
            !l && z !== 'center' && ((fe = e.alignOffset ?? 2), (oe = e.sideOffset ?? -5)));
        let X = l,
            se = z;
        d.type === 'menu'
            ? ((X = X ?? 'inline-end'), (se = se ?? 'start'), (ee = e.collisionAvoidance ?? Jt))
            : d.type === 'menubar' &&
              ((X = X ?? (d.context.orientation === 'vertical' ? 'inline-end' : 'bottom')), (se = se ?? 'start'));
        const ae = d.type === 'context-menu',
            W = Qt({
                anchor: ne,
                floatingRootContext: j,
                positionMethod: $ ? 'fixed' : s,
                mounted: H,
                side: X,
                sideOffset: oe,
                align: se,
                alignOffset: fe,
                arrowPadding: ae ? 0 : b,
                collisionBoundary: h,
                collisionPadding: x,
                sticky: R,
                nodeId: V,
                keepMounted: E,
                disableAnchorTracking: O,
                collisionAvoidance: ee,
                shiftCrossAxis: ae && !('side' in ee && ee.side === 'flip'),
                externalTree: P,
                adaptiveOrigin: D ? Zt : void 0,
            });
        (u.useEffect(() => {
            function w(T) {
                T.open &&
                    (T.parentNodeId === V && g.set('hoverEnabled', !1),
                    T.nodeId !== V && T.parentNodeId === g.select('floatingParentNodeId') && g.setOpen(!1, ue(ye)));
            }
            return (
                P.events.on('menuopenchange', w),
                () => {
                    P.events.off('menuopenchange', w);
                }
            );
        }, [g, P.events, V]),
            u.useEffect(() => {
                if (g.select('floatingParentNodeId') == null) return;
                function w(T) {
                    if (T.open || T.nodeId !== g.select('floatingParentNodeId')) return;
                    const ce = T.reason ?? ye;
                    g.setOpen(!1, ue(ce));
                }
                return (
                    P.events.on('menuopenchange', w),
                    () => {
                        P.events.off('menuopenchange', w);
                    }
                );
            }, [P.events, g]));
        const J = be();
        (u.useEffect(() => {
            C || J.clear();
        }, [C, J]),
            u.useEffect(() => {
                function w(T) {
                    if (!(!C || T.nodeId !== g.select('floatingParentNodeId')))
                        if (T.target && L && L !== T.target) {
                            const ce = g.select('closeDelay');
                            ce > 0
                                ? J.isStarted() ||
                                  J.start(ce, () => {
                                      g.setOpen(!1, ue(ye));
                                  })
                                : g.setOpen(!1, ue(ye));
                        } else J.clear();
                }
                return (
                    P.events.on('itemhover', w),
                    () => {
                        P.events.off('itemhover', w);
                    }
                );
            }, [P.events, C, L, g, J]),
            u.useEffect(() => {
                const w = { open: C, nodeId: V, parentNodeId: Y, reason: g.select('lastOpenChangeReason') };
                P.events.emit('menuopenchange', w);
            }, [P.events, C, g, V, Y]),
            me(() => {
                const w = le,
                    T = Z.current;
                if ((w && (Z.current = w), T && w && w !== T)) {
                    g.set('instantType', void 0);
                    const ce = new AbortController();
                    return (
                        q(() => {
                            g.set('instantType', 'trigger-change');
                        }, ce.signal),
                        () => {
                            ce.abort();
                        }
                    );
                }
            }, [le, q, g]));
        const ge = {
                open: C,
                side: W.side,
                align: W.align,
                anchorHidden: W.anchorHidden,
                nested: d.type === 'menu',
                instant: G,
            },
            pe = d.type === 'menubar' && d.context.modal;
        go(C && (pe || (k && I !== Pe)), N === 'touch', F, L);
        const he = en(e, ge, {
                styles: W.positionerStyles,
                transitionStatus: B,
                props: y,
                refs: [n, g.useStateSetter('positionerElement')],
                hidden: !H,
                inert: !C,
            }),
            xe =
                H &&
                d.type !== 'menu' &&
                ((d.type !== 'menubar' && k && I !== Pe) || (d.type === 'menubar' && d.context.modal));
        let A = null;
        return (
            d.type === 'menubar' ? (A = d.context.contentElement) : d.type === void 0 && (A = L),
            c.jsxs(mt.Provider, {
                value: W,
                children: [
                    xe &&
                        c.jsx(Ro, {
                            ref:
                                d.type === 'context-menu' || d.type === 'nested-context-menu'
                                    ? d.context.internalBackdropRef
                                    : null,
                            inert: tn(!C),
                            cutout: A,
                        }),
                    c.jsx(nn, {
                        id: V,
                        children: c.jsx(ho, {
                            elementsRef: g.context.itemDomElements,
                            labelsRef: g.context.itemLabels,
                            children: he,
                        }),
                    }),
                ],
            })
        );
    }),
    yt = u.createContext(void 0);
function Lo() {
    const t = u.useContext(yt);
    if (t === void 0) throw new Error(de(34));
    return t;
}
const $o = u.memo(
        u.forwardRef(function (e, n) {
            const {
                    render: o,
                    className: s,
                    value: a,
                    defaultValue: i,
                    onValueChange: l,
                    disabled: r = !1,
                    style: f,
                    'aria-labelledby': p,
                    ...h
                } = e,
                [x, b] = u.useState(void 0),
                [R, O] = xo({ controlled: a, default: i, name: 'MenuRadioGroup' }),
                m = Oe((E, $) => {
                    (l?.(E, $), !$.isCanceled && O(E));
                }),
                y = Q('div', e, {
                    state: { disabled: r },
                    ref: n,
                    props: { role: 'group', 'aria-labelledby': p ?? x, 'aria-disabled': r || void 0, ...h },
                }),
                g = u.useMemo(() => ({ value: R, setValue: m, disabled: r }), [R, m, r]);
            return c.jsx(bt.Provider, { value: b, children: c.jsx(yt.Provider, { value: g, children: y }) });
        })
    ),
    Rt = u.createContext(void 0);
function Ho() {
    const t = u.useContext(Rt);
    if (t === void 0) throw new Error(de(35));
    return t;
}
const zo = u.forwardRef(function (e, n) {
        const {
                render: o,
                className: s,
                id: a,
                label: i,
                nativeButton: l = !1,
                disabled: r = !1,
                closeOnClick: f = !1,
                value: p,
                style: h,
                ...x
            } = e,
            b = Ee({ label: i }),
            R = we(!0),
            O = Te(a),
            { store: m } = ie(),
            v = m.useState('isActive', b.index),
            y = m.useState('itemProps'),
            { value: g, setValue: E, disabled: $ } = Lo(),
            d = $ || r,
            j = g === p,
            { getItemProps: P, itemRef: H } = Be({
                closeOnClick: f,
                disabled: d,
                highlighted: v,
                id: O,
                store: m,
                nativeButton: l,
                nodeId: R?.context.nodeId,
                itemMetadata: ht,
            }),
            C = u.useMemo(() => ({ disabled: d, highlighted: v, checked: j }), [d, v, j]);
        function k(L) {
            const B = ue(Le, L.nativeEvent, void 0, { preventUnmountOnClose() {} });
            E(p, B);
        }
        const N = Q('div', e, {
            state: C,
            stateAttributesMapping: xt,
            props: [y, { role: 'menuitemradio', 'aria-checked': j, onClick: k }, x, P],
            ref: [H, n, b.ref],
        });
        return c.jsx(Rt.Provider, { value: C, children: N });
    }),
    Bo = u.forwardRef(function (e, n) {
        const { render: o, className: s, style: a, keepMounted: i = !1, ...l } = e,
            r = Ho(),
            f = u.useRef(null),
            { transitionStatus: p, setMounted: h } = st(r.checked);
        He({
            open: r.checked,
            ref: f,
            onComplete() {
                r.checked || h(!1);
            },
        });
        const x = { checked: r.checked, disabled: r.disabled, highlighted: r.highlighted, transitionStatus: p };
        return Q('span', e, {
            state: x,
            stateAttributesMapping: xt,
            ref: [n, f],
            props: { 'aria-hidden': !0, ...l },
            enabled: i || r.checked,
        });
    }),
    Uo = u.createContext(null);
function St(t) {
    return u.useContext(Uo);
}
const Go = {
    ...an,
    disabled: _((t) => (t.parent.type === 'menubar' && t.parent.context.disabled) || t.disabled),
    modal: _((t) => (t.parent.type === void 0 || t.parent.type === 'context-menu') && (t.modal ?? !0)),
    openMethod: _((t) => t.openMethod),
    allowMouseEnter: _((t) => t.allowMouseEnter),
    highlightItemOnHover: _((t) => t.highlightItemOnHover),
    stickIfOpen: _((t) => t.stickIfOpen),
    parent: _((t) => t.parent),
    rootId: _((t) =>
        t.parent.type === 'menu'
            ? t.parent.store.select('rootId')
            : t.parent.type !== void 0
              ? t.parent.context.rootId
              : t.rootId
    ),
    activeIndex: _((t) => t.activeIndex),
    isActive: _((t, e) => t.activeIndex === e),
    hoverEnabled: _((t) => t.hoverEnabled),
    instantType: _((t) => t.instantType),
    lastOpenChangeReason: _((t) => t.openChangeReason),
    floatingTreeRoot: _((t) =>
        t.parent.type === 'menu' ? t.parent.store.select('floatingTreeRoot') : t.floatingTreeRoot
    ),
    floatingNodeId: _((t) => t.floatingNodeId),
    floatingParentNodeId: _((t) => t.floatingParentNodeId),
    itemProps: _((t) => t.itemProps),
    closeDelay: _((t) => t.closeDelay),
    hasViewport: _((t) => t.hasViewport),
    keyboardEventRelay: _((t) => {
        if (t.keyboardEventRelay) return t.keyboardEventRelay;
        if (t.parent.type === 'menu') return t.parent.store.select('keyboardEventRelay');
    }),
};
class Ue extends on {
    constructor(e) {
        (super(
            { ...Vo(), ...e },
            {
                positionerRef: u.createRef(),
                popupRef: u.createRef(),
                typingRef: { current: !1 },
                itemDomElements: { current: [] },
                itemLabels: { current: [] },
                allowMouseUpTriggerRef: { current: !1 },
                triggerFocusTargetRef: u.createRef(),
                beforeContentFocusGuardRef: u.createRef(),
                onOpenChangeComplete: void 0,
                triggerElements: new sn(),
            },
            Go
        ),
            (this.unsubscribeParentListener = this.observe('parent', (n) => {
                if ((this.unsubscribeParentListener?.(), n.type === 'menu')) {
                    let o = n.store.select('rootId'),
                        s = n.store.select('floatingTreeRoot'),
                        a = n.store.select('keyboardEventRelay');
                    ((this.unsubscribeParentListener = n.store.subscribe(() => {
                        const i = n.store.select('rootId'),
                            l = n.store.select('floatingTreeRoot'),
                            r = n.store.select('keyboardEventRelay');
                        (o === i && s === l && a === r) || ((o = i), (s = l), (a = r), this.notifyAll());
                    })),
                        (this.context.allowMouseUpTriggerRef = n.store.context.allowMouseUpTriggerRef));
                    return;
                }
                (n.type !== void 0 && (this.context.allowMouseUpTriggerRef = n.context.allowMouseUpTriggerRef),
                    (this.unsubscribeParentListener = null));
            })));
    }
    setOpen(e, n) {
        this.state.floatingRootContext.context.events.emit('setOpen', { open: e, eventDetails: n });
    }
    static useStore(e, n) {
        const o = rn(() => new Ue(n)).current;
        return e ?? o;
    }
    unsubscribeParentListener = null;
}
function Vo() {
    return {
        ...ln(),
        disabled: !1,
        modal: !0,
        openMethod: null,
        allowMouseEnter: !1,
        highlightItemOnHover: !0,
        stickIfOpen: !0,
        parent: { type: void 0 },
        rootId: void 0,
        activeIndex: null,
        hoverEnabled: !0,
        instantType: void 0,
        openChangeReason: null,
        floatingTreeRoot: new at(),
        floatingNodeId: void 0,
        floatingParentNodeId: null,
        itemProps: ve,
        keyboardEventRelay: void 0,
        closeDelay: 0,
        hasViewport: !1,
    };
}
const Ct = u.createContext(void 0);
function It() {
    return u.useContext(Ct);
}
const Mt = cn(function (e) {
    const {
            children: n,
            open: o,
            onOpenChange: s,
            onOpenChangeComplete: a,
            defaultOpen: i = !1,
            disabled: l = !1,
            modal: r,
            loopFocus: f = !0,
            orientation: p = 'vertical',
            actionsRef: h,
            closeParentOnEsc: x = !1,
            handle: b,
            triggerId: R,
            defaultTriggerId: O = null,
            highlightItemOnHover: m = !0,
        } = e,
        v = je(!0),
        y = ie(!0),
        g = St(!0),
        E = It(),
        $ = u.useMemo(
            () =>
                E && y
                    ? { type: 'menu', store: y.store }
                    : g
                      ? { type: 'menubar', context: g }
                      : v && !y
                        ? { type: 'context-menu', context: v }
                        : { type: void 0 },
            [v, y, g, E]
        ),
        d = Ue.useStore(b?.store, { open: i, openProp: o, activeTriggerId: O, triggerIdProp: R, parent: $ });
    (un(d, o, i, O),
        d.useControlledProp('openProp', o),
        d.useControlledProp('triggerIdProp', R),
        d.useContextCallback('onOpenChangeComplete', a));
    const j = qe(),
        P = qe(),
        H = d.useState('floatingTreeRoot'),
        C = rt(H),
        k = it(),
        N = d.useState('open'),
        L = d.useState('activeTriggerElement'),
        B = d.useState('positionerElement'),
        F = d.useState('hoverEnabled'),
        G = d.useState('disabled'),
        D = d.useState('lastOpenChangeReason'),
        I = d.useState('parent'),
        V = d.useState('activeIndex'),
        Y = d.useState('payload'),
        le = d.useState('floatingParentNodeId'),
        Z = u.useRef(null),
        q = u.useRef(I.type !== 'context-menu'),
        ne = be(),
        oe = u.useRef(!0),
        fe = be(),
        z = le != null,
        { openMethod: ee, triggerProps: X } = bo(N);
    (d.useSyncedValues({
        disabled: l,
        highlightItemOnHover: m,
        modal: I.type === void 0 ? r : void 0,
        openMethod: ee,
        rootId: j,
    }),
        dn(d));
    const { forceUnmount: se } = fn(N, d, () => {
        d.update({ allowMouseEnter: !1, stickIfOpen: !0 });
    });
    (me(() => {
        v && !y
            ? d.update({ parent: { type: 'context-menu', context: v }, floatingNodeId: C, floatingParentNodeId: k })
            : y && d.update({ floatingNodeId: C, floatingParentNodeId: k });
    }, [v, y, C, k, d]),
        u.useEffect(() => {
            if ((N || (Z.current = null), I.type === 'context-menu')) {
                if (!N) {
                    (ne.clear(), (q.current = !1));
                    return;
                }
                ne.start(500, () => {
                    q.current = !0;
                });
            }
        }, [ne, N, I.type]),
        me(() => {
            !N && !F && d.set('hoverEnabled', !0);
        }, [N, F, d]));
    const ae = Oe((S, U) => {
            const K = U.reason;
            if (N === S && U.trigger === L && D === K) return;
            const _t = pn(U);
            if ((!S && U.trigger == null && (U.trigger = L ?? void 0), s?.(S, U), U.isCanceled)) return;
            d.state.floatingRootContext.dispatchOpenChange(S, U);
            const Ie = U.event;
            if (S === !1 && Ie?.type === 'click' && Ie.pointerType === 'touch' && !oe.current) return;
            S && K === Xe
                ? ((oe.current = !1),
                  fe.start(300, () => {
                      oe.current = !0;
                  }))
                : ((oe.current = !0), fe.clear());
            const Ke = (K === mn || K === Le) && Ie.detail === 0 && Ie?.isTrusted,
                Ft = !S && (K === gn || K == null),
                Ye = { open: S, openChangeReason: K };
            ((Z.current = U.event ?? null),
                hn(Ye, S, U.trigger, _t()),
                d.update(Ye),
                I.type === 'menubar' && (K === Xe || K === Ae || K === Pe || K === xn || K === ye)
                    ? d.set('instantType', 'group')
                    : Ke || Ft
                      ? d.set('instantType', Ke ? 'click' : 'dismiss')
                      : d.set('instantType', void 0));
        }),
        W = bn({ popupStore: d, floatingId: P, nested: k != null, onOpenChange: ae }),
        J = W.context.events;
    u.useEffect(() => {
        const S = ({ open: U, eventDetails: K }) => ae(U, K);
        return (
            J.on('setOpen', S),
            () => {
                J?.off('setOpen', S);
            }
        );
    }, [J, ae]);
    const ge = u.useCallback(() => {
        d.setOpen(!1, ue(vn));
    }, [d]);
    u.useImperativeHandle(h, () => ({ unmount: se, close: ge }), [se, ge]);
    let pe;
    (I.type === 'context-menu' && (pe = I.context),
        u.useImperativeHandle(pe?.positionerRef, () => B, [B]),
        u.useImperativeHandle(pe?.actionsRef, () => ({ setOpen: ae }), [ae]));
    const re = yn(W, {
            enabled: !G,
            bubbles: { escapeKey: x && I.type === 'menu' },
            outsidePress() {
                return I.type !== 'context-menu' || Z.current?.type === 'contextmenu' ? !0 : q.current;
            },
            externalTree: z ? H : void 0,
        }),
        he = Rn(),
        xe = u.useCallback(
            (S) => {
                d.select('activeIndex') !== S && d.set('activeIndex', S);
            },
            [d]
        ),
        A = Sn(W, {
            enabled: !G,
            listRef: d.context.itemDomElements,
            activeIndex: V,
            nested: I.type !== void 0,
            loopFocus: f,
            orientation: p,
            parentOrientation: I.type === 'menubar' ? I.context.orientation : void 0,
            rtl: he === 'rtl',
            disabledIndices: _e,
            onNavigate: xe,
            openOnArrowKeyDown: I.type !== 'context-menu',
            externalTree: z ? H : void 0,
            focusItemOnHover: m,
        }),
        w = u.useCallback(
            (S) => {
                d.context.typingRef.current = S;
            },
            [d]
        ),
        T = Cn(W, {
            enabled: !G,
            listRef: d.context.itemLabels,
            elementsRef: d.context.itemDomElements,
            activeIndex: V,
            resetMs: In,
            onMatch: (S) => {
                N && S !== V && d.set('activeIndex', S);
            },
            onTyping: w,
        }),
        ce = u.useMemo(() => {
            const S = Re(
                T.reference,
                A.reference,
                re.reference,
                {
                    onMouseMove() {
                        d.set('allowMouseEnter', !0);
                    },
                },
                X
            );
            return ((S['aria-haspopup'] = 'menu'), (S['aria-expanded'] = N), S);
        }, [d, T.reference, A.reference, re.reference, X, N]),
        jt = u.useMemo(() => {
            const S = Re(A.trigger, re.trigger, X);
            return ((S['aria-haspopup'] = 'menu'), (S['aria-expanded'] = !1), S);
        }, [A.trigger, re.trigger, X]),
        kt = u.useMemo(
            () =>
                Re(
                    Mn,
                    {
                        id: P,
                        role: 'menu',
                        'aria-labelledby': L?.id,
                        onMouseMove() {
                            (d.set('allowMouseEnter', !0), I.type === 'menu' && d.set('hoverEnabled', !1));
                        },
                        onClick() {
                            d.select('hoverEnabled') && d.set('hoverEnabled', !1);
                        },
                        onKeyDown(S) {
                            const U = d.select('keyboardEventRelay');
                            U && !S.isPropagationStopped() && U(S);
                        },
                    },
                    T.floating,
                    A.floating,
                    re.floating
                ),
            [L, P, I.type, d, T.floating, A.floating, re.floating]
        ),
        Nt = A.item ?? ve;
    Pn(d, { floatingRootContext: W, activeTriggerProps: ce, inactiveTriggerProps: jt, popupProps: kt, itemProps: Nt });
    const At = u.useMemo(() => ({ store: d, parent: $ }), [d, $]),
        Ve = c.jsx(gt.Provider, { value: At, children: typeof n == 'function' ? n({ payload: Y }) : n });
    return I.type === void 0 || I.type === 'context-menu' ? c.jsx(Tn, { externalTree: H, children: Ve }) : Ve;
});
function Ko(t) {
    const e = ie().store,
        n = u.useMemo(() => ({ parentMenu: e }), [e]);
    return c.jsx(Ct.Provider, { value: n, children: c.jsx(Mt, { ...t }) });
}
function Yo(t = {}) {
    const { highlightItemOnHover: e, highlightedIndex: n, onHighlightedIndexChange: o } = lt(),
        { ref: s, index: a } = Ee(t),
        i = n === a,
        l = u.useRef(null),
        r = ot(s, l);
    return {
        compositeProps: {
            tabIndex: i ? 0 : -1,
            onFocus() {
                o(a);
            },
            onMouseMove() {
                const p = l.current;
                if (!e || !p) return;
                const h = p.hasAttribute('disabled') || p.ariaDisabled === 'true';
                !i && !h && p.focus();
            },
        },
        compositeRef: r,
        index: a,
    };
}
function Wo(t) {
    const {
            render: e,
            className: n,
            style: o,
            state: s = ve,
            props: a = _e,
            refs: i = _e,
            metadata: l,
            stateAttributesMapping: r,
            tag: f = 'div',
            ...p
        } = t,
        { compositeProps: h, compositeRef: x } = Yo({ metadata: l });
    return Q(f, t, { state: s, ref: [...i, x], props: [h, ...a, p], stateAttributesMapping: r });
}
function Pt(t) {
    if (On(t) && t.hasAttribute('data-rootownerid')) return t.getAttribute('data-rootownerid') ?? void 0;
    if (!En(t)) return Pt(wn(t));
}
function qo(t, e) {
    const n = u.useRef(null);
    function o(a) {
        (We.flushSync(() => {
            t.setOpen(!1, ue(Ae, a.nativeEvent, a.currentTarget));
        }),
            An(n.current)?.focus());
    }
    function s(a) {
        const i = t.select('positionerElement');
        if (i && jn(a, i)) t.context.beforeContentFocusGuardRef.current?.focus();
        else {
            We.flushSync(() => {
                t.setOpen(!1, ue(Ae, a.nativeEvent, a.currentTarget));
            });
            let l = kn(t.context.triggerFocusTargetRef.current || e.current);
            for (; l !== null && Fe(i, l);) {
                const r = l;
                if (((l = Nn(l)), l === r)) break;
            }
            l?.focus();
        }
    }
    return { preFocusGuardRef: n, handlePreFocusGuardFocus: o, handleFocusTargetFocus: s };
}
function Xo(t) {
    const { enabled: e = !0, mouseDownAction: n, open: o } = t,
        s = u.useRef(!1);
    return u.useMemo(
        () =>
            e
                ? {
                      onMouseDown: (a) => {
                          ((n === 'open' && !o) || (n === 'close' && o)) &&
                              ((s.current = !0),
                              De(a.currentTarget).addEventListener(
                                  'click',
                                  () => {
                                      s.current = !1;
                                  },
                                  { once: !0 }
                              ));
                      },
                      onClick: (a) => {
                          s.current && ((s.current = !1), a.preventBaseUIHandler());
                      },
                  }
                : ve,
        [e, n, o]
    );
}
const Me = 2,
    Jo = _n(function (e, n) {
        const {
                render: o,
                className: s,
                style: a,
                disabled: i = !1,
                nativeButton: l = !0,
                id: r,
                openOnHover: f,
                delay: p = 100,
                closeDelay: h = 0,
                handle: x,
                payload: b,
                ...R
            } = e,
            O = ie(!0),
            m = x?.store ?? O?.store;
        if (!m) throw new Error(de(85));
        const v = Te(r),
            y = m.useState('isTriggerActive', v),
            g = m.useState('floatingRootContext'),
            E = m.useState('isOpenedByTrigger', v),
            $ = m.useState('triggerPopupId', v),
            d = u.useRef(null),
            j = Zo(),
            P = lt(!0),
            H = Fn(),
            C = u.useMemo(() => H ?? new at(), [H]),
            k = rt(C),
            N = it(),
            { registerTrigger: L, isMountedByThisTrigger: B } = Dn(v, d, m, {
                payload: b,
                closeDelay: h,
                parent: j,
                floatingTreeRoot: C,
                floatingNodeId: k,
                floatingParentNodeId: N,
                keyboardEventRelay: P?.relayKeyboardEvent,
            }),
            F = j.type === 'menubar',
            G = m.useState('disabled'),
            D = i || G || (F && j.context.disabled),
            { getButtonProps: I, buttonRef: V } = nt({ disabled: D, native: l });
        u.useEffect(() => {
            !E && j.type === void 0 && (m.context.allowMouseUpTriggerRef.current = !1);
        }, [m, E, j.type]);
        const Y = u.useRef(null),
            le = be(),
            Z = Oe((A) => {
                if (!Y.current) return;
                (le.clear(), (m.context.allowMouseUpTriggerRef.current = !1));
                const w = A.target;
                if (
                    Fe(Y.current, w) ||
                    Fe(m.select('positionerElement'), w) ||
                    w === Y.current ||
                    (w != null && Pt(w) === m.select('rootId'))
                )
                    return;
                const T = vo(Y.current);
                (A.clientX >= T.left - Me &&
                    A.clientX <= T.right + Me &&
                    A.clientY >= T.top - Me &&
                    A.clientY <= T.bottom + Me) ||
                    C.events.emit('close', { domEvent: A, reason: Ln });
            });
        u.useEffect(() => {
            E && m.select('lastOpenChangeReason') === Pe && De(Y.current).addEventListener('mouseup', Z, { once: !0 });
        }, [E, Z, m]);
        const q = F && j.context.hasSubmenuOpen,
            oe = ct(g, {
                enabled: (f ?? q) && !D && j.type !== 'context-menu' && (!F || (q && !B)),
                handleClose: ut({ blockPointerEvents: !F }),
                mouseOnly: !0,
                move: !1,
                restMs: j.type === void 0 ? p : void 0,
                delay: { close: h },
                triggerElementRef: d,
                externalTree: C,
                isActiveTrigger: y,
                isClosing: () => m.select('transitionStatus') === 'ending',
            }),
            fe = Qo(E, m.select('lastOpenChangeReason')),
            z = dt(g, {
                enabled: !D && j.type !== 'context-menu',
                event: E && F ? 'click' : 'mousedown',
                toggle: !0,
                ignoreMouse: !1,
                stickIfOpen: j.type === void 0 ? fe : !1,
            }),
            ee = $n(g, { enabled: !D && q }),
            X = Xo({ open: E, enabled: F, mouseDownAction: 'open' }),
            se = u.useMemo(() => Re(ee.reference, z.reference), [ee.reference, z.reference]),
            ae = m.useState('triggerProps', B),
            { preFocusGuardRef: W, handlePreFocusGuardFocus: J, handleFocusTargetFocus: ge } = qo(m, d),
            pe = { disabled: D, open: E },
            re = [Y, n, V, L, d],
            he = [
                se,
                oe ?? ve,
                ae,
                {
                    'aria-haspopup': 'menu',
                    'aria-controls': $,
                    id: v,
                    onMouseDown: (A) => {
                        if (m.select('open')) return;
                        (le.start(200, () => {
                            m.context.allowMouseUpTriggerRef.current = !0;
                        }),
                            De(A.currentTarget).addEventListener('mouseup', Z, { once: !0 }));
                    },
                },
                F ? { role: 'menuitem' } : {},
                X,
                R,
                I,
            ],
            xe = Q('button', e, { enabled: !F, stateAttributesMapping: Je, state: pe, ref: re, props: he });
        return F
            ? c.jsx(Wo, {
                  tag: 'button',
                  render: o,
                  className: s,
                  style: a,
                  state: pe,
                  refs: re,
                  props: he,
                  stateAttributesMapping: Je,
              })
            : E
              ? c.jsxs(u.Fragment, {
                    children: [
                        c.jsx(Qe, { ref: W, onFocus: J }, `${v}-pre-focus-guard`),
                        c.jsx(u.Fragment, { children: xe }, v),
                        c.jsx(Qe, { ref: m.context.triggerFocusTargetRef, onFocus: ge }, `${v}-post-focus-guard`),
                    ],
                })
              : c.jsx(u.Fragment, { children: xe }, v);
    });
function Qo(t, e) {
    const n = be(),
        [o, s] = u.useState(!1);
    return (
        me(() => {
            t && e === 'trigger-hover'
                ? (s(!0),
                  n.start(Hn, () => {
                      s(!1);
                  }))
                : t || (n.clear(), s(!1));
        }, [t, e, n]),
        o
    );
}
function Zo() {
    const t = je(!0),
        e = ie(!0),
        n = St();
    return u.useMemo(
        () => (n ? { type: 'menubar', context: n } : t && !e ? { type: 'context-menu', context: t } : { type: void 0 }),
        [t, e, n]
    );
}
const es = u.forwardRef(function (e, n) {
    const {
            render: o,
            className: s,
            style: a,
            label: i,
            id: l,
            nativeButton: r = !1,
            openOnHover: f = !0,
            delay: p = 100,
            closeDelay: h = 0,
            disabled: x = !1,
            ...b
        } = e,
        R = Ee({ label: i }),
        O = we(),
        { store: m } = ie(),
        v = Te(l),
        y = m.useState('open'),
        g = m.useState('floatingRootContext'),
        E = m.useState('floatingTreeRoot'),
        $ = m.useState('triggerPopupId', v),
        d = zn(v, m),
        j = u.useCallback(
            (z) => {
                const ee = d(z);
                return (
                    z !== null &&
                        m.select('open') &&
                        m.select('activeTriggerId') == null &&
                        m.update({ activeTriggerId: v, activeTriggerElement: z, closeDelay: h }),
                    ee
                );
            },
            [d, h, m, v]
        ),
        P = u.useRef(null),
        H = u.useCallback(
            (z) => {
                ((P.current = z), m.set('activeTriggerElement', z));
            },
            [m]
        ),
        C = It();
    if (!C?.parentMenu) throw new Error(de(37));
    m.useSyncedValue('closeDelay', h);
    const k = C.parentMenu,
        N = m.useState('disabled'),
        L = k.useState('disabled'),
        B = x || N || L,
        F = k.useState('itemProps'),
        G = k.useState('isActive', R.index),
        D = u.useMemo(
            () => ({
                type: 'submenu-trigger',
                setActive() {
                    k.select('highlightItemOnHover') && k.set('activeIndex', R.index);
                },
            }),
            [k, R.index]
        ),
        { getItemProps: I, itemRef: V } = Be({
            closeOnClick: !1,
            disabled: B,
            highlighted: G,
            id: v,
            store: m,
            typingRef: k.context.typingRef,
            nativeButton: r,
            itemMetadata: D,
            nodeId: O?.context.nodeId,
        }),
        Y = m.useState('hoverEnabled'),
        le = ct(g, {
            enabled: Y && f && !B,
            handleClose: ut({ blockPointerEvents: !0 }),
            mouseOnly: !0,
            move: !0,
            restMs: p,
            delay: { open: p, close: h },
            shouldOpen: p > 0 ? () => k.select('allowMouseEnter') : void 0,
            triggerElementRef: P,
            externalTree: E,
            isClosing: () => m.select('transitionStatus') === 'ending',
        }),
        q = dt(g, { enabled: !B, event: 'mousedown', toggle: !f, ignoreMouse: f, stickIfOpen: !1 }).reference ?? ve,
        ne = m.useState('triggerProps', !0);
    return (
        delete ne.id,
        Q('div', e, {
            state: { disabled: B, highlighted: G, open: y },
            stateAttributesMapping: Bn,
            props: [
                q,
                le,
                ne,
                F,
                {
                    'aria-controls': $,
                    tabIndex: y || G ? 0 : -1,
                    onBlur() {
                        G && k.set('activeIndex', null);
                    },
                },
                b,
                I,
            ],
            ref: [n, R.ref, V, j, H],
        })
    );
});
function ts(t) {
    const e = M.c(2);
    let n;
    return (
        e[0] !== t ? ((n = c.jsx(Mt, { 'data-slot': 'dropdown-menu', ...t })), (e[0] = t), (e[1] = n)) : (n = e[1]),
        n
    );
}
function Tt(t) {
    const e = M.c(2);
    let n;
    return (
        e[0] !== t
            ? ((n = c.jsx(Fo, { 'data-slot': 'dropdown-menu-portal', ...t })), (e[0] = t), (e[1] = n))
            : (n = e[1]),
        n
    );
}
function ns(t) {
    const e = M.c(2);
    let n;
    return (
        e[0] !== t
            ? ((n = c.jsx(Jo, { 'data-slot': 'dropdown-menu-trigger', ...t })), (e[0] = t), (e[1] = n))
            : (n = e[1]),
        n
    );
}
function Ot(t) {
    const e = M.c(18);
    let n, o, s, a, i, l;
    e[0] !== t
        ? (({ className: n, align: s, alignOffset: a, side: i, sideOffset: l, ...o } = t),
          (e[0] = t),
          (e[1] = n),
          (e[2] = o),
          (e[3] = s),
          (e[4] = a),
          (e[5] = i),
          (e[6] = l))
        : ((n = e[1]), (o = e[2]), (s = e[3]), (a = e[4]), (i = e[5]), (l = e[6]));
    const r = s === void 0 ? 'start' : s,
        f = a === void 0 ? 0 : a,
        p = i === void 0 ? 'bottom' : i,
        h = l === void 0 ? 4 : l;
    let x;
    e[7] !== n
        ? ((x = te(
              'motion-safe:data-open:animate-in motion-safe:data-closed:animate-out motion-safe:data-closed:fade-out-0 motion-safe:data-open:fade-in-0 motion-safe:data-closed:zoom-out-95 motion-safe:data-open:zoom-in-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground min-w-32 rounded-lg p-1 shadow-md ring-1 motion-safe:duration-100 motion-safe:data-[side=inline-start]:slide-in-from-right-2 motion-safe:data-[side=inline-end]:slide-in-from-left-2 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto outline-none data-closed:overflow-hidden',
              n
          )),
          (e[7] = n),
          (e[8] = x))
        : (x = e[8]);
    let b;
    e[9] !== o || e[10] !== x
        ? ((b = c.jsx(Ao, { 'data-slot': 'dropdown-menu-content', className: x, ...o })),
          (e[9] = o),
          (e[10] = x),
          (e[11] = b))
        : (b = e[11]);
    let R;
    return (
        e[12] !== r || e[13] !== f || e[14] !== p || e[15] !== h || e[16] !== b
            ? ((R = c.jsx(Tt, {
                  children: c.jsx(Do, {
                      className: 'isolate outline-none',
                      align: r,
                      alignOffset: f,
                      side: p,
                      sideOffset: h,
                      children: b,
                  }),
              })),
              (e[12] = r),
              (e[13] = f),
              (e[14] = p),
              (e[15] = h),
              (e[16] = b),
              (e[17] = R))
            : (R = e[17]),
        R
    );
}
function os(t) {
    const e = M.c(2);
    let n;
    return (
        e[0] !== t
            ? ((n = c.jsx(jo, { 'data-slot': 'dropdown-menu-group', ...t })), (e[0] = t), (e[1] = n))
            : (n = e[1]),
        n
    );
}
function ss(t) {
    const e = M.c(12);
    let n, o, s, a;
    e[0] !== t
        ? (({ className: n, inset: o, variant: a, ...s } = t),
          (e[0] = t),
          (e[1] = n),
          (e[2] = o),
          (e[3] = s),
          (e[4] = a))
        : ((n = e[1]), (o = e[2]), (s = e[3]), (a = e[4]));
    const i = a === void 0 ? 'default' : a;
    let l;
    e[5] !== n
        ? ((l = te(
              "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive not-data-[variant=destructive]:focus:**:text-accent-foreground gap-1.5 rounded-md px-1.5 py-1 text-sm data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4 group/dropdown-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
              n
          )),
          (e[5] = n),
          (e[6] = l))
        : (l = e[6]);
    let r;
    return (
        e[7] !== o || e[8] !== s || e[9] !== l || e[10] !== i
            ? ((r = c.jsx(ko, {
                  'data-slot': 'dropdown-menu-item',
                  'data-inset': o,
                  'data-variant': i,
                  className: l,
                  ...s,
              })),
              (e[7] = o),
              (e[8] = s),
              (e[9] = l),
              (e[10] = i),
              (e[11] = r))
            : (r = e[11]),
        r
    );
}
function as(t) {
    const e = M.c(2);
    let n;
    return (
        e[0] !== t
            ? ((n = c.jsx($o, { 'data-slot': 'dropdown-menu-radio-group', ...t })), (e[0] = t), (e[1] = n))
            : (n = e[1]),
        n
    );
}
function Ne(t) {
    const e = M.c(13);
    let n, o, s, a;
    e[0] !== t
        ? (({ className: o, children: n, inset: s, ...a } = t),
          (e[0] = t),
          (e[1] = n),
          (e[2] = o),
          (e[3] = s),
          (e[4] = a))
        : ((n = e[1]), (o = e[2]), (s = e[3]), (a = e[4]));
    let i;
    e[5] !== o
        ? ((i = te(
              "focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4 relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
              o
          )),
          (e[5] = o),
          (e[6] = i))
        : (i = e[6]);
    let l;
    e[7] === Symbol.for('react.memo_cache_sentinel')
        ? ((l = c.jsx('span', {
              className: 'absolute right-2 flex items-center justify-center pointer-events-none',
              children: c.jsx(Bo, { children: c.jsx(Un, { className: 'size-2 fill-current' }) }),
          })),
          (e[7] = l))
        : (l = e[7]);
    let r;
    return (
        e[8] !== n || e[9] !== s || e[10] !== a || e[11] !== i
            ? ((r = c.jsxs(zo, {
                  'data-slot': 'dropdown-menu-radio-item',
                  'data-inset': s,
                  className: i,
                  ...a,
                  children: [l, n],
              })),
              (e[8] = n),
              (e[9] = s),
              (e[10] = a),
              (e[11] = i),
              (e[12] = r))
            : (r = e[12]),
        r
    );
}
function rs(t) {
    const e = M.c(8);
    let n, o;
    e[0] !== t ? (({ className: n, ...o } = t), (e[0] = t), (e[1] = n), (e[2] = o)) : ((n = e[1]), (o = e[2]));
    let s;
    e[3] !== n ? ((s = te('bg-border -mx-1 my-1 h-px', n)), (e[3] = n), (e[4] = s)) : (s = e[4]);
    let a;
    return (
        e[5] !== o || e[6] !== s
            ? ((a = c.jsx(so, { 'data-slot': 'dropdown-menu-separator', className: s, ...o })),
              (e[5] = o),
              (e[6] = s),
              (e[7] = a))
            : (a = e[7]),
        a
    );
}
function is(t) {
    const e = M.c(2);
    let n;
    return (
        e[0] !== t ? ((n = c.jsx(Ko, { 'data-slot': 'dropdown-menu-sub', ...t })), (e[0] = t), (e[1] = n)) : (n = e[1]),
        n
    );
}
function ls(t) {
    const e = M.c(13);
    let n, o, s, a;
    e[0] !== t
        ? (({ className: o, inset: s, children: n, ...a } = t),
          (e[0] = t),
          (e[1] = n),
          (e[2] = o),
          (e[3] = s),
          (e[4] = a))
        : ((n = e[1]), (o = e[2]), (s = e[3]), (a = e[4]));
    let i;
    e[5] !== o
        ? ((i = te(
              "focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-1.5 rounded-md px-1.5 py-1 text-sm data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4 flex cursor-default items-center outline-hidden select-none data-popup-open:bg-accent data-popup-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
              o
          )),
          (e[5] = o),
          (e[6] = i))
        : (i = e[6]);
    let l;
    e[7] === Symbol.for('react.memo_cache_sentinel')
        ? ((l = c.jsx(Gn, { className: 'ml-auto size-4' })), (e[7] = l))
        : (l = e[7]);
    let r;
    return (
        e[8] !== n || e[9] !== s || e[10] !== a || e[11] !== i
            ? ((r = c.jsxs(es, {
                  'data-slot': 'dropdown-menu-sub-trigger',
                  'data-inset': s,
                  className: i,
                  ...a,
                  children: [n, l],
              })),
              (e[8] = n),
              (e[9] = s),
              (e[10] = a),
              (e[11] = i),
              (e[12] = r))
            : (r = e[12]),
        r
    );
}
function cs(t) {
    const e = M.c(16);
    let n, o, s, a, i, l;
    e[0] !== t
        ? (({ align: s, alignOffset: a, side: i, sideOffset: l, className: n, ...o } = t),
          (e[0] = t),
          (e[1] = n),
          (e[2] = o),
          (e[3] = s),
          (e[4] = a),
          (e[5] = i),
          (e[6] = l))
        : ((n = e[1]), (o = e[2]), (s = e[3]), (a = e[4]), (i = e[5]), (l = e[6]));
    const r = s === void 0 ? 'start' : s,
        f = a === void 0 ? 0 : a,
        p = i === void 0 ? 'right' : i,
        h = l === void 0 ? 0 : l;
    let x;
    e[7] !== n
        ? ((x = te(
              'motion-safe:data-open:animate-in motion-safe:data-closed:animate-out motion-safe:data-closed:fade-out-0 motion-safe:data-open:fade-in-0 motion-safe:data-closed:zoom-out-95 motion-safe:data-open:zoom-in-95 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=left]:slide-in-from-right-2 motion-safe:data-[side=right]:slide-in-from-left-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground min-w-24 rounded-lg p-1 shadow-lg ring-1 motion-safe:duration-100 w-auto',
              n
          )),
          (e[7] = n),
          (e[8] = x))
        : (x = e[8]);
    let b;
    return (
        e[9] !== r || e[10] !== f || e[11] !== o || e[12] !== p || e[13] !== h || e[14] !== x
            ? ((b = c.jsx(Ot, {
                  'data-slot': 'dropdown-menu-sub-content',
                  className: x,
                  align: r,
                  alignOffset: f,
                  side: p,
                  sideOffset: h,
                  ...o,
              })),
              (e[9] = r),
              (e[10] = f),
              (e[11] = o),
              (e[12] = p),
              (e[13] = h),
              (e[14] = x),
              (e[15] = b))
            : (b = e[15]),
        b
    );
}
function us() {
    const t = M.c(10),
        e = Vn(),
        n = Kn(),
        o = Yn();
    let s;
    t[0] === Symbol.for('react.memo_cache_sentinel') ? ((s = qn()), (t[0] = s)) : (s = t[0]);
    const { mutate: a, isPending: i } = Wn(s);
    let l;
    t[1] !== a || t[2] !== e || t[3] !== o || t[4] !== n
        ? ((l = () => {
              a(void 0, {
                  async onSuccess() {
                      (o.clear(), await n.invalidate(), e({ to: '/login', ignoreBlocker: !0 }));
                  },
              });
          }),
          (t[1] = a),
          (t[2] = e),
          (t[3] = o),
          (t[4] = n),
          (t[5] = l))
        : (l = t[5]);
    let r;
    t[6] === Symbol.for('react.memo_cache_sentinel') ? ((r = c.jsx(Xn, {})), (t[6] = r)) : (r = t[6]);
    let f;
    return (
        t[7] !== i || t[8] !== l
            ? ((f = c.jsxs(ss, { onClick: l, disabled: i, children: [r, 'Log out'] })),
              (t[7] = i),
              (t[8] = l),
              (t[9] = f))
            : (f = t[9]),
        f
    );
}
const ds = (t, e = 2) =>
        t
            .trim()
            .split(' ')
            .map((n) => n.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, e),
    Et = u.createContext(void 0);
function wt() {
    const t = u.useContext(Et);
    if (t === void 0) throw new Error(de(13));
    return t;
}
const Ge = { imageLoadingStatus: () => null },
    fs = u.forwardRef(function (e, n) {
        const { className: o, render: s, style: a, ...i } = e,
            [l, r] = u.useState('idle'),
            f = { imageLoadingStatus: l },
            p = u.useMemo(() => ({ imageLoadingStatus: l, setImageLoadingStatus: r }), [l, r]),
            h = Q('span', e, { state: f, ref: n, props: i, stateAttributesMapping: Ge });
        return c.jsx(Et.Provider, { value: p, children: h });
    });
function ps(t, { referrerPolicy: e, crossOrigin: n, sizes: o, srcSet: s }) {
    const [a, i] = u.useState('idle');
    return (
        me(() => {
            if (!t && !s) return (i('error'), Jn);
            let l = !0;
            const r = new window.Image(),
                f = (p) => () => {
                    l && i(p);
                };
            return (
                i('loading'),
                (r.onload = f('loaded')),
                (r.onerror = f('error')),
                e && (r.referrerPolicy = e),
                (r.crossOrigin = n ?? null),
                o && (r.sizes = o),
                s && (r.srcset = s),
                t && (r.src = t),
                r.complete && i(r.naturalWidth > 0 ? 'loaded' : 'error'),
                () => {
                    l = !1;
                }
            );
        }, [t, s, o, n, e]),
        a
    );
}
const ms = { ...Ge, ...$e },
    gs = u.forwardRef(function (e, n) {
        const { className: o, render: s, onLoadingStatusChange: a, style: i, ...l } = e,
            { setImageLoadingStatus: r } = wt(),
            f = ps(l.src, l),
            p = f === 'loaded',
            { mounted: h, transitionStatus: x, setMounted: b } = st(p),
            R = u.useRef(null),
            O = Oe((y) => {
                (a?.(y), r(y));
            });
        (me(() => {
            f !== 'idle' && O(f);
        }, [f, O]),
            me(() => () => r('idle'), [r]),
            He({
                open: p,
                ref: R,
                onComplete() {
                    p || b(!1);
                },
            }));
        const v = Q('img', e, {
            state: { imageLoadingStatus: f, transitionStatus: x },
            ref: [n, R],
            props: l,
            stateAttributesMapping: ms,
            enabled: h,
        });
        return h ? v : null;
    }),
    hs = u.forwardRef(function (e, n) {
        const { className: o, render: s, delay: a, style: i, ...l } = e,
            { imageLoadingStatus: r } = wt(),
            [f, p] = u.useState(a === void 0),
            h = be();
        return (
            u.useEffect(() => (a !== void 0 ? h.start(a, () => p(!0)) : p(!0), h.clear), [h, a]),
            Q('span', e, {
                state: { imageLoadingStatus: r },
                ref: n,
                props: l,
                stateAttributesMapping: Ge,
                enabled: r !== 'loaded' && (a === void 0 || f),
            })
        );
    });
function xs(t) {
    const e = M.c(10);
    let n, o, s;
    e[0] !== t
        ? (({ className: n, size: s, ...o } = t), (e[0] = t), (e[1] = n), (e[2] = o), (e[3] = s))
        : ((n = e[1]), (o = e[2]), (s = e[3]));
    const a = s === void 0 ? 'default' : s;
    let i;
    e[4] !== n
        ? ((i = te(
              'size-8 rounded-full after:rounded-full data-[size=lg]:size-10 data-[size=sm]:size-6 group/avatar relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:border-border after:mix-blend-darken dark:after:mix-blend-lighten',
              n
          )),
          (e[4] = n),
          (e[5] = i))
        : (i = e[5]);
    let l;
    return (
        e[6] !== o || e[7] !== a || e[8] !== i
            ? ((l = c.jsx(fs, { 'data-slot': 'avatar', 'data-size': a, className: i, ...o })),
              (e[6] = o),
              (e[7] = a),
              (e[8] = i),
              (e[9] = l))
            : (l = e[9]),
        l
    );
}
function bs(t) {
    const e = M.c(8);
    let n, o;
    e[0] !== t ? (({ className: n, ...o } = t), (e[0] = t), (e[1] = n), (e[2] = o)) : ((n = e[1]), (o = e[2]));
    let s;
    e[3] !== n
        ? ((s = te('rounded-full aspect-square size-full object-cover', n)), (e[3] = n), (e[4] = s))
        : (s = e[4]);
    let a;
    return (
        e[5] !== o || e[6] !== s
            ? ((a = c.jsx(gs, { 'data-slot': 'avatar-image', className: s, ...o })), (e[5] = o), (e[6] = s), (e[7] = a))
            : (a = e[7]),
        a
    );
}
function vs(t) {
    const e = M.c(8);
    let n, o;
    e[0] !== t ? (({ className: n, ...o } = t), (e[0] = t), (e[1] = n), (e[2] = o)) : ((n = e[1]), (o = e[2]));
    let s;
    e[3] !== n
        ? ((s = te(
              'bg-muted text-muted-foreground rounded-full flex size-full items-center justify-center text-sm group-data-[size=sm]/avatar:text-xs',
              n
          )),
          (e[3] = n),
          (e[4] = s))
        : (s = e[4]);
    let a;
    return (
        e[5] !== o || e[6] !== s
            ? ((a = c.jsx(hs, { 'data-slot': 'avatar-fallback', className: s, ...o })),
              (e[5] = o),
              (e[6] = s),
              (e[7] = a))
            : (a = e[7]),
        a
    );
}
function ys(t) {
    const e = M.c(13),
        { className: n, name: o, avatarUrl: s } = t;
    let a;
    e[0] !== o ? ((a = ds(o)), (e[0] = o), (e[1] = a)) : (a = e[1]);
    const i = a;
    let l;
    e[2] !== n ? ((l = te('h-8 w-8 rounded-lg', n)), (e[2] = n), (e[3] = l)) : (l = e[3]);
    let r;
    e[4] !== s || e[5] !== o ? ((r = c.jsx(bs, { src: s, alt: o })), (e[4] = s), (e[5] = o), (e[6] = r)) : (r = e[6]);
    let f;
    e[7] !== i ? ((f = c.jsx(vs, { className: 'rounded-lg', children: i })), (e[7] = i), (e[8] = f)) : (f = e[8]);
    let p;
    return (
        e[9] !== l || e[10] !== r || e[11] !== f
            ? ((p = c.jsxs(xs, { className: l, children: [r, f] })), (e[9] = l), (e[10] = r), (e[11] = f), (e[12] = p))
            : (p = e[12]),
        p
    );
}
const Rs = tt('/_authenticated');
function Ss(t) {
    const e = M.c(16),
        { className: n } = t;
    let o;
    e[0] === Symbol.for('react.memo_cache_sentinel')
        ? ((o = {
              select(x) {
                  return x.auth.me;
              },
          }),
          (e[0] = o))
        : (o = e[0]);
    const s = Rs.useRouteContext(o),
        a = Qn[s.role].label;
    let i;
    e[1] !== n ? ((i = te('flex items-center gap-2 py-1.5 text-left text-sm', n)), (e[1] = n), (e[2] = i)) : (i = e[2]);
    let l;
    e[3] !== s.email ? ((l = c.jsx(ys, { name: s.email })), (e[3] = s.email), (e[4] = l)) : (l = e[4]);
    let r;
    e[5] !== s.email
        ? ((r = c.jsx('span', { className: 'truncate font-semibold', children: s.email })),
          (e[5] = s.email),
          (e[6] = r))
        : (r = e[6]);
    let f;
    e[7] !== a
        ? ((f = c.jsx('span', { className: 'truncate text-xs mb-1 text-muted-foreground', children: a })),
          (e[7] = a),
          (e[8] = f))
        : (f = e[8]);
    let p;
    e[9] !== r || e[10] !== f
        ? ((p = c.jsxs('div', { className: 'grid flex-1 text-left text-sm leading-tight', children: [r, f] })),
          (e[9] = r),
          (e[10] = f),
          (e[11] = p))
        : (p = e[11]);
    let h;
    return (
        e[12] !== i || e[13] !== l || e[14] !== p
            ? ((h = c.jsxs('div', { className: i, children: [l, p] })),
              (e[12] = i),
              (e[13] = l),
              (e[14] = p),
              (e[15] = h))
            : (h = e[15]),
        h
    );
}
function Cs() {
    const t = M.c(7),
        { theme: e, setTheme: n } = Zn();
    let o;
    t[0] === Symbol.for('react.memo_cache_sentinel')
        ? ((o = c.jsxs(ls, { children: [c.jsx(eo, {}), 'Toggle theme'] })), (t[0] = o))
        : (o = t[0]);
    const s = n;
    let a, i, l;
    t[1] === Symbol.for('react.memo_cache_sentinel')
        ? ((a = c.jsx(Ne, { closeOnClick: !0, value: 'light', children: 'Light' })),
          (i = c.jsx(Ne, { closeOnClick: !0, value: 'dark', children: 'Dark' })),
          (l = c.jsx(Ne, { closeOnClick: !0, value: 'system', children: 'System' })),
          (t[1] = a),
          (t[2] = i),
          (t[3] = l))
        : ((a = t[1]), (i = t[2]), (l = t[3]));
    let r;
    return (
        t[4] !== s || t[5] !== e
            ? ((r = c.jsx(os, {
                  children: c.jsxs(is, {
                      children: [
                          o,
                          c.jsx(Tt, {
                              children: c.jsx(cs, {
                                  children: c.jsxs(as, { value: e, onValueChange: s, children: [a, i, l] }),
                              }),
                          }),
                      ],
                  }),
              })),
              (t[4] = s),
              (t[5] = e),
              (t[6] = r))
            : (r = t[6]),
        r
    );
}
function Is() {
    const t = M.c(6),
        { isMobile: e } = ft();
    let n;
    t[0] === Symbol.for('react.memo_cache_sentinel')
        ? ((n = c.jsx(ns, {
              render: c.jsxs(ze, {
                  size: 'lg',
                  className: 'h-auto data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground',
                  tooltip: 'Profile',
                  children: [c.jsx(Ss, {}), c.jsx(to, { className: 'ml-auto size-4' })],
              }),
          })),
          (t[0] = n))
        : (n = t[0]);
    const o = e ? 'bottom' : 'right';
    let s, a, i;
    t[1] === Symbol.for('react.memo_cache_sentinel')
        ? ((s = c.jsx(Cs, {})), (a = c.jsx(rs, {})), (i = c.jsx(us, {})), (t[1] = s), (t[2] = a), (t[3] = i))
        : ((s = t[1]), (a = t[2]), (i = t[3]));
    let l;
    return (
        t[4] !== o
            ? ((l = c.jsx(Ce, {
                  children: c.jsx(Se, {
                      children: c.jsxs(ts, {
                          children: [
                              n,
                              c.jsxs(Ot, {
                                  className: 'w-(--anchor-width) min-w-56 rounded-lg',
                                  side: o,
                                  align: 'end',
                                  sideOffset: 4,
                                  children: [s, a, i],
                              }),
                          ],
                      }),
                  }),
              })),
              (t[4] = o),
              (t[5] = l))
            : (l = t[5]),
        l
    );
}
function Ms() {
    const t = M.c(2);
    let e;
    t[0] === Symbol.for('react.memo_cache_sentinel')
        ? ((e = c.jsx(ke, { className: 'size-8 rounded-full shrink-0' })), (t[0] = e))
        : (e = t[0]);
    let n;
    return (
        t[1] === Symbol.for('react.memo_cache_sentinel')
            ? ((n = c.jsx(Ce, {
                  children: c.jsx(Se, {
                      children: c.jsxs('div', {
                          className:
                              'flex items-center group-data-[state=expanded]:gap-2 h-16 px-2 motion-safe:transition-[width,height,padding] group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:px-0',
                          children: [
                              e,
                              c.jsxs('div', {
                                  className: 'grid flex-1 text-left text-sm leading-tight gap-2',
                                  children: [
                                      c.jsx(ke, { className: 'w-1/2 h-3' }),
                                      c.jsx(ke, { className: 'w-3/4 h-3' }),
                                  ],
                              }),
                          ],
                      }),
                  }),
              })),
              (t[1] = n))
            : (n = t[1]),
        n
    );
}
function Ps() {
    const t = M.c(2);
    let e;
    t[0] === Symbol.for('react.memo_cache_sentinel')
        ? ((e = c.jsx('span', {
              className:
                  'flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar text-sidebar-primary-foreground',
              children: c.jsx('img', { src: '/icon.svg', className: 'size-8', alt: '', 'aria-hidden': !0 }),
          })),
          (t[0] = e))
        : (e = t[0]);
    let n;
    return (
        t[1] === Symbol.for('react.memo_cache_sentinel')
            ? ((n = c.jsx(Ce, {
                  children: c.jsx(Se, {
                      children: c.jsx(ze, {
                          size: 'lg',
                          render: c.jsxs(et, {
                              to: '/dashboard',
                              children: [
                                  e,
                                  c.jsx('span', {
                                      className: 'grid flex-1 text-left text-sm leading-tight',
                                      children: c.jsx('span', {
                                          className: 'truncate font-semibold',
                                          children: 'Phenomenon admin panel',
                                      }),
                                  }),
                              ],
                          }),
                      }),
                  }),
              })),
              (t[1] = n))
            : (n = t[1]),
        n
    );
}
function Ts(t) {
    const e = M.c(6);
    let n;
    e[0] === Symbol.for('react.memo_cache_sentinel')
        ? ((n = c.jsx(ro, { children: c.jsx(Ps, {}) })), (e[0] = n))
        : (n = e[0]);
    let o;
    e[1] === Symbol.for('react.memo_cache_sentinel')
        ? ((o = c.jsx(io, { children: c.jsx(u.Suspense, { fallback: c.jsx(To, {}), children: c.jsx(Po, {}) }) })),
          (e[1] = o))
        : (o = e[1]);
    let s, a;
    e[2] === Symbol.for('react.memo_cache_sentinel')
        ? ((s = c.jsx(lo, { children: c.jsx(u.Suspense, { fallback: c.jsx(Ms, {}), children: c.jsx(Is, {}) }) })),
          (a = c.jsx(co, {})),
          (e[2] = s),
          (e[3] = a))
        : ((s = e[2]), (a = e[3]));
    let i;
    return (
        e[4] !== t
            ? ((i = c.jsxs(ao, { collapsible: 'icon', ...t, children: [n, o, s, a] })), (e[4] = t), (e[5] = i))
            : (i = e[5]),
        i
    );
}
function Os(t) {
    const e = M.c(5);
    let n;
    e[0] === Symbol.for('react.memo_cache_sentinel') ? ((n = So(fo)), (e[0] = n)) : (n = e[0]);
    let o;
    e[1] === Symbol.for('react.memo_cache_sentinel') ? ((o = c.jsx(Ts, {})), (e[1] = o)) : (o = e[1]);
    let s;
    e[2] === Symbol.for('react.memo_cache_sentinel')
        ? ((s = c.jsx(po, {
              children: c.jsx('div', { className: 'flex flex-1 flex-col gap-4 p-6', children: c.jsx(no, {}) }),
          })),
          (e[2] = s))
        : (s = e[2]);
    let a;
    return (
        e[3] !== t
            ? ((a = c.jsxs(uo, { defaultOpen: n === 'true', ...t, children: [o, s] })), (e[3] = t), (e[4] = a))
            : (a = e[4]),
        a
    );
}
const _s = Os;
export { _s as component };
