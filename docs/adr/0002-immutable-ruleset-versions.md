# Immutable ruleset versions

Thresholds, commission, seller rules and waste zones are all tunable, and a Snapshot's Verdicts
depend on them. The prototype autosaved presets in place on every keystroke, so any past judgement
became irreproducible the moment a threshold was retuned.

We make the **Ruleset** (all geo Threshold Pairs and Waste Zones + global Review Multiplier,
default Commission and Seller rules) **immutable and versioned**. Editing never mutates; an
explicit save mints a new `ruleset_version`. A Snapshot references exactly one
`ruleset_version_id`, so a past judgement reproduces forever.

## Why

- A Snapshot pushed to the backend must be reproducible for reporting. A mutable preset ID points
  at *current* state; a version ID points at *historical* state. Only the latter is honest.
- One version stream (all settings in one version) over two: a Snapshot then carries one foreign
  key and can never reference a mismatched threshold/commission pair. Version rows are cheap;
  editing KR also versioning IN's untouched thresholds is harmless.
- Enables the core question "would I have killed this campaign under *today's* rules?" — needs both
  the historical version and the current one.

## Consequences

- Per-keystroke autosave is **removed**. Editing produces a local draft; "Зберегти" mints a
  version. An unsaved draft is lost on reload (accepted).
- Analysis may run against an unsaved draft (tuning is iterative), but a Snapshot can only be
  pushed from a saved version — pushing forces a save first.
- Once Snapshots reference versions, the scheme is hard to reverse: mutable-ID history is *already*
  corrupt and no migration recovers it. Chosen deliberately up front for that reason.
