import type { Metrics } from './aggregate';
import type { Fact, GeoThresholds, Totals, Zone } from './types';
import type { ProblemAccount, Verdict } from './verdict';
import { metricsFor, sumTotals } from './aggregate';
import { problemAccount, verdictFor } from './verdict';

// Per-Account roll-up for the analyzer shell (S2). Aggregates graded Facts to Campaign grain, groups
// them under their Account, buckets each by its Verdict zone, and flags Problem Accounts (doc 04).
// Pure. `excluded` (campaign ids the analyst muted) is a real analysis input: excluded campaigns stay
// listed but drop out of the account's metrics / counts / problem / sales — so a toggle recomputes.

export type CampaignRollup = {
    campaign: string;
    totals: Totals;
    metrics: Metrics;
    verdict: Verdict;
    // The analyst muted this campaign — shown, but out of the account roll-up.
    excluded: boolean;
};

// The header tally. A campaign with ≥1 sale counts under `sales` INSTEAD of its verdict zone — sales
// outrank the zone everywhere in the UI (the sales block owns those ids), so the dots never double-count.
export type AccountCounts = Record<Zone, number> & { sales: number };

export type AccountRollup = {
    account: string;
    // Metrics over the account's INCLUDED campaigns only.
    metrics: Metrics;
    // All the account's campaigns (included + excluded), Spend⁺ desc.
    campaigns: CampaignRollup[];
    // Included-campaign counts by verdict zone, plus the sales tally — the account header dots.
    counts: AccountCounts;
    // Non-null when a Problem-Account rule fires (doc 04) over the included campaigns.
    problem: ProblemAccount | null;
    // Σ Spend⁺ wasted over the included red campaigns (doc 06) — the account's slice of geo waste.
    waste: number;
    // Included campaigns that produced ≥1 sale — surfaced in their own block, sales desc.
    salesCampaigns: CampaignRollup[];
};

const NEUTRAL: Verdict = { verdict: 'neutral', zone: 'neutral', reason: null, waste: 0 };

function gradeCampaign(
    campaign: string,
    facts: Fact[],
    thresholds: GeoThresholds | undefined,
    excluded: boolean
): CampaignRollup {
    const totals = sumTotals(facts);
    const verdict = thresholds ? verdictFor(totals, thresholds) : NEUTRAL;
    return { campaign, totals, metrics: metricsFor(totals), verdict, excluded };
}

// Group facts by account, each account's campaigns bucketed + graded. Zero-Spend accounts dropped.
export function accountsFor(
    facts: Fact[],
    thresholds: GeoThresholds | undefined,
    reviewMultiplier: number,
    excluded: ReadonlySet<string> = new Set()
): AccountRollup[] {
    const byAccount = new Map<string, Map<string, Fact[]>>();
    for (const fact of facts) {
        // This block exists to decide what to stop, and it decides one campaign at a time. A
        // campaign-lost fact has no campaign to stop and no Spend to weigh, so it would show up as a
        // synthetic row an analyst can neither act on nor recognise (ADR-0012). It still counts in
        // the Geo, Offer, OS and Creative tables — this is the one surface it stays out of.
        if (fact.attribution !== 'full') {
            continue;
        }
        const campaigns = byAccount.get(fact.account) ?? new Map<string, Fact[]>();
        const list = campaigns.get(fact.campaign) ?? [];
        list.push(fact);
        campaigns.set(fact.campaign, list);
        byAccount.set(fact.account, campaigns);
    }

    const accounts: AccountRollup[] = [];
    for (const [account, campaigns] of byAccount) {
        const rollups = [...campaigns].map(([campaign, campaignFacts]) => {
            return gradeCampaign(campaign, campaignFacts, thresholds, excluded.has(campaign));
        });
        rollups.sort((a, b) => {
            return b.metrics.spendPlus - a.metrics.spendPlus;
        });

        // Drop only genuinely empty accounts — test the WHOLE account, so one whose every campaign is
        // muted stays visible (its rows can be un-excluded); roll-up metrics still use included only.
        const accountTotal = sumTotals(
            rollups.map((rollup) => {
                return rollup.totals;
            })
        );
        if (accountTotal.spendPlus === 0) {
            continue;
        }

        const included = rollups.filter((rollup) => {
            return !rollup.excluded;
        });
        const totals = sumTotals(
            included.map((rollup) => {
                return rollup.totals;
            })
        );

        const counts: AccountCounts = { green: 0, yellow: 0, red: 0, neutral: 0, sales: 0 };
        for (const rollup of included) {
            if (rollup.metrics.sales > 0) {
                counts.sales += 1;
                continue;
            }
            counts[rollup.verdict.verdict] += 1;
        }

        accounts.push({
            account,
            metrics: metricsFor(totals),
            campaigns: rollups,
            counts,
            waste: included.reduce((sum, rollup) => {
                return sum + rollup.verdict.waste;
            }, 0),
            // No included spend → no verdict to alarm on (rule 2's CPI would divide 0/0 to Infinity).
            problem:
                thresholds && totals.spendPlus > 0
                    ? problemAccount(account, totals, thresholds, reviewMultiplier)
                    : null,
            salesCampaigns: included
                .filter((rollup) => {
                    return rollup.metrics.sales > 0;
                })
                .sort((a, b) => {
                    return b.metrics.sales - a.metrics.sales;
                }),
        });
    }

    accounts.sort((a, b) => {
        return b.metrics.spendPlus - a.metrics.spendPlus;
    });
    return accounts;
}
