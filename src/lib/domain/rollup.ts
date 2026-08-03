import type { Metrics } from './aggregate';
import type { GeoAllocation } from './allocate';
import type { CampaignModel } from './join';
import type { Fact, Ruleset, Totals } from './types';
import type { ProblemAccount } from './verdict';
import { metricsFor, sumTotals } from './aggregate';
import { allocateGeo } from './allocate';
import { unclaimedAccounts } from './commission';
import { problemAccount } from './verdict';

// The roll-up half of the compute layer, shared verbatim by both entry points (ADR-0010). Graded
// Facts go in; per-Geo roll-ups, the Offer/OS allocation, Problem Accounts and the unclaimed-account
// warning come out. Only the JOIN half differs between `analyzeParsed` (three CSVs) and
// `analyzeSnapshot` (a stored Snapshot) — so a report and the Analyze screen cannot drift apart by
// computing the same table twice.

// The Geo-Total-only figures — the half of a Geo's header that Facts alone cannot produce, because
// the Geo Total counts Untagged Revenue that never becomes a Fact (ADR-0003).
export type GeoTotal = {
    // Revenue INCLUDING untagged. Deliberately ≥ the Attributed sum.
    revenue: number;
    // Geo Total − Spend⁺.
    profit: number;
    roi: number | null;
    // Σ each account's waste, mixed-grain by design (ADR-0014). Null on the Analyze path: Analyze
    // computes waste per open tab against the live mute set, so there is no single figure to hand
    // back here; a Snapshot carries the one that was frozen at save.
    waste: number | null;
};

export type GeoRollup = {
    geo: string;
    // The Geo roll-up. `metrics` is the Geo Total whenever `total` is non-null; when `total` is null
    // it has fallen back to the Attributed roll-up, and only its Spend⁺ and cost-per line are still
    // Geo figures.
    metrics: Metrics;
    // The Attributed roll-up (matched campaigns only), excluding untagged — its divergence from the
    // Geo Total is the Geo-Total gap (ADR-0003).
    attributed: Metrics;
    // Offer/OS allocated-spend tables (doc 06). Estimated Spend⁺; installs reconcile to `attributed`.
    allocation: GeoAllocation;
    // Null only for a Snapshot that carries no Frozen Geo Rollup: its Untagged Revenue is gone for
    // good, so Geo Total, Profit, ROI and Waste read `—` rather than being backfilled with an
    // Attributed sum (ADR-0015). `analyzeParsed` always fills it.
    total: GeoTotal | null;
};

export type RollupInput = {
    // Every graded Fact, all Geos.
    facts: Fact[];
    // One Geo's Geo Total, from its Attributed roll-up. Analyze folds the Geo's untagged bucket in and
    // always returns one; a Snapshot returns its Frozen Geo Rollup, or NULL when it froze none — the
    // Untagged Revenue is then gone for good and the Geo rolls up as Attributed with `total: null`.
    geoTotalFor: (geo: string, attributed: Totals) => Totals | null;
    // Per-Geo frozen waste. Absent means "not measured here" — see `GeoTotal.waste`.
    geoWaste: Map<string, number>;
    // Per-campaign Offer/OS funnel breakdown, the input the allocation runs over (doc 06).
    campaignModels: Map<string, CampaignModel>;
};

export type RollupResult = {
    geos: GeoRollup[];
    problemAccounts: ProblemAccount[];
    unclaimedAccounts: string[];
};

// Roll Facts up per Geo, then flag Problem Accounts. Geo order follows first appearance in `facts` —
// which is the buyer's tab order on the Analyze path, and storage order on the Snapshot path, so a
// caller that cares about market order sorts for itself.
export function rollUp(input: RollupInput, ruleset: Ruleset): RollupResult {
    const { facts, geoTotalFor, geoWaste, campaignModels } = input;

    const byGeo = new Map<string, Fact[]>();
    for (const fact of facts) {
        const list = byGeo.get(fact.geo) ?? [];
        list.push(fact);
        byGeo.set(fact.geo, list);
    }

    const geos: GeoRollup[] = [];
    for (const [geo, geoFacts] of byGeo) {
        const attributed = sumTotals(geoFacts);
        const geoTotal = geoTotalFor(geo, attributed);
        const metrics = metricsFor(geoTotal ?? attributed);
        geos.push({
            geo,
            metrics,
            attributed: metricsFor(attributed),
            allocation: allocateGeo(geoFacts, campaignModels),
            total: geoTotal
                ? {
                      revenue: metrics.revenue,
                      profit: metrics.profit,
                      roi: metrics.roi,
                      waste: geoWaste.get(geo) ?? null,
                  }
                : null,
        });
    }

    // Problem Accounts: aggregate per (geo, account), test against the geo's absolute K × installs.yr.
    const problemAccounts: ProblemAccount[] = [];
    const byGeoAccount = new Map<string, Map<string, Fact[]>>();
    for (const fact of facts) {
        // Campaign-lost facts carry Revenue against zero Spend, so folding them in here would make a
        // wasteful account look thriftier than it is and could silently clear a genuine flag. The
        // detector is a Spend-waste test — it sees attributed facts only (ADR-0012).
        if (fact.attribution !== 'full') {
            continue;
        }
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
        geos,
        problemAccounts,
        unclaimedAccounts: unclaimedAccounts(
            facts.map((fact) => {
                return fact.account;
            }),
            ruleset.commission
        ),
    };
}
