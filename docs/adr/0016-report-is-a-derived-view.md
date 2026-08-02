# A Report is a derived view over Snapshots, not an aggregate of its own

There is no `report` table and no "submit report" action. A buyer pushes a **Snapshot**; a **Report**
is what an overseer's date range makes of the Snapshots they can see, grouped by author and by the
day of data each describes. Two overseers asking different ranges read different Reports over the same
Snapshots.

Grouping and filtering run on a Snapshot's **report date** — the day the data describes — never on
`taken at`, which is shown only as freshness. The feed shows the latest Snapshot per (user × report
date); the archive shows every version.

## Why

The obvious alternative was a `report` row that a buyer seals — "my day is done" — bundling N
Snapshots, with the archive listing those rows. It fails a simple test: can a buyer push a Snapshot
that belongs to no Report? Yes, and there is no reason to forbid it. So `report_id` would be nullable,
the wrapper would buy nothing, and grouping by author and date — which the feed does anyway — gives
the identical accordion for free. A wrapper only earns its keep if "sealed" is a state an overseer
must be able to distinguish from "in progress", and nobody wants that distinction.

The push already carries the right identity. One click saves one Snapshot spanning every analyzed Geo,
with a report date picked at save (#25), which is exactly one card in the feed with one row per Geo.
The entity the domain needed already existed.

Choosing report date over `taken at` as the grouping key follows from what an overseer asks. The
question is "how did KR do last week", not "what did people click save on last week". Report date is
also the only key stable across a correction: a buyer re-pushing Monday's analysis on Wednesday lands
on Monday, where it belongs, instead of appearing as fresh Wednesday performance. The cost is that two
Snapshots can share a (user, date) slot — resolved by showing the latest in the feed and every version
in the archive, so the working view reads as current truth and the audit trail stays complete.

Keeping the Report derived also keeps it honest across rulesets. Because a Report is only a grouping,
nothing tempts it to merge Snapshots into combined tables — which would be unsound, since each
Snapshot pins its own Ruleset Version and a merged table would have to grade rows against two
different threshold sets while double-counting re-pushes. A view that owns no numbers cannot compute a
wrong one.
