import type { Fact } from '@/lib/domain/types';
import type { PresetView, SharedSettingsView } from '@/services/presets/types';
import type { CreateSnapshotInput } from '@/services/snapshots/schemas';
import { presetForGeo } from './presetForGeo';

// The Save-as-Snapshot planner (S5, #25). A Snapshot pins the exact ruleset that produced the numbers
// on screen: each analyzed Geo's ACTIVE preset version plus the active shared-settings version
// (ADR-0002). Assembled here rather than in the component so the pinning rule and the fact map are
// testable, and so "saved facts equal the on-screen facts" is a property, not a hope.

// A calendar date as the `date` column (and the API schema) wants it.
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// The API requires a non-empty campaign/creative/offer. A parsed row can carry none (an Ad with no
// name, a Keitaro row with no Offer ID); we keep the fact — its money is real — under the same dash
// the tables render, rather than dropping money out of a report to satisfy a `min(1)`.
const UNKNOWN = '—';

type PlanParams = {
    // Every graded fact, all geos (`AnalyzeResult.facts`).
    facts: Fact[];
    // The analyzed geos, in tab order (`AnalyzeResult.geos`).
    geos: string[];
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

export function planSnapshot(params: PlanParams): SnapshotPlan {
    const { facts, geos, presets, shared, selectedPresetByGeo, excluded, reportDate } = params;

    const pinned: CreateSnapshotInput['geos'] = [];
    const unpinnedGeos: string[] = [];
    for (const geo of geos) {
        const versionId = presetForGeo(presets, geo, selectedPresetByGeo[geo])?.activeVersionId;
        if (versionId) {
            pinned.push({ geo, presetVersionId: versionId });
        } else {
            unpinnedGeos.push(geo);
        }
    }

    const pinnedGeos = new Set(
        pinned.map((entry) => {
            return entry.geo;
        })
    );
    // Straight from the computed shape: same field names, same values, no re-derivation. Only
    // `attribution` is dropped — a compute-layer concern the frozen row has no column for.
    const rows = facts
        .filter((fact) => {
            return pinnedGeos.has(fact.geo) && !excluded.has(`${fact.geo}:${fact.campaign}`);
        })
        .map((fact) => {
            return {
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

    return {
        ok: true,
        input: {
            reportDate,
            sharedSettingsVersionId: shared?.activeVersionId ?? null,
            geos: pinned,
            facts: rows,
            // The mutes are not recoverable from the facts (a muted campaign simply is not there), so
            // the audit trail keeps them.
            meta: excludedCampaigns.length > 0 ? { excludedCampaigns } : undefined,
        },
    };
}
