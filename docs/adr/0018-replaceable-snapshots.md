# A Snapshot may be replaced within 60 minutes; replaced Snapshots are invisible

Snapshots are append-only and immutable ([0015](0015-snapshots-are-self-sufficient.md)): a stored
analysis says what it said forever. Dynamics needs a correction path anyway — a buyer who uploads a
broken export sees it land on the chart immediately, and the trajectory is unreadable until the bad
point is gone. We add **replacement**, not editing.

A buyer pushes a corrected Snapshot; the old one is **superseded**, not changed:

```
canReplace(snapshot, user):
    (user.id == snapshot.created_by_user_id OR user.role == 'head')
    AND snapshot.status == 'active'
    AND now() - snapshot.taken_at <= 60 minutes
    AND no newer active Snapshot exists for the same buyer and report_date
```

Replacement writes three lifecycle columns on the old row — `status = 'replaced'`,
`replaced_by = <new id>`, `replaced_at = now()` — and touches nothing else. Facts, Creative Splits,
Campaign Models, the Frozen Geo Rollup and the copied thresholds are exactly as they were, so the
replaced Snapshot still rebuilds its own report for audit.

**Every read filters `status = 'active'`.** Series, deltas, tables, tab totals, the Report feed and
its archive: a replaced Snapshot contributes to no number anywhere. Deltas need no recomputation
because they were never stored — they are derived on read ([0016](0016-report-is-a-derived-view.md)).

**The replaced point keeps a badge on the chart.** The point itself is gone from the series, but the
trajectory carries a small marker where it was, hovering to "replaced at 15:30", so a buyer who read
the old number an hour ago can see what happened to it instead of arguing that the page changed
behind them. Only the replaced point is marked — the badge does not cascade onto later points.

**A "review and submit" step before upload was rejected** (SPEC §5.3). Uploads enter the dataset
immediately.

## Why

Immutability was never about the row being physically untouched; it was about a past judgement being
reproducible ([0002](0002-immutable-ruleset-versions.md), [0015](0015-snapshots-are-self-sufficient.md)).
Flipping a status keeps that promise whole — every figure the Snapshot ever showed is still there,
still pinned to the thresholds that graded it. Deleting the row, or overwriting its facts in place,
would break it: the audit trail is the whole reason the archive exists, and "the numbers I saw at
15:00" must stay answerable after the correction.

The 60-minute window is a compromise between the two failure modes. Unbounded replacement makes every
historical point provisional — nobody can quote a number from last Tuesday without checking whether
it still exists. No window at all leaves obviously broken data on the chart forever, which is worse,
because the fix people reach for then is a manual DB edit. An hour is long enough to notice a bad
export and short enough that anything older is a fact of record. The "no newer active Snapshot"
clause exists for the same reason: once a buyer has pushed again, the trajectory has a shape that
others have read, and rewriting its middle is not a correction.

The confirmation step was rejected on the SPEC's own evidence: roughly a tenth of reports would sit
unsubmitted, leaving permanent holes in exactly the series this page exists to draw. A missing point
is a worse defect than a wrong one, because a wrong one is visible and replaceable within the hour
while a missing one looks like a buyer who did no work.

## Consequences

- `snapshot` gains `status`, `replaced_by` (self-reference) and `replaced_at`. Existing rows are
  `active`; the column is not nullable and has no other states.
- Every existing Snapshot read gains `status = 'active'`. The filter belongs in the service layer, at
  one seam, not sprinkled per query — a read that forgets it double-counts a corrected day.
- A Head can replace any Snapshot, past the window included, and can read replaced ones for audit.
  That is the existing Head-only edge guard on top of `scopeFor`
  ([0007](0007-single-access-policy-seam.md)), not a rule the Dynamics page enforces itself.
- A replacement past the window is a `403`, never a silent no-op.
