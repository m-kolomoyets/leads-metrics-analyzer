export const authKeys = {
    all: ['auth'] as const,
    meQueryKey() {
        return [...authKeys.all, 'me'] as const;
    },
    loginMutationKey() {
        return [...authKeys.all, 'login'] as const;
    },
    logoutMutationKey() {
        return [...authKeys.all, 'logout'] as const;
    },
};
