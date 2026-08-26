import type { DynamicsSnapshot } from '@/lib/domain/dynamics';
import type { FrozenGeoRollup } from '@/lib/domain/snapshot';
import { geoThresholdsSchema } from '@/services/snapshots/schemas';

// The day read's shaping half, kept clear of the DB so it is testable on its own (ADR-0005): three
// flat row sets in, the domain's `DynamicsSnapshot[]` out, ready for `buildSeries`.

// The Snapshot columns the page needs. No meta bag, no Facts.
export type DaySnapshotRow = {
    id: string;
    appliedRulesetId: string;
    takenAt: Date;
};

// A superseded push, reduced to the only thing left of it: which active Snapshot corrected it and
// when (ADR-0018). Its figures are not read — a replaced Snapshot contributes to no number anywhere.
export type DayReplacementRow = {
    replacedBy: string;
    replacedAt: Date;
};

export type DayRollupRow = FrozenGeoRollup & {
    snapshotId: string;
};

// A frozen threshold copy, still as jsonb — parsed here, never trusted.
export type DayGeoRuleRow = {
    appliedRulesetId: string;
    geo: string;
    thresholds: unknown;
};

const key = (appliedRulesetId: string, geo: string): string => {
    return `${appliedRulesetId}:${geo}`;
};

export const toDynamicsSnapshots = (
    rows: DaySnapshotRow[],
    rollups: DayRollupRow[],
    geoRules: DayGeoRuleRow[],
    replacements: DayReplacementRow[] = []
): DynamicsSnapshot[] => {
    // The correction stamp lands on the push that DID the correcting — the replaced one is not in
    // `rows` at all. The latest wins when a push corrected more than one: the badge names when the
    // figures on screen last changed, and an older stamp would understate that.
    const replacedAt = new Map<string, Date>();

    for (const replacement of replacements) {
        const known = replacedAt.get(replacement.replacedBy);

        if (!known || known < replacement.replacedAt) {
            replacedAt.set(replacement.replacedBy, replacement.replacedAt);
        }
    }

    // Thresholds come out of jsonb, so an unparseable copy degrades THAT Geo to ungraded — never
    // graded by the reader's live ruleset (ADR-0002, spec story 32), and never a thrown page.
    const thresholds = new Map<string, DynamicsSnapshot['thresholds'][string]>();

    for (const rule of geoRules) {
        const parsed = geoThresholdsSchema.safeParse(rule.thresholds);

        thresholds.set(key(rule.appliedRulesetId, rule.geo), parsed.success ? parsed.data : null);
    }

    const rollupsBySnapshot = new Map<string, FrozenGeoRollup[]>();

    for (const { snapshotId, ...rollup } of rollups) {
        const list = rollupsBySnapshot.get(snapshotId) ?? [];

        list.push(rollup);
        rollupsBySnapshot.set(snapshotId, list);
    }

    return rows.map((row): DynamicsSnapshot => {
        const geoRollups = rollupsBySnapshot.get(row.id) ?? [];

        return {
            id: row.id,
            takenAt: row.takenAt.toISOString(),
            geoRollups,
            replacedAt: replacedAt.get(row.id)?.toISOString() ?? null,
            // Only the Geos this Snapshot froze: a threshold copy for a market it did not report
            // grades nothing, and carrying it would invite a point that has no figures.
            thresholds: Object.fromEntries(
                geoRollups.map((rollup) => {
                    return [rollup.geo, thresholds.get(key(row.appliedRulesetId, rollup.geo)) ?? null];
                })
            ),
        };
    });
};
