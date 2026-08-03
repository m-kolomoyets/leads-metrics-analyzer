import type { ReportRangeInput } from './schemas';
import { queryOptions } from '@tanstack/react-query';
import { listReportFn, listVisibleUsersFn } from './functions';
import { reportKeys } from './queryKeys';

export const reportQueryOptions = (range: ReportRangeInput) => {
    return queryOptions({
        queryKey: reportKeys.listQueryKey(range),
        queryFn() {
            return listReportFn({ data: range });
        },
    });
};

export const visibleUsersQueryOptions = () => {
    return queryOptions({
        queryKey: reportKeys.visibleUsersQueryKey(),
        queryFn() {
            return listVisibleUsersFn();
        },
    });
};
