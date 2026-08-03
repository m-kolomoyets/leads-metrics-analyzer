import type { SnapshotBundle } from '@/lib/domain/snapshot';
import type { Attribution, Fact, GeoThresholds, Ruleset } from '@/lib/domain/types';
import type { FactAttribution } from './schemas';
import type { SnapshotBundleView } from './types';

// The one boundary between a stored Snapshot and the pure compute layer (ADR-0010): wire shapes in,
// a `SnapshotBundle` + the `Ruleset` the Snapshot itself pinned out. Nothing is re-derived here — the
// mapper only renames and rescales, so a report is graded by the buyer's judgement (spec story 32).

// The DB enum spells a lost attribution `campaign_lost`; the compute layer spells it `campaign-lost`.
// The save planner maps one way at this same boundary (`toSnapshot.ts`), this maps back.
const ATTRIBUTION: Record<FactAttribution, Attribution> = { full: 'full', campaign_lost: 'campaign-lost' };

// When a Snapshot froze no shared settings — every Snapshot pushed before ADR-0015. A multiplier of 1
// disables Problem-Account escalation, matching `toRuleset`'s live default. The commission is carried
// for completeness only: a rebuilt report never re-prices anything, because every Fact already
// carries the Spend⁺ its rate produced at save.
const DEFAULT_COMMISSION = 0;
const DEFAULT_REVIEW_MULTIPLIER = 1;

export function bundleFromSnapshot(view: SnapshotBundleView): { bundle: SnapshotBundle; ruleset: Ruleset } {
    const thresholds: Record<string, GeoThresholds> = {};
    for (const geo of view.geos) {
        // A Geo whose Preset carried no parseable thresholds saved a null — its rows grade neutral,
        // exactly as they did on the buyer's screen.
        if (geo.thresholds) {
            thresholds[geo.geo] = geo.thresholds;
        }
    }

    const facts: Fact[] = view.facts.map((fact): Fact => {
        return {
            attribution: ATTRIBUTION[fact.attribution],
            campaign: fact.campaign,
            creative: fact.creative,
            reportDate: fact.reportDate,
            geo: fact.geo,
            account: fact.account,
            offer: fact.offer,
            os: fact.os,
            spend: fact.spend,
            spendPlus: fact.spendPlus,
            revenue: fact.revenue,
            linkClicks: fact.linkClicks,
            installs: fact.installs,
            regs: fact.regs,
            sales: fact.sales,
            verdict: fact.verdict,
            zone: fact.zone,
        };
    });

    return {
        bundle: {
            facts,
            creatives: view.creatives.map((creative) => {
                return {
                    campaign: creative.campaign,
                    adName: creative.adName,
                    spend: creative.spend,
                    impressions: creative.impressions,
                };
            }),
            campaignModels: view.campaignModels.map((model) => {
                return {
                    campaign: model.campaign,
                    dimension: model.dimension,
                    key: model.key,
                    label: model.label,
                    revenue: model.revenue,
                    linkClicks: model.linkClicks,
                    installs: model.installs,
                    regs: model.regs,
                    sales: model.sales,
                };
            }),
            geoRollups: view.geoRollups,
        },
        ruleset: {
            thresholds,
            commission: {
                // Persistence stores commission as a percent (7 = 7 %); the domain wants a fraction.
                defaultCommission: (view.settings?.defaultCommission ?? DEFAULT_COMMISSION) / 100,
                // A Snapshot freezes the resolved default rate, not the Seller map that produced it.
                // `analyzeSnapshot` reports no unclaimed accounts for exactly this reason.
                sellers: [],
            },
            reviewMultiplier: view.settings?.reviewMultiplier ?? DEFAULT_REVIEW_MULTIPLIER,
        },
    };
}
