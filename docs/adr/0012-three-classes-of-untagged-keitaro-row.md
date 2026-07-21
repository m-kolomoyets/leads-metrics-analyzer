# Three classes of Keitaro row share an empty Sub ID 2, and each is treated differently

A Keitaro row with no `Sub ID 2` cannot join to a Facebook campaign ([0001](0001-single-fact-table-join-on-campaign-id.md)).
Three completely different things produce that emptiness, and collapsing them loses either real money
or real accuracy. They are classified at parse time by which columns survive:

| Class | Detector | Treatment |
| --- | --- | --- |
| **Totals Row** | *every* dimension empty, counts populated | Discarded. It restates the whole report; counting it doubles every number. |
| **Invalid Row** | empty `OS` | Discarded everywhere (doc 01). |
| **Unfired-Macro Row** | `Sub ID 2` holds a template (`{{campaign.id}}`) | Counts in Geo, Account, Creative, Offer and OS. Excluded from Campaign only. |
| **Untagged Row** | Sub IDs empty, `Country`/`Offer`/`OS` present | Geo Total only — and only when its OS is mobile. |

Order matters: the Totals guard must run first. Previously the detector was "`Sub ID 2` is empty →
Totals Row", which silently deleted every Untagged Row; loosening it without the all-dimensions-empty
guard instead admits the totals row and doubles the report.

## Unfired-Macro rows are nearly whole, and are treated that way

Facebook fails macros **per column**, not per row. A row can lose `Sub ID 2` while keeping
`Sub ID 4` (Account) and `Sub ID 5` (Creative) — in the golden set, every unfired row does:

```
India;{{campaign.id}};1641083631350576;🇮🇳_IN_92_[FortuneGems];12750;"IN | LuckyStar | …";Android;7;2;1;0;0
```

Account, Creative, Offer, OS and Geo are all real and directly attributed — nothing is estimated.
Dropping such a row from the Creative table to punish it for one missing column throws away good
data. So it becomes a Fact under a synthetic campaign id keyed on (Geo, Account, Creative), flagged
`attribution: 'campaign-lost'`, and flows into every roll-up except the Account block's campaign
rows.

**Spend stays 0 and is never allocated to it.** The money that bought this traffic was already paid
under some campaign we cannot name, and it is already counted in that campaign's Spend. Assigning a
share here would count the same dollars twice. The row widens the denominator; it never adds to the
numerator.

A macro that failed on *every* Sub ID (`{sub_id_4}`, `{sub_id_5}`) has no identity left and is
routed to Untagged instead. A template is absence — never an identity to key a map on.

## Untagged rows are gated on mobile OS

These campaigns buy mobile app installs. A `Windows` or `OS X` install provably did not come from the
Spend under analysis, so counting it inflates the Geo's Installs against money that never bought it.
Measured on the golden set: admitting desktop untagged rows moved KR from 69 installs to 88 and
dropped CPI from 15.33 to 12.03 — away from the verified sheet, not toward it. The OS tables already
applied this gate ([`allocate.ts`](../../src/lib/domain/allocate.ts)); the Geo Total now shares it.

The clicks report carries no `OS` column, so untagged **clicks** cannot be gated the same way. This
asymmetry is known and accepted — clicks feed CPC only, and the golden CPC is unaffected.

## Consequences

- `Attributed` now *includes* unfired-macro rows, so it no longer means "joined to Facebook". It
  means "placed on a real Account and Creative". Only Untagged sits outside it. The Geo-Total
  divergence of [0003](0003-geo-total-diverges-from-attributed.md) still holds, but it is now
  narrower and made entirely of Untagged.
- Problem-Account detection and the Account block see `full` facts only. Campaign-lost facts carry
  Revenue against zero Spend, so including them would make a wasteful account look thriftier than it
  is and could silently clear a genuine flag.
- `creativesFor` treats a zero-Spend campaign with exactly **one** creative as a 100% share (the
  unfired case, where nothing is being estimated). Several creatives with no Spend between them stay
  unsplittable and are skipped rather than split evenly.
- Uniques still do not sum ([0003](0003-geo-total-diverges-from-attributed.md)). Untagged installs
  may be the same humans as attributed ones and cannot be deduplicated. Money asserts exactly;
  CPI/CPR/CPS/EPC at Geo grain assert with tolerance.
