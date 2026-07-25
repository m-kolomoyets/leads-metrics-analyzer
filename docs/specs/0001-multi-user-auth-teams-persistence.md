# Multi-user auth, teams, roles & persistence schema

## Problem Statement

The Campaign Analyzer today is a single-user tool: analysis runs in the browser, presets save to a
local file, and nothing survives a reload or reaches a colleague. The team needs to move it to a
website where people log in by email, and where **what you can see depends on who you are** — a
Buyer should see only their own campaign statistics, a Team Lead their team's, the Head everything,
while a Designer sees only creative performance and a BDM only offer performance. None of that is
possible without accounts, teams, roles, and a database that persists presets and analysis results.

## Solution

Introduce a backend API (owning the database and authentication) and the database schema that
supports it:

- **Email + password login** with server-side sessions, so a Head changing someone's role or team
  takes effect on their next request.
- **Five user roles** — Head, Team Lead, Buyer, Designer, BDM — each with a defined visibility
  scope, enforced server-side through a single access-policy module.
- **Teams**, each with one lead and any number of buyers.
- **Presets (Rulesets)** owned by the user who creates them, scoped to a team, versioned immutably
  so past analyses always reproduce.
- **Snapshots** — saved analyses (facts + verdicts) owned by their creator, stamped with the team
  at creation, and pinned to the exact ruleset version that produced them, so a Snapshot alone can
  rebuild a report with charts.
- A **simple admin panel** where the Head assigns roles and teams and sets user statuses.

This spec covers the **database schema and the authorization model it must support**. The API
endpoints are described as contracts; their full implementation and the analysis UI are separate
work.

## User Stories

### Authentication & session

1. As a team member, I want to log in with my email and password, so that I can reach my
   statistics on the website.
2. As a team member, I want to stay logged in across page reloads, so that I don't re-authenticate
   constantly.
3. As a team member, I want to log out, so that my session ends on a shared machine.
4. As the Head, I want a demoted or reassigned user's access to change on their next request, so
   that permission changes take effect immediately rather than lingering until a token expires.
5. As the system, I want passwords stored only as Argon2id hashes, so that a database leak does not
   expose credentials.
6. As a team member, I want my session to expire after a period of inactivity, so that an abandoned
   session cannot be used indefinitely.

### Buyer visibility

7. As a Buyer, I want to see the Snapshots I created, so that I can review my own campaign
   performance.
8. As a Buyer, I want to NOT see other buyers' Snapshots, so that visibility matches my role.
9. As a Buyer, I want to create my own Presets, save them, edit them, and use them in analysis, so
   that I can tune thresholds to how I buy.
10. As a Buyer, I want to see my teammates' Presets read-only (and copy one to make my own), so that
    I can reuse team knowledge without altering someone else's preset.
11. As a Buyer, I want my draft threshold edits to run analysis before I save, so that I can
    experiment, and I understand an unsaved draft is lost on reload.

### Team Lead visibility

12. As a Team Lead, I want to see every Snapshot created by any member of my team, so that I can
    oversee my team's performance.
13. As a Team Lead, I want a former member's past Snapshots to remain attributed to my team, so that
    my historical statistics don't change when someone transfers away.
14. As a Team Lead, I want to see all Presets belonging to my team, so that I can review the
    thresholds my buyers apply.
15. As a Team Lead, I want to create and version my own Presets like any team member, so that I can
    maintain team standards.
16. As a Team Lead, I want to NOT see other teams' Snapshots or Presets, so that visibility stays
    within my team.

### Head visibility & administration

17. As the Head, I want to see all Snapshots across every team, so that I have the full picture.
18. As the Head, I want to see all Presets (assets) across the company, so that I can audit
    thresholds anywhere.
19. As the Head, I want an admin panel to create users and assign each an email, role, and team, so
    that people can log in with the right access.
20. As the Head, I want to change a user's role, so that I can promote a Buyer to Team Lead or
    reassign responsibilities.
21. As the Head, I want to move a user to a different team, so that I can reorganize.
22. As the Head, I want to set a user's status (e.g. active, invited, disabled), so that I can
    onboard and offboard people without deleting their history.
23. As the Head, I want to designate which user leads a team, so that team-scoped visibility routes
    correctly.
24. As the Head, I want a disabled user to be unable to log in while their Snapshots and Presets
    remain, so that offboarding preserves historical data.

### Designer & BDM (dimension-scoped)

25. As a Designer, I want to see creative performance (CPI, CTR, CPM per creative) across the whole
    company, so that I can judge how my creatives perform wherever they ran.
26. As a Designer, I want to NOT see Campaign, Account, or Geo dollar-level statistics, so that my
    access is limited to the creative dimension.
27. As a BDM, I want to see offer performance (installs, regs, sales, ROI per offer) across the
    whole company, so that I can manage offers with full visibility.
28. As a BDM, I want to NOT see Campaign, Account, or Geo dollar-level statistics, so that my access
    is limited to the offer dimension.

### Presets & versioning

29. As any team member, I want each save of a Preset to create a new immutable version, so that
    analyses run earlier still reproduce exactly.
30. As any team member, I want analysis to use the currently active version of a Preset, so that new
    work reflects my latest thresholds.
31. As the system, I want a Snapshot to pin the exact ruleset version(s) it used, so that a report
    rebuilt from the Snapshot matches what the buyer saw at the time.
32. As a team member, I want to rename or add named Presets per Geo (e.g. "KR Olympus Slot"), so
    that I can keep distinct threshold sets per market and vertical.

### Snapshots

33. As a Buyer, I want to save an analysis as a Snapshot, so that its facts and verdicts persist
    beyond the browser session.
34. As a Buyer, I want a Snapshot to store enough facts to rebuild the report with charts later, so
    that I don't need the original CSVs to review it.
35. As the system, I want a Snapshot to be pushed only from a saved ruleset version (pushing forces
    a save first), so that it can never reference an unsaved draft.
36. As a viewer of a Snapshot, I want its numbers to be immutable once saved, so that later preset
    edits do not silently change history.

## Implementation Decisions

### Architecture (see ADR-0006, ADR-0008)

- Server-side logic — authentication, authorization, DB access — lives in **TanStack Start server
  functions** colocated in `src/services/*` (`createServerFn(...).inputValidator(zod).handler(...)`),
  **not** a separate API server. The whole app builds and dev-serves on **one port**. Server-fn
  bodies are stripped from the client bundle, so `DATABASE_URL` and `src/lib/db` (drizzle +
  `postgres-js`) stay server-side.
- ADR-0004 chose client-only compute with no auth; email login + role-based visibility make that
  unenforceable (a client can lie about its role). ADR-0006 records the shift. Client-side *compute*
  of the analysis may remain; **authorization** and DB access do not.
- **Requires Vite 7** — TanStack Start is broken on Vite 8 (ADR-0008); the build was downgraded
  (rolldown → Rollup, React Compiler moved into `@vitejs/plugin-react`) in T1.
- Inputs are validated with **Zod** at the server-function boundary, not just TypeScript.
- Authorization flows through the **single access-policy seam** (ADR-0007), invoked inside server
  functions.

### Authentication

- **Email + password**, password stored as an **Argon2id** hash. No magic-link/OTP (no email
  infra needed for an internal tool).
- **Server-side sessions** persisted in Postgres (`session` table), not stateless JWTs — so
  role/team/status changes and logout take effect on the next request. All server instances share
  the Postgres session store.

### Roles & visibility

- **One role per user**, exactly one of: `head`, `team_lead`, `buyer`, `designer`, `bdm`.
- Visibility has **two orthogonal axes**:
  - **Row-scope** (which Snapshots): `buyer` = own (creator), `team_lead` = own team (via the
    Snapshot's stamped team), `head` = all.
  - **Dimension-scope** (which tables): `designer` = Creative roll-up only, `bdm` = Offer roll-up
    only — both **company-wide** but blocked from Campaign / Account / Geo dollar views. `head` /
    `team_lead` / `buyer` get the full dimension set within their row-scope.
- All enforcement flows through **one pure access-policy module** — `scopeFor(viewer)` returns a
  visibility descriptor `{ rowScope: 'own' | 'team' | 'all', teamId?, userId?, dimensions:
  ('campaign'|'account'|'geo'|'creative'|'offer')[] }`. Every list/read query applies the
  descriptor as a filter; the API never hand-rolls per-endpoint checks.

### Teams

- A **Team** has exactly **one lead** (`team.lead_id → user`). A **Buyer belongs to at most one
  team** (`user.team_id`). Co-leads / multi-team membership are explicitly out of scope.

### Ownership & stamping

- A **Snapshot is creator-owned** (`created_by_user_id`) and **stamps `team_id` at creation**, so a
  member's transfer never re-attributes their past Snapshots to a new team.
- A **Preset is owned by its creator** (`owner_user_id`), **scoped to a team** (`team_id`).
  Team-visible read-only to teammates; editable only by its owner; Head and Team Lead can view all
  Presets in their scope.

### Presets, versions & the applied ruleset (upholds ADR-0002)

- A **Preset** is a per-Geo named threshold set (identity: owner, team, geo, name). Editing never
  mutates in place — each save appends an **immutable Preset version** carrying that Geo's threshold
  pairs (installs/regs/sales/clicks `{gy, yr}`).
- **Shared settings** (global Waste Zones, Review Multiplier, default Commission, Seller rules — per
  [ADR-0002]/domain doc 05) are versioned per team, immutably, the same way.
- A **Snapshot spans multiple Geos**, so it pins a **fully-resolved, frozen Applied Ruleset**: the
  exact Preset version chosen for each analyzed Geo plus the Shared-settings version in force. This
  preserves ADR-0002's "one reference, always reproducible" guarantee at the multi-user granularity
  — later preset edits cannot change a saved Snapshot's numbers.

### Schema (tables — altitude only, not final DDL)

- `team(id, name, lead_id → user, created_at)`
- `user(id, email unique, password_hash, role, team_id → team nullable, status, created_at)` —
  `role` and `status` as Postgres enums (DB enums, not TS enums — repo bans TS `enum`).
- `session(id, user_id → user, expires_at, created_at)`
- `preset(id, team_id → team, owner_user_id → user, geo, name, active_version_id, created_at)`
- `preset_version(id, preset_id → preset, thresholds jsonb, created_at)` — immutable/append-only
- `shared_settings(id, team_id → team, active_version_id, created_at)` +
  `shared_settings_version(id, shared_settings_id, payload jsonb, created_at)` — immutable
- `applied_ruleset(id, shared_settings_version_id, created_at)` +
  `applied_ruleset_geo(applied_ruleset_id, geo, preset_version_id)` — the frozen bundle a Snapshot
  pins
- `snapshot(id, created_by_user_id → user, team_id, applied_ruleset_id, taken_at, report_date,
  meta jsonb)`
- `snapshot_fact(id, snapshot_id → snapshot, campaign, creative, report_date, geo, account, offer,
  os, spend, spend_plus, revenue, link_clicks, installs, regs, sales, verdict, zone, …)` — grain
  `Campaign × Creative × Date`, carrying enough to rebuild every roll-up and chart.

### Server functions (shape only)

Each is a TanStack Start `createServerFn` in `src/services/*`, Zod-validated input, DB access in the
handler. Names indicative, not literal routes.

- `login` (email, password) → sets session; `logout` → clears it; `me` → current user (id, role,
  team).
- `listSnapshots`, `getSnapshot`, `listPresets`, `getSnapshotFacts` — **every** read runs its query
  through `scopeFor(viewer)`; a Designer/BDM request for a dollar-dimension table is rejected or
  returns only its permitted dimension.
- Admin (Head only): `createUser`, `updateUser` (role, team, status), `setTeamLead` — each guarded
  by a `role === 'head'` check in addition to the access policy.

## Testing Decisions

- **Add Vitest** (per ADR-0005 — no runner exists yet) and test **one module: the access policy**.
  It is a pure function (`scopeFor(viewer) → descriptor`) with no DB or HTTP, so it is the highest
  and ideally only seam for the authorization behavior.
- **Good tests here assert external behavior**: given a viewer of each role (and team/creator
  identity), assert the returned visibility descriptor — row-scope, team/creator binding, and the
  permitted dimension set. Table-driven, one row per role plus edge cases (buyer with no team,
  team_lead viewing another team, designer requesting a dollar dimension).
- **Do not** unit-test the drizzle table definitions or the ORM; they are declarations, not
  behavior. Query-layer wiring that applies the descriptor is covered indirectly and can be
  exercised later via API-level tests if a seam is added there.
- **Prior art**: none yet in-repo (first tests). Follow the ADR-0005 domain-layer fixture pattern —
  pure functions, reference-data-driven, asserting values not implementation.

## Out of Scope

- The analysis UI, CSV ingestion, and the metrics/verdict engine themselves (covered by the domain
  capability docs `docs/domain/01–06`). This spec is auth, teams, roles, and persistence only.
- The full backend server implementation (framework choice, deployment target, hosting) — the
  contracts are fixed here; the runtime is separate.
- Email delivery, password reset, magic-link, SSO, 2FA.
- Multiple roles per user, team co-leads, and multi-team membership (explicitly one-each).
- Account/campaign **assignment**-based ownership (creator ownership was chosen instead).
- Fine-grained per-field audit logging beyond the immutability the versioning already provides.
- Multi-day trend views (the `Date` column is reserved in the fact grain but trend UI is later —
  domain doc 01).

## Further Notes

- **Commission for the golden fixture dataset is 6 %**, not the 7 % in `presets_big.json` (a
  data-entry error) — relevant when seeding test data.
- **Uniques do not sum** across Campaign grain (domain doc 03 / ADR-0003): geo-level unique counts
  in Snapshots are approximate. Reporting built on Snapshots must not claim geo counts tie out to
  Keitaro's country view.
- **Geo Total ≠ sum of Campaigns by design** (ADR-0003): if a reporting view aggregates Snapshot
  facts to Geo, it must include untagged/unfired-macro revenue the same way the live analysis does.
- Architecture ADRs: **ADR-0006** (TanStack Start server functions), **ADR-0007** (access-policy
  seam), **ADR-0008** (Vite 7 requirement). ADR-0004 is partially superseded by 0006.
- **T1 (#2) delivered the foundation**: Vite 7 downgrade + Rollup build, drizzle tooling, server-only
  `src/lib/db`. The **TanStack Start shell migration folds into T2 (#3)** — it is entangled with the
  `authExample`/MSW scaffolding T2 removes (a `router` singleton, MSW boot, template auth routes), so
  the shell conversion and the auth rebuild happen in one coherent pass rather than leaving a
  half-migrated shell with broken login in between.
- The template's `authExample` / dummyjson `users` services are removed in T2 as real auth lands.
