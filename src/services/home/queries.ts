import type { HomeRangeInput } from './schemas';
import { queryOptions } from '@tanstack/react-query';
import { listHomeGeoFn } from './functions';
import { homeKeys } from './queryKeys';

export const homeGeoQueryOptions = (range: HomeRangeInput) => {
    return queryOptions({
        queryKey: homeKeys.geoQueryKey(range),
        queryFn() {
            return listHomeGeoFn({ data: range });
        },
    });
};
