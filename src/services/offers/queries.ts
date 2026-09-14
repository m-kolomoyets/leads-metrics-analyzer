import type { CreateOfferCardInput, OfferCardIdInput, RetryOfferFxInput } from './schemas';
import { mutationOptions, queryOptions } from '@tanstack/react-query';
import {
    archiveOfferCardFn,
    createOfferCardFn,
    listOfferCardsFn,
    listUnlistedOffersFn,
    retryOfferFxFn,
    unarchiveOfferCardFn,
} from './functions';
import { offerKeys } from './queryKeys';

export const offerCardsQueryOptions = () => {
    return queryOptions({
        queryKey: offerKeys.listQueryKey(),
        queryFn() {
            return listOfferCardsFn();
        },
    });
};

export const unlistedOffersQueryOptions = () => {
    return queryOptions({
        queryKey: offerKeys.unlistedQueryKey(),
        queryFn() {
            return listUnlistedOffersFn();
        },
    });
};

export const createOfferCardMutationOptions = () => {
    return mutationOptions({
        mutationKey: offerKeys.createMutationKey(),
        mutationFn(data: CreateOfferCardInput) {
            return createOfferCardFn({ data });
        },
        onSuccess(result, _variables, _onMutateResult, { client }) {
            // A refused create (parse failure, duplicate) wrote nothing — nothing to refetch. A
            // successful one may have listed an Unlisted Offer, so both reads go.
            if (result.ok) {
                client.invalidateQueries({ queryKey: offerKeys.all });
            }
        },
    });
};

export const retryOfferFxMutationOptions = () => {
    return mutationOptions({
        mutationKey: offerKeys.retryFxMutationKey(),
        mutationFn(data: RetryOfferFxInput) {
            return retryOfferFxFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: offerKeys.listQueryKey() });
        },
    });
};

// Archiving frees the `offer_id` — the offer may resurface as Unlisted — so both reads go stale.
export const archiveOfferCardMutationOptions = () => {
    return mutationOptions({
        mutationKey: offerKeys.archiveMutationKey(),
        mutationFn(data: OfferCardIdInput) {
            return archiveOfferCardFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: offerKeys.all });
        },
    });
};

export const unarchiveOfferCardMutationOptions = () => {
    return mutationOptions({
        mutationKey: offerKeys.unarchiveMutationKey(),
        mutationFn(data: OfferCardIdInput) {
            return unarchiveOfferCardFn({ data });
        },
        onSuccess(result, _variables, _onMutateResult, { client }) {
            if (result.ok) {
                client.invalidateQueries({ queryKey: offerKeys.all });
            }
        },
    });
};
