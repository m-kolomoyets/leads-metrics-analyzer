import type { Metrics } from './aggregate';
import type { GeoAllocation } from './allocate';
import type { CommissionConfig } from './commission';
import type { CampaignCreatives, RawFact, RawTotals } from './join';
import type { Fact, GeoThresholds, Totals } from './types';
import type { ProblemAccount } from './verdict';
import { metricsFor, spendPlus, sumTotals } from './aggregate';
import { allocateGeo } from './allocate';
import { rateFor, unclaimedAccounts } from './commission';
import { join } from './join';
import { parseFiles } from './parse';
import { problemAccount, verdictFor } from './verdict';

// The compute layer's public entry (ADR-0010): raw CSV text → graded facts + roll-ups, pure. Data
// flows parse → join → commission → aggregate → verdict. No React, no DB, no transport.

export type Ruleset = {
    // Active Verdict thresholds per Geo (ISO-2). A geo with no entry grades neutral.
    thresholds: Record<string, GeoThresholds>;
    commission: CommissionConfig;
    reviewMultiplier: number;
};

export type GeoRollup = {
    geo: string;
    metrics: Metrics;
    // The Attributed roll-up (matched campaigns only), excluding untagged — its divergence from
    // `metrics` (which includes untagged) is the Geo-Total gap (ADR-0003).
    attributed: Metrics;
    // Offer/OS allocated-spend tables (doc 06). Estimated Spend⁺; installs reconcile to `attributed`.
    allocation: GeoAllocation;
};

export type AnalyzeResult = {
    facts: Fact[];
    geos: GeoRollup[];
    // Per-campaign FB creative Spend/Impressions (#35). The per-Geo Creative table (`creativesFor`)
    // allocates the funnel over these; kept raw here since grading depends on the UI-active preset.
    campaignCreatives: Map<string, CampaignCreatives>;
    problemAccounts: ProblemAccount[];
    // Accounts no Seller claims → costed at the default (surface, doc 03 §Sellers).
    unclaimedAccounts: string[];
    warnings: ReturnType<typeof join>['warnings'];
    parseWarnings: ReturnType<typeof parseFiles>['warnings'];
};

// Lift a RawFact to a full Fact: add per-Account Spend⁺ and the campaign Verdict/zone.
function gradeFact(raw: RawFact, ruleset: Ruleset): Fact {
    const commission = rateFor(raw.account, ruleset.commission);
    const sp = spendPlus(raw.spend, commission);
    const totals: Totals = {
        spend: raw.spend,
        spendPlus: sp,
        revenue: raw.revenue,
        linkClicks: raw.linkClicks,
        installs: raw.installs,
        regs: raw.regs,
        sales: raw.sales,
    };
    const thresholds = ruleset.thresholds[raw.geo];
    const verdict = thresholds
        ? verdictFor(totals, thresholds)
        : { verdict: 'neutral' as const, zone: 'neutral' as const };
    return {
        campaign: raw.campaign,
        creative: raw.creative,
        reportDate: raw.reportDate,
        geo: raw.geo,
        account: raw.account,
        offer: raw.offer,
        os: raw.os,
        spend: raw.spend,
        spendPlus: sp,
        revenue: raw.revenue,
        linkClicks: raw.linkClicks,
        installs: raw.installs,
        regs: raw.regs,
        sales: raw.sales,
        verdict: verdict.verdict,
        zone: verdict.zone,
    };
}

// A RawTotals (untagged bucket) as a Totals: untagged rows carry no FB spend, so spend/Spend⁺ = 0.
function untaggedTotals(raw: RawTotals): Totals {
    return { ...raw, spend: 0, spendPlus: 0 };
}

export function analyze(texts: string[], ruleset: Ruleset): AnalyzeResult {
    const parsed = parseFiles(texts);
    const { facts: rawFacts, geoUntagged, campaignModels, campaignCreatives, warnings } = join(parsed);
    const facts = rawFacts.map((raw) => {
        return gradeFact(raw, ruleset);
    });

    // Roll up per Geo. `metrics` = attributed + untagged (the Geo Total, ADR-0003); `attributed`
    // excludes untagged so the divergence is inspectable.
    const byGeo = new Map<string, Fact[]>();
    for (const fact of facts) {
        const list = byGeo.get(fact.geo) ?? [];
        list.push(fact);
        byGeo.set(fact.geo, list);
    }
    const geos: GeoRollup[] = [];
    for (const [geo, geoFacts] of byGeo) {
        const attributed = sumTotals(geoFacts);
        const untagged = geoUntagged.get(geo);
        const total = untagged ? sumTotals([attributed, untaggedTotals(untagged)]) : attributed;
        geos.push({
            geo,
            metrics: metricsFor(total),
            attributed: metricsFor(attributed),
            allocation: allocateGeo(geoFacts, campaignModels),
        });
    }

    // Problem Accounts: aggregate per (geo, account), test against the geo's absolute K × installs.yr.
    const problemAccounts: ProblemAccount[] = [];
    const byGeoAccount = new Map<string, Map<string, Fact[]>>();
    for (const fact of facts) {
        const accounts = byGeoAccount.get(fact.geo) ?? new Map<string, Fact[]>();
        const list = accounts.get(fact.account) ?? [];
        list.push(fact);
        accounts.set(fact.account, list);
        byGeoAccount.set(fact.geo, accounts);
    }
    for (const [geo, accounts] of byGeoAccount) {
        const thresholds = ruleset.thresholds[geo];
        if (!thresholds) {
            continue;
        }
        for (const [account, accountFacts] of accounts) {
            const problem = problemAccount(account, sumTotals(accountFacts), thresholds, ruleset.reviewMultiplier);
            if (problem) {
                problemAccounts.push(problem);
            }
        }
    }

    return {
        facts,
        geos,
        campaignCreatives,
        problemAccounts,
        unclaimedAccounts: unclaimedAccounts(
            facts.map((f) => {
                return f.account;
            }),
            ruleset.commission
        ),
        warnings,
        parseWarnings: parsed.warnings,
    };
}
