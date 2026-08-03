import type { AnalyzeResult } from './index';
import type { CampaignCreatives, CampaignModel, ModelFunnel } from './join';
import type { Fact, Ruleset, Totals } from './types';
import { rollUp } from './rollup';

// The second entry into the compute layer (ADR-0015, ADR-0016): a stored Snapshot in, the same
// `AnalyzeResult` the Analyze screen renders out. It shares `rollUp` verbatim with `analyzeParsed` —
// only the join half differs, because a Snapshot's Facts are already joined and already graded.
//
// What a Snapshot froze is used as frozen: the Facts keep the Verdicts the buyer's Ruleset Version
// gave them, and the Geo Total comes off the Frozen Geo Rollup. Everything else — Offers, OS,
// Creatives, account totals, Problem Accounts — is recomputed here, so a later fix to allocation or
// grading shows up in old reports instead of silently disagreeing with a frozen copy.

// One Geo's frozen header line, exactly as it was saved (`snapshot_geo`). Its reason for existing is
// the Geo Total: revenue AND funnel counts from untagged rows, which never become Facts and cannot be
// rebuilt from one (ADR-0003).
export type FrozenGeoRollup = {
    geo: string;
    spendPlus: number;
    // Revenue INCLUDING untagged — the Geo Total.
    geoTotal: number;
    // Revenue from matched campaigns only.
    attributedRevenue: number;
    // The Geo Total's funnel, untagged rows included. Zero on a rollup written before #54, which
    // froze the money but not the counts.
    linkClicks: number;
    installs: number;
    regs: number;
    sales: number;
    profit: number;
    roi: number | null;
    cpc: number | null;
    cpi: number | null;
    cpr: number | null;
    cps: number | null;
    waste: number;
};

// One Creative Split row: real Facebook Spend + Impressions for a single ad name, below the Fact Grain.
export type SnapshotCreativeSplit = {
    campaign: string;
    adName: string;
    spend: number;
    impressions: number;
};

// One Campaign Model row: an Offer or OS value's funnel inside a campaign. No Spend — Facebook never
// measured it, so the Offers/OS tables impute it at the Geo unit cost on read (ADR-0013).
export type SnapshotModelRow = ModelFunnel & {
    campaign: string;
    dimension: 'offer' | 'os';
    key: string;
    label: string;
};

// Everything a report is rebuilt from. Facts are already graded; the other three are the sub-grain
// inputs a report's tables allocate over, plus the one figure that cannot be derived at all.
export type SnapshotBundle = {
    facts: Fact[];
    creatives: SnapshotCreativeSplit[];
    campaignModels: SnapshotModelRow[];
    // One entry per Geo the Snapshot froze. A Geo with no entry — every Geo of a Snapshot pushed
    // before ADR-0015 — has no knowable Geo Total, Profit, ROI or Waste.
    geoRollups: FrozenGeoRollup[];
};

// The Geo Total as a `Totals`, read straight off the frozen line. Spend is the only field taken from
// the Facts: untagged rows carry no Facebook spend by construction (ADR-0003), so a Geo's Spend is
// its Attributed Spend and freezing it again would only invite the two to disagree.
function geoTotalFrom(frozen: FrozenGeoRollup, attributed: Totals): Totals {
    return {
        spend: attributed.spend,
        spendPlus: frozen.spendPlus,
        revenue: frozen.geoTotal,
        linkClicks: frozen.linkClicks,
        installs: frozen.installs,
        regs: frozen.regs,
        sales: frozen.sales,
    };
}

// Rebuild the per-campaign FB creative breakdown. Storage keys these rows by (Geo, Campaign, ad name)
// while the compute layer keys them by Campaign alone, so the two Geos of a campaign that somehow
// straddles a border are summed back together rather than one silently winning.
function creativesFrom(rows: SnapshotCreativeSplit[]): Map<string, CampaignCreatives> {
    const byCampaign = new Map<string, CampaignCreatives>();
    for (const row of rows) {
        const creatives = byCampaign.get(row.campaign) ?? new Map();
        const current = creatives.get(row.adName) ?? { spend: 0, impressions: 0 };
        creatives.set(row.adName, {
            spend: current.spend + row.spend,
            impressions: current.impressions + row.impressions,
        });
        byCampaign.set(row.campaign, creatives);
    }
    return byCampaign;
}

function funnelFrom(row: SnapshotModelRow): ModelFunnel {
    return {
        installs: row.installs,
        regs: row.regs,
        sales: row.sales,
        revenue: row.revenue,
        linkClicks: row.linkClicks,
    };
}

// Rebuild the per-campaign Offer/OS models the allocation runs over (doc 06).
function modelsFrom(rows: SnapshotModelRow[]): Map<string, CampaignModel> {
    const byCampaign = new Map<string, CampaignModel>();
    for (const row of rows) {
        const model = byCampaign.get(row.campaign) ?? { offer: new Map(), os: new Map() };
        if (row.dimension === 'offer') {
            model.offer.set(row.key, { ...funnelFrom(row), label: row.label });
        } else {
            model.os.set(row.key, funnelFrom(row));
        }
        byCampaign.set(row.campaign, model);
    }
    return byCampaign;
}

// Rebuild a report from a stored Snapshot. `ruleset` is the one the Snapshot itself pinned — its
// copied thresholds and shared settings — so the tables are graded by the buyer's judgement, never
// the reader's (spec story 32).
export function analyzeSnapshot(bundle: SnapshotBundle, ruleset: Ruleset): AnalyzeResult {
    const campaignCreatives = creativesFrom(bundle.creatives);
    const campaignModels = modelsFrom(bundle.campaignModels);

    const frozenByGeo = new Map(
        bundle.geoRollups.map((rollup) => {
            return [rollup.geo, rollup] as const;
        })
    );

    const { geos, problemAccounts } = rollUp(
        {
            facts: bundle.facts,
            geoTotalFor(geo, attributed) {
                const frozen = frozenByGeo.get(geo);
                // No frozen line: the Untagged Revenue is gone for good, and an Attributed sum must
                // never stand in for a Geo Total (ADR-0015). Null propagates to `GeoRollup.total`.
                return frozen ? geoTotalFrom(frozen, attributed) : null;
            },
            geoWaste: new Map(
                bundle.geoRollups.map((rollup) => {
                    return [rollup.geo, rollup.waste] as const;
                })
            ),
            campaignModels,
        },
        ruleset
    );

    return {
        // Frozen as saved: re-grading here would replace the buyer's Verdicts with a re-run of them.
        facts: bundle.facts,
        geos,
        campaignCreatives,
        campaignModels,
        problemAccounts,
        // Deliberately empty rather than recomputed. A Snapshot freezes the RESOLVED default rate, not
        // the Seller map behind it, and every Fact's Spend⁺ was already priced at save — so running
        // the detector here would read an empty Seller map as "nobody claims anything" and flag every
        // account in the report. Unclaimed accounts are an ingest-time warning about the ruleset being
        // edited now, and have nothing to say about history.
        unclaimedAccounts: [],
        // A Snapshot is joined and parsed history — there is no file to warn about.
        warnings: [],
        parseWarnings: [],
    };
}
