# TanStack Start requires Vite 7 (downgrade from Vite 8)

Choosing TanStack Start for server-side logic ([0006](0006-authenticated-api-backend.md)) forces
the build off Vite 8, which the repo was on.

TanStack Start's dev-server middleware **silently fails to register on Vite 8** — every server-fn
call and route returns a plain `404 "Cannot GET /"` with no logged error
([TanStack/router#7614](https://github.com/TanStack/router/issues/7614), open, no fix version).
Start supports Vite 5/6/7. So the build is pinned to **Vite 7**.

## Why (and what it cost)

Vite 8 → 7 is not a one-line pin; it cascades through the build:

- `@vitejs/plugin-react` 6 (peer `vite ^8`) → **5.1.1** (peer includes `^7`).
- React Compiler was wired via `@rolldown/plugin-babel` (a rolldown/Vite-8 thing) → moved into
  `@vitejs/plugin-react`'s own `babel.plugins` (`babel-plugin-react-compiler`); the rolldown babel
  plugin is removed.
- `build.rolldownOptions.output.codeSplitting.groups` (rolldown-only) → standard
  `build.rollupOptions.output.manualChunks`, preserving the `vendor-react` / `vendor-tanstack` /
  `vendor-zod` split.

## Consequences

- The build runs on **Rollup** (Vite 7 default), not rolldown. Chunking parity kept via
  `manualChunks`; verified `pnpm build` green with the same vendor chunks.
- Revisit Vite 8 once #7614 is fixed; at that point `@rolldown/plugin-babel` and `rolldownOptions`
  could return, but there is no reason to churn the build again pre-emptively.
- This ADR records a deliberate, reversible downgrade so a future reader doesn't "upgrade to Vite 8"
  and silently break every server function.
