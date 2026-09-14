import type { DeadlineState } from '@/lib/domain/deadline';
import type { OfferCardView } from '@/services/offers/types';

export type OfferDeadlineProps = {
    card: OfferCardView;
    state: DeadlineState;
    // The role's `editDeadline` capability; the card adds "archived ⇒ read-only" on top.
    canEdit: boolean;
};
