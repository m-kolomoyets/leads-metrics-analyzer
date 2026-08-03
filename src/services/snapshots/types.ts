import type { RollupDimension } from '@/lib/auth/dimensionRollup';
import type { SnapshotAccess } from '@/lib/auth/snapshotAccess';
import type { GeoThresholds, ThresholdPair } from '@/lib/domain/types';
import type { FactAttribution, FactZone, ModelDimension } from './schemas';

// Domain shapes for the T6 Snapshots API. A Snapshot pins a frozen Applied Ruleset (the Preset
// version per Geo + the Shared-settings version in force) so later preset edits never change its
// numbers (ADR-0002 at multi-user granularity), and carries facts at grain Campaign × Creative × Date
// — enough to rebuild every roll-up and chart (spec story 34).

// One analyzed Geo's pinned Preset version inside a saved Applied Ruleset.
export type AppliedGeo = {
    geo: string;
    presetVersionId: string;
};

// A Snapshot as returned to the client: identity + its stamped attribution + the pinned ruleset
// versions + the viewer's verdict, so the UI can render read-only without a second round-trip. Facts
// are loaded separately (getSnapshotFacts) to keep the list payload small.
export type SnapshotView = {
    id: string;
    createdByUserId: string;
    teamId: string | null;
    appliedRulesetId: string;
    sharedSettingsVersionId: string | null;
    geos: AppliedGeo[];
    reportDate: string;
    takenAt: string;
    access: SnapshotAccess;
};

// A single frozen fact row. Money is Spend⁺-based (domain gotchas); counts are integers; `verdict`
// and `zone` are the traffic-light grades frozen at save.
export type SnapshotFactView = {
    id: string;
    // How completely the fact was attributed at analysis time (ADR-0012). Frozen at save rather than
    // re-derived, because the Problem Account detector skips non-`full` facts on purpose (ADR-0015).
    attribution: FactAttribution;
    campaign: string;
    creative: string;
    reportDate: string;
    geo: string;
    account: string;
    offer: string;
    os: string | null;
    spend: number;
    spendPlus: number;
    revenue: number;
    linkClicks: number;
    installs: number;
    regs: number;
    sales: number;
    verdict: FactZone;
    zone: FactZone;
};

// The pieces a detailed report is rebuilt from (S2b, #54). Everything below is what ADR-0015 froze:
// the sub-grain inputs the report's tables allocate over, the one figure that cannot be derived at
// all, and the copied ruleset that graded them.

// One Geo's frozen header line (`snapshot_geo`). Absent for a Geo of a Snapshot pushed before
// ADR-0015 — its Geo Total, Profit, ROI and Waste then read `—` rather than being backfilled.
export type SnapshotGeoView = {
    geo: string;
    spendPlus: number;
    // Revenue INCLUDING untagged — the Geo Total (ADR-0003), the reason this row exists.
    geoTotal: number;
    attributedRevenue: number;
    // The Geo Total's funnel, untagged rows included — as underivable from Facts as the revenue is.
    // Zero on a rollup written before #54, which froze the money but not the counts.
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

// One Creative Split row: real Facebook Spend + Impressions for a single ad name.
export type SnapshotCreativeView = {
    geo: string;
    campaign: string;
    adName: string;
    spend: number;
    impressions: number;
};

// One Campaign Model row: an Offer or OS value's funnel inside a campaign. No Spend by design — it is
// imputed at the Geo unit cost on read (ADR-0013).
export type SnapshotCampaignModelView = {
    campaign: string;
    dimension: ModelDimension;
    key: string;
    label: string;
    revenue: number;
    linkClicks: number;
    installs: number;
    regs: number;
    sales: number;
};

// One analyzed Geo's pinned Preset version PLUS the thresholds copied beside it. The copy is the
// grading; the version id is only provenance, and is null once its Preset is deleted (ADR-0015).
export type AppliedGeoRuleView = {
    geo: string;
    presetVersionId: string | null;
    thresholds: GeoThresholds | null;
};

// The resolved shared settings copied at save. Commission is a percent on the wire, as everywhere in
// persistence; the domain `Ruleset` wants a fraction and the mapper converts.
export type AppliedSettingsView = {
    reviewMultiplier: number;
    defaultCommission: number;
    wasteZones: ThresholdPair;
};

// Everything `analyzeSnapshot` needs, in one read (`getSnapshotBundleFn`).
export type SnapshotBundleView = {
    snapshot: SnapshotView;
    geos: AppliedGeoRuleView[];
    settings: AppliedSettingsView | null;
    facts: SnapshotFactView[];
    geoRollups: SnapshotGeoView[];
    creatives: SnapshotCreativeView[];
    campaignModels: SnapshotCampaignModelView[];
};

// A company-wide roll-up row for a dimension-scoped viewer (T7, #9). Designer/BDM never see dollar
// facts; they read all Snapshot facts summed by their single dimension — Creative for a Designer,
// Offer for a BDM. `dimension` names which axis `key` indexes so the client renders one table.
// Deliberately funnel-counts only: Spend / Spend⁺ / Revenue are absent from the wire, so no client
// code path in the rollup branch can render a dollar even by mistake (ADR-0009).
export type DimensionRollupView = {
    dimension: RollupDimension;
    key: string;
    linkClicks: number;
    installs: number;
    regs: number;
    sales: number;
};
