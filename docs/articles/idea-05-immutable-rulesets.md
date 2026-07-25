# Idea 5 — "We banned autosave from a feature and it made the product more trustworthy"

**Angle:** contrarian
**Evidence:** ADR-0002 (immutable ruleset versions)

## LinkedIn (compact essay)

Autosave is treated as a UX default nobody questions. We ripped it out of one feature, on purpose.

The feature: campaign thresholds, commission rules, seller rules, waste zones — all tunable, all feeding a verdict ("scale this campaign" / "kill it"). The prototype autosaved every keystroke.

Problem: retune a threshold today, and every past verdict that depended on the old value silently becomes unreproducible. You can't answer "would I have killed this campaign under the rules I had then?" — the rules you had then no longer exist anywhere.

Fix: rulesets are immutable and versioned. Editing never mutates in place — it builds a local draft. An explicit save mints a new `ruleset_version`. Every past judgment (Snapshot) references one exact version ID, forever.

The tradeoff nobody likes: an unsaved draft is lost on reload. We accepted that. Losing an edit is recoverable — redo the edit. Losing the ability to reproduce a past decision is not.

Takeaway: if "what would today's rules have said back then" is a question your product needs to answer, autosave-in-place is the wrong default. Version it instead.

What's a place in your own stack where convenience quietly cost you reproducibility?

#SoftwareEngineering #ProductDecisions #DataIntegrity #SystemDesign

## Twitter/X thread

1/ Autosave gets treated as a UX requirement nobody questions. We removed it from a feature — on purpose.

2/ The feature: tunable thresholds + commission rules that decide "scale this campaign" or "kill it." Prototype autosaved every keystroke.

3/ Retune a threshold today → every past verdict that depended on the old value becomes silently unreproducible. The rules that made that call no longer exist.

4/ Fix: rulesets are now immutable + versioned. Editing builds a local draft. An explicit save mints a new `ruleset_version`. A past judgment references one exact version ID — forever.

5/ Tradeoff: an unsaved draft is lost on reload. We took that hit on purpose. A lost edit is redoable. A lost historical decision is not.

6/ If your product ever needs to answer "what would today's rules have said back then" — autosave-in-place is the wrong default. Version it.

7/ Where has "convenient" quietly cost you "reproducible" in your own stack? Reply, curious what you've hit.
