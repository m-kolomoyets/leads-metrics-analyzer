import type { GeoRollup, Ruleset } from '@/lib/domain';
import type { CampaignCreatives, CampaignModel, ModelFunnel } from '@/lib/domain/join';
import type { Attribution, Fact, GeoThresholds } from '@/lib/domain/types';
import type { PresetView, SharedSettingsView } from '@/services/presets/types';
import type { CreateSnapshotInput, FactAttribution } from '@/services/snapshots/schemas';
import { accountsFor } from '@/lib/domain/accounts';
import { presetForGeo } from './presetForGeo';

// The Save-as-Snapshot planner (S5, #25). A Snapshot pins the exact ruleset that produced the numbers
// on screen: each analyzed Geo's ACTIVE preset version plus the active shared-settings version
// (ADR-0002). Assembled here rather than in the component so the pinning rule and the fact map are
// testable, and so "saved facts equal the on-screen facts" is a property, not a hope.
//
// S2a (#53, ADR-0015) widened it: a Snapshot must also carry what its report ALLOCATES over. The
// Creative, Offers and OS tables are allocations whose inputs sit below the Fact Grain, and the Geo
// Total counts Untagged Revenue that never becomes a Fact at all. So the plan now freezes the per-Geo
// rollup, the Creative Splits, the Campaign Models and a copy of the resolved thresholds — every one
// of them taken verbatim from the values on screen, never re-derived here.

// A calendar date as the `date` column (and the API schema) wants it.
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// The API requires a non-empty campaign/creative/offer. A parsed row can carry none (an Ad with no
// name, a Keitaro row with no Offer ID); we keep the fact — its money is real — under the same dash
// the tables render, rather than dropping money out of a report to satisfy a `min(1)`.
const UNKNOWN = '—';

// The compute layer spells a lost attribution `campaign-lost`; the wire and the DB enum spell it
// `campaign_lost`. This is the one boundary where they meet — the value is carried, never re-derived
// from the `—` placeholder the tables render (ADR-0015).
const ATTRIBUTION: Record<Attribution, FactAttribution> = { full: 'full', 'campaign-lost': 'campaign_lost' };

type PlanParams = {
    // Every graded fact, all geos (`AnalyzeResult.facts`).
    facts: Fact[];
    // The analyzed geos, in tab order (`AnalyzeResult.geos`).
    geos: string[];
    // The per-Geo roll-ups exactly as `GeoStat` renders them (`AnalyzeResult.geos`), including the
    // Geo Total's untagged revenue. Frozen field-for-field: this is the half of a report that cannot
    // be rebuilt from Facts.
    rollups: GeoRollup[];
    // The sub-grain allocation inputs (`AnalyzeResult.campaignCreatives` / `.campaignModels`).
    campaignCreatives: Map<string, CampaignCreatives>;
    campaignModels: Map<string, CampaignModel>;
    // The ruleset the numbers were graded with — supplies the Waste's review multiplier and the
    // per-Geo threshold fallback, so the copy that is frozen is the one that actually graded.
    ruleset: Ruleset;
    presets: PresetView[];
    shared: SharedSettingsView | null;
    // The owner's preset pick per Geo — the same map that drives grading, so the pinned version is
    // the one the verdicts ran against.
    selectedPresetByGeo: Record<string, string>;
    // Muted campaigns, keyed `${geo}:${campaign}`.
    excluded: ReadonlySet<string>;
    // The report day picked at save.
    reportDate: string;
};

export type SnapshotPlan =
    | { ok: true; input: CreateSnapshotInput }
    // Why the save is blocked: geos whose ruleset is not saved yet (pinning one and skipping another
    // would freeze a ruleset that never graded anything — refused outright), how many facts survived
    // the mute, and whether the picked report day is a calendar date at all (the field can be cleared).
    | { ok: false; unpinnedGeos: string[]; factCount: number; validDate: boolean };

// The report day to offer at save: the latest calendar date the facts carry, else today.
export function defaultReportDate(facts: Fact[], today: string): string {
    const dates = facts
        .map((fact) => {
            return fact.reportDate;
        })
        .filter((date) => {
            return ISO_DATE.test(date);
        })
        .sort();
    return dates.at(-1) ?? today;
}

function label(value: string): string {
    const trimmed = value.trim();
    return trimmed === '' ? UNKNOWN : trimmed;
}

// A Campaign Model row's funnel, field-for-field. No Spend: Facebook never measured Offer or OS
// spend, and imputing it is the read path's job (ADR-0013).
function counts(funnel: ModelFunnel): Pick<ModelFunnel, 'revenue' | 'linkClicks' | 'installs' | 'regs' | 'sales'> {
    return {
        revenue: funnel.revenue,
        linkClicks: funnel.linkClicks,
        installs: funnel.installs,
        regs: funnel.regs,
        sales: funnel.sales,
    };
}

export function planSnapshot(params: PlanParams): SnapshotPlan {
    const {
        facts,
        geos,
        rollups,
        campaignCreatives,
        campaignModels,
        ruleset,
        presets,
        shared,
        selectedPresetByGeo,
        excluded,
        reportDate,
    } = params;

    // The very thresholds a Geo graded against: the focused preset's, else the ruleset's first-wins
    // pick — the same resolution the analyzer's header and tables use.
    const thresholdsFor = (geo: string): GeoThresholds | null => {
        return presetForGeo(presets, geo, selectedPresetByGeo[geo])?.thresholds ?? ruleset.thresholds[geo] ?? null;
    };

    const pinned: CreateSnapshotInput['geos'] = [];
    const unpinnedGeos: string[] = [];
    for (const geo of geos) {
        const versionId = presetForGeo(presets, geo, selectedPresetByGeo[geo])?.activeVersionId;
        if (versionId) {
            // The version id is provenance; the thresholds beside it are the grading itself, copied so
            // that deleting the Preset cannot turn a saved judgement neutral (ADR-0015).
            pinned.push({ geo, presetVersionId: versionId, thresholds: thresholdsFor(geo) });
        } else {
            unpinnedGeos.push(geo);
        }
    }

    const pinnedGeos = new Set(
        pinned.map((entry) => {
            return entry.geo;
        })
    );
    const included = facts.filter((fact) => {
        return pinnedGeos.has(fact.geo) && !excluded.has(`${fact.geo}:${fact.campaign}`);
    });
    // Straight from the computed shape: same field names, same values, no re-derivation.
    const rows = included.map((fact) => {
        return {
            attribution: ATTRIBUTION[fact.attribution],
            campaign: label(fact.campaign),
            creative: label(fact.creative),
            // A fact's own day when the export carried one; the picked day otherwise.
            reportDate: ISO_DATE.test(fact.reportDate) ? fact.reportDate : reportDate,
            geo: fact.geo,
            account: label(fact.account),
            offer: label(fact.offer),
            os: fact.os?.trim() || null,
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

    const validDate = ISO_DATE.test(reportDate);

    if (unpinnedGeos.length > 0 || rows.length === 0 || !validDate) {
        return { ok: false, unpinnedGeos, factCount: rows.length, validDate };
    }

    const excludedCampaigns = [...excluded].sort();

    // The Frozen Geo Rollup, per pinned Geo. Every figure is read off the roll-up `GeoStat` renders,
    // so the stored line and the screen cannot disagree — `geoTotal` above all, since it counts the
    // Untagged Revenue no Fact carries (ADR-0003). Waste is recomputed here only because the analyzer
    // computes it for the geo on screen and a save covers all of them; it uses the same inputs the
    // active tab does — all the Geo's facts, the same mute set, the same thresholds (ADR-0014).
    const geoRollups: CreateSnapshotInput['geoRollups'] = [];
    for (const { geo } of pinned) {
        const rollup = rollups.find((entry) => {
            return entry.geo === geo;
        });
        if (!rollup) {
            continue;
        }
        const geoFacts = facts.filter((fact) => {
            return fact.geo === geo;
        });
        const excludedInGeo = new Set(
            geoFacts
                .filter((fact) => {
                    return excluded.has(`${geo}:${fact.campaign}`);
                })
                .map((fact) => {
                    return fact.campaign;
                })
        );
        const waste = accountsFor(
            geoFacts,
            thresholdsFor(geo) ?? undefined,
            ruleset.reviewMultiplier,
            excludedInGeo
        ).reduce((sum, account) => {
            return sum + account.waste;
        }, 0);
        const { metrics, attributed } = rollup;
        geoRollups.push({
            geo,
            spendPlus: metrics.spendPlus,
            geoTotal: metrics.revenue,
            attributedRevenue: attributed.revenue,
            // The Geo Total's funnel — untagged installs and clicks are as underivable from Facts as
            // untagged revenue is (ADR-0003), so they are frozen beside it rather than left to be
            // guessed back out of the cost-per line.
            linkClicks: metrics.linkClicks,
            installs: metrics.installs,
            regs: metrics.regs,
            sales: metrics.sales,
            profit: metrics.profit,
            roi: metrics.roi,
            cpc: metrics.cpc,
            cpi: metrics.cpi,
            cpr: metrics.cpr,
            cps: metrics.cps,
            waste,
        });
    }

    // Creative Splits and Campaign Models, for the campaigns that survived the mute. Both are keyed by
    // the campaign the Fact rows carry, so the report can rejoin them; both are written once per
    // campaign, since the maps aggregate across the days a campaign ran.
    const creatives: CreateSnapshotInput['creatives'] = [];
    const models: CreateSnapshotInput['campaignModels'] = [];
    const seenCampaigns = new Set<string>();
    for (const fact of included) {
        if (seenCampaigns.has(fact.campaign)) {
            continue;
        }
        seenCampaigns.add(fact.campaign);
        const campaign = label(fact.campaign);

        for (const [adName, real] of campaignCreatives.get(fact.campaign) ?? []) {
            creatives.push({
                geo: fact.geo,
                campaign,
                adName: label(adName),
                spend: real.spend,
                impressions: real.impressions,
            });
        }

        const model = campaignModels.get(fact.campaign);
        for (const [key, funnel] of model?.offer ?? []) {
            models.push({
                campaign,
                dimension: 'offer',
                key: label(key),
                label: label(funnel.label),
                ...counts(funnel),
            });
        }
        for (const [key, funnel] of model?.os ?? []) {
            // An OS value is its own label — there is nothing to parse and nothing prettier to show.
            models.push({ campaign, dimension: 'os', key: label(key), label: label(key), ...counts(funnel) });
        }
    }

    return {
        ok: true,
        input: {
            reportDate,
            sharedSettingsVersionId: shared?.activeVersionId ?? null,
            // The resolved shared settings, copied beside their version id for the same reason the
            // thresholds are: a pruned version must not be able to change a saved judgement.
            settings: shared?.payload
                ? {
                      reviewMultiplier: shared.payload.reviewMultiplier,
                      defaultCommission: shared.payload.defaultCommission,
                      wasteZones: shared.payload.wasteZones,
                  }
                : null,
            geos: pinned,
            facts: rows,
            geoRollups,
            creatives,
            campaignModels: models,
            // The mutes are not recoverable from the facts (a muted campaign simply is not there), so
            // the audit trail keeps them.
            meta: excludedCampaigns.length > 0 ? { excludedCampaigns } : undefined,
        },
    };
}
