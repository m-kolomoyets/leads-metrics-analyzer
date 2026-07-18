import { j as jsxRuntimeExports, b as React, r as reactExports } from './react.mjs';
import {
    F as FieldApi,
    c as FieldGroupApi,
    b as FormApi,
    a as FormGroupApi,
    f as functionalUpdate,
    m as mergeAndUpdate,
    u as uuid,
} from './tanstack__form-core.mjs';
import { u as useSelector } from './tanstack__react-store.mjs';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? reactExports.useLayoutEffect : reactExports.useEffect;
function useField(opts) {
    const [prevOptions, setPrevOptions] = reactExports.useState(() => ({
        form: opts.form,
        name: opts.name,
    }));
    const [fieldApi, setFieldApi] = reactExports.useState(() => {
        return new FieldApi({
            ...opts,
        });
    });
    if (prevOptions.form !== opts.form || prevOptions.name !== opts.name) {
        setFieldApi(
            new FieldApi({
                ...opts,
            })
        );
        setPrevOptions({ form: opts.form, name: opts.name });
    }
    const reactiveStateValue = useSelector(
        fieldApi.store,
        opts.mode === 'array' ? (state) => state.meta._arrayVersion || 0 : (state) => state.value
    );
    const reactiveMetaIsTouched = useSelector(fieldApi.store, (state) => state.meta.isTouched);
    const reactiveMetaIsBlurred = useSelector(fieldApi.store, (state) => state.meta.isBlurred);
    const reactiveMetaIsDirty = useSelector(fieldApi.store, (state) => state.meta.isDirty);
    const reactiveMetaErrorMap = useSelector(fieldApi.store, (state) => state.meta.errorMap);
    const reactiveMetaErrorSourceMap = useSelector(fieldApi.store, (state) => state.meta.errorSourceMap);
    const reactiveMetaIsValidating = useSelector(fieldApi.store, (state) => state.meta.isValidating);
    const extendedFieldApi = reactExports.useMemo(() => {
        const reactiveFieldApi = {
            ...fieldApi,
            get state() {
                return {
                    // For array mode, reactiveStateValue is the length (for reactivity tracking),
                    // so we need to get the actual value from fieldApi
                    value: opts.mode === 'array' ? fieldApi.state.value : reactiveStateValue,
                    get meta() {
                        return {
                            ...fieldApi.state.meta,
                            isTouched: reactiveMetaIsTouched,
                            isBlurred: reactiveMetaIsBlurred,
                            isDirty: reactiveMetaIsDirty,
                            errorMap: reactiveMetaErrorMap,
                            errorSourceMap: reactiveMetaErrorSourceMap,
                            isValidating: reactiveMetaIsValidating,
                        };
                    },
                };
            },
        };
        const extendedApi = reactiveFieldApi;
        return extendedApi;
    }, [
        fieldApi,
        opts.mode,
        reactiveStateValue,
        reactiveMetaIsTouched,
        reactiveMetaIsBlurred,
        reactiveMetaIsDirty,
        reactiveMetaErrorMap,
        reactiveMetaErrorSourceMap,
        reactiveMetaIsValidating,
    ]);
    useIsomorphicLayoutEffect(fieldApi.mount, [fieldApi]);
    useIsomorphicLayoutEffect(() => {
        fieldApi.update(opts);
    });
    return extendedFieldApi;
}
const Field = ({ children, ...fieldOptions }) => {
    const fieldApi = useField(fieldOptions);
    const jsxToDisplay = reactExports.useMemo(() => functionalUpdate(children, fieldApi), [children, fieldApi]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: jsxToDisplay });
};
function useUUID() {
    return reactExports.useState(() => uuid())[0];
}
const _React = React;
const useFormId = reactExports.version.split('.')[0] === '17' ? useUUID : _React.useId;
function useFormGroup(opts) {
    const [prevOptions, setPrevOptions] = reactExports.useState(() => ({
        form: opts.form,
        name: opts.name,
    }));
    const [formGroupApi, setFormGroupApi] = reactExports.useState(() => {
        return new FormGroupApi({
            ...opts,
        });
    });
    if (prevOptions.form !== opts.form || prevOptions.name !== opts.name) {
        setFormGroupApi(
            new FormGroupApi({
                ...opts,
            })
        );
        setPrevOptions({ form: opts.form, name: opts.name });
    }
    const reactiveStateValue = useSelector(formGroupApi.store, (state) => state.value);
    const reactiveMetaIsTouched = useSelector(formGroupApi.store, (state) => state.meta.isTouched);
    const reactiveMetaIsBlurred = useSelector(formGroupApi.store, (state) => state.meta.isBlurred);
    const reactiveMetaIsDirty = useSelector(formGroupApi.store, (state) => state.meta.isDirty);
    const reactiveMetaErrorMap = useSelector(formGroupApi.store, (state) => state.meta.errorMap);
    const reactiveMetaErrorSourceMap = useSelector(formGroupApi.store, (state) => state.meta.errorSourceMap);
    const reactiveMetaIsValidating = useSelector(formGroupApi.store, (state) => state.meta.isValidating);
    const reactiveMetaIsSubmitting = useSelector(formGroupApi.store, (state) => state.meta.isSubmitting);
    const reactiveMetaIsSubmitted = useSelector(formGroupApi.store, (state) => state.meta.isSubmitted);
    const reactiveMetaSubmissionAttempts = useSelector(formGroupApi.store, (state) => state.meta.submissionAttempts);
    const reactiveMetaIsSubmitSuccessful = useSelector(formGroupApi.store, (state) => state.meta.isSubmitSuccessful);
    const reactiveMetaCanSubmit = useSelector(formGroupApi.store, (state) => state.meta.canSubmit);
    const reactiveMetaIsValid = useSelector(formGroupApi.store, (state) => state.meta.isValid);
    const reactiveMetaIsFieldsValid = useSelector(formGroupApi.store, (state) => state.meta.isFieldsValid);
    const reactiveMetaIsFieldsValidating = useSelector(formGroupApi.store, (state) => state.meta.isFieldsValidating);
    const reactiveMetaIsGroupValid = useSelector(formGroupApi.store, (state) => state.meta.isGroupValid);
    const extendedFieldApi = reactExports.useMemo(() => {
        const reactiveFieldApi = {
            ...formGroupApi,
            handleSubmit: (...props) => {
                return formGroupApi._handleSubmit(...props);
            },
            get state() {
                return {
                    ...formGroupApi.state,
                    value: reactiveStateValue,
                    get meta() {
                        return {
                            ...formGroupApi.state.meta,
                            isTouched: reactiveMetaIsTouched,
                            isBlurred: reactiveMetaIsBlurred,
                            isDirty: reactiveMetaIsDirty,
                            errorMap: reactiveMetaErrorMap,
                            errorSourceMap: reactiveMetaErrorSourceMap,
                            isValidating: reactiveMetaIsValidating,
                            isSubmitting: reactiveMetaIsSubmitting,
                            isSubmitted: reactiveMetaIsSubmitted,
                            submissionAttempts: reactiveMetaSubmissionAttempts,
                            isSubmitSuccessful: reactiveMetaIsSubmitSuccessful,
                            canSubmit: reactiveMetaCanSubmit,
                            isValid: reactiveMetaIsValid,
                            isFieldsValid: reactiveMetaIsFieldsValid,
                            isFieldsValidating: reactiveMetaIsFieldsValidating,
                            isGroupValid: reactiveMetaIsGroupValid,
                        };
                    },
                };
            },
        };
        const extendedApi = reactiveFieldApi;
        return extendedApi;
    }, [
        formGroupApi,
        reactiveStateValue,
        reactiveMetaIsTouched,
        reactiveMetaIsBlurred,
        reactiveMetaIsDirty,
        reactiveMetaErrorMap,
        reactiveMetaErrorSourceMap,
        reactiveMetaIsValidating,
        reactiveMetaIsSubmitting,
        reactiveMetaIsSubmitted,
        reactiveMetaSubmissionAttempts,
        reactiveMetaIsSubmitSuccessful,
        reactiveMetaCanSubmit,
        reactiveMetaIsValid,
        reactiveMetaIsFieldsValid,
        reactiveMetaIsFieldsValidating,
        reactiveMetaIsGroupValid,
    ]);
    useIsomorphicLayoutEffect(formGroupApi.mount, [formGroupApi]);
    useIsomorphicLayoutEffect(() => {
        formGroupApi.update(opts);
    });
    return extendedFieldApi;
}
const FormGroup = ({ children, ...formGroupOptions }) => {
    const formGroupApi = useFormGroup(formGroupOptions);
    const jsxToDisplay = reactExports.useMemo(() => functionalUpdate(children, formGroupApi), [children, formGroupApi]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: jsxToDisplay });
};
function LocalSubscribe$1({ form, selector = (state) => state, children }) {
    const data = useSelector(form.store, selector);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {
        children: functionalUpdate(children, data),
    });
}
function useForm(opts) {
    const fallbackFormId = useFormId();
    const [prevFormId, setPrevFormId] = reactExports.useState(opts?.formId);
    const [formApi, setFormApi] = reactExports.useState(() => {
        return new FormApi({ ...opts, formId: opts?.formId ?? fallbackFormId });
    });
    if (prevFormId !== opts?.formId) {
        const formId = opts?.formId ?? fallbackFormId;
        setFormApi(new FormApi({ ...opts, formId }));
        setPrevFormId(formId);
    }
    const extendedFormApi = reactExports.useMemo(() => {
        const extendedApi = {
            ...formApi,
            handleSubmit: (...props) => {
                return formApi._handleSubmit(...props);
            },
            // We must add all `get`ters from `core`'s `FormApi` here, as otherwise the spread operator won't catch those
            get formId() {
                return formApi._formId;
            },
            get state() {
                return formApi.store.state;
            },
        };
        extendedApi.Field = function APIField(props) {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { ...props, form: formApi });
        };
        extendedApi.FormGroup = function APIFormGroup(props) {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(FormGroup, { ...props, form: formApi });
        };
        extendedApi.Subscribe = function Subscribe(props) {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(LocalSubscribe$1, {
                form: formApi,
                selector: props.selector,
                children: props.children,
            });
        };
        return extendedApi;
    }, [formApi]);
    useIsomorphicLayoutEffect(formApi.mount, []);
    useIsomorphicLayoutEffect(() => {
        formApi.update(opts);
    });
    const hasRan = reactExports.useRef(false);
    useIsomorphicLayoutEffect(() => {
        if (!hasRan.current) return;
        if (!opts?.transform) return;
        mergeAndUpdate(formApi, opts.transform);
    }, [formApi, opts?.transform]);
    useIsomorphicLayoutEffect(() => {
        hasRan.current = true;
    });
    return extendedFormApi;
}
function LocalSubscribe({ lens, selector = (state) => state, children }) {
    const data = useSelector(lens.store, selector);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {
        children: functionalUpdate(children, data),
    });
}
function useFieldGroup(opts) {
    const [formLensApi] = reactExports.useState(() => {
        const api = new FieldGroupApi(opts);
        const form = opts.form instanceof FieldGroupApi ? opts.form.form : opts.form;
        const extendedApi = api;
        extendedApi.AppForm = function AppForm(appFormProps) {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(form.AppForm, { ...appFormProps });
        };
        extendedApi.AppField = function AppField(props) {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(form.AppField, { ...formLensApi.getFormFieldOptions(props) });
        };
        extendedApi.Field = function Field2(props) {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { ...formLensApi.getFormFieldOptions(props) });
        };
        extendedApi.Subscribe = function Subscribe(props) {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(LocalSubscribe, {
                lens: formLensApi,
                selector: props.selector,
                children: props.children,
            });
        };
        return Object.assign(extendedApi, {
            ...opts.formComponents,
        });
    });
    useIsomorphicLayoutEffect(formLensApi.mount, [formLensApi]);
    return formLensApi;
}
const fieldContext = reactExports.createContext(null);
const formContext = reactExports.createContext(null);
function useFormContext() {
    const form = reactExports.useContext(formContext);
    if (!form) {
        throw new Error('`formContext` only works when within a `formComponent` passed to `createFormHook`');
    }
    return form;
}
function createFormHookContexts() {
    function useFieldContext() {
        const field = reactExports.useContext(fieldContext);
        if (!field) {
            throw new Error('`fieldContext` only works when within a `fieldComponent` passed to `createFormHook`');
        }
        return field;
    }
    return { fieldContext, useFieldContext, useFormContext, formContext };
}
function createFormHook({ fieldComponents, fieldContext: fieldContext2, formContext: formContext2, formComponents }) {
    function useAppForm(props) {
        const form = useForm(props);
        const AppForm = reactExports.useMemo(() => {
            return ({ children }) => {
                return /* @__PURE__ */ jsxRuntimeExports.jsx(formContext2.Provider, { value: form, children });
            };
        }, [form]);
        const AppField = reactExports.useMemo(() => {
            const AppField2 = ({ children, ...props2 }) => {
                return /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, {
                    ...props2,
                    children: (field) =>
                        /* @__PURE__ */ jsxRuntimeExports.jsx(fieldContext2.Provider, {
                            value: field,
                            children: children(Object.assign(field, fieldComponents)),
                        }),
                });
            };
            return AppField2;
        }, [form]);
        const extendedForm = reactExports.useMemo(() => {
            return Object.assign(form, {
                AppField,
                AppForm,
                ...formComponents,
            });
        }, [form, AppField, AppForm]);
        return extendedForm;
    }
    function withForm({ render, props }) {
        return function Render(innerProps) {
            return render({ ...props, ...innerProps });
        };
    }
    function withFieldGroup({ render, props, defaultValues }) {
        return function Render(innerProps) {
            const fieldGroupProps = reactExports.useMemo(() => {
                return {
                    form: innerProps.form,
                    fields: innerProps.fields,
                    defaultValues,
                    formComponents,
                };
            }, [innerProps.form, innerProps.fields]);
            const fieldGroupApi = useFieldGroup(fieldGroupProps);
            return render({ ...props, ...innerProps, group: fieldGroupApi });
        };
    }
    function useTypedAppFormContext(_props) {
        const form = useFormContext();
        return form;
    }
    function extendForm(extension) {
        return createFormHook({
            fieldContext: fieldContext2,
            formContext: formContext2,
            fieldComponents: {
                ...fieldComponents,
                ...extension.fieldComponents,
            },
            formComponents: {
                ...formComponents,
                ...extension.formComponents,
            },
        });
    }
    return {
        useAppForm,
        withForm,
        withFieldGroup,
        useTypedAppFormContext,
        extendForm,
    };
}
export { createFormHookContexts as a, createFormHook as c };
