import type { OfferCardView } from '@/services/offers/types';

export type ClaimBlockProps = {
    card: OfferCardView;
    // Whether the viewer may enter or overwrite the claim (bdm/head, `canOffer(role, 'editClaim')`).
    canEdit: boolean;
};
