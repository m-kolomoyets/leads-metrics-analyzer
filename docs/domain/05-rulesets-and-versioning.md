# 5 · Rulesets & Versioning

Everything tunable that feeds the Verdict Engine, and how it is persisted so past judgements stay
reproducible. See [ADR-0002](../adr/0002-immutable-ruleset-versions.md).

## What a Ruleset contains

| Setting | Scope | Feeds |
|---|---|---|
| Threshold Pairs: installs / regs / sales / clicks `{gy, yr}` | **per-Geo** | Verdict zones |
| Waste Zones `{gy, yr}` (% of spend) | **per-Geo** | Waste colouring |
| ROI bands | (tunable input) | ROI zone colouring |
| Review Multiplier `K` | **global** | Problem Account |
| Default Commission | **global** | Spend⁺ |
| Seller rules (rate → Account IDs) | **global** | Spend⁺ per Account |

Per-Geo, a Geo may hold **several named presets** (e.g. `KR Olympus Slot`, `IN Slot`) with one
active. `wasteZones` is per-Geo because waste tolerance is a market-maturity judgement; `K` is
global because it already scales off a per-Geo threshold.

## Sellers

A **Seller** supplies Accounts at one Commission rate; an Account ID belongs to exactly one Seller.
A "Multiple sellers" toggle reveals seller groups — enter a rate, list the Account IDs it covers.
The common case is one default rate for everything (e.g. all 7 %); the exception is split (e.g. 10
accounts @ 6 %, 5 @ 10 %). Accounts matched by **no** Seller fall to the default and are
**surfaced as a warning**.

## Versioning

The whole Ruleset is **immutable and versioned as one unit**. Editing produces a local **draft**;
an explicit save mints a new `ruleset_version`. A **Snapshot** (facts at grain + the Verdicts they
produced) references exactly one `ruleset_version_id` and is self-sufficient to rebuild a report
with charts.

- Analysis may run against an unsaved draft (tuning is iterative).
- A Snapshot may be pushed only from a **saved** version — pushing forces a save first.
- An unsaved draft is lost on reload (accepted).

## Persistence shape (backend, Postgres + drizzle)

```
preset(id, geo, name)                       -- identity of a named preset
ruleset_version(id, created_at, payload)    -- immutable; all settings above, append-only
snapshot(id, taken_at, ruleset_version_id)  -- FK → the version that produced it
snapshot_fact(snapshot_id, campaign, creative, date, …facts…, verdict, zone)
```

Backend is "just the SQL DB"; the browser reaches it through a thin API, never directly
([ADR-0004](../adr/0004-client-compute-server-persistence.md)).

## Prototype → change

- Prototype **autosaved on every keystroke** to a local `presets.json` (File System Access API,
  Chromium-only, errors swallowed). **Change:** explicit save mints an immutable version;
  persistence moves to versioned Postgres rows.
- Prototype presets were **mutable** — retuning a threshold silently rewrote the meaning of every
  past judgement. **Change:** append-only versions; a Snapshot always reproduces.
- Commission was a **single global** `shared.commission`. **Change:** default + per-Seller
  overrides, so differently-sourced accounts are costed correctly.
- Prototype's `commission` value in `presets_big.json` is **7 %**, but the hand-verified sheet uses
  **6 %** — a data-entry error; 6 % is correct for that dataset.
