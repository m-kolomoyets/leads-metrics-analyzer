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

### Reviewed — triage state, not a verdict input

A Problem Account demands investigation, and the analyst needs to track which ones they have got
to. **Reviewed** records that, and lives entirely in the UI: `accountsFor` neither accepts nor
returns it, so the compute layer stays a pure function of facts + ruleset
([ADR-0010](../adr/0010-compute-layer-module-layout.md)). Marking an account Reviewed silences its
pulse and retires its alarm styling; the red frame, pill and reason all remain, because the account
is still a Problem Account — reviewing it records that a human looked, not that the rules stopped
firing.

Account **order** is never touched: both the summary table and the block list render the compute
layer's Spend⁺-descending order, so reviewing an account never moves rows around mid-pass. Problem
Accounts instead start **collapsed** — the alarm strip above and the red header already carry the
finding, and the campaign tables underneath are noise until the account has been checked by hand.

This is the inverse of **Excluded**, which sits beside it in the same header and *is* an analysis
input: muting a campaign removes it from the account's metrics, zone counts, waste and the Problem
rules. Keeping the two straight matters because they look alike in the UI and only one of them can
change a number.

Reviewed is session state, keyed per Geo, cleared on upload — the same clear that drops `excluded`
and `collapsed`, since a new file set voids every judgement taken against the old one. Threshold
edits deliberately *keep* reviews: tuning the preset is how an analyst works through a geo, so
wiping the pass on each tweak would make the two features fight. Accounts that newly turn Problem
still announce themselves through the red frame and the digest's outstanding count.

## Structured reasons (not prose)

The domain returns a **structured** reason and the UI renders it per locale (full UK + EN i18n). The
"why" column names the **criteria that decided** — stage word, cost line, zone label, situational
note — never the action word (the row's colour bar already carries the verdict).

The reason is a **discriminated union** on `kind`, so the renderer can tell the situations apart
instead of guessing from field shapes:

| `kind` | when | fields | why line (uk) |
|---|---|---|---|
| `graded` | a stage produced results | `stage, metric, value, zone` | `Продажі: CPS $12.34 — червона` |
| `clicksWaiting` | judged on clicks, non-red | `stage, metric, value, zone:'yellow'` | `Кліки: CPC $0.30 — жовта, чекаємо інстал` |
| `zeroResult` | zero results, Spend⁺ past a red line | `stage, metric, value` (raw Spend⁺) | `Продажі: 0 за $300.00 (понад черв.)` |
| `tooEarly` | spent under every red line, nothing yet | `value` (raw Spend⁺) | `Рано судити (spend $50.00)` |
| `spendZero` | Spend⁺ = 0 | — | `Spend 0 — не аналізується` |

`verdictFor` always returns a reason; `Verdict.reason` is `null` **only** with no preset loaded
(`thresholds` undefined), which renders as an em dash. The domain layer never emits display strings,
which keeps it pure ([ADR-0004](../adr/0004-client-compute-server-persistence.md)) and its tests free
of language assertions.

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
