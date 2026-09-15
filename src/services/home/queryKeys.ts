import type { HomeRangeInput } from './schemas';

export const homeKeys = {
    all: ['home'] as const,
    // Keyed by the resolved window, not the token: `month` and a custom window over the same dates
    // share one cache entry, which is exactly right.
    geoQueryKey(range: HomeRangeInput) {
        return [...homeKeys.all, 'geo', range.from, range.to] as const;
    },
};
