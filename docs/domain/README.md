# Domain capabilities

What the app does, one small context per file. Read [`../../CONTEXT.md`](../../CONTEXT.md) first
for the glossary — these docs use its terms exactly. Architectural decisions live in
[`../adr/`](../adr/).

The app joins **Facebook Ads** spend with **Keitaro** conversion data and judges every Campaign —
per Geo, Creative, Offer, OS — as **СТОП / ТРИМАЄМО / БУСТ**. It runs client-side; the reference
prototype is `references/analizator-kampaniy-blue (1).html` (single-file React, Ukrainian UI).
Each doc records **prototype behaviour → what changes → why**, so the rewrite is traceable.

## The pipeline

| # | Capability | One line |
|---|---|---|
| 1 | [Ingestion & Hygiene](01-ingestion-and-hygiene.md) | Parse 3 CSV kinds; drop totals/invalid/macro rows |
| 2 | [The Join](02-the-join.md) | One fact table at `Campaign × Creative × Date` |
| 3 | [Metrics & ROI](03-metrics-and-roi.md) | Spend⁺, the cost-per family, Profit, ROI |
| 4 | [The Verdict Engine](04-verdict-engine.md) | Funnel waterfall → zone → action; Waste; Problem Accounts |
| 5 | [Rulesets & Versioning](05-rulesets-and-versioning.md) | Immutable tunables; Sellers; Snapshots |
| 6 | [Allocation](06-allocation.md) | Offer/OS spend split from real Campaign spend |

Data flows 1 → 2 → 3 → 4, with 5 supplying the tunables that 4 reads and 6 depending on 2+3.

## Known open questions

Tracked here so they are not lost; none blocks the model.

- Offer-string blocks 5, 7, 13–15 are unparsed — meaning unknown. Mirror the prototype (ignore)
  until specified; see [06](06-allocation.md).
- Exact share of Revenue arriving Untagged is unquantified (sample had none). Decides how prominent
  the "unattributed" figure should be.
- Whether Keitaro can export an ISO country **code** column — would delete the name→code table and
  a whole class of multi-geo bug. Currently assumed **no**; see [01](01-ingestion-and-hygiene.md).
