import type { DynamicsSnapshot } from '@/lib/domain/dynamics';
import type { FrozenGeoRollup } from '@/lib/domain/snapshot';
import type { BuyerTab } from './buyerTabs';
import { describe, expect, it } from 'vitest';
import { activeBuyer, geoTabs, latestSnapshot, NO_TEAM_LABEL, tabsOfTeam, teamsOf } from './frame';

const tab = (over: Partial<BuyerTab> & { id: string }): BuyerTab => {
    return {
        nickname: over.id,
        role: 'buyer',
        teamId: 't1',
        teamName: 'Alpha',
        lastTakenAt: '2026-08-26T09:00:00Z',
        totalProfit: 0,
        state: 'profit',
        ...over,
    };
};

const rollup = (geo: string, spendPlus: number): FrozenGeoRollup => {
    return {
        geo,
        spendPlus,
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
    };
};

const snapshot = (id: string, takenAt: string, rollups: FrozenGeoRollup[]): DynamicsSnapshot => {
    return { id, takenAt, geoRollups: rollups, thresholds: {} };
};

describe('teamsOf', () => {
    it('lists each team once, in the order its first buyer appears', () => {
        const teams = teamsOf([
            tab({ id: 'a', teamId: 't2', teamName: 'Beta' }),
            tab({ id: 'b', teamId: 't1', teamName: 'Alpha' }),
            tab({ id: 'c', teamId: 't2', teamName: 'Beta' }),
        ]);

        expect(teams).toEqual([
            { id: 't2', name: 'Beta' },
            { id: 't1', name: 'Alpha' },
        ]);
    });

    it('gives a teamless person a team of their own rather than dropping them', () => {
        expect(teamsOf([tab({ id: 'head', teamId: null, teamName: null })])).toEqual([
            { id: null, name: NO_TEAM_LABEL },
        ]);
    });
});

describe('tabsOfTeam', () => {
    it('keeps the teamless row reachable', () => {
        const tabs = [tab({ id: 'a' }), tab({ id: 'head', teamId: null, teamName: null })];

        expect(
            tabsOfTeam(tabs, null).map((one) => {
                return one.id;
            })
        ).toEqual(['head']);
    });
});

describe('activeBuyer', () => {
    it('honours the asked-for buyer when they are still in the row', () => {
        const tabs = [tab({ id: 'a' }), tab({ id: 'b' })];

        expect(activeBuyer(tabs, 'b')?.id).toBe('b');
    });

    it('falls back to the first tab for a buyer the reader cannot see', () => {
        const tabs = [tab({ id: 'a' }), tab({ id: 'b' })];

        expect(activeBuyer(tabs, 'ghost')?.id).toBe('a');
        expect(activeBuyer(tabs, undefined)?.id).toBe('a');
    });

    it('has nothing to open on an empty row', () => {
        expect(activeBuyer([], 'a')).toBeNull();
    });
});

describe('latestSnapshot', () => {
    it('reads the day off the most recent push, whatever order they arrive in', () => {
        const day = [snapshot('s2', '2026-08-26T12:00:00Z', []), snapshot('s1', '2026-08-26T09:00:00Z', [])];

        expect(latestSnapshot(day)?.id).toBe('s2');
    });

    it('ignores an unparseable stamp instead of letting it win', () => {
        const day = [snapshot('broken', 'not-a-date', []), snapshot('s1', '2026-08-26T09:00:00Z', [])];

        expect(latestSnapshot(day)?.id).toBe('s1');
    });

    it('answers null for a day with no push', () => {
        expect(latestSnapshot([])).toBeNull();
    });
});

describe('geoTabs', () => {
    it('offers only markets with spend, biggest first', () => {
        const day = [
            snapshot('s1', '2026-08-26T09:00:00Z', [rollup('PL', 900)]),
            snapshot('s2', '2026-08-26T12:00:00Z', [rollup('DE', 10), rollup('IT', 0), rollup('PL', 50)]),
        ];

        expect(
            geoTabs(day).map((one) => {
                return one.geo;
            })
        ).toEqual(['PL', 'DE']);
    });

    it('reads the latest push, not the union of the day', () => {
        const day = [
            snapshot('s1', '2026-08-26T09:00:00Z', [rollup('PL', 10), rollup('ES', 5)]),
            snapshot('s2', '2026-08-26T12:00:00Z', [rollup('PL', 20)]),
        ];

        expect(geoTabs(day)).toEqual([{ geo: 'PL', spendPlus: 20 }]);
    });

    it('has no tabs for a day with no push', () => {
        expect(geoTabs([])).toEqual([]);
    });
});
