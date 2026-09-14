export const offerKeys = {
    all: ['offers'] as const,
    listQueryKey() {
        return [...offerKeys.all, 'list'] as const;
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
};
