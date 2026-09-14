import type {
    AddOfferCommentInput,
    ChangeOfferAssignmentInput,
    CreateOfferCardInput,
    EditOfferCommentInput,
    OfferCardIdInput,
    OfferThreadEntryIdInput,
    RetryOfferFxInput,
    SetOfferDeadlineInput,
} from './schemas';
import { mutationOptions, queryOptions } from '@tanstack/react-query';
import {
    addOfferCommentFn,
    archiveOfferCardFn,
    changeOfferAssignmentFn,
    createOfferCardFn,
    deleteOfferCommentFn,
    editOfferCommentFn,
    listOfferAssigneesFn,
    listOfferCardsFn,
    listOfferThreadFn,
    listUnlistedOffersFn,
    markOfferCardSeenFn,
    retryOfferFxFn,
    setOfferDeadlineFn,
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

export const offerAssigneesQueryOptions = () => {
    return queryOptions({
        queryKey: offerKeys.assigneesQueryKey(),
        queryFn() {
            return listOfferAssigneesFn();
        },
    });
};

// A changed Assignment moves the card between people's lists, so the whole directory is refetched
// (offers-and-home/06); a refused pick wrote nothing.
export const changeOfferAssignmentMutationOptions = () => {
    return mutationOptions({
        mutationKey: offerKeys.changeAssignmentMutationKey(),
        mutationFn(data: ChangeOfferAssignmentInput) {
            return changeOfferAssignmentFn({ data });
        },
        onSuccess(result, _variables, _onMutateResult, { client }) {
            if (result.ok) {
                client.invalidateQueries({ queryKey: offerKeys.listQueryKey() });
            }
        },
    });
};

export const offerThreadQueryOptions = (offerCardId: string) => {
    return queryOptions({
        queryKey: offerKeys.threadQueryKey(offerCardId),
        queryFn() {
            return listOfferThreadFn({ data: { offerCardId } });
        },
    });
};

export const addOfferCommentMutationOptions = () => {
    return mutationOptions({
        mutationKey: offerKeys.addCommentMutationKey(),
        mutationFn(data: AddOfferCommentInput) {
            return addOfferCommentFn({ data });
        },
        onSuccess(_data, variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: offerKeys.threadQueryKey(variables.offerCardId) });
        },
    });
};

export const editOfferCommentMutationOptions = (offerCardId: string) => {
    return mutationOptions({
        mutationKey: offerKeys.editCommentMutationKey(),
        mutationFn(data: EditOfferCommentInput) {
            return editOfferCommentFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: offerKeys.threadQueryKey(offerCardId) });
        },
    });
};

export const deleteOfferCommentMutationOptions = (offerCardId: string) => {
    return mutationOptions({
        mutationKey: offerKeys.deleteCommentMutationKey(),
        mutationFn(data: OfferThreadEntryIdInput) {
            return deleteOfferCommentFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: offerKeys.threadQueryKey(offerCardId) });
        },
    });
};

// Opening a card marks it seen (PRD story 34); the list's unread counters read from that mark.
export const markOfferCardSeenMutationOptions = () => {
    return mutationOptions({
        mutationKey: offerKeys.markSeenMutationKey(),
        mutationFn(data: OfferCardIdInput) {
            return markOfferCardSeenFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: offerKeys.listQueryKey() });
        },
    });
};

// A moved Deadline changes the card's mark in the list and writes a Thread entry (slice 09).
export const setOfferDeadlineMutationOptions = () => {
    return mutationOptions({
        mutationKey: offerKeys.setDeadlineMutationKey(),
        mutationFn(data: SetOfferDeadlineInput) {
            return setOfferDeadlineFn({ data });
        },
        onSuccess(_data, variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: offerKeys.listQueryKey() });
            client.invalidateQueries({ queryKey: offerKeys.threadQueryKey(variables.offerCardId) });
        },
    });
};
