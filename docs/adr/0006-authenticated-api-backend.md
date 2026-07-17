# Authenticated API backend for multi-user access

Supersedes the "no auth, backend is just a SQL DB" stance of
[0004](0004-client-compute-server-persistence.md).

Moving to a website with **email + password login** and **five roles** (Head, Team Lead, Buyer,
Designer, BDM) whose data visibility differs. We add a **backend API** that owns the database,
`DATABASE_URL`, authentication, and **authorization** — the SPA calls it over HTTP with a
session token. `src/lib/db` (drizzle + `postgres-js`) runs server-side only and is never bundled
into the client.

## Why

- Authorization **cannot** be enforced client-side: a browser can lie about its role. The only
  place a visibility rule is trustworthy is a server the client can't tamper with.
- `postgres-js` is a Node driver; putting `DATABASE_URL` in the SPA bundle exposes the whole
  database ([0004](0004-client-compute-server-persistence.md) established this). An authenticated
  API is the boundary that keeps the credential server-side *and* makes per-role filtering real.
- **Email + Argon2id password**, no magic-link — fewest moving parts for an internal tool, no
  email-delivery infra.
- **Server-side sessions in Postgres**, not stateless JWT — so a Head's role/team/status change and
  logout take effect on the **next request**, not at token expiry. For a visibility system,
  lingering access is a leak. All server instances share the one Postgres session store.

## Consequences

- Analysis **compute** may stay client-side (0004's pure domain layer is intact); **authorization**
  does not.
- The template's `authExample` / dummyjson `users` scaffolding is removed as real auth lands — the
  opposite of 0004's "delete it, single-user" reasoning, for the opposite reason.
- A standalone server/runtime now exists in scope; framework/hosting choice is deferred, contracts
  are fixed in spec #1.
- Every read is filtered through one authorization seam — see
  [0007](0007-single-access-policy-seam.md).
