import type { UnlistedOfferView } from '@/services/offers/types';

export type UnlistedOffersProps = {
    offers: UnlistedOfferView[];
    query: string;
    canCreate: boolean;
    onCreate: (offer: UnlistedOfferView) => void;
};
