import type { OfferCardView } from '@/services/offers/types';

export type OfferCardItemProps = {
    card: OfferCardView;
    // The search text, for painting hits in the id and caption.
    query: string;
    canRetryFx: boolean;
    canArchive: boolean;
    canChangeAssignment: boolean;
    canComment: boolean;
};
