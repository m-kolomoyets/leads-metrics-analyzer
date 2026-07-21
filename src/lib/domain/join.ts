import type { FbRow, KtClicksRow, KtMainRow, ParsedFiles } from './parse';
import type { Attribution } from './types';

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
    attribution: Attribution;
    campaign: string;
    creative: string;
    reportDate: string;
    geo: string;
    account: string;
    offer: string;
    os: string | null;
};

// One dimension value's raw funnel within a campaign — installs/regs/sales/revenue from KT main;
// linkClicks only for OS (KT clicks has no Offer). The allocation table (doc 06) sums these to Geo
// and splits the campaign's real Spend⁺ across them in proportion to installs.
export type ModelFunnel = {
    installs: number;
    regs: number;
    sales: number;
    revenue: number;
    linkClicks: number;
};

// A campaign's Offer/OS breakdown, kept out of the (persisted) Fact — allocation input only.
export type CampaignModel = {
    // Offer ID → its funnel + a display label parsed from the pipe string (doc 06 offer identity).
    offer: Map<string, ModelFunnel & { label: string }>;
    // OS value → its funnel; linkClicks merged in from the KT clicks report.
    os: Map<string, ModelFunnel>;
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
    // Per-campaign Offer/OS funnel breakdown (doc 06). Keyed by campaign id; only tagged campaigns.
    campaignModels: Map<string, CampaignModel>;
    // Per-campaign FB creative breakdown (#35): raw ad name → its real Spend + Impressions. FB is the
    // only per-creative source; the funnel is allocated across these by Spend share in `creatives.ts`.
    campaignCreatives: Map<string, CampaignCreatives>;
    warnings: IntegrityWarning[];
};

// One campaign's real per-creative Spend + Impressions, keyed by raw FB ad name (parsed to a creative
// key downstream). Real FB numbers — never allocated.
export type CampaignCreatives = Map<string, { spend: number; impressions: number }>;

function zeroRaw(): RawTotals {
    return { spend: 0, revenue: 0, linkClicks: 0, installs: 0, regs: 0, sales: 0 };
}

// These campaigns buy mobile app installs and nothing else, so the OS tables only ever report
// Android and iOS. Every other value (desktop, unknown, empty) is not traffic anyone here paid for.
export function mobileOs(os: string): 'Android' | 'iOS' | null {
    const value = os.trim().toLowerCase();
    if (value.startsWith('android')) {
        return 'Android';
    }
    return value.startsWith('ios') ? 'iOS' : null;
}

function zeroFunnel(): ModelFunnel {
    return { installs: 0, regs: 0, sales: 0, revenue: 0, linkClicks: 0 };
}

// Display label from the pipe-delimited Offer string: the first 6 meaningful blocks (doc 06 mirrors
// the prototype), tolerating absence — empty string when the source carries no name.
function offerLabel(offerName: string): string {
    return offerName
        .split('|')
        .map((block) => {
            return block.trim();
        })
        .filter((block) => {
            return block !== '';
        })
        .slice(0, 6)
        .join(' | ');
}

// Collapse FB rows to one campaign each: sum spend (colliding rows add, doc 02), keep the first geo,
// account, report window, and track per-creative spend to pick the representative ad name.
type FbAgg = {
    geo: string;
    geos: Set<string>;
    account: string;
    reportStart: string;
    spend: number;
    // Raw ad name → real Spend + Impressions (the per-creative source; #35 allocates the funnel over it).
    creatives: CampaignCreatives;
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
                creatives: new Map(),
            };
            map.set(row.campaign, agg);
        }
        agg.geos.add(row.geo);
        agg.spend += row.spend;
        const creative = agg.creatives.get(row.creative) ?? { spend: 0, impressions: 0 };
        creative.spend += row.spend;
        creative.impressions += row.impressions;
        agg.creatives.set(row.creative, creative);
    }
    return map;
}

function topCreative(creatives: CampaignCreatives): string {
    let best = '';
    let bestSpend = -Infinity;
    for (const [creative, { spend }] of creatives) {
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
    // Keitaro's own `Sub ID 5`. Only read for Unfired-Macro rows, where it is the sole creative
    // source — for joined campaigns Facebook is authoritative and this is ignored.
    creative: string;
    offerSpend: Map<string, number>;
    osSet: Set<string>;
    // The Offer/OS funnel split within this campaign — allocation input (doc 06).
    model: CampaignModel;
};

// Add one KT-main row's counts to a dimension bucket (offer or os) inside a campaign's model.
function addFunnel(funnel: ModelFunnel, row: KtMainRow): void {
    funnel.installs += row.installs;
    funnel.regs += row.regs;
    funnel.sales += row.sales;
    funnel.revenue += row.revenue;
}

// The synthetic campaign id standing in for an Unfired-Macro row's lost `Sub ID 2` (ADR-0012). Keyed
// per (Geo, Account, Creative) — the three dimensions the row still knows — so the fact it produces
// lands in exactly the right Account and Creative bucket. The `⟨⟩` brackets cannot occur in a real
// Facebook campaign id (digits only), so a synthetic key can never collide with a joined one.
function unfiredKey(geo: string, account: string, creative: string): string {
    return `⟨unfired⟩|${geo}|${account}|${creative}`;
}

function aggregateKtMain(rows: KtMainRow[]): {
    byCampaign: Map<string, KtMainAgg>;
    // Unfired-Macro aggregates, under synthetic campaign ids. Same shape as a joined campaign —
    // they just never match an FB row, so they carry no Spend.
    unfired: Map<string, KtMainAgg>;
    untagged: Map<string, RawTotals>;
} {
    const byCampaign = new Map<string, KtMainAgg>();
    const unfired = new Map<string, KtMainAgg>();
    const untagged = new Map<string, RawTotals>();
    for (const row of rows) {
        // An Unfired-Macro row that also lost `Sub ID 4` and `Sub ID 5` knows nothing but its Geo —
        // Facebook fails macros per column, so this happens. It is Untagged in everything but name.
        const nothingLeft = row.unfiredMacro && row.account === '' && row.creative === '';
        if (row.untagged || nothingLeft) {
            // Every Sub ID empty: no Account, no Creative, no Campaign. Geo Total only (ADR-0003).
            // Desktop untagged rows are dropped outright, not merely left unattributed: these
            // campaigns buy mobile installs, so a Windows or OS X install provably did not come from
            // the Spend under analysis. Counting it would inflate the Geo's Installs and depress its
            // CPI against money that never bought it (observed: KR 69 → 88, CPI 15.33 → 12.03).
            if (row.geo && mobileOs(row.os)) {
                const bucket = untagged.get(row.geo) ?? zeroRaw();
                bucket.installs += row.installs;
                bucket.regs += row.regs;
                bucket.sales += row.sales;
                bucket.revenue += row.revenue;
                untagged.set(row.geo, bucket);
            }
            continue;
        }
        // Unfired-Macro rows keep Account/Creative/Offer/OS/Geo — only the Campaign is gone. Route
        // them through the very same aggregation as a joined campaign, under a synthetic id, so every
        // downstream table (Account, Creative, Offer, OS, Geo) sees them (ADR-0012). A row with no
        // resolvable Geo has nowhere to land at all and is dropped.
        const target = row.unfiredMacro ? unfired : byCampaign;
        if (row.unfiredMacro && !row.geo) {
            continue;
        }
        const key = row.unfiredMacro ? unfiredKey(row.geo ?? '', row.account, row.creative) : row.campaign;
        let agg = target.get(key);
        if (!agg) {
            agg = {
                ...zeroRaw(),
                geo: row.geo,
                account: row.account,
                creative: row.creative,
                offerSpend: new Map(),
                osSet: new Set(),
                model: { offer: new Map(), os: new Map() },
            };
            target.set(key, agg);
        }
        agg.installs += row.installs;
        agg.regs += row.regs;
        agg.sales += row.sales;
        agg.revenue += row.revenue;
        agg.osSet.add(row.os);
        agg.offerSpend.set(row.offer, (agg.offerSpend.get(row.offer) ?? 0) + row.revenue);

        let offer = agg.model.offer.get(row.offer);
        if (!offer) {
            offer = { ...zeroFunnel(), label: offerLabel(row.offerName) };
            agg.model.offer.set(row.offer, offer);
        }
        addFunnel(offer, row);
        let os = agg.model.os.get(row.os);
        if (!os) {
            os = zeroFunnel();
            agg.model.os.set(row.os, os);
        }
        addFunnel(os, row);
    }
    return { byCampaign, unfired, untagged };
}

function aggregateKtClicks(rows: KtClicksRow[]): {
    byCampaign: Map<string, number>;
    // Per-(campaign, OS) clicks — the OS allocation table's only clicks source (doc 06).
    byCampaignOs: Map<string, Map<string, number>>;
    untagged: Map<string, number>;
} {
    const byCampaign = new Map<string, number>();
    const byCampaignOs = new Map<string, Map<string, number>>();
    const untagged = new Map<string, number>();
    for (const row of rows) {
        if (row.untagged || (row.unfiredMacro && row.account === '' && row.creative === '')) {
            // No usable Sub IDs at all — Geo Total only. (The clicks report has no OS column, so the
            // mobile gate the main report applies cannot be applied here.)
            if (row.geo) {
                untagged.set(row.geo, (untagged.get(row.geo) ?? 0) + row.linkClicks);
            }
            continue;
        }
        if (row.unfiredMacro && !row.geo) {
            continue;
        }
        // Unfired-Macro clicks key on the same synthetic id the main report built, so they land on
        // the matching fact instead of being written off as a Geo remainder (ADR-0012).
        const key = row.unfiredMacro ? unfiredKey(row.geo ?? '', row.account, row.creative) : row.campaign;
        byCampaign.set(key, (byCampaign.get(key) ?? 0) + row.linkClicks);
        // Empty OS rows carry no dimension; skip (the OS table has no empty-OS row, doc 06).
        if (row.os !== '') {
            const perOs = byCampaignOs.get(key) ?? new Map<string, number>();
            perOs.set(row.os, (perOs.get(row.os) ?? 0) + row.linkClicks);
            byCampaignOs.set(key, perOs);
        }
    }
    return { byCampaign, byCampaignOs, untagged };
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
    const { byCampaign: ktMain, unfired: ktUnfired, untagged: untaggedMain } = aggregateKtMain(parsed.ktMain);
    const {
        byCampaign: ktClicks,
        byCampaignOs: ktClicksByOs,
        untagged: untaggedClicks,
    } = aggregateKtClicks(parsed.ktClicks);

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
            attribution: 'full',
            campaign,
            creative: topCreative(agg.creatives),
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

    // Unfired-Macro facts. No FB row exists to join, so Spend is 0 and stays 0 — the money these
    // rows produced was already paid under some campaign we cannot name, and inventing a share of it
    // here would double-count it (ADR-0012). Everything else is real and directly attributed.
    const reportDate = facts[0]?.reportDate ?? '';
    for (const [key, agg] of ktUnfired) {
        const osValues = [...agg.osSet];
        facts.push({
            attribution: 'campaign-lost',
            campaign: key,
            creative: agg.creative,
            reportDate,
            geo: agg.geo ?? '',
            account: agg.account,
            offer: topOffer(agg.offerSpend),
            os: osValues.length === 1 ? osValues[0] : null,
            spend: 0,
            revenue: agg.revenue,
            linkClicks: ktClicks.get(key) ?? 0,
            installs: agg.installs,
            regs: agg.regs,
            sales: agg.sales,
        });
    }

    // KT campaigns (tagged) with no FB match: not attributable to any Geo (no FB spend/geo). Surface.
    for (const campaign of ktMain.keys()) {
        if (!fb.has(campaign)) {
            warnings.push({ kind: 'kt-unmatched', campaign });
        }
    }

    // Assemble the per-campaign Offer/OS models: KT-main funnels + KT-clicks OS clicks. Only
    // campaigns that joined to FB (attributed) — the allocation table lives below the join.
    // Unfired-Macro aggregates join here too: their Offer/OS split is as real as any campaign's, and
    // an allocation over zero Spend simply contributes funnel without contributing money (ADR-0012).
    const campaignModels = new Map<string, CampaignModel>();
    for (const [campaign, agg] of [...ktMain, ...ktUnfired]) {
        if (!ktUnfired.has(campaign) && !fb.has(campaign)) {
            continue;
        }
        const perOs = ktClicksByOs.get(campaign);
        if (perOs) {
            for (const [os, clicks] of perOs) {
                const funnel = agg.model.os.get(os) ?? zeroFunnel();
                funnel.linkClicks += clicks;
                agg.model.os.set(os, funnel);
            }
        }
        campaignModels.set(campaign, agg.model);
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

    // Per-campaign FB creative Spend/Impressions (#35). Straight from the FB agg — every attributed
    // campaign, keyed by id; the funnel gets allocated over these downstream.
    const campaignCreatives = new Map<string, CampaignCreatives>();
    for (const [campaign, agg] of fb) {
        campaignCreatives.set(campaign, agg.creatives);
    }
    // An Unfired-Macro fact names its creative outright (`Sub ID 5`), so there is nothing to split —
    // it gets a single-creative breakdown with no Spend and no Impressions (Facebook never reported
    // either for it). `creativesFor` reads the lone entry as a 100% share.
    for (const [campaign, agg] of ktUnfired) {
        campaignCreatives.set(campaign, new Map([[agg.creative, { spend: 0, impressions: 0 }]]));
    }

    return { facts, geoUntagged, campaignModels, campaignCreatives, warnings };
}
