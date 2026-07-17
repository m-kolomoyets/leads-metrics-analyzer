/// <reference types="vite/client" />

// No client-visible env vars at present. Add `VITE_*` entries here when introduced.
interface ImportMetaEnv {
    readonly MODE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
