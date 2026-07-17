# 4 · The Verdict Engine

Turn one Campaign's metrics into one action: **СТОП** (red / stop), **ТРИМАЄМО** (yellow / hold),
**БУСТ** (green / scale), or no call yet (neutral).

## Zone primitive

A cost metric is graded against a **Threshold Pair** `{gy, yr}`:

```
cost <  gy   → green
gy ≤ cost ≤ yr → yellow      (yr inclusive)
cost >  yr   → red
```

Lower cost is better. The graded cost uses **Spend⁺** ([03](03-metrics-and-roi.md)).

## The waterfall

The Verdict comes from the **deepest funnel stage that produced a result** — check in order, first
hit decides, deeper stages ignored:

```
Sales > 0      → grade CPS against sales thresholds
else Regs > 0  → grade CPR against regs thresholds
else Installs>0→ grade CPI against installs thresholds
else Clicks>0  → grade CPC against clicks thresholds
```

A campaign judged on **clicks** can only be red or neutral — a cheap click is never БУСТ on its
own ("чекаємо інстал" — waiting for an install). This is deliberate, not a gap.

## Zero-result campaigns (spent, produced nothing at every stage)

If a stage's threshold is exceeded on spend alone with zero results, the campaign is red, naming
the stage: `spend > yr` for sales, then regs, then installs, then clicks. Otherwise neutral —
"рано судити" (too early).

## Waste

```
Waste = max(0, Spend⁺ − yr × count)      // only for a red Verdict
```

Waste is spend **above the red line for the results achieved** — the amount the buyer overspent.
Spend *below* the line is **not** waste: it is budget still legitimately working toward the next
result. Example (payout $250 red line, 1 sale): spend $300 → Waste $0 (runway left for sale #2);
spend $350 → Waste $25. Aggregated per Account, then per Geo, and shown against the per-geo Waste
Zone band (% of spend).

## Problem Account

An account-level alarm for **broken tracking / launch**, distinct from a mere red Verdict. With
`K = Review Multiplier`, `yrI = installs.yr`:

- **rule 1:** `Spend⁺ ≥ K × yrI` **and** `installs = 0` — money out, nothing tracked.
- **rule 2:** `CPI ≥ K × yrI` **and** (`CPR > regs.yr` or `regs = 0`) **and** `sales = 0`.

Compared against the **absolute** `K × installs.yr`, not the geo average — the geo average is
computed from the very accounts being judged, so it goes quiet exactly when the whole market is on
fire, and one catastrophic account drags it up and excuses the merely-bad ones.

## Structured reasons (not prose)

The domain returns a **structured** reason — `{ stage, metric, value, zone }` — and the UI renders
it per locale (full UK + EN i18n). The domain layer never emits display strings, which keeps it
pure ([ADR-0004](../adr/0004-client-compute-server-persistence.md)) and its tests free of language
assertions.

## Prototype → change

- Prototype's `decide()` graded raw-spend cost; **change:** grade Spend⁺ cost, consistent with the
  one-ROI rule.
- Prototype's Problem-Account tooltip claimed "vs geo averages" but the code compared to
  `installs.yr`. **Change:** keep the code (absolute), fix the text.
- Prototype built Ukrainian `why` strings inline in the domain. **Change:** structured reasons +
  i18n at the UI edge.
- **Action names** (`stop`/`hold`/`scale` in code, СТОП/ТРИМАЄМО/БУСТ in UK, English in EN) — code
  identifiers are English; the glossary records the Ukrainian words as the team's canonical terms.
- **ROI bands** (prototype hard-coded `−20/+30`): keep as a tunable judgement input; fold into the
  versioned Ruleset rather than leaving them hard-coded, so they version like every other
  threshold ([05](05-rulesets-and-versioning.md)).
