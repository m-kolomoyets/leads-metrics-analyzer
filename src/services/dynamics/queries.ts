import type { DynamicsDayInput, DynamicsDimensionDayInput, DynamicsHistoryInput, DynamicsRosterInput } from './schemas';
import { queryOptions } from '@tanstack/react-query';
import {
    listDayFn,
    listDayRosterFn,
    listDimensionDayFn,
    listDimensionMonthHistoryFn,
    listDimensionRosterFn,
    listMonthHistoryFn,
} from './functions';
import { dynamicsKeys } from './queryKeys';

export const dynamicsDayQueryOptions = (input: DynamicsDayInput) => {
    return queryOptions({
        queryKey: dynamicsKeys.dayQueryKey(input),
        queryFn() {
            return listDayFn({ data: input });
        },
    });
};

export const dynamicsRosterQueryOptions = (input: DynamicsRosterInput) => {
    return queryOptions({
        queryKey: dynamicsKeys.rosterQueryKey(input),
        queryFn() {
            return listDayRosterFn({ data: input });
        },
    });
};

export const dynamicsDimensionRosterQueryOptions = (input: DynamicsRosterInput) => {
    return queryOptions({
        queryKey: dynamicsKeys.dimensionRosterQueryKey(input),
        queryFn() {
            return listDimensionRosterFn({ data: input });
        },
    });
};

export const dynamicsDimensionDayQueryOptions = (input: DynamicsDimensionDayInput) => {
    return queryOptions({
        queryKey: dynamicsKeys.dimensionDayQueryKey(input),
        queryFn() {
            return listDimensionDayFn({ data: input });
        },
    });
};

export const dynamicsHistoryQueryOptions = (input: DynamicsHistoryInput) => {
    return queryOptions({
        queryKey: dynamicsKeys.historyQueryKey(input),
        queryFn() {
            return listMonthHistoryFn({ data: input });
        },
    });
};

export const dynamicsDimensionHistoryQueryOptions = (input: DynamicsHistoryInput) => {
    return queryOptions({
        queryKey: dynamicsKeys.dimensionHistoryQueryKey(input),
        queryFn() {
            return listDimensionMonthHistoryFn({ data: input });
        },
    });
};
