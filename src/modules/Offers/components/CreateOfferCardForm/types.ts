import type { CreateOfferCardInput } from '@/services/offers/schemas';
import type { OfferCardView } from '@/services/offers/types';

export type CreateOfferCardFormProps = {
    // Seeded from an Unlisted Offer's "create card" (PRD story 15); empty otherwise.
    defaultValues?: Partial<CreateOfferCardInput>;
    onSuccess: (card: OfferCardView) => void;
};
