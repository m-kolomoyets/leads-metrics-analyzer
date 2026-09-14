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
};
