import type { DayGeoRuleRow, DayRollupRow, DaySnapshotRow } from './toDay';
import { describe, expect, it } from 'vitest';
import { toDynamicsSnapshots } from './toDay';

const rowOf = (id: string, takenAt: string, appliedRulesetId = 'ruleset-1'): DaySnapshotRow => {
    return { id, appliedRulesetId, takenAt: new Date(takenAt) };
};

const rollupOf = (snapshotId: string, geo: string): DayRollupRow => {
    return {
        snapshotId,
        geo,
        spendPlus: 100,
        geoTotal: 150,
        attributedRevenue: 120,
        linkClicks: 10,
        installs: 5,
        regs: 4,
        sales: 2,
        profit: 50,
        roi: 50,
        cpc: 10,
        cpi: 20,
        cpr: 25,
        cps: 50,
        waste: 0,
    };
};

const PAIR = { gy: 1, yr: 2 };
const THRESHOLDS = { installs: PAIR, regs: PAIR, sales: PAIR, clicks: PAIR };

const ruleOf = (geo: string, thresholds: unknown, appliedRulesetId = 'ruleset-1'): DayGeoRuleRow => {
    return { appliedRulesetId, geo, thresholds };
};

describe('toDynamicsSnapshots', () => {
    it('attaches each snapshot its own rollups and keeps the query order', () => {
        const day = toDynamicsSnapshots(
            [rowOf('snap-1', '2026-08-26T06:00:00.000Z'), rowOf('snap-2', '2026-08-26T09:00:00.000Z')],
            [rollupOf('snap-1', 'UA'), rollupOf('snap-2', 'UA'), rollupOf('snap-2', 'PL')],
            []
        );

        expect(
            day.map((snapshot) => {
                return snapshot.id;
            })
        ).toEqual(['snap-1', 'snap-2']);
        expect(day[0].takenAt).toBe('2026-08-26T06:00:00.000Z');
        expect(day[0].geoRollups).toHaveLength(1);
        expect(day[1].geoRollups).toHaveLength(2);
    });

    it('carries the thresholds the snapshot froze, per geo', () => {
        const [day] = toDynamicsSnapshots(
            [rowOf('snap-1', '2026-08-26T06:00:00.000Z')],
            [rollupOf('snap-1', 'UA')],
            [ruleOf('UA', THRESHOLDS)]
        );

        expect(day.thresholds.UA).toEqual(THRESHOLDS);
    });

    // The degradation rule: one broken jsonb copy ungrades its own geo and nothing else.
    it('degrades an unparseable threshold copy to ungraded instead of throwing', () => {
        const [day] = toDynamicsSnapshots(
            [rowOf('snap-1', '2026-08-26T06:00:00.000Z')],
            [rollupOf('snap-1', 'UA'), rollupOf('snap-1', 'PL')],
            [ruleOf('UA', { installs: 'not-a-threshold-pair' }), ruleOf('PL', THRESHOLDS)]
        );

        expect(day.thresholds.UA).toBeNull();
        expect(day.thresholds.PL).toEqual(THRESHOLDS);
    });

    it('reads a geo with no threshold copy at all as ungraded', () => {
        const [day] = toDynamicsSnapshots(
            [rowOf('snap-1', '2026-08-26T06:00:00.000Z')],
            [rollupOf('snap-1', 'UA')],
            []
        );

        expect(day.thresholds.UA).toBeNull();
    });

    // A threshold copy is per ruleset version: two snapshots pinning different versions must not
    // borrow each other's grading.
    it('never lends one ruleset version its neighbour thresholds', () => {
        const day = toDynamicsSnapshots(
            [
                rowOf('snap-1', '2026-08-26T06:00:00.000Z', 'ruleset-1'),
                rowOf('snap-2', '2026-08-26T09:00:00.000Z', 'ruleset-2'),
            ],
            [rollupOf('snap-1', 'UA'), rollupOf('snap-2', 'UA')],
            [ruleOf('UA', THRESHOLDS, 'ruleset-1')]
        );

        expect(day[0].thresholds.UA).toEqual(THRESHOLDS);
        expect(day[1].thresholds.UA).toBeNull();
    });

    it('carries no thresholds for a geo the snapshot did not report', () => {
        const [day] = toDynamicsSnapshots(
            [rowOf('snap-1', '2026-08-26T06:00:00.000Z')],
            [rollupOf('snap-1', 'UA')],
            [ruleOf('UA', THRESHOLDS), ruleOf('DE', THRESHOLDS)]
        );

        expect(Object.keys(day.thresholds)).toEqual(['UA']);
    });
});
