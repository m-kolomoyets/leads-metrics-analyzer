import type { OfferAccess } from '@/lib/auth/offerAccess';
import type { OfferCurrency, OfferStringFragment } from '@/lib/domain/offerString';

// Domain shapes for the Offers API (offers-and-home/04). An Offer Card as returned to the client:
// the raw string (its caption), the Payout fixed per ADR-0027, the Assignment as resolved and as
// named, the creator, and the viewer's verdict — enough to render the list without a second trip.

type OfferFxStatus = 'fixed' | 'pending';

export type OfferCardView = {
    id: string;
    offerId: string;
    rawString: string;
    payoutOriginal: number;
    payoutCurrency: OfferCurrency;
    fxStatus: OfferFxStatus;
    // Null while `fxStatus` is `pending` (ADR-0027).
    fxRate: number | null;
    fxFetchedAt: string | null;
    payoutUsd: number | null;
    assignedTeamText: string;
    assignedRecipientText: string;
    teamId: string | null;
    teamName: string | null;
    // Null for a team-wide offer and for an Unresolved one.
    buyerUserId: string | null;
    buyerNickname: string | null;
    isAssignmentUnresolved: boolean;
    createdByUserId: string;
    createdByNickname: string;
    createdAt: string;
    archivedAt: string | null;
    access: OfferAccess;
};

// The create verdict. Parse failures and a duplicate live `offer_id` are outcomes the form shows
// inline (with the fragment / a link to the existing card), not exceptions — so they travel as data.
export type CreateOfferCardResult =
    | { ok: true; card: OfferCardView }
    | { ok: false; reason: 'parse'; fragment: OfferStringFragment }
    | { ok: false; reason: 'duplicate'; existingCardId: string };
