import type { DynamicsDayInput, DynamicsDimensionDayInput, DynamicsHistoryInput, DynamicsRosterInput } from './schemas';

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
    // The dollar-free frames are keyed apart from the trajectory reads: they answer a different
    // question over the same day, and the dimension is part of what was asked for.
    dimensionRosterQueryKey(input: DynamicsRosterInput) {
        return [...dynamicsKeys.all, 'dimension-roster', input.reportDate] as const;
    },
    // The month behind the day picker, keyed by its range: a page that moves to another day inside
    // the same month must not refetch the heatmap it is already showing.
    historyQueryKey(input: DynamicsHistoryInput) {
        return [...dynamicsKeys.all, 'history', input.from, input.to] as const;
    },
    dimensionHistoryQueryKey(input: DynamicsHistoryInput) {
        return [...dynamicsKeys.all, 'dimension-history', input.from, input.to] as const;
    },
    dimensionDayQueryKey(input: DynamicsDimensionDayInput) {
        return [...dynamicsKeys.all, 'dimension-day', input.dimension, input.buyerId, input.reportDate] as const;
    },
};
