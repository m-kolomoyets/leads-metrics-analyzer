# A single `/analyze` route, presentation branched by visibility scope

The five roles ([0006](0006-authenticated-api-backend.md)) split on the dimension axis
([0007](0007-single-access-policy-seam.md)): Head / Team Lead / Buyer see dollar figures and every
table; Designer / BDM see **no dollars** and a single rolled-up dimension (Creative / Offer). The
question was whether that becomes one route with a branch, or two routes.

One **`/analyze`** route under `_authenticated`. Its component reads `scopeFor(viewer)` and
branches on the returned `dimensions`:

- **Dollar roles** (`dimensions` includes cost tables) → the live Analyzer: CSV upload → client
  compute → geo tabs, account blocks, campaign / offer / OS tables → save Snapshot.
- **Designer / BDM** (`dimensions` = a single non-dollar axis) → a read-only **Dimension Rollup**:
  company-wide facts summed by their one dimension via `getDimensionRollupFn`, no Spend / Revenue /
  ROI column ever rendered.

The branch is a `scopeFor` read, never a role string compare in the component.

## Why

- The two branches share **nothing** at the data layer (one uploads and computes client-side; the
  other reads a server SQL roll-up) but share **everything** at the shell layer — nav entry, page
  chrome, auth guard, empty/error states. One route, one nav item, one guard; the fork is a
  component-level `switch` on the scope descriptor, which is exactly the seam
  [0007](0007-single-access-policy-seam.md) already centralises.
- Designer / BDM must **never** see a code path that could render a dollar. Selecting the
  component from `scopeFor` — not `role === …` — means the same rule that hides the columns
  server-side chooses the client view, so a leak needs two independent mistakes.
- The rollup branch has nothing to show until dollar roles have **saved** Snapshots. Keeping both
  behind one route makes that dependency visible in one place rather than hiding an empty second
  route.

## Consequences

- The rollup branch ships **last** (slice 6): it depends on the save flow (slice 5) producing the
  facts it reads.
- The Analyzer and Rollup are separate component trees; only `ui/*` primitives and the page shell
  are shared. No table component assumes a dollar column exists.
- Adding a future dollar-free role is a `scopeFor` change plus reusing the Rollup view — no new
  route.
