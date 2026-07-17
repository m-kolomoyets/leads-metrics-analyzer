# Server-side logic via TanStack Start server functions

Supersedes the "no auth, backend is just a SQL DB" stance of
[0004](0004-client-compute-server-persistence.md), and replaces this ADR's own earlier draft of a
*separate* API server (Hono on its own port) — that was rejected before implementation in favour of
colocating server logic in the app.

Moving to a website with **email + password login** and **five roles** (Head, Team Lead, Buyer,
Designer, BDM) whose data visibility differs. Server-side logic — authentication, authorization,
and all DB access — lives in **TanStack Start server functions** colocated in `src/services/*`,
not a separate server. The whole app builds and dev-serves on **one port**.

## Why

- Authorization **cannot** be enforced client-side: a browser can lie about its role. `postgres-js`
  is a Node driver and `DATABASE_URL` must never enter the client bundle. Server functions
  (`createServerFn`) run only on the server — their bodies are stripped from the client build and
  replaced with an RPC stub — so DB access and secrets stay server-side while the code sits next to
  the feature it serves.
- **One app, one port.** A separate API server (the rejected Hono draft) meant a second process and
  a second origin needing CORS. TanStack Start serves client + server functions from the single
  Vite dev server, matching the "one app" requirement and the existing all-TanStack stack
  (Router/Query/Form).
- **Email + Argon2id password**, no magic-link — fewest moving parts for an internal tool.
- **Server-side sessions in Postgres**, not stateless JWT — so a Head's role/team/status change and
  logout take effect on the **next request**, not at token expiry.
- **Input validation with Zod** at the server-function boundary (`.inputValidator(schema)`), not
  just TypeScript — types vanish at runtime; the boundary needs real validation.

## Consequences

- **Requires Vite 7.** TanStack Start is broken on Vite 8 (server-fn middleware silently 404s,
  [TanStack/router#7614](https://github.com/TanStack/router/issues/7614)). See
  [0008](0008-tanstack-start-on-vite-7.md) for the downgrade and build-config impact.
- The SPA migrates to Start in **SPA mode** (`spa: { enabled: true }`) — client-rendered, but with
  server functions. The app shell (`__root` document, entry, MSW, theming) is rewritten as part of
  **T2**, together with removing the `authExample`/dummyjson scaffolding it is entangled with.
- Analysis **compute** may stay client-side (0004's pure domain layer is intact); **authorization**
  and DB access do not.
- Every read is filtered through one authorization seam — see
  [0007](0007-single-access-policy-seam.md), invoked from inside server functions.
