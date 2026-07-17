# A single access-policy seam for all authorization

With five roles ([0006](0006-authenticated-api-backend.md)) whose visibility differs on **two
independent axes**, authorization could sprawl into per-endpoint checks. Instead it flows through
**one pure function**.

`scopeFor(viewer)` returns a visibility descriptor and is the **only** place role rules live:

```ts
// shape (from the grilling; not final code)
type VisibilityScope = {
    rowScope: 'own' | 'team' | 'all';               // which Snapshots
    userId?: string;                                 // bound when rowScope = 'own'
    teamId?: string;                                 // bound when rowScope = 'team'
    dimensions: ('campaign' | 'account' | 'geo' | 'creative' | 'offer')[];  // which tables
};
```

| role | rowScope | dimensions |
|---|---|---|
| head | all | all |
| team_lead | team | all |
| buyer | own | all |
| designer | all | creative only |
| bdm | all | offer only |

Every list/read query applies the descriptor as a filter; the API layer never hand-rolls a role
check (the Head-only admin endpoints add one extra `role === 'head'` edge guard on top).

## Why

- The two axes — **row-scope** (whose data) and **dimension-scope** (which tables) — compose
  cleanly as one descriptor, but only if they live in one place. Scattered per-endpoint checks are
  where visibility leaks hide.
- A pure function with no DB or HTTP is the **highest testable seam** ([0005](0005-vitest-domain-layer.md)):
  the entire authorization surface is covered by table-driven unit tests over `(viewer) →
  descriptor`, no integration harness.

## Consequences

- Adding a role or changing a rule is a one-function edit plus its test cases — not a sweep across
  endpoints.
- Query builders must be written to **accept and honour** the descriptor; an endpoint that bypasses
  it is a bug, catchable in review by "does this read go through `scopeFor`?".
- Designer/BDM dimension gates are enforced by the `dimensions` set, not ad hoc — see ticket #9.
