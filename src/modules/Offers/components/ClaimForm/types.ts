import type { OfferCardView } from '@/services/offers/types';

export type ClaimFormProps = {
    card: OfferCardView;
    onSuccess: () => void;
};
