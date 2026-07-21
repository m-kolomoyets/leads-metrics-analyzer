# Dirty-gated ruleset saves

ADR-0002 replaced autosave with an explicit "Зберегти" that mints a new `ruleset_version`. Save was
gated on *validity* only, never on *change* — pressing it twice minted two byte-identical versions.
Harmless while the threshold fields were always on screen; not harmless once the zone-metrics block
collapses by default and the save button rides in the collapsed header, above values nobody can see.

A save now requires the draft to **differ from the active version**. `ThresholdEditor` compares the
draft against `toThresholdDraft(preset.thresholds)` across `THRESHOLD_METRICS`; the button is
disabled unless valid **and** dirty.

## Why

- Version rows are the audit trail a Snapshot points at. Duplicate adjacent versions are not wrong,
  but they make "when did KR's thresholds actually move?" unanswerable by reading the version list.
- A control that is enabled implies it does something. On a collapsed panel an always-enabled Save
  invites a click whose only effect is invisible version churn.
- Cheap and local: the comparison is a pure derive in the component that already owns the draft. No
  state lifted, no server change — the API still accepts any save.

## Consequences

- Dirtiness is judged on the **draft's string form**, not parsed numbers, so `10` vs `10.0` reads as
  a change. Accepted: the fields round-trip through `toThresholdDraft`, so a freshly loaded preset is
  never spuriously dirty.
- Rename is unaffected — it touches identity, not versions, and keeps its own `canRename` gate.
- The collapsed header shows an unsaved marker when the draft is dirty, so a shut panel never looks
  clean while work is pending. Collapsing still unmounts the panel; the threshold draft survives
  (its owner renders the header), `PresetCreator` / `SharedSettingsEditor` drafts do not.
- Deliberate no-op saves (e.g. "re-stamp the current rules under today's date") are no longer
  possible from the UI. No use case for them exists today; if one appears it needs its own control,
  not an ungated Save.

See also: [0002](0002-immutable-ruleset-versions.md).
