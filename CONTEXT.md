# Campaign Analyzer

Joins Facebook Ads spend data with Keitaro tracker conversion data to judge whether each
advertising campaign should be scaled, held, or stopped — per country, per creative, per offer.

Facebook knows what was **spent** and nothing about what it earned. Keitaro knows what was
**earned** and nothing about what it cost. Neither side alone can answer "is this campaign
making money?". This context exists to join them and answer that question.

## Language

### Funnel

The stages a user passes through, in order. Each stage is a strict subset of the one before it.

**Link Click**:
A user who clicked a Facebook ad's link, counted once per user. The honest measure of how many
people the ad reached — the raw `Clicks` column (repeat presses) is *not* used anywhere.
Source: Keitaro **clicks report**, `UC (campaign)` column.
_Avoid_: Click, unique click, UC, hit, visit

**Install** (sheet: *Uniq*):
A user who, after a Link Click, completed installation of the target app on an external service.
Confirmed by postback, not observed directly — the gap between Link Clicks and Installs is real
drop-off, not a reporting error.
Source: Keitaro **main report**, `UC (campaign)` column.
_Avoid_: Uniq, unique, UC, download, conversion

**Registration** (sheet: *Conversion*):
An Install who created an account in the target app.
Source: Keitaro main report, `Conv.` column.
_Avoid_: Reg, conversion, signup, lead

**Sale** (sheet: *Deposit*):
A Registration who deposited money. The event that earns Revenue.
Source: Keitaro main report, `Sales` column.
_Avoid_: Deposit, purchase, conversion, FTD

**Revenue**:
Money earned from Sales, gross, before Commission.
Source: Keitaro main report, `Revenue` column.
_Avoid_: Income, payout, earnings

**Spend**:
Money paid to Facebook to buy traffic, before Commission.
Source: Facebook `Amount spent (USD)` column.
_Avoid_: Cost, budget, ad spend

> **Note on `UC (campaign)`**: the same column name means **Link Click** in the clicks report and
> **Install** in the main report. Different metrics, differently-scoped reports. Never treat the
> column name as the meaning — the *report* determines it.

> **Uniques do not sum.** Link Clicks and Installs are *unique-per-user* counts. A user touching
> two Campaigns is two rows at Campaign grain but one person at Geo grain. Summing Campaign rows
> therefore *overstates* a Geo's unique totals (observed: KR installs 88 summed vs 69 true). The
> app ingests Campaign-grained data and can only sum — so Geo unique counts read high, and a Geo
> total can never be perfectly reconciled against Keitaro's own country-grouped view.

### Dimensions

The four axes every fact is measured along. Together they form the Fact Grain.

**Geo**:
The country a Campaign targets, identified by ISO-2 code. An attribute *of* a Campaign, not a
dimension sliced across it — one Campaign runs one Geo. Facebook emits the code (`KR`) and is
authoritative; Keitaro emits an English name (`South Korea`) that plays no part in joining.
_Avoid_: Country, region, market, GEO

**Account**:
A Facebook ad account that pays for Spend. Carried by Keitaro as `Sub ID 4`.
Source: Facebook `Account ID` = Keitaro `Sub ID 4`.
_Avoid_: Ad account, profile, cabinet

**Campaign**:
A Facebook campaign — the unit a media buyer starts, stops, and scales. The primary subject of
every verdict. Carried by Keitaro as `Sub ID 2`.
Source: Facebook `Campaign ID` = Keitaro `Sub ID 2`.
_Avoid_: Ad set, ad, adset

**Creative**:
The advertisement shown to a user. One Creative may run across many Campaigns, and one Campaign
may run many Creatives.
Source: Facebook `Ad name` = Keitaro `Sub ID 5`.
_Avoid_: Ad, ad name, banner, media

### Attribution

**Fact Grain**:
`Campaign × Date` — the finest level at which both Facebook and Keitaro can speak. Geo and Account
are attributes of the Campaign, not part of the key, because a Campaign runs one Geo from one
Account. Creative, Offer and OS sit *below* the grain: a Fact carries one of each as a
**representative label** (its top-spending creative, its top-spending offer, its OS when a campaign
has exactly one), never as part of the key. Campaign and Geo tables are roll-ups of Facts and sum
exactly; Creative, Offer and OS tables are **allocations** and reconcile to their campaign only
because each campaign's shares total one.

**Creative Split**:
A Campaign's real per-creative Spend and Impressions, as Facebook reports them — the only
per-creative truth there is, and the basis every Creative row's funnel is allocated over. Sits below
the Fact Grain, so it is kept beside the Facts rather than inside them.
_Avoid_: Ad breakdown, creative fact

**Campaign Model**:
A Campaign's Offer and OS funnel breakdown, as Keitaro reports it — the basis the Offers and OS
tables allocate over. Like the Creative Split, it sits below the Fact Grain and is kept beside the
Facts.
_Avoid_: Offer fact, OS fact, breakdown

**Geo Total**:
All Spend and Revenue recorded for a Geo, including Revenue that carries no Sub IDs because
Facebook's macros failed to tag the referral. Answers "is this market making money?". Deliberately
**greater than** the sum of its Campaigns — untagged Revenue is real money earned by these
campaigns that simply cannot be traced to one of them.

**Attributed**:
The subset of Facts placed on a real Account and Creative. Answers "which campaign do I stop?".
Every Campaign, Account, Creative, Offer and OS figure is Attributed. Only the Geo Total is not.
It is *not* the same as "joined to Facebook": an Unfired Macro is attributed too, since it names its
Account and Creative outright. Only Untagged rows fall outside (ADR-0012).

**Fact Attribution**:
How completely one Fact is placed. **Full** joined Facebook↔Keitaro on Campaign ID. **Campaign-lost**
is an Unfired Macro: real Account, Creative, Offer, OS and Geo, but no Campaign and no Spend, so it
counts in every roll-up except the Account block's campaign rows, and is never graded or stopped
(ADR-0012). Untagged rows are neither — they never become a Fact at all.
_Avoid_: Partial attribution, orphan fact, half-joined

**Join Key**:
`Campaign ID` (Facebook) = `Sub ID 2` (Keitaro), alone. Country is deliberately excluded — a
Campaign has exactly one Geo, so country could only ever cause a match to fail, never to succeed.
Facebook is authoritative for Geo and Account; Keitaro's `Country` and `Sub ID 4` are ignored.

**Offer**:
The product a Sale monetized (e.g. `KR | Winum | RegForm (Slot) | CPA | 180 USD ...`). Known to
Keitaro only — Facebook cannot see it, so an Offer's Spend is never measured, only Allocated.
_Avoid_: Product, vertical, brand

**OS**:
The operating system of the user's device. Known to Keitaro only, so like Offer its Spend is
Allocated, never measured. Every value present in the data is a valid OS — there is no
"Other" bucket.
_Avoid_: Platform, device

**Allocated Spend**:
Spend imputed to an Offer or OS, because those dimensions sit below the Fact Grain and have no
measured Spend of their own. Priced at the **Geo Unit Cost** — that row's Installs × the Geo's own
Spend⁺ ÷ Installs (ADR-0013). Always an estimate; must be labelled as such wherever it is shown.
_Avoid_: Estimated spend, est. spend, modelled spend

**Geo Unit Cost**:
A Geo's whole Spend⁺ divided by its whole Installs — including campaigns that spent and bought
nothing, whose money was still spent trying to buy Installs. What one Install actually cost in this
market. It is the basis for all Allocated Spend, so CPI is uniform down an Offer or OS table by
construction: a costing basis, never a comparison axis. Offers are separated by EPC/ROI/CPR/CPS,
which ride on real Keitaro counts (ADR-0013).
_Avoid_: Average CPI, blended CPI, effective CPI

> **Offers table shows Spend⁺, not raw Spend.** Its `Spend` column carries the commission-inclusive
> figure, so `Profit = Rev − Spend` reads true in that row and the footer's cost/ROI totals match
> the cells above them. This is the one place a displayed "Spend" is Spend⁺ by design — elsewhere
> raw Spend stays display-only.

> **Total / avg footers appear only above one row.** Any table's roll-up footer is rendered only
> when the table body holds **more than one** data row — with a single row the footer would restate
> it verbatim and read as a second, different fact. Applies to every table in the app, whatever the
> dimension. Roll-up arithmetic is unchanged: counts/money summed, EPC/ROI/cost-per/conversion
> re-derived from those sums, never averaged.

### Money

**Commission**:
The fee a Seller charges on Spend. Buying $100 of Facebook traffic at 6% costs $106. Always part
of cost — it is folded into Spend⁺, which every cost, Profit and ROI figure is built on.
_Avoid_: Fee, markup, seller %

**Spend⁺** (sheet: *Spend+%*):
`Spend × (1 + Commission)` — the true cost of the traffic. **The numerator of every
cost-per metric** (CPC, CPI, CPR, CPS) and the cost basis of Profit and ROI. Raw Spend appears
only as a display column; no derived figure divides by it.
_Avoid_: Gross spend, total spend, spend with commission

**CPC / CPI / CPR / CPS**:
Cost per Link Click / Install / Registration / Sale — each is `Spend⁺ ÷ count`. Sheet names:
CPC, *UniqCost*, *ConversionCost*, *DepCost*. Lower is better; these are what Thresholds grade.

**EPC**:
`Revenue ÷ Installs` — earnings per install. Named "EPC" by convention; it is *not* per-click.

**Click2inst / Inst2reg / Reg2dep**:
Funnel conversion rates between *adjacent* stages: Installs÷Link Clicks, Registrations÷Installs,
Sales÷Registrations. UI labels I2R (Inst2reg), R2S (Reg2dep).

**Inst2sale** (UI: *I2S*):
Sales÷Installs — a *cross-stage* rate that skips Registration, answering "of everyone who
installed, how many ever deposited?". Distinct from the adjacent-stage rates above; shown only in
the Offers table.

**Seller**:
A supplier of Facebook ad accounts, charging one Commission rate. Owns a set of Accounts; an
Account belongs to exactly one Seller, never shared. Accounts claimed by no Seller fall back to
the default Commission — and are surfaced as a warning, never defaulted silently.
_Avoid_: Vendor, supplier, agency, provider

**Profit**:
`Revenue − Spend⁺`. What was actually earned after paying for the traffic.

**ROI**:
`(Revenue − Spend⁺) ÷ Spend⁺ × 100`. One definition everywhere — Geo, Account, Offer, OS.
Commission is never omitted.
_Avoid_: ROAS, return

**Payout**:
What an Offer pays per Sale, declared in the offer string (`CPA | 180 USD`). Deliberately *not*
used to derive thresholds — a buyer may knowingly pay above Payout because postback lag and
player lifetime value mean Revenue understates what a Sale is ultimately worth.

### Judgement

**Zone**:
A traffic-light grade — `green`, `yellow`, `red`, or `neutral`. Applied to a cost metric by
comparing it against a Threshold Pair.

**Threshold Pair**:
The `{gy, yr}` boundaries grading one metric: below `gy` is green, `gy`–`yr` inclusive is yellow,
above `yr` is red. Lower cost is always better.

**Verdict**:
The single judgement rendered on a Campaign, derived from the deepest funnel stage that produced
a result: Sales, else Registrations, else Installs, else Unique Clicks. Surfaced as an action —
red = **СТОП**, yellow = **ТРИМАЄМО**, green = **БУСТ**, neutral = no call yet.
_Avoid_: Bucket, status, decision, recommendation

**Waste**:
A **Campaign's** Spend that exceeds the red Threshold for the results achieved: `spend − yr × count`,
floored at zero. Spend below that line is not waste — it is budget still legitimately working toward
the next result. Only ever non-zero for a red Verdict.
_Avoid_: Loss, burn, overspend

**Account Waste**:
A **Problem Account's** waste, measured over the whole Account rather than summed from its Campaigns:
`Spend⁺ − bar × Installs`, where `bar` is the Review Multiplier × the Geo's install `yr`. Once an
Account is flagged, the pause was due for the Account, so every dollar past the bar is lost —
including dollars spent by Campaigns that graded green on their own. Deliberately **not** the sum of
its Campaigns' Waste, and it may be larger *or* smaller than that sum (ADR-0014). An Account that is
not a Problem Account has no Account Waste; it is measured bottom-up from Waste as before.
_Avoid_: Overspend, account loss, total waste

**Ruleset**:
The complete set of tunable judgement inputs: every Geo's Threshold Pairs, plus the global Waste
Zones, Review Multiplier, default Commission and Seller rules.

**Ruleset Version**:
An immutable snapshot of a Ruleset. Editing never mutates — saving mints a new version. The unit
a Snapshot references, so that a past judgement can always be reproduced exactly.

**Snapshot**:
A stored analysis: the Facts at Fact Grain plus the Verdicts they produced, the Creative Splits and
Campaign Models the sub-grain tables allocate over, and the Frozen Geo Rollup — bound to the Ruleset
Version that produced them, whose thresholds are copied in rather than merely referenced.
Self-sufficient — a report can be rebuilt from a Snapshot alone, and no later edit or deletion
anywhere else can change what it says.

**Report**:
An overseer's view of the Snapshots pushed by the people they can see, grouped by their author and by
the day of data each describes. Not a thing anyone creates or submits — a Snapshot is pushed, and a
Report is what an overseer assembles from Snapshots by asking for a date range. Two overseers asking
different ranges read different Reports over the same Snapshots.
_Avoid_: Submission, digest, roll-up, bundle

**Frozen Geo Rollup**:
The one part of a Snapshot that is stored rather than recomputed: a Geo's headline figures as the
buyer saw them — Spend⁺, Geo Total, Profit, ROI, the cost-per line and Waste. Frozen because Geo
Total counts Untagged Revenue, which never becomes a Fact and so can never be re-derived from a
Snapshot's Facts. Every other table in a Report is recomputed from the Snapshot's Facts, Creative
Splits and Campaign Models against its pinned Ruleset Version, which reproduces exactly by
construction.
_Avoid_: Cached rollup, summary row, header snapshot

> **A Snapshot's two dates.** `report date` is the day the data describes, picked by the buyer at
> push; `taken at` is when they pushed it. Reports group and filter by the **report date** — the only
> one stable when a buyer re-pushes a corrected analysis of an old day. `taken at` is shown only as
> freshness ("last reported at"), never as a grouping key — including on a Dynamics page, where it is
> the axis a Trajectory is drawn on but never the day it belongs to (ADR-0017).

**Replaced Snapshot**:
A Snapshot superseded by a corrected one from the same buyer, within 60 minutes of its push. Nothing
in it is edited — it keeps its Facts, its Frozen Geo Rollup and its copied thresholds, and still
rebuilds its own report — but it is invisible to every calculation: no series, no delta, no table, no
total. Every read filters for active Snapshots. The Trajectory keeps a badge where the point was, so
a number someone read an hour ago can still be accounted for (ADR-0018).
_Avoid_: Deleted snapshot, void snapshot, amended snapshot, draft

**Trajectory**:
The sequence of one buyer's active Snapshots for a single `report date`, ordered by `taken at` — the
shape of their day as it was pushed, not as it is summarised. Two pushes an hour apart are two
points; nothing merges them. The day a Trajectory belongs to is its `report date`; the axis it is
drawn on is `taken at` (ADR-0017).
_Avoid_: Timeline, history, series, snapshot list

**Review Multiplier**:
Global multiplier applied to a Geo's install `yr` threshold to detect a Problem Account.

**Problem Account**:
An Account whose Spend has outrun its results badly enough to suggest broken tracking or a broken
launch rather than merely poor performance. Demands investigation, not a Verdict.

**Reviewed**:
An analyst's mark that they have looked at an Account and dealt with it. Purely a record of the
analyst's own progress through a Geo — it changes no figure, no Verdict and no Problem Account
flag, only which accounts still demand attention. Session-scoped per Geo, and void the moment new
files are uploaded, since the facts it was a judgement about are gone.
_Avoid_: checked, acknowledged, done, resolved

> **Reviewed is not Excluded.** Both are per-analyst toggles in the same screen, and they are
> opposites. **Excluded** is an analysis input — a muted Campaign leaves its Account's metrics,
> zone counts, Waste and Problem rules, so the numbers change. **Reviewed** is presentation only.
> If a toggle moves a figure, it is Excluded; if it only moves attention, it is Reviewed.

### Data hygiene

**Totals Row**:
A summary row emitted by an export tool, identified by *every* dimension field being empty
(Facebook: empty `Country`; Keitaro: no `Country`, no Sub ID, no `Offer`, no `OS`). Represents the
whole report, not a fact. Always discarded — counting it would double every total. An empty
`Sub ID 2` alone does **not** identify one: that is an Untagged Row, which is real traffic
(ADR-0012).
_Avoid_: Summary row, grand total, aggregate row

**Unfired Macro**:
A Keitaro row whose `Sub ID 2` still holds its literal template (`{{campaign.id}}`) because the
tracking macro never expanded. Campaign attribution is lost for good; everything else survives —
`Sub ID 4` still names the Account and `Sub ID 5` still names the Creative. It counts toward the
Geo, Account, Creative, Offer and OS figures, and never toward a Campaign (ADR-0012). It carries no
Spend, and none is ever allocated to it: that money was already paid under a campaign we cannot
name. Macros fail per column, so a row can lose only some Sub IDs; one that lost them all has no
identity left and is Untagged instead.
_Avoid_: Broken row, macro row, template row

**Untagged Revenue**:
Revenue on a Keitaro row where Facebook's macros returned an empty referral, leaving every Sub ID
blank. Real money earned by these campaigns that cannot be traced to one of them. Its only Geo
signal is Keitaro's country name — there is no creative to read a code from. Counts toward the
Geo Total, and only when its `OS` is mobile: these campaigns buy mobile installs, so a desktop row
cannot have come from the Spend under analysis (ADR-0012).
_Avoid_: Orphan revenue, untracked revenue, unattributed revenue

**Invalid Row**:
A Keitaro main-report row with an empty `OS`. Discarded everywhere — not a fact about any
Campaign.
_Avoid_: Bot row, junk row, noise
