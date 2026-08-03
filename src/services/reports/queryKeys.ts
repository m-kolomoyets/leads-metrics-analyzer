import type { ReportRangeInput } from './schemas';

export const reportKeys = {
    all: ['reports'] as const,
    // Keyed by the resolved range, not the token: two tokens can resolve to the same window, and a
    // shared cache entry is exactly right when they do.
    listQueryKey(range: ReportRangeInput) {
        return [...reportKeys.all, 'list', range.from, range.to] as const;
    },
    visibleUsersQueryKey() {
        return [...reportKeys.all, 'visible-users'] as const;
    },
};
