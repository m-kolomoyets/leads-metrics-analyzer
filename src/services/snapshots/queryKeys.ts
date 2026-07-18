export const snapshotKeys = {
    all: ['snapshots'] as const,
    listQueryKey() {
        return [...snapshotKeys.all, 'list'] as const;
    },
    detailQueryKey(id: string) {
        return [...snapshotKeys.all, 'detail', id] as const;
    },
    factsQueryKey(id: string) {
        return [...snapshotKeys.all, 'facts', id] as const;
    },
    dimensionRollupQueryKey() {
        return [...snapshotKeys.all, 'dimension-rollup'] as const;
    },
    createMutationKey() {
        return [...snapshotKeys.all, 'create'] as const;
    },
};
