import type { Locale } from '@/components/report/utils/i18n';
import type { ReportRange } from '@/modules/Dashboard/types';
import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import { reportQueryOptions, visibleUsersQueryOptions } from '@/services/reports/queries';
import { RangePicker } from '@/modules/Dashboard/components/RangePicker';
import { buildReport } from '@/modules/Dashboard/utils/buildReport';
import { resolveRange, todayISO } from '@/modules/Dashboard/utils/range';
import { MainLayoutHeader } from '@/components/layouts/MainLayoutHeader';
import { LOCALES, ui } from '@/components/report/utils/i18n';
import { Button } from '@/components/ui/Button';
import { DateGroup } from './components/DateGroup';

const routeApi = getRouteApi('/_authenticated/dashboard/archive');

// The Report archive (S5, #57): the same Snapshots the feed shows, grouped the other way round —
// report date first, then person — so an overseer can answer "what happened on 12 June?" (ADR-0016).
//
// It reads through the same two queries and the same `buildReport` seam as the feed; only the mode
// differs, and with it the grouping axis and the fact that every version survives rather than the
// latest per (user × date). The range picker is the page's primary control, defaulted to a week.
function Archive() {
    const search = routeApi.useSearch();
    const navigate = routeApi.useNavigate();
    const [locale, setLocale] = useState<Locale>('uk');

    const range: ReportRange = { range: search.range, from: search.from, to: search.to };
    const today = todayISO();
    const resolved = resolveRange(range, today);

    const { data: users } = useSuspenseQuery(visibleUsersQueryOptions());
    const { data: snapshots } = useSuspenseQuery(reportQueryOptions(resolved));

    const report = buildReport({ users, snapshots, range, today, mode: 'archive' });

    function changeRange(next: ReportRange) {
        // Replaced rather than pushed, as on the feed: the custom date inputs fire per keystroke.
        navigate({ search: { range: next.range, from: next.from, to: next.to }, replace: true });
    }

    return (
        <>
            <MainLayoutHeader>
                <h1 className="text-xl">{ui('archive', locale)}</h1>

                {/* The range travels with the link, so moving between the two surfaces never costs a
                    re-pick (spec story 21). Both pages validate the same three params. */}
                <Button size="xs" variant="ghost" render={<Link to="/dashboard" search={search} />}>
                    {ui('feed', locale)}
                </Button>

                <span className="flex-1" />
                <div className="flex gap-1" role="group" aria-label="Language">
                    {LOCALES.map((code) => {
                        return (
                            <Button
                                key={code}
                                type="button"
                                size="xs"
                                variant={code === locale ? 'default' : 'ghost'}
                                onClick={() => {
                                    setLocale(code);
                                }}
                            >
                                {code.toUpperCase()}
                            </Button>
                        );
                    })}
                </div>
            </MainLayoutHeader>

            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <RangePicker range={range} onChange={changeRange} locale={locale} />
                    <span className="text-muted-foreground font-mono text-xs">
                        {report.from} → {report.to}
                    </span>
                </div>

                {/* No roster of quiet users here: the archive lists days that happened, and a day
                    nobody reported is not a row (the feed is where absence is the point). */}
                {report.dates.length === 0 ? (
                    <p className="text-muted-foreground text-sm">{ui('archiveEmpty', locale)}</p>
                ) : (
                    report.dates.map((group) => {
                        return <DateGroup key={group.reportDate} group={group} locale={locale} />;
                    })
                )}
            </div>
        </>
    );
}

export { Archive };
