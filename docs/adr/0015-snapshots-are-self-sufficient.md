# A Snapshot stores everything a report needs, and freezes only what cannot be derived

A Snapshot stops being "the Facts plus a pointer to a Ruleset Version". It carries:

- **Facts** at Fact Grain (`Campaign × Date`), each keeping its **attribution**;
- **Creative Splits** — real per-creative Spend and Impressions, below the Fact Grain;
- **Campaign Models** — the per-campaign Offer and OS funnel breakdown, below the Fact Grain;
- a **Frozen Geo Rollup** per Geo — Spend⁺, Geo Total, Profit, ROI, the cost-per line, the Geo Total's
  funnel counts and Waste;
- the **resolved thresholds** of every Ruleset Version it pinned, copied in, with the version ids kept
  as provenance.

Everything else — Offers, OS, Creative, account totals, Problem Accounts, every grade and tint — is
recomputed on read through the same code path Analyze uses. `snapshot_geo` is nullable: Snapshots
written before this decision have no rollup, and their Geo Total, Profit, ROI and Waste read `—`
rather than being backfilled.

## Why

The old shape could not keep the promise made for it. Three of the four tables in a report are
**allocations**, not roll-ups: the Creative table splits a campaign's funnel by each creative's Spend
share, and the Offers and OS tables allocate at the Geo Unit Cost (ADR-0013). Their inputs sit *below*
the Fact Grain and were deliberately kept out of the Fact — so a saved Snapshot had the outputs' totals
but no way to reproduce their rows. `fact.creative` and `fact.offer` are representative labels (the
top-spending one); `fact.os` is null whenever a campaign ran more than one. Rebuilding from them would
have invented numbers.

Geo Total is worse than missing: it is *unreconstructable in principle*. It counts Untagged Revenue,
which by definition never becomes a Fact (ADR-0003, ADR-0012). No amount of care with the Facts brings
it back — and neither does the cost-per line, which reads back as the counts only while Spend⁺ is
non-zero, so the Geo Total's installs, clicks, registrations and sales are frozen outright beside its
revenue rather than inverted out of it. That is the one figure that had to be frozen — and freezing it is what draws the line for
everything else. Freeze what cannot be derived; derive everything that can.

The alternative — freezing every table as stored rows — was rejected because it creates a second
source of truth for numbers the compute layer can produce. Any later fix to allocation or grading
would silently disagree with old rows, and nothing would distinguish "history was different" from
"the code was wrong then". One compute path, exercised by both entry points, is the only version of
this that stays honest. The Frozen Geo Rollup is the deliberate exception, and it is also what lets
the Report feed render hundreds of Geo rows without loading a single Fact.

Attribution is stored rather than inferred because it is load-bearing for an alarm. The Problem
Account detector skips non-`full` Facts on purpose: a Campaign-lost row carries Revenue against zero
Spend, so folding it in makes a burning account look thrifty and can clear a real flag (ADR-0012). The
only way to infer attribution from what was stored is to test the campaign field against the `—`
display placeholder — coupling a money-losing safeguard to a UI string that someone will one day
change.

Thresholds are copied rather than referenced because the reference does not hold. `preset_version`
cascades when its Preset is deleted and `applied_ruleset_geo.preset_version_id` is `set null`, so a
buyer tidying up their Presets destroys the grading of every Snapshot that pinned them — numbers
survive, every grade turns neutral. Blocking the delete would have worked, but it adds a
cross-aggregate lifecycle rule that will be forgotten and re-broken; a few hundred bytes of copied
jsonb per Snapshot-Geo cannot be broken by anything. Immutability that depends on nobody deleting
anything is not immutability.
