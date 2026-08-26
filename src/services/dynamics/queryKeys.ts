import type { DynamicsDayInput, DynamicsRosterInput } from './schemas';

export const dynamicsKeys = {
    all: ['dynamics'] as const,
    // Keyed by buyer and day: switching tabs must not refetch the day already in cache, and a day is
    // the smallest thing this page ever invalidates.
    dayQueryKey(input: DynamicsDayInput) {
        return [...dynamicsKeys.all, 'day', input.buyerId, input.reportDate] as const;
    },
    rosterQueryKey(input: DynamicsRosterInput) {
        return [...dynamicsKeys.all, 'roster', input.reportDate] as const;
    },
};
