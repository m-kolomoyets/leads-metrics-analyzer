# The client compute layer: pure modules mirroring the domain capabilities

[0004](0004-client-compute-server-persistence.md) fixes analysis as **client-side, pure
TypeScript**; [0005](0005-vitest-domain-layer.md) puts the whole risk there and tests it with
Vitest against the reference CSVs. The capabilities are already modelled in
[`docs/domain/`](../domain/) (1–6). This ADR fixes **where that code lives and what shape it
emits**, so slice 1 builds it once and every later slice consumes it unchanged.

The compute layer lives in **`src/lib/domain/`**, one module per documented capability, data
flowing `parse → join → aggregate → verdict`, with `rulesets` supplying tunables and `allocate`
depending on join + aggregate:

| Module | Capability doc | Emits |
|---|---|---|
| `parse.ts` | [01 Ingestion](../domain/01-ingestion-and-hygiene.md) | typed FB / KT-main / KT-clicks rows; totals / invalid / unfired-macro rows dropped or tagged |
| `join.ts` | [02 The Join](../domain/02-the-join.md) | one fact table at `Campaign × Creative × Date`, joined on Campaign ID alone ([0001](0001-single-fact-table-join-on-campaign-id.md)) |
| `commission.ts` | [05 Rulesets](../domain/05-rulesets-and-versioning.md) | `rateFor(account)` from seller rules → `defaultCommission`; unclaimed accounts returned as **warnings** |
| `aggregate.ts` | [03 Metrics & ROI](../domain/03-metrics-and-roi.md) | Spend⁺, CPC/CPI/CPR/CPS, EPC, Profit, ROI per roll-up level; null on zero denominator |
| `verdict.ts` | [04 Verdict Engine](../domain/04-verdict-engine.md) | zone + action from the funnel waterfall; Waste; Problem Accounts |
| `allocate.ts` | [06 Allocation](../domain/06-allocation.md) | Offer / OS allocated Spend, split by Installs, labelled estimate |

The layer imports **no React, no transport, no DB** ([0004](0004-client-compute-server-persistence.md)).
Its per-fact output shape is the **same fields** as `snapshot_fact` (campaign, creative, reportDate,
geo, account, offer, os, spend, spendPlus, revenue, linkClicks, installs, regs, sales, verdict,
zone), so `createSnapshotFn`'s input is a straight map — no re-derivation on save
([0002](0002-immutable-ruleset-versions.md)).

## Why

- **One shape, two consumers.** The UI renders the fact roll-ups and the save flow persists them.
  If the computed fact and `snapshot_fact` disagree, a saved Snapshot can't reproduce the on-screen
  numbers. Aligning the emit shape to the table makes divergence impossible by construction.
- **Per-seller commission belongs in compute, not UI.** Spend⁺ is the numerator of every cost
  metric ([03](../domain/03-metrics-and-roi.md)); resolving the rate per Account is arithmetic, so
  it sits with the arithmetic and is unit-tested there. The reference's single flat commission is a
  special case (`sellers = []`).
- **Module = capability doc** keeps the code navigable and the Vitest fixtures organised: each
  module tests against the hand-verified outputs the matching doc already cites (dataset `*big*`,
  6 %).

## Consequences

- Slice 1 builds `parse → join → commission → aggregate → verdict` end-to-end (allocate deferred to
  slice 4); everything after slice 1 is presentation + wiring over a proven layer.
- Geo Total ([0003](0003-geo-total-diverges-from-attributed.md)) is computed here too — untagged /
  unfired-macro rows counted toward the Geo, excluded from Attributed — so the divergence is a data
  property, not a UI afterthought.
- A change to any formula is a domain-module edit plus its fixture, never a component edit.
