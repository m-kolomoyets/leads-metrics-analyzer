export const adminKeys = {
    all: ['admin'] as const,
    usersQueryKey() {
        return [...adminKeys.all, 'users'] as const;
    },
    teamsQueryKey() {
        return [...adminKeys.all, 'teams'] as const;
    },
    createUserMutationKey() {
        return [...adminKeys.all, 'create-user'] as const;
    },
    resendInvitationMutationKey() {
        return [...adminKeys.all, 'resend-invitation'] as const;
    },
    updateUserMutationKey() {
        return [...adminKeys.all, 'update-user'] as const;
    },
    createTeamMutationKey() {
        return [...adminKeys.all, 'create-team'] as const;
    },
    updateTeamMutationKey() {
        return [...adminKeys.all, 'update-team'] as const;
    },
    deleteTeamMutationKey() {
        return [...adminKeys.all, 'delete-team'] as const;
    },
    setTeamLeadMutationKey() {
        return [...adminKeys.all, 'set-team-lead'] as const;
    },
};
