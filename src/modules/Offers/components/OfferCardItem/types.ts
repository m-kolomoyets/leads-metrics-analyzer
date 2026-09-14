import type { OfferCardView } from '@/services/offers/types';

export type OfferCardItemProps = {
    card: OfferCardView;
    // Whether the viewer may retry a pending rate (the create roles).
    canRetryFx: boolean;
};
