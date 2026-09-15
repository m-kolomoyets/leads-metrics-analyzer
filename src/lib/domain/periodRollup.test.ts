import type { PeriodGeoRow, PeriodRollupInput, PeriodSnapshotRow } from './periodRollup';
import { countryBuyers, countryRollup, THIN_REVENUE_USD } from './periodRollup';

// The Home map's per-country figures (offers-and-home/13, PRD stories 46–49): each buyer's latest
// active push per report date (ADR-0017), summed per Geo on the Geo Total basis across the period's
// days, ROI weighted on the sums. A market whose revenue is under $500 is "too little data" —
// neutral — whatever it spent; a market with no rows is not in the output at all.

const push = (overrides: Partial<PeriodSnapshotRow> & { snapshotId: string }): PeriodSnapshotRow => {
    return {
        buyerUserId: 'u1',
        reportDate: '2026-09-10',
        takenAt: '2026-09-10T10:00:00Z',
        status: 'active',
        ...overrides,
    };
};

const geo = (overrides: Partial<PeriodGeoRow> & { snapshotId: string }): PeriodGeoRow => {
    return { geo: 'KR', spendPlus: 1000, geoTotal: 1500, ...overrides };
};

const input = (overrides: Partial<PeriodRollupInput>): PeriodRollupInput => {
    return { snapshots: [], geos: [], ...overrides };
};

describe('countryRollup', () => {
    it('sums one country on the Geo Total basis and weights ROI on the sums', () => {
        const rows = countryRollup(
            input({
                snapshots: [push({ snapshotId: 's1' })],
                geos: [geo({ snapshotId: 's1', spendPlus: 1000, geoTotal: 1500 })],
            })
        );

        expect(rows).toEqual([
            { geo: 'KR', spend: 1000, revenue: 1500, profit: 500, roi: 50, buyers: 1, zone: 'green', isThin: false },
        ]);
    });

    it('takes the latest push of a day, never the sum of two pushes', () => {
        const rows = countryRollup(
            input({
                snapshots: [
                    push({ snapshotId: 's1', takenAt: '2026-09-10T10:00:00Z' }),
                    push({ snapshotId: 's2', takenAt: '2026-09-10T12:00:00Z' }),
                ],
                geos: [
                    geo({ snapshotId: 's1', spendPlus: 1000, geoTotal: 1500 }),
                    geo({ snapshotId: 's2', spendPlus: 1200, geoTotal: 1800 }),
                ],
            })
        );

        expect(rows[0]).toMatchObject({ spend: 1200, revenue: 1800, profit: 600 });
    });

    it('excludes a replaced push even when it is the latest', () => {
        const rows = countryRollup(
            input({
                snapshots: [
                    push({ snapshotId: 's1', takenAt: '2026-09-10T10:00:00Z' }),
                    push({ snapshotId: 's2', takenAt: '2026-09-10T12:00:00Z', status: 'replaced' }),
                ],
                geos: [
                    geo({ snapshotId: 's1', spendPlus: 1000, geoTotal: 1500 }),
                    geo({ snapshotId: 's2', spendPlus: 9000, geoTotal: 9000 }),
                ],
            })
        );

        expect(rows[0]).toMatchObject({ spend: 1000, revenue: 1500 });
    });

    it('sums two report dates of one buyer', () => {
        const rows = countryRollup(
            input({
                snapshots: [
                    push({ snapshotId: 's1', reportDate: '2026-09-10' }),
                    push({ snapshotId: 's2', reportDate: '2026-09-11', takenAt: '2026-09-11T10:00:00Z' }),
                ],
                geos: [
                    geo({ snapshotId: 's1', spendPlus: 1000, geoTotal: 1500 }),
                    geo({ snapshotId: 's2', spendPlus: 1000, geoTotal: 900 }),
                ],
            })
        );

        expect(rows[0]).toMatchObject({ spend: 2000, revenue: 2400, profit: 400, roi: 20, zone: 'yellow', buyers: 1 });
    });

    it('counts distinct buyers per country and keeps countries apart', () => {
        const rows = countryRollup(
            input({
                snapshots: [
                    push({ snapshotId: 's1', buyerUserId: 'u1' }),
                    push({ snapshotId: 's2', buyerUserId: 'u2' }),
                    push({ snapshotId: 's3', buyerUserId: 'u1', reportDate: '2026-09-11' }),
                ],
                geos: [
                    geo({ snapshotId: 's1', geo: 'KR' }),
                    geo({ snapshotId: 's2', geo: 'KR' }),
                    geo({ snapshotId: 's3', geo: 'KR' }),
                    geo({ snapshotId: 's2', geo: 'JP', spendPlus: 100, geoTotal: 600 }),
                ],
            })
        );

        expect(
            rows.map((row) => {
                return [row.geo, row.buyers];
            })
        ).toEqual([
            ['JP', 1],
            ['KR', 2],
        ]);
    });

    it('is thin under $500 revenue whatever was spent, and stays neutral', () => {
        const rows = countryRollup(
            input({
                snapshots: [push({ snapshotId: 's1' })],
                geos: [geo({ snapshotId: 's1', spendPlus: 4000, geoTotal: 300 })],
            })
        );

        expect(rows[0]).toMatchObject({ roi: -92.5, zone: 'neutral', isThin: true });
        expect(THIN_REVENUE_USD).toBe(500);
    });

    it('grades a market at the threshold: $520 revenue at −30 % ROI is red', () => {
        const rows = countryRollup(
            input({
                snapshots: [push({ snapshotId: 's1' })],
                geos: [geo({ snapshotId: 's1', spendPlus: 520 / 0.7, geoTotal: 520 })],
            })
        );

        expect(rows[0]).toMatchObject({ zone: 'red', isThin: false });
        expect(rows[0].roi).toBeCloseTo(-30);
    });

    it('reads null ROI and a neutral zone when nothing was spent', () => {
        const rows = countryRollup(
            input({
                snapshots: [push({ snapshotId: 's1' })],
                geos: [geo({ snapshotId: 's1', spendPlus: 0, geoTotal: 800 })],
            })
        );

        expect(rows[0]).toMatchObject({ roi: null, zone: 'neutral', isThin: false, profit: 800 });
    });

    it('lists no country that had no rows — the map draws those as outline', () => {
        expect(countryRollup(input({}))).toEqual([]);
        // A geo row whose push is not counted (replaced) is not a market either.
        expect(
            countryRollup(
                input({
                    snapshots: [push({ snapshotId: 's1', status: 'replaced' })],
                    geos: [geo({ snapshotId: 's1' })],
                })
            )
        ).toEqual([]);
    });

    it('rolls up only the rows it is handed — a buyer scope arrives as their own pushes only', () => {
        const rows = countryRollup(
            input({
                snapshots: [push({ snapshotId: 's1', buyerUserId: 'u1' })],
                geos: [geo({ snapshotId: 's1', geo: 'KR' }), geo({ snapshotId: 'other', geo: 'DE' })],
            })
        );

        expect(
            rows.map((row) => {
                return row.geo;
            })
        ).toEqual(['KR']);
    });
});

// The country panel's rows (offers-and-home/14): one per buyer in the market, the same selection and
// basis as the map, so the rows sum to the tooltip's figures. Sorted by profit, best first.
describe('countryBuyers', () => {
    it('sums one buyer over two days and remembers their last report date', () => {
        const rows = countryBuyers(
            input({
                snapshots: [
                    push({ snapshotId: 's1', reportDate: '2026-09-10' }),
                    push({ snapshotId: 's2', reportDate: '2026-09-12', takenAt: '2026-09-12T10:00:00Z' }),
                ],
                geos: [
                    geo({ snapshotId: 's1', spendPlus: 1000, geoTotal: 1500 }),
                    geo({ snapshotId: 's2', spendPlus: 500, geoTotal: 400 }),
                ],
            }),
            'KR'
        );

        expect(rows).toEqual([
            {
                buyerUserId: 'u1',
                spend: 1500,
                revenue: 1900,
                profit: 400,
                roi: (400 / 1500) * 100,
                lastReportDate: '2026-09-12',
                zone: 'yellow',
                isThin: false,
            },
        ]);
    });

    it('takes the latest push of a day and ignores a replaced one, like the map', () => {
        const rows = countryBuyers(
            input({
                snapshots: [
                    push({ snapshotId: 's1', takenAt: '2026-09-10T10:00:00Z' }),
                    push({ snapshotId: 's2', takenAt: '2026-09-10T12:00:00Z' }),
                    push({ snapshotId: 's3', takenAt: '2026-09-10T14:00:00Z', status: 'replaced' }),
                ],
                geos: [
                    geo({ snapshotId: 's1', spendPlus: 1000, geoTotal: 1500 }),
                    geo({ snapshotId: 's2', spendPlus: 1200, geoTotal: 1800 }),
                    geo({ snapshotId: 's3', spendPlus: 9000, geoTotal: 9000 }),
                ],
            }),
            'KR'
        );

        expect(rows[0]).toMatchObject({ spend: 1200, revenue: 1800, lastReportDate: '2026-09-10' });
    });

    it('lists only the market asked for, sorted by profit, best first', () => {
        const data = input({
            snapshots: [
                push({ snapshotId: 's1', buyerUserId: 'u1' }),
                push({ snapshotId: 's2', buyerUserId: 'u2' }),
                push({ snapshotId: 's3', buyerUserId: 'u3' }),
            ],
            geos: [
                geo({ snapshotId: 's1', spendPlus: 1000, geoTotal: 1200 }),
                geo({ snapshotId: 's2', spendPlus: 1000, geoTotal: 2000 }),
                geo({ snapshotId: 's3', geo: 'JP', spendPlus: 100, geoTotal: 900 }),
            ],
        });

        expect(
            countryBuyers(data, 'KR').map((row) => {
                return row.buyerUserId;
            })
        ).toEqual(['u2', 'u1']);
        expect(countryBuyers(data, 'JP')).toHaveLength(1);
        expect(countryBuyers(data, 'DE')).toEqual([]);
    });

    it('sums to the map figures for the same market', () => {
        const data = input({
            snapshots: [push({ snapshotId: 's1', buyerUserId: 'u1' }), push({ snapshotId: 's2', buyerUserId: 'u2' })],
            geos: [
                geo({ snapshotId: 's1', spendPlus: 1000, geoTotal: 1200 }),
                geo({ snapshotId: 's2', spendPlus: 300, geoTotal: 100 }),
            ],
        });
        const market = countryRollup(data).find((row) => {
            return row.geo === 'KR';
        });
        const rows = countryBuyers(data, 'KR');

        expect(
            rows.reduce((sum, row) => {
                return sum + row.spend;
            }, 0)
        ).toBe(market?.spend);
        expect(
            rows.reduce((sum, row) => {
                return sum + row.revenue;
            }, 0)
        ).toBe(market?.revenue);
    });

    it('reads a thin buyer as neutral, the market rule applied per row', () => {
        const rows = countryBuyers(
            input({
                snapshots: [push({ snapshotId: 's1' })],
                geos: [geo({ snapshotId: 's1', spendPlus: 100, geoTotal: THIN_REVENUE_USD - 1 })],
            }),
            'KR'
        );

        expect(rows[0]).toMatchObject({ zone: 'neutral', isThin: true });
    });
});
