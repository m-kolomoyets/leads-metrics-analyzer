import type { Metrics } from './aggregate';
import type { CampaignModel } from './join';
import type { Fact, Totals } from './types';
import { metricsFor } from './aggregate';

// 6 · Allocation (doc 06). Offer and OS live below the join — Facebook never measures their Spend, so
// each Campaign's real Spend⁺ is split across its Offers / OS in proportion to that Campaign's own
// Installs. The resulting rows carry the standard metric family, computed on ALLOCATED (estimated)
// Spend⁺. Pure — no React, no DB. The "estimate" label is enforced at the UI edge.

// One Offer or OS row: its identity, a display label, and metrics on allocated Spend⁺.
export type ModelRow = {
    // Offer ID or OS value — the reconciling identity (installs sum back to the Geo's).
    key: string;
    // Display label (offer: parsed pipe name; OS: the OS value itself).
    label: string;
    metrics: Metrics;
};

// The two allocated tables for one Geo, plus the Spend⁺ no Offer could absorb.
export type GeoAllocation = {
    offers: ModelRow[];
    os: ModelRow[];
    // Spend⁺ of campaigns that bought nothing: zero Installs (no share denominator) or no Keitaro
    // model at all. Real money spent, so it must stay in the Geo's Spend⁺ — it just has no Offer to
    // hang on. Carried out separately and rendered as its own row so the Offers footer reconciles
    // to the Geo Total exactly instead of silently under-reporting.
    unallocated: Totals;
};

function zeroTotals(): Totals {
    return { spend: 0, spendPlus: 0, revenue: 0, linkClicks: 0, installs: 0, regs: 0, sales: 0 };
}

// The OS table only ever reports mobile traffic: Android and iOS. Every other OS value (desktop,
// unknown, empty) is dropped before allocation — it must not count into any OS row at all.
function mobileOs(os: string): 'Android' | 'iOS' | null {
    const value = os.trim().toLowerCase();
    if (value.startsWith('android')) {
        return 'Android';
    }
    return value.startsWith('ios') ? 'iOS' : null;
}

function bucket(map: Map<string, Totals>, key: string): Totals {
    const existing = map.get(key);
    if (existing) {
        return existing;
    }
    const fresh = zeroTotals();
    map.set(key, fresh);
    return fresh;
}

// Rows worth showing: any dimension value with installs or revenue; Spend⁺ desc (biggest bet first).
function toRows(totals: Map<string, Totals>, labels: Map<string, string>): ModelRow[] {
    const rows: ModelRow[] = [];
    for (const [key, t] of totals) {
        if (t.installs <= 0 && t.revenue <= 0) {
            continue;
        }
        rows.push({ key, label: labels.get(key) ?? key, metrics: metricsFor(t) });
    }
    rows.sort((a, b) => {
        return b.metrics.spendPlus - a.metrics.spendPlus;
    });
    return rows;
}

// Allocate one Geo's Facts across their Offers and OS. Each Fact carries the campaign's real Spend /
// Spend⁺ (commission already baked, index.ts); the model carries the per-Offer/OS install split.
export function allocateGeo(facts: Fact[], models: Map<string, CampaignModel>): GeoAllocation {
    const offerTotals = new Map<string, Totals>();
    const offerLabels = new Map<string, string>();
    const osTotals = new Map<string, Totals>();
    const unallocated = zeroTotals();

    for (const fact of facts) {
        const model = models.get(fact.campaign);
        if (!model) {
            // No Keitaro rows joined: the campaign spent and bought nothing measurable.
            unallocated.spend += fact.spend;
            unallocated.spendPlus += fact.spendPlus;
            continue;
        }
        const campaignInstalls = fact.installs;
        // Every Offer's share of a zero-Install campaign is 0, so its whole Spend⁺ falls through.
        let allocatedShare = 0;

        for (const [offerId, funnel] of model.offer) {
            const acc = bucket(offerTotals, offerId);
            // Proportional Spend⁺(c) × installs(o within c) / installs(c). Zero-install campaigns
            // contribute no spend to any offer (and no installs either).
            const share = campaignInstalls > 0 ? funnel.installs / campaignInstalls : 0;
            allocatedShare += share;
            acc.spend += fact.spend * share;
            acc.spendPlus += fact.spendPlus * share;
            acc.revenue += funnel.revenue;
            acc.installs += funnel.installs;
            acc.regs += funnel.regs;
            acc.sales += funnel.sales;
            // Offers have no clicks source (KT clicks carries OS, not Offer) — linkClicks stays 0.
            if (funnel.label !== '') {
                offerLabels.set(offerId, funnel.label);
            }
        }

        // Shares sum to exactly 1 whenever the campaign had Installs (the Offer split comes from the
        // very rows that produced the campaign's Install count), so the remainder is 0 or everything.
        const leftover = Math.max(0, 1 - allocatedShare);
        unallocated.spend += fact.spend * leftover;
        unallocated.spendPlus += fact.spendPlus * leftover;

        for (const [os, funnel] of model.os) {
            const label = mobileOs(os);
            if (!label) {
                continue;
            }
            const acc = bucket(osTotals, label);
            const share = campaignInstalls > 0 ? funnel.installs / campaignInstalls : 0;
            acc.spend += fact.spend * share;
            acc.spendPlus += fact.spendPlus * share;
            acc.revenue += funnel.revenue;
            acc.installs += funnel.installs;
            acc.regs += funnel.regs;
            acc.sales += funnel.sales;
            acc.linkClicks += funnel.linkClicks;
        }
    }

    return {
        offers: toRows(offerTotals, offerLabels),
        os: toRows(osTotals, new Map()),
        unallocated,
    };
}
