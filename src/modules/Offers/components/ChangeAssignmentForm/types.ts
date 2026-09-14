import type { OfferCardView } from '@/services/offers/types';

export type ChangeAssignmentFormProps = {
    card: OfferCardView;
    onSuccess: (card: OfferCardView) => void;
};
