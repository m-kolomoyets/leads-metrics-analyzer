import type { OfferRatingInput, RatingGeoRow, RatingModelRow, RatingSnapshotRow } from './offerRating';
import { offerFunnel, offerRating, RATING_DIM_AFTER_DAYS, ratingPeriodRange, ratingWindowRange } from './offerRating';

// The offer buyer rating (offers-and-home/11, PRD stories 38–45): per buyer who ran the offer in the
// period, Allocated Spend at the Geo Unit Cost (ADR-0013), revenue, profit, weighted ROI, sales and
// the last launch — built from the latest active Snapshot per buyer per report date, nothing summed
// across a day's pushes (ADR-0017), replaced pushes invisible (ADR-0018).

const today = '2026-09-14';

const push = (overrides: Partial<RatingSnapshotRow> & { snapshotId: string }): RatingSnapshotRow => {
    return {
        buyerUserId: 'u1',
        buyerNickname: 'ann',
        reportDate: '2026-09-10',
        takenAt: '2026-09-10T10:00:00Z',
        status: 'active',
        ...overrides,
    };
};

const model = (overrides: Partial<RatingModelRow> & { snapshotId: string }): RatingModelRow => {
    return { campaign: 'c1', geo: 'KR', revenue: 100, installs: 10, regs: 3, sales: 1, ...overrides };
};

const geo = (overrides: Partial<RatingGeoRow> & { snapshotId: string }): RatingGeoRow => {
    return { geo: 'KR', spendPlus: 200, installs: 20, ...overrides };
};

const input = (overrides: Partial<OfferRatingInput>): OfferRatingInput => {
    return { snapshots: [], models: [], geos: [], ...overrides };
};

describe('offerRating', () => {
    it('prices spend at the geo unit cost: row installs × (geo Spend⁺ ÷ geo installs)', () => {
        const rows = offerRating(
            input({
                snapshots: [push({ snapshotId: 's1' })],
                models: [model({ snapshotId: 's1', revenue: 150, installs: 10, sales: 3 })],
                geos: [geo({ snapshotId: 's1', spendPlus: 200, installs: 20 })],
            }),
            today
        );

        expect(rows).toEqual([
            {
                buyerUserId: 'u1',
                nickname: 'ann',
                spend: 100,
                revenue: 150,
                profit: 50,
                roi: 50,
                sales: 3,
                installs: 10,
                lastLaunch: '2026-09-10',
                isDimmed: false,
            },
        ]);
    });

    it('takes the latest push per buyer per day and never sums a day twice', () => {
        const rows = offerRating(
            input({
                snapshots: [
                    push({ snapshotId: 'early', takenAt: '2026-09-10T09:00:00Z' }),
                    push({ snapshotId: 'late', takenAt: '2026-09-10T18:00:00Z' }),
                ],
                models: [
                    model({ snapshotId: 'early', revenue: 50, installs: 5 }),
                    model({ snapshotId: 'late', revenue: 80, installs: 8 }),
                ],
                geos: [geo({ snapshotId: 'early' }), geo({ snapshotId: 'late' })],
            }),
            today
        );

        expect(rows[0].revenue).toBe(80);
        expect(rows[0].spend).toBe(80);
    });

    it('drops the offer when the day’s latest push no longer carries it', () => {
        const rows = offerRating(
            input({
                snapshots: [
                    push({ snapshotId: 'early', takenAt: '2026-09-10T09:00:00Z' }),
                    push({ snapshotId: 'late', takenAt: '2026-09-10T18:00:00Z' }),
                ],
                models: [model({ snapshotId: 'early' })],
                geos: [geo({ snapshotId: 'early' })],
            }),
            today
        );

        expect(rows).toEqual([]);
    });

    it('sums across report dates and remembers the last launch', () => {
        const rows = offerRating(
            input({
                snapshots: [
                    push({ snapshotId: 's1', reportDate: '2026-09-01' }),
                    push({ snapshotId: 's2', reportDate: '2026-09-05' }),
                ],
                models: [
                    model({ snapshotId: 's1', revenue: 100, sales: 1 }),
                    model({ snapshotId: 's2', revenue: 40, sales: 2 }),
                ],
                geos: [geo({ snapshotId: 's1' }), geo({ snapshotId: 's2' })],
            }),
            today
        );

        expect(rows[0]).toMatchObject({ revenue: 140, sales: 3, spend: 200, lastLaunch: '2026-09-05' });
    });

    it('excludes replaced Snapshots even when they are the latest', () => {
        const rows = offerRating(
            input({
                snapshots: [
                    push({ snapshotId: 'kept', takenAt: '2026-09-10T09:00:00Z' }),
                    push({ snapshotId: 'gone', takenAt: '2026-09-10T18:00:00Z', status: 'replaced' }),
                ],
                models: [model({ snapshotId: 'kept', revenue: 50 }), model({ snapshotId: 'gone', revenue: 999 })],
                geos: [geo({ snapshotId: 'kept' }), geo({ snapshotId: 'gone' })],
            }),
            today
        );

        expect(rows[0].revenue).toBe(50);
    });

    it('weights ROI on sums, never averages rows', () => {
        // Day 1: $5 000 spend, $5 500 revenue (ROI +10). Day 2: $50 spend, $200 revenue (ROI +300).
        // Mean of rows would be +155; weighted is (5700 − 5050) / 5050 ≈ +12.9.
        const rows = offerRating(
            input({
                snapshots: [
                    push({ snapshotId: 'big', reportDate: '2026-09-01' }),
                    push({ snapshotId: 'small', reportDate: '2026-09-02' }),
                ],
                models: [
                    model({ snapshotId: 'big', revenue: 5500, installs: 500 }),
                    model({ snapshotId: 'small', revenue: 200, installs: 5 }),
                ],
                geos: [
                    geo({ snapshotId: 'big', spendPlus: 5000, installs: 500 }),
                    geo({ snapshotId: 'small', spendPlus: 50, installs: 5 }),
                ],
            }),
            today
        );

        expect(rows[0].roi).toBeCloseTo(12.87, 2);
        expect(rows[0].roi).not.toBeCloseTo(155, 0);
    });

    it('sorts by revenue, keeps a dimmed row in place, and flags a launch older than 30 days', () => {
        const rows = offerRating(
            input({
                snapshots: [
                    push({ snapshotId: 'a', buyerUserId: 'u1', buyerNickname: 'ann', reportDate: '2026-07-31' }),
                    push({ snapshotId: 'b', buyerUserId: 'u2', buyerNickname: 'bob', reportDate: '2026-09-13' }),
                ],
                models: [model({ snapshotId: 'a', revenue: 900 }), model({ snapshotId: 'b', revenue: 300 })],
                geos: [geo({ snapshotId: 'a' }), geo({ snapshotId: 'b' })],
            }),
            today
        );

        expect(
            rows.map((row) => {
                return [row.nickname, row.isDimmed];
            })
        ).toEqual([
            ['ann', true],
            ['bob', false],
        ]);
    });

    it('dims strictly after the 30th day', () => {
        const at = (reportDate: string) => {
            return offerRating(
                input({
                    snapshots: [push({ snapshotId: 's', reportDate })],
                    models: [model({ snapshotId: 's' })],
                    geos: [geo({ snapshotId: 's' })],
                }),
                today
            )[0].isDimmed;
        };

        expect(RATING_DIM_AFTER_DAYS).toBe(30);
        expect(at('2026-08-15')).toBe(false);
        expect(at('2026-08-14')).toBe(true);
    });

    it('has no ROI and no spend when the geo bought no installs', () => {
        const rows = offerRating(
            input({
                snapshots: [push({ snapshotId: 's' })],
                models: [model({ snapshotId: 's', installs: 0, revenue: 10 })],
                geos: [geo({ snapshotId: 's', spendPlus: 300, installs: 0 })],
            }),
            today
        );

        expect(rows[0]).toMatchObject({ spend: 0, revenue: 10, profit: 10, roi: null });
    });

    it('ignores a model row whose geo froze no rollup', () => {
        const rows = offerRating(
            input({
                snapshots: [push({ snapshotId: 's' })],
                models: [model({ snapshotId: 's', geo: 'IN', revenue: 10, installs: 4 })],
                geos: [geo({ snapshotId: 's', geo: 'KR' })],
            }),
            today
        );

        expect(rows[0]).toMatchObject({ spend: 0, revenue: 10, installs: 4 });
    });
});

describe('ratingPeriodRange', () => {
    it('rolls back from today inclusive', () => {
        expect(ratingPeriodRange('week', today)).toEqual({ from: '2026-09-08', to: today });
        expect(ratingPeriodRange('month', today)).toEqual({ from: '2026-08-16', to: today });
        expect(ratingPeriodRange('90d', today)).toEqual({ from: '2026-06-17', to: today });
        expect(ratingPeriodRange('year', today)).toEqual({ from: '2025-09-15', to: today });
    });

    it('crosses a year boundary', () => {
        expect(ratingPeriodRange('week', '2026-01-03')).toEqual({ from: '2025-12-28', to: '2026-01-03' });
    });
});

// The offer's all-time Attributed funnel (offers-and-home/12): the same latest-per-buyer-day rows the
// rating counts, summed across every buyer the viewer sees. Feeds the Claim Gap's actual side.
describe('offerFunnel', () => {
    it('sums installs, regs, sales and revenue over the counted pushes', () => {
        expect(
            offerFunnel(
                input({
                    snapshots: [push({ snapshotId: 's1' }), push({ snapshotId: 's2', buyerUserId: 'u2' })],
                    models: [
                        model({ snapshotId: 's1', installs: 10, regs: 4, sales: 1, revenue: 100 }),
                        model({ snapshotId: 's2', installs: 20, regs: 6, sales: 3, revenue: 250 }),
                    ],
                })
            )
        ).toEqual({ installs: 30, regs: 10, sales: 4, revenue: 350 });
    });

    it('counts only the latest active push per buyer per day', () => {
        expect(
            offerFunnel(
                input({
                    snapshots: [
                        push({ snapshotId: 's1', takenAt: '2026-09-10T08:00:00Z' }),
                        push({ snapshotId: 's2', takenAt: '2026-09-10T12:00:00Z' }),
                        push({ snapshotId: 's3', takenAt: '2026-09-10T18:00:00Z', status: 'replaced' }),
                    ],
                    models: [
                        model({ snapshotId: 's1', installs: 10, regs: 1, sales: 1, revenue: 10 }),
                        model({ snapshotId: 's2', installs: 12, regs: 2, sales: 2, revenue: 20 }),
                        model({ snapshotId: 's3', installs: 99, regs: 9, sales: 9, revenue: 999 }),
                    ],
                })
            )
        ).toEqual({ installs: 12, regs: 2, sales: 2, revenue: 20 });
    });

    it('is empty when nobody ran the offer', () => {
        expect(offerFunnel(input({}))).toEqual({ installs: 0, regs: 0, sales: 0, revenue: 0 });
    });
});

describe('ratingWindowRange', () => {
    it('bounds a period like ratingPeriodRange and leaves the all-time window open', () => {
        expect(ratingWindowRange('week', today)).toEqual({ from: '2026-09-08', to: today });
        expect(ratingWindowRange('all', today)).toEqual({ from: null, to: today });
    });
});
