import {
    u as er,
    d as Gn,
    b as Jn,
    g as Kn,
    a as Qn,
    I as tr,
    c as Tt,
    e as Xn,
    C as Zn,
} from './getPseudoElementBounds-D7ePV0js.js';
import {
    bJ as _n,
    K as _t,
    bM as $n,
    u as $t,
    aO as ae,
    bC as an,
    D as An,
    b2 as b,
    ab as bn,
    F as Bn,
    M as Bt,
    y as ce,
    bv as cn,
    aE as Cn,
    bD as dn,
    bI as Dn,
    q as Ee,
    av as En,
    k as Et,
    a5 as fn,
    B as Fn,
    ar as ft,
    ay as gn,
    a9 as hn,
    bK as Hn,
    H as Ht,
    aF as Ie,
    bc as In,
    i as It,
    e as je,
    p as jn,
    n as kn,
    bB as ln,
    bH as Ln,
    b9 as mn,
    r as Mn,
    b8 as mt,
    aa as Nn,
    ac as Nt,
    bi as on,
    bF as On,
    U as P,
    o as pn,
    v as Pn,
    bN as qn,
    bd as Rn,
    c as Rt,
    G as Se,
    j as sn,
    d as Sn,
    f as st,
    bG as St,
    bE as Tn,
    b1 as un,
    bL as Un,
    b3 as Ut,
    bb as vn,
    z as Vn,
    ao as vt,
    aA as wn,
    bO as Wn,
    ad as xn,
    af as yn,
    aS as Yn,
    x as yt,
    t as Yt,
    bm as zn,
} from './index-CATHI92X.js';
import { I as nr, C as rr } from './useScrollLock-BrgHxV8m.js';
import { c as fe, r as i, j as x } from './vendor-react-1kp2ER4x.js';

const __vite__mapDeps = (
    i,
    m = __vite__mapDeps,
    d = m.f ||
        (m.f = [
            'assets/index-C3Mou0V4.js',
            'assets/vendor-react-1kp2ER4x.js',
            'assets/index-CATHI92X.js',
            'assets/vendor-zod-D40u6Zl6.js',
            'assets/index-DKyJSsCK.css',
            'assets/getPseudoElementBounds-D7ePV0js.js',
            'assets/useScrollLock-BrgHxV8m.js',
        ])
) => i.map((i) => d[i]);
let Ot = (function (t) {
    return (
        (t.disabled = 'data-disabled'),
        (t.valid = 'data-valid'),
        (t.invalid = 'data-invalid'),
        (t.touched = 'data-touched'),
        (t.dirty = 'data-dirty'),
        (t.filled = 'data-filled'),
        (t.focused = 'data-focused'),
        t
    );
})({});
const sr = {
        badInput: !1,
        customError: !1,
        patternMismatch: !1,
        rangeOverflow: !1,
        rangeUnderflow: !1,
        stepMismatch: !1,
        tooLong: !1,
        tooShort: !1,
        typeMismatch: !1,
        valid: null,
        valueMissing: !1,
    },
    et = { valid: null, touched: !1, dirty: !1, filled: !1, focused: !1 },
    or = { disabled: !1, ...et },
    zt = {
        valid(t) {
            return t === null ? null : t ? { [Ot.valid]: '' } : { [Ot.invalid]: '' };
        },
    },
    lr = {
        invalid: void 0,
        name: void 0,
        validityData: { state: sr, errors: [], error: '', value: '', initialValue: null },
        setValidityData: ae,
        disabled: void 0,
        touched: et.touched,
        setTouched: ae,
        dirty: et.dirty,
        setDirty: ae,
        filled: et.filled,
        setFilled: ae,
        focused: et.focused,
        setFocused: ae,
        validate: () => null,
        validationMode: 'onSubmit',
        validationDebounceTime: 0,
        shouldValidateOnChange: () => !1,
        state: or,
        markedDirtyRef: { current: !1 },
        registerFieldControl: ae,
        validation: {
            getValidationProps: (t, e = Bt) => e,
            inputRef: { current: null },
            registerInput: ae,
            commit: async () => {},
            change: ae,
        },
    },
    ir = i.createContext(lr);
function gt(t = !0) {
    const e = i.useContext(ir);
    if (e.setValidityData === ae && !t) throw new Error(st(28));
    return e;
}
const ar = i.createContext({
    formRef: { current: { fields: new Map() } },
    errors: {},
    clearErrors: ae,
    validationMode: 'onSubmit',
    submitAttemptedRef: { current: !1 },
});
function qt() {
    return i.useContext(ar);
}
const cr = i.createContext({
    controlId: void 0,
    registerControlId: ae,
    labelId: void 0,
    setLabelId: ae,
    messageIds: [],
    setMessageIds: ae,
    getDescriptionProps: (t) => t,
});
function Ct() {
    return i.useContext(cr);
}
function Mt(t = {}) {
    const { id: e, implicit: n = !1, controlRef: r } = t,
        { controlId: o, registerControlId: s } = Ct(),
        l = sn(e),
        a = n ? o : void 0,
        c = _t(() => Symbol('labelable-control')),
        d = i.useRef(!1),
        v = i.useRef(e != null),
        m = Se(() => {
            !d.current || s === ae || ((d.current = !1), s(c.current, void 0));
        });
    return (
        ce(() => {
            if (s === ae) return;
            let f;
            if (n) {
                const g = r?.current;
                on(g) && g.closest('label') != null ? (f = e ?? null) : (f = a ?? l);
            } else if (e != null) ((v.current = !0), (f = e));
            else if (v.current) f = l;
            else {
                m();
                return;
            }
            if (f === void 0) {
                m();
                return;
            }
            ((d.current = !0), s(c.current, f));
        }, [e, r, a, s, n, l, c, m]),
        i.useEffect(() => m, [m]),
        o ?? l
    );
}
function Wt(t, e, n, r, o = !0, s) {
    const { registerFieldControl: l } = gt(),
        a = i.useRef(null);
    (a.current || (a.current = Symbol()),
        ce(() => {
            const c = a.current;
            return !c || !o
                ? void 0
                : (l(c, { controlRef: t, getValue: r, id: e, name: s, value: n }),
                  () => {
                      l(c, void 0);
                  });
        }, [t, o, r, e, s, l, n]));
}
const ur = i.forwardRef(function (e, n) {
        const {
                render: r,
                className: o,
                id: s,
                name: l,
                value: a,
                disabled: c = !1,
                onValueChange: d,
                defaultValue: v,
                autoFocus: m = !1,
                style: f,
                ...g
            } = e,
            {
                state: M,
                name: O,
                disabled: R,
                setTouched: H,
                setDirty: j,
                validityData: C,
                setFocused: S,
                setFilled: V,
                validationMode: F,
                validation: U,
            } = gt(),
            { clearErrors: X } = qt(),
            k = R || c,
            K = O ?? l,
            ie = { ...M, disabled: k },
            { labelId: ue } = Ct(),
            B = Mt({ id: s });
        ce(() => {
            const I = a != null;
            U.inputRef.current?.value || (I && a !== '') ? V(!0) : I && a === '' && V(!1);
        }, [U.inputRef, V, a]);
        const _ = i.useRef(null);
        ce(() => {
            m && _.current === ln(ft(_.current)) && S(!0);
        }, [m, S]);
        const [N] = Tt({ controlled: a, default: v, name: 'FieldControl', state: 'value' }),
            re = a !== void 0,
            L = re ? N : void 0,
            ee = Se(() => U.inputRef.current?.value);
        return (
            Wt(U.inputRef, B, L, ee, !k, l),
            je('input', e, {
                ref: [n, _],
                state: ie,
                props: [
                    {
                        id: B,
                        disabled: k,
                        name: K,
                        ref: U.inputRef,
                        'aria-labelledby': ue,
                        autoFocus: m,
                        ...(re ? { value: L } : { defaultValue: v }),
                        onChange(I) {
                            const u = I.currentTarget.value;
                            (d?.(u, Ee(mt, I.nativeEvent)),
                                j(u !== C.initialValue),
                                V(u !== ''),
                                I.nativeEvent.defaultPrevented || (X(K), U.change(u)));
                        },
                        onFocus() {
                            S(!0);
                        },
                        onBlur(I) {
                            (H(!0), S(!1), F === 'onBlur' && U.commit(I.currentTarget.value));
                        },
                        onKeyDown(I) {
                            I.currentTarget.tagName === 'INPUT' &&
                                I.key === 'Enter' &&
                                (H(!0), U.commit(I.currentTarget.value));
                        },
                    },
                    g,
                    (I) => U.getValidationProps(k, I),
                ],
                stateAttributesMapping: zt,
            })
        );
    }),
    dr = i.forwardRef(function (e, n) {
        return x.jsx(ur, { ref: n, ...e });
    });
function fr(t) {
    const e = fe.c(10);
    let n, r, o;
    e[0] !== t
        ? (({ className: n, type: o, ...r } = t), (e[0] = t), (e[1] = n), (e[2] = r), (e[3] = o))
        : ((n = e[1]), (r = e[2]), (o = e[3]));
    let s;
    e[4] !== n
        ? ((s = Ie(
              'dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 h-8 rounded-lg border bg-transparent px-2.5 py-1 text-base motion-safe:transition-colors file:h-6 file:text-sm file:font-medium aria-invalid:ring-3 md:text-sm w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
              n
          )),
          (e[4] = n),
          (e[5] = s))
        : (s = e[5]);
    let l;
    return (
        e[6] !== r || e[7] !== s || e[8] !== o
            ? ((l = x.jsx(dr, { 'data-slot': 'input', type: o, className: s, ...r })),
              (e[6] = r),
              (e[7] = s),
              (e[8] = o),
              (e[9] = l))
            : (l = e[9]),
        l
    );
}
function pr(t) {
    return t == null || t.hasAttribute('disabled') || t.getAttribute('aria-disabled') === 'true';
}
const { fieldContext: mr, formContext: gr, useFieldContext: At } = an(),
    ht = (t) => {
        if (!(!t || t.length === 0)) {
            for (const e of t)
                if (e) {
                    if (typeof e == 'string') return e;
                    if (typeof e == 'object' && 'message' in e && typeof e.message == 'string') return e.message;
                    if (Array.isArray(e)) {
                        const n = ht(e);
                        if (n) return n;
                    }
                }
        }
    };
function hr(t) {
    const e = fe.c(10);
    let n, r, o;
    e[0] !== t
        ? (({ className: n, htmlFor: r, ...o } = t), (e[0] = t), (e[1] = n), (e[2] = r), (e[3] = o))
        : ((n = e[1]), (r = e[2]), (o = e[3]));
    let s;
    e[4] !== n
        ? ((s = Ie(
              'gap-2 text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed',
              n
          )),
          (e[4] = n),
          (e[5] = s))
        : (s = e[5]);
    let l;
    return (
        e[6] !== r || e[7] !== o || e[8] !== s
            ? ((l = x.jsx('label', { className: s, htmlFor: r, ...o })), (e[6] = r), (e[7] = o), (e[8] = s), (e[9] = l))
            : (l = e[9]),
        l
    );
}
const br = cn('data-[invalid=true]:text-destructive gap-2 group/field flex w-full', {
    variants: {
        orientation: {
            vertical: 'flex-col *:w-full [&>.sr-only]:w-auto',
            horizontal:
                'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
            responsive:
                'flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        },
    },
    defaultVariants: { orientation: 'vertical' },
});
function ps(t) {
    const e = fe.c(8);
    let n, r;
    e[0] !== t ? (({ className: n, ...r } = t), (e[0] = t), (e[1] = n), (e[2] = r)) : ((n = e[1]), (r = e[2]));
    let o;
    e[3] !== n
        ? ((o = Ie(
              'gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3 flex flex-col',
              n
          )),
          (e[3] = n),
          (e[4] = o))
        : (o = e[4]);
    let s;
    return (
        e[5] !== r || e[6] !== o
            ? ((s = x.jsx('fieldset', { 'data-slot': 'field-set', className: o, ...r })),
              (e[5] = r),
              (e[6] = o),
              (e[7] = s))
            : (s = e[7]),
        s
    );
}
function ms(t) {
    const e = fe.c(8);
    let n, r;
    e[0] !== t ? (({ className: n, ...r } = t), (e[0] = t), (e[1] = n), (e[2] = r)) : ((n = e[1]), (r = e[2]));
    let o;
    e[3] !== n
        ? ((o = Ie(
              'gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4 group/field-group @container/field-group flex w-full flex-col',
              n
          )),
          (e[3] = n),
          (e[4] = o))
        : (o = e[4]);
    let s;
    return (
        e[5] !== r || e[6] !== o
            ? ((s = x.jsx('div', { 'data-slot': 'field-group', className: o, ...r })),
              (e[5] = r),
              (e[6] = o),
              (e[7] = s))
            : (s = e[7]),
        s
    );
}
function xr(t) {
    const e = fe.c(11);
    let n, r, o;
    e[0] !== t
        ? (({ className: n, orientation: o, ...r } = t), (e[0] = t), (e[1] = n), (e[2] = r), (e[3] = o))
        : ((n = e[1]), (r = e[2]), (o = e[3]));
    const s = o === void 0 ? 'vertical' : o;
    let l;
    e[4] !== n || e[5] !== s ? ((l = Ie(br({ orientation: s }), n)), (e[4] = n), (e[5] = s), (e[6] = l)) : (l = e[6]);
    let a;
    return (
        e[7] !== s || e[8] !== r || e[9] !== l
            ? ((a = x.jsx('div', { role: 'group', 'data-slot': 'field', 'data-orientation': s, className: l, ...r })),
              (e[7] = s),
              (e[8] = r),
              (e[9] = l),
              (e[10] = a))
            : (a = e[10]),
        a
    );
}
function yr(t) {
    const e = fe.c(10);
    let n, r, o;
    e[0] !== t
        ? (({ className: n, htmlFor: r, ...o } = t), (e[0] = t), (e[1] = n), (e[2] = r), (e[3] = o))
        : ((n = e[1]), (r = e[2]), (o = e[3]));
    let s;
    e[4] !== n
        ? ((s = Ie(
              'has-data-checked:bg-primary/5 has-data-checked:border-primary/30 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 gap-2 group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5 group/field-label peer/field-label flex w-fit leading-snug',
              'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
              n
          )),
          (e[4] = n),
          (e[5] = s))
        : (s = e[5]);
    let l;
    return (
        e[6] !== r || e[7] !== o || e[8] !== s
            ? ((l = x.jsx(hr, { 'data-slot': 'field-label', className: s, htmlFor: r, ...o })),
              (e[6] = r),
              (e[7] = o),
              (e[8] = s),
              (e[9] = l))
            : (l = e[9]),
        l
    );
}
function vr(t) {
    const e = fe.c(15);
    let n, r, o, s;
    e[0] !== t
        ? (({ className: r, children: n, errors: o, ...s } = t),
          (e[0] = t),
          (e[1] = n),
          (e[2] = r),
          (e[3] = o),
          (e[4] = s))
        : ((n = e[1]), (r = e[2]), (o = e[3]), (s = e[4]));
    let l;
    if (n) l = n;
    else if (!o) l = null;
    else if (o?.length === 1 && o[0]?.message) l = o[0].message;
    else {
        let d;
        e[5] !== o ? ((d = o.map(Sr)), (e[5] = o), (e[6] = d)) : (d = e[6]);
        let v;
        (e[7] !== d
            ? ((v = x.jsx('ul', { className: 'ml-4 flex list-disc flex-col gap-1', children: d })),
              (e[7] = d),
              (e[8] = v))
            : (v = e[8]),
            (l = v));
    }
    if (!l) return null;
    let a;
    e[9] !== r ? ((a = Ie('text-destructive text-sm font-normal', r)), (e[9] = r), (e[10] = a)) : (a = e[10]);
    let c;
    return (
        e[11] !== l || e[12] !== s || e[13] !== a
            ? ((c = x.jsx('div', { role: 'alert', 'data-slot': 'field-error', className: a, ...s, children: l })),
              (e[11] = l),
              (e[12] = s),
              (e[13] = a),
              (e[14] = c))
            : (c = e[14]),
        c
    );
}
function Sr(t, e) {
    return t?.message ? x.jsx('li', { children: t.message }, e) : null;
}
function Ir(t) {
    const e = fe.c(15),
        { className: n, label: r, labelClassName: o, children: s } = t,
        l = At();
    let a;
    e[0] !== l.state.meta.errors
        ? ((a = ht(l.state.meta.errors)), (e[0] = l.state.meta.errors), (e[1] = a))
        : (a = e[1]);
    const c = a,
        d = !!c,
        v = `${l.name}${l.form.formId}`;
    let m;
    e[2] !== v || e[3] !== r || e[4] !== o
        ? ((m = !!r && x.jsx(yr, { className: o, htmlFor: v, children: r })),
          (e[2] = v),
          (e[3] = r),
          (e[4] = o),
          (e[5] = m))
        : (m = e[5]);
    let f;
    e[6] !== c || e[7] !== d ? ((f = d && x.jsx(vr, { children: c })), (e[6] = c), (e[7] = d), (e[8] = f)) : (f = e[8]);
    let g;
    return (
        e[9] !== s || e[10] !== n || e[11] !== d || e[12] !== m || e[13] !== f
            ? ((g = x.jsxs(xr, { className: n, 'data-invalid': d, children: [m, s, f] })),
              (e[9] = s),
              (e[10] = n),
              (e[11] = d),
              (e[12] = m),
              (e[13] = f),
              (e[14] = g))
            : (g = e[14]),
        g
    );
}
function Rr(t) {
    const e = fe.c(20);
    let n, r, o;
    e[0] !== t
        ? (({ onChange: r, onBlur: n, ...o } = t), (e[0] = t), (e[1] = n), (e[2] = r), (e[3] = o))
        : ((n = e[1]), (r = e[2]), (o = e[3]));
    const s = At();
    let l;
    e[4] !== s.state.meta.errors
        ? ((l = ht(s.state.meta.errors)), (e[4] = s.state.meta.errors), (e[5] = l))
        : (l = e[5]);
    const a = l,
        c = `${s.name}${s.form.formId}`,
        d = !!a,
        v = s.state.value ?? '';
    let m;
    e[6] !== s || e[7] !== r
        ? ((m = (M) => {
              (s.handleChange(M.target.value), r?.(M));
          }),
          (e[6] = s),
          (e[7] = r),
          (e[8] = m))
        : (m = e[8]);
    let f;
    e[9] !== s || e[10] !== n
        ? ((f = (M) => {
              (s.handleBlur(), n?.(M));
          }),
          (e[9] = s),
          (e[10] = n),
          (e[11] = f))
        : (f = e[11]);
    let g;
    return (
        e[12] !== s.name || e[13] !== c || e[14] !== o || e[15] !== d || e[16] !== v || e[17] !== m || e[18] !== f
            ? ((g = x.jsx(fr, { id: c, name: s.name, 'aria-invalid': d, value: v, onChange: m, onBlur: f, ...o })),
              (e[12] = s.name),
              (e[13] = c),
              (e[14] = o),
              (e[15] = d),
              (e[16] = v),
              (e[17] = m),
              (e[18] = f),
              (e[19] = g))
            : (g = e[19]),
        g
    );
}
const Gt = i.createContext(null),
    Xt = i.createContext(null);
function ke() {
    const t = i.useContext(Gt);
    if (t === null) throw new Error(st(60));
    return t;
}
function Kt() {
    const t = i.useContext(Xt);
    if (t === null) throw new Error(st(61));
    return t;
}
const Tr = (t, e) => Object.is(t, e);
function ze(t, e, n) {
    return t == null || e == null ? Object.is(t, e) : n(t, e);
}
function wr(t, e, n) {
    return !t || t.length === 0 ? !1 : t.some((r) => (r === void 0 ? !1 : ze(e, r, n)));
}
function rt(t, e, n) {
    return !t || t.length === 0 ? -1 : t.findIndex((r) => (r === void 0 ? !1 : ze(r, e, n)));
}
function Er(t, e, n) {
    return t.filter((r) => !ze(e, r, n));
}
function wt(t) {
    if (t == null) return '';
    if (typeof t == 'string') return t;
    try {
        return JSON.stringify(t);
    } catch {
        return String(t);
    }
}
function Jt(t) {
    return t != null && t.length > 0 && typeof t[0] == 'object' && t[0] != null && 'items' in t[0];
}
function Cr(t) {
    if (!Array.isArray(t)) return t != null && 'null' in t;
    const e = t;
    if (Jt(e)) {
        for (const n of e) for (const r of n.items) if (r && r.value == null && r.label != null) return !0;
        return !1;
    }
    for (const n of e) if (n && n.value == null && n.label != null) return !0;
    return !1;
}
function Zt(t, e) {
    if (e && t != null) return e(t) ?? '';
    if (t && typeof t == 'object') {
        if ('label' in t && t.label != null) return String(t.label);
        if ('value' in t) return String(t.value);
    }
    return wt(t);
}
function Ye(t, e) {
    return e && t != null
        ? (e(t) ?? '')
        : t && typeof t == 'object' && 'value' in t && 'label' in t
          ? wt(t.value)
          : wt(t);
}
function Qt(t, e, n) {
    function r() {
        return Zt(t, n);
    }
    if (n && t != null) return n(t);
    if (t && typeof t == 'object' && 'label' in t && t.label != null) return t.label;
    if (e && !Array.isArray(e)) return e[t] ?? r();
    if (Array.isArray(e)) {
        const o = e,
            s = Jt(o) ? o.flatMap((l) => l.items) : o;
        if (t == null || typeof t != 'object') {
            const l = s.find((a) => a.value === t);
            return l && l.label != null ? l.label : r();
        }
        if ('value' in t) {
            const l = s.find((a) => a && a.value === t.value);
            if (l && l.label != null) return l.label;
        }
    }
    return r();
}
function Mr(t, e, n) {
    return t.reduce(
        (r, o, s) => (s > 0 && r.push(', '), r.push(x.jsx(i.Fragment, { children: Qt(o, e, n) }, s)), r),
        []
    );
}
const h = {
    id: P((t) => t.id),
    labelId: P((t) => t.labelId),
    modal: P((t) => t.modal),
    multiple: P((t) => t.multiple),
    items: P((t) => t.items),
    itemToStringLabel: P((t) => t.itemToStringLabel),
    itemToStringValue: P((t) => t.itemToStringValue),
    isItemEqualToValue: P((t) => t.isItemEqualToValue),
    value: P((t) => t.value),
    hasSelectedValue: P((t) => {
        const { value: e, multiple: n, itemToStringValue: r } = t;
        return e == null ? !1 : n && Array.isArray(e) ? e.length > 0 : Ye(e, r) !== '';
    }),
    hasNullItemLabel: P((t, e) => (e ? Cr(t.items) : !1)),
    open: P((t) => t.open),
    mounted: P((t) => t.mounted),
    forceMount: P((t) => t.forceMount),
    transitionStatus: P((t) => t.transitionStatus),
    openMethod: P((t) => t.openMethod),
    activeIndex: P((t) => t.activeIndex),
    selectedIndex: P((t) => t.selectedIndex),
    isActive: P((t, e) => t.activeIndex === e),
    isSelected: P((t, e) => {
        const n = t.isItemEqualToValue,
            r = t.value;
        return t.multiple ? Array.isArray(r) && r.some((o) => ze(e, o, n)) : ze(e, r, n);
    }),
    isSelectedByFocus: P((t, e) => t.selectedIndex === e),
    popupProps: P((t) => t.popupProps),
    triggerProps: P((t) => t.triggerProps),
    triggerElement: P((t) => t.triggerElement),
    positionerElement: P((t) => t.positionerElement),
    listElement: P((t) => t.listElement),
    popupSide: P((t) => t.popupSide),
    scrollUpArrowVisible: P((t) => t.scrollUpArrowVisible),
    scrollDownArrowVisible: P((t) => t.scrollDownArrowVisible),
    hasScrollArrows: P((t) => t.hasScrollArrows),
};
function Ar(t, e, n = (r, o) => r === o) {
    return t.length === e.length && t.every((r, o) => n(r, e[o]));
}
function tt(t, e = Number.MIN_SAFE_INTEGER, n = Number.MAX_SAFE_INTEGER) {
    return Math.max(e, Math.min(t, n));
}
const Ve = 1;
function en(t, e) {
    return Math.max(0, t - e);
}
function Pr(t, e) {
    if (e <= 0) return 0;
    const n = tt(t, 0, e),
        r = n,
        o = e - n,
        s = r <= Ve,
        l = o <= Ve;
    return s && l ? (r <= o ? 0 : e) : s ? 0 : l ? e : n;
}
function Vr(t) {
    const {
            id: e,
            value: n,
            defaultValue: r = null,
            onValueChange: o,
            open: s,
            defaultOpen: l = !1,
            onOpenChange: a,
            name: c,
            form: d,
            autoComplete: v,
            disabled: m = !1,
            readOnly: f = !1,
            required: g = !1,
            modal: M = !0,
            actionsRef: O,
            inputRef: R,
            onOpenChangeComplete: H,
            items: j,
            multiple: C = !1,
            itemToStringLabel: S,
            itemToStringValue: V,
            isItemEqualToValue: F = Tr,
            highlightItemOnHover: U = !0,
            children: X,
        } = t,
        { clearErrors: k } = qt(),
        {
            setDirty: K,
            setTouched: ie,
            setFocused: ue,
            validityData: B,
            setFilled: _,
            name: N,
            disabled: re,
            validation: L,
            validationMode: ee,
        } = gt(),
        q = Mt({ id: e }),
        I = re || m,
        u = N ?? c,
        [y, te] = Tt({ controlled: n, default: C ? (r ?? Nt) : r, name: 'Select', state: 'value' }),
        [D, pe] = Tt({ controlled: s, default: l, name: 'Select', state: 'open' }),
        de = i.useRef([]),
        p = i.useRef([]),
        E = i.useRef(null),
        se = i.useRef(null),
        be = i.useRef(0),
        A = i.useRef(null),
        W = i.useRef([]),
        $ = i.useRef(!1),
        ge = i.useRef(null),
        ne = i.useRef(null),
        oe = i.useRef({ allowSelectedMouseUp: !1, allowUnselectedMouseUp: !1, dragY: 0 }),
        le = i.useRef(!1),
        { mounted: J, setMounted: xe, transitionStatus: G } = Ht(D),
        { openMethod: Y, triggerProps: Z } = Gn(D),
        T = _t(
            () =>
                new un({
                    id: q,
                    labelId: void 0,
                    modal: M,
                    multiple: C,
                    itemToStringLabel: S,
                    itemToStringValue: V,
                    isItemEqualToValue: F,
                    value: y,
                    open: D,
                    mounted: J,
                    transitionStatus: G,
                    items: j,
                    forceMount: !1,
                    openMethod: null,
                    activeIndex: null,
                    selectedIndex: null,
                    popupProps: {},
                    triggerProps: {},
                    triggerElement: null,
                    positionerElement: null,
                    listElement: null,
                    popupSide: null,
                    scrollUpArrowVisible: !1,
                    scrollDownArrowVisible: !1,
                    hasScrollArrows: !1,
                })
        ).current,
        Fe = b(T, h.activeIndex),
        ye = b(T, h.selectedIndex),
        Re = b(T, h.triggerElement),
        Ce = b(T, h.positionerElement),
        Ne = dn(Y),
        Be = Y ?? Ne ?? null,
        Je = i.useMemo(() => (C ? '' : Ye(y, V)), [C, y, V]),
        Me = i.useMemo(() => (C && Array.isArray(y) ? y.map((w) => Ye(w, V)) : Ye(y, V)), [C, y, V]),
        _e = Ut(T.state.triggerElement),
        Q = Se(() => Me);
    Wt(_e, q, y, Q, !I, c);
    const Ae = i.useRef(y),
        Pe = C ? Array.isArray(y) && y.length > 0 : y != null && Ye(y, V) !== '';
    (ce(() => {
        y !== Ae.current && T.set('forceMount', !0);
    }, [T, y]),
        ce(() => {
            _(Pe);
        }, [Pe, _]),
        ce(
            function () {
                const z = W.current;
                let he;
                if (C) {
                    const me = Array.isArray(y) ? y : [];
                    if (me.length === 0) he = null;
                    else {
                        const De = me[me.length - 1],
                            $e = rt(z, De, F);
                        he = $e === -1 ? null : $e;
                    }
                } else {
                    const me = rt(z, y, F);
                    he = me === -1 ? null : me;
                }
                (he === null && (ne.current = null), !D && T.set('selectedIndex', he));
            },
            [Pe, C, D, y, W, F, T, ne]
        ));
    function Te(w) {
        const z = B.initialValue;
        return Array.isArray(w) && Array.isArray(z) ? !Ar(w, z, (he, me) => ze(he, me, F)) : w !== z;
    }
    Xn(y, () => {
        (k(u), K(Te(y)), L.change(y));
    });
    const qe = Se((w, z) => {
            (a?.(w, z),
                !z.isCanceled &&
                    (pe(w),
                    !w && (z.reason === fn || z.reason === pn) && (ie(!0), ue(!1), ee === 'onBlur' && L.commit(y))));
        }),
        We = Se(() => {
            (xe(!1), T.update({ activeIndex: null, openMethod: null }), H?.(!1));
        });
    (Et({
        enabled: !O,
        open: D,
        ref: E,
        onComplete() {
            D || We();
        },
    }),
        i.useImperativeHandle(O, () => ({ unmount: We }), [We]));
    const Oe = Se((w, z) => {
            (o?.(w, z), !z.isCanceled && te(w));
        }),
        we = Se(() => {
            const w = T.state.listElement || E.current;
            if (!w) return;
            const z = en(w.scrollHeight, w.clientHeight),
                he = Pr(w.scrollTop, z),
                me = he > 0,
                De = he < z;
            (T.state.scrollUpArrowVisible !== me && T.set('scrollUpArrowVisible', me),
                T.state.scrollDownArrowVisible !== De && T.set('scrollDownArrowVisible', De));
        }),
        He = mn({ open: D, onOpenChange: qe, elements: { reference: Re, floating: Ce } }),
        Ge = gn(He, { enabled: !f && !I, event: 'mousedown' }),
        Xe = hn(He),
        Le = bn(He, {
            enabled: !f && !I,
            listRef: de,
            activeIndex: Fe,
            selectedIndex: ye,
            disabledIndices: Nt,
            onNavigate(w) {
                (w === null && !D) || T.set('activeIndex', w);
            },
            focusItemOnHover: U,
        }),
        Ue = xn(He, {
            enabled: !f && !I && (D || !C),
            listRef: p,
            activeIndex: Fe,
            selectedIndex: ye,
            disabledIndices: (w) => pr(de.current[w]),
            onMatch(w) {
                D ? T.set('activeIndex', w) : Oe(W.current[w], Ee('none'));
            },
            onTyping(w) {
                $.current = w;
            },
        }),
        Ze = i.useMemo(() => {
            const w = Rt(Ue.reference, Le.reference, Xe.reference, Ge.reference, Z);
            return (q && (w.id = q), w);
        }, [Ge.reference, Ue.reference, Le.reference, Xe.reference, Z, q]),
        Qe = i.useMemo(() => Rt(yn, Ue.floating, Le.floating, Xe.floating), [Ue.floating, Le.floating, Xe.floating]),
        ot = Le.item ?? Bt;
    (vn(() => {
        T.update({ popupProps: Qe, triggerProps: Ze });
    }),
        ce(() => {
            T.update({
                id: q,
                modal: M,
                multiple: C,
                value: y,
                open: D,
                mounted: J,
                transitionStatus: G,
                popupProps: Qe,
                triggerProps: Ze,
                items: j,
                itemToStringLabel: S,
                itemToStringValue: V,
                isItemEqualToValue: F,
                openMethod: Be,
            });
        }, [T, q, M, C, y, D, J, G, Qe, Ze, j, S, V, F, Be]));
    const ve = i.useMemo(
            () => ({
                store: T,
                name: u,
                required: g,
                disabled: I,
                readOnly: f,
                multiple: C,
                highlightItemOnHover: U,
                setValue: Oe,
                setOpen: qe,
                listRef: de,
                popupRef: E,
                scrollHandlerRef: se,
                handleScrollArrowVisibility: we,
                scrollArrowsMountedCountRef: be,
                itemProps: ot,
                valueRef: A,
                valuesRef: W,
                labelsRef: p,
                typingRef: $,
                selectionRef: oe,
                firstItemTextRef: ge,
                selectedItemTextRef: ne,
                validation: L,
                onOpenChangeComplete: H,
                alignItemWithTriggerActiveRef: le,
                initialValueRef: Ae,
            }),
            [T, u, g, I, f, C, U, Oe, qe, ot, L, H, we]
        ),
        Ke = Sn(R, L.inputRef),
        lt = C && Array.isArray(y) && y.length > 0,
        it = C ? void 0 : u,
        bt = i.useMemo(
            () =>
                !C || !Array.isArray(y) || !u
                    ? null
                    : y.map((w) => {
                          const z = Ye(w, V);
                          return x.jsx('input', { type: 'hidden', form: d, name: u, value: z, disabled: I }, z);
                      }),
            [C, y, d, u, V, I]
        );
    return x.jsx(Gt.Provider, {
        value: ve,
        children: x.jsxs(Xt.Provider, {
            value: He,
            children: [
                X,
                x.jsx('input', {
                    ...L.getValidationProps(I, {
                        onFocus() {
                            T.state.triggerElement?.focus({ focusVisible: !0 });
                        },
                        onChange(w) {
                            if (w.nativeEvent.defaultPrevented || I || f) return;
                            const z = w.currentTarget.value,
                                he = Ee(mt, w.nativeEvent);
                            function me() {
                                if (C) return;
                                const De = z.toLowerCase();
                                let $e = W.current.findIndex(
                                    (xt) => Ye(xt, V).toLowerCase() === De || Zt(xt, S).toLowerCase() === De
                                );
                                $e === -1 &&
                                    ($e = W.current.findIndex((xt, rn) => {
                                        const Ft = p.current[rn];
                                        return Ft != null && Ft.toLowerCase() === De;
                                    }));
                                const Vt = $e === -1 ? void 0 : W.current[$e];
                                Vt != null && Oe(Vt, he);
                            }
                            (T.set('forceMount', !0), queueMicrotask(me));
                        },
                    }),
                    id: q && it == null ? `${q}-hidden-input` : void 0,
                    form: d,
                    name: it,
                    autoComplete: v,
                    value: Je,
                    disabled: I,
                    required: g && !lt,
                    readOnly: f,
                    ref: Ke,
                    style: u ? In : Rn,
                    tabIndex: -1,
                    'aria-hidden': !0,
                    suppressHydrationWarning: !0,
                }),
                bt,
            ],
        }),
    });
}
function Fr(t, e) {
    return t ?? e;
}
const at = 2,
    Nr = 400,
    Or = { ...wn, ...zt, popupSide: (t) => (t ? { 'data-popup-side': t } : null), value: () => null },
    Lr = i.forwardRef(function (e, n) {
        const { render: r, className: o, id: s, disabled: l = !1, nativeButton: a = !0, style: c, ...d } = e,
            { setTouched: v, setFocused: m, validationMode: f, state: g, disabled: M } = gt(),
            { labelId: O } = Ct(),
            {
                store: R,
                setOpen: H,
                selectionRef: j,
                validation: C,
                readOnly: S,
                required: V,
                alignItemWithTriggerActiveRef: F,
                disabled: U,
            } = ke(),
            X = M || U || l,
            k = b(R, h.open),
            K = b(R, h.mounted),
            ie = b(R, h.value),
            ue = b(R, h.triggerProps),
            B = b(R, h.positionerElement),
            _ = b(R, h.listElement),
            N = b(R, h.popupSide),
            re = b(R, h.id),
            L = b(R, h.labelId),
            ee = b(R, h.hasSelectedValue),
            q = K && B ? N : null,
            I = s ?? re,
            u = Fr(O, L);
        Mt({ id: I });
        const y = Ut(B),
            te = i.useRef(null),
            { getButtonProps: D, buttonRef: pe } = $t({ disabled: X, native: a }),
            de = Se(($) => {
                R.set('triggerElement', $);
            }),
            p = yt(),
            E = yt(),
            se = yt();
        i.useEffect(() => {
            if (k)
                return (
                    se.start(Nr, () => {
                        ((j.current.allowUnselectedMouseUp = !0), (j.current.allowSelectedMouseUp = !0));
                    }),
                    () => {
                        se.clear();
                    }
                );
            ((j.current = { allowSelectedMouseUp: !1, allowUnselectedMouseUp: !1, dragY: 0 }), E.clear());
        }, [k, j, E, se]);
        const be = Rt(
                ue,
                {
                    id: I,
                    role: 'combobox',
                    'aria-expanded': k ? 'true' : 'false',
                    'aria-haspopup': 'listbox',
                    'aria-controls': k ? (_?.id ?? Tn(B)?.id) : void 0,
                    'aria-labelledby': u,
                    'aria-readonly': S || void 0,
                    'aria-required': V || void 0,
                    tabIndex: X ? -1 : 0,
                    onFocus($) {
                        (m(!0),
                            k && F.current && H(!1, Ee(mt, $.nativeEvent)),
                            p.start(0, () => {
                                R.set('forceMount', !0);
                            }));
                    },
                    onBlur($) {
                        vt(B, $.relatedTarget) || (v(!0), m(!1), f === 'onBlur' && C.commit(ie));
                    },
                    onMouseDown($) {
                        if (k) return;
                        const ge = ft($.currentTarget);
                        function ne(oe) {
                            if (!te.current) return;
                            const le = oe.target;
                            if (vt(te.current, le) || vt(y.current, le)) return;
                            const J = Kn(te.current);
                            (oe.clientX >= J.left - at &&
                                oe.clientX <= J.right + at &&
                                oe.clientY >= J.top - at &&
                                oe.clientY <= J.bottom + at) ||
                                H(!1, Ee(En, oe));
                        }
                        E.start(0, () => {
                            ge.addEventListener('mouseup', ne, { once: !0 });
                        });
                    },
                },
                d,
                D
            ),
            A = C.getValidationProps(X, be);
        A.role = 'combobox';
        const W = { ...g, open: k, disabled: X, value: ie, readOnly: S, popupSide: q, placeholder: !ee };
        return je('button', e, { ref: [n, te, pe, de], state: W, stateAttributesMapping: Or, props: A });
    }),
    Dr = { value: () => null },
    jr = i.forwardRef(function (e, n) {
        const { className: r, render: o, children: s, placeholder: l, style: a, ...c } = e,
            { store: d, valueRef: v } = ke(),
            m = b(d, h.value),
            f = b(d, h.items),
            g = b(d, h.itemToStringLabel),
            M = b(d, h.hasSelectedValue),
            O = !M && l != null && s == null,
            R = b(d, h.hasNullItemLabel, O),
            H = { value: m, placeholder: !M };
        let j = null;
        return (
            typeof s == 'function'
                ? (j = s(m))
                : s != null
                  ? (j = s)
                  : !M && l != null && !R
                    ? (j = l)
                    : Array.isArray(m)
                      ? (j = Mr(m, f, g))
                      : (j = Qt(m, f, g)),
            je('span', e, { state: H, ref: [n, v], props: [{ children: j }, c], stateAttributesMapping: Dr })
        );
    }),
    kr = i.forwardRef(function (e, n) {
        const { render: r, className: o, style: s, ...l } = e,
            { store: a } = ke(),
            d = { open: b(a, h.open) };
        return je('span', e, {
            state: d,
            ref: n,
            props: [{ 'aria-hidden': !0, children: '▼' }, l],
            stateAttributesMapping: Cn,
        });
    }),
    Br = i.createContext(void 0),
    _r = i.forwardRef(function (e, n) {
        const { store: r } = ke(),
            o = b(r, h.mounted),
            s = b(r, h.forceMount);
        return o || s ? x.jsx(Br.Provider, { value: !0, children: x.jsx(Mn, { ref: n, ...e }) }) : null;
    }),
    tn = i.createContext(void 0);
function Hr() {
    const t = i.useContext(tn);
    if (!t) throw new Error(st(59));
    return t;
}
function pt(t, e) {
    t && Object.assign(t.style, e);
}
const Ur = { position: 'relative', maxHeight: '100%', overflowX: 'hidden', overflowY: 'auto' },
    $r = { position: 'fixed' },
    Yr = i.forwardRef(function (e, n) {
        const {
                anchor: r,
                positionMethod: o = 'absolute',
                className: s,
                render: l,
                side: a = 'bottom',
                align: c = 'center',
                sideOffset: d = 0,
                alignOffset: v = 0,
                collisionBoundary: m = 'clipping-ancestors',
                collisionPadding: f,
                arrowPadding: g = 5,
                sticky: M = !1,
                disableAnchorTracking: O,
                alignItemWithTrigger: R = !0,
                collisionAvoidance: H = An,
                style: j,
                ...C
            } = e,
            {
                store: S,
                listRef: V,
                labelsRef: F,
                alignItemWithTriggerActiveRef: U,
                selectedItemTextRef: X,
                valuesRef: k,
                initialValueRef: K,
                popupRef: ie,
                setValue: ue,
            } = ke(),
            B = Kt(),
            _ = b(S, h.open),
            N = b(S, h.mounted),
            re = b(S, h.modal),
            L = b(S, h.value),
            ee = b(S, h.openMethod),
            q = b(S, h.positionerElement),
            I = b(S, h.triggerElement),
            u = b(S, h.isItemEqualToValue),
            y = b(S, h.transitionStatus),
            te = i.useRef(null),
            D = i.useRef(null),
            [pe, de] = i.useState(R),
            p = N && pe && ee !== 'touch';
        (!N && pe !== R && de(R),
            ce(() => {
                N ||
                    (h.scrollUpArrowVisible(S.state) && S.set('scrollUpArrowVisible', !1),
                    h.scrollDownArrowVisible(S.state) && S.set('scrollDownArrowVisible', !1));
            }, [S, N]),
            i.useImperativeHandle(U, () => p),
            Jn((p || re) && _, ee === 'touch', q, I));
        const E = Pn({
                anchor: r,
                floatingRootContext: B,
                positionMethod: o,
                mounted: N,
                side: a,
                sideOffset: d,
                align: c,
                alignOffset: v,
                arrowPadding: g,
                collisionBoundary: m,
                collisionPadding: f,
                sticky: M,
                disableAnchorTracking: O ?? p,
                collisionAvoidance: H,
                keepMounted: !0,
            }),
            se = p ? 'none' : E.side,
            be = p ? $r : E.positionerStyles,
            A = { open: _, side: se, align: E.align, anchorHidden: E.anchorHidden };
        ce(() => {
            S.set('popupSide', E.side);
        }, [S, E.side]);
        const W = Se((le) => {
                S.set('positionerElement', le);
            }),
            $ = Vn(e, A, { styles: be, transitionStatus: y, props: C, refs: [n, W], hidden: !N, inert: !_ }),
            ge = i.useRef(0),
            ne = Se((le) => {
                if ((le.size === 0 && ge.current === 0) || k.current.length === 0) return;
                const J = ge.current;
                if (((ge.current = le.size), le.size === J)) return;
                const xe = Ee(mt);
                if (J !== 0 && !S.state.multiple && L !== null && rt(k.current, L, u) === -1) {
                    const Y = K.current,
                        T = Y != null && rt(k.current, Y, u) !== -1 ? Y : null;
                    (ue(T, xe), T === null && (S.set('selectedIndex', null), (X.current = null)));
                }
                if (J !== 0 && S.state.multiple && Array.isArray(L)) {
                    const G = (Z) => rt(k.current, Z, u) !== -1,
                        Y = L.filter((Z) => G(Z));
                    (Y.length !== L.length || Y.some((Z) => !wr(L, Z, u))) &&
                        (ue(Y, xe), Y.length === 0 && (S.set('selectedIndex', null), (X.current = null)));
                }
                if (_ && p) {
                    S.update({ scrollUpArrowVisible: !1, scrollDownArrowVisible: !1 });
                    const G = { height: '' };
                    (pt(q, G), pt(ie.current, G));
                }
            }),
            oe = i.useMemo(
                () => ({
                    ...E,
                    side: se,
                    alignItemWithTriggerActive: p,
                    setControlledAlignItemWithTrigger: de,
                    scrollUpArrowRef: te,
                    scrollDownArrowRef: D,
                }),
                [E, se, p, de]
            );
        return x.jsx(Zn, {
            elementsRef: V,
            labelsRef: F,
            onMapChange: ne,
            children: x.jsxs(tn.Provider, {
                value: oe,
                children: [N && re && x.jsx(nr, { inert: Fn(!_), cutout: I }), $],
            }),
        });
    }),
    ct = 'base-ui-disable-scrollbar',
    Lt = {
        className: ct,
        getElement(t) {
            return x.jsx('style', {
                nonce: t,
                href: ct,
                precedence: 'base-ui:low',
                children: `.${ct}{scrollbar-width:none}.${ct}::-webkit-scrollbar{display:none}`,
            });
        },
    },
    zr = i.createContext(void 0),
    qr = { disableStyleElements: !1 };
function Wr() {
    return i.useContext(zr) ?? qr;
}
const Gr = { ...jn, ...Yt },
    Xr = i.forwardRef(function (e, n) {
        const { render: r, className: o, style: s, finalFocus: l, ...a } = e,
            {
                store: c,
                popupRef: d,
                onOpenChangeComplete: v,
                setOpen: m,
                valueRef: f,
                firstItemTextRef: g,
                selectedItemTextRef: M,
                multiple: O,
                handleScrollArrowVisibility: R,
                scrollHandlerRef: H,
                listRef: j,
                highlightItemOnHover: C,
            } = ke(),
            {
                side: S,
                align: V,
                alignItemWithTriggerActive: F,
                isPositioned: U,
                setControlledAlignItemWithTrigger: X,
            } = Hr(),
            k = Qn() != null,
            K = Kt(),
            ie = Nn(),
            { nonce: ue, disableStyleElements: B } = Wr(),
            _ = b(c, h.id),
            N = b(c, h.open),
            re = b(c, h.openMethod),
            L = b(c, h.mounted),
            ee = b(c, h.popupProps),
            q = b(c, h.transitionStatus),
            I = b(c, h.triggerElement),
            u = b(c, h.positionerElement),
            y = b(c, h.listElement),
            te = i.useRef(!1),
            D = i.useRef(!1),
            pe = i.useRef({}),
            de = On(),
            p = Se((A) => {
                if (!u || !d.current || !D.current) return;
                if (te.current || !F) {
                    R();
                    return;
                }
                const W = u.style.top === '0px',
                    $ = u.style.bottom === '0px';
                if (!W && !$) {
                    R();
                    return;
                }
                const ge = jt(u),
                    ne = nt(u.getBoundingClientRect().height, 'y', ge),
                    oe = ft(u),
                    le = St(u),
                    J = le.getComputedStyle(u),
                    xe = parseFloat(J.marginTop),
                    G = parseFloat(J.marginBottom),
                    Y = Dt(le.getComputedStyle(d.current)),
                    Z = Math.min(oe.documentElement.clientHeight - xe - G, Y),
                    T = A.scrollTop,
                    Fe = ut(A);
                let ye = 0,
                    Re = null,
                    Ce = !1,
                    Ne = !1;
                const Be = (Q) => {
                        u.style.height = `${Q}px`;
                    },
                    Je = (Q, Ae) => {
                        const Pe = tt(Q, 0, Z - ne);
                        (Pe > 0 && Be(ne + Pe), (A.scrollTop = Ae), Z - (ne + Pe) <= Ve && (te.current = !0), R());
                    },
                    Me = W ? Fe - T : T,
                    _e = Math.min(ne + Me, Z);
                if (((ye = _e), Me <= Ve)) {
                    Je(Me, W ? Fe : 0);
                    return;
                }
                if (Z - _e > Ve) W ? (Ne = !0) : (Re = 0);
                else if (((Ce = !0), $ && T < Fe)) {
                    const Q = ne + Me - Z;
                    Re = T - (Me - Q);
                }
                if (((ye = Math.ceil(ye)), ye !== 0 && Be(ye), Ne || Re != null)) {
                    const Q = ut(A),
                        Ae = Ne ? Q : tt(Re, 0, Q);
                    Math.abs(A.scrollTop - Ae) > Ve && (A.scrollTop = Ae);
                }
                ((Ce || ye >= Z - Ve) && (te.current = !0), R());
            });
        (i.useImperativeHandle(H, () => p, [p]),
            Et({
                open: N,
                ref: d,
                onComplete() {
                    N && v?.(!0);
                },
            }));
        const E = { open: N, transitionStatus: q, side: S, align: V };
        (ce(() => {
            !u ||
                !d.current ||
                Object.keys(pe.current).length ||
                (pe.current = {
                    top: u.style.top || '0',
                    left: u.style.left || '0',
                    right: u.style.right,
                    height: u.style.height,
                    bottom: u.style.bottom,
                    minHeight: u.style.minHeight,
                    maxHeight: u.style.maxHeight,
                    marginTop: u.style.marginTop,
                    marginBottom: u.style.marginBottom,
                });
        }, [d, u]),
            ce(() => {
                N || F || ((D.current = !1), (te.current = !1), pt(u, pe.current));
            }, [N, F, u, d]),
            ce(() => {
                const A = d.current;
                if (!N || !I || !u || !A || (F && !U) || c.state.transitionStatus === 'ending') return;
                if (!F) {
                    ((D.current = !0), de.request(R), A.style.removeProperty('--transform-origin'));
                    return;
                }
                const W = Kr(A);
                A.style.removeProperty('--transform-origin');
                try {
                    let $ = M.current;
                    $?.isConnected || ($ = !h.hasSelectedValue(c.state) && g.current?.isConnected ? g.current : null);
                    const ge = f.current,
                        ne = St(u),
                        oe = ne.getComputedStyle(u),
                        le = ne.getComputedStyle(A),
                        J = ft(I),
                        xe = jt(I),
                        G = dt(I.getBoundingClientRect(), xe),
                        Y = dt(u.getBoundingClientRect(), xe),
                        Z = G.height,
                        T = y || A,
                        Fe = T.scrollHeight,
                        ye = parseFloat(le.borderBottomWidth),
                        Re = parseFloat(oe.marginTop) || 10,
                        Ce = parseFloat(oe.marginBottom) || 10,
                        Ne = parseFloat(oe.minHeight) || 100,
                        Be = Dt(le),
                        Je = 5,
                        Me = 5,
                        _e = 20,
                        Q = J.documentElement.clientHeight - Re - Ce,
                        Ae = J.documentElement.clientWidth,
                        Pe = Q - G.bottom + Z;
                    let Te,
                        qe = ie === 'rtl' ? G.right - Y.width : G.left,
                        We = 0;
                    if ($ && ge) {
                        const ve = dt(ge.getBoundingClientRect(), xe);
                        ((Te = dt($.getBoundingClientRect(), xe)),
                            (qe = Y.left + (ie === 'rtl' ? ve.right - Te.right : ve.left - Te.left)));
                        const Ke = ve.top - G.top + ve.height / 2;
                        We = Te.top - Y.top + Te.height / 2 - Ke;
                    }
                    const Oe = Pe + We + Ce + ye;
                    let we = Math.min(Q, Oe);
                    const He = Q - Re - Ce,
                        Ge = Oe - we,
                        Xe = Ae - Me;
                    ((u.style.left = `${tt(qe, Je, Xe - Y.width)}px`),
                        (u.style.height = `${we}px`),
                        (u.style.maxHeight = 'none'),
                        (u.style.marginTop = `${Re}px`),
                        (u.style.marginBottom = `${Ce}px`),
                        (A.style.height = '100%'));
                    const Le = ut(T),
                        Ue = Ge >= Le - Ve;
                    Ue && (we = Math.min(Q, Y.height) - (Ge - Le));
                    const Ze = G.top < _e || G.bottom > Q - _e || Math.ceil(we) + Ve < Math.min(Fe, Ne),
                        Qe = (ne.visualViewport?.scale ?? 1) !== 1 && Ln;
                    if (Ze || Qe) {
                        ((D.current = !0), pt(u, pe.current), X(!1));
                        return;
                    }
                    const ot = Math.max(Ne, we);
                    if (Ue) {
                        const ve = Math.max(0, Q - Oe);
                        ((u.style.top = Y.height >= He ? '0' : `${ve}px`),
                            (u.style.height = `${we}px`),
                            (T.scrollTop = ut(T)));
                    } else ((u.style.bottom = '0'), (T.scrollTop = Ge));
                    if (Te) {
                        const ve = Y.top,
                            Ke = Y.height,
                            lt = Te.top + Te.height / 2,
                            it = Ke > 0 ? ((lt - ve) / Ke) * 100 : 50,
                            bt = tt(it, 0, 100);
                        A.style.setProperty('--transform-origin', `50% ${bt}%`);
                    }
                    ((ot === Q || we >= Be) && (te.current = !0),
                        R(),
                        C &&
                            c.state.selectedIndex === null &&
                            c.state.activeIndex === null &&
                            j.current[0] != null &&
                            c.set('activeIndex', 0),
                        (D.current = !0));
                } finally {
                    W();
                }
            }, [c, N, u, I, f, g, M, d, R, F, X, de, y, j, C, ie, U]),
            i.useEffect(() => {
                if (!F || !u || !N) return;
                const A = St(u);
                function W($) {
                    m(!1, Ee(Un, $));
                }
                return Dn(A, 'resize', W);
            }, [m, F, u, N]));
        const se = {
                ...(y
                    ? { role: 'presentation', 'aria-orientation': void 0 }
                    : { role: 'listbox', 'aria-multiselectable': O || void 0, id: `${_}-list` }),
                onKeyDown(A) {
                    k && rr.has(A.key) && A.stopPropagation();
                },
                onScroll(A) {
                    y || p(A.currentTarget);
                },
                ...(F && { style: y ? { height: '100%' } : Ur }),
            },
            be = je('div', e, {
                ref: [n, d],
                state: E,
                stateAttributesMapping: Gr,
                props: [ee, se, kn(q), { className: !y && F ? Lt.className : void 0 }, a],
            });
        return x.jsxs(i.Fragment, {
            children: [
                !B && Lt.getElement(ue),
                x.jsx(Bn, {
                    context: K,
                    modal: !1,
                    disabled: !L,
                    openInteractionType: re,
                    returnFocus: l,
                    restoreFocus: !0,
                    children: be,
                }),
            ],
        });
    });
function Dt(t) {
    const e = t.maxHeight || '';
    return (e.endsWith('px') && parseFloat(e)) || 1 / 0;
}
function ut(t) {
    return en(t.scrollHeight, t.clientHeight);
}
function jt(t) {
    return _n.getScale(t);
}
function nt(t, e, n) {
    return t / n[e];
}
function dt(t, e) {
    return Hn({ x: nt(t.x, 'x', e), y: nt(t.y, 'y', e), width: nt(t.width, 'x', e), height: nt(t.height, 'y', e) });
}
const kt = [
    ['transform', 'none'],
    ['scale', '1'],
    ['translate', '0 0'],
];
function Kr(t) {
    const { style: e } = t,
        n = {};
    for (const [r, o] of kt) ((n[r] = e.getPropertyValue(r)), e.setProperty(r, o, 'important'));
    return () => {
        for (const [r] of kt) {
            const o = n[r];
            o ? e.setProperty(r, o) : e.removeProperty(r);
        }
    };
}
const nn = i.createContext(void 0);
function Pt() {
    const t = i.useContext(nn);
    if (!t) throw new Error(st(57));
    return t;
}
const Jr = i.memo(
        i.forwardRef(function (e, n) {
            const {
                    render: r,
                    className: o,
                    style: s,
                    value: l = null,
                    label: a,
                    disabled: c = !1,
                    nativeButton: d = !1,
                    ...v
                } = e,
                m = i.useRef(null),
                f = er({ label: a, textRef: m, indexGuessBehavior: tr.GuessFromOrder }),
                {
                    store: g,
                    itemProps: M,
                    setOpen: O,
                    setValue: R,
                    selectionRef: H,
                    typingRef: j,
                    valuesRef: C,
                    multiple: S,
                    selectedItemTextRef: V,
                    disabled: F,
                    readOnly: U,
                } = ke(),
                X = b(g, h.isActive, f.index),
                k = b(g, h.open),
                K = b(g, h.isSelected, l),
                ie = b(g, h.isSelectedByFocus, f.index),
                ue = b(g, h.isItemEqualToValue),
                B = f.index,
                _ = B !== -1,
                N = i.useRef(null);
            (ce(() => {
                if (!_) return;
                const p = C.current;
                return (
                    (p[B] = l),
                    () => {
                        delete p[B];
                    }
                );
            }, [_, B, l, C]),
                ce(() => {
                    if (!_) return;
                    const p = g.state.value;
                    let E = p;
                    (S && Array.isArray(p) && (E = p.length > 0 ? p[p.length - 1] : void 0),
                        E !== void 0 &&
                            ze(l, E, ue) &&
                            (g.set('selectedIndex', B), m.current && (V.current = m.current)));
                }, [_, B, S, ue, g, l, V]));
            const re = i.useRef(null),
                L = i.useRef('mouse'),
                ee = i.useRef(!1),
                { getButtonProps: q, buttonRef: I } = $t({
                    disabled: c,
                    focusableWhenDisabled: !0,
                    native: d,
                    composite: !0,
                }),
                u = { disabled: c, selected: K, highlighted: X };
            function y(p) {
                if (F || U) return;
                const E = g.state.value;
                if (S) {
                    const se = Array.isArray(E) ? E : [],
                        be = K ? Er(se, l, ue) : [...se, l];
                    R(be, Ee(It, p));
                } else (R(l, Ee(It, p)), O(!1, Ee(It, p)));
            }
            function te() {
                H.current.dragY = 0;
            }
            const D = {
                    role: 'option',
                    'aria-selected': K,
                    tabIndex: k && X ? 0 : -1,
                    onKeyDown(p) {
                        ((re.current = p.key),
                            g.set('activeIndex', B),
                            p.key === ' ' && j.current && p.preventDefault());
                    },
                    onClick(p) {
                        const E = p.type === 'click' && L.current !== 'touch',
                            se = p.nativeEvent.pointerType,
                            be = E && $n(p.nativeEvent) && (se !== void 0 || X),
                            A = E && !be && !ee.current;
                        ((ee.current = !1),
                            !(p.type === 'keydown' && re.current === null) &&
                                (c ||
                                    (p.type === 'keydown' && re.current === ' ' && j.current) ||
                                    A ||
                                    ((re.current = null), y(p.nativeEvent))));
                    },
                    onPointerEnter(p) {
                        L.current = p.pointerType;
                    },
                    onPointerMove(p) {
                        if (p.pointerType === 'mouse' && p.buttons === 1) {
                            const E = H.current;
                            ((E.dragY += p.movementY), E.dragY ** 2 >= 64 && (E.allowUnselectedMouseUp = !0));
                        }
                    },
                    onPointerDown(p) {
                        ((L.current = p.pointerType), (ee.current = !0), te());
                    },
                    onMouseUp() {
                        if ((te(), c || L.current === 'touch' || ee.current)) return;
                        const p = !H.current.allowSelectedMouseUp && K,
                            E = !H.current.allowUnselectedMouseUp && !K;
                        p || E || ((ee.current = !0), N.current?.click(), (ee.current = !1));
                    },
                },
                pe = je('div', e, { ref: [I, n, f.ref, N], state: u, props: [M, D, v, q] }),
                de = i.useMemo(
                    () => ({ selected: K, index: B, textRef: m, selectedByFocus: ie, hasRegistered: _ }),
                    [K, B, m, ie, _]
                );
            return x.jsx(nn.Provider, { value: de, children: pe });
        })
    ),
    Zr = i.forwardRef(function (e, n) {
        const r = e.keepMounted ?? !1,
            { selected: o } = Pt();
        return r || o ? x.jsx(Qr, { ...e, ref: n }) : null;
    }),
    Qr = i.memo(
        i.forwardRef((t, e) => {
            const { render: n, className: r, style: o, keepMounted: s, ...l } = t,
                { selected: a } = Pt(),
                c = i.useRef(null),
                { transitionStatus: d, setMounted: v } = Ht(a),
                f = je('span', t, {
                    ref: [e, c],
                    state: { selected: a, transitionStatus: d },
                    props: [{ 'aria-hidden': !0, children: '✔️' }, l],
                    stateAttributesMapping: Yt,
                });
            return (
                Et({
                    open: a,
                    ref: c,
                    onComplete() {
                        a || v(!1);
                    },
                }),
                f
            );
        })
    ),
    es = i.memo(
        i.forwardRef(function (e, n) {
            const { index: r, textRef: o, selectedByFocus: s, hasRegistered: l } = Pt(),
                { firstItemTextRef: a, selectedItemTextRef: c } = ke(),
                { render: d, className: v, style: m, ...f } = e,
                g = i.useCallback(
                    (O) => {
                        O && (l && r === 0 && (a.current = O), l && s && (c.current = O));
                    },
                    [a, c, r, s, l]
                );
            return je('div', e, { ref: [g, n, o], props: f });
        })
    ),
    ts = Vr;
function ns(t) {
    const e = fe.c(11);
    let n, r, o;
    e[0] !== t
        ? (({ className: r, children: n, ...o } = t), (e[0] = t), (e[1] = n), (e[2] = r), (e[3] = o))
        : ((n = e[1]), (r = e[2]), (o = e[3]));
    let s;
    e[4] !== r
        ? ((s = Ie(
              'dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 flex h-8 w-full min-w-0 items-center justify-between gap-2 rounded-lg border bg-transparent px-2.5 py-1 text-base outline-none motion-safe:transition-colors md:text-sm aria-invalid:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate',
              r
          )),
          (e[4] = r),
          (e[5] = s))
        : (s = e[5]);
    let l;
    e[6] === Symbol.for('react.memo_cache_sentinel')
        ? ((l = x.jsx(kr, {
              className: 'text-muted-foreground shrink-0',
              children: x.jsx(Yn, { className: 'size-3.5' }),
          })),
          (e[6] = l))
        : (l = e[6]);
    let a;
    return (
        e[7] !== n || e[8] !== o || e[9] !== s
            ? ((a = x.jsxs(Lr, { 'data-slot': 'select-trigger', className: s, ...o, children: [n, l] })),
              (e[7] = n),
              (e[8] = o),
              (e[9] = s),
              (e[10] = a))
            : (a = e[10]),
        a
    );
}
function rs(t) {
    const e = fe.c(8);
    let n, r;
    e[0] !== t ? (({ className: n, ...r } = t), (e[0] = t), (e[1] = n), (e[2] = r)) : ((n = e[1]), (r = e[2]));
    let o;
    e[3] !== n ? ((o = Ie('data-[empty]:text-muted-foreground', n)), (e[3] = n), (e[4] = o)) : (o = e[4]);
    let s;
    return (
        e[5] !== r || e[6] !== o
            ? ((s = x.jsx(jr, { 'data-slot': 'select-value', className: o, ...r })), (e[5] = r), (e[6] = o), (e[7] = s))
            : (s = e[7]),
        s
    );
}
function ss(t) {
    const e = fe.c(14);
    let n, r, o, s;
    e[0] !== t
        ? (({ className: r, children: n, positionerProps: o, ...s } = t),
          (e[0] = t),
          (e[1] = n),
          (e[2] = r),
          (e[3] = o),
          (e[4] = s))
        : ((n = e[1]), (r = e[2]), (o = e[3]), (s = e[4]));
    let l;
    e[5] !== r
        ? ((l = Ie(
              'bg-popover text-popover-foreground border-border max-h-[min(24rem,var(--available-height))] min-w-[var(--anchor-width)] overflow-y-auto rounded-lg border p-1 shadow-md outline-none',
              r
          )),
          (e[5] = r),
          (e[6] = l))
        : (l = e[6]);
    let a;
    e[7] !== n || e[8] !== s || e[9] !== l
        ? ((a = x.jsx(Xr, { 'data-slot': 'select-content', className: l, ...s, children: n })),
          (e[7] = n),
          (e[8] = s),
          (e[9] = l),
          (e[10] = a))
        : (a = e[10]);
    let c;
    return (
        e[11] !== o || e[12] !== a
            ? ((c = x.jsx(_r, {
                  children: x.jsx(Yr, { sideOffset: 4, className: 'z-50 outline-none', ...o, children: a }),
              })),
              (e[11] = o),
              (e[12] = a),
              (e[13] = c))
            : (c = e[13]),
        c
    );
}
function os(t) {
    const e = fe.c(13);
    let n, r, o;
    e[0] !== t
        ? (({ className: r, children: n, ...o } = t), (e[0] = t), (e[1] = n), (e[2] = r), (e[3] = o))
        : ((n = e[1]), (r = e[2]), (o = e[3]));
    let s;
    e[4] !== r
        ? ((s = Ie(
              'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default select-none items-center gap-2 rounded-md py-1.5 pl-2 pr-8 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
              r
          )),
          (e[4] = r),
          (e[5] = s))
        : (s = e[5]);
    let l;
    e[6] !== n ? ((l = x.jsx(es, { children: n })), (e[6] = n), (e[7] = l)) : (l = e[7]);
    let a;
    e[8] === Symbol.for('react.memo_cache_sentinel')
        ? ((a = x.jsx(Zr, {
              className: 'absolute right-2 flex items-center',
              children: x.jsx(zn, { className: 'size-4' }),
          })),
          (e[8] = a))
        : (a = e[8]);
    let c;
    return (
        e[9] !== o || e[10] !== s || e[11] !== l
            ? ((c = x.jsxs(Jr, { 'data-slot': 'select-item', className: s, ...o, children: [l, a] })),
              (e[9] = o),
              (e[10] = s),
              (e[11] = l),
              (e[12] = c))
            : (c = e[12]),
        c
    );
}
function ls(t) {
    const e = fe.c(23),
        { items: n, placeholder: r, disabled: o } = t,
        s = At();
    let l;
    e[0] !== s.state.meta.errors
        ? ((l = ht(s.state.meta.errors)), (e[0] = s.state.meta.errors), (e[1] = l))
        : (l = e[1]);
    const a = l,
        c = `${s.name}${s.form.formId}`,
        d = s.state.value;
    let v;
    e[2] !== s
        ? ((v = (H) => {
              s.handleChange(H);
          }),
          (e[2] = s),
          (e[3] = v))
        : (v = e[3]);
    const m = !!a;
    let f;
    e[4] !== r ? ((f = x.jsx(rs, { placeholder: r })), (e[4] = r), (e[5] = f)) : (f = e[5]);
    let g;
    e[6] !== s.handleBlur || e[7] !== s.name || e[8] !== c || e[9] !== m || e[10] !== f
        ? ((g = x.jsx(ns, { id: c, name: s.name, 'aria-invalid': m, onBlur: s.handleBlur, children: f })),
          (e[6] = s.handleBlur),
          (e[7] = s.name),
          (e[8] = c),
          (e[9] = m),
          (e[10] = f),
          (e[11] = g))
        : (g = e[11]);
    let M;
    e[12] !== n ? ((M = n.map(is)), (e[12] = n), (e[13] = M)) : (M = e[13]);
    let O;
    e[14] !== M ? ((O = x.jsx(ss, { children: M })), (e[14] = M), (e[15] = O)) : (O = e[15]);
    let R;
    return (
        e[16] !== o || e[17] !== s.state.value || e[18] !== n || e[19] !== v || e[20] !== g || e[21] !== O
            ? ((R = x.jsxs(ts, { items: n, value: d, onValueChange: v, disabled: o, children: [g, O] })),
              (e[16] = o),
              (e[17] = s.state.value),
              (e[18] = n),
              (e[19] = v),
              (e[20] = g),
              (e[21] = O),
              (e[22] = R))
            : (R = e[22]),
        R
    );
}
function is(t) {
    return x.jsx(os, { value: t.value, children: t.label }, t.value);
}
const as = i.lazy(async () => ({
        default: (await qn(() => import('./index-C3Mou0V4.js'), __vite__mapDeps([0, 1, 2, 3, 4, 5, 6])))
            .PasswordInputField,
    })),
    { useAppForm: gs } = Wn({
        fieldContext: mr,
        formContext: gr,
        fieldComponents: { FormFieldWrapper: Ir, InputField: Rr, PasswordInputField: as, SelectField: ls },
        formComponents: {},
    });
export {
    et as D,
    xr as F,
    fr as I,
    ps as a,
    ms as b,
    ze as c,
    Tr as d,
    qt as e,
    gt as f,
    Mt as g,
    Cr as h,
    Jt as i,
    Ye as j,
    Wt as k,
    wr as l,
    rt as m,
    Ar as n,
    zt as o,
    Ct as p,
    ir as q,
    Er as r,
    Zt as s,
    lr as t,
    gs as u,
    Fr as v,
    At as w,
    ht as x,
};
