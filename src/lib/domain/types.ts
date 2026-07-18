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

// A structured verdict reason — never a display string (doc 04). The UI renders it per locale.
export type VerdictReason = {
    stage: 'sales' | 'regs' | 'installs' | 'clicks';
    metric: 'cps' | 'cpr' | 'cpi' | 'cpc';
    value: number;
    zone: Zone;
};

// One fact at grain Campaign × Creative × Date. Field-for-field the shape of `snapshot_fact`
// (ADR-0010) so a save is a straight map. `offer`/`os` are representative attributes of the
// collapsed KT rows; the Offer/OS allocation tables (doc 06) are rebuilt in slice 4.
export type Fact = {
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
