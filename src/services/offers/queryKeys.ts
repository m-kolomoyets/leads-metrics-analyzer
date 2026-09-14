import type { RatingPeriod } from '@/lib/domain/offerRating';

export const offerKeys = {
    all: ['offers'] as const,
    listQueryKey() {
        return [...offerKeys.all, 'list'] as const;
    },
    attentionQueryKey() {
        return [...offerKeys.all, 'attention'] as const;
    },
    createMutationKey() {
        return [...offerKeys.all, 'create'] as const;
    },
    retryFxMutationKey() {
        return [...offerKeys.all, 'retry-fx'] as const;
    },
    unlistedQueryKey() {
        return [...offerKeys.all, 'unlisted'] as const;
    },
    archiveMutationKey() {
        return [...offerKeys.all, 'archive'] as const;
    },
    unarchiveMutationKey() {
        return [...offerKeys.all, 'unarchive'] as const;
    },
    assigneesQueryKey() {
        return [...offerKeys.all, 'assignees'] as const;
    },
    changeAssignmentMutationKey() {
        return [...offerKeys.all, 'change-assignment'] as const;
    },
    threadQueryKey(offerCardId: string) {
        return [...offerKeys.all, 'thread', offerCardId] as const;
    },
    addCommentMutationKey() {
        return [...offerKeys.all, 'add-comment'] as const;
    },
    editCommentMutationKey() {
        return [...offerKeys.all, 'edit-comment'] as const;
    },
    deleteCommentMutationKey() {
        return [...offerKeys.all, 'delete-comment'] as const;
    },
    markSeenMutationKey() {
        return [...offerKeys.all, 'mark-seen'] as const;
    },
    setDeadlineMutationKey() {
        return [...offerKeys.all, 'set-deadline'] as const;
    },
    ratingQueryKey(offerId: string, period: RatingPeriod) {
        return [...offerKeys.all, 'rating', offerId, period] as const;
    },
    updateClaimMutationKey() {
        return [...offerKeys.all, 'update-claim'] as const;
    },
};
