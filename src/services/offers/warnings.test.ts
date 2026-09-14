import type { OfferCardView } from './types';
import { offerWarnings } from './warnings';

// Which warnings a card wears (offers-and-home/04): an Unresolved Assignment names the missing side
// (team or buyer, with the raw text), a pending rate says the Payout is not fixed yet. Derived from
// the card, so the create response and the list read the same thing.
describe('offerWarnings', () => {
    const base: OfferCardView = {
        id: 'c1',
        offerId: '13002',
        rawString: 'CPA | 27 USD | Falcons | Falcons',
        payoutOriginal: 27,
        payoutCurrency: 'USD',
        fxStatus: 'fixed',
        fxRate: 1,
        fxFetchedAt: '2026-09-14T10:00:00.000Z',
        payoutUsd: 27,
        assignedTeamText: 'Falcons',
        assignedRecipientText: 'Falcons',
        teamId: 't1',
        teamName: 'Falcons',
        buyerUserId: null,
        buyerNickname: null,
        isAssignmentUnresolved: false,
        createdByUserId: 'u1',
        createdByNickname: 'ihor',
        createdAt: '2026-09-14T10:00:00.000Z',
        archivedAt: null,
        unreadCount: 0,
        access: 'read',
    };

    it('has none for a resolved, fixed card', () => {
        expect(offerWarnings(base)).toEqual([]);
    });

    it('names the team when it matched nobody', () => {
        expect(
            offerWarnings({
                ...base,
                isAssignmentUnresolved: true,
                teamId: null,
                teamName: null,
                assignedTeamText: 'Hawks',
            })
        ).toEqual([{ kind: 'team_unresolved', text: 'Hawks' }]);
    });

    it('names the buyer when the team matched but the recipient did not', () => {
        expect(offerWarnings({ ...base, isAssignmentUnresolved: true, assignedRecipientText: 'Ghost' })).toEqual([
            { kind: 'buyer_unresolved', text: 'Ghost' },
        ]);
    });

    it('flags a pending rate, after any assignment warning', () => {
        expect(
            offerWarnings({
                ...base,
                isAssignmentUnresolved: true,
                teamId: null,
                fxStatus: 'pending',
                fxRate: null,
                payoutUsd: null,
            })
        ).toEqual([
            { kind: 'team_unresolved', text: 'Falcons' },
            { kind: 'fx_pending', text: null },
        ]);
    });
});
