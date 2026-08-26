# Composites — report, dynamics, layouts, sidebar

**Depends on 01 and 03. Parallelizable with 04.**

## What to build

Bring every composed surface onto the new tokens. This is the largest slice by file count; it is
mechanical, and `/design` is where each primitive it uses was already proven.

**Tables** — migrate `RollupTable`, `OffersTable`, `OsTable`, `CreativeTable`, `ProblemAccounts`,
`AccountSummary` and the dynamics tables onto `ui/Table`. The `font-mono` on every numeric cell (29
files) becomes the primitive's `tabular-nums`; Roboto Mono is gone. Alignment and the total-row rule
move into the primitive rather than being repeated per file.

**Panels and cards** — `SectionCard`, `GeoStat`, `ComparisonPanel`, `MetricTiles`, `SnapshotCard`,
`AccountBlock` and the module pages lose their glass tints and glows for a hairline border and a
surface step. `glow-soft` (`GeoStat` ×2, `SnapshotCard`) is deleted outright — it marks nothing.
`pulse-red` stays on `AccountBlock` when `problem && !reviewed`, in its toned-down form: it reports a
real state, so it keeps a signal, just a quieter one.

**Pills** — the `pill`/`pill-*` vocabulary is gone. Status counts become small square-cornered chips
in the Zone colour on the chrome surface, not glowing gradient capsules.

**Figures** — headline numbers cap at 20px and 600 weight. Emphasis comes from weight, Zone colour
and tabular alignment rather than size (`MetricTiles`, `GeoStat`, module headers).

**Layout** — the shell is skinned, not restructured. The sidebar stays; it becomes opaque instead of
`rgb(10 14 24 / 0.72)` with a blur, gains a hairline divider, tightens its rows, drops to 16px icons
and takes an achromatic active state with the accent reserved for selection.

## Acceptance criteria

- [ ] Every data table renders through `ui/Table`
- [ ] `grep -r 'font-mono' src` returns nothing
- [ ] No `glass-tint`, `tint-*`, `surface-accent`, `pill`, `glow-soft` or `backdrop-blur` remains in `src/`
- [ ] `pulse-red` remains only on the unreviewed problem account, in its toned-down form
- [ ] No text exceeds 20px outside empty-state art
- [ ] Sidebar is opaque, hairline-divided, with an achromatic resting state
- [ ] Both themes checked on every route
- [ ] `pnpm tsc`, `pnpm lint` and `pnpm test:run` pass
