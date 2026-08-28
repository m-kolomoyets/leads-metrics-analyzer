import type { DynamicsDimensionRosterUser, DynamicsRosterUser } from '@/services/dynamics/types';
import { describe, expect, it } from 'vitest';
import { buyerTabs, buyerTabState } from './buyerTabs';

// 09:00 UTC is 12:00 Kyiv in August (UTC+3) — past the 10:00 report deadline.
const NOON_KYIV = new Date('2026-08-26T09:00:00Z');
// 06:00 UTC is 09:00 Kyiv — before it.
const NINE_KYIV = new Date('2026-08-26T06:00:00Z');

const person = (over: Partial<DynamicsRosterUser> & { id: string }): DynamicsRosterUser => {
    return {
        nickname: over.id,
        role: 'buyer',
        teamId: 't1',
        teamName: 'Alpha',
        lastTakenAt: NOON_KYIV.toISOString(),
        totalProfit: 0,
        geoProfits: [],
        ...over,
    };
};

describe('buyerTabState', () => {
    it('calls a missing report missing only once it is past 10:00 Kyiv', () => {
        const silent = person({ id: 'ann', lastTakenAt: null, totalProfit: null });

        expect(buyerTabState(silent, NOON_KYIV)).toBe('missing');
        expect(buyerTabState(silent, NINE_KYIV)).toBe('awaited');
    });

    it('judges the deadline in Kyiv, not in the reader zone', () => {
        // 08:30 UTC is 11:30 Kyiv — past the deadline even where the reader's own clock says 01:30.
        const silent = person({ id: 'ann', lastTakenAt: null, totalProfit: null });

        expect(buyerTabState(silent, new Date('2026-08-26T08:30:00Z'))).toBe('missing');
    });

    it('warns on a push older than three hours, before it judges the money', () => {
        const stale = person({ id: 'bob', lastTakenAt: '2026-08-26T05:30:00Z', totalProfit: 500 });

        expect(buyerTabState(stale, NOON_KYIV)).toBe('stale');
    });

    it('does not warn at exactly three hours', () => {
        const fresh = person({ id: 'bob', lastTakenAt: '2026-08-26T06:00:00Z', totalProfit: 500 });

        expect(buyerTabState(fresh, NOON_KYIV)).toBe('profit');
    });

    it('reads one dollar of loss as red and zero as green', () => {
        expect(buyerTabState(person({ id: 'a', totalProfit: -1 }), NOON_KYIV)).toBe('loss');
        expect(buyerTabState(person({ id: 'b', totalProfit: 0 }), NOON_KYIV)).toBe('profit');
    });

    it('leaves a push with no frozen rollup uncoloured rather than calling it a zero profit', () => {
        expect(buyerTabState(person({ id: 'a', totalProfit: null }), NOON_KYIV)).toBe('awaited');
    });
});

describe('buyerTabs', () => {
    it('orders missing, then stale, then losses deepest-first, then profits largest-first', () => {
        const roster: DynamicsRosterUser[] = [
            person({ id: 'profit-small', totalProfit: 10 }),
            person({ id: 'loss-shallow', totalProfit: -5 }),
            person({ id: 'missing', lastTakenAt: null, totalProfit: null }),
            person({ id: 'profit-big', totalProfit: 900 }),
            person({ id: 'stale', lastTakenAt: '2026-08-26T04:00:00Z', totalProfit: 40 }),
            person({ id: 'loss-deep', totalProfit: -400 }),
        ];

        expect(
            buyerTabs(roster, NOON_KYIV).map((tab) => {
                return tab.id;
            })
        ).toEqual(['missing', 'stale', 'loss-deep', 'loss-shallow', 'profit-big', 'profit-small']);
    });

    it('sorts an uncoloured tab last — it is neither a problem nor a success', () => {
        const roster = [person({ id: 'quiet', totalProfit: null }), person({ id: 'earner', totalProfit: 1 })];

        expect(buyerTabs(roster, NOON_KYIV)[0]?.id).toBe('earner');
    });

    it('falls back to nickname order where there is no number to rank on', () => {
        const roster = [
            person({ id: 'b', nickname: 'bob', lastTakenAt: null, totalProfit: null }),
            person({ id: 'a', nickname: 'ann', lastTakenAt: null, totalProfit: null }),
        ];

        expect(
            buyerTabs(roster, NOON_KYIV).map((tab) => {
                return tab.nickname;
            })
        ).toEqual(['ann', 'bob']);
    });

    it('does not mutate the roster it was given', () => {
        const roster = [person({ id: 'b', totalProfit: 1 }), person({ id: 'a', totalProfit: 9 })];

        buyerTabs(roster, NOON_KYIV);

        expect(roster[0]?.id).toBe('b');
    });
});

// The dollar-free tab row (#10). A Designer/BDM roster carries no `totalProfit` FIELD at all — the
// server never selects one for them — which is a different thing from a push that froze no rollup,
// and must not be told apart wrongly: they have reported, they simply have no money to be graded on.
describe('buyerTabState without a dollar dimension', () => {
    const dimensionPerson = (over: Partial<DynamicsDimensionRosterUser> & { id: string }) => {
        return {
            nickname: over.id,
            role: 'buyer' as const,
            teamId: 't1',
            teamName: 'Alpha',
            lastTakenAt: NOON_KYIV.toISOString(),
            ...over,
        };
    };

    it('calls a push with no money dimension reported, never awaited', () => {
        expect(buyerTabState(dimensionPerson({ id: 'ann' }), NOON_KYIV)).toBe('reported');
    });

    it('still paints a silent buyer missing past the deadline', () => {
        const silent = dimensionPerson({ id: 'bob', lastTakenAt: null });

        expect(buyerTabState(silent, NOON_KYIV)).toBe('missing');
        expect(buyerTabState(silent, NINE_KYIV)).toBe('awaited');
    });

    it('still warns on a stale push', () => {
        const stale = dimensionPerson({ id: 'cid', lastTakenAt: '2026-08-26T04:00:00Z' });

        expect(buyerTabState(stale, NOON_KYIV)).toBe('stale');
    });

    it('orders problems first, then everyone who reported, by nickname', () => {
        const tabs = buyerTabs(
            [
                dimensionPerson({ id: 'zoe' }),
                dimensionPerson({ id: 'ann' }),
                dimensionPerson({ id: 'bob', lastTakenAt: null }),
            ],
            NOON_KYIV
        );

        expect(
            tabs.map((tab) => {
                return tab.id;
            })
        ).toEqual(['bob', 'ann', 'zoe']);
    });
});
