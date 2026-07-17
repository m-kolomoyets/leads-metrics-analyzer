# Vitest on the domain layer

The repo ships no test framework. The app's entire value is arithmetic that TypeScript cannot
check and the UI renders with total confidence even when wrong — this grilling alone found an
overwrite eating 2 of 3 installs, three contradictory ROI formulas, and a country-map that reports
−100 % ROI for unlisted geos.

We add **Vitest**, testing the **pure domain layer only** (parse, join, aggregate, verdict, ROI) —
no component or E2E tests. The reference CSVs become fixtures with hand-verified expected outputs.

## Why

- The domain layer is ~100 % of the risk and ~20 % of the code; component tests carry maintenance
  cost without covering the failure mode that matters (wrong numbers).
- [0004](0004-client-compute-server-persistence.md)'s pure domain layer is trivially unit-testable.
- Ground truth exists: the user's hand-built country sheet (dataset `*big*`) gives exact geo
  Spend, Spend⁺, Revenue, Profit and ROI at commission **6 %**, confirmed to the cent.

## Consequences

- **Golden fixtures = the corrected engine's output**, anchored to hand-verified figures — *not*
  the prototype's output, which encodes the bugs we are removing.
- Geo **Spend / Spend⁺ / Revenue / Profit / ROI** reconcile exactly and are hard assertions. Geo
  **unique counts** (installs, link clicks) are approximate by nature
  ([0003](0003-geo-total-diverges-from-attributed.md)) and must be asserted with tolerance, or
  only at Campaign grain where summing is exact.
- Commission for the golden dataset is **6 %**; `presets_big.json` says 7 % — that is a data-entry
  error in the fixture preset, corrected to 6 % when used as a test input.
