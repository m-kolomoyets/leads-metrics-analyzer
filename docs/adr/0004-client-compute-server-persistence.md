# Client-side compute, server-side persistence via a pure domain layer

> **Status: partially superseded by [0006](0006-authenticated-api-backend.md).** The "backend is
> just a passive SQL DB reached by a thin API, no auth" stance no longer holds — multi-user email
> login and role-based visibility require an **authenticated** API that enforces authorization
> server-side. What still stands: analysis **compute** stays client-side on a pure domain layer,
> `src/lib/db` runs server-side only, and Snapshots must be self-sufficient. What changed: the
> "single-user, no auth, delete the auth scaffolding" consequence below is reversed.

The app parses CSVs and computes all metrics **in the browser** — files never leave the machine.
Persistence (presets, facts + verdict Snapshots) targets **Postgres via drizzle-orm on the
server**, which the browser reaches through a thin API, never directly.

The domain layer (parse, join, aggregate, verdict, ROI) is **pure TypeScript** — no React, no
transport, no DB imports.

## Why

- Affiliate data is sensitive; keeping computation client-side means it is not uploaded to run
  the analysis.
- drizzle + Postgres **cannot** run in the browser. Every remote HTTP driver (neon-http, Turso,
  D1) would require shipping a live DB credential in the client bundle — full DB access to anyone
  opening devtools. Drizzle's own docs wire it server-side only. (PGlite is the only in-browser
  drizzle option and was not chosen: the goal is a shared server DB, not a local one.)
- A pure domain layer is transport-agnostic: the same functions run in the browser today and
  could move server-side later as a port, not a rewrite. It is also the precondition for testing
  the arithmetic in isolation (see [0005](0005-vitest-domain-layer.md)).

## Consequences

- The template's auth routes, Ky and MSW/dummyjson wiring are dead weight for a single-user client
  app and should be removed rather than left to mislead.
- Review state (account-reviewed flags) is client-side now, with plans to push results to the
  backend later.
- The backend is "just the SQL DB": presets (versioned, [0002](0002-immutable-ruleset-versions.md))
  and facts + verdict Snapshots bound to their `ruleset_version_id`. A Snapshot must be
  self-sufficient to rebuild a report with charts.
