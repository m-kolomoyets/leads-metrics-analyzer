# Idea 6 — "A disabled button that does nothing is worse than no button"

**Angle:** teach-by-pattern
**Evidence:** ADR-0011 (dirty-gated ruleset saves)

## LinkedIn (compact essay)

A save button that's always clickable but sometimes does nothing is worse than having no button at all.

We had one. It gated on validity only, never on change. Press it twice on an unmodified form and you'd mint two byte-identical version rows. Harmless while the fields sat visible on screen — annoying once that panel collapsed by default and the save button rode along in the collapsed header, above values nobody could see.

An enabled control implies it does something. A collapsed, always-enabled save invites a click whose only visible effect is invisible version churn — and now your audit trail ("when did these thresholds actually change?") is unreadable.

The fix was small: gate save on valid **and** dirty. Compare the draft against the last-saved state; disable unless something actually changed. Cheap, local, no state lifted, no API change — just a pure comparison the component already had the data for.

Takeaway: any control that mutates state should be disabled on "no-op," not just on "invalid." Validity answers "is this safe to save?" Dirtiness answers "is there anything to save?" You need both.

#SoftwareEngineering #UXEngineering #Frontend #ProductQuality

## Twitter/X thread

1/ A button that's always clickable but sometimes does nothing is worse than no button at all.

2/ Ours: a "save" gated on validity only. Press it twice on an unchanged form → two byte-identical version rows minted.

3/ Harmless when the form was visible on screen. Not harmless once the panel collapsed by default and save rode along in the collapsed header — above values nobody could see.

4/ Enabled implies "this does something." An always-enabled save on a collapsed panel invites a click whose only effect is invisible churn in your audit trail.

5/ Fix: gate save on valid AND dirty. Compare the draft against last-saved state, disable when nothing changed. No new state, no API change — a pure comparison.

6/ Rule for any mutating control: validity answers "is this safe to save." Dirtiness answers "is there anything to save." Gate on both, not just one.
