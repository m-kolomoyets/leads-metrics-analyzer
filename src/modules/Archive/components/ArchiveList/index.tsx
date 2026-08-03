import type { Locale } from '@/components/report/utils/i18n';
import type { ReportRange, ResolvedRange } from '@/modules/Dashboard/types';
import type { ReportRosterUser } from '@/services/reports/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { reportQueryOptions } from '@/services/reports/queries';
import { buildReport } from '@/modules/Dashboard/utils/buildReport';
import { ui } from '@/components/report/utils/i18n';
import { DateGroup } from '../DateGroup';

type ArchiveListProps = {
    users: ReportRosterUser[];
    range: ReportRange;
    resolved: ResolvedRange;
    today: string;
    // The person the archive is narrowed to, or undefined for everybody.
    userId: string | undefined;
    locale: Locale;
};

// The half of the archive that depends on the range, split out so it can suspend on its own — the
// range picker and the person chip above it stay mounted while this refetches.
function ArchiveList({ users, range, resolved, today, userId, locale }: ArchiveListProps) {
    const { data: snapshots } = useSuspenseQuery(reportQueryOptions(resolved));

    const report = buildReport({ users, snapshots, range, today, mode: 'archive', userId });

    // No roster of quiet users here: the archive lists days that happened, and a day nobody reported
    // is not a row (the feed is where absence is the point).
    if (report.dates.length === 0) {
        return <p className="text-muted-foreground text-sm">{ui('archiveEmpty', locale)}</p>;
    }

    return (
        <>
            {report.dates.map((group) => {
                return <DateGroup key={group.reportDate} group={group} locale={locale} />;
            })}
        </>
    );
}

export { ArchiveList };
