// Shared types for the pure compute layer (ADR-0010). No React, no DB, no transport.
// The domain grades in its own vocabulary; the UI maps zones to locale strings (ADR-0004).

// Traffic-light grade — mirrors the DB `fact_zone` enum, redeclared here so the domain owns no
// dependency on the services/persistence layer.
export type Zone = 'green' | 'yellow' | 'red' | 'neutral';

// A tunable grading band for a cost metric. `gy` = green→yellow edge, `yr` = yellow→red edge.
// Lower cost is better: cost < gy green, gy ≤ cost ≤ yr yellow (yr inclusive), cost > yr red.
export type ThresholdPair = {
    gy: number;
    yr: number;
};

// Per-Geo verdict thresholds (doc 05). One pair per funnel stage.
export type GeoThresholds = {
    installs: ThresholdPair;
    regs: ThresholdPair;
    sales: ThresholdPair;
    clicks: ThresholdPair;
};

// How completely a fact is attributed (ADR-0012). `full` joined FB↔Keitaro on Campaign ID and is the
// only class a Verdict may grade. `campaign-lost` is an Unfired-Macro row: Account, Creative, Offer,
// OS and Geo all survive, so it counts everywhere those roll up — but it has no Campaign, and
// therefore no Facebook Spend, so grading it would divide by zero and stopping it is meaningless.
export type Attribution = 'full' | 'campaign-lost';

// The raw funnel counts + spend/revenue at any roll-up level. Uniques (linkClicks, installs) are
// exact at Campaign grain, approximate once summed to Geo (doc 03 — "uniques do not sum").
export type Totals = {
    spend: number;
    spendPlus: number;
    revenue: number;
    linkClicks: number;
    installs: number;
    regs: number;
    sales: number;
};

// The funnel stage a verdict was decided at, and its per-stage cost metric.
export type Stage = 'sales' | 'regs' | 'installs' | 'clicks';
export type Metric = 'cps' | 'cpr' | 'cpi' | 'cpc';

// A structured verdict reason — never a display string (doc 04). The UI renders it per locale.
// A discriminated union: `kind` says WHICH situation decided, so the UI can name the criteria
// (stage word, zone label, situational note) instead of restating the action word.
//  - graded:        a stage produced results; `value` is Spend⁺ cost-per, graded to `zone`.
//  - clicksWaiting: judged on clicks, non-red; holds at yellow ("чекаємо інстал").
//  - zeroResult:    zero results but Spend⁺ past a stage's red line; `value` is raw Spend⁺.
//  - tooEarly:      spent under every red line, nothing yet; `value` is raw Spend⁺.
//  - spendZero:     Spend⁺ = 0 — nothing to analyse.
export type VerdictReason =
    | { kind: 'graded'; stage: Stage; metric: Metric; value: number; zone: Zone }
    | { kind: 'clicksWaiting'; stage: 'clicks'; metric: 'cpc'; value: number; zone: 'yellow' }
    | { kind: 'zeroResult'; stage: Stage; metric: Metric; value: number }
    | { kind: 'tooEarly'; value: number }
    | { kind: 'spendZero' };

// One fact at grain Campaign × Creative × Date. Field-for-field the shape of `snapshot_fact`
// (ADR-0010) so a save is a straight map. `offer`/`os` are representative attributes of the
// collapsed KT rows; the Offer/OS allocation tables (doc 06) are rebuilt in slice 4.
export type Fact = {
    // `full` joined Facebook↔Keitaro on Campaign ID. `campaign-lost` is an Unfired-Macro row: real
    // Account/Creative/Offer/OS/Geo, no Campaign and no Spend, so it counts into every roll-up but
    // must never appear as a campaign row or carry a Verdict (ADR-0012).
    attribution: Attribution;
    campaign: string;
    creative: string;
    reportDate: string;
    geo: string;
    account: string;
    offer: string;
    os: string | null;
    spend: number;
    spendPlus: number;
    revenue: number;
    linkClicks: number;
    installs: number;
    regs: number;
    sales: number;
    verdict: Zone;
    zone: Zone;
};
