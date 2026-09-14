import type { OfferCardView } from '@/services/offers/types';

export type CreateOfferCardFormProps = {
    onSuccess: (card: OfferCardView) => void;
};
