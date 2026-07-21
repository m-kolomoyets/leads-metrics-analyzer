import type { Metrics } from './aggregate';
import type { CampaignModel } from './join';
import type { Fact, Totals } from './types';
import { metricsFor } from './aggregate';
import { mobileOs } from './join';

// 6 · Allocation (doc 06). Offer and OS live below the join — Facebook never measures their Spend, so
// it is imputed: the Geo's own unit cost (its whole Spend⁺ ÷ its whole Installs) times each row's
// Installs (ADR-0013). The resulting rows carry the standard metric family, computed on ALLOCATED
// (estimated) Spend⁺. Pure — no React, no DB. The "estimate" label is enforced at the UI edge.

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
    // Spend⁺ no Offer could absorb. Normally 0: Offer Installs sum to the Geo's, so pricing them at
    // the Geo unit cost hands back exactly the Geo's Spend⁺. It is non-zero only when the Geo bought
    // no Installs at all — there is then no unit cost to price anything with, and every dollar is a
    // remainder. Rendered as its own row so the Offers footer reconciles to the Geo Total.
    unallocated: Totals;
};

function zeroTotals(): Totals {
    return { spend: 0, spendPlus: 0, revenue: 0, linkClicks: 0, installs: 0, regs: 0, sales: 0 };
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

    // Pass 1 — the Geo's unit cost. Numerator is ALL the Geo's money, including campaigns that bought
    // no Installs at all; denominator is all its Installs. That is what an Install in this market
    // actually cost (ADR-0013).
    let geoSpend = 0;
    let geoSpendPlus = 0;
    let geoInstalls = 0;
    for (const fact of facts) {
        geoSpend += fact.spend;
        geoSpendPlus += fact.spendPlus;
        geoInstalls += fact.installs;
    }
    const unitSpend = geoInstalls > 0 ? geoSpend / geoInstalls : 0;
    const unitSpendPlus = geoInstalls > 0 ? geoSpendPlus / geoInstalls : 0;

    // Pass 2 — the funnel per dimension. Real Keitaro counts, summed; no money touched yet.
    for (const fact of facts) {
        const model = models.get(fact.campaign);
        if (!model) {
            continue;
        }
        for (const [offerId, funnel] of model.offer) {
            const acc = bucket(offerTotals, offerId);
            acc.revenue += funnel.revenue;
            acc.installs += funnel.installs;
            acc.regs += funnel.regs;
            acc.sales += funnel.sales;
            // Offers have no clicks source (KT clicks carries OS, not Offer) — linkClicks stays 0.
            if (funnel.label !== '') {
                offerLabels.set(offerId, funnel.label);
            }
        }
        for (const [os, funnel] of model.os) {
            const label = mobileOs(os);
            if (!label) {
                continue;
            }
            const acc = bucket(osTotals, label);
            acc.revenue += funnel.revenue;
            acc.installs += funnel.installs;
            acc.regs += funnel.regs;
            acc.sales += funnel.sales;
            acc.linkClicks += funnel.linkClicks;
        }
    }

    // Pass 3 — price each row's Installs at the Geo unit cost.
    let offerSpend = 0;
    let offerSpendPlus = 0;
    for (const acc of offerTotals.values()) {
        acc.spend = acc.installs * unitSpend;
        acc.spendPlus = acc.installs * unitSpendPlus;
        offerSpend += acc.spend;
        offerSpendPlus += acc.spendPlus;
    }
    for (const acc of osTotals.values()) {
        acc.spend = acc.installs * unitSpend;
        acc.spendPlus = acc.installs * unitSpendPlus;
    }

    // Offer Installs sum to the Geo's, so pricing them at the Geo rate returns the Geo's Spend⁺ and
    // this is 0 — except when the Geo bought no Installs anywhere, where every dollar is a remainder.
    unallocated.spend = geoSpend - offerSpend;
    unallocated.spendPlus = geoSpendPlus - offerSpendPlus;

    return {
        offers: toRows(offerTotals, offerLabels),
        os: toRows(osTotals, new Map()),
        unallocated,
    };
}
