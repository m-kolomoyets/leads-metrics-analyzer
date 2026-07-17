# 3 · Metrics & ROI

Every derived number, from the joined facts. Validated to the cent against the hand-built country
sheet (dataset `*big*`, commission **6 %**).

## The one cost basis: Spend⁺

```
Spend⁺ = Spend × (1 + Commission)
```

**Every** cost figure divides by Spend⁺, never by raw Spend. Raw Spend is a display column only.

## Cost-per family (lower is better — these are what Thresholds grade)

| Metric | Formula | Sheet name |
|---|---|---|
| CPC | `Spend⁺ ÷ Link Clicks` | CPC |
| CPI | `Spend⁺ ÷ Installs` | UniqCost |
| CPR | `Spend⁺ ÷ Registrations` | ConversionCost |
| CPS | `Spend⁺ ÷ Sales` | DepCost |

Any metric with a zero denominator is `null` (not shown), not `0`.

## Value & conversion

| Metric | Formula |
|---|---|
| EPC | `Revenue ÷ Installs` (per **install**, despite the name) |
| Profit | `Revenue − Spend⁺` |
| ROI | `(Revenue − Spend⁺) ÷ Spend⁺ × 100` |
| Click2inst | `Installs ÷ Link Clicks × 100` |
| Inst2reg | `Registrations ÷ Installs × 100` |
| Reg2dep | `Sales ÷ Registrations × 100` |

One ROI definition at **every** level — Geo, Account, Offer, OS. Commission never omitted.

## Worked check (golden, commission 6 %)

| Geo | Spend | Spend⁺ | Revenue | Profit | ROI | CPC | CPI |
|---|---|---|---|---|---|---|---|
| India | $1380 | $1463 | $1685 | +$222 | +15 % | $0.83 | $1.37 |
| Korea | $998 | $1058 | $1620 | +$562 | +53 % | $5.01 | $15.33 |

`Profit = Revenue − Spend⁺`; `ROI = Profit ÷ Spend⁺`; `CPC = Spend⁺ ÷ Link Clicks`. All reproduce
exactly. (The same figures at 7 % give IN +$208/14 %, KR +$552/52 % — used to confirm the engine
before locking commission at 6 %.)

## Commission scope: Sellers

Commission is not globally uniform. An **Account** belongs to exactly one **Seller**, each with one
rate; an Account is never split across Sellers. Accounts unclaimed by any Seller take the **default
Commission** — and are **surfaced as a warning**, never silently defaulted (a new account from a
10 % seller must not be costed at the 7 % default unnoticed). See
[05](05-rulesets-and-versioning.md) for how Seller rules are stored and versioned.

## Uniques do not sum

Link Clicks and Installs are unique-per-user. Summing Campaign-grained rows **overstates** a Geo's
unique totals (KR installs 88 summed vs 69 true). At **Campaign grain the sum is exact**; at Geo
grain the unique counts are approximate and will not tie out to Keitaro's country dashboard. Assert
geo Spend/Spend⁺/Revenue/Profit/ROI exactly in tests; assert geo unique *counts* with tolerance, or
only at Campaign grain. See [ADR-0003](../adr/0003-geo-total-diverges-from-attributed.md).

## Prototype → change

- Prototype computed CPC/CPI/CPR/CPS on **raw** Spend, then applied commission only to Profit and
  (inconsistently) to some ROIs — three disagreeing ROI formulas, and a geo card whose ROI and
  Profit contradicted each other. **Change:** one Spend⁺, one ROI, commission everywhere.
- Prototype used `UC (campaign)` from the clicks report as "clicks" and from the main report as
  "installs" — different metrics, same column name. The raw `Clicks` column was never read.
  **Change:** keep this mapping explicitly; "clicks" always means **unique** clicks.
- Prototype had ROI zone bands hard-coded (`−20 / +30`) while every other threshold was tunable.
  Bands stay a **judgement input** — where they live is decided in [04](04-verdict-engine.md).
