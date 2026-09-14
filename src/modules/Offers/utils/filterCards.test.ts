import type { OffersSearch } from '../schemas';
import type { OfferFilterSubject } from './filterCards';
import { describe, expect, it } from 'vitest';
import { filterOfferCards, matchesOfferSearch } from './filterCards';

const subject = (overrides: Partial<OfferFilterSubject> = {}): OfferFilterSubject => {
    return {
        offerId: '13002',
        rawString: 'CL | Aldex | CPA | 27 USD | Falcons | MbChips',
        teamId: 'falcons',
        buyerUserId: 'mbchips',
        archivedAt: null,
        deadline: null,
        deadlineState: 'neutral',
        hasClaim: false,
        ...overrides,
    };
};

const search = (overrides: Partial<OffersSearch> = {}): OffersSearch => {
    return { archived: false, ...overrides };
};

describe('matchesOfferSearch', () => {
    it('matches the offer id and the raw string, case-insensitively', () => {
        expect(matchesOfferSearch(subject(), '130')).toBe(true);
        expect(matchesOfferSearch(subject(), 'aldex')).toBe(true);
        expect(matchesOfferSearch(subject(), 'Wolves')).toBe(false);
    });

    it('matches everything on a blank query', () => {
        expect(matchesOfferSearch(subject(), '')).toBe(true);
        expect(matchesOfferSearch(subject(), '  ')).toBe(true);
    });
});

describe('filterOfferCards', () => {
    const live = subject();
    const archived = subject({ offerId: '13003', archivedAt: '2026-09-01T00:00:00.000Z' });
    const teamWide = subject({ offerId: '13004', buyerUserId: null });
    const otherTeam = subject({ offerId: '13005', teamId: 'wolves', buyerUserId: 'echo' });
    const all = [live, archived, teamWide, otherTeam];

    it('hides archived cards by default and shows only them when asked', () => {
        expect(filterOfferCards(all, search())).toEqual([live, teamWide, otherTeam]);
        expect(filterOfferCards(all, search({ archived: true }))).toEqual([archived]);
    });

    it('narrows by team and by buyer', () => {
        expect(filterOfferCards(all, search({ team: 'falcons' }))).toEqual([live, teamWide]);
        expect(filterOfferCards(all, search({ buyer: 'mbchips' }))).toEqual([live]);
        expect(filterOfferCards(all, search({ team: 'wolves', buyer: 'mbchips' }))).toEqual([]);
    });

    it('reads deadline presence and state, and claim presence, off the subject', () => {
        const withDeadline = subject({ offerId: '2', deadline: '2026-10-01', deadlineState: 'neutral' });
        const dueSoon = subject({ offerId: '4', deadline: '2026-09-15', deadlineState: 'due-soon' });
        const overdue = subject({ offerId: '5', deadline: '2026-09-01', deadlineState: 'overdue' });
        const withClaim = subject({ offerId: '3', hasClaim: true });
        const cards = [live, withDeadline, dueSoon, overdue, withClaim];

        expect(filterOfferCards(cards, search({ deadline: 'any' }))).toEqual([withDeadline, dueSoon, overdue]);
        expect(filterOfferCards(cards, search({ deadline: 'none' }))).toEqual([live, withClaim]);
        expect(filterOfferCards(cards, search({ deadline: 'due-soon' }))).toEqual([dueSoon]);
        expect(filterOfferCards(cards, search({ deadline: 'overdue' }))).toEqual([overdue]);
        expect(filterOfferCards(cards, search({ claim: 'yes' }))).toEqual([withClaim]);
        expect(filterOfferCards(cards, search({ claim: 'no' }))).toEqual([live, withDeadline, dueSoon, overdue]);
    });

    it('combines the search with the filters', () => {
        expect(filterOfferCards(all, search({ q: '1300', team: 'wolves' }))).toEqual([otherTeam]);
        expect(filterOfferCards(all, search({ q: '13003' }))).toEqual([]);
        expect(filterOfferCards(all, search({ q: '13003', archived: true }))).toEqual([archived]);
    });
});
