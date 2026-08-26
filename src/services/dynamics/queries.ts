import type { DynamicsDayInput, DynamicsRosterInput } from './schemas';
import { queryOptions } from '@tanstack/react-query';
import { listDayFn, listDayRosterFn } from './functions';
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
