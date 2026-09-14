import type { UserRole } from '@/lib/constants';
import type { OfferCapability, OfferSubject } from './offerAccess';
import type { Viewer } from './scope';
import { USER_ROLES } from '@/lib/constants';
import { canOffer, OFFER_CAPABILITIES, offerAccessFor } from './offerAccess';

// Offer Card visibility + capabilities (offers-and-home PRD), the pure seam beside `snapshotAccessFor`.
// Visibility follows the Assignment: a buyer sees cards for them or for their whole team, a team lead
// their team's, bdm/head everything. An Unresolved card names nobody, so only the roles that can fix
// it (bdm/head) see it at all. Designer never sees an offer.
describe('offerAccessFor', () => {
    const TEAM = 'team-1';
    const OTHER_TEAM = 'team-2';
    const BUYER = 'buyer-1';
    const OTHER_BUYER = 'buyer-2';

    const viewer = (role: UserRole, overrides: Partial<Viewer> = {}): Viewer => {
        return { id: BUYER, role, teamId: TEAM, ...overrides };
    };
    const teamWide: OfferSubject = { teamId: TEAM, buyerUserId: null, isAssignmentUnresolved: false };
    const mine: OfferSubject = { teamId: TEAM, buyerUserId: BUYER, isAssignmentUnresolved: false };
    const theirs: OfferSubject = { teamId: TEAM, buyerUserId: OTHER_BUYER, isAssignmentUnresolved: false };
    const otherTeam: OfferSubject = { teamId: OTHER_TEAM, buyerUserId: null, isAssignmentUnresolved: false };
    const unresolved: OfferSubject = { teamId: null, buyerUserId: null, isAssignmentUnresolved: true };
    const unresolvedBuyer: OfferSubject = { teamId: TEAM, buyerUserId: null, isAssignmentUnresolved: true };

    it('lets head and bdm read every resolved card', () => {
        for (const role of ['head', 'bdm'] as const) {
            expect(offerAccessFor(viewer(role, { teamId: null }), teamWide)).toBe('read');
            expect(offerAccessFor(viewer(role, { teamId: null }), theirs)).toBe('read');
            expect(offerAccessFor(viewer(role, { teamId: null }), otherTeam)).toBe('read');
        }
    });

    it('shows an Unresolved card to bdm and head only', () => {
        for (const role of USER_ROLES) {
            const expected = role === 'head' || role === 'bdm' ? 'read' : 'none';

            expect(offerAccessFor(viewer(role), unresolved)).toBe(expected);
            expect(offerAccessFor(viewer(role), unresolvedBuyer)).toBe(expected);
        }
    });

    it('scopes a team lead to their own team, whoever the buyer is', () => {
        expect(offerAccessFor(viewer('team_lead'), teamWide)).toBe('read');
        expect(offerAccessFor(viewer('team_lead'), theirs)).toBe('read');
        expect(offerAccessFor(viewer('team_lead'), otherTeam)).toBe('none');
    });

    it('gives an unplaced team lead nothing', () => {
        expect(offerAccessFor(viewer('team_lead', { teamId: null }), teamWide)).toBe('none');
    });

    it('scopes a buyer to cards for them or for their whole team', () => {
        expect(offerAccessFor(viewer('buyer'), mine)).toBe('read');
        expect(offerAccessFor(viewer('buyer'), teamWide)).toBe('read');
        expect(offerAccessFor(viewer('buyer'), theirs)).toBe('none');
        expect(offerAccessFor(viewer('buyer'), otherTeam)).toBe('none');
    });

    it('keeps a buyer moved off the team away from its team-wide cards, but on their own', () => {
        expect(offerAccessFor(viewer('buyer', { teamId: OTHER_TEAM }), teamWide)).toBe('none');
        expect(offerAccessFor(viewer('buyer', { teamId: OTHER_TEAM }), mine)).toBe('read');
    });

    it('denies a designer everywhere', () => {
        for (const subject of [teamWide, mine, unresolved]) {
            expect(offerAccessFor(viewer('designer'), subject)).toBe('none');
        }
    });
});

describe('canOffer', () => {
    const expected: Record<OfferCapability, readonly UserRole[]> = {
        create: ['head', 'team_lead', 'bdm'],
        editClaim: ['head', 'bdm'],
        editDeadline: ['head', 'team_lead', 'bdm'],
        changeAssignment: ['head', 'bdm'],
        archive: ['head', 'bdm'],
        comment: ['head', 'team_lead', 'buyer', 'bdm'],
        seeRating: ['head', 'team_lead', 'bdm'],
        seeClaimGap: ['head', 'team_lead', 'bdm'],
    };

    it.each(OFFER_CAPABILITIES)('grants %s to exactly the roles the PRD names', (capability) => {
        for (const role of USER_ROLES) {
            expect(canOffer(role, capability)).toBe(expected[capability].includes(role));
        }
    });

    it('denies an absent role', () => {
        expect(canOffer(undefined, 'create')).toBe(false);
    });
});
