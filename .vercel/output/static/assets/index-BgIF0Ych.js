import {
    bQ as $,
    af as ae,
    bT as be,
    aF as C,
    a9 as ce,
    bb as Ce,
    $ as de,
    c as De,
    be as ee,
    b$ as Ee,
    M as F,
    b7 as fe,
    ao as ge,
    I as he,
    B as ie,
    bY as Ie,
    b_ as je,
    c0 as ke,
    p as L,
    bS as le,
    U as M,
    R as me,
    r as ne,
    bv as Ne,
    F as oe,
    bX as Oe,
    a8 as pe,
    bZ as Pe,
    j as Q,
    _ as re,
    bW as Re,
    bR as se,
    a4 as Se,
    e as T,
    k as te,
    ag as ue,
    f as V,
    bU as ve,
    t as W,
    Q as we,
    aT as X,
    J as xe,
    q as Y,
    bV as ye,
    u as Z,
} from './index-CATHI92X.js';
import { C as _e, I as Me, u as Te } from './useScrollLock-BrgHxV8m.js';
import { j as c, r as h, c as y } from './vendor-react-1kp2ER4x.js';

function Be(a) {
    return T(a.defaultTagName ?? 'div', a, a);
}
const Ct = h.forwardRef(function (e, t) {
        const { className: s, render: o, orientation: n = 'horizontal', style: i, ...d } = e;
        return T('div', e, {
            state: { orientation: n },
            ref: t,
            props: [{ role: 'separator', 'aria-orientation': n }, d],
        });
    }),
    q = h.createContext(!1),
    G = h.createContext(void 0);
function B(a) {
    const e = h.useContext(G);
    if (a === !1 && e === void 0) throw new Error(V(27));
    return e;
}
const $e = { ...L, ...W },
    ze = h.forwardRef(function (e, t) {
        const { render: s, className: o, style: n, forceRender: i = !1, ...d } = e,
            { store: r } = B(),
            l = r.useState('open'),
            u = r.useState('nested'),
            p = r.useState('mounted'),
            m = r.useState('transitionStatus');
        return T('div', e, {
            state: { open: l, transitionStatus: m },
            ref: [r.context.backdropRef, t],
            stateAttributesMapping: $e,
            props: [{ role: 'presentation', hidden: !p, style: { userSelect: 'none', WebkitUserSelect: 'none' } }, d],
            enabled: i || !u,
        });
    }),
    Fe = h.forwardRef(function (e, t) {
        const { render: s, className: o, style: n, disabled: i = !1, nativeButton: d = !0, ...r } = e,
            { store: l } = B(),
            u = l.useState('open'),
            { getButtonProps: p, buttonRef: m } = Z({ disabled: i, native: d }),
            I = { disabled: i };
        function P(x) {
            u && l.setOpen(!1, Y(ee, x.nativeEvent));
        }
        return T('button', e, { state: I, ref: [t, m], props: [{ onClick: P }, r, p] });
    }),
    Ae = h.forwardRef(function (e, t) {
        const { render: s, className: o, style: n, id: i, ...d } = e,
            { store: r } = B(),
            l = Q(i);
        return (r.useSyncedValueWithCleanup('descriptionElementId', l), T('p', e, { ref: t, props: [{ id: l }, d] }));
    });
let Ue = (function (a) {
        return ((a.nestedDialogs = '--nested-dialogs'), a);
    })({}),
    Ke = (function (a) {
        return (
            (a[(a.open = $.open)] = 'open'),
            (a[(a.closed = $.closed)] = 'closed'),
            (a[(a.startingStyle = $.startingStyle)] = 'startingStyle'),
            (a[(a.endingStyle = $.endingStyle)] = 'endingStyle'),
            (a.nested = 'data-nested'),
            (a.nestedDialogOpen = 'data-nested-dialog-open'),
            a
        );
    })({});
const J = h.createContext(void 0);
function He() {
    const a = h.useContext(J);
    if (a === void 0) throw new Error(V(26));
    return a;
}
const Ve = {
        ...L,
        ...W,
        nestedDialogOpen(a) {
            return a ? { [Ke.nestedDialogOpen]: '' } : null;
        },
    },
    We = h.forwardRef(function (e, t) {
        const { render: s, className: o, style: n, finalFocus: i, initialFocus: d, ...r } = e,
            { store: l } = B(),
            u = l.useState('descriptionElementId'),
            p = l.useState('disablePointerDismissal'),
            m = l.useState('floatingRootContext'),
            I = l.useState('popupProps'),
            P = l.useState('modal'),
            x = l.useState('mounted'),
            w = l.useState('nested'),
            g = l.useState('nestedOpenDialogCount'),
            b = l.useState('open'),
            D = l.useState('openMethod'),
            O = l.useState('titleElementId'),
            f = l.useState('transitionStatus'),
            S = l.useState('role'),
            N = m.useState('floatingId'),
            k = r.id ?? N;
        (He(),
            te({
                open: b,
                ref: l.context.popupRef,
                onComplete() {
                    b && l.context.onOpenChangeComplete?.(!0);
                },
            }));
        const v = d === void 0 ? se(l.context.popupRef) : d,
            R = g > 0,
            j = l.useStateSetter('popupElement'),
            _ = T('div', e, {
                state: { open: b, nested: w, transitionStatus: f, nestedDialogOpen: R },
                props: [
                    I,
                    {
                        id: k,
                        'aria-labelledby': O ?? void 0,
                        'aria-describedby': u ?? void 0,
                        role: S,
                        ...ae,
                        hidden: !x,
                        onKeyDown(K) {
                            _e.has(K.key) && K.stopPropagation();
                        },
                        style: { [Ue.nestedDialogs]: g },
                    },
                    r,
                ],
                ref: [t, l.context.popupRef, j],
                stateAttributesMapping: Ve,
            });
        return c.jsx(oe, {
            context: m,
            openInteractionType: D,
            disabled: !x,
            closeOnFocusOut: !p,
            initialFocus: v,
            returnFocus: i,
            modal: P !== !1,
            restoreFocus: 'popup',
            children: _,
        });
    }),
    Le = h.forwardRef(function (e, t) {
        const { keepMounted: s = !1, ...o } = e,
            { store: n } = B(),
            i = n.useState('mounted'),
            d = n.useState('modal'),
            r = n.useState('open');
        return i || s
            ? c.jsx(J.Provider, {
                  value: s,
                  children: c.jsxs(ne, {
                      ref: t,
                      ...o,
                      children: [
                          i && d === !0 && c.jsx(Me, { ref: n.context.internalBackdropRef, inert: ie(!r) }),
                          e.children,
                      ],
                  }),
              })
            : null;
    });
function Ye(a) {
    const { store: e, actionsRef: t } = a,
        s = e.useState('open');
    (le(e, s), re(e));
    const { forceUnmount: o } = de(s, e),
        n = h.useCallback(() => {
            e.setOpen(!1, Y(pe));
        }, [e]);
    h.useImperativeHandle(t, () => ({ unmount: o, close: n }), [o, n]);
}
function Qe({ store: a, parentContext: e, isDrawer: t }) {
    const s = a.useState('open'),
        o = a.useState('disablePointerDismissal'),
        n = a.useState('modal'),
        i = a.useState('popupElement'),
        d = a.useState('floatingRootContext'),
        [r, l] = h.useState(0),
        [u, p] = h.useState(0),
        m = r === 0,
        I = ce(d, {
            outsidePressEvent() {
                return a.context.internalBackdropRef.current || a.context.backdropRef.current
                    ? 'intentional'
                    : { mouse: n === 'trap-focus' ? 'sloppy' : 'intentional', touch: 'sloppy' };
            },
            outsidePress(g) {
                if (
                    !a.context.outsidePressEnabledRef.current ||
                    ('button' in g && g.button !== 0) ||
                    ('touches' in g && g.touches.length !== 1)
                )
                    return !1;
                const b = fe(g);
                return m && !o
                    ? n && (a.context.internalBackdropRef.current || a.context.backdropRef.current)
                        ? a.context.internalBackdropRef.current === b ||
                          a.context.backdropRef.current === b ||
                          (ge(b, i) && !b?.hasAttribute('data-base-ui-portal'))
                        : !0
                    : !1;
            },
            escapeKey: m,
        });
    (Te(s && n === !0, i),
        a.useContextCallback('onNestedDialogOpen', (g, b) => {
            (l(g), p(b));
        }),
        a.useContextCallback('onNestedDialogClose', () => {
            (l(0), p(0));
        }),
        h.useEffect(
            () => (
                e?.onNestedDialogOpen && s && e.onNestedDialogOpen(r + 1, u + (t ? 1 : 0)),
                e?.onNestedDialogClose && !s && e.onNestedDialogClose(),
                () => {
                    e?.onNestedDialogClose && s && e.onNestedDialogClose();
                }
            ),
            [t, s, r, u, e]
        ));
    const P = I.reference ?? F,
        x = I.trigger ?? F,
        w = I.floating ?? F;
    return (
        ue(a, {
            activeTriggerProps: P,
            inactiveTriggerProps: x,
            popupProps: w,
            nestedOpenDialogCount: r,
            nestedOpenDrawerCount: u,
        }),
        null
    );
}
const Xe = {
    ...xe,
    modal: M((a) => a.modal),
    nested: M((a) => a.nested),
    nestedOpenDialogCount: M((a) => a.nestedOpenDialogCount),
    nestedOpenDrawerCount: M((a) => a.nestedOpenDrawerCount),
    disablePointerDismissal: M((a) => a.disablePointerDismissal),
    openMethod: M((a) => a.openMethod),
    descriptionElementId: M((a) => a.descriptionElementId),
    titleElementId: M((a) => a.titleElementId),
    viewportElement: M((a) => a.viewportElement),
    role: M((a) => a.role),
};
class A extends me {
    constructor(e, t, s = !1) {
        const o = new he(),
            n = qe(e);
        ((n.floatingRootContext = be(o, t, s)),
            super(
                n,
                {
                    popupRef: h.createRef(),
                    backdropRef: h.createRef(),
                    internalBackdropRef: h.createRef(),
                    outsidePressEnabledRef: { current: !0 },
                    triggerElements: o,
                    onOpenChange: void 0,
                    onOpenChangeComplete: void 0,
                },
                Xe
            ));
    }
    setOpen = (e, t) => {
        if (
            ((t.preventUnmountOnClose = () => {
                this.set('preventUnmountingOnClose', !0);
            }),
            !e &&
                t.trigger == null &&
                this.state.activeTriggerId != null &&
                (t.trigger = this.state.activeTriggerElement ?? void 0),
            this.context.onOpenChange?.(e, t),
            t.isCanceled)
        )
            return;
        this.state.floatingRootContext.dispatchOpenChange(e, t);
        const s = { open: e };
        (Se(s, e, t.trigger), this.update(s));
    };
    static useStore(e, t) {
        return ve(e, (o, n) => new A(t, o, n), !0).store;
    }
}
function qe(a = {}) {
    return {
        ...we(),
        modal: !0,
        disablePointerDismissal: !1,
        popupElement: null,
        viewportElement: null,
        descriptionElementId: void 0,
        titleElementId: void 0,
        openMethod: null,
        nested: !1,
        nestedOpenDialogCount: 0,
        nestedOpenDrawerCount: 0,
        role: 'dialog',
        ...a,
    };
}
function Ge(a, e = 'dialog') {
    const {
            children: t,
            open: s,
            defaultOpen: o = !1,
            onOpenChange: n,
            onOpenChangeComplete: i,
            disablePointerDismissal: d = !1,
            modal: r = !0,
            actionsRef: l,
            handle: u,
            triggerId: p,
            defaultTriggerId: m = null,
        } = a,
        I = e === 'drawer',
        P = e === 'alert-dialog',
        x = P ? !0 : r,
        w = P || d,
        g = P ? 'alertdialog' : 'dialog',
        b = B(!0),
        O = { modal: x, disablePointerDismissal: w, nested: !!b, role: g },
        f = A.useStore(u?.store, { open: o, openProp: s, activeTriggerId: m, triggerIdProp: p, ...O });
    (Ce(() => {
        const j = s === void 0 && f.state.open === !1 && o === !0 ? { open: !0, activeTriggerId: m } : null;
        P ? f.update(j ? { ...O, ...j } : O) : j && f.update(j);
    }),
        f.useControlledProp('openProp', s),
        f.useControlledProp('triggerIdProp', p),
        f.useSyncedValues(O),
        f.useContextCallback('onOpenChange', n),
        f.useContextCallback('onOpenChangeComplete', i));
    const S = f.useState('open'),
        N = f.useState('mounted'),
        k = f.useState('payload');
    Ye({ store: f, actionsRef: l });
    const v = S || N,
        R = h.useMemo(() => ({ store: f }), [f]);
    return c.jsx(q.Provider, {
        value: !1,
        children: c.jsxs(G.Provider, {
            value: R,
            children: [
                v && c.jsx(Qe, { store: f, parentContext: b?.store.context, isDrawer: I }),
                typeof t == 'function' ? t({ payload: k }) : t,
            ],
        }),
    });
}
function Je(a) {
    const e = h.useContext(q) ? 'drawer' : 'dialog';
    return Ge(a, e);
}
const Ze = h.forwardRef(function (e, t) {
    const { render: s, className: o, style: n, id: i, ...d } = e,
        { store: r } = B(),
        l = Q(i);
    return (r.useSyncedValueWithCleanup('titleElementId', l), T('h2', e, { ref: t, props: [{ id: l }, d] }));
});
function et(a) {
    const e = y.c(4);
    let t;
    e[0] !== a ? (({ ...t } = a), (e[0] = a), (e[1] = t)) : (t = e[1]);
    let s;
    return (e[2] !== t ? ((s = c.jsx(Je, { 'data-slot': 'sheet', ...t })), (e[2] = t), (e[3] = s)) : (s = e[3]), s);
}
function tt(a) {
    const e = y.c(4);
    let t;
    e[0] !== a ? (({ ...t } = a), (e[0] = a), (e[1] = t)) : (t = e[1]);
    let s;
    return (
        e[2] !== t ? ((s = c.jsx(Le, { 'data-slot': 'sheet-portal', ...t })), (e[2] = t), (e[3] = s)) : (s = e[3]),
        s
    );
}
function st(a) {
    const e = y.c(8);
    let t, s;
    e[0] !== a ? (({ className: t, ...s } = a), (e[0] = a), (e[1] = t), (e[2] = s)) : ((t = e[1]), (s = e[2]));
    let o;
    e[3] !== t
        ? ((o = C(
              'bg-black/10 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 motion-safe:transition-opacity motion-safe:duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0',
              t
          )),
          (e[3] = t),
          (e[4] = o))
        : (o = e[4]);
    let n;
    return (
        e[5] !== s || e[6] !== o
            ? ((n = c.jsx(ze, { 'data-slot': 'sheet-overlay', className: o, ...s })),
              (e[5] = s),
              (e[6] = o),
              (e[7] = n))
            : (n = e[7]),
        n
    );
}
function at(a) {
    const e = y.c(17);
    let t, s, o, n, i;
    e[0] !== a
        ? (({ className: s, children: t, side: n, showCloseButton: i, ...o } = a),
          (e[0] = a),
          (e[1] = t),
          (e[2] = s),
          (e[3] = o),
          (e[4] = n),
          (e[5] = i))
        : ((t = e[1]), (s = e[2]), (o = e[3]), (n = e[4]), (i = e[5]));
    const d = n === void 0 ? 'right' : n,
        r = i === void 0 ? !0 : i;
    let l;
    e[6] === Symbol.for('react.memo_cache_sentinel') ? ((l = c.jsx(st, {})), (e[6] = l)) : (l = e[6]);
    let u;
    e[7] !== s
        ? ((u = C(
              'bg-background fixed flex flex-col gap-4 bg-clip-padding text-sm shadow-lg motion-safe:transition motion-safe:duration-200 motion-safe:ease-in-out data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:data-ending-style:translate-y-10 data-[side=bottom]:data-starting-style:translate-y-1 data-[side=left]:data-ending-style:-translate-x-1 data-[side=left]:data-starting-style:-translate-x-1 data-[side=right]:data-ending-style:translate-x-1 data-[side=right]:data-starting-style:translate-x-10 data-[side=top]:data-ending-style:-translate-y-10 data-[side=top]:data-starting-style:-translate-y-1',
              s
          )),
          (e[7] = s),
          (e[8] = u))
        : (u = e[8]);
    let p;
    e[9] !== r
        ? ((p =
              r &&
              c.jsx(Fe, {
                  'data-slot': 'sheet-close',
                  render: c.jsxs(X, {
                      variant: 'ghost',
                      className: 'absolute top-3 right-3',
                      size: 'icon-sm',
                      children: [c.jsx(ye, {}), c.jsx('span', { className: 'sr-only', children: 'Close' })],
                  }),
              })),
          (e[9] = r),
          (e[10] = p))
        : (p = e[10]);
    let m;
    return (
        e[11] !== t || e[12] !== o || e[13] !== d || e[14] !== u || e[15] !== p
            ? ((m = c.jsxs(tt, {
                  children: [
                      l,
                      c.jsxs(We, {
                          'data-slot': 'sheet-content',
                          'data-side': d,
                          className: u,
                          ...o,
                          children: [t, p],
                      }),
                  ],
              })),
              (e[11] = t),
              (e[12] = o),
              (e[13] = d),
              (e[14] = u),
              (e[15] = p),
              (e[16] = m))
            : (m = e[16]),
        m
    );
}
function ot(a) {
    const e = y.c(8);
    let t, s;
    e[0] !== a ? (({ className: t, ...s } = a), (e[0] = a), (e[1] = t), (e[2] = s)) : ((t = e[1]), (s = e[2]));
    let o;
    e[3] !== t ? ((o = C('gap-0.5 p-4 flex flex-col', t)), (e[3] = t), (e[4] = o)) : (o = e[4]);
    let n;
    return (
        e[5] !== s || e[6] !== o
            ? ((n = c.jsx('div', { 'data-slot': 'sheet-header', className: o, ...s })),
              (e[5] = s),
              (e[6] = o),
              (e[7] = n))
            : (n = e[7]),
        n
    );
}
function nt(a) {
    const e = y.c(8);
    let t, s;
    e[0] !== a ? (({ className: t, ...s } = a), (e[0] = a), (e[1] = t), (e[2] = s)) : ((t = e[1]), (s = e[2]));
    let o;
    e[3] !== t ? ((o = C('text-foreground text-base font-medium', t)), (e[3] = t), (e[4] = o)) : (o = e[4]);
    let n;
    return (
        e[5] !== s || e[6] !== o
            ? ((n = c.jsx(Ze, { 'data-slot': 'sheet-title', className: o, ...s })), (e[5] = s), (e[6] = o), (e[7] = n))
            : (n = e[7]),
        n
    );
}
function it(a) {
    const e = y.c(8);
    let t, s;
    e[0] !== a ? (({ className: t, ...s } = a), (e[0] = a), (e[1] = t), (e[2] = s)) : ((t = e[1]), (s = e[2]));
    let o;
    e[3] !== t ? ((o = C('text-muted-foreground text-sm', t)), (e[3] = t), (e[4] = o)) : (o = e[4]);
    let n;
    return (
        e[5] !== s || e[6] !== o
            ? ((n = c.jsx(Ae, { 'data-slot': 'sheet-description', className: o, ...s })),
              (e[5] = s),
              (e[6] = o),
              (e[7] = n))
            : (n = e[7]),
        n
    );
}
function H(a) {
    const e = y.c(8);
    let t, s;
    e[0] !== a ? (({ className: t, ...s } = a), (e[0] = a), (e[1] = t), (e[2] = s)) : ((t = e[1]), (s = e[2]));
    let o;
    e[3] !== t ? ((o = C('motion-safe:animate-pulse rounded-md bg-muted', t)), (e[3] = t), (e[4] = o)) : (o = e[4]);
    let n;
    return (
        e[5] !== s || e[6] !== o
            ? ((n = c.jsx('div', { className: o, ...s })), (e[5] = s), (e[6] = o), (e[7] = n))
            : (n = e[7]),
        n
    );
}
const lt = 'sidebar_state',
    rt = 3600 * 24 * 7,
    dt = '16rem',
    ct = '18rem',
    ut = '3rem',
    pt = 'b',
    ft = Ne(
        'ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground gap-2 rounded-md p-2 text-left text-sm motion-safe:transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 data-active:font-medium peer/menu-button group/menu-button flex w-full items-center overflow-hidden outline-hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate',
        {
            variants: {
                variant: {
                    default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    outline:
                        'bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
                },
                size: {
                    default: 'h-8 text-sm',
                    sm: 'h-7 text-xs',
                    lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
                },
            },
            defaultVariants: { variant: 'default', size: 'default' },
        }
    ),
    gt = 768;
function mt() {
    return Re(`(max-width: ${gt - 1}px)`) ?? !1;
}
const U = h.createContext({});
U.displayName = 'SidebarContext';
function yt(a) {
    const e = y.c(35);
    let t, s, o, n, i, d, r;
    e[0] !== a
        ? (({ defaultOpen: r, open: o, onOpenChange: i, className: s, style: d, children: t, ...n } = a),
          (e[0] = a),
          (e[1] = t),
          (e[2] = s),
          (e[3] = o),
          (e[4] = n),
          (e[5] = i),
          (e[6] = d),
          (e[7] = r))
        : ((t = e[1]), (s = e[2]), (o = e[3]), (n = e[4]), (i = e[5]), (d = e[6]), (r = e[7]));
    const l = r === void 0 ? !0 : r,
        u = mt(),
        [p, m] = h.useState(!1),
        [I, P] = h.useState(l),
        x = o ?? I;
    let w;
    e[8] !== x || e[9] !== i
        ? ((w = (E) => {
              const _ = typeof E == 'function' ? E(x) : E;
              (i ? i(_) : P(_), (document.cookie = `${lt}=${_}; path=/; max-age=${rt}`));
          }),
          (e[8] = x),
          (e[9] = i),
          (e[10] = w))
        : (w = e[10]);
    const g = w;
    let b;
    e[11] !== u || e[12] !== g
        ? ((b = () => {
              u ? m(ht) : g(bt);
          }),
          (e[11] = u),
          (e[12] = g),
          (e[13] = b))
        : (b = e[13]);
    const D = b;
    let O;
    (e[14] !== D
        ? ((O = (E) => {
              E.key === pt && (E.metaKey || E.ctrlKey) && (E.preventDefault(), D());
          }),
          (e[14] = D),
          (e[15] = O))
        : (O = e[15]),
        Oe(window, 'keydown', O));
    const f = x ? 'expanded' : 'collapsed';
    let S;
    e[16] !== u || e[17] !== x || e[18] !== p || e[19] !== g || e[20] !== f || e[21] !== D
        ? ((S = { state: f, open: x, setOpen: g, isMobile: u, openMobile: p, setOpenMobile: m, toggleSidebar: D }),
          (e[16] = u),
          (e[17] = x),
          (e[18] = p),
          (e[19] = g),
          (e[20] = f),
          (e[21] = D),
          (e[22] = S))
        : (S = e[22]);
    let N;
    e[23] !== d
        ? ((N = { '--sidebar-width': dt, '--sidebar-width-icon': ut, ...d }), (e[23] = d), (e[24] = N))
        : (N = e[24]);
    const k = N;
    let v;
    e[25] !== s
        ? ((v = C(
              'group/sidebar-wrapper flex flex-col md:flex-row h-full w-full has-data-[variant=inset]:bg-sidebar',
              s
          )),
          (e[25] = s),
          (e[26] = v))
        : (v = e[26]);
    let R;
    e[27] !== t || e[28] !== n || e[29] !== k || e[30] !== v
        ? ((R = c.jsx('div', { style: k, className: v, ...n, children: t })),
          (e[27] = t),
          (e[28] = n),
          (e[29] = k),
          (e[30] = v),
          (e[31] = R))
        : (R = e[31]);
    let j;
    return (
        e[32] !== S || e[33] !== R
            ? ((j = c.jsx(U, { value: S, children: R })), (e[32] = S), (e[33] = R), (e[34] = j))
            : (j = e[34]),
        j
    );
}
function bt(a) {
    return !a;
}
function ht(a) {
    return !a;
}
const z = () => Ie(U);
function Nt(a) {
    const e = y.c(46);
    let t, s, o, n, i, d;
    e[0] !== a
        ? (({ side: n, variant: i, collapsible: d, className: s, children: t, ...o } = a),
          (e[0] = a),
          (e[1] = t),
          (e[2] = s),
          (e[3] = o),
          (e[4] = n),
          (e[5] = i),
          (e[6] = d))
        : ((t = e[1]), (s = e[2]), (o = e[3]), (n = e[4]), (i = e[5]), (d = e[6]));
    const r = n === void 0 ? 'left' : n,
        l = i === void 0 ? 'sidebar' : i,
        u = d === void 0 ? 'offcanvas' : d,
        { isMobile: p, state: m, openMobile: I, setOpenMobile: P } = z();
    if (u === 'none') {
        let v;
        e[7] !== s
            ? ((v = C('bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col', s)),
              (e[7] = s),
              (e[8] = v))
            : (v = e[8]);
        let R;
        return (
            e[9] !== t || e[10] !== o || e[11] !== v
                ? ((R = c.jsx('aside', { 'data-slot': 'sidebar', className: v, ...o, children: t })),
                  (e[9] = t),
                  (e[10] = o),
                  (e[11] = v),
                  (e[12] = R))
                : (R = e[12]),
            R
        );
    }
    if (p) {
        let v;
        e[13] === Symbol.for('react.memo_cache_sentinel')
            ? ((v = { '--sidebar-width': ct }), (e[13] = v))
            : (v = e[13]);
        let R;
        e[14] === Symbol.for('react.memo_cache_sentinel')
            ? ((R = c.jsxs(ot, {
                  className: 'sr-only',
                  children: [
                      c.jsx(nt, { children: 'Sidebar' }),
                      c.jsx(it, { children: 'Displays the mobile sidebar.' }),
                  ],
              })),
              (e[14] = R))
            : (R = e[14]);
        let j;
        e[15] !== t
            ? ((j = c.jsx('div', { className: 'flex h-full w-full flex-col', children: t })), (e[15] = t), (e[16] = j))
            : (j = e[16]);
        let E;
        e[17] !== r || e[18] !== j
            ? ((E = c.jsxs(at, {
                  'data-sidebar': 'sidebar',
                  'data-slot': 'sidebar',
                  'data-mobile': 'true',
                  className: 'bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden',
                  style: v,
                  side: r,
                  children: [R, j],
              })),
              (e[17] = r),
              (e[18] = j),
              (e[19] = E))
            : (E = e[19]);
        let _;
        return (
            e[20] !== I || e[21] !== o || e[22] !== P || e[23] !== E
                ? ((_ = c.jsx(et, { open: I, onOpenChange: P, ...o, children: E })),
                  (e[20] = I),
                  (e[21] = o),
                  (e[22] = P),
                  (e[23] = E),
                  (e[24] = _))
                : (_ = e[24]),
            _
        );
    }
    const x = m === 'collapsed' ? u : '',
        w =
            l === 'floating' || l === 'inset'
                ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
                : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)';
    let g;
    e[25] !== w
        ? ((g = C(
              'relative w-(--sidebar-width) bg-transparent motion-safe:transition-[width] motion-safe:duration-200 motion-safe:ease-linear',
              'group-data-[collapsible=offcanvas]:w-0',
              'group-data-[side=right]:rotate-180',
              w
          )),
          (e[25] = w),
          (e[26] = g))
        : (g = e[26]);
    let b;
    e[27] !== g
        ? ((b = c.jsx('div', { 'data-slot': 'sidebar-gap', className: g })), (e[27] = g), (e[28] = b))
        : (b = e[28]);
    const D =
            r === 'left'
                ? 'left-0 group-data-[collapsible=offcanvas]:-left-(--sidebar-width)'
                : 'right-0 group-data-[collapsible=offcanvas]:-right-(--sidebar-width)',
        O =
            l === 'floating' || l === 'inset'
                ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
                : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l';
    let f;
    e[29] !== s || e[30] !== D || e[31] !== O
        ? ((f = C(
              'fixed inset-y-0 z-10 hidden h-full w-(--sidebar-width) motion-safe:transition-[left,right,width] motion-safe:duration-200 motion-safe:ease-linear md:flex',
              D,
              O,
              s
          )),
          (e[29] = s),
          (e[30] = D),
          (e[31] = O),
          (e[32] = f))
        : (f = e[32]);
    let S;
    e[33] !== t
        ? ((S = c.jsx('div', {
              'data-sidebar': 'sidebar',
              'data-slot': 'sidebar-inner',
              className:
                  'bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm',
              children: t,
          })),
          (e[33] = t),
          (e[34] = S))
        : (S = e[34]);
    let N;
    e[35] !== o || e[36] !== f || e[37] !== S
        ? ((N = c.jsx('div', { 'data-slot': 'sidebar-container', className: f, ...o, children: S })),
          (e[35] = o),
          (e[36] = f),
          (e[37] = S),
          (e[38] = N))
        : (N = e[38]);
    let k;
    return (
        e[39] !== r || e[40] !== m || e[41] !== N || e[42] !== x || e[43] !== b || e[44] !== l
            ? ((k = c.jsxs('aside', {
                  className: 'group peer text-sidebar-foreground hidden md:block',
                  'data-state': m,
                  'data-collapsible': x,
                  'data-variant': l,
                  'data-side': r,
                  'data-slot': 'sidebar',
                  children: [b, N],
              })),
              (e[39] = r),
              (e[40] = m),
              (e[41] = N),
              (e[42] = x),
              (e[43] = b),
              (e[44] = l),
              (e[45] = k))
            : (k = e[45]),
        k
    );
}
function Rt(a) {
    const e = y.c(8);
    let t, s;
    e[0] !== a ? (({ className: t, ...s } = a), (e[0] = a), (e[1] = t), (e[2] = s)) : ((t = e[1]), (s = e[2]));
    let o;
    e[3] !== t
        ? ((o = C('flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden', t)),
          (e[3] = t),
          (e[4] = o))
        : (o = e[4]);
    let n;
    return (
        e[5] !== s || e[6] !== o
            ? ((n = c.jsx('div', { 'data-slot': 'sidebar-content', 'data-sidebar': 'content', className: o, ...s })),
              (e[5] = s),
              (e[6] = o),
              (e[7] = n))
            : (n = e[7]),
        n
    );
}
function Ot(a) {
    const e = y.c(8);
    let t, s;
    e[0] !== a ? (({ className: t, ...s } = a), (e[0] = a), (e[1] = t), (e[2] = s)) : ((t = e[1]), (s = e[2]));
    let o;
    e[3] !== t ? ((o = C('relative flex w-full min-w-0 flex-col p-2', t)), (e[3] = t), (e[4] = o)) : (o = e[4]);
    let n;
    return (
        e[5] !== s || e[6] !== o
            ? ((n = c.jsx('div', { 'data-slot': 'sidebar-group', 'data-sidebar': 'group', className: o, ...s })),
              (e[5] = s),
              (e[6] = o),
              (e[7] = n))
            : (n = e[7]),
        n
    );
}
function It(a) {
    const e = y.c(8);
    let t, s;
    e[0] !== a ? (({ className: t, ...s } = a), (e[0] = a), (e[1] = t), (e[2] = s)) : ((t = e[1]), (s = e[2]));
    let o;
    e[3] !== t ? ((o = C('flex flex-col gap-2 p-2', t)), (e[3] = t), (e[4] = o)) : (o = e[4]);
    let n;
    return (
        e[5] !== s || e[6] !== o
            ? ((n = c.jsx('header', { 'data-slot': 'sidebar-header', 'data-sidebar': 'header', className: o, ...s })),
              (e[5] = s),
              (e[6] = o),
              (e[7] = n))
            : (n = e[7]),
        n
    );
}
function Pt(a) {
    const e = y.c(8);
    let t, s;
    e[0] !== a ? (({ className: t, ...s } = a), (e[0] = a), (e[1] = t), (e[2] = s)) : ((t = e[1]), (s = e[2]));
    let o;
    e[3] !== t ? ((o = C('flex flex-col gap-2 p-2', t)), (e[3] = t), (e[4] = o)) : (o = e[4]);
    let n;
    return (
        e[5] !== s || e[6] !== o
            ? ((n = c.jsx('footer', { 'data-slot': 'sidebar-footer', 'data-sidebar': 'footer', className: o, ...s })),
              (e[5] = s),
              (e[6] = o),
              (e[7] = n))
            : (n = e[7]),
        n
    );
}
function Dt(a) {
    const e = y.c(8);
    let t, s;
    e[0] !== a ? (({ className: t, ...s } = a), (e[0] = a), (e[1] = t), (e[2] = s)) : ((t = e[1]), (s = e[2]));
    let o;
    e[3] !== t
        ? ((o = C(
              'bg-background relative flex w-full flex-1 flex-col md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
              t
          )),
          (e[3] = t),
          (e[4] = o))
        : (o = e[4]);
    let n;
    return (
        e[5] !== s || e[6] !== o
            ? ((n = c.jsx('main', { 'data-slot': 'sidebar-inset', className: o, ...s })),
              (e[5] = s),
              (e[6] = o),
              (e[7] = n))
            : (n = e[7]),
        n
    );
}
function jt(a) {
    const e = y.c(8);
    let t, s;
    e[0] !== a ? (({ className: t, ...s } = a), (e[0] = a), (e[1] = t), (e[2] = s)) : ((t = e[1]), (s = e[2]));
    let o;
    e[3] !== t ? ((o = C('flex w-full min-w-0 flex-col gap-1', t)), (e[3] = t), (e[4] = o)) : (o = e[4]);
    let n;
    return (
        e[5] !== s || e[6] !== o
            ? ((n = c.jsx('ul', { 'data-slot': 'sidebar-menu', 'data-sidebar': 'menu', className: o, ...s })),
              (e[5] = s),
              (e[6] = o),
              (e[7] = n))
            : (n = e[7]),
        n
    );
}
function Et(a) {
    const e = y.c(18);
    let { render: t, isActive: s, variant: o, size: n, tooltip: i, className: d, ...r } = a;
    const l = s === void 0 ? !1 : s,
        u = o === void 0 ? 'default' : o,
        p = n === void 0 ? 'default' : n,
        { isMobile: m, state: I } = z(),
        P = 'button',
        x = De({ className: C(ft({ variant: u, size: p }), d) }, r);
    let w;
    e[0] !== t || e[1] !== i
        ? ((w = i ? c.jsx(Ee, { render: t }) : t), (e[0] = t), (e[1] = i), (e[2] = w))
        : (w = e[2]);
    let g;
    e[3] !== l || e[4] !== p
        ? ((g = { slot: 'sidebar-menu-button', sidebar: 'menu-button', size: p, active: l }),
          (e[3] = l),
          (e[4] = p),
          (e[5] = g))
        : (g = e[5]);
    let b;
    e[6] !== x || e[7] !== w || e[8] !== g
        ? ((b = { defaultTagName: P, props: x, render: w, state: g }), (e[6] = x), (e[7] = w), (e[8] = g), (e[9] = b))
        : (b = e[9]);
    const D = Be(b);
    if (!i) return D;
    if (typeof i == 'string') {
        let N;
        (e[10] !== i ? ((N = { children: i }), (e[10] = i), (e[11] = N)) : (N = e[11]), (i = N));
    }
    const O = I !== 'collapsed' || m;
    let f;
    e[12] !== O || e[13] !== i
        ? ((f = c.jsx(je, { side: 'right', align: 'center', hidden: O, ...i })), (e[12] = O), (e[13] = i), (e[14] = f))
        : (f = e[14]);
    let S;
    return (
        e[15] !== D || e[16] !== f
            ? ((S = c.jsxs(ke, { disableHoverablePopup: !0, children: [D, f] })), (e[15] = D), (e[16] = f), (e[17] = S))
            : (S = e[17]),
        S
    );
}
function kt(a) {
    const e = y.c(8);
    let t, s;
    e[0] !== a ? (({ className: t, ...s } = a), (e[0] = a), (e[1] = t), (e[2] = s)) : ((t = e[1]), (s = e[2]));
    let o;
    e[3] !== t ? ((o = C('group/menu-item relative', t)), (e[3] = t), (e[4] = o)) : (o = e[4]);
    let n;
    return (
        e[5] !== s || e[6] !== o
            ? ((n = c.jsx('li', { 'data-slot': 'sidebar-menu-item', 'data-sidebar': 'menu-item', className: o, ...s })),
              (e[5] = s),
              (e[6] = o),
              (e[7] = n))
            : (n = e[7]),
        n
    );
}
function _t(a) {
    const e = y.c(17);
    let t, s, o;
    e[0] !== a
        ? (({ className: t, showIcon: o, ...s } = a), (e[0] = a), (e[1] = t), (e[2] = s), (e[3] = o))
        : ((t = e[1]), (s = e[2]), (o = e[3]));
    const n = o === void 0 ? !1 : o,
        [i] = h.useState(xt);
    let d;
    e[4] !== t
        ? ((d = C('h-8 group-data-[state=expanded]:gap-2 rounded-md px-2 flex items-center', t)),
          (e[4] = t),
          (e[5] = d))
        : (d = e[5]);
    let r;
    e[6] !== n
        ? ((r = n && c.jsx(H, { className: 'size-4 rounded-md', 'data-sidebar': 'menu-skeleton-icon' })),
          (e[6] = n),
          (e[7] = r))
        : (r = e[7]);
    let l;
    e[8] !== i ? ((l = { '--skeleton-width': i }), (e[8] = i), (e[9] = l)) : (l = e[9]);
    const u = l;
    let p;
    e[10] !== u
        ? ((p = c.jsx(H, {
              className: 'h-4 flex-1 max-w-(--skeleton-width)',
              'data-sidebar': 'menu-skeleton-text',
              style: u,
          })),
          (e[10] = u),
          (e[11] = p))
        : (p = e[11]);
    let m;
    return (
        e[12] !== s || e[13] !== d || e[14] !== r || e[15] !== p
            ? ((m = c.jsxs('div', {
                  'data-slot': 'sidebar-menu-skeleton',
                  'data-sidebar': 'menu-skeleton',
                  className: d,
                  ...s,
                  children: [r, p],
              })),
              (e[12] = s),
              (e[13] = d),
              (e[14] = r),
              (e[15] = p),
              (e[16] = m))
            : (m = e[16]),
        m
    );
}
function xt() {
    return `${Math.floor(Math.random() * 40) + 50}%`;
}
function Mt(a) {
    const e = y.c(9);
    let t, s;
    e[0] !== a ? (({ className: t, ...s } = a), (e[0] = a), (e[1] = t), (e[2] = s)) : ((t = e[1]), (s = e[2]));
    const { toggleSidebar: o } = z();
    let n;
    e[3] !== t
        ? ((n = C(
              'hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 motion-safe:transition-all motion-safe:ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 sm:flex in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize [[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full [[data-side=left][data-collapsible=offcanvas]_&]:-right-2 [[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
              t
          )),
          (e[3] = t),
          (e[4] = n))
        : (n = e[4]);
    let i;
    return (
        e[5] !== s || e[6] !== n || e[7] !== o
            ? ((i = c.jsx('button', {
                  'data-sidebar': 'rail',
                  'data-slot': 'sidebar-rail',
                  'aria-label': 'Toggle Sidebar',
                  tabIndex: -1,
                  onClick: o,
                  className: n,
                  ...s,
              })),
              (e[5] = s),
              (e[6] = n),
              (e[7] = o),
              (e[8] = i))
            : (i = e[8]),
        i
    );
}
function Tt(a) {
    const e = y.c(15);
    let t, s, o;
    e[0] !== a
        ? (({ className: t, onClick: s, ...o } = a), (e[0] = a), (e[1] = t), (e[2] = s), (e[3] = o))
        : ((t = e[1]), (s = e[2]), (o = e[3]));
    const { toggleSidebar: n } = z();
    let i;
    e[4] !== t ? ((i = C('size-7', t)), (e[4] = t), (e[5] = i)) : (i = e[5]);
    let d;
    e[6] !== s || e[7] !== n
        ? ((d = (p) => {
              (s?.(p), n());
          }),
          (e[6] = s),
          (e[7] = n),
          (e[8] = d))
        : (d = e[8]);
    let r, l;
    e[9] === Symbol.for('react.memo_cache_sentinel')
        ? ((r = c.jsx(Pe, {})),
          (l = c.jsx('span', { className: 'sr-only', children: 'Toggle Sidebar' })),
          (e[9] = r),
          (e[10] = l))
        : ((r = e[9]), (l = e[10]));
    let u;
    return (
        e[11] !== o || e[12] !== i || e[13] !== d
            ? ((u = c.jsxs(X, {
                  'data-sidebar': 'trigger',
                  'data-slot': 'sidebar-trigger',
                  variant: 'ghost',
                  size: 'icon-sm',
                  className: i,
                  onClick: d,
                  ...o,
                  children: [r, l],
              })),
              (e[11] = o),
              (e[12] = i),
              (e[13] = d),
              (e[14] = u))
            : (u = e[14]),
        u
    );
}
export {
    Et as S,
    kt as a,
    Ot as b,
    jt as c,
    _t as d,
    Ct as e,
    H as f,
    Nt as g,
    It as h,
    Rt as i,
    Pt as j,
    Mt as k,
    yt as l,
    lt as m,
    Dt as n,
    Be as o,
    ot as p,
    nt as q,
    it as r,
    at as s,
    et as t,
    z as u,
    Tt as v,
};
