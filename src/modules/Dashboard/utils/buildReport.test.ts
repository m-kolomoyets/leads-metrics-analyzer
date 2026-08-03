import type { ReportGeoView, ReportRosterUser, ReportSnapshotView } from '@/services/reports/types';
import type { ReportRange } from '../types';
import { describe, expect, it } from 'vitest';
import { buildReport } from './buildReport';

// `buildReport` is the Report's only assembly seam: plain objects in, grouped view out, `today`
// injected so no clock is ever read. Everything asserted here is something a reader of the feed would
// notice — who appears, in what order, under which day, carrying which figures.

const user = (id: string, nickname: string, lastTakenAt: string | null = null): ReportRosterUser => {
    return { id, nickname, role: 'buyer', lastTakenAt };
};

const geo = (over: Partial<ReportGeoView> & { geo: string }): ReportGeoView => {
    return {
        spendPlus: 0,
        geoTotal: 0,
        attributedRevenue: 0,
        linkClicks: 0,
        installs: 0,
        regs: 0,
        sales: 0,
        profit: 0,
        roi: null,
        cpc: null,
        cpi: null,
        cpr: null,
        cps: null,
        waste: 0,
        thresholds: null,
        ...over,
    };
};

const snapshot = (over: Partial<ReportSnapshotView> & { id: string; createdByUserId: string }): ReportSnapshotView => {
    return {
        reportDate: '2026-06-12',
        takenAt: '2026-06-12T09:00:00.000Z',
        wasteZones: null,
        geos: [],
        ...over,
    };
};

const feed = (users: ReportRosterUser[], snapshots: ReportSnapshotView[], range: ReportRange = { range: '7d' }) => {
    const view = buildReport({ users, snapshots, range, today: '2026-06-12', mode: 'feed' });
    if (view.mode !== 'feed') {
        throw new Error('expected a feed view');
    }
    return view;
};

const archive = (users: ReportRosterUser[], snapshots: ReportSnapshotView[], range: ReportRange = { range: '7d' }) => {
    const view = buildReport({ users, snapshots, range, today: '2026-06-12', mode: 'archive' });
    if (view.mode !== 'archive') {
        throw new Error('expected an archive view');
    }
    return view;
};

describe('buildReport · the range', () => {
    it('resolves the token into the view, so the page can show the window it asked for', () => {
        expect(feed([], [])).toMatchObject({ from: '2026-06-06', to: '2026-06-12' });
    });

    it('filters on report date, never on push time', () => {
        // A Monday report pushed on Wednesday: its report date is inside the window, its push time is
        // outside it in the other direction. It must appear, under Monday.
        const late = snapshot({
            id: 's1',
            createdByUserId: 'u1',
            reportDate: '2026-06-08',
            takenAt: '2026-06-10T18:00:00.000Z',
        });
        // Pushed inside the window, but describing a day before it — must NOT appear.
        const stale = snapshot({
            id: 's2',
            createdByUserId: 'u1',
            reportDate: '2026-06-01',
            takenAt: '2026-06-11T09:00:00.000Z',
        });

        const view = feed([user('u1', 'ann')], [late, stale]);

        expect(
            view.users[0].cards.map((card) => {
                return card.snapshotId;
            })
        ).toEqual(['s1']);
    });

    it('includes both edges of the window', () => {
        const first = snapshot({ id: 'first', createdByUserId: 'u1', reportDate: '2026-06-06' });
        const last = snapshot({ id: 'last', createdByUserId: 'u1', reportDate: '2026-06-12' });
        const before = snapshot({ id: 'before', createdByUserId: 'u1', reportDate: '2026-06-05' });

        const view = feed([user('u1', 'ann')], [before, first, last]);

        expect(
            view.users[0].cards.map((card) => {
                return card.snapshotId;
            })
        ).toEqual(['last', 'first']);
    });

    it('honours a custom window', () => {
        const inside = snapshot({ id: 'inside', createdByUserId: 'u1', reportDate: '2026-01-15' });
        const outside = snapshot({ id: 'outside', createdByUserId: 'u1', reportDate: '2026-06-12' });

        const view = feed([user('u1', 'ann')], [inside, outside], {
            range: 'custom',
            from: '2026-01-01',
            to: '2026-01-31',
        } as never);

        expect(view).toMatchObject({ from: '2026-01-01', to: '2026-01-31' });
        expect(
            view.users[0].cards.map((card) => {
                return card.snapshotId;
            })
        ).toEqual(['inside']);
    });
});

describe('buildReport · the roster', () => {
    it('emits every roster user, in roster order, including those with nothing', () => {
        const view = feed(
            [user('u1', 'ann'), user('u2', 'bob'), user('u3', 'cid')],
            [snapshot({ id: 's1', createdByUserId: 'u2' })]
        );

        expect(
            view.users.map((group) => {
                return [group.user.nickname, group.cards.length];
            })
        ).toEqual([
            ['ann', 0],
            ['bob', 1],
            ['cid', 0],
        ]);
    });

    it('carries the last-ever push of a user who reported nothing in range', () => {
        const view = feed([user('u1', 'ann', '2026-05-02T07:00:00.000Z')], []);

        expect(view.users[0]).toMatchObject({ cards: [] });
        expect(view.users[0].user.lastTakenAt).toBe('2026-05-02T07:00:00.000Z');
    });

    it('leaves a user who has never pushed with no last push at all', () => {
        const view = feed([user('u1', 'ann')], []);

        expect(view.users[0].user.lastTakenAt).toBeNull();
    });

    it('drops a Snapshot whose author is not on the roster', () => {
        // An offboarded buyer's Snapshots: they are outside the roster (spec story 41), so there is no
        // group to hang them under and they are not smuggled in under someone else.
        const view = feed([user('u1', 'ann')], [snapshot({ id: 's1', createdByUserId: 'ghost' })]);

        expect(view.users).toHaveLength(1);
        expect(view.users[0].cards).toEqual([]);
    });
});

describe('buildReport · feed grouping', () => {
    it('keeps only the latest Snapshot per user and report date', () => {
        const early = snapshot({
            id: 'early',
            createdByUserId: 'u1',
            reportDate: '2026-06-10',
            takenAt: '2026-06-10T08:00:00.000Z',
        });
        const correction = snapshot({
            id: 'correction',
            createdByUserId: 'u1',
            reportDate: '2026-06-10',
            takenAt: '2026-06-11T15:00:00.000Z',
        });

        const view = feed([user('u1', 'ann')], [early, correction]);

        expect(
            view.users[0].cards.map((card) => {
                return card.snapshotId;
            })
        ).toEqual(['correction']);
    });

    it('keeps a re-push separate from another user reporting the same day', () => {
        const view = feed(
            [user('u1', 'ann'), user('u2', 'bob')],
            [
                snapshot({ id: 'a1', createdByUserId: 'u1', takenAt: '2026-06-12T08:00:00.000Z' }),
                snapshot({ id: 'a2', createdByUserId: 'u1', takenAt: '2026-06-12T10:00:00.000Z' }),
                snapshot({ id: 'b1', createdByUserId: 'u2', takenAt: '2026-06-12T09:00:00.000Z' }),
            ]
        );

        expect(
            view.users.map((group) => {
                return group.cards.map((card) => {
                    return card.snapshotId;
                });
            })
        ).toEqual([['a2'], ['b1']]);
    });

    it('orders a user cards newest report date first', () => {
        const view = feed(
            [user('u1', 'ann')],
            [
                snapshot({ id: 'mon', createdByUserId: 'u1', reportDate: '2026-06-08' }),
                snapshot({ id: 'wed', createdByUserId: 'u1', reportDate: '2026-06-10' }),
                snapshot({ id: 'tue', createdByUserId: 'u1', reportDate: '2026-06-09' }),
            ]
        );

        expect(
            view.users[0].cards.map((card) => {
                return card.snapshotId;
            })
        ).toEqual(['wed', 'tue', 'mon']);
    });
});

describe('buildReport · archive grouping', () => {
    it('groups date → user → snapshot, newest day first', () => {
        const view = archive(
            [user('u1', 'ann'), user('u2', 'bob')],
            [
                snapshot({ id: 'a-mon', createdByUserId: 'u1', reportDate: '2026-06-08' }),
                snapshot({ id: 'b-wed', createdByUserId: 'u2', reportDate: '2026-06-10' }),
                snapshot({ id: 'a-wed', createdByUserId: 'u1', reportDate: '2026-06-10' }),
            ]
        );

        expect(
            view.dates.map((day) => {
                return [
                    day.reportDate,
                    day.users.map((group) => {
                        return group.user.nickname;
                    }),
                ];
            })
        ).toEqual([
            ['2026-06-10', ['ann', 'bob']],
            ['2026-06-08', ['ann']],
        ]);
    });

    it('keeps every version, newest push first', () => {
        const view = archive(
            [user('u1', 'ann')],
            [
                snapshot({
                    id: 'first',
                    createdByUserId: 'u1',
                    reportDate: '2026-06-10',
                    takenAt: '2026-06-10T08:00:00.000Z',
                }),
                snapshot({
                    id: 'second',
                    createdByUserId: 'u1',
                    reportDate: '2026-06-10',
                    takenAt: '2026-06-11T15:00:00.000Z',
                }),
            ]
        );

        expect(
            view.dates[0].users[0].cards.map((card) => {
                return card.snapshotId;
            })
        ).toEqual(['second', 'first']);
    });

    it('lists no day nobody reported, and no user who did not report that day', () => {
        const view = archive([user('u1', 'ann'), user('u2', 'bob')], [snapshot({ id: 's1', createdByUserId: 'u1' })]);

        expect(view.dates).toHaveLength(1);
        expect(view.dates[0].users).toHaveLength(1);
    });
});

describe('buildReport · the card headline', () => {
    it('sums money across Geos and re-derives ROI and waste share from those sums', () => {
        const view = feed(
            [user('u1', 'ann')],
            [
                snapshot({
                    id: 's1',
                    createdByUserId: 'u1',
                    geos: [
                        geo({ geo: 'KR', spendPlus: 100, geoTotal: 150, profit: 50, roi: 50, waste: 20 }),
                        geo({ geo: 'JP', spendPlus: 300, geoTotal: 250, profit: -50, roi: -16.67, waste: 60 }),
                    ],
                }),
            ]
        );

        expect(view.users[0].cards[0].headline).toEqual({
            spendPlus: 400,
            geoTotal: 400,
            profit: 0,
            // Re-derived from the sums, NOT averaged from the per-Geo ROIs.
            roi: 0,
            waste: 80,
            wastePct: 20,
        });
    });

    it('reports no ROI when nothing was spent', () => {
        const view = feed(
            [user('u1', 'ann')],
            [snapshot({ id: 's1', createdByUserId: 'u1', geos: [geo({ geo: 'KR' })] })]
        );

        expect(view.users[0].cards[0].headline).toMatchObject({ roi: null, wastePct: 0 });
    });

    it('has no headline at all for a Snapshot that froze no Geo Rollup', () => {
        const view = feed([user('u1', 'ann')], [snapshot({ id: 'legacy', createdByUserId: 'u1', geos: [] })]);

        expect(view.users[0].cards[0].headline).toBeNull();
    });

    it('carries the Geo rows and the Snapshot own waste zones through untouched', () => {
        const rows = [geo({ geo: 'KR', spendPlus: 10 })];
        const view = feed(
            [user('u1', 'ann')],
            [snapshot({ id: 's1', createdByUserId: 'u1', geos: rows, wasteZones: { gy: 10, yr: 20 } })]
        );

        expect(view.users[0].cards[0].geos).toEqual(rows);
        expect(view.users[0].cards[0].wasteZones).toEqual({ gy: 10, yr: 20 });
    });
});
