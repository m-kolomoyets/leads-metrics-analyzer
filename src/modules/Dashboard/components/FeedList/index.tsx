import type { Locale } from '@/components/report/utils/i18n';
import type { ReportRosterUser } from '@/services/reports/types';
import type { ReportRange, ResolvedRange } from '../../types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { reportQueryOptions } from '@/services/reports/queries';
import { ui } from '@/components/report/utils/i18n';
import { Accordion } from '@/components/ui/Accordion';
import { buildReport } from '../../utils/buildReport';
import { UserGroup } from '../UserGroup';

type FeedListProps = {
    users: ReportRosterUser[];
    range: ReportRange;
    resolved: ResolvedRange;
    today: string;
    locale: Locale;
};

// The half of the feed that depends on the range, split out so it can suspend on its own. The page
// keeps the header and the range picker mounted while this refetches; only this block shows a loader.
function FeedList({ users, range, resolved, today, locale }: FeedListProps) {
    const { data: snapshots } = useSuspenseQuery(reportQueryOptions(resolved));

    const report = buildReport({ users, snapshots, range, today, mode: 'feed' });

    if (report.users.length === 0) {
        return <p className="text-muted-foreground text-sm">{ui('noUsersVisible', locale)}</p>;
    }

    return (
        // Multiple panels open at once: an overseer compares people, and a single-open accordion would
        // make that a click-per-comparison.
        <Accordion className="gap-3" multiple>
            {report.users.map((group) => {
                return <UserGroup key={group.user.id} group={group} locale={locale} />;
            })}
        </Accordion>
    );
}

export { FeedList };
