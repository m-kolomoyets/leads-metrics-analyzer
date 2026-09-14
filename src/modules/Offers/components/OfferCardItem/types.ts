import type { DeadlineState } from '@/lib/domain/deadline';
import type { OfferCardView } from '@/services/offers/types';

export type OfferCardItemProps = {
    card: OfferCardView;
    // Judged by the page against Kyiv's today, so every card on it reads one day.
    deadlineState: DeadlineState;
    canEditDeadline: boolean;
    // The search text, for painting hits in the id and caption.
    query: string;
    canRetryFx: boolean;
    canArchive: boolean;
    canChangeAssignment: boolean;
    canComment: boolean;
};
