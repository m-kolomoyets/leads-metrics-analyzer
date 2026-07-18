import type { Metrics } from './aggregate';
import type { CampaignCreatives } from './join';
import type { Fact, GeoThresholds, Totals } from './types';
import type { Verdict } from './verdict';
import { metricsFor } from './aggregate';
import { verdictFor } from './verdict';

// #35 · Per-Geo Creative analysis (dollar analyzer). One row per creative for the active Geo.
// FB Spend + Impressions are REAL per creative; the KT funnel (installs/regs/sales/clicks/revenue)
// joins only at Campaign grain, so it is ALLOCATED across a campaign's creatives in proportion to
// each creative's Spend share (doc 06 allocation, mirrored). Allocated installs reconcile to the
// campaign's installs (Σ share = 1). Pure — the "estimate" label lives at the UI edge.

// The creative key embedded in an FB ad name / KT Sub ID 5, e.g. "IN_93" from "🇮🇳 IN_93 [FortuneGems]".
// `cc` is the two-letter prefix (the flag). Rows whose name carries no such key are skipped.
const CREATIVE_KEY = /([A-Z]{2})_(\d+)/;

export type ParsedCreative = { key: string; cc: string };

export function parseCreative(name: string): ParsedCreative | null {
    const match = CREATIVE_KEY.exec(name);
    return match ? { key: `${match[1]}_${match[2]}`, cc: match[1] } : null;
}

export type CreativeRow = {
    // Parsed creative key ("IN_93") and its country-code prefix (for the flag).
    key: string;
    cc: string;
    // Real, summed across the Geo's campaigns — never allocated.
    impressions: number;
    // Metrics on REAL Spend⁺ + ALLOCATED funnel. CPC/CPI/CPR/CPS read off this.
    metrics: Metrics;
    // Real Spend ÷ Impressions × 1000 (both real). Null when impressions are zero.
    cpm: number | null;
    // Allocated clicks ÷ real Impressions × 100. Null when impressions are zero.
    ctr: number | null;
    // The verdict on the creative's metrics against the Geo thresholds (drives the zone stripe + "Чому").
    verdict: Verdict;
};

const NEUTRAL: Verdict = { verdict: 'neutral', zone: 'neutral', reason: null, waste: 0 };

// A creative's accumulating bucket: real Spend/Impressions + allocated Spend⁺/funnel.
type Acc = Totals & { impressions: number; cc: string };

function zeroAcc(cc: string): Acc {
    return { spend: 0, spendPlus: 0, revenue: 0, linkClicks: 0, installs: 0, regs: 0, sales: 0, impressions: 0, cc };
}

// Build the Geo's creative rows from its graded Facts (campaign grain) + the per-campaign FB creative
// breakdown. Facts must already be scoped to one Geo. Spend⁺-desc, biggest bet first.
export function creativesFor(
    facts: Fact[],
    campaignCreatives: Map<string, CampaignCreatives>,
    thresholds: GeoThresholds | undefined
): CreativeRow[] {
    const byKey = new Map<string, Acc>();

    for (const fact of facts) {
        const creatives = campaignCreatives.get(fact.campaign);
        // No per-creative source, or a zero-Spend campaign (no basis to split) — nothing to allocate.
        if (!creatives || fact.spend <= 0) {
            continue;
        }
        for (const [name, real] of creatives) {
            const parsed = parseCreative(name);
            if (!parsed) {
                continue;
            }
            const share = real.spend / fact.spend;
            const acc = byKey.get(parsed.key) ?? zeroAcc(parsed.cc);
            // Spend/Impressions are real; the rest is the campaign's funnel × this creative's Spend share.
            acc.spend += real.spend;
            acc.impressions += real.impressions;
            acc.spendPlus += fact.spendPlus * share;
            acc.revenue += fact.revenue * share;
            acc.linkClicks += fact.linkClicks * share;
            acc.installs += fact.installs * share;
            acc.regs += fact.regs * share;
            acc.sales += fact.sales * share;
            byKey.set(parsed.key, acc);
        }
    }

    const rows: CreativeRow[] = [];
    for (const [key, acc] of byKey) {
        const totals: Totals = {
            spend: acc.spend,
            spendPlus: acc.spendPlus,
            revenue: acc.revenue,
            linkClicks: acc.linkClicks,
            installs: acc.installs,
            regs: acc.regs,
            sales: acc.sales,
        };
        const metrics = metricsFor(totals);
        rows.push({
            key,
            cc: acc.cc,
            impressions: acc.impressions,
            metrics,
            cpm: acc.impressions > 0 ? (acc.spend / acc.impressions) * 1000 : null,
            ctr: acc.impressions > 0 ? (acc.linkClicks / acc.impressions) * 100 : null,
            verdict: thresholds ? verdictFor(totals, thresholds) : NEUTRAL,
        });
    }
    rows.sort((a, b) => {
        return b.metrics.spendPlus - a.metrics.spendPlus;
    });
    return rows;
}
