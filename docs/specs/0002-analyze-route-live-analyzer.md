# The `/analyze` route: live campaign analyzer

## Problem Statement

The backend persistence half is built — versioned presets, shared settings, snapshots, facts, auth,
role scoping ([spec 0001](0001-multi-user-auth-teams-persistence.md)). The **product** is not: there
is no compute layer, no analysis UI, and nothing that turns uploaded CSVs into the tables the
reference (`references/analizator-kampaniy-blue (1).html`) shows. Facts today arrive at
`createSnapshotFn` **already computed** (`verdict`, `zone`, `spendPlus` are inputs) with no producer.

This spec builds the producer and the page: upload FB + Keitaro CSVs → compute client-side → render
the reference's tables → save the result as a Snapshot — for all five roles.

## Solution

A single `_authenticated/analyze` route ([ADR-0009](../adr/0009-single-analyze-route-scope-branched.md))
that branches on `scopeFor(viewer)`:

- **Dollar roles** (Head / Team Lead / Buyer): the live Analyzer.
- **Designer / BDM**: a dollar-free single-dimension Rollup over saved Snapshots.

Compute is a pure `src/lib/domain/` layer ([ADR-0010](../adr/0010-compute-layer-module-layout.md)),
mapping 1:1 to the [`docs/domain/`](../domain/) capabilities, tested with Vitest against the
reference CSVs.

## Decisions (from grilling, 2026-07-18)

| # | Decision |
|---|---|
| 1 | Route is a **live analyzer + save**, not a snapshot viewer. The whole compute layer gets built. |
| 2 | Serves **all 5 roles** now, gated by `scopeFor`; rollup branch depends on saved snapshots. |
| 3 | Thresholds **load from DB** (active preset version per geo + shared settings); inline edit mints new versions. |
| 4 | Input is **CSV upload** — FB multi-file + KT main + KT clicks, PapaParse, browser-only. |
| 5 | **Per-seller commission** in compute from day one (rule → `defaultCommission` → unclaimed = warning). |
| 6 | Save **auto-assembles** the applied ruleset from active versions (one click). |
| — | Delivered as **6 staged tracer bullets**, each mergeable. |

## Slices

Each slice is a shippable vertical. Reference component names in parentheses.

### S1 — Compute layer + first table
Build `src/lib/domain/{parse,join,commission,aggregate,verdict}.ts` end-to-end with Vitest fixtures
from the reference CSVs (validated to the cent, dataset `*big*`, 6 %). Render **one geo's campaign
table** for the Head — raw, unstyled — to prove the numbers. Presets read-only.
_(CampHead / CampRow; verdict/zone grade.)_

### S2 — Full analyzer shell
Geo tabs, per-Account blocks, green/yellow/red bucketing, verdict actions (СТОП / ТРИМАЄМО / БУСТ),
"Чому" reason, excluded-campaign toggle (recompute), problem-account detection (`reviewMultiplier`),
sales blocks. Reference glass styling lands here.
_(AccountBlock, BucketBlock, SalesBlock, Problem Accounts.)_

### S3 — Inline ruleset editing
Threshold-pair editing per geo → `savePresetVersionFn` (mints a version, role-gated by
`presetAccessFor`); shared-settings editing (default commission, review multiplier, seller rules) →
`saveSharedSettingsFn`.
_(Preset editor, ThreshRow.)_

### S4 — Allocation & totals
`allocate.ts`; Offer + OS allocated-spend tables (labelled estimate); GeoStat totals;
Geo-Total-vs-Attributed divergence ([ADR-0003](../adr/0003-geo-total-diverges-from-attributed.md));
Waste; copy-to-clipboard.
_(ModelTable ×2, GeoStat.)_

### S5 — Save as Snapshot
One-click save: auto-assemble the applied ruleset from each analyzed geo's active preset version +
active shared-settings version → `createSnapshotFn`. Report date picked at save; facts map straight
from the computed shape.

### S6 — Designer / BDM rollup branch
The dollar-free branch: `getDimensionRollupFn` summed by the viewer's single dimension
(Creative / Offer), no Spend / Revenue / ROI rendered.

## Out of scope

- A separate preset-manager route (editing happens inline, S3).
- A snapshot-viewer route (reading saved snapshots read-only) — a later, smaller sibling reusing
  S2's tables.
- Charts (spec 0001 story 34 mentions them; facts carry enough to add later).
- The per-geo **Creative analysis table** in the dollar analyzer (reference `🎨 Аналіз креативів`) —
  needs per-creative allocation on the campaign-grain join. Deferred to [#35](https://github.com/m-kolomoyets/leads-metrics-analyzer/issues/35).
  Distinct from S6's dollar-free Designer rollup.
- The per-geo **Account summary** nav table (reference `Зведення по акаунтах`) — a jump-to-block
  summary over the S2 account blocks. Deferred to [#36](https://github.com/m-kolomoyets/leads-metrics-analyzer/issues/36).

## Open questions (non-blocking)

- `snapshot.reportDate` when facts span multiple dates: assumed a **user-picked report day** at save
  (S5). Revisit if a date range is wanted.
- Prominence of Untagged Revenue in the Geo Total — sample had none
  ([docs/domain README](../domain/README.md)).
