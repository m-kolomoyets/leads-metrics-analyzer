// A three-call IndexedDB key/value store. localStorage would be the obvious home for a draft, but a
// parsed upload is megabytes of rows: past the ~5 MB cap, and a synchronous `JSON.stringify` on the
// main thread for every write. IDB takes structured-cloneable values as they are — no serialization
// pass, no cap worth worrying about.
//
// Every call swallows its failure and reads as "nothing stored". Private windows, disabled site
// data and a blocked upgrade all land here, and none of them is a reason to break a page whose
// draft is a convenience.

const DB_NAME = 'lead-metrics';
const DB_VERSION = 1;
const STORE = 'kv';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
    dbPromise ??= new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            if (!request.result.objectStoreNames.contains(STORE)) {
                request.result.createObjectStore(STORE);
            }
        };
        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onerror = () => {
            // A failed open must not be cached, or one private-window read poisons the session.
            dbPromise = null;
            reject(request.error);
        };
    });

    return dbPromise;
}

function request<TResult>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest): Promise<TResult> {
    return openDb().then((db) => {
        return new Promise<TResult>((resolve, reject) => {
            const query = run(db.transaction(STORE, mode).objectStore(STORE));

            query.onsuccess = () => {
                resolve(query.result as TResult);
            };
            query.onerror = () => {
                reject(query.error);
            };
        });
    });
}

const isAvailable = () => {
    return typeof indexedDB !== 'undefined';
};

export async function idbGet<TValue>(key: string): Promise<TValue | null> {
    if (!isAvailable()) {
        return null;
    }

    try {
        const value = await request<TValue | undefined>('readonly', (store) => {
            return store.get(key);
        });

        return value ?? null;
    } catch (_error) {
        return null;
    }
}

export async function idbSet(key: string, value: unknown): Promise<void> {
    if (!isAvailable()) {
        return;
    }

    try {
        await request('readwrite', (store) => {
            return store.put(value, key);
        });
    } catch (_error) {
        // Quota exceeded is the realistic one: the draft simply does not survive this reload.
    }
}

export async function idbDelete(key: string): Promise<void> {
    if (!isAvailable()) {
        return;
    }

    try {
        await request('readwrite', (store) => {
            return store.delete(key);
        });
    } catch (_error) {
        // Nothing to do — a draft that cannot be deleted is aged out by its stamp instead.
    }
}
