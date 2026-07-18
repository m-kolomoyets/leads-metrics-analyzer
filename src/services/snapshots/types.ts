import type { SnapshotAccess } from '@/lib/auth/snapshotAccess';
import type { FactZone } from './schemas';

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
