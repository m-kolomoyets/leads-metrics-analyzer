import type { UserRole } from '@/lib/constants';
import type { GeoThresholds, ThresholdPair } from '@/lib/domain/types';
import type { SnapshotGeoView } from '@/services/snapshots/types';

// Wire shapes for the Report surfaces (spec 0003, ADR-0016). A Report is derived, not stored: these
// two reads are "the roster the viewer can see" and "the Snapshots they pushed in a range", and
// `buildReport` makes a Report out of them. Deliberately Fact-free — a feed row is rendered entirely
// from the Frozen Geo Rollup (ADR-0015), so a wide range costs one small query, not thousands of rows.

// One person in the feed's roster. `lastTakenAt` is their last push EVER, not within the range: it is
// what tells a quiet day from an absent buyer (spec story 5). Null when they have never pushed.
export type ReportRosterUser = {
    id: string;
    nickname: string;
    role: UserRole;
    lastTakenAt: string | null;
};

// One Geo row under a Snapshot card: the frozen header line plus the thresholds that Snapshot copied
// for that Geo, so the cost-per line is graded by the buyer's ruleset rather than the reader's
// (spec story 32). Thresholds are null when the Geo saved none — its costs then read neutral.
export type ReportGeoView = SnapshotGeoView & {
    thresholds: GeoThresholds | null;
};

// One Snapshot as the feed reads it. No Facts, no allocation, no Problem Accounts — those belong to
// the detailed report, one click away.
export type ReportSnapshotView = {
    id: string;
    createdByUserId: string;
    reportDate: string;
    takenAt: string;
    // The Waste Zones band the Snapshot copied, for tinting each Geo row's waste readout. Null when
    // the creator's team had no saved shared settings — the readout then grades neutral.
    wasteZones: ThresholdPair | null;
    // Empty for a Snapshot pushed before ADR-0015: it froze no rollup, so it has no rows to show and
    // its card headline reads `—` rather than being backfilled from Attributed sums (spec story 35).
    geos: ReportGeoView[];
};
