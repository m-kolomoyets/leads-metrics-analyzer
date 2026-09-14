import type { UserRole } from '@/lib/constants';
import type { Viewer } from './scope';

// SERVER-usable pure seam (ADR-0007) for Offer Cards, beside `snapshotAccessFor`. Two questions, no
// DB: may this viewer read this card, and may this role do this to a card. Visibility follows the
// card's Assignment rather than its creator — a BDM issues cards for other people's teams, so the
// creator is the wrong axis. Row-scope holds as everywhere: buyer own (or their whole team), team
// lead their team, bdm/head all. An Unresolved card names nobody, so only the roles that can fix it
// see it (PRD story 7); a Designer has no part in an offer at all (story 18).

// The minimal card identity the verdict needs. `buyerUserId` null on a resolved card means the
// whole team; on an Unresolved one it means nobody yet.
export type OfferSubject = {
    teamId: string | null;
    buyerUserId: string | null;
    isAssignmentUnresolved: boolean;
};

export type OfferAccess = 'read' | 'none';

// A viewer with no team placed (`teamId` null/undefined) matches no team-scoped card.
const isOwnTeam = (viewer: Viewer, subject: OfferSubject): boolean => {
    return typeof viewer.teamId === 'string' && subject.teamId === viewer.teamId;
};

export const offerAccessFor = (viewer: Viewer, subject: OfferSubject): OfferAccess => {
    switch (viewer.role) {
        case 'head':
        case 'bdm': {
            return 'read';
        }
        case 'team_lead': {
            if (subject.isAssignmentUnresolved) {
                return 'none';
            }

            return isOwnTeam(viewer, subject) ? 'read' : 'none';
        }
        case 'buyer': {
            if (subject.isAssignmentUnresolved) {
                return 'none';
            }

            if (subject.buyerUserId !== null) {
                return subject.buyerUserId === viewer.id ? 'read' : 'none';
            }

            return isOwnTeam(viewer, subject) ? 'read' : 'none';
        }
        case 'designer': {
            return 'none';
        }
    }
};

// What a role may do to a card it can read (PRD stories 1–37, 55). Per role, not per card: the card
// itself only adds "archived ⇒ read-only", which the callers apply on top.
export const OFFER_CAPABILITIES = [
    'create',
    'editClaim',
    'editDeadline',
    'changeAssignment',
    'archive',
    'comment',
    'seeRating',
    'seeClaimGap',
] as const;

export type OfferCapability = (typeof OFFER_CAPABILITIES)[number];

const CAPABILITY_ROLES: Record<OfferCapability, readonly UserRole[]> = {
    // BDM, team lead or head paste the string (story 1, brief §01).
    create: ['head', 'team_lead', 'bdm'],
    // The Advertiser Claim is the BDM's record; the Head may correct it (story 19).
    editClaim: ['head', 'bdm'],
    // Buyer sees the Deadline but cannot move it (stories 26–27).
    editDeadline: ['head', 'team_lead', 'bdm'],
    // Fixing an Unresolved card or reassigning one (story 8, slice 06).
    changeAssignment: ['head', 'bdm'],
    archive: ['head', 'bdm'],
    // Anyone with access to a card writes in its Thread (story 30).
    comment: ['head', 'team_lead', 'buyer', 'bdm'],
    // A buyer gets "my stats", never a rating of peers (story 55, 57).
    seeRating: ['head', 'team_lead', 'bdm'],
    // Advertiser negotiations stay with the roles that run them (story 22, 25).
    seeClaimGap: ['head', 'team_lead', 'bdm'],
};

export const canOffer = (role: UserRole | undefined, capability: OfferCapability): boolean => {
    return role !== undefined && CAPABILITY_ROLES[capability].includes(role);
};
