import { r as reactExports } from './react.mjs';

function useSyncedRef(value) {
    const ref = reactExports.useRef(value);
    ref.current = value;
    return reactExports.useMemo(
        () =>
            Object.freeze({
                get current() {
                    return ref.current;
                },
            }),
        []
    );
}
function useUnmountEffect(effect) {
    const effectRef = useSyncedRef(effect);
    reactExports.useEffect(
        () => () => {
            effectRef.current();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
}
function useDebouncedCallback(callback, deps, delay, maxWait = 0) {
    const timeout = reactExports.useRef(void 0);
    const waitTimeout = reactExports.useRef(void 0);
    const cb = reactExports.useRef(callback);
    const lastCall = reactExports.useRef(void 0);
    const clear = () => {
        if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = void 0;
        }
        if (waitTimeout.current) {
            clearTimeout(waitTimeout.current);
            waitTimeout.current = void 0;
        }
    };
    useUnmountEffect(clear);
    reactExports.useEffect(() => {
        cb.current = callback;
    }, deps);
    return reactExports.useMemo(() => {
        const execute = () => {
            clear();
            if (!lastCall.current) {
                return;
            }
            const context = lastCall.current;
            lastCall.current = void 0;
            cb.current.apply(context.this, context.args);
        };
        const wrapped = function (...args) {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
            lastCall.current = { args, this: this };
            timeout.current = setTimeout(execute, delay);
            if (maxWait > 0 && !waitTimeout.current) {
                waitTimeout.current = setTimeout(execute, maxWait);
            }
        };
        Object.defineProperties(wrapped, {
            length: { value: callback.length },
            name: { value: `${callback.name || 'anonymous'}__debounced__${delay}` },
        });
        return wrapped;
    }, [delay, maxWait, ...deps]);
}
const noop = () => {};
const isBrowser =
    typeof globalThis !== 'undefined' && typeof navigator !== 'undefined' && typeof document !== 'undefined';
function on(object, ...args) {
    object?.addEventListener?.(...args);
}
function off(object, ...args) {
    object?.removeEventListener?.(...args);
}
const hasOwnProperty = (object, property) => Object.hasOwn(object, property);
function useFirstMountState() {
    const isFirstMount = reactExports.useRef(true);
    reactExports.useEffect(() => {
        isFirstMount.current = false;
    }, []);
    return isFirstMount.current;
}
function useIsMounted(initialValue = false) {
    const isMounted = reactExports.useRef(initialValue);
    const get = reactExports.useCallback(() => isMounted.current, []);
    reactExports.useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);
    return get;
}
const useIsomorphicLayoutEffect = isBrowser ? reactExports.useLayoutEffect : reactExports.useEffect;
function useUpdateEffect(effect, deps) {
    const isFirstMount = useFirstMountState();
    reactExports.useEffect(isFirstMount ? noop : effect, deps);
}
function initState(initialState) {
    if (typeof initialState === 'function') {
        initialState = initialState();
    }
    return initialState;
}
function updateState(nextState, previousState) {
    if (typeof nextState === 'function') {
        return nextState(previousState);
    }
    return nextState;
}
function resolveHookState(...args) {
    if (args.length === 1) {
        return initState(args[0]);
    }
    return updateState(args[0], args[1]);
}
function useDebouncedState(initialState, delay, maxWait = 0) {
    const [state, setState] = reactExports.useState(initialState);
    return [state, useDebouncedCallback(setState, [], delay, maxWait)];
}
function useToggle(initialState = false, ignoreReactEvents = true) {
    const [state, setState] = reactExports.useState(initialState);
    const ignoreReactEventsRef = useSyncedRef(ignoreReactEvents);
    return [
        state,
        reactExports.useCallback((nextState) => {
            setState((previousState) => {
                if (
                    nextState === void 0 ||
                    (ignoreReactEventsRef.current &&
                        typeof nextState === 'object' &&
                        (nextState.constructor.name === 'SyntheticBaseEvent' || // @ts-expect-error React internals
                            typeof nextState._reactName === 'string'))
                ) {
                    return !previousState;
                }
                return Boolean(resolveHookState(nextState, previousState));
            });
        }, []),
    ];
}
const storageListeners = /* @__PURE__ */ new Map();
const invokeStorageKeyListeners = (s, key, value, skipListener) => {
    const listeners = storageListeners.get(s)?.get(key);
    if (listeners === void 0 || listeners.size === 0) {
        return;
    }
    for (const listener of listeners) {
        if (listener !== skipListener) {
            listener(value);
        }
    }
};
const storageEventHandler = (evt) => {
    if (evt.storageArea && evt.key && evt.newValue) {
        invokeStorageKeyListeners(evt.storageArea, evt.key, evt.newValue);
    }
};
const addStorageListener = (s, key, listener) => {
    if (isBrowser && storageListeners.size === 0) {
        on(globalThis, 'storage', storageEventHandler, { passive: true });
    }
    let keys = storageListeners.get(s);
    if (!keys) {
        keys = /* @__PURE__ */ new Map();
        storageListeners.set(s, keys);
    }
    let listeners = keys.get(key);
    if (!listeners) {
        listeners = /* @__PURE__ */ new Set();
        keys.set(key, listeners);
    }
    listeners.add(listener);
};
const removeStorageListener = (s, key, listener) => {
    const keys = storageListeners.get(s);
    if (!keys) {
        return;
    }
    const listeners = keys.get(key);
    if (!listeners) {
        return;
    }
    listeners.delete(listener);
    if (listeners.size === 0) {
        keys.delete(key);
    }
    if (keys.size === 0) {
        storageListeners.delete(s);
    }
    if (isBrowser && storageListeners.size === 0) {
        off(globalThis, 'storage', storageEventHandler);
    }
};
const DEFAULT_OPTIONS = {
    defaultValue: null,
    initializeWithValue: true,
};
function useStorageValue(storage, key, options) {
    const optionsRef = useSyncedRef({ ...DEFAULT_OPTIONS, ...options });
    const parse = (str, fallback) => {
        const parseFunction = optionsRef.current.parse ?? defaultParse;
        return parseFunction(str, fallback);
    };
    const stringify = (data) => {
        const stringifyFunction = optionsRef.current.stringify ?? defaultStringify;
        return stringifyFunction(data);
    };
    const storageActions = useSyncedRef({
        fetchRaw: () => storage.getItem(key),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        fetch: () => parse(storageActions.current.fetchRaw(), optionsRef.current.defaultValue),
        remove() {
            storage.removeItem(key);
        },
        store(value) {
            const stringified = stringify(value);
            if (stringified !== null) {
                storage.setItem(key, stringified);
            }
            return stringified;
        },
    });
    const isFirstMount = useFirstMountState();
    const [state, setState] = reactExports.useState(
        optionsRef.current?.initializeWithValue && isFirstMount ? storageActions.current.fetch() : void 0
    );
    const stateRef = useSyncedRef(state);
    const stateActions = useSyncedRef({
        fetch() {
            setState(storageActions.current.fetch());
        },
        setRawVal(value) {
            setState(parse(value, optionsRef.current.defaultValue));
        },
    });
    useUpdateEffect(() => {
        stateActions.current.fetch();
    }, [key]);
    reactExports.useEffect(() => {
        if (!optionsRef.current.initializeWithValue) {
            stateActions.current.fetch();
        }
    }, []);
    useIsomorphicLayoutEffect(() => {
        const handler = stateActions.current.setRawVal;
        addStorageListener(storage, key, handler);
        return () => {
            removeStorageListener(storage, key, handler);
        };
    }, [storage, key]);
    const actions = useSyncedRef({
        set(value) {
            if (!isBrowser) {
                return;
            }
            const s = resolveHookState(value, stateRef.current);
            const storeValue = storageActions.current.store(s);
            if (storeValue !== null) {
                invokeStorageKeyListeners(storage, key, storeValue);
            }
        },
        delete() {
            if (!isBrowser) {
                return;
            }
            storageActions.current.remove();
            invokeStorageKeyListeners(storage, key, null);
        },
        fetch() {
            if (!isBrowser) {
                return;
            }
            invokeStorageKeyListeners(storage, key, storageActions.current.fetchRaw());
        },
    });
    const staticActions = reactExports.useMemo(
        () => ({
            set: (v) => {
                actions.current.set(v);
            },
            remove() {
                actions.current.delete();
            },
            fetch() {
                actions.current.fetch();
            },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
    return reactExports.useMemo(
        () => ({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            value: state,
            ...staticActions,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [state]
    );
}
const defaultStringify = (data) => {
    if (data === null) {
        return null;
    }
    try {
        return JSON.stringify(data);
    } catch (error) {
        console.warn(error);
        return null;
    }
};
const defaultParse = (str, fallback) => {
    if (str === null) {
        return fallback;
    }
    try {
        return JSON.parse(str);
    } catch (error) {
        console.warn(error);
        return fallback;
    }
};
let IS_LOCAL_STORAGE_AVAILABLE;
try {
    IS_LOCAL_STORAGE_AVAILABLE = isBrowser && Boolean(globalThis.localStorage);
} catch {
    IS_LOCAL_STORAGE_AVAILABLE = false;
}
const useLocalStorageValue = IS_LOCAL_STORAGE_AVAILABLE
    ? (key, options) => useStorageValue(localStorage, key, options)
    : (_key, _options) => {
          return { value: void 0, set: noop, remove: noop, fetch: noop };
      };
const queriesMap = /* @__PURE__ */ new Map();
const createQueryEntry = (query) => {
    const mql = matchMedia(query);
    const dispatchers = /* @__PURE__ */ new Set();
    const listener = () => {
        for (const d of dispatchers) {
            d(mql.matches);
        }
    };
    mql.addEventListener('change', listener, { passive: true });
    return {
        mql,
        dispatchers,
        listener,
    };
};
const querySubscribe = (query, setState) => {
    let entry = queriesMap.get(query);
    if (!entry) {
        entry = createQueryEntry(query);
        queriesMap.set(query, entry);
    }
    entry.dispatchers.add(setState);
    setState(entry.mql.matches);
};
const queryUnsubscribe = (query, setState) => {
    const entry = queriesMap.get(query);
    if (entry) {
        const { mql, dispatchers, listener } = entry;
        dispatchers.delete(setState);
        if (dispatchers.size === 0) {
            queriesMap.delete(query);
            if (mql.removeEventListener) {
                mql.removeEventListener('change', listener);
            } else {
                mql.removeListener(listener);
            }
        }
    }
};
function useMediaQuery(query, options = {}) {
    let { initializeWithValue = true } = options;
    if (!isBrowser) {
        initializeWithValue = false;
    }
    const [state, setState] = reactExports.useState(() => {
        if (initializeWithValue) {
            let entry = queriesMap.get(query);
            if (!entry) {
                entry = createQueryEntry(query);
                queriesMap.set(query, entry);
            }
            return entry.mql.matches;
        }
    });
    reactExports.useEffect(() => {
        querySubscribe(query, setState);
        return () => {
            queryUnsubscribe(query, setState);
        };
    }, [query]);
    return state;
}
function useEventListener(target, ...params) {
    const isMounted = useIsMounted();
    const listenerRef = useSyncedRef(params[1]);
    const eventListener = reactExports.useMemo(
        () =>
            // As some event listeners designed to be used through `this`
            // it is better to make listener a conventional function as it
            // infers call context
            function (...args) {
                if (!isMounted()) {
                    return;
                }
                if (typeof listenerRef.current === 'function') {
                    listenerRef.current.apply(this, args);
                } else if (typeof listenerRef.current.handleEvent === 'function') {
                    listenerRef.current.handleEvent.apply(this, args);
                }
            },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
    reactExports.useEffect(() => {
        const tgt = isRefObject(target) ? target.current : target;
        if (!tgt) {
            return;
        }
        const restParams = params.slice(2);
        on(tgt, params[0], eventListener, ...restParams);
        return () => {
            off(tgt, params[0], eventListener, ...restParams);
        };
    }, [target, params[0]]);
}
function isRefObject(target) {
    return target !== null && typeof target === 'object' && hasOwnProperty(target, 'current');
}
export { useLocalStorageValue as a, useEventListener as b, useDebouncedState as c, useToggle as d, useMediaQuery as u };
