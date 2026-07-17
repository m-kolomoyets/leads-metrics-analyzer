# 6 · Allocation (Offers & OS)

Offer and OS live **below** the join — Keitaro knows them, Facebook does not, so their Spend is
never measured, only **Allocated** from real Campaign spend.

## Why allocation is needed

The fact grain is `Campaign × Creative × Date` ([02](02-the-join.md)). A single Campaign's clicks
may monetise several Offers and run on several OSes, but Facebook bills the Campaign as a whole and
cannot see which Offer or OS a conversion belongs to. So an Offer's or OS's Spend has to be
*attributed*, not read.

## Allocation rule

Split each **Campaign's real Spend across its Offers / OS in proportion to that Campaign's own
Installs.**

```
offerSpend⁺(o) = Σ_campaigns  Spend⁺(c) × installs(o within c) / installs(c)
```

Then the Offer/OS rows carry the standard family from [03](03-metrics-and-roi.md) — CPC, CPI, CPR,
CPS, EPC, ROI, Click2inst, Inst2reg, Reg2dep — computed on **allocated** Spend⁺. Allocated Spend is
an estimate and must be **labelled as such** wherever shown.

## Offer identity

The **`Offer ID`** is the identity (`363`, `9592`, `12846`). The pipe-delimited `Offer` string is
parsed into display attributes; block count varies (15 vs 16), so parse by **meaning, not fixed
position**, tolerating absence.

Known blocks: `[0]` Geo, `[1]` Brand, `[2]` type, `[3]` model (CPA…), `[4]` **Payout** (`180 USD`),
`[8]` OS, `[12]` KPI flag. Blocks 5, 7, 13–15 are **unparsed** — meaning unspecified; mirror the
prototype and ignore them until defined (the prototype sliced only the first 6 blocks for a display
label). Payout is parsed but deliberately **not** used to derive thresholds ([03](03-metrics-and-roi.md)).

## Prototype → change

- Prototype allocated Offer/OS spend as `installs × geo-average CPI` — so its Offer CPI column was
  mathematically the geo average for every row (zero signal). **Change:** proportional split from
  each Campaign's **own** Spend, giving a real per-Offer CPI.
- Prototype keyed Offers by `id + first-6-pipe-blocks` and hard-dropped the literal string
  `"WWL Smartlink"`. **Change:** key by `Offer ID`; the smartlink drops out **naturally** because
  its rows carry no Sub IDs and cannot join ([02](02-the-join.md)) — no magic string needed.
- Prototype's OS table was hard-limited to Android/iOS. **Change:** every OS value present appears
  as its own row (empty-OS already dropped in [01](01-ingestion-and-hygiene.md)); no "Other".
