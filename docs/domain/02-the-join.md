# 2 · The Join

Combine the three cleaned sources into **one fact table** that every downstream table rolls up
from. See [ADR-0001](../adr/0001-single-fact-table-join-on-campaign-id.md).

## Fact grain

`Campaign × Creative × Date`. Geo and Account are **attributes of the Campaign**, not part of the
key — a Campaign runs one Geo from one Account.

## Keys

| Concept | Facebook | Keitaro | Notes |
|---|---|---|---|
| **Join key** | `Campaign ID` | `Sub ID 2` | the *only* join predicate |
| Geo | `Country` (ISO-2) | — | FB authoritative |
| Account | `Account ID` | `Sub ID 4` | FB authoritative; KT used as integrity check |
| Creative | `Ad name` | `Sub ID 5` | full string is identity |
| Offer | — | `Offer ID` | Keitaro-only, below the join |
| OS | — | `OS` | Keitaro-only, below the join |

Join on `Campaign ID` **alone**. Country is deliberately excluded: since a Campaign has one Geo,
country in the key can only make a match fail, never succeed.

## Collapsing to grain

Keitaro rows are finer than the fact grain (they split by Offer × OS). Multiple rows sharing a
`(Campaign, Creative)` are **summed** — installs, regs, sales, revenue, link clicks all add.
Facebook rows that repeat a `(Campaign, Creative)` are summed too.

Creative and Offer identity are the **full** `Ad name` / `Offer ID` — never a regex-reduced or
positionally-sliced key. `GEO_NN_[Brand]` parts of an ad name and the pipe-blocks of an offer
string are parsed as **display attributes**, and convention violations are surfaced, never dropped.

## Integrity checks (warn, don't drop)

- Keitaro `Country` (→code) disagrees with FB Geo for a matched Campaign → possible VPN /
  misdelivery / tracker misconfig. Surface it.
- Keitaro `Sub ID 4` disagrees with FB `Account ID` → tracker/account mismatch. Surface it.
- Same `Campaign ID` seen in two Geos → violates the one-campaign-one-geo invariant. Surface it.

## Prototype → change

- Prototype ran **two** joins (campaign on `id|country`, creative on regex `KR_54|country`) plus a
  single-row fallback that leaked a globally-unique `Sub ID 2` into whatever geo was on screen.
  **Change:** one join, one grain, no fallback → leak impossible, all levels reconcile (except the
  Geo Total, deliberately — [ADR-0003](../adr/0003-geo-total-diverges-from-attributed.md)).
- Prototype **overwrote** colliding Keitaro rows (`Map.set`, last-wins), silently eating
  installs/revenue when a Campaign served multiple OSes. **Change:** sum. (Verified: a KR campaign
  reported 1 install instead of 3.)
- Prototype **first-wins-deduped** colliding FB rows while summing them elsewhere, so campaign
  spend and geo spend disagreed once FB was exported per-ad. **Change:** sum. FB will be exported
  per-creative going forward.

## Absent vs zero

A Campaign with FB spend but **no** matching Keitaro row is treated as **zero** conversions
(→ likely СТОП), *not* a distinct "no data" state — the operator's explicit choice. Consequence to
respect: a broken tracking macro is indistinguishable from a dead campaign, which is exactly why
the date-range mismatch warning ([01](01-ingestion-and-hygiene.md)) matters.
