# Geo Total diverges from the sum of its Campaigns, by design

A single fact table ([0001](0001-single-fact-table-join-on-campaign-id.md)) would normally mean
every level reconciles: geo = sum(campaigns). We deliberately break that at the Geo level.

The **Geo Total** sums Spend and Revenue for a country **including rows that carry no Sub IDs** —
revenue Facebook's macros failed to tag, and unfired-macro rows (`{{campaign.id}}`). The
**Attributed** figures (every Campaign, Account, Creative, Offer, OS number) include only rows
that joined to a Campaign. So `Geo Total ≥ sum(Campaigns)`, intentionally.

## Why

- Untagged Revenue is **real money these campaigns earned** — Facebook's automatic macros
  sometimes send an empty referral. Excluding it would understate how a market actually performed.
  The Geo answers "is this market making money?"; the Attributed level answers "which campaign do
  I stop?". Different questions, different sums.
- Unfired-macro rows keep a readable Geo (from the creative code) and Account (`Sub ID 4`) even
  though Campaign attribution is lost, so they too belong to the Geo Total.

## Consequences

- **Uniques compound the gap.** Link Clicks and Installs are unique-per-user; summing
  Campaign-grained rows overstates Geo uniques (observed KR installs 88 summed vs 69 in Keitaro's
  country view). The app cannot dedup without user IDs it never receives. Geo unique counts are
  therefore *approximate* and will not tie out to Keitaro's country dashboard. Documented, not
  fixed — it is a property of the input grain.
- A growing "unattributed" share is a **tracking-health signal** worth surfacing, not hiding.
- Anyone who later "fixes" the app to force geo = sum(campaigns) will silently delete real revenue.
  That is why this is written down.
