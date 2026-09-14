import type { OfferCardView } from '@/services/offers/types';

export type OfferThreadProps = {
    card: OfferCardView;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    // The viewer's `comment` capability; the card adds "archived ⇒ closed" on top.
    canComment: boolean;
};
