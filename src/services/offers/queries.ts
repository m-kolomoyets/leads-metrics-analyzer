import type { CreateOfferCardInput, RetryOfferFxInput } from './schemas';
import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { createOfferCardFn, listOfferCardsFn, retryOfferFxFn } from './functions';
import { offerKeys } from './queryKeys';

export const offerCardsQueryOptions = () => {
    return queryOptions({
        queryKey: offerKeys.listQueryKey(),
        queryFn() {
            return listOfferCardsFn();
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
            // A refused create (parse failure, duplicate) wrote nothing — nothing to refetch.
            if (result.ok) {
                client.invalidateQueries({ queryKey: offerKeys.listQueryKey() });
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
