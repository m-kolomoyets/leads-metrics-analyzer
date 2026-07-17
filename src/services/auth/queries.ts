import type { ActivateInput, LoginInput } from './schemas';
import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { activateFn, loginFn, logoutFn, meFn } from './functions';
import { authKeys } from './queryKeys';

export const meQueryOptions = () => {
    return queryOptions({
        queryKey: authKeys.meQueryKey(),
        queryFn() {
            return meFn();
        },
        // staleTime 0: route guards revalidate the session on every navigation, so a revoked
        // session (deleted row / disabled user) takes effect on the next request, not up to a
        // minute later. The httpOnly cookie makes the server round-trip cheap.
        staleTime: 0,
    });
};

export const loginMutationOptions = () => {
    return mutationOptions({
        mutationKey: authKeys.loginMutationKey(),
        mutationFn(data: LoginInput) {
            return loginFn({ data });
        },
        onSuccess(data, _variables, _onMutateResult, { client }) {
            // Prime the `me` cache with the authenticated user. Using ensureQueryData here would
            // return the still-fresh `null` from the pre-login check and bounce the auth guard.
            client.setQueryData(authKeys.meQueryKey(), data);
        },
    });
};

export const activateMutationOptions = () => {
    return mutationOptions({
        mutationKey: authKeys.activateMutationKey(),
        mutationFn(data: ActivateInput) {
            return activateFn({ data });
        },
        onSuccess(data, _variables, _onMutateResult, { client }) {
            // Activation signs the user in — prime the `me` cache so the auth guard passes on redirect.
            client.setQueryData(authKeys.meQueryKey(), data);
        },
    });
};

export const logoutMutationOptions = () => {
    return mutationOptions({
        mutationKey: authKeys.logoutMutationKey(),
        mutationFn() {
            return logoutFn();
        },
    });
};
