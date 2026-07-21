# Offer and OS Spend is priced at the Geo's unit cost, not split per Campaign

Facebook never measures Spend per Offer or per OS ([0001](0001-single-fact-table-join-on-campaign-id.md)),
so those tables' money is imputed. It is imputed as:

```
unit cost = Geo Spend⁺ ÷ Geo Installs          (all of it, every campaign)
row Spend⁺ = row Installs × unit cost
```

The previous rule split each *Campaign's* Spend⁺ across its own Offers in proportion to that
campaign's Installs. That is a finer-grained calculation, and it is wrong here.

## Why

A campaign that spent money and bought **zero** Installs has no share denominator, so under the old
rule its entire Spend⁺ fell through to `unallocated` and never reached an Offer. On the golden set:

| Geo | Spend⁺ | Installs | Old: allocated to Offers | Stranded | New |
| --- | --- | --- | --- | --- | --- |
| IN | 1463.38 | 1026 | 1240.52 | 222.87 | 1463.38 |
| KR | 1058.48 | 69 | 477.28 | 581.21 | 1058.48 |

Over half of Korea's money never reached the Offer table. The visible symptom: offer 12846 reported
CPI 6.90 while the Geo header directly above it reported CPI 15.33 — the same metric over the same
traffic, disagreeing by more than 2×, with no indication which to believe.

The Geo unit cost is **15.340**, and the hand-verified sheet's KR CPI is **15.33**. The reference
prices Offers this way; matching it is not a preference.

The reasoning is also just true: money spent on a campaign that bought no uniques was still money
spent trying to buy uniques in that market. It belongs in what an Install cost. Excluding it
understates the real price of everything.

## Consequences

- **`unallocated` is normally 0.** Offer Installs sum to the Geo's Installs, so pricing them at the
  Geo rate returns exactly the Geo's Spend⁺. It is non-zero only when a Geo bought no Installs at
  all — no unit cost exists, so every dollar is a remainder. It stays in the type and in the UI for
  that case, and so the footer always reconciles.
- **CPI is uniform across an Offer table by construction.** It is a costing basis, not a comparison
  axis — reading "which offer is cheaper per install" off this table is meaningless. What actually
  separates Offers is Revenue per Install: EPC, ROI, CPR and CPS, all riding on real Keitaro counts.
  Any UI that sorts or grades Offers by CPI is reporting noise.
- **Per-campaign cost differences are given up at this level.** Two campaigns at genuinely different
  CPIs are blended into one rate. Campaign-grain cost is still exact on the Facts and in the Account
  block — that is where the stop/scale decision is made anyway.
- The OS table drops non-mobile rows, so its Installs do *not* sum to the Geo's and its Spend⁺
  legitimately totals less. That gap is the desktop traffic, not an allocation error.
- Campaign-lost facts ([0012](0012-three-classes-of-untagged-keitaro-row.md)) carry Installs with no
  Spend, so they pull the unit cost down slightly and are then charged at it. Correct: that traffic
  was bought by the Geo's money, it just cannot say by which campaign.
- Uniques still do not sum ([0003](0003-geo-total-diverges-from-attributed.md)). The unit cost
  divides by a Geo Install count that overstates, so it reads slightly low. Money asserts exactly;
  every cost-per asserts with tolerance.
