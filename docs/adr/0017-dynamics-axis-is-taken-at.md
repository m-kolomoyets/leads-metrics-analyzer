# The Dynamics axis is `taken_at`; the day a Dynamics page shows is `report_date`

The Dynamics page plots a buyer's trajectory through a day. Two questions have to be answered before
any of it is written: what orders the points, and what decides which points belong to the page.

- **The X axis is `taken_at`** — when the Snapshot was pushed. That is what makes two pushes an hour
  apart two distinct points, and it is why a file describing yesterday cannot jump the queue by
  carrying an older date inside it. The dates inside an upload are stored and never sorted by.
- **The day is `report_date`** — the day the data describes, picked by the buyer at push. A Dynamics
  page for KR on the 12th is the buyer's active Snapshots whose `report_date` is the 12th, ordered by
  `taken_at`.
- **No `business_date` column is added.** The `brief/` SPEC (I3/I4) asks for one, derived from the
  upload time in Europe/Kyiv. This repo already carries both halves of that idea and splits them on
  purpose ([0016](0016-report-is-a-derived-view.md), CONTEXT.md "A Snapshot's two dates"). A derived
  `business_date` would be a third date that agrees with `report_date` in the common case and
  silently disagrees in exactly the case that matters.
- **Europe/Kyiv still enters the page**, but only for viewer-local judgements: "is it past 10:00
  today", "is the latest push older than three hours", "which day does *today* mean". It never
  decides which day a Snapshot belongs to.

## Why

The re-push settles it. A buyer who finds Monday's analysis wrong and pushes a corrected one on
Wednesday has produced data about Monday. `report_date` puts it on Monday, where the Report feed
already puts it ([0016](0016-report-is-a-derived-view.md)); a `business_date` derived from upload
time puts it on Wednesday, inventing a Wednesday the buyer never worked and leaving Monday's page
showing the numbers everyone already agreed were wrong. Two views of the same Snapshots would then
disagree about what day it is — the Report says Monday, Dynamics says Wednesday — and no amount of
care in either view reconciles them.

Nothing is lost by dropping the derived column, because the two decisions are independent. SPEC I3's
real content is "order by when it entered the system, not by what the file claims", and `taken_at`
delivers that whole. SPEC I4's real content is "a day boundary the tracker agrees with", and the
buyer picking `report_date` at push delivers that more directly than a timezone conversion does — the
buyer knows which day they analyzed; the clock only knows when they clicked save.

**SPEC test T21 is superseded.** It asks that a Snapshot uploaded 23:50 Kyiv and read at 00:10 Kyiv
belong to the previous business date. Here, it belongs to whatever `report_date` its author picked —
which for a buyer closing out their day at 23:50 is that same day, giving T21's expected answer
without a derived column, and which for a buyer pushing a correction at 23:50 gives the *right*
answer where T21 would give the wrong one. The acceptance set in this repo replaces T21 with a
re-push case instead.

## Consequences

- The Dynamics day read is `WHERE report_date = $day AND status = 'active' ORDER BY taken_at` —
  `snapshot.report_date` and `snapshot.taken_at` already exist; the `status` filter arrives with
  [0018](0018-replaceable-snapshots.md).
- `report_date` is buyer-entered, so a buyer can mistype it and land a Snapshot on the wrong day.
  Accepted: that is a visible, correctable mistake on a field the buyer chose, not a silent
  reclassification by a clock.
- "Today" on the Dynamics page means today in Europe/Kyiv, hardcoded, never read from the browser —
  the one place the zone survives.
- Two pushes in the same minute would tie on the axis. Ordering breaks the tie on `id`; no merging.
