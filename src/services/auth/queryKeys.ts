export const authKeys = {
    all: ['auth'] as const,
    meQueryKey() {
        return [...authKeys.all, 'me'] as const;
    },
    loginMutationKey() {
        return [...authKeys.all, 'login'] as const;
    },
    activateMutationKey() {
        return [...authKeys.all, 'activate'] as const;
    },
    logoutMutationKey() {
        return [...authKeys.all, 'logout'] as const;
    },
};
