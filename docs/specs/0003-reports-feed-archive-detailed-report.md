# Reports: feed, archive and detailed report

## Problem Statement

A buyer can now push a Snapshot, but nobody can read it. A Head has no way to answer "who reported
today, and how did they do?" without asking each buyer in chat. A Team Lead cannot see their team's
day at a glance. A buyer cannot look back at what they reported on Monday. The Snapshots are in the
database and invisible.

Worse, a saved Snapshot cannot actually rebuild the report it came from. It stores Facts at Campaign
grain and nothing else, so the Offers, OS and Creative tables — three of the four tables in the
report — have no inputs to recompute from, and the Geo Total cannot be reconstructed at all because
Untagged Revenue never becomes a Fact. The promise that "a report can be rebuilt from a Snapshot
alone" is currently false.

## Solution

A **Report**: an overseer's view of the Snapshots pushed by the people they can see, assembled by
asking for a date range. Nobody creates a Report — a buyer pushes a Snapshot, and a Report is what an
overseer's filter makes of them.

Three surfaces:

1. **Feed** (`/dashboard`) — an accordion of people. Every visible user always appears, headed by
   their nickname and the time they last reported. Inside, each Snapshot is a card carrying its
   dates, its headline money and a link to the detailed report, above one row per Geo showing exactly
   what the buyer saw: the cost-per line, Spend⁺ / Geo Total / Profit / ROI, and the waste readout
   with its zone band.
2. **Archive** (`/dashboard/archive`) — the same Snapshots grouped the other way round: by the day of
   data first, then by person. Every version, including re-pushes.
3. **Detailed report** (`/dashboard/report/<snapshotId>`) — the Analyze screen rebuilt from one saved
   Snapshot: Geo tabs, `GeoStat`, Problem Accounts, Offers, OS, Creatives and the account totals
   table. No per-account collapsibles — that is the buyer's reconciliation surface, not an overseer's.

To make that possible the Snapshot is completed: it gains the sub-grain inputs its tables allocate
over (Creative Splits, Campaign Models), a Frozen Geo Rollup for the one figure that can never be
derived, and a copy of the thresholds it pinned so that deleting a Preset can no longer un-grade
history.

## User Stories

### Reading the feed

1. As a Head, I want to open the app and see every user's latest report, so that I know the state of
   the business without asking anyone.
2. As a Team Lead, I want to see only my team's users in the feed, so that my screen is about my
   people.
3. As a Buyer, I want to see my own past pushes in the feed, so that I can check what I reported.
4. As a Head, I want users who have **not** reported in the selected range to still appear, dimmed,
   so that "nobody reported today" is visible rather than an empty page.
5. As an overseer, I want each user's header to show the time and date they last reported — ever, not
   just within the range — so that I can tell a quiet day from an absent buyer.
6. As an overseer, I want users identified by nickname rather than email, so that the feed reads the
   way the team actually talks.
7. As an overseer, I want each Snapshot shown as its own card with its report date and push time, so
   that I can tell a fresh report from a correction pushed late.
8. As an overseer, I want the Snapshot card to show Spend⁺, Geo Total, Profit, ROI and Waste across
   its Geos, so that I can judge a whole report before opening anything.
9. As an overseer, I want the Snapshot card tinted by its ROI band, so that a bad day is visible from
   across the room.
10. As an overseer, I want one row per Geo under each Snapshot showing the same figures the buyer saw
    — cost-per line, Spend⁺, Geo Total, Profit, ROI, Waste and its percentage of Spend⁺ — so that we
    are looking at the same numbers.
11. As an overseer, I want each Geo row's waste readout tinted by the Waste Zone band that was in
    force when it was pushed, so that the grade is the buyer's, not mine.
12. As an overseer, I want a link from each Geo row straight into the detailed report at that Geo, so
    that I go from "this looks wrong" to the tables in one click.
13. As an overseer, I want a link on the Snapshot card into its detailed report, so that I can open a
    whole report without picking a Geo first.
14. As an overseer, I want the feed to show only the latest Snapshot per person per report date, so
    that a corrected re-push replaces rather than duplicates.

### Filtering by date

15. As an overseer, I want to filter by a date range, so that I can look at a period rather than a
    day.
16. As an overseer, I want quick tokens — last day, last 3 days, last week, last month — so that the
    common ranges take one click.
17. As an overseer, I want a custom from/to range, so that I can look at an arbitrary window.
18. As an overseer, I want the feed to default to the last day, so that opening the app answers
    "today" without configuration.
19. As an overseer, I want filtering to run on the day the data describes, not the day it was pushed,
    so that a correction pushed late lands on the day it is about.
20. As an overseer, I want the range to live in the URL, so that I can share or bookmark a view.
21. As an overseer, I want to carry the current range with me when I move between feed and archive,
    so that I don't re-pick it.

### Archive

22. As an overseer, I want an archive grouped by report date, so that I can answer "what happened on
    12 June?".
23. As an overseer, I want each date in the archive to list the people who reported for that date, so
    that I can see coverage per day.
24. As an overseer, I want the archive to show **every** Snapshot, including re-pushes for the same
    date, so that it is a true audit trail.
25. As an overseer, I want to open any archived Snapshot's detailed report, so that history is as
    readable as today.
26. As an overseer, I want the archive's range picker to be the primary control, so that the page is
    built for looking things up.

### Detailed report

27. As an overseer, I want the detailed report to show exactly one Snapshot, so that I am never
    reading two rulesets' judgements blended together.
28. As an overseer, I want Geo tabs when a Snapshot covers several Geos, so that I can move between
    markets the same way the buyer did.
29. As an overseer, I want the Geo header, Offers, OS, Creative and account totals tables to be the
    ones I know from Analyze, so that there is one report format in the company.
30. As an overseer, I want the Problem Accounts block, so that the waste headline can be decomposed
    into the accounts that caused it.
31. As an overseer, I want the per-account campaign collapsibles omitted, so that the page is about
    judgement rather than reconciliation.
32. As an overseer, I want the numbers graded by the Ruleset Version the buyer pinned, so that I read
    their judgement rather than re-judging with my own thresholds.
33. As an overseer, I want to be told how many campaigns the buyer muted, so that I know the figures
    were filtered before I compare them to anything.
34. As an overseer, I want the analyst's Reviewed marks to be absent from my view, so that I am not
    shown someone's private progress notes as if they were data.
35. As an overseer, I want a Snapshot pushed before this feature to still open, with the figures it
    genuinely cannot reproduce shown as `—`, so that old history is readable and never fabricated.

### Visibility

36. As the system, I want every Report read to run through the single access-policy seam, so that no
    hand-rolled role check can leak another team's numbers.
37. As a Buyer, I want to see only my own Snapshots in the feed and archive, so that visibility
    matches my role.
38. As a Team Lead, I want to see every Snapshot created by any member of my team, so that I can
    oversee my team.
39. As a Team Lead, I want a former member's Snapshots to stay attributed to my team, so that my
    history does not change when someone transfers.
40. As a Designer or BDM, I want the Report surfaces to be unavailable to me, so that my access stays
    limited to my dimension.
41. As a Head, I want disabled users excluded from the roster, so that offboarded people do not sit
    permanently dimmed in the feed.
42. As an overseer, I want a Snapshot I may not see to read as not-found rather than forbidden, so
    that another team's activity is not disclosed by its absence.

### Snapshot completeness

43. As a Buyer, I want my pushed Snapshot to carry everything needed to rebuild my report, so that
    what an overseer reads is what I saw.
44. As a Buyer, I want the Geo Total preserved in my Snapshot, so that untagged revenue does not
    silently vanish from the report and make my market look worse.
45. As a Buyer, I want the Creative table to survive into the Snapshot with real impressions, so that
    CTR and CPM are readable later.
46. As a Buyer, I want the Offers and OS tables to rebuild from my Snapshot, so that the whole report
    survives, not part of it.
47. As a Buyer, I want deleting or renaming a Preset to have no effect on Snapshots I already pushed,
    so that history is genuinely immutable.
48. As the system, I want the Problem Account detector to see the same attribution it saw at analysis
    time, so that a Campaign-lost row cannot silently clear a real flag.
49. As a Head, I want every existing user to have a nickname after this ships, so that no row in the
    feed is nameless.

## Implementation Decisions

### The Report is derived, not stored

There is no `report` table and no "submit report" action. A Report is what a query produces when an
overseer names a date range: Snapshots visible to them, grouped. Two overseers asking different
ranges read different Reports over the same Snapshots. See ADR-0016.

### Routes

- `/dashboard` — the feed. Replaces the current stub.
- `/dashboard/archive` — the archive.
- `/dashboard/report/$snapshotId` — the detailed report, with an optional `geo` search param naming
  the initial tab.

Feed and archive share one server function and one search-param shape:
`range=1d|3d|7d|30d|custom` plus `from` / `to` when custom. Tokens mean **the last N calendar days
ending today, inclusive**, resolved against the viewer's local calendar day, and filter on a
Snapshot's `reportDate`. Feed defaults to `1d`; archive requires an explicit range and defaults to
`7d`. Validated with Zod `validateSearch` + `.catch()` per repo convention.

The two pages differ in exactly three ways and are therefore separate routes rather than a `groupBy`
toggle: grouping axis (user-first vs date-first), latest-only vs all-versions, and default range.

### Grouping rules

- **Feed**: user → Snapshot → Geo. Only the latest Snapshot per (user × `reportDate`) survives, by
  `takenAt`.
- **Archive**: `reportDate` → user → Snapshot. Every version.
- **Roster**: every user inside the viewer's row scope who could push a Snapshot — status `active`,
  and a role whose dimension scope includes the campaign dimension (head, team_lead, buyer). Users
  with no Snapshot in range render collapsed and dimmed, showing their last-ever `takenAt`, or
  "never" when they have none.
- A Snapshot card's headline sums money across its Geos (Spend⁺, Geo Total, Profit, Waste) and
  re-derives ROI and waste-percentage from those sums. It deliberately carries **no** cost-per line:
  each Geo has its own Threshold Pairs, so a blended CPI has nothing to grade it against, and unique
  counts do not sum across Geos.

### Visibility

All reads go through `scopeFor(viewer)` (ADR-0007) — row scope `all` / `team` / `own`, and the
dimension scope decides eligibility. Designer and BDM are excluded because their dimension scope has
no campaign dimension, not by a role list. A new `listVisibleUsersFn` returns the roster under the
same scope; the existing user-listing API is Head-only and stays that way.

### The Snapshot becomes self-sufficient

Recorded in ADR-0015. Today a Snapshot stores only Facts at Campaign grain, which is not enough to
rebuild the report: Creative, Offer and OS tables are **allocations** over inputs that live below the
Fact Grain, and the Geo Total counts Untagged Revenue that never becomes a Fact at all.

Schema additions:

| Addition | Grain | Why |
| --- | --- | --- |
| `snapshot_geo` — Frozen Geo Rollup, nullable | Snapshot × Geo | Geo Total counts Untagged Revenue, underivable from Facts. Also caches the header figures so the feed reads without touching Facts. |
| `snapshot_fact.attribution` | existing | The Problem Account detector skips non-`full` Facts on purpose (ADR-0012); inferring this from the `—` display placeholder is a silent-breakage coupling. |
| `snapshot_creative` — Creative Split | Snapshot × Geo × Campaign × ad name | Real Spend + Impressions per creative: the basis of the Creative table's CTR, CPM and Spend-share allocation. |
| `snapshot_campaign_model` — Campaign Model | Snapshot × Campaign × (offer \| os) | The Offer/OS funnel breakdown the Offers and OS tables allocate over. |
| resolved thresholds copied into `applied_ruleset_geo` and `applied_ruleset` | existing | `preset_version` cascades on preset delete and the reference is `set null`, so deleting a Preset currently destroys the grading of every past Snapshot. The version id stays as provenance. |
| `user.nickname` | existing | The feed identifies people by handle. Required; backfilled once from the email local-part. |

`snapshot_geo` is **nullable by design**: Snapshots pushed before this ships have no rollup and never
can. Their Geo Total, Profit and ROI render `—`; their Waste renders `—`; everything else recomputes.
Nothing is backfilled with an Attributed sum, because the domain is explicit that a Geo Total is
deliberately greater than the sum of its Campaigns.

Everything else stays derived. Offers, OS, Creative, account totals and Problem Accounts are
recomputed on read through the same code path Analyze uses — one compute layer, not a second frozen
copy that can drift from it.

### Compute seam

A new `analyzeSnapshot(bundle, ruleset) → AnalyzeResult` sits beside `analyzeParsed` in the domain
layer. It takes a stored Snapshot bundle — Facts, Creative Splits, Campaign Models, Frozen Geo
Rollup — plus the ruleset resolved from the Snapshot's own copied thresholds, and returns the same
`AnalyzeResult` the Analyze screen already renders. The roll-up half of `analyzeParsed` (per-Geo
rollups, allocation, Problem Accounts) is extracted so both entry points share it verbatim; only the
join half differs.

Consequence: the detailed report reuses `GeoStat`, `ProblemAccounts`, `OffersTable`, `OsTable`,
`CreativeTable` and `AccountSummary` unchanged. The Analyze components move to a shared location; the
detailed report omits `AccountBlock` and passes a read-only flag so no Reviewed control renders.

### Report assembly seam

`buildReport({ users, snapshots, range, today, mode }) → ReportView` is a pure function in the
Dashboard module. It resolves the range token to concrete dates, filters on `reportDate`, applies the
latest-per-(user × date) rule in feed mode, groups by the mode's axis, and emits every roster user
including those with nothing. No dates are computed inside it beyond what `today` supplies.

### Server functions

- `listReportFn({ from, to })` — Snapshots in range under the viewer's scope, each with its Frozen Geo
  Rollups and the metadata the cards need. Does not return Facts.
- `listVisibleUsersFn()` — the roster under the viewer's scope, with nickname and last-ever `takenAt`.
- `getSnapshotBundleFn({ id })` — one Snapshot's Facts, Creative Splits, Campaign Models, Frozen Geo
  Rollups and resolved thresholds, for the detailed report. Not-found for an out-of-scope id.

`createSnapshotFn` and the save planner extend to write the new tables in the same transaction.

### What the buyer's muting means to an overseer

Excluded campaigns are already absent from the Facts; only their identifiers survive in the
Snapshot's meta. The detailed report surfaces a count — "N campaigns muted by the buyer" — so an
overseer knows the figures were filtered. Reviewed marks are analyst-private and never leave the
Analyze screen.

## Testing Decisions

A good test here asserts what a reader of the report would notice, and nothing about how the code got
there. It goes through one of the two seams, uses plain objects or CSV fixtures as input, and would
survive a rewrite of the rendering.

### `analyzeSnapshot` — the round-trip property

The load-bearing test, and the one that proves the spec's central claim. Run
`analyze(csvFixtures, ruleset)`, plan a Snapshot from the result, feed the planned bundle into
`analyzeSnapshot`, and assert the rebuilt `AnalyzeResult` deep-equals the original for every Geo
rollup, Offers row, OS row, Creative row, account total and Problem Account. Cover:

- a Geo with Untagged Revenue, so Geo Total is proven to survive via the Frozen Geo Rollup;
- an Unfired Macro (Campaign-lost) Fact, so attribution is proven to survive and the Problem Account
  detector still skips it;
- a campaign with several creatives, so the Spend-share allocation and real impressions reproduce;
- a campaign with several offers and several OS values, so both allocations reproduce;
- a bundle with no Frozen Geo Rollup, asserting Geo Total / Profit / ROI / Waste come back null
  rather than as Attributed sums.

Prior art: `src/lib/domain/analyze.test.ts`, `src/modules/Analyze/utils/toSnapshot.test.ts`.

### `buildReport` — the grouping rules

Plain-object tests, no DB, no dates from the clock (`today` is an argument). Cover: token resolution
for each of `1d` / `3d` / `7d` / `30d` and a custom range; filtering on `reportDate` and never on
`takenAt`; latest-per-(user × date) in feed mode and all-versions in archive mode; a user with no
Snapshot in range appearing dimmed with their last-ever `takenAt`; a user who has never reported;
feed grouping order (user → snapshot → geo) versus archive (date → user → snapshot); the card
headline summing money across Geos and re-deriving ROI from the sums.

Prior art: `src/modules/Analyze/utils/importPresets.test.ts`.

### Schema validators

The new bundle shapes get Zod validators tested the way `src/services/snapshots/schemas.test.ts` and
`src/services/presets/schemas.test.ts` already test theirs, including the older-shape case: a
Snapshot written before this spec must still parse, with the rollup absent rather than rejected.

### Not tested

Component rendering, route wiring, and the server functions' SQL. Access control is already covered
at the `scopeFor` seam and is not re-tested per surface.

## Out of Scope

- Any merged or cross-Snapshot view. Each Snapshot pins its own Ruleset Version, so blending them
  would grade one table against two threshold sets and double-count re-pushes.
- Dimension-scoped Report surfaces for Designer and BDM. A creative leaderboard or offer leaderboard
  is a different product; they keep their existing company-wide dimension roll-up.
- Editing, annotating, commenting on or approving a Snapshot. Reports are read-only.
- Notifications, digests or exports (email, Telegram, CSV, PDF).
- Charts and trends over time. The Report shows Snapshots, not series.
- Pagination and row caps for very wide ranges. Deferred until a real range hurts.
- A duplicate-push warning in Analyze when a Snapshot already exists for that report date.
- Any change to how Analyze itself computes, grades or allocates.
- Per-account campaign collapsibles in the detailed report.

## Further Notes

- The name "admin report" is retired. The screen is a **Report** and a Buyer sees the same one scoped
  to themselves; nothing about it is administrative.
- Defaulting the feed to `1d` means mornings read empty until buyers push. Accepted deliberately —
  story 4 (dimmed non-reporters) is what makes that state informative rather than blank.
- CONTEXT.md's Fact Grain was corrected as part of this work: Facts are at `Campaign × Date`, and a
  Fact's creative, offer and OS are representative labels, not key parts. The Creative, Offer and OS
  tables are allocations, which is precisely why this spec has to persist their inputs.
- The Waste figure on a Geo row is mixed-grain by ADR-0014 — a Problem Account contributes Account
  Waste, everyone else their red Campaigns' summed Waste — so it will not reconcile against the
  account totals table. That is the reason the Problem Accounts block stays in the detailed report.
