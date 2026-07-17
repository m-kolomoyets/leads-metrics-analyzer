# Single fact table, joined on Campaign ID alone

The prototype ran two disconnected joins (campaign on `Campaign ID | country`, creative on a
regex-extracted `KR_54 | country`) plus a single-row fallback, so campaign and creative totals
could never be reconciled and a cross-geo leak was possible.

We instead join **once**, on `Campaign ID` (Facebook) = `Sub ID 2` (Keitaro) **alone**, into one
fact table at grain `Campaign × Creative × Date`. Every table (campaign, account, geo, creative,
offer, OS) is a roll-up of that one join. Facebook is authoritative for Geo and Account; Keitaro's
`Country` and `Sub ID 4` are ignored for joining.

## Why

- A Campaign targets exactly one Geo and runs from one Account (verified: 0 cross-geo, 0
  cross-account campaigns in sample; FB and KT agree on both for every matched row). So country in
  the join key can only make a match *fail*, never succeed — it added the entire class of
  "campaign silently dropped, judged СТОП on missing data" bugs.
- One join means creative totals sum to campaign totals sum to geo totals *by construction*, not
  by discipline.
- The fallback that attributed a globally-unique `Sub ID 2` to whatever geo was being viewed
  (silent cross-geo leakage) disappears entirely — there is no fallback left.

## Consequences

- A Campaign appearing in two Geos becomes a **data anomaly to warn about**, not a normal case.
- `Sub ID 4` and Keitaro `Country` are kept only as **integrity checks** (warn on disagreement)
  and, for `Country`, to place Untagged Revenue at Geo level — never to join.
- Offer and OS live *below* the join (Keitaro-only dimensions); their Spend is Allocated, not
  measured. See [0003](0003-geo-total-diverges-from-attributed.md) and the allocation capability
  doc.
