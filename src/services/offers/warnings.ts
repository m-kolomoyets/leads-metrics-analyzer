import type { OfferCardView } from './types';

// The warnings a card carries, derived from the card itself so the create response and the list
// agree without a separate flag. An Unresolved Assignment names the side that matched nobody with
// the raw text the string used; a pending rate means the Payout is not in USD yet (ADR-0027).
export type OfferWarning =
    | { kind: 'team_unresolved'; text: string }
    | { kind: 'buyer_unresolved'; text: string }
    | { kind: 'fx_pending'; text: null };

export const offerWarnings = (card: OfferCardView): OfferWarning[] => {
    const warnings: OfferWarning[] = [];

    if (card.isAssignmentUnresolved) {
        // A missing team is the whole Assignment's problem; only with the team found is the buyer
        // the one who is missing.
        if (card.teamId === null) {
            warnings.push({ kind: 'team_unresolved', text: card.assignedTeamText });
        } else if (card.buyerUserId === null) {
            warnings.push({ kind: 'buyer_unresolved', text: card.assignedRecipientText });
        }
    }

    if (card.fxStatus === 'pending') {
        warnings.push({ kind: 'fx_pending', text: null });
    }

    return warnings;
};
