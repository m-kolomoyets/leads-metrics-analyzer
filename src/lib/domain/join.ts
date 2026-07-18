import type { FbRow, KtClicksRow, KtMainRow, ParsedFiles } from './parse';

// 2 · The Join (doc 02, ADR-0001). Combine the three cleaned sources into one fact table. Joined on
// Campaign ID = Sub ID 2 ALONE — Geo/Account are attributes of the Campaign, never join keys.
//
// Grain note (S1): the fact is emitted at CAMPAIGN grain. FB carries many creatives per campaign
// (470/1099 in the golden set) and KT metrics join only at campaign level, so splitting KT across
// creatives is allocation (doc 06) — deferred to slice 4. Verdicts are per-campaign anyway, so a
// campaign-grain fact aligns exactly with the Verdict Engine. `creative` is the representative FB ad
// name (highest spend); finer OS/Offer/Creative tables arrive with `allocate.ts`.

// Funnel counts + revenue for one campaign or one geo bucket, before Spend⁺/verdict.
export type RawTotals = {
    spend: number;
    revenue: number;
    linkClicks: number;
    installs: number;
    regs: number;
    sales: number;
};

// One joined campaign — the snapshot_fact shape minus the derived Spend⁺/verdict/zone.
export type RawFact = RawTotals & {
    campaign: string;
    creative: string;
    reportDate: string;
    geo: string;
    account: string;
    offer: string;
    os: string | null;
};

export type IntegrityWarning =
    | { kind: 'geo-mismatch'; campaign: string; fbGeo: string; ktGeo: string }
    | { kind: 'account-mismatch'; campaign: string; fbAccount: string; ktAccount: string }
    | { kind: 'campaign-two-geos'; campaign: string; geos: string[] }
    | { kind: 'kt-unmatched'; campaign: string };

export type JoinResult = {
    facts: RawFact[];
    // Untagged/unfired-macro contributions, per Geo. Counted toward the Geo Total, never a Campaign
    // (ADR-0003) — so a Geo Total legitimately diverges from the sum of its attributed campaigns.
    geoUntagged: Map<string, RawTotals>;
    warnings: IntegrityWarning[];
};

function zeroRaw(): RawTotals {
    return { spend: 0, revenue: 0, linkClicks: 0, installs: 0, regs: 0, sales: 0 };
}

// Collapse FB rows to one campaign each: sum spend (colliding rows add, doc 02), keep the first geo,
// account, report window, and track per-creative spend to pick the representative ad name.
type FbAgg = {
    geo: string;
    geos: Set<string>;
    account: string;
    reportStart: string;
    spend: number;
    creativeSpend: Map<string, number>;
};

function aggregateFb(fb: FbRow[]): Map<string, FbAgg> {
    const map = new Map<string, FbAgg>();
    for (const row of fb) {
        let agg = map.get(row.campaign);
        if (!agg) {
            agg = {
                geo: row.geo,
                geos: new Set(),
                account: row.account,
                reportStart: row.reportStart,
                spend: 0,
                creativeSpend: new Map(),
            };
            map.set(row.campaign, agg);
        }
        agg.geos.add(row.geo);
        agg.spend += row.spend;
        agg.creativeSpend.set(row.creative, (agg.creativeSpend.get(row.creative) ?? 0) + row.spend);
    }
    return map;
}

function topCreative(creativeSpend: Map<string, number>): string {
    let best = '';
    let bestSpend = -Infinity;
    for (const [creative, spend] of creativeSpend) {
        if (spend > bestSpend) {
            bestSpend = spend;
            best = creative;
        }
    }
    return best;
}

// Collapse the finer KT main rows (split by Offer × OS) to one campaign each, summing all counts
// (the 1-vs-3 install overwrite bug: sum, never last-wins). Tracks representative offer/os + KT's
// own geo/account for integrity checks.
type KtMainAgg = RawTotals & {
    geo: string | null;
    account: string;
    offerSpend: Map<string, number>;
    osSet: Set<string>;
};

function aggregateKtMain(rows: KtMainRow[]): { byCampaign: Map<string, KtMainAgg>; untagged: Map<string, RawTotals> } {
    const byCampaign = new Map<string, KtMainAgg>();
    const untagged = new Map<string, RawTotals>();
    for (const row of rows) {
        if (row.unfiredMacro) {
            // Campaign attribution lost; salvage the Geo contribution (ADR-0003).
            if (row.geo) {
                const bucket = untagged.get(row.geo) ?? zeroRaw();
                bucket.installs += row.installs;
                bucket.regs += row.regs;
                bucket.sales += row.sales;
                bucket.revenue += row.revenue;
                untagged.set(row.geo, bucket);
            }
            continue;
        }
        let agg = byCampaign.get(row.campaign);
        if (!agg) {
            agg = { ...zeroRaw(), geo: row.geo, account: row.account, offerSpend: new Map(), osSet: new Set() };
            byCampaign.set(row.campaign, agg);
        }
        agg.installs += row.installs;
        agg.regs += row.regs;
        agg.sales += row.sales;
        agg.revenue += row.revenue;
        agg.osSet.add(row.os);
        agg.offerSpend.set(row.offer, (agg.offerSpend.get(row.offer) ?? 0) + row.revenue);
    }
    return { byCampaign, untagged };
}

function aggregateKtClicks(rows: KtClicksRow[]): { byCampaign: Map<string, number>; untagged: Map<string, number> } {
    const byCampaign = new Map<string, number>();
    const untagged = new Map<string, number>();
    for (const row of rows) {
        if (row.unfiredMacro) {
            if (row.geo) {
                untagged.set(row.geo, (untagged.get(row.geo) ?? 0) + row.linkClicks);
            }
            continue;
        }
        byCampaign.set(row.campaign, (byCampaign.get(row.campaign) ?? 0) + row.linkClicks);
    }
    return { byCampaign, untagged };
}

// The most-revenue offer id for a campaign (representative attribute; the Offer allocation table
// rebuilds the full split in slice 4).
function topOffer(offerSpend: Map<string, number>): string {
    let best = '';
    let bestVal = -Infinity;
    for (const [offer, val] of offerSpend) {
        if (val > bestVal) {
            bestVal = val;
            best = offer;
        }
    }
    return best;
}

export function join(parsed: ParsedFiles): JoinResult {
    const fb = aggregateFb(parsed.fb);
    const { byCampaign: ktMain, untagged: untaggedMain } = aggregateKtMain(parsed.ktMain);
    const { byCampaign: ktClicks, untagged: untaggedClicks } = aggregateKtClicks(parsed.ktClicks);

    const warnings: IntegrityWarning[] = [];
    const facts: RawFact[] = [];

    for (const [campaign, agg] of fb) {
        if (agg.geos.size > 1) {
            warnings.push({ kind: 'campaign-two-geos', campaign, geos: [...agg.geos] });
        }
        const main = ktMain.get(campaign);
        const clicks = ktClicks.get(campaign) ?? 0;

        // Integrity: KT's own geo/account disagreeing with FB (authoritative) — surface, never drop.
        if (main) {
            if (main.geo && main.geo !== agg.geo) {
                warnings.push({ kind: 'geo-mismatch', campaign, fbGeo: agg.geo, ktGeo: main.geo });
            }
            if (main.account !== '' && agg.account !== '' && main.account !== agg.account) {
                warnings.push({ kind: 'account-mismatch', campaign, fbAccount: agg.account, ktAccount: main.account });
            }
        }

        const osValues = main ? [...main.osSet] : [];
        facts.push({
            campaign,
            creative: topCreative(agg.creativeSpend),
            reportDate: agg.reportStart,
            geo: agg.geo,
            account: agg.account,
            offer: main ? topOffer(main.offerSpend) : '',
            os: osValues.length === 1 ? osValues[0] : null,
            spend: agg.spend,
            // Absent vs zero (doc 02): an FB campaign with no KT match is zero conversions, not "no data".
            revenue: main?.revenue ?? 0,
            linkClicks: clicks,
            installs: main?.installs ?? 0,
            regs: main?.regs ?? 0,
            sales: main?.sales ?? 0,
        });
    }

    // KT campaigns (tagged) with no FB match: not attributable to any Geo (no FB spend/geo). Surface.
    for (const campaign of ktMain.keys()) {
        if (!fb.has(campaign)) {
            warnings.push({ kind: 'kt-unmatched', campaign });
        }
    }

    // Merge the two untagged sources into one per-Geo bucket.
    const geoUntagged = new Map<string, RawTotals>();
    for (const [geo, totals] of untaggedMain) {
        geoUntagged.set(geo, { ...totals });
    }
    for (const [geo, linkClicks] of untaggedClicks) {
        const bucket = geoUntagged.get(geo) ?? zeroRaw();
        bucket.linkClicks += linkClicks;
        geoUntagged.set(geo, bucket);
    }

    return { facts, geoUntagged, warnings };
}
