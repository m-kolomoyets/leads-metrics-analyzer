import type { CreateSnapshotInput } from './schemas';
import { mutationOptions, queryOptions } from '@tanstack/react-query';
import {
    createSnapshotFn,
    getDimensionRollupFn,
    getSnapshotBundleFn,
    getSnapshotFactsFn,
    getSnapshotFn,
    listSnapshotsFn,
} from './functions';
import { snapshotKeys } from './queryKeys';

export const snapshotsQueryOptions = () => {
    return queryOptions({
        queryKey: snapshotKeys.listQueryKey(),
        queryFn() {
            return listSnapshotsFn();
        },
    });
};

export const snapshotQueryOptions = (id: string) => {
    return queryOptions({
        queryKey: snapshotKeys.detailQueryKey(id),
        queryFn() {
            return getSnapshotFn({ data: { id } });
        },
    });
};

export const snapshotFactsQueryOptions = (id: string) => {
    return queryOptions({
        queryKey: snapshotKeys.factsQueryKey(id),
        queryFn() {
            return getSnapshotFactsFn({ data: { id } });
        },
    });
};

// Everything the detailed report rebuilds from, in one read (#54). Loaded by the report route; the
// facts query stays separate for callers that only need the rows.
export const snapshotBundleQueryOptions = (id: string) => {
    return queryOptions({
        queryKey: snapshotKeys.bundleQueryKey(id),
        queryFn() {
            return getSnapshotBundleFn({ data: { id } });
        },
    });
};

export const dimensionRollupQueryOptions = () => {
    return queryOptions({
        queryKey: snapshotKeys.dimensionRollupQueryKey(),
        queryFn() {
            return getDimensionRollupFn();
        },
    });
};

export const createSnapshotMutationOptions = () => {
    return mutationOptions({
        mutationKey: snapshotKeys.createMutationKey(),
        mutationFn(data: CreateSnapshotInput) {
            return createSnapshotFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: snapshotKeys.listQueryKey() });
        },
    });
};
