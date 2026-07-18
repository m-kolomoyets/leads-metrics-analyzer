import type {
    CreateTeamInput,
    CreateUserInput,
    DeleteTeamInput,
    DeleteUserInput,
    GenerateResetLinkInput,
    ResendInvitationInput,
    UpdateTeamInput,
    UpdateTeamLeadInput,
    UpdateUserInput,
} from './schemas';
import { mutationOptions, queryOptions } from '@tanstack/react-query';
import {
    createTeamFn,
    createUserFn,
    deleteTeamFn,
    deleteUserFn,
    generateResetLinkFn,
    listTeamsFn,
    listUsersFn,
    resendInvitationFn,
    setTeamLeadFn,
    updateTeamFn,
    updateUserFn,
} from './functions';
import { adminKeys } from './queryKeys';

export const usersQueryOptions = () => {
    return queryOptions({
        queryKey: adminKeys.usersQueryKey(),
        queryFn() {
            return listUsersFn();
        },
    });
};

export const teamsQueryOptions = () => {
    return queryOptions({
        queryKey: adminKeys.teamsQueryKey(),
        queryFn() {
            return listTeamsFn();
        },
    });
};

export const createUserMutationOptions = () => {
    return mutationOptions({
        mutationKey: adminKeys.createUserMutationKey(),
        mutationFn(data: CreateUserInput) {
            return createUserFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: adminKeys.usersQueryKey() });
        },
    });
};

export const deleteUserMutationOptions = () => {
    return mutationOptions({
        mutationKey: adminKeys.deleteUserMutationKey(),
        mutationFn(data: DeleteUserInput) {
            return deleteUserFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            // A deleted user may have led a team (now leaderless), so refresh both lists.
            client.invalidateQueries({ queryKey: adminKeys.usersQueryKey() });
            client.invalidateQueries({ queryKey: adminKeys.teamsQueryKey() });
        },
    });
};

export const resendInvitationMutationOptions = () => {
    return mutationOptions({
        mutationKey: adminKeys.resendInvitationMutationKey(),
        mutationFn(data: ResendInvitationInput) {
            return resendInvitationFn({ data });
        },
    });
};

export const generateResetLinkMutationOptions = () => {
    return mutationOptions({
        mutationKey: adminKeys.generateResetLinkMutationKey(),
        mutationFn(data: GenerateResetLinkInput) {
            return generateResetLinkFn({ data });
        },
        // No invalidation: the pending flag persists until the user redeems the link (story 13), so
        // the users list is unchanged by minting.
    });
};

export const updateUserMutationOptions = () => {
    return mutationOptions({
        mutationKey: adminKeys.updateUserMutationKey(),
        mutationFn(data: UpdateUserInput) {
            return updateUserFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: adminKeys.usersQueryKey() });
        },
    });
};

export const createTeamMutationOptions = () => {
    return mutationOptions({
        mutationKey: adminKeys.createTeamMutationKey(),
        mutationFn(data: CreateTeamInput) {
            return createTeamFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: adminKeys.teamsQueryKey() });
        },
    });
};

export const updateTeamMutationOptions = () => {
    return mutationOptions({
        mutationKey: adminKeys.updateTeamMutationKey(),
        mutationFn(data: UpdateTeamInput) {
            return updateTeamFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: adminKeys.teamsQueryKey() });
        },
    });
};

export const deleteTeamMutationOptions = () => {
    return mutationOptions({
        mutationKey: adminKeys.deleteTeamMutationKey(),
        mutationFn(data: DeleteTeamInput) {
            return deleteTeamFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            // Deleting a team unplaces its members server-side (FK set null), so the users list changes too.
            client.invalidateQueries({ queryKey: adminKeys.teamsQueryKey() });
            client.invalidateQueries({ queryKey: adminKeys.usersQueryKey() });
        },
    });
};

export const setTeamLeadMutationOptions = () => {
    return mutationOptions({
        mutationKey: adminKeys.setTeamLeadMutationKey(),
        mutationFn(data: UpdateTeamLeadInput) {
            return setTeamLeadFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            // A lead designation also places that user on the team (server tx), so users list changes too.
            client.invalidateQueries({ queryKey: adminKeys.teamsQueryKey() });
            client.invalidateQueries({ queryKey: adminKeys.usersQueryKey() });
        },
    });
};
