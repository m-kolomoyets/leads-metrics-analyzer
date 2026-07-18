import { C as Ko, e as Nt, b as Qo, c as sn, d as Wo, I as Xo, u as Yo } from './getPseudoElementBounds-D7ePV0js.js';
import { s as an, t as cn, o as Jo, r as ln, p as on, q as rn } from './index-BgIF0Ych.js';
import {
    b8 as _e,
    ba as _n,
    b3 as _s,
    bb as $s,
    y as Ae,
    M as An,
    n as ao,
    bA as Ao,
    aO as Be,
    br as bo,
    ab as Bs,
    F as co,
    bv as Co,
    u as Dn,
    i as Ds,
    aT as ee,
    x as eo,
    g as Eo,
    k as fn,
    aS as fo,
    ac as Ft,
    b5 as Ge,
    bq as go,
    af as Gs,
    b4 as gt,
    aF as Hn,
    bo as ho,
    ay as Hs,
    z as io,
    bs as Io,
    b6 as it,
    bx as jo,
    bi as Js,
    U as k,
    aL as Ke,
    aa as kn,
    b0 as ks,
    be as Ks,
    bc as Ln,
    p as lo,
    o as Ls,
    f as lt,
    d as Mn,
    bm as mo,
    a5 as Ms,
    r as no,
    G as oe,
    H as On,
    v as oo,
    b1 as Os,
    aW as pe,
    bg as Pn,
    bn as po,
    e as Qe,
    bd as qs,
    j as Qs,
    K as Rn,
    B as ro,
    bz as Ro,
    ao as rt,
    D as so,
    bw as So,
    a_ as Tn,
    bk as to,
    a$ as Ts,
    b7 as Tt,
    c as un,
    t as Un,
    bl as uo,
    b9 as Us,
    b2 as v,
    by as Vn,
    bt as vo,
    q as W,
    aZ as wn,
    aP as ws,
    aA as Ws,
    bf as wt,
    bp as xo,
    bh as Xs,
    bu as yo,
    a3 as Ys,
    a9 as zs,
    bj as Zs,
} from './index-CATHI92X.js';
import {
    k as _o,
    v as $o,
    I as Bn,
    q as Bo,
    j as bt,
    m as dn,
    n as Do,
    a as Gn,
    t as Go,
    u as hn,
    p as Ho,
    c as It,
    g as ko,
    F as kt,
    r as Lo,
    s as me,
    l as Mo,
    h as No,
    i as Oo,
    f as pn,
    e as To,
    o as Uo,
    d as wo,
    b as xn,
    D as zo,
} from './index-CPILwtgz.js';
import { M as Po, S as Vo } from './index-CxJizuOO.js';
import { I as qo } from './useScrollLock-BrgHxV8m.js';
import { r as f, j as n, a as Ns, c as Pe } from './vendor-react-1kp2ER4x.js';
import { u as $e, e as Fo, s as mn, o as Ye, _ as zn } from './vendor-zod-D40u6Zl6.js';

const Zo = mn()
        .trim()
        .min(1, { error: 'This field is required' })
        .pipe(Fo({ error: 'Invalid email' })),
    $n = zn(wn),
    qn = zn(Tn),
    ei = Ye({ email: Zo, role: $n, teamId: $e().nullish(), status: qn.default('invited') });
Ye({ id: $e(), role: $n.optional(), teamId: $e().nullish(), status: qn.optional() }).refine(
    (t) => t.role !== void 0 || t.teamId !== void 0 || t.status !== void 0,
    { error: 'No fields to update' }
);
Ye({ id: $e() });
Ye({ id: $e() });
const ti = Ye({ name: mn().trim().min(1, { error: 'This field is required' }) });
Ye({ id: $e(), name: mn().trim().min(1, { error: 'This field is required' }) });
Ye({ id: $e() });
Ye({ id: $e(), leadId: $e().nullable() });
const qe = '__none__',
    Wn = wn.map((t) => ({ value: t, label: ws[t].label })),
    ni = { active: 'Active', invited: 'Invited', disabled: 'Disabled' },
    Kn = Tn.map((t) => ({ value: t, label: ni[t] })),
    Qn = (t) => [{ value: qe, label: 'No team' }, ...t.map((e) => ({ value: e.id, label: e.name }))],
    si = (t, e) => (t ? (e.find((s) => s.id === t)?.name ?? '—') : '—'),
    oi = (t) => [{ value: qe, label: 'No lead' }, ...t.map((e) => ({ value: e.id, label: e.email }))];
function ii(t, e, s, i, a, p, d, u, c, r = 2) {
    const l = Ts(s.current, {
        event: t,
        orientation: i,
        loopFocus: a,
        rtl: p,
        cols: r,
        disabledIndices: d,
        minIndex: u,
        maxIndex: c,
        prevIndex: e > c ? u : e,
        stopEvent: !0,
    });
    return ks(s.current, l) ? void 0 : l;
}
const Yn = f.createContext(void 0),
    Xn = f.createContext(void 0),
    Jn = f.createContext(void 0),
    Zn = f.createContext(!1),
    es = f.createContext('');
function Ve() {
    const t = f.useContext(Yn);
    if (!t) throw new Error(lt(22));
    return t;
}
function gn() {
    const t = f.useContext(Xn);
    if (!t) throw new Error(lt(23));
    return t;
}
function Xe() {
    const t = f.useContext(Jn);
    if (!t) throw new Error(lt(24));
    return t;
}
function ri() {
    return f.useContext(es);
}
function li() {
    return f.useContext(Zn);
}
const y = {
    id: k((t) => t.id),
    labelId: k((t) => t.labelId),
    items: k((t) => t.items),
    selectedValue: k((t) => t.selectedValue),
    hasSelectionChips: k((t) => {
        const e = t.selectedValue;
        return Array.isArray(e) && e.length > 0;
    }),
    hasSelectedValue: k((t) => {
        const { selectedValue: e, selectionMode: s } = t;
        return e == null ? !1 : s === 'multiple' && Array.isArray(e) ? e.length > 0 : !0;
    }),
    hasNullItemLabel: k((t, e) => (e ? No(t.items) : !1)),
    open: k((t) => t.open),
    mounted: k((t) => t.mounted),
    forceMounted: k((t) => t.forceMounted),
    inline: k((t) => t.inline),
    activeIndex: k((t) => t.activeIndex),
    selectedIndex: k((t) => t.selectedIndex),
    isActive: k((t, e) => t.activeIndex === e),
    isSelected: k((t, e) => {
        const s = t.isItemEqualToValue,
            i = t.selectedValue;
        return Array.isArray(i) ? i.some((a) => It(e, a, s)) : It(e, i, s);
    }),
    transitionStatus: k((t) => t.transitionStatus),
    popupProps: k((t) => t.popupProps),
    inputProps: k((t) => t.inputProps),
    triggerProps: k((t) => t.triggerProps),
    itemProps: k((t) => t.itemProps),
    positionerElement: k((t) => t.positionerElement),
    listElement: k((t) => t.listElement),
    popupId: k((t) => t.popupId),
    triggerElement: k((t) => t.triggerElement),
    inputElement: k((t) => t.inputElement),
    inputGroupElement: k((t) => t.inputGroupElement),
    popupSide: k((t) => t.popupSide),
    openMethod: k((t) => t.openMethod),
    inputInsidePopup: k((t) => t.inputInsidePopup),
    inputOwnsFormValue: k((t) => t.inputOwnsFormValue),
    selectionMode: k((t) => t.selectionMode),
    name: k((t) => t.name),
    form: k((t) => t.form),
    disabled: k((t) => t.disabled),
    readOnly: k((t) => t.readOnly),
    required: k((t) => t.required),
    grid: k((t) => t.grid),
    virtualized: k((t) => t.virtualized),
    itemToStringLabel: k((t) => t.itemToStringLabel),
    isItemEqualToValue: k((t) => t.isItemEqualToValue),
    modal: k((t) => t.modal),
    autoHighlight: k((t) => t.autoHighlight),
    submitOnItemClick: k((t) => t.submitOnItemClick),
};
function ai(t) {
    return t == null ? void 0 : `${t}-popup`;
}
function ci(t, e) {
    return (s, i) => {
        if (s == null) return !1;
        const a = me(s, e);
        return t.contains(a, i);
    };
}
function ui(t, e, s) {
    return (i, a) => {
        if (i == null) return !1;
        if (!a) return !0;
        const p = me(i, e),
            d = s != null ? me(s, e) : '';
        return d && t.contains(d, a) && d.length === a.length ? !0 : t.contains(p, a);
    };
}
function ts(t) {
    return Array.isArray(t) ? t.map((e) => ts(e)).join(',') : t == null ? '' : String(t);
}
const Fn = new Map();
function di(t = {}) {
    const e = { usage: 'search', sensitivity: 'base', ignorePunctuation: !0, ...t },
        s = `${ts(t.locale)}|${JSON.stringify(e)}`,
        i = Fn.get(s);
    if (i) return i;
    const a = new Intl.Collator(t.locale, e),
        p = {
            contains(d, u, c) {
                if (!u) return !0;
                const r = me(d, c);
                for (let l = 0; l <= r.length - u.length; l += 1)
                    if (a.compare(r.slice(l, l + u.length), u) === 0) return !0;
                return !1;
            },
            startsWith(d, u, c) {
                if (!u) return !0;
                const r = me(d, c);
                return a.compare(r.slice(0, u.length), u) === 0;
            },
            endsWith(d, u, c) {
                if (!u) return !0;
                const r = me(d, c),
                    l = u.length;
                return r.length >= l && a.compare(r.slice(r.length - l), u) === 0;
            },
        };
    return (Fn.set(s, p), p);
}
const fi = di,
    ns = Symbol('none'),
    Ze = { value: ns, index: -1 };
function mi(t) {
    const {
            id: e,
            onOpenChangeComplete: s,
            defaultSelectedValue: i = null,
            selectedValue: a,
            onSelectedValueChange: p,
            defaultInputValue: d,
            inputValue: u,
            open: c,
            defaultOpen: r = !1,
            selectionMode: l = 'none',
            onItemHighlighted: b,
            name: h,
            form: g,
            disabled: C = !1,
            readOnly: S = !1,
            required: m = !1,
            inputRef: F,
            grid: I = !1,
            items: o,
            filteredItems: A,
            filter: T,
            openOnInputClick: E = !0,
            autoHighlight: V = !1,
            keepHighlight: P = !1,
            highlightItemOnHover: w = !0,
            loopFocus: N = !0,
            itemToStringLabel: _,
            itemToStringValue: M,
            isItemEqualToValue: B = wo,
            virtualized: q = !1,
            inline: Q = !1,
            fillInputOnItemPress: Y = !0,
            modal: te = !1,
            limit: U = -1,
            autoComplete: J = 'list',
            formAutoComplete: ne,
            locale: Fe,
            submitOnItemClick: be = !1,
        } = t,
        { clearErrors: We } = To(),
        {
            setDirty: G,
            validityData: re,
            setFilled: Ne,
            name: Ot,
            disabled: vt,
            setTouched: _t,
            setFocused: Mt,
            validationMode: Lt,
            validation: Me,
        } = pn(),
        Dt = kn(),
        Ce = ko({ id: e }),
        Le = fi({ locale: Fe }),
        [we, De] = f.useState(!1),
        [at, Je] = f.useState(null),
        ct = f.useRef([]),
        ut = f.useRef([]),
        dt = f.useRef(null),
        le = f.useRef(null),
        Ut = f.useRef(null),
        j = f.useRef(null),
        H = f.useRef(null),
        ie = f.useRef(!0),
        he = f.useRef(!1),
        Te = f.useRef(null),
        Se = f.useRef(null),
        K = f.useRef(null),
        $ = f.useRef(Ze),
        ae = f.useRef(null),
        Ie = f.useRef([]),
        et = f.useRef([]),
        ve = vt || C,
        Ue = Ot ?? h,
        ce = l === 'multiple',
        ye = l === 'single',
        tt = u !== void 0 || d !== void 0,
        He = o !== void 0,
        Ht = A !== void 0;
    let ue;
    V === 'always' ? (ue = 'always') : (ue = V ? 'input-change' : !1);
    const [L, ds] = sn({ controlled: a, default: ce ? (i ?? Ft) : i, name: 'Combobox', state: 'selectedValue' }),
        yt = f.useMemo(
            () => (T === null ? () => !0 : T !== void 0 ? T : ye && !we ? ui(Le, _, L) : ci(Le, _)),
            [T, ye, L, we, Le, _]
        ),
        In = Rn(() => (tt ? (d ?? '') : ye ? me(L, _) : '')).current,
        [xe, fs] = sn({ controlled: u, default: In, name: 'Combobox', state: 'inputValue' }),
        [Z, ms] = sn({ controlled: c, default: r, name: 'Combobox', state: 'open' }),
        ze = Oo(o),
        de = at ?? (xe === '' ? '' : String(xe).trim()),
        zt = ye ? me(L, _) : '',
        vn = ye && !we && de !== '' && zt !== '' && zt.length === de.length && Le.contains(zt, de),
        ft = vn ? '' : de,
        yn = He && Ht && vn,
        nt = f.useMemo(() => (o ? (ze ? o.flatMap((x) => x.items) : o) : Ft), [o, ze]),
        mt = f.useMemo(() => {
            if (A && !yn) return A;
            if (!o) return Ft;
            if (ze) {
                const R = o,
                    D = [];
                let z = 0;
                for (const se of R) {
                    if (U > -1 && z >= U) break;
                    const X = ft === '' ? se.items : se.items.filter((xt) => yt(xt, ft, _));
                    if (X.length === 0) continue;
                    const fe = U > -1 ? U - z : 1 / 0,
                        Oe = X.slice(0, fe);
                    if (Oe.length > 0) {
                        const xt = { ...se, items: Oe };
                        (D.push(xt), (z += Oe.length));
                    }
                }
                return D;
            }
            if (ft === '') return U > -1 ? nt.slice(0, U) : nt;
            const x = [];
            for (const R of nt) {
                if (U > -1 && x.length >= U) break;
                yt(R, ft, _) && x.push(R);
            }
            return x;
        }, [A, yn, o, ze, ft, U, yt, _, nt]),
        je = f.useMemo(() => (ze ? mt.flatMap((R) => R.items) : mt), [mt, ze]),
        O = Rn(
            () =>
                new Os({
                    id: Ce,
                    labelId: void 0,
                    selectedValue: L,
                    open: Z,
                    filter: yt,
                    query: de,
                    items: o,
                    selectionMode: l,
                    listRef: ct,
                    labelsRef: ut,
                    popupRef: dt,
                    emptyRef: H,
                    inputRef: le,
                    startDismissRef: Ut,
                    endDismissRef: j,
                    keyboardActiveRef: ie,
                    chipsContainerRef: Te,
                    clearRef: Se,
                    valuesRef: Ie,
                    allValuesRef: et,
                    selectionEventRef: K,
                    name: Ue,
                    form: g,
                    disabled: ve,
                    readOnly: S,
                    required: m,
                    grid: I,
                    isGrouped: ze,
                    virtualized: q,
                    openOnInputClick: E,
                    itemToStringLabel: _,
                    isItemEqualToValue: B,
                    modal: te,
                    autoHighlight: ue,
                    submitOnItemClick: be,
                    hasInputValue: tt,
                    mounted: !1,
                    forceMounted: !1,
                    transitionStatus: 'idle',
                    inline: Q,
                    activeIndex: null,
                    selectedIndex: null,
                    popupProps: {},
                    inputProps: {},
                    triggerProps: {},
                    itemProps: An,
                    positionerElement: null,
                    listElement: null,
                    popupId: void 0,
                    triggerElement: null,
                    inputElement: null,
                    inputGroupElement: null,
                    popupSide: null,
                    openMethod: null,
                    inputInsidePopup: !0,
                    inputOwnsFormValue: l === 'none',
                    onOpenChangeComplete: s || Be,
                    setOpen: Be,
                    setInputValue: Be,
                    setSelectedValue: Be,
                    setIndices: Be,
                    onItemHighlighted: Be,
                    handleSelection: Be,
                    forceMount: Be,
                    requestSubmit: Be,
                })
        ).current,
        st = l === 'none' ? xe : L,
        ps = f.useMemo(() => (l === 'none' ? st : Array.isArray(L) ? L.map((x) => bt(x, M)) : bt(L, M)), [st, M, l, L]),
        Bt = oe(b),
        Gt = oe(s),
        Ct = v(O, y.activeIndex),
        hs = v(O, y.selectedIndex),
        St = v(O, y.positionerElement),
        Cn = v(O, y.listElement),
        pt = v(O, y.triggerElement),
        jt = v(O, y.inputElement),
        xs = v(O, y.inputGroupElement),
        ge = v(O, y.inline),
        ke = v(O, y.inputInsidePopup),
        gs = v(O, y.inputOwnsFormValue),
        bs = _s(pt),
        { mounted: Sn, setMounted: Is, transitionStatus: $t } = On(Z),
        { openMethod: jn, triggerProps: qt } = Wo(Z),
        vs = oe(() => ps);
    _o(ke ? bs : le, Ce, st, vs, !ve, h);
    const Et = oe(() => {
            o ? (ut.current = je.map((x) => me(x, _))) : O.set('forceMounted', !0);
        }),
        ys = f.useRef(L);
    Ae(() => {
        L !== ys.current && Et();
    }, [Et, L]);
    const Ee = oe((x) => {
            O.update(x);
            const R = x.type || 'none';
            if (x.activeIndex !== void 0)
                if (x.activeIndex === null)
                    $.current !== Ze && (($.current = Ze), Bt(void 0, gt(R, void 0, { index: -1 })));
                else {
                    const D = Ie.current[x.activeIndex];
                    (($.current = { value: D, index: x.activeIndex }), Bt(D, gt(R, void 0, { index: x.activeIndex })));
                }
        }),
        Re = oe((x, R) => {
            if (((he.current = R.reason === Ge), t.onInputValueChange?.(x, R), !R.isCanceled)) {
                if (R.reason === it) {
                    const D = R.event,
                        z = D.inputType;
                    if (D.type === 'compositionend' || (z != null && z !== '' && z !== 'insertReplacementText')) {
                        const X = x.trim() !== '';
                        (X && De(!0),
                            (ae.current = { hasQuery: X }),
                            X && ue && O.state.activeIndex == null && O.set('activeIndex', 0));
                    }
                }
                fs(x);
            }
        }),
        ht = oe((x, R) => {
            if (
                Z !== x &&
                (R.reason === 'escape-key' &&
                    He &&
                    je.length === 0 &&
                    !O.state.emptyRef.current &&
                    R.allowPropagation(),
                t.onOpenChange?.(x, R),
                !R.isCanceled &&
                    (x && ce && ke && !ge && at !== null && (De(!1), Je(null), xe !== '' && Re('', W(Ge, R.event))),
                    !x &&
                        we &&
                        (ye
                            ? (ge || Je(de), de === '' && De(!1))
                            : ce &&
                              (ge || Je(de), ke && Ee({ activeIndex: null }), (!ke || ge) && Re('', W(Ge, R.event)))),
                    ms(x),
                    !x && ke && (R.reason === Ms || R.reason === Ls) && (_t(!0), Mt(!1), Lt === 'onBlur')))
            ) {
                const D = l === 'none' ? xe : L;
                Me.commit(D);
            }
        }),
        Rt = oe((x, R) => {
            if ((p?.(x, R), R.isCanceled)) return;
            (ds(x),
                ((l === 'none' && dt.current && Y) || (ye && !O.state.inputInsidePopup)) &&
                    Re(me(x, _), W(R.reason, R.event)),
                ye && x != null && R.reason !== it && we && !ge && Je(de));
        }),
        Cs = oe((x, R) => {
            let D = R;
            if (D === void 0) {
                if (Ct === null) return;
                D = Ie.current[Ct];
            }
            const z = Tt(x),
                se = K.current ?? x;
            K.current = null;
            const X = W(Ds, se),
                fe = z?.closest('a')?.getAttribute('href');
            if (fe) {
                fe.startsWith('#') && ht(!1, X);
                return;
            }
            if (ce) {
                const Oe = Array.isArray(L) ? L : [],
                    tn = Mo(Oe, D, O.state.isItemEqualToValue) ? Lo(Oe, D, O.state.isItemEqualToValue) : [...Oe, D];
                if ((Rt(tn, X), X.isCanceled || !(le.current ? le.current.value.trim() !== '' : !1))) return;
                O.state.inputInsidePopup ? Re('', W(Ge, X.event)) : ht(!1, X);
            } else {
                if ((Rt(D, X), X.isCanceled)) return;
                ht(!1, X);
            }
        }),
        Wt = oe(() => {
            if (!O.state.submitOnItemClick) return;
            const x = Me.inputRef.current?.form ?? O.state.inputElement?.form;
            x && typeof x.requestSubmit == 'function' && x.requestSubmit();
        }),
        Kt = oe(() => {
            if (
                (Is(!1),
                Gt?.(!1),
                De(!1),
                Je(null),
                Ee(l === 'none' ? { activeIndex: null, selectedIndex: null } : { activeIndex: null }),
                ce && le.current && le.current.value !== '' && !he.current && Re('', W(Ge)),
                ye)
            )
                if (O.state.inputInsidePopup) le.current && le.current.value !== '' && Re('', W(Ge));
                else {
                    const x = me(L, _);
                    le.current && le.current.value !== x && Re(x, W(x === '' ? Ge : _e));
                }
        }),
        Ss = f.useMemo(() => (ge && St ? { current: St.closest('[role="dialog"]') } : dt), [ge, St]);
    (fn({
        enabled: !t.actionsRef,
        open: Z,
        ref: Ss,
        onComplete() {
            Z || Kt();
        },
    }),
        f.useImperativeHandle(t.actionsRef, () => ({ unmount: Kt }), [Kt]),
        Ae(
            function () {
                if (Z || l === 'none') return;
                const R = o ? nt : et.current;
                if (ce) {
                    const D = Array.isArray(L) ? L : [],
                        z = D[D.length - 1],
                        se = dn(R, z, B);
                    Ee({ selectedIndex: se === -1 ? null : se });
                } else {
                    const D = dn(R, L, B);
                    Ee({ selectedIndex: D === -1 ? null : D });
                }
            },
            [Z, L, o, l, nt, ce, B, Ee]
        ),
        Ae(() => {
            o && ((Ie.current = je), (ct.current.length = je.length));
        }, [o, je]),
        Ae(() => {
            const x = ae.current;
            if (
                (x &&
                    (x.hasQuery ? ue && O.set('activeIndex', 0) : ue === 'always' && O.set('activeIndex', 0),
                    (ae.current = null)),
                !Z && !ge)
            )
                return;
            const D = He || Ht ? je : Ie.current,
                z = O.state.activeIndex;
            if (z == null) {
                if (ue === 'always' && D.length > 0) {
                    O.set('activeIndex', 0);
                    return;
                }
                $.current !== Ze &&
                    (($.current = Ze), O.state.onItemHighlighted(void 0, gt(_e, void 0, { index: -1 })));
                return;
            }
            if (z >= D.length) {
                ($.current !== Ze &&
                    (($.current = Ze), O.state.onItemHighlighted(void 0, gt(_e, void 0, { index: -1 }))),
                    O.set('activeIndex', null));
                return;
            }
            const se = D[z],
                X = $.current.value,
                fe = X !== ns && It(se, X, O.state.isItemEqualToValue);
            ($.current.index !== z || !fe) &&
                (($.current = { value: se, index: z }), O.state.onItemHighlighted(se, gt(_e, void 0, { index: z })));
        }, [Ct, ue, Ht, He, je, ge, Z, O]),
        Ae(() => {
            if (l === 'none') {
                Ne(String(xe) !== '');
                return;
            }
            Ne(ce ? Array.isArray(L) && L.length > 0 : L != null);
        }, [Ne, l, xe, L, ce]),
        f.useEffect(() => {
            He && ue && je.length === 0 && Ee({ activeIndex: null });
        }, [He, ue, je.length, Ee]));
    function js(x) {
        const R = re.initialValue;
        return Array.isArray(x) && Array.isArray(R) ? !Do(x, R, (D, z) => It(D, z, B)) : x !== R;
    }
    (Nt(de, () => {
        !Z || de === '' || de === String(In) || De(!0);
    }),
        Nt(L, () => {
            if (l !== 'none' && (We(Ue), G(js(L)), Me.change(L), ye && !tt && !ke)) {
                const x = me(L, _);
                xe !== x && Re(x, W(_e));
            }
        }),
        Nt(xe, () => {
            l === 'none' && (We(Ue), G(xe !== re.initialValue), Me.change(xe));
        }),
        Nt(o, () => {
            if (!ye || tt || ke || we) return;
            const x = me(L, _);
            xe !== x && Re(x, W(_e));
        }));
    const At = Us({ open: ge ? !0 : Z, onOpenChange: ht, elements: { reference: ke ? pt : jt, floating: St } });
    let Qt, Yt;
    ge || ((Qt = I ? 'grid' : 'listbox'), (Yt = Z ? 'true' : 'false'));
    const Pt = f.useMemo(() => {
            const x = jt?.tagName === 'INPUT',
                R = jt == null || x,
                D = R || Z,
                z = R ? { autoComplete: 'off', spellCheck: 'false', autoCorrect: 'off', autoCapitalize: 'none' } : {};
            return (
                D &&
                    ((z.role = 'combobox'),
                    (z['aria-expanded'] = Yt),
                    (z['aria-haspopup'] = Qt),
                    (z['aria-controls'] = Z ? Cn?.id : void 0),
                    (z['aria-autocomplete'] = J)),
                { reference: z, floating: { role: 'presentation' } }
            );
        }, [jt, Z, Yt, Qt, Cn?.id, J]),
        En = Hs(At, {
            enabled: !S && !ve && E,
            event: 'mousedown-only',
            toggle: !1,
            touchOpenDelay: ke ? 0 : 100,
            reason: _n,
        }),
        Vt = zs(At, {
            enabled: !S && !ve && !ge,
            outsidePressEvent: { mouse: 'sloppy', touch: 'intentional' },
            bubbles: ge ? !0 : void 0,
            outsidePress(x) {
                const R = Tt(x);
                return !rt(pt, R) && !rt(Se.current, R) && !rt(Te.current, R) && !rt(xs, R);
            },
        }),
        ot = Bs(At, {
            enabled: !S && !ve,
            id: Ce,
            listRef: ct,
            activeIndex: Ct,
            selectedIndex: hs,
            virtual: !0,
            loopFocus: N,
            allowEscape: N && !ue,
            focusItemOnOpen: we || (l === 'none' && !ue) ? !1 : 'auto',
            focusItemOnHover: w,
            resetOnPointerLeave: !P,
            orientation: I ? 'horizontal' : void 0,
            rtl: Dt === 'rtl',
            disabledIndices: Ft,
            grid: I ? ii : void 0,
            onNavigate(x, R) {
                (!R && !Z) ||
                    $t === 'ending' ||
                    Ee(R ? { activeIndex: x, type: ie.current ? 'keyboard' : 'pointer' } : { activeIndex: x });
            },
        }),
        Xt = f.useMemo(
            () =>
                un(
                    ot.reference,
                    {
                        onKeyDown(x) {
                            I &&
                                O.state.activeIndex == null &&
                                (x.key === 'ArrowLeft' || x.key === 'ArrowRight') &&
                                x.preventBaseUIHandler();
                        },
                    },
                    Vt.reference,
                    En.reference,
                    Pt.reference
                ),
            [ot.reference, Vt.reference, En.reference, Pt.reference, I, O]
        ),
        Jt = f.useMemo(() => un(Gs, ot.floating, Vt.floating, Pt.floating), [ot.floating, Vt.floating, Pt.floating]),
        Zt = f.useMemo(() => {
            const x = ot.item;
            return x ? { ...x, onFocus: void 0 } : An;
        }, [ot.item]);
    ($s(() => {
        O.update({
            inline: Q,
            popupProps: Jt,
            inputProps: Xt,
            triggerProps: qt,
            itemProps: Zt,
            setOpen: ht,
            setInputValue: Re,
            setSelectedValue: Rt,
            setIndices: Ee,
            onItemHighlighted: Bt,
            handleSelection: Cs,
            forceMount: Et,
            requestSubmit: Wt,
        });
    }),
        Ae(() => {
            O.update({
                id: Ce,
                selectedValue: L,
                open: Z,
                mounted: Sn,
                transitionStatus: $t,
                items: o,
                inline: Q,
                popupProps: Jt,
                inputProps: Xt,
                triggerProps: qt,
                openMethod: jn,
                itemProps: Zt,
                selectionMode: l,
                name: Ue,
                form: g,
                disabled: ve,
                readOnly: S,
                required: m,
                grid: I,
                isGrouped: ze,
                virtualized: q,
                onOpenChangeComplete: Gt,
                openOnInputClick: E,
                itemToStringLabel: _,
                modal: te,
                autoHighlight: ue,
                isItemEqualToValue: B,
                submitOnItemClick: be,
                hasInputValue: tt,
                requestSubmit: Wt,
                inputOwnsFormValue: l === 'none' && (Q || !O.state.inputInsidePopup),
            });
        }, [
            O,
            Ce,
            L,
            Z,
            Sn,
            $t,
            o,
            Jt,
            Xt,
            Zt,
            jn,
            qt,
            l,
            Ue,
            ve,
            S,
            m,
            Me,
            I,
            ze,
            q,
            Gt,
            E,
            _,
            te,
            B,
            be,
            tt,
            Q,
            Wt,
            ue,
            g,
        ]));
    const Es = Mn(F, Me.inputRef),
        Rs = f.useMemo(() => ({ query: de, hasItems: He, filteredItems: mt, flatFilteredItems: je }), [de, He, mt, je]),
        As = f.useMemo(() => (Array.isArray(st) ? '' : bt(st, M)), [st, M]),
        Ps = ce && Array.isArray(L) && L.length > 0,
        en = ce || (l === 'none' && gs) ? void 0 : Ue,
        Vs = f.useMemo(
            () =>
                !ce || !Array.isArray(L) || !Ue
                    ? null
                    : L.map((x) => {
                          const R = bt(x, M);
                          return n.jsx('input', { type: 'hidden', form: g, name: Ue, value: R, disabled: ve }, R);
                      }),
            [ce, L, g, Ue, M, ve]
        ),
        Fs = n.jsxs(f.Fragment, {
            children: [
                t.children,
                n.jsx('input', {
                    ...Me.getValidationProps(ve, {
                        onFocus() {
                            if (ke) {
                                pt?.focus();
                                return;
                            }
                            (le.current || pt)?.focus();
                        },
                        onChange(x) {
                            if (x.nativeEvent.defaultPrevented || ve || S) return;
                            const R = x.currentTarget.value,
                                D = R.toLowerCase(),
                                z = W(_e, x.nativeEvent),
                                se = () =>
                                    Ie.current.findIndex(
                                        (fe) => bt(fe, M).toLowerCase() === D || me(fe, _).toLowerCase() === D
                                    );
                            function X() {
                                if (ce) return;
                                if (l === 'none') {
                                    Re(R, z);
                                    return;
                                }
                                let fe = se();
                                fe === -1 &&
                                    (fe = Ie.current.findIndex((xt, tn) => {
                                        const nn = ut.current[tn];
                                        return nn != null && nn.toLowerCase() === D;
                                    }));
                                const Oe = fe === -1 ? void 0 : Ie.current[fe];
                                Oe != null && Rt?.(Oe, z);
                            }
                            (ye && (Et(), o && se() === -1 && O.set('forceMounted', !0)), queueMicrotask(X));
                        },
                    }),
                    id: Ce && en == null ? `${Ce}-hidden-input` : void 0,
                    form: g,
                    name: en,
                    autoComplete: ne,
                    disabled: ve,
                    required: m && !Ps,
                    readOnly: S,
                    value: As,
                    ref: Es,
                    style: en ? Ln : qs,
                    tabIndex: -1,
                    'aria-hidden': !0,
                    suppressHydrationWarning: !0,
                }),
                Vs,
            ],
        });
    return n.jsx(Yn.Provider, {
        value: O,
        children: n.jsx(Xn.Provider, {
            value: At,
            children: n.jsx(Zn.Provider, {
                value: He,
                children: n.jsx(Jn.Provider, { value: Rs, children: n.jsx(es.Provider, { value: xe, children: Fs }) }),
            }),
        }),
    });
}
function pi(t) {
    const { multiple: e = !1, defaultValue: s, value: i, onValueChange: a, autoComplete: p, ...d } = t;
    return n.jsx(mi, {
        ...d,
        selectionMode: e ? 'multiple' : 'single',
        selectedValue: i,
        defaultSelectedValue: s,
        onSelectedValueChange: a,
        formAutoComplete: p,
    });
}
const ss = {
        ...Ws,
        ...Uo,
        popupSide: (t) => (t ? { 'data-popup-side': t } : null),
        listEmpty: (t) => (t ? { 'data-list-empty': '' } : null),
    },
    hi = f.createContext(void 0);
function xi() {
    return f.useContext(hi);
}
const os = f.createContext(void 0);
function bn(t) {
    const e = f.useContext(os);
    if (e === void 0 && !t) throw new Error(lt(21));
    return e;
}
const is = f.forwardRef(function (e, s) {
        const i = Ve(),
            { buttonRef: a, getButtonProps: p } = Dn({ native: !1 }),
            d = Mn(s, a);
        function u(r) {
            i.state.setOpen(!1, W(Ks, r.nativeEvent, r.currentTarget));
        }
        const c = p({ onClick: u });
        return n.jsx('span', { ref: d, ...c, 'aria-label': 'Dismiss', tabIndex: void 0, style: Ln });
    }),
    gi = f.forwardRef(function (e, s) {
        const { render: i, className: a, disabled: p = !1, id: d, style: u, ...c } = e,
            { state: r, disabled: l, setTouched: b, setFocused: h, validationMode: g, validation: C } = pn(),
            { labelId: S } = Ho(),
            m = xi(),
            I = !!bn(!0),
            o = Ve(),
            { filteredItems: A } = Xe(),
            T = ri(),
            E = kn(),
            V = v(o, y.required),
            P = v(o, y.disabled),
            w = v(o, y.readOnly),
            N = v(o, y.name),
            _ = v(o, y.form),
            M = v(o, y.selectionMode),
            B = v(o, y.autoHighlight),
            q = v(o, y.inputProps),
            Q = v(o, y.triggerProps),
            Y = v(o, y.open),
            te = v(o, y.mounted),
            U = v(o, y.selectedValue),
            J = v(o, y.popupSide),
            ne = v(o, y.positionerElement),
            Fe = v(o, y.id),
            be = v(o, y.inline),
            We = v(o, y.modal),
            G = !!B,
            re = te && ne ? J : null,
            Ne = l || P || p,
            Ot = A.length === 0,
            vt = I || be,
            _t = !vt || We,
            Mt = Qs(d ?? (vt ? void 0 : Fe)),
            Lt = $o(S, void 0),
            Me = I ? zo : r,
            [Dt, Ce] = f.useState(null),
            Le = f.useRef(!1),
            we = f.useRef(null),
            De = f.useRef(!1),
            at = M === 'none' && !I,
            Je = oe((j) => {
                const H = I || o.state.inline;
                (H && !o.state.hasInputValue && o.state.setInputValue('', W(_e)),
                    o.update({ inputElement: j, inputInsidePopup: H, inputOwnsFormValue: at }));
            }),
            ct = I || !C ? c : C.getValidationProps(Ne, c),
            ut = { ...Me, open: Y, disabled: Ne, readOnly: w, popupSide: re, listEmpty: Ot };
        function dt(j) {
            if (!m) return;
            let H;
            const { highlightedChipIndex: ie } = m,
                he = m.chipsRef.current.length,
                Te = E === 'rtl',
                Se = Te ? 'ArrowRight' : 'ArrowLeft',
                K = Te ? 'ArrowLeft' : 'ArrowRight';
            if (ie !== void 0) {
                if (j.key === Se) (j.preventDefault(), ie > 0 ? (H = ie - 1) : (H = void 0));
                else if (j.key === K) (j.preventDefault(), ie < he - 1 ? (H = ie + 1) : (H = void 0));
                else if (j.key === 'Backspace' || j.key === 'Delete') {
                    j.preventDefault();
                    const $ = ie >= U.length - 1 ? U.length - 2 : ie;
                    ((H = $ >= 0 ? $ : void 0),
                        o.state.setIndices({ activeIndex: null, selectedIndex: null, type: 'keyboard' }));
                }
                return H;
            }
            return (
                j.key === Se && (j.currentTarget.selectionStart ?? 0) === 0 && U.length > 0
                    ? (j.preventDefault(), (H = he > 0 ? he - 1 : void 0))
                    : j.key === 'Backspace' &&
                      j.currentTarget.value === '' &&
                      U.length > 0 &&
                      (o.state.setIndices({ activeIndex: null, selectedIndex: null, type: 'keyboard' }),
                      j.preventDefault()),
                H
            );
        }
        const le = Qe('input', e, {
                state: ut,
                ref: [s, o.state.inputRef, Je],
                props: [
                    q,
                    Q,
                    {
                        type: 'text',
                        value: e.value ?? Dt ?? T,
                        'aria-readonly': w || void 0,
                        'aria-required': V || void 0,
                        'aria-labelledby': Lt,
                        disabled: Ne,
                        readOnly: w,
                        required: M === 'none' ? V : void 0,
                        form: _,
                        ...(at && N && { name: N }),
                        id: Mt,
                        onFocus() {
                            if ((h(!0), !be || !De.current)) return;
                            De.current = !1;
                            const j = we.current;
                            j == null ||
                                !Object.hasOwn(o.state.valuesRef.current, j) ||
                                o.state.setIndices({ activeIndex: j });
                        },
                        onBlur() {
                            (b(!0), h(!1));
                            const j = o.state.activeIndex;
                            if (
                                (be &&
                                    j !== null &&
                                    B !== 'always' &&
                                    ((we.current = j), (De.current = !0), o.state.setIndices({ activeIndex: null })),
                                g === 'onBlur')
                            ) {
                                const H = M === 'none' ? T : U;
                                C.commit(H);
                            }
                        },
                        onCompositionStart(j) {
                            Xs || ((Le.current = !0), Ce(j.currentTarget.value));
                        },
                        onCompositionEnd(j) {
                            Le.current = !1;
                            const H = j.currentTarget.value;
                            (Ce(null), o.state.setInputValue(H, W(it, j.nativeEvent)));
                        },
                        onChange(j) {
                            const H = j.nativeEvent.inputType,
                                ie = !H || H === 'insertReplacementText',
                                he = Le.current || !ie;
                            if (Le.current) {
                                const ae = j.currentTarget.value;
                                (Ce(ae),
                                    ae === '' &&
                                        !o.state.openOnInputClick &&
                                        !o.state.inputInsidePopup &&
                                        o.state.setOpen(!1, W(Ge, j.nativeEvent)));
                                const Ie = ae.trim(),
                                    et = G && Ie !== '';
                                (!w &&
                                    !Ne &&
                                    Ie &&
                                    he &&
                                    (o.state.setOpen(!0, W(it, j.nativeEvent)),
                                    G ||
                                        o.state.setIndices({
                                            activeIndex: null,
                                            selectedIndex: null,
                                            type: o.state.keyboardActiveRef.current ? 'keyboard' : 'pointer',
                                        })),
                                    Y &&
                                        o.state.activeIndex !== null &&
                                        !et &&
                                        o.state.setIndices({
                                            activeIndex: null,
                                            selectedIndex: null,
                                            type: o.state.keyboardActiveRef.current ? 'keyboard' : 'pointer',
                                        }));
                                return;
                            }
                            const Te = W(it, j.nativeEvent);
                            if ((o.state.setInputValue(j.currentTarget.value, Te), Te.isCanceled)) return;
                            const Se = j.currentTarget.value === '',
                                K = W(Ge, j.nativeEvent);
                            Se &&
                                !o.state.inputInsidePopup &&
                                (M === 'single' && o.state.setSelectedValue(null, K),
                                o.state.openOnInputClick || o.state.setOpen(!1, K));
                            const $ = j.currentTarget.value.trim();
                            (!w &&
                                !Ne &&
                                $ &&
                                he &&
                                (o.state.setOpen(!0, W(it, j.nativeEvent)),
                                G ||
                                    o.state.setIndices({
                                        activeIndex: null,
                                        selectedIndex: null,
                                        type: o.state.keyboardActiveRef.current ? 'keyboard' : 'pointer',
                                    })),
                                Y &&
                                    o.state.activeIndex !== null &&
                                    !G &&
                                    o.state.setIndices({
                                        activeIndex: null,
                                        selectedIndex: null,
                                        type: o.state.keyboardActiveRef.current ? 'keyboard' : 'pointer',
                                    }));
                        },
                        onKeyDown(j) {
                            if (Ne || w || j.ctrlKey || j.shiftKey || j.altKey || j.metaKey) return;
                            o.state.keyboardActiveRef.current = !0;
                            const H = j.currentTarget,
                                ie = H.scrollWidth - H.clientWidth,
                                he = E === 'rtl';
                            if (j.key === 'Home') {
                                wt(j);
                                const K = Pn && he ? H.value.length : 0;
                                (H.setSelectionRange(K, K), (H.scrollLeft = 0));
                                return;
                            }
                            if (j.key === 'End') {
                                wt(j);
                                const K = Pn && he ? 0 : H.value.length;
                                (H.setSelectionRange(K, K), (H.scrollLeft = he ? -ie : ie));
                                return;
                            }
                            if (!te && j.key === 'Escape') {
                                const K = M === 'multiple' && Array.isArray(U) ? U.length === 0 : U === null,
                                    $ = W(Ys, j.nativeEvent),
                                    ae = M === 'multiple' ? [] : null;
                                (o.state.setInputValue('', $),
                                    o.state.setSelectedValue(ae, $),
                                    !K && !o.state.inline && !$.isPropagationAllowed && j.stopPropagation());
                                return;
                            }
                            if (
                                m &&
                                j.key === 'Backspace' &&
                                H.value === '' &&
                                m.highlightedChipIndex === void 0 &&
                                Array.isArray(U) &&
                                U.length > 0
                            ) {
                                const K = m.chipsRef.current.length,
                                    $ = K > 0 ? K - 1 : U.length - 1,
                                    ae = U.filter((Ie, et) => et !== $);
                                (o.state.setIndices({
                                    activeIndex: null,
                                    selectedIndex: null,
                                    type: o.state.keyboardActiveRef.current ? 'keyboard' : 'pointer',
                                }),
                                    o.state.setSelectedValue(ae, W(_e, j.nativeEvent)));
                                return;
                            }
                            const Te = m?.highlightedChipIndex !== void 0,
                                Se = dt(j);
                            if (
                                (m?.setHighlightedChipIndex(Se),
                                Se !== void 0
                                    ? m?.chipsRef.current[Se]?.focus()
                                    : Te && o.state.inputRef.current?.focus(),
                                j.which !== 229 && j.key === 'Enter' && Y)
                            ) {
                                const K = o.state.activeIndex,
                                    $ = j.nativeEvent;
                                if (K === null) {
                                    if (be) return;
                                    o.state.setOpen(!1, W(_e, $));
                                    return;
                                }
                                wt(j);
                                const ae = o.state.listRef.current[K];
                                ae &&
                                    ((o.state.selectionEventRef.current = $),
                                    ae.click(),
                                    (o.state.selectionEventRef.current = null));
                            }
                        },
                        onPointerMove() {
                            o.state.keyboardActiveRef.current = !1;
                        },
                        onPointerDown() {
                            o.state.keyboardActiveRef.current = !1;
                        },
                    },
                    ct,
                ],
                stateAttributesMapping: ss,
            }),
            Ut = I ? n.jsx(Bo.Provider, { value: Go, children: le }) : le;
        return n.jsxs(f.Fragment, { children: [Y && _t && n.jsx(is, { ref: o.state.startDismissRef }), Ut] });
    });
function bi(t, e, s, i, a) {
    if (t.baseUIHandlerPrevented || i) return;
    const p = Tt(t.nativeEvent),
        d = Js(p) ? p : null;
    (d !== t.currentTarget && (a?.(d) || Zs(d))) ||
        (t.preventDefault(),
        !s &&
            (e.state.inputRef.current?.focus(), e.state.openOnInputClick && e.state.setOpen(!0, W(_n, t.nativeEvent))));
}
const Ii = f.forwardRef(function (e, s) {
        const { render: i, className: a, style: p, ...d } = e,
            { state: u } = pn(),
            c = Ve(),
            { filteredItems: r } = Xe(),
            l = v(c, y.open),
            b = v(c, y.mounted),
            h = v(c, y.popupSide),
            g = v(c, y.positionerElement),
            C = v(c, y.disabled),
            S = v(c, y.readOnly),
            m = v(c, y.hasSelectedValue),
            F = v(c, y.selectionMode),
            I = b && g ? h : null,
            o = C,
            A = r.length === 0,
            E = {
                ...u,
                open: l,
                disabled: o,
                readOnly: S,
                popupSide: I,
                listEmpty: A,
                placeholder: F === 'none' ? !1 : !m,
            },
            V = oe((P) => {
                c.set('inputGroupElement', P);
            });
        return Qe('div', e, {
            ref: [s, V],
            props: [
                {
                    role: 'group',
                    onMouseDown(P) {
                        bi(P, c, o, S, (w) => rt(c.state.chipsContainerRef.current, w));
                    },
                },
                d,
            ],
            state: E,
            stateAttributesMapping: ss,
        });
    }),
    vi = f.createContext(null);
function yi() {
    return f.useContext(vi);
}
function Ci(t) {
    const { children: e } = t,
        { filteredItems: s } = Xe(),
        i = yi(),
        a = i ? i.items : s;
    return a ? n.jsx(f.Fragment, { children: a.map(e) }) : null;
}
const Si = f.forwardRef(function (e, s) {
        var i;
        const { render: a, className: p, style: d, children: u, ...c } = e,
            r = Ve(),
            l = gn(),
            b = !!bn(!0),
            { filteredItems: h, hasItems: g } = Xe(),
            C = v(r, y.selectionMode),
            S = v(r, y.grid),
            m = v(r, y.popupProps),
            F = v(r, y.virtualized),
            I = v(r, y.forceMounted),
            o = C === 'multiple',
            A = h.length === 0,
            T = oe((M) => {
                r.set('positionerElement', M);
            }),
            E = oe((M) => {
                r.set('listElement', M);
            }),
            V = f.useMemo(() => (typeof u == 'function' ? i || (i = n.jsx(Ci, { children: u })) : u), [u]),
            P = { empty: A },
            w = l.useState('floatingId'),
            N = Qe('div', e, {
                state: P,
                ref: [s, E, b ? null : T],
                props: [
                    m,
                    {
                        children: V,
                        tabIndex: -1,
                        id: w,
                        role: S ? 'grid' : 'listbox',
                        'aria-multiselectable': o ? 'true' : void 0,
                        onKeyDown(M) {
                            if (!(r.state.disabled || r.state.readOnly) && M.key === 'Enter') {
                                const B = r.state.activeIndex;
                                if (B == null) return;
                                wt(M);
                                const q = M.nativeEvent,
                                    Q = r.state.listRef.current[B];
                                Q &&
                                    ((r.state.selectionEventRef.current = q),
                                    Q.click(),
                                    (r.state.selectionEventRef.current = null));
                            }
                        },
                        onKeyDownCapture() {
                            r.state.keyboardActiveRef.current = !0;
                        },
                        onPointerMoveCapture() {
                            r.state.keyboardActiveRef.current = !1;
                        },
                    },
                    c,
                ],
            });
        if (F) return N;
        const _ = g && !I ? void 0 : r.state.labelsRef;
        return n.jsx(Ko, { elementsRef: r.state.listRef, labelsRef: _, children: N });
    }),
    ji = '⁠',
    Ei = 200;
function Ri(t) {
    const e = t.ownerDocument.createTreeWalker(t, NodeFilter.SHOW_TEXT);
    let s = null;
    for (; e.nextNode();) {
        const i = e.currentNode;
        i.nodeValue !== '' && (s = i);
    }
    return s;
}
function Ai() {
    const t = eo(),
        e = f.useRef(null);
    return (
        f.useEffect(() => {
            if (to) return;
            const s = e.current;
            if (s == null) return;
            const i = Ri(s);
            if (i == null) return;
            const a = i.nodeValue ?? '',
                p = `${a}${ji}`;
            return (
                (i.nodeValue = p),
                t.start(Ei, () => {
                    i.nodeValue === p && (i.nodeValue = a);
                }),
                () => {
                    (t.clear(), i.nodeValue === p && (i.nodeValue = a));
                }
            );
        }, [e, t]),
        e
    );
}
const rs = f.createContext(void 0);
function Pi() {
    const t = f.useContext(rs);
    if (t === void 0) throw new Error(lt(20));
    return t;
}
const Vi = f.forwardRef(function (e, s) {
        const { keepMounted: i = !1, ...a } = e,
            p = Ve(),
            d = v(p, y.mounted),
            u = v(p, y.forceMounted);
        return d || i || u ? n.jsx(rs.Provider, { value: i, children: n.jsx(no, { ref: s, ...a }) }) : null;
    }),
    Fi = f.forwardRef(function (e, s) {
        const {
                render: i,
                className: a,
                anchor: p,
                positionMethod: d = 'absolute',
                side: u = 'bottom',
                align: c = 'center',
                sideOffset: r = 0,
                alignOffset: l = 0,
                collisionBoundary: b = 'clipping-ancestors',
                collisionPadding: h = 5,
                arrowPadding: g = 5,
                sticky: C = !1,
                disableAnchorTracking: S = !1,
                collisionAvoidance: m = so,
                style: F,
                ...I
            } = e,
            o = Ve(),
            { filteredItems: A } = Xe(),
            T = gn(),
            E = Pi(),
            V = v(o, y.modal),
            P = v(o, y.open),
            w = v(o, y.mounted),
            N = v(o, y.openMethod),
            _ = v(o, y.positionerElement),
            M = v(o, y.triggerElement),
            B = v(o, y.inputElement),
            q = v(o, y.inputGroupElement),
            Q = v(o, y.inputInsidePopup),
            Y = v(o, y.transitionStatus),
            te = A.length === 0,
            J = oo({
                anchor: p ?? (Q ? M : (q ?? B)),
                floatingRootContext: T,
                positionMethod: d,
                mounted: w,
                side: u,
                sideOffset: r,
                align: c,
                alignOffset: l,
                arrowPadding: g,
                collisionBoundary: b,
                collisionPadding: h,
                sticky: C,
                disableAnchorTracking: S,
                keepMounted: E,
                collisionAvoidance: m,
                lazyFlip: !0,
            });
        Qo(P && V, N === 'touch', _, M);
        const ne = { open: P, side: J.side, align: J.align, anchorHidden: J.anchorHidden, empty: te };
        Ae(() => {
            o.set('popupSide', J.side);
        }, [o, J.side]);
        const Fe = oe((We) => {
                o.set('positionerElement', We);
            }),
            be = io(e, ne, {
                styles: J.positionerStyles,
                transitionStatus: Y,
                props: I,
                refs: [s, Fe],
                hidden: !w,
                inert: !P,
            });
        return n.jsxs(os.Provider, {
            value: J,
            children: [w && V && n.jsx(qo, { inert: ro(!P), cutout: q ?? B ?? M }), be],
        });
    }),
    Ni = { ...lo, ...Un },
    wi = f.forwardRef(function (e, s) {
        const { render: i, className: a, style: p, initialFocus: d, finalFocus: u, ...c } = e,
            r = Ve(),
            l = bn(),
            b = gn(),
            { filteredItems: h } = Xe(),
            g = v(r, y.mounted),
            C = v(r, y.open),
            S = v(r, y.openMethod),
            m = v(r, y.transitionStatus),
            F = v(r, y.inputInsidePopup),
            I = v(r, y.inputElement),
            o = v(r, y.modal),
            A = v(r, y.id),
            T = h.length === 0,
            E = c.id ?? (F ? ai(A) : void 0);
        (Ae(
            () => (
                r.set('popupId', r.state.popupRef.current?.id || E),
                () => {
                    r.set('popupId', void 0);
                }
            ),
            [r, E]
        ),
            fn({
                open: C,
                ref: r.state.popupRef,
                onComplete() {
                    C && r.state.onOpenChangeComplete(!0);
                },
            }));
        const V = {
                open: C,
                side: l.side,
                align: l.align,
                anchorHidden: l.anchorHidden,
                transitionStatus: m,
                empty: T,
            },
            P = Qe('div', e, {
                state: V,
                ref: [s, r.state.popupRef],
                props: [
                    {
                        id: E,
                        role: F ? 'dialog' : 'presentation',
                        tabIndex: -1,
                        onFocus(B) {
                            const q = Tt(B.nativeEvent);
                            S !== 'touch' &&
                                (rt(r.state.listElement, q) || q === B.currentTarget) &&
                                r.state.inputRef.current?.focus();
                        },
                    },
                    ao(m),
                    c,
                ],
                stateAttributesMapping: Ni,
            }),
            N = d === void 0 ? (F ? (B) => (B === 'touch' ? r.state.popupRef.current : I) : !1) : d;
        let _;
        u != null ? (_ = u) : (_ = F ? void 0 : !1);
        const M = !F || o;
        return n.jsx(co, {
            context: b,
            disabled: !g,
            modal: M,
            openInteractionType: S,
            initialFocus: N,
            returnFocus: _,
            getInsideElements: () => [r.state.startDismissRef.current, r.state.endDismissRef.current],
            children: n.jsxs(f.Fragment, { children: [P, M && n.jsx(is, { ref: r.state.endDismissRef })] }),
        });
    }),
    Ti = f.forwardRef(function (e, s) {
        const { render: i, className: a, style: p, ...d } = e;
        return Qe('span', e, { ref: s, props: [{ 'aria-hidden': !0, children: '▼' }, d] });
    }),
    ls = f.createContext(void 0);
function as() {
    const t = f.useContext(ls);
    if (!t) throw new Error(lt(19));
    return t;
}
const ki = f.createContext(!1);
function Oi() {
    return f.useContext(ki);
}
function cs(t) {
    const { componentProps: e, forwardedRef: s, virtualized: i, indexFromFilter: a } = t,
        {
            render: p,
            className: d,
            style: u,
            value: c = null,
            index: r,
            disabled: l = !1,
            nativeButton: b = !1,
            ...h
        } = e,
        g = f.useRef(!1),
        C = f.useRef(null),
        S = Yo({ index: r, textRef: C, indexGuessBehavior: Xo.GuessFromOrder }),
        m = Ve(),
        F = Oi(),
        I = li(),
        o = v(m, y.open),
        A = v(m, y.selectionMode),
        T = v(m, y.readOnly),
        E = v(m, y.isItemEqualToValue),
        V = A !== 'none',
        P = r ?? (i ? (a ?? -1) : S.index),
        w = S.index !== -1,
        N = v(m, y.id),
        _ = v(m, y.isActive, P),
        M = v(m, y.isSelected, c),
        B = v(m, y.itemProps),
        q = f.useRef(null),
        Q = N != null && w ? `${N}-${P}` : void 0,
        Y = M && V;
    (Ae(() => {
        if (!(w && (i || r != null))) return;
        const re = m.state.listRef.current;
        return (
            (re[P] = q.current),
            () => {
                delete re[P];
            }
        );
    }, [w, i, P, r, m]),
        Ae(() => {
            if (!w || I) return;
            const G = m.state.valuesRef.current;
            return (
                (G[P] = c),
                A !== 'none' && m.state.allValuesRef.current.push(c),
                () => {
                    delete G[P];
                }
            );
        }, [w, I, P, c, m, A]),
        Ae(() => {
            if (!o) {
                g.current = !1;
                return;
            }
            if (!w || I) return;
            const G = m.state.selectedValue,
                re = Array.isArray(G) ? G[G.length - 1] : G;
            It(c, re, E) && m.set('selectedIndex', P);
        }, [w, I, o, m, P, c, E]));
    const { getButtonProps: te, buttonRef: U } = Dn({
            disabled: l,
            focusableWhenDisabled: !0,
            native: b,
            composite: !0,
        }),
        J = { disabled: l, selected: Y, highlighted: _ };
    function ne(G) {
        function re() {
            m.state.handleSelection(G, c);
        }
        m.state.submitOnItemClick ? (Ns.flushSync(re), m.state.requestSubmit()) : re();
    }
    const Fe = {
            id: Q,
            role: F ? 'gridcell' : 'option',
            'aria-selected': V ? Y : void 0,
            tabIndex: void 0,
            onPointerDownCapture(G) {
                ((g.current = !0), G.preventDefault());
            },
            onMouseDown(G) {
                G.preventDefault();
            },
            onClick(G) {
                l || T || ne(G.nativeEvent);
            },
            onMouseUp(G) {
                const re = g.current;
                ((g.current = !1), !(l || T || G.button !== 0 || re || !_) && ne(G.nativeEvent));
            },
        },
        be = Qe('div', e, { ref: [U, s, S.ref, q], state: J, props: [B, Fe, h, te] }),
        We = f.useMemo(() => ({ selected: Y, textRef: C }), [Y, C]);
    return n.jsx(ls.Provider, { value: We, children: be });
}
function _i(t) {
    const { componentProps: e, forwardedRef: s } = t,
        i = Ve(),
        a = v(i, y.isItemEqualToValue),
        { flatFilteredItems: p } = Xe(),
        d = dn(p, e.value ?? null, a);
    return n.jsx(cs, { componentProps: e, forwardedRef: s, virtualized: !0, indexFromFilter: d });
}
const Mi = f.memo(
        f.forwardRef(function (e, s) {
            const i = Ve(),
                a = v(i, y.virtualized);
            return a && e.index == null
                ? n.jsx(_i, { componentProps: e, forwardedRef: s })
                : n.jsx(cs, { componentProps: e, forwardedRef: s, virtualized: a, indexFromFilter: void 0 });
        })
    ),
    Li = f.forwardRef(function (e, s) {
        const i = e.keepMounted ?? !1,
            { selected: a } = as();
        return i || a ? n.jsx(Di, { ...e, ref: s }) : null;
    }),
    Di = f.memo(
        f.forwardRef((t, e) => {
            const { render: s, className: i, style: a, keepMounted: p, ...d } = t,
                { selected: u } = as(),
                c = f.useRef(null),
                { transitionStatus: r, setMounted: l } = On(u),
                h = Qe('span', t, {
                    ref: [e, c],
                    state: { selected: u, transitionStatus: r },
                    props: [{ 'aria-hidden': !0, children: '✔️' }, d],
                    stateAttributesMapping: Un,
                });
            return (
                fn({
                    open: u,
                    ref: c,
                    onComplete() {
                        u || l(!1);
                    },
                }),
                h
            );
        })
    ),
    Ui = f.forwardRef(function (e, s) {
        const { render: i, className: a, style: p, children: d, ...u } = e,
            { filteredItems: c } = Xe(),
            r = Ve(),
            l = Ai(),
            b = c.length === 0 ? d : null;
        return Qe('div', e, {
            ref: [s, r.state.emptyRef, l],
            props: [{ children: b, role: 'status', 'aria-live': 'polite', 'aria-atomic': !0 }, u],
        });
    }),
    Hi = 300,
    zi = (t) => t?.label ?? '',
    Bi = (t, e) => t.value === e.value;
function Gi(t) {
    const e = Pe.c(20),
        { value: s, options: i, onChange: a, disabled: p } = t,
        [d, u] = uo('', Hi);
    let c;
    if (e[0] !== i || e[1] !== d) {
        const o = d.trim().toLowerCase();
        ((c = o ? i.filter((A) => A.label.toLowerCase().includes(o)) : i), (e[0] = i), (e[1] = d), (e[2] = c));
    } else c = e[2];
    const r = c;
    let l;
    e[3] !== i || e[4] !== s
        ? ((l = i.find((o) => o.value === s) ?? null), (e[3] = i), (e[4] = s), (e[5] = l))
        : (l = e[5]);
    const b = l;
    let h;
    e[6] !== a
        ? ((h = (o) => {
              a(o ? o.value : qe);
          }),
          (e[6] = a),
          (e[7] = h))
        : (h = e[7]);
    let g;
    e[8] !== u
        ? ((g = (o) => {
              u(o);
          }),
          (e[8] = u),
          (e[9] = g))
        : (g = e[9]);
    let C, S;
    e[10] === Symbol.for('react.memo_cache_sentinel')
        ? ((C = Hn(
              'dark:bg-input/30 border-input focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 flex h-8 w-full max-w-64 items-center gap-2 rounded-lg border bg-transparent px-2.5 py-1 motion-safe:transition-colors'
          )),
          (S = n.jsx(gi, {
              placeholder: 'Search lead…',
              className: 'placeholder:text-muted-foreground w-full min-w-0 bg-transparent text-sm outline-none',
          })),
          (e[10] = C),
          (e[11] = S))
        : ((C = e[10]), (S = e[11]));
    let m;
    e[12] === Symbol.for('react.memo_cache_sentinel')
        ? ((m = n.jsxs(Ii, {
              className: C,
              children: [
                  S,
                  n.jsx(Ti, {
                      className: 'text-muted-foreground shrink-0',
                      children: n.jsx(fo, { className: 'size-3.5' }),
                  }),
              ],
          })),
          (e[12] = m))
        : (m = e[12]);
    let F;
    e[13] === Symbol.for('react.memo_cache_sentinel')
        ? ((F = n.jsx(Vi, {
              children: n.jsx(Fi, {
                  sideOffset: 4,
                  className: 'z-50 outline-none',
                  children: n.jsxs(wi, {
                      className:
                          'bg-popover px-2 py-1.5 text-popover-foreground border-border max-h-[min(24rem,var(--available-height))] min-w-[var(--anchor-width)] overflow-y-auto rounded-lg border p-1 shadow-md outline-none',
                      children: [
                          n.jsx(Ui, { className: 'text-muted-foreground  text-sm', children: 'No users found' }),
                          n.jsx(Si, { children: $i }),
                      ],
                  }),
              }),
          })),
          (e[13] = F))
        : (F = e[13]);
    let I;
    return (
        e[14] !== p || e[15] !== r || e[16] !== b || e[17] !== h || e[18] !== g
            ? ((I = n.jsxs(pi, {
                  items: r,
                  value: b,
                  filter: null,
                  disabled: p,
                  itemToStringLabel: zi,
                  isItemEqualToValue: Bi,
                  onValueChange: h,
                  onInputValueChange: g,
                  children: [m, F],
              })),
              (e[14] = p),
              (e[15] = r),
              (e[16] = b),
              (e[17] = h),
              (e[18] = g),
              (e[19] = I))
            : (I = e[19]),
        I
    );
}
function $i(t) {
    return n.jsxs(
        Mi,
        {
            value: t,
            className:
                'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default select-none items-center gap-2 rounded-md py-1.5 pl-2 pr-8 text-sm outline-none',
            children: [
                t.label,
                n.jsx(Li, {
                    className: 'absolute right-2 flex items-center',
                    children: n.jsx(mo, { className: 'size-4' }),
                }),
            ],
        },
        t.value
    );
}
function qi(t) {
    const e = Pe.c(31),
        { team: s, leadOptions: i } = t;
    let a;
    e[0] === Symbol.for('react.memo_cache_sentinel') ? ((a = po()), (e[0] = a)) : (a = e[0]);
    const { mutate: p } = Ke(a);
    let d;
    e[1] === Symbol.for('react.memo_cache_sentinel') ? ((d = ho()), (e[1] = d)) : (d = e[1]);
    const { mutateAsync: u, isPending: c } = Ke(d);
    let r;
    e[2] === Symbol.for('react.memo_cache_sentinel') ? ((r = xo()), (e[2] = r)) : (r = e[2]);
    const { mutate: l, isPending: b } = Ke(r),
        [h, g] = f.useState(!1),
        [C, S] = f.useState(!1),
        [m, F] = f.useState(s.name);
    let I;
    e[3] !== m || e[4] !== s.id || e[5] !== s.name || e[6] !== u
        ? ((I = async () => {
              const N = m.trim();
              if (!N || N === s.name) {
                  (g(!1), F(s.name));
                  return;
              }
              await u(
                  { id: s.id, name: N },
                  {
                      onSuccess() {
                          (pe.success('Team renamed'), g(!1));
                      },
                      onError(_) {
                          pe.error(_ instanceof Error ? _.message : 'Failed to rename team');
                      },
                  }
              );
          }),
          (e[3] = m),
          (e[4] = s.id),
          (e[5] = s.name),
          (e[6] = u),
          (e[7] = I))
        : (I = e[7]);
    const o = I;
    let A;
    e[8] !== o || e[9] !== h || e[10] !== c || e[11] !== m || e[12] !== s.name
        ? ((A = n.jsx('td', {
              className: 'px-3 py-2',
              children: h
                  ? n.jsxs('div', {
                        className: 'flex items-center gap-2',
                        children: [
                            n.jsx(Bn, {
                                className: 'min-w-0 flex-1',
                                value: m,
                                onChange: (N) => {
                                    F(N.target.value);
                                },
                                'aria-label': 'Team name',
                            }),
                            n.jsx(ee, {
                                size: 'sm',
                                className: 'shrink-0',
                                onClick: o,
                                isLoading: c,
                                children: 'Save',
                            }),
                            n.jsx(ee, {
                                size: 'sm',
                                variant: 'ghost',
                                className: 'shrink-0',
                                onClick: () => {
                                    (g(!1), F(s.name));
                                },
                                children: 'Cancel',
                            }),
                        ],
                    })
                  : n.jsx('span', { className: 'block truncate', children: s.name }),
          })),
          (e[8] = o),
          (e[9] = h),
          (e[10] = c),
          (e[11] = m),
          (e[12] = s.name),
          (e[13] = A))
        : (A = e[13]);
    const T = s.leadId ?? qe;
    let E;
    e[14] !== p || e[15] !== s.id
        ? ((E = (N) => {
              p({ id: s.id, leadId: N === qe ? null : N });
          }),
          (e[14] = p),
          (e[15] = s.id),
          (e[16] = E))
        : (E = e[16]);
    let V;
    e[17] !== i || e[18] !== T || e[19] !== E
        ? ((V = n.jsx('td', { className: 'px-3 py-2', children: n.jsx(Gi, { options: i, value: T, onChange: E }) })),
          (e[17] = i),
          (e[18] = T),
          (e[19] = E),
          (e[20] = V))
        : (V = e[20]);
    let P;
    e[21] !== l || e[22] !== C || e[23] !== b || e[24] !== h || e[25] !== s.id
        ? ((P = n.jsx('td', {
              className: 'px-3 py-2 text-right',
              children: C
                  ? n.jsxs('div', {
                        className: 'flex items-center justify-end gap-2 whitespace-nowrap',
                        children: [
                            n.jsx('span', { className: 'text-muted-foreground text-xs', children: 'Delete team?' }),
                            n.jsx(ee, {
                                size: 'sm',
                                variant: 'destructive',
                                isLoading: b,
                                onClick: () => {
                                    l(
                                        { id: s.id },
                                        {
                                            onSuccess() {
                                                pe.success('Team deleted');
                                            },
                                            onError(N) {
                                                pe.error(N instanceof Error ? N.message : 'Failed to delete team');
                                            },
                                        }
                                    );
                                },
                                children: 'Confirm',
                            }),
                            n.jsx(ee, {
                                size: 'sm',
                                variant: 'ghost',
                                onClick: () => {
                                    S(!1);
                                },
                                children: 'Cancel',
                            }),
                        ],
                    })
                  : n.jsxs('div', {
                        className: 'flex items-center justify-end gap-2',
                        children: [
                            n.jsx(ee, {
                                size: 'sm',
                                variant: 'ghost',
                                disabled: h,
                                onClick: () => {
                                    g(!0);
                                },
                                children: 'Rename',
                            }),
                            n.jsx(ee, {
                                size: 'sm',
                                variant: 'ghost',
                                onClick: () => {
                                    S(!0);
                                },
                                children: 'Delete',
                            }),
                        ],
                    }),
          })),
          (e[21] = l),
          (e[22] = C),
          (e[23] = b),
          (e[24] = h),
          (e[25] = s.id),
          (e[26] = P))
        : (P = e[26]);
    let w;
    return (
        e[27] !== A || e[28] !== V || e[29] !== P
            ? ((w = n.jsxs('tr', { className: 'border-b last:border-b-0', children: [A, V, P] })),
              (e[27] = A),
              (e[28] = V),
              (e[29] = P),
              (e[30] = w))
            : (w = e[30]),
        w
    );
}
function Wi(t) {
    const e = Pe.c(33),
        { users: s, teams: i } = t;
    let a;
    e[0] === Symbol.for('react.memo_cache_sentinel') ? ((a = go()), (e[0] = a)) : (a = e[0]);
    const { mutateAsync: p } = Ke(a);
    let d;
    e[1] !== s ? ((d = oi(s)), (e[1] = s), (e[2] = d)) : (d = e[2]);
    const u = d;
    let c, r;
    e[3] === Symbol.for('react.memo_cache_sentinel')
        ? ((c = { name: '' }), (r = { onSubmit: ti }), (e[3] = c), (e[4] = r))
        : ((c = e[3]), (r = e[4]));
    let l;
    e[5] !== p
        ? ((l = {
              defaultValues: c,
              validators: r,
              async onSubmit(V) {
                  const { value: P, formApi: w } = V;
                  await p(P, {
                      onSuccess() {
                          (pe.success('Team created'), w.reset());
                      },
                      onError(N) {
                          N instanceof Error && N.message
                              ? w.setErrorMap({ onSubmit: { fields: { name: { message: N.message } } } })
                              : pe.error('Failed to create team');
                      },
                  });
              },
          }),
          (e[5] = p),
          (e[6] = l))
        : (l = e[6]);
    const b = hn(l);
    let h;
    e[7] === Symbol.for('react.memo_cache_sentinel')
        ? ((h = n.jsx('h2', { className: 'text-lg font-medium', children: 'Teams' })), (e[7] = h))
        : (h = e[7]);
    let g;
    e[8] !== b
        ? ((g = (V) => {
              (V.preventDefault(), b.handleSubmit());
          }),
          (e[8] = b),
          (e[9] = g))
        : (g = e[9]);
    let C;
    e[10] !== b.AppField
        ? ((C = n.jsx(xn, { className: 'flex-1', children: n.jsx(b.AppField, { name: 'name', children: Yi }) })),
          (e[10] = b.AppField),
          (e[11] = C))
        : (C = e[11]);
    let S;
    e[12] !== b.Subscribe
        ? ((S = n.jsx(kt, {
              className: 'w-auto mt-6.5',
              children: n.jsx(b.Subscribe, { selector: Qi, children: Ki }),
          })),
          (e[12] = b.Subscribe),
          (e[13] = S))
        : (S = e[13]);
    let m;
    e[14] !== g || e[15] !== C || e[16] !== S
        ? ((m = n.jsxs('form', { className: 'flex items-start gap-2', noValidate: !0, onSubmit: g, children: [C, S] })),
          (e[14] = g),
          (e[15] = C),
          (e[16] = S),
          (e[17] = m))
        : (m = e[17]);
    let F;
    e[18] === Symbol.for('react.memo_cache_sentinel')
        ? ((F = n.jsxs('colgroup', {
              children: [n.jsx('col', {}), n.jsx('col', { className: 'w-72' }), n.jsx('col', { className: 'w-64' })],
          })),
          (e[18] = F))
        : (F = e[18]);
    let I;
    e[19] === Symbol.for('react.memo_cache_sentinel')
        ? ((I = n.jsx('thead', {
              className: 'text-muted-foreground border-b',
              children: n.jsxs('tr', {
                  children: [
                      n.jsx('th', { className: 'px-3 py-2 text-left font-medium', children: 'Team' }),
                      n.jsx('th', { className: 'px-3 py-2 text-left font-medium', children: 'Lead' }),
                      n.jsx('th', { className: 'px-3 py-2' }),
                  ],
              }),
          })),
          (e[19] = I))
        : (I = e[19]);
    let o;
    e[20] !== i.length
        ? ((o =
              i.length === 0 &&
              n.jsx('tr', {
                  children: n.jsx('td', {
                      className: 'text-muted-foreground px-3 py-4',
                      colSpan: 3,
                      children: 'No teams yet.',
                  }),
              })),
          (e[20] = i.length),
          (e[21] = o))
        : (o = e[21]);
    let A;
    if (e[22] !== u || e[23] !== i) {
        let V;
        (e[25] !== u
            ? ((V = (P) => n.jsx(qi, { team: P, leadOptions: u }, P.id)), (e[25] = u), (e[26] = V))
            : (V = e[26]),
            (A = i.map(V)),
            (e[22] = u),
            (e[23] = i),
            (e[24] = A));
    } else A = e[24];
    let T;
    e[27] !== o || e[28] !== A
        ? ((T = n.jsx('div', {
              className: 'overflow-x-auto rounded-lg border',
              children: n.jsxs('table', {
                  className: 'w-full min-w-3xl table-fixed text-sm',
                  children: [F, I, n.jsxs('tbody', { children: [o, A] })],
              }),
          })),
          (e[27] = o),
          (e[28] = A),
          (e[29] = T))
        : (T = e[29]);
    let E;
    return (
        e[30] !== m || e[31] !== T
            ? ((E = n.jsxs('section', { className: 'flex flex-col gap-4', children: [h, m, T] })),
              (e[30] = m),
              (e[31] = T),
              (e[32] = E))
            : (E = e[32]),
        E
    );
}
function Ki(t) {
    const [e, s] = t;
    return n.jsx(ee, { type: 'submit', disabled: !e, isLoading: s, children: 'Create team' });
}
function Qi(t) {
    return [t.canSubmit, t.isSubmitting];
}
function Yi(t) {
    return n.jsx(t.FormFieldWrapper, {
        label: 'New team',
        children: n.jsx(t.InputField, { placeholder: 'Team name' }),
    });
}
const Xi = (t) => `${window.location.origin}/activate?token=${encodeURIComponent(t)}`;
function us(t) {
    const e = Pe.c(13),
        { token: s } = t;
    let i;
    e[0] !== s ? ((i = Xi(s)), (e[0] = s), (e[1] = i)) : (i = e[1]);
    const a = i;
    let p;
    e[2] !== a
        ? ((p = async () => {
              try {
                  (await navigator.clipboard.writeText(a), pe.success('Link copied'));
              } catch {
                  pe.error('Could not copy — select and copy manually');
              }
          }),
          (e[2] = a),
          (e[3] = p))
        : (p = e[3]);
    const d = p;
    let u;
    e[4] === Symbol.for('react.memo_cache_sentinel')
        ? ((u = n.jsx('p', {
              className: 'text-muted-foreground text-sm',
              children: 'Share this one-time link so they can set a password. It expires and works once.',
          })),
          (e[4] = u))
        : (u = e[4]);
    let c;
    e[5] !== a
        ? ((c = n.jsx(Bn, { className: 'min-w-0 flex-1', value: a, readOnly: !0, 'aria-label': 'Activation link' })),
          (e[5] = a),
          (e[6] = c))
        : (c = e[6]);
    let r;
    e[7] === Symbol.for('react.memo_cache_sentinel')
        ? ((r = n.jsx(bo, { className: 'size-4' })), (e[7] = r))
        : (r = e[7]);
    let l;
    e[8] !== d
        ? ((l = n.jsxs(ee, {
              size: 'sm',
              variant: 'outline',
              className: 'shrink-0',
              onClick: d,
              children: [r, 'Copy'],
          })),
          (e[8] = d),
          (e[9] = l))
        : (l = e[9]);
    let b;
    return (
        e[10] !== c || e[11] !== l
            ? ((b = n.jsxs('div', {
                  className: 'flex flex-col gap-2',
                  children: [u, n.jsxs('div', { className: 'flex items-center gap-2', children: [c, l] })],
              })),
              (e[10] = c),
              (e[11] = l),
              (e[12] = b))
            : (b = e[12]),
        b
    );
}
function Ji(t) {
    const e = Pe.c(37),
        { teams: s, onSuccess: i } = t;
    let a;
    e[0] === Symbol.for('react.memo_cache_sentinel') ? ((a = Io()), (e[0] = a)) : (a = e[0]);
    const { mutateAsync: p } = Ke(a);
    let d;
    e[1] !== s ? ((d = Qn(s)), (e[1] = s), (e[2] = d)) : (d = e[2]);
    const u = d,
        [c, r] = f.useState(null);
    let l;
    e[3] === Symbol.for('react.memo_cache_sentinel')
        ? ((l = { email: '', role: 'buyer', status: 'invited', teamId: qe }), (e[3] = l))
        : (l = e[3]);
    let b;
    e[4] !== p || e[5] !== i
        ? ((b = {
              defaultValues: l,
              async onSubmit(E) {
                  const { value: V, formApi: P } = E,
                      w = ei.safeParse({
                          email: V.email,
                          role: V.role,
                          status: V.status,
                          teamId: V.teamId === qe ? null : V.teamId,
                      });
                  if (!w.success) {
                      const N = w.error.issues.find(or);
                      P.setErrorMap({ onSubmit: { fields: { email: { message: N?.message ?? 'Invalid input' } } } });
                      return;
                  }
                  await p(w.data, {
                      onSuccess(N) {
                          (pe.success('User created'), N.activationToken ? r(N.activationToken) : i());
                      },
                      onError(N) {
                          N instanceof Error && N.message
                              ? P.setErrorMap({ onSubmit: { fields: { email: { message: N.message } } } })
                              : pe.error('Failed to create user');
                      },
                  });
              },
          }),
          (e[4] = p),
          (e[5] = i),
          (e[6] = b))
        : (b = e[6]);
    const h = hn(b);
    if (c) {
        let E;
        e[7] !== c ? ((E = n.jsx(us, { token: c })), (e[7] = c), (e[8] = E)) : (E = e[8]);
        let V;
        e[9] !== i
            ? ((V = n.jsx(ee, {
                  className: 'w-full',
                  onClick: () => {
                      i();
                  },
                  children: 'Done',
              })),
              (e[9] = i),
              (e[10] = V))
            : (V = e[10]);
        let P;
        return (
            e[11] !== E || e[12] !== V
                ? ((P = n.jsxs('div', { className: 'flex flex-col gap-4', children: [E, V] })),
                  (e[11] = E),
                  (e[12] = V),
                  (e[13] = P))
                : (P = e[13]),
            P
        );
    }
    let g;
    e[14] !== h
        ? ((g = (E) => {
              (E.preventDefault(), h.handleSubmit());
          }),
          (e[14] = h),
          (e[15] = g))
        : (g = e[15]);
    let C, S;
    e[16] !== h.AppField
        ? ((C = n.jsx(h.AppField, { name: 'email', children: sr })),
          (S = n.jsx(h.AppField, { name: 'role', children: nr })),
          (e[16] = h.AppField),
          (e[17] = C),
          (e[18] = S))
        : ((C = e[17]), (S = e[18]));
    let m;
    e[19] !== u
        ? ((m = (E) =>
              n.jsx(E.FormFieldWrapper, {
                  label: 'Team',
                  children: n.jsx(E.SelectField, { items: u, placeholder: 'Select team' }),
              })),
          (e[19] = u),
          (e[20] = m))
        : (m = e[20]);
    let F;
    e[21] !== h.AppField || e[22] !== m
        ? ((F = n.jsx(h.AppField, { name: 'teamId', children: m })), (e[21] = h.AppField), (e[22] = m), (e[23] = F))
        : (F = e[23]);
    let I;
    e[24] !== h.AppField
        ? ((I = n.jsx(h.AppField, { name: 'status', children: tr })), (e[24] = h.AppField), (e[25] = I))
        : (I = e[25]);
    let o;
    e[26] !== h.Subscribe
        ? ((o = n.jsx(kt, { children: n.jsx(h.Subscribe, { selector: er, children: Zi }) })),
          (e[26] = h.Subscribe),
          (e[27] = o))
        : (o = e[27]);
    let A;
    e[28] !== I || e[29] !== o || e[30] !== C || e[31] !== S || e[32] !== F
        ? ((A = n.jsx(Gn, { children: n.jsxs(xn, { children: [C, S, F, I, o] }) })),
          (e[28] = I),
          (e[29] = o),
          (e[30] = C),
          (e[31] = S),
          (e[32] = F),
          (e[33] = A))
        : (A = e[33]);
    let T;
    return (
        e[34] !== A || e[35] !== g
            ? ((T = n.jsx('form', { id: 'create-user-form', noValidate: !0, onSubmit: g, children: A })),
              (e[34] = A),
              (e[35] = g),
              (e[36] = T))
            : (T = e[36]),
        T
    );
}
function Zi(t) {
    const [e, s] = t;
    return n.jsx(ee, { type: 'submit', className: 'w-full', disabled: !e, isLoading: s, children: 'Create user' });
}
function er(t) {
    return [t.canSubmit, t.isSubmitting];
}
function tr(t) {
    return n.jsx(t.FormFieldWrapper, {
        label: 'Status',
        children: n.jsx(t.SelectField, { items: Kn, placeholder: 'Select status' }),
    });
}
function nr(t) {
    return n.jsx(t.FormFieldWrapper, {
        label: 'Role',
        children: n.jsx(t.SelectField, { items: Wn, placeholder: 'Select role' }),
    });
}
function sr(t) {
    return n.jsx(t.FormFieldWrapper, {
        label: 'Email',
        children: n.jsx(t.InputField, { type: 'email', placeholder: 'you@example.com' }),
    });
}
function or(t) {
    return t.path[0] === 'email';
}
const ir = (t, e, s) => {
    const i = { id: t.id };
    (e.role !== t.role && (i.role = e.role), e.status !== t.status && (i.status = e.status));
    const a = e.teamId === s ? null : e.teamId;
    return (a !== t.teamId && (i.teamId = a), i);
};
function rr(t) {
    const e = Pe.c(36),
        { user: s, teams: i, onSuccess: a } = t;
    let p;
    e[0] === Symbol.for('react.memo_cache_sentinel') ? ((p = vo()), (e[0] = p)) : (p = e[0]);
    const { mutateAsync: d } = Ke(p);
    let u;
    e[1] !== i ? ((u = Qn(i)), (e[1] = i), (e[2] = u)) : (u = e[2]);
    const c = u,
        r = s.teamId ?? qe;
    let l;
    e[3] !== r || e[4] !== s.role || e[5] !== s.status
        ? ((l = { role: s.role, status: s.status, teamId: r }),
          (e[3] = r),
          (e[4] = s.role),
          (e[5] = s.status),
          (e[6] = l))
        : (l = e[6]);
    let b;
    e[7] !== a || e[8] !== l || e[9] !== d || e[10] !== s
        ? ((b = {
              defaultValues: l,
              async onSubmit(E) {
                  const { value: V, formApi: P } = E,
                      w = ir(s, V, qe);
                  if (Object.keys(w).length === 1) {
                      a();
                      return;
                  }
                  await d(w, {
                      onSuccess() {
                          (pe.success('User updated'), a());
                      },
                      onError(N) {
                          N instanceof Error && N.message
                              ? P.setErrorMap({ onSubmit: { fields: { role: { message: N.message } } } })
                              : pe.error('Failed to update user');
                      },
                  });
              },
          }),
          (e[7] = a),
          (e[8] = l),
          (e[9] = d),
          (e[10] = s),
          (e[11] = b))
        : (b = e[11]);
    const h = hn(b);
    let g;
    e[12] !== h
        ? ((g = (E) => {
              (E.preventDefault(), h.handleSubmit());
          }),
          (e[12] = h),
          (e[13] = g))
        : (g = e[13]);
    let C;
    e[14] !== s.email
        ? ((C = n.jsx(kt, { children: n.jsx('p', { className: 'text-muted-foreground text-sm', children: s.email }) })),
          (e[14] = s.email),
          (e[15] = C))
        : (C = e[15]);
    let S;
    e[16] !== h.AppField
        ? ((S = n.jsx(h.AppField, { name: 'role', children: ur })), (e[16] = h.AppField), (e[17] = S))
        : (S = e[17]);
    let m;
    e[18] !== c
        ? ((m = (E) =>
              n.jsx(E.FormFieldWrapper, {
                  label: 'Team',
                  children: n.jsx(E.SelectField, { items: c, placeholder: 'Select team' }),
              })),
          (e[18] = c),
          (e[19] = m))
        : (m = e[19]);
    let F;
    e[20] !== h.AppField || e[21] !== m
        ? ((F = n.jsx(h.AppField, { name: 'teamId', children: m })), (e[20] = h.AppField), (e[21] = m), (e[22] = F))
        : (F = e[22]);
    let I;
    e[23] !== h.AppField
        ? ((I = n.jsx(h.AppField, { name: 'status', children: cr })), (e[23] = h.AppField), (e[24] = I))
        : (I = e[24]);
    let o;
    e[25] !== h.Subscribe
        ? ((o = n.jsx(kt, { children: n.jsx(h.Subscribe, { selector: ar, children: lr }) })),
          (e[25] = h.Subscribe),
          (e[26] = o))
        : (o = e[26]);
    let A;
    e[27] !== F || e[28] !== I || e[29] !== o || e[30] !== C || e[31] !== S
        ? ((A = n.jsx(Gn, { children: n.jsxs(xn, { children: [C, S, F, I, o] }) })),
          (e[27] = F),
          (e[28] = I),
          (e[29] = o),
          (e[30] = C),
          (e[31] = S),
          (e[32] = A))
        : (A = e[32]);
    let T;
    return (
        e[33] !== A || e[34] !== g
            ? ((T = n.jsx('form', { id: 'edit-user-form', noValidate: !0, onSubmit: g, children: A })),
              (e[33] = A),
              (e[34] = g),
              (e[35] = T))
            : (T = e[35]),
        T
    );
}
function lr(t) {
    const [e, s] = t;
    return n.jsx(ee, { type: 'submit', className: 'w-full', disabled: !e, isLoading: s, children: 'Save changes' });
}
function ar(t) {
    return [t.canSubmit, t.isSubmitting];
}
function cr(t) {
    return n.jsx(t.FormFieldWrapper, {
        label: 'Status',
        children: n.jsx(t.SelectField, { items: Kn, placeholder: 'Select status' }),
    });
}
function ur(t) {
    return n.jsx(t.FormFieldWrapper, {
        label: 'Role',
        children: n.jsx(t.SelectField, { items: Wn, placeholder: 'Select role' }),
    });
}
function dr(t) {
    const e = Pe.c(16),
        { userId: s } = t;
    let i;
    e[0] === Symbol.for('react.memo_cache_sentinel') ? ((i = yo()), (e[0] = i)) : (i = e[0]);
    const { mutate: a, data: p, isPending: d, isError: u } = Ke(i);
    let c;
    e[1] !== a || e[2] !== s
        ? ((c = () => {
              a({ id: s });
          }),
          (e[1] = a),
          (e[2] = s),
          (e[3] = c))
        : (c = e[3]);
    const r = c;
    let l;
    e[4] !== p
        ? ((l = !!p?.activationToken && n.jsx(us, { token: p.activationToken })), (e[4] = p), (e[5] = l))
        : (l = e[5]);
    let b;
    e[6] !== u
        ? ((b =
              u &&
              n.jsx('p', { className: 'text-destructive text-sm', children: 'Could not generate a link. Try again.' })),
          (e[6] = u),
          (e[7] = b))
        : (b = e[7]);
    const h = p ? 'Generate new link' : 'Generate invite link';
    let g;
    e[8] !== r || e[9] !== d || e[10] !== h
        ? ((g = n.jsx(ee, { variant: 'outline', onClick: r, isLoading: d, children: h })),
          (e[8] = r),
          (e[9] = d),
          (e[10] = h),
          (e[11] = g))
        : (g = e[11]);
    let C;
    return (
        e[12] !== l || e[13] !== b || e[14] !== g
            ? ((C = n.jsxs('div', { className: 'flex flex-col gap-4', children: [l, b, g] })),
              (e[12] = l),
              (e[13] = b),
              (e[14] = g),
              (e[15] = C))
            : (C = e[15]),
        C
    );
}
const fr = Co(
    'h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium motion-safe:transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
                secondary: 'bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80',
                destructive:
                    'bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20',
                outline: 'border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground',
                ghost: 'hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50',
                link: 'text-primary underline-offset-4 hover:underline',
            },
        },
        defaultVariants: { variant: 'default' },
    }
);
function Nn(t) {
    const e = Pe.c(13);
    let s, i, a, p, d;
    if (e[0] !== t) {
        const { className: r, variant: l, render: b, ...h } = t;
        ((s = b),
            (d = l === void 0 ? 'default' : l),
            (p = Jo),
            (i = 'span'),
            (a = un({ className: Hn(fr({ variant: d }), r) }, h)),
            (e[0] = t),
            (e[1] = s),
            (e[2] = i),
            (e[3] = a),
            (e[4] = p),
            (e[5] = d));
    } else ((s = e[1]), (i = e[2]), (a = e[3]), (p = e[4]), (d = e[5]));
    let u;
    e[6] !== d ? ((u = { slot: 'badge', variant: d }), (e[6] = d), (e[7] = u)) : (u = e[7]);
    let c;
    return (
        e[8] !== s || e[9] !== i || e[10] !== a || e[11] !== u
            ? ((c = { defaultTagName: i, props: a, render: s, state: u }),
              (e[8] = s),
              (e[9] = i),
              (e[10] = a),
              (e[11] = u),
              (e[12] = c))
            : (c = e[12]),
        p(c)
    );
}
const mr = { active: 'default', invited: 'secondary', disabled: 'destructive' };
function pr(t) {
    const e = Pe.c(27),
        { user: s, teams: i, currentUserId: a, onEdit: p, onInvite: d } = t;
    let u;
    e[0] === Symbol.for('react.memo_cache_sentinel') ? ((u = So()), (e[0] = u)) : (u = e[0]);
    const { mutate: c, isPending: r } = Ke(u),
        [l, b] = f.useState(!1),
        h = s.id === a;
    let g;
    e[1] !== s.email
        ? ((g = n.jsx('td', { className: 'px-3 py-2', children: s.email })), (e[1] = s.email), (e[2] = g))
        : (g = e[2]);
    let C;
    e[3] !== s.role
        ? ((C = n.jsx('td', { className: 'px-3 py-2', children: n.jsx(Nn, { variant: 'outline', children: s.role }) })),
          (e[3] = s.role),
          (e[4] = C))
        : (C = e[4]);
    let S;
    e[5] !== i || e[6] !== s.teamId ? ((S = si(s.teamId, i)), (e[5] = i), (e[6] = s.teamId), (e[7] = S)) : (S = e[7]);
    let m;
    e[8] !== S ? ((m = n.jsx('td', { className: 'px-3 py-2', children: S })), (e[8] = S), (e[9] = m)) : (m = e[9]);
    const F = mr[s.status];
    let I;
    e[10] !== F || e[11] !== s.status
        ? ((I = n.jsx('td', { className: 'px-3 py-2', children: n.jsx(Nn, { variant: F, children: s.status }) })),
          (e[10] = F),
          (e[11] = s.status),
          (e[12] = I))
        : (I = e[12]);
    let o;
    e[13] !== c || e[14] !== l || e[15] !== r || e[16] !== h || e[17] !== p || e[18] !== d || e[19] !== s
        ? ((o = n.jsx('td', {
              className: 'px-3 py-2 text-right whitespace-nowrap',
              children: l
                  ? n.jsxs('div', {
                        className: 'flex items-center justify-end gap-2',
                        children: [
                            n.jsx('span', { className: 'text-muted-foreground text-xs', children: 'Delete user?' }),
                            n.jsx(ee, {
                                size: 'sm',
                                variant: 'destructive',
                                isLoading: r,
                                onClick: () => {
                                    c(
                                        { id: s.id },
                                        {
                                            onSuccess() {
                                                pe.success('User deleted');
                                            },
                                            onError(T) {
                                                (pe.error(T instanceof Error ? T.message : 'Failed to delete user'),
                                                    b(!1));
                                            },
                                        }
                                    );
                                },
                                children: 'Confirm',
                            }),
                            n.jsx(ee, {
                                size: 'sm',
                                variant: 'ghost',
                                onClick: () => {
                                    b(!1);
                                },
                                children: 'Cancel',
                            }),
                        ],
                    })
                  : n.jsxs(n.Fragment, {
                        children: [
                            s.status === 'invited' &&
                                n.jsx(ee, {
                                    size: 'sm',
                                    variant: 'ghost',
                                    onClick: () => {
                                        d(s);
                                    },
                                    children: 'Invite link',
                                }),
                            n.jsx(ee, {
                                size: 'sm',
                                variant: 'ghost',
                                onClick: () => {
                                    p(s);
                                },
                                children: 'Edit',
                            }),
                            !h &&
                                n.jsx(ee, {
                                    size: 'sm',
                                    variant: 'ghost',
                                    onClick: () => {
                                        b(!0);
                                    },
                                    children: 'Delete',
                                }),
                        ],
                    }),
          })),
          (e[13] = c),
          (e[14] = l),
          (e[15] = r),
          (e[16] = h),
          (e[17] = p),
          (e[18] = d),
          (e[19] = s),
          (e[20] = o))
        : (o = e[20]);
    let A;
    return (
        e[21] !== g || e[22] !== C || e[23] !== m || e[24] !== I || e[25] !== o
            ? ((A = n.jsxs('tr', { className: 'border-b last:border-b-0', children: [g, C, m, I, o] })),
              (e[21] = g),
              (e[22] = C),
              (e[23] = m),
              (e[24] = I),
              (e[25] = o),
              (e[26] = A))
            : (A = e[26]),
        A
    );
}
function hr(t) {
    const e = Pe.c(48),
        { users: s, teams: i, currentUserId: a } = t,
        [p, d] = f.useState(!1),
        [u, c] = f.useState(null),
        [r, l] = f.useState(null);
    let b;
    e[0] === Symbol.for('react.memo_cache_sentinel')
        ? ((b = n.jsx('h2', { className: 'text-lg font-medium', children: 'Users' })), (e[0] = b))
        : (b = e[0]);
    let h;
    e[1] === Symbol.for('react.memo_cache_sentinel')
        ? ((h = n.jsxs('div', {
              className: 'flex items-center justify-between',
              children: [
                  b,
                  n.jsxs(ee, {
                      size: 'sm',
                      onClick: () => {
                          d(!0);
                      },
                      children: [n.jsx(jo, { className: 'size-4' }), 'New user'],
                  }),
              ],
          })),
          (e[1] = h))
        : (h = e[1]);
    let g;
    e[2] === Symbol.for('react.memo_cache_sentinel')
        ? ((g = n.jsx('thead', {
              className: 'text-muted-foreground border-b',
              children: n.jsxs('tr', {
                  children: [
                      n.jsx('th', { className: 'px-3 py-2 text-left font-medium', children: 'Email' }),
                      n.jsx('th', { className: 'px-3 py-2 text-left font-medium', children: 'Role' }),
                      n.jsx('th', { className: 'px-3 py-2 text-left font-medium', children: 'Team' }),
                      n.jsx('th', { className: 'px-3 py-2 text-left font-medium', children: 'Status' }),
                      n.jsx('th', { className: 'px-3 py-2' }),
                  ],
              }),
          })),
          (e[2] = g))
        : (g = e[2]);
    let C;
    if (e[3] !== a || e[4] !== i || e[5] !== s) {
        let ne;
        (e[7] !== a || e[8] !== i
            ? ((ne = (Fe) => n.jsx(pr, { user: Fe, teams: i, currentUserId: a, onEdit: c, onInvite: l }, Fe.id)),
              (e[7] = a),
              (e[8] = i),
              (e[9] = ne))
            : (ne = e[9]),
            (C = s.map(ne)),
            (e[3] = a),
            (e[4] = i),
            (e[5] = s),
            (e[6] = C));
    } else C = e[6];
    let S;
    e[10] !== C
        ? ((S = n.jsx('div', {
              className: 'overflow-x-auto rounded-lg border',
              children: n.jsxs('table', {
                  className: 'w-full text-sm',
                  children: [g, n.jsx('tbody', { children: C })],
              }),
          })),
          (e[10] = C),
          (e[11] = S))
        : (S = e[11]);
    let m;
    e[12] === Symbol.for('react.memo_cache_sentinel')
        ? ((m = n.jsxs(on, {
              children: [
                  n.jsx(rn, { children: 'New user' }),
                  n.jsx(ln, { children: 'Invite a user and assign their role, team, and status.' }),
              ],
          })),
          (e[12] = m))
        : (m = e[12]);
    let F;
    e[13] === Symbol.for('react.memo_cache_sentinel')
        ? ((F = () => {
              d(!1);
          }),
          (e[13] = F))
        : (F = e[13]);
    let I;
    e[14] !== i
        ? ((I = n.jsxs(an, {
              className: 'gap-0',
              children: [m, n.jsx('div', { className: 'p-4', children: n.jsx(Ji, { teams: i, onSuccess: F }) })],
          })),
          (e[14] = i),
          (e[15] = I))
        : (I = e[15]);
    let o;
    e[16] !== p || e[17] !== I
        ? ((o = n.jsx(cn, { open: p, onOpenChange: d, children: I })), (e[16] = p), (e[17] = I), (e[18] = o))
        : (o = e[18]);
    const A = !!u;
    let T;
    e[19] === Symbol.for('react.memo_cache_sentinel')
        ? ((T = (ne) => {
              ne || c(null);
          }),
          (e[19] = T))
        : (T = e[19]);
    let E;
    e[20] === Symbol.for('react.memo_cache_sentinel')
        ? ((E = n.jsxs(on, {
              children: [
                  n.jsx(rn, { children: 'Edit user' }),
                  n.jsx(ln, { children: "Change this user's role, team, or status." }),
              ],
          })),
          (e[20] = E))
        : (E = e[20]);
    let V;
    e[21] !== u || e[22] !== i
        ? ((V =
              !!u &&
              n.jsx(rr, {
                  user: u,
                  teams: i,
                  onSuccess: () => {
                      c(null);
                  },
              })),
          (e[21] = u),
          (e[22] = i),
          (e[23] = V))
        : (V = e[23]);
    let P;
    e[24] !== V
        ? ((P = n.jsxs(an, { className: 'gap-0', children: [E, n.jsx('div', { className: 'p-4', children: V })] })),
          (e[24] = V),
          (e[25] = P))
        : (P = e[25]);
    let w;
    e[26] !== A || e[27] !== P
        ? ((w = n.jsx(cn, { open: A, onOpenChange: T, children: P })), (e[26] = A), (e[27] = P), (e[28] = w))
        : (w = e[28]);
    const N = !!r;
    let _;
    e[29] === Symbol.for('react.memo_cache_sentinel')
        ? ((_ = (ne) => {
              ne || l(null);
          }),
          (e[29] = _))
        : (_ = e[29]);
    let M;
    e[30] === Symbol.for('react.memo_cache_sentinel')
        ? ((M = n.jsx(rn, { children: 'Invite link' })), (e[30] = M))
        : (M = e[30]);
    const B = r ? `Generate a one-time activation link for ${r.email}.` : null;
    let q;
    e[31] !== B
        ? ((q = n.jsxs(on, { children: [M, n.jsx(ln, { children: B })] })), (e[31] = B), (e[32] = q))
        : (q = e[32]);
    let Q;
    e[33] !== r ? ((Q = !!r && n.jsx(dr, { userId: r.id })), (e[33] = r), (e[34] = Q)) : (Q = e[34]);
    let Y;
    e[35] !== Q ? ((Y = n.jsx('div', { className: 'p-4', children: Q })), (e[35] = Q), (e[36] = Y)) : (Y = e[36]);
    let te;
    e[37] !== q || e[38] !== Y
        ? ((te = n.jsxs(an, { className: 'gap-0', children: [q, Y] })), (e[37] = q), (e[38] = Y), (e[39] = te))
        : (te = e[39]);
    let U;
    e[40] !== N || e[41] !== te
        ? ((U = n.jsx(cn, { open: N, onOpenChange: _, children: te })), (e[40] = N), (e[41] = te), (e[42] = U))
        : (U = e[42]);
    let J;
    return (
        e[43] !== w || e[44] !== U || e[45] !== S || e[46] !== o
            ? ((J = n.jsxs('section', { className: 'flex flex-col gap-4', children: [h, S, o, w, U] })),
              (e[43] = w),
              (e[44] = U),
              (e[45] = S),
              (e[46] = o),
              (e[47] = J))
            : (J = e[47]),
        J
    );
}
const xr = Eo('/_authenticated');
function gr() {
    const t = Pe.c(15);
    let e;
    t[0] === Symbol.for('react.memo_cache_sentinel') ? ((e = Ro()), (t[0] = e)) : (e = t[0]);
    const { data: s } = Vn(e);
    let i;
    t[1] === Symbol.for('react.memo_cache_sentinel') ? ((i = Ao()), (t[1] = i)) : (i = t[1]);
    const { data: a } = Vn(i);
    let p;
    t[2] === Symbol.for('react.memo_cache_sentinel')
        ? ((p = {
              select(h) {
                  return h.auth.me.id;
              },
          }),
          (t[2] = p))
        : (p = t[2]);
    const d = xr.useRouteContext(p);
    let u;
    t[3] === Symbol.for('react.memo_cache_sentinel')
        ? ((u = n.jsx(Po, { children: n.jsx('h1', { className: 'text-xl', children: 'Admin' }) })), (t[3] = u))
        : (u = t[3]);
    let c;
    t[4] !== d || t[5] !== a || t[6] !== s
        ? ((c = n.jsx(hr, { users: s, teams: a, currentUserId: d })), (t[4] = d), (t[5] = a), (t[6] = s), (t[7] = c))
        : (c = t[7]);
    let r;
    t[8] === Symbol.for('react.memo_cache_sentinel') ? ((r = n.jsx(Vo, {})), (t[8] = r)) : (r = t[8]);
    let l;
    t[9] !== a || t[10] !== s
        ? ((l = n.jsx(Wi, { users: s, teams: a })), (t[9] = a), (t[10] = s), (t[11] = l))
        : (l = t[11]);
    let b;
    return (
        t[12] !== c || t[13] !== l
            ? ((b = n.jsxs(n.Fragment, {
                  children: [u, n.jsxs('div', { className: 'flex flex-col gap-8', children: [c, r, l] })],
              })),
              (t[12] = c),
              (t[13] = l),
              (t[14] = b))
            : (b = t[14]),
        b
    );
}
const Rr = gr;
export { Rr as component };
