# Problem Accounts measure waste at Account grain, not summed from their Campaigns

Waste has always been bottom-up: each red Campaign's Spend⁺ past its red line, summed to the Account,
summed to the Geo. From now on that holds only for ordinary Accounts. A **Problem Account** is
measured whole:

```
bar            = Review Multiplier × Geo installs.yr
Account Waste  = max(0, Spend⁺ − bar × max(Installs, 1))
```

Everyone else keeps `Σ red Campaigns' Waste`. The trigger is exactly the existing Problem Account
test — either rule — so no new classification was invented.

## Why

The Problem Account rules already assert something about the *Account*: its money went out with
nothing tracked (rule 1), or its cost blew past the bar with the funnel dead (rule 2). That is a
judgement that the whole Account should have been paused. But the waste figure sitting next to that
alarm was still built out of individual red Campaigns — so an Account that kept burning while two of
its campaigns happened to grade green reported only a fraction of what it actually lost.

The trigger fires on the Account, so the loss must be counted on the Account. Anything else answers a
question nobody asked.

`max(Installs, 1)` is what lets one formula serve both rules. Rule 1 has zero Installs and bills a
single bar — the budget that was legitimately allowed to run before the pause came due. Rule 2 with
Installs bills the bar per Install, mirroring the shape of Campaign Waste but graded against the
review-multiplied line. The floor also catches a real edge: rule 2 fires on an infinite CPI when
Installs is zero, in the gap below the bar where rule 1 declines — without the floor a $5 Account
would be billed the whole $5.

## Alternatives rejected

- **`max(Account Waste, Σ Campaign Waste)`** — guarantees the number never drops. Rejected: the
  figure would then mean two different things depending on which side won, and a reader could not
  tell which by looking. One rule that is sometimes lower beats two rules that are always defensible
  individually and incoherent together.
- **Whole Spend⁺ for a Problem Account** — harsher and simpler, and consistent with the zero-result
  Campaign rule. Rejected: the spend up to the bar is *by definition* the spend we told the analyst
  to allow before investigating. Billing it as waste contradicts the Review Multiplier's own meaning.
- **Pro-rating the Account figure back across its red Campaigns** to preserve additivity. Rejected:
  the per-Campaign numbers would become derived fictions, and Campaign Waste is the input to a real
  decision (which campaign do I stop?).

## Consequences

- **Waste is no longer additive across grains.** A Problem Account's figure will not equal the sum of
  its Campaign rows. This is the whole point of the change, and it is the thing a future reader will
  most likely file as an arithmetic bug — hence `AccountRollup.wasteGrain`, which names which
  measurement the number is, and the `*` marker plus footnote in the account summary table.
- **Rule-1 Accounts now report slightly less waste than before** — exactly one `bar` less. Their
  Campaigns are all zero-result reds, each wasting its whole Spend⁺, so the old sum was the entire
  Account. Accepted deliberately (see the second rejected alternative).
- **Accounts whose Campaigns were graded on a later funnel stage report more.** A Campaign judged on
  CPR wastes `Spend⁺ − regs.yr × regs`; the Account bills against the install bar, which is usually
  the tighter line. This is where the change captures money the old logic missed.
- **Geo waste is now mixed-grain by construction** — it sums Account figures without caring which
  grain each is. Correct, but it means the Geo readout can no longer be reconciled by adding up
  campaign rows.
- **Reproducibility is unaffected.** The formula reads only the Ruleset (Review Multiplier and the
  Geo's install threshold), which a Snapshot pins by Ruleset Version
  ([0002](0002-immutable-ruleset-versions.md)), so past analyses still rebuild exactly.
- Excluded Campaigns behave as before: they leave the Account totals, so they move both the Problem
  flag and the Account Waste. A toggle still recomputes everything.
