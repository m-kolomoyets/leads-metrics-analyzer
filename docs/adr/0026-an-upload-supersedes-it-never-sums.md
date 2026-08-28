# An upload supersedes; it never sums

A buyer uploads several times a day. Every export they pull is **cumulative** — Facebook and Keitaro
both restate the day so far, not the slice since the last pull. The Analyze screen accepts any number
of files and, until now, concatenated their rows: two pulls of one campaign became two rows and the
join added them together. A 12:00 export left in the dropzone next to the 18:00 one read as roughly
double the day, and every surface downstream — the member cards, the Offers/OS/Creatives tables, the
detailed report, the Report feed — faithfully showed the doubled Snapshot.

**Merging is superseding, at row grain.**

- Rows are identified by the columns the join keys on, and nothing else:
    - Facebook — `Reporting starts` × `Reporting ends` × Geo × Account × Campaign × Creative
    - Keitaro main — Geo × Account × Campaign × Creative × Offer × OS
    - Keitaro clicks — Geo × Account × Campaign × Creative × OS
- The **last file** carrying a key wins. Earlier copies of that key are dropped, never added.
- A key only one file carries still stacks. Splitting one day across several exports — per account,
  per geo — keeps working, and so does a month of Facebook exports: the reporting window is in the
  Facebook key, so another day is another line.
- Duplicate keys **inside one file** are kept and summed. An export may legitimately repeat a grain;
  collapsing those would understate the file itself.
- Files are merged **oldest export first**, by the file's own timestamp — not by the order they were
  dropped. Dropping the 12:00 export after the 18:00 one must not resurrect the older figures.
- Rows dropped as restated are counted and said out loud (`superseded-rows`), so the row counts in the
  file list and the figures in the tables can be reconciled by a reader who notices they disagree.

## Why

Facebook has no date on a Keitaro row to disambiguate with, and Keitaro's export carries no timestamp
at all — so two Keitaro rows of the same grain cannot be two different measurements. They can only be
one line pulled twice. Summing them is not a conservative reading of ambiguous data; it is the one
reading that is certainly wrong.

The alternative — keep only the newest file per type — was rejected because it breaks the legitimate
case that made stacking the default: a buyer exporting one day per account, or per geo, and dropping
five files that each hold a different slice. Row grain separates the two cases without asking the
buyer to declare which they are doing.

This is the same rule the read surfaces already follow one level up: a Snapshot restates the day so
far, so a Dynamics page reads the **latest push** and never sums pushes
([0017](0017-dynamics-axis-is-taken-at.md)). Ingest was the one layer where "cumulative" had not been
taken at its word.

## Consequences

- `mergeParsed` is no longer a concatenation and its argument order is now meaningful: oldest first.
  `parseFiles` inherits the same rule for a batch parsed in one call.
- Snapshots already written from stacked uploads keep their inflated figures. Frozen is frozen
  ([0015](0015-snapshots-are-self-sufficient.md)) — correcting them means re-pushing the day, not
  rewriting the row.
- A re-upload now visibly *reduces* the row count feeding the tables while the file list still counts
  every file's rows. That gap is the warning's whole job; without it the drop would be as silent as
  the double-count was.
- The Analyze draft persists uploads for a week. Superseding fixes the arithmetic for repeated pulls
  of the same lines; it does not decide that a week-old file is stale, and it is not meant to — that
  stays the buyer's call, on the file list in front of them.
