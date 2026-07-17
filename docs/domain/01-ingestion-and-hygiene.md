# 1 · Ingestion & Hygiene

Turn three kinds of uploaded CSV into clean, typed rows ready to join.

## Inputs

| Slot | Source | Grain | Key columns |
|---|---|---|---|
| **Facebook Ads** (1+ files) | FB Ads export | Country × Account × Campaign × Creative × Day | `Country`, `Account ID`, `Campaign ID`, `Ad name`, `Amount spent (USD)`, `Impressions`, `Reporting starts/ends` |
| **Keitaro main** (1 file) | Keitaro main report | Country × Campaign × Creative × Offer × OS | `Sub ID 2`, `Sub ID 5`, `Country`, `Offer ID`, `Offer`, `OS`, `UC (campaign)`→Install, `Conv.`→Reg, `Sales`, `Revenue` |
| **Keitaro clicks** (1 file) | Keitaro clicks report | Country × Campaign × Creative | `Sub ID 2`, `Sub ID 4`, `Sub ID 5`, `Country`, `UC (campaign)`→Link Click |

The reference datasets are `references/*Test*` (small, KR-only) and `references/*big*` (IN/KR/SG,
the hand-verified golden set).

## Parsing

- Delimiter: FB is comma, Keitaro is semicolon. Auto-detect per file (PapaParse `header:true`,
  `skipEmptyLines:true`).
- Strip UTF-8 BOM; trim header names before matching (headers arrive space-padded and quoted).
- Number parse: strip `$` and whitespace; treat comma as decimal only when no dot is present, else
  as a thousands separator. Non-numeric → 0.
- Route files by detected type, not by drop-zone, so a Keitaro file dropped on the FB slot still
  lands correctly.

## Hygiene rules (what gets dropped, and where)

| Rule | Condition | Scope | Rationale |
|---|---|---|---|
| **Totals Row** | empty `Country` (FB) / empty `Sub ID 2` (KT) | everywhere | export summary row; counting it double-counts every total |
| **Invalid Row** | empty `OS` (KT main) | everywhere | not a fact about any Campaign |
| **Unfired Macro** | `Sub ID 2` starts with `{` | Campaign level only | macro never expanded; Campaign attribution lost. Geo + Account survive (creative code carries Geo, `Sub ID 4` carries Account) → counts toward the **Geo Total** |

All other OS values (`Android`, `iOS`, `OS X`, `GNU/Linux`, …) are **kept** and appear as their own
rows in the OS table — no "Other" bucket.

## Prototype → change

- Prototype's only OS handling dropped non-Android/iOS from the OS *table* while still counting
  them in campaign/geo totals — so the OS table never reconciled. **Change:** empty-OS dropped
  everywhere; every other OS kept everywhere. Now OS-table installs sum to Geo installs.
- Prototype discarded unfired-macro rows wholesale. **Change:** salvage their Geo/Account
  contribution to the Geo Total; only Campaign attribution is lost. See
  [ADR-0003](../adr/0003-geo-total-diverges-from-attributed.md).
- Prototype never read `Reporting starts/ends`. **Change:** read and display the FB window;
  require the operator to state the Keitaro window; **warn hard on mismatch** — with absent-as-zero
  ([04](04-verdict-engine.md)) a date-range mismatch otherwise becomes a silent kill recommendation.
- Analysis is **single-day**; `Date` is nonetheless kept in the fact grain so multi-day trend
  views are additive later, not a rewrite.

## Geo normalisation

Facebook emits ISO-2 (`KR`) and is authoritative. Keitaro emits an English name (`South Korea`),
needed **only** to place Untagged Revenue at Geo level ([03](03-metrics-and-roi.md)) — never to
join. The prototype's hand-written name→code table covers ~53 countries and silently passes
unknown names through unchanged, producing a phantom geo with spend but no revenue (−100 % ROI) for
any country outside the list — the biggest multi-geo hazard.

**Change:** prefer a Keitaro ISO-code column if one can be exported (deletes the table); otherwise
a complete ISO library **plus a loud failure** naming any unmatched country. Never a silent
passthrough.
