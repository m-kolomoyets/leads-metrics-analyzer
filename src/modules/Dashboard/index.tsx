import type { Locale } from '@/components/report/utils/i18n';
import type { ReportRange } from './types';
import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { reportQueryOptions, visibleUsersQueryOptions } from '@/services/reports/queries';
import { MainLayoutHeader } from '@/components/layouts/MainLayoutHeader';
import { LOCALES, ui } from '@/components/report/utils/i18n';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { buildReport } from './utils/buildReport';
import { resolveRange, todayISO } from './utils/range';
import { RangePicker } from './components/RangePicker';
import { UserGroup } from './components/UserGroup';

const routeApi = getRouteApi('/_authenticated/dashboard/');

// The Report feed (S4, #56): who reported, and how did they do. An accordion of the people the viewer
// can see, each holding the Snapshots they pushed in the selected range, each Snapshot holding one row
// per Geo (ADR-0016).
//
// Nothing here computes a number. The figures are the ones the buyer froze; `buildReport` only decides
// what appears, under whom, in what order.
function Dashboard() {
    const search = routeApi.useSearch();
    const navigate = routeApi.useNavigate();
    const [locale, setLocale] = useState<Locale>('uk');

    const range: ReportRange = { range: search.range, from: search.from, to: search.to };
    // Resolved against the viewer's own calendar day: "last 3 days" means their three days, not the
    // server's. The server only ever sees the two concrete dates this produces.
    const today = todayISO();
    const resolved = resolveRange(range, today);

    const { data: users } = useSuspenseQuery(visibleUsersQueryOptions());
    const { data: snapshots } = useSuspenseQuery(reportQueryOptions(resolved));

    const report = buildReport({ users, snapshots, range, today, mode: 'feed' });

    function changeRange(next: ReportRange) {
        // Replaced rather than pushed: the custom date inputs fire on every keystroke, and a history
        // entry per keystroke would make Back an unusable way out of the page.
        navigate({ search: { range: next.range, from: next.from, to: next.to }, replace: true });
    }

    return (
        <>
            <MainLayoutHeader>
                <h1 className="text-xl">{ui('feed', locale)}</h1>
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

                {report.users.length === 0 ? (
                    <p className="text-muted-foreground text-sm">{ui('noUsersVisible', locale)}</p>
                ) : (
                    // Multiple panels open at once: an overseer compares people, and a single-open
                    // accordion would make that a click-per-comparison.
                    <Accordion className="gap-3" multiple>
                        {report.users.map((group) => {
                            return <UserGroup key={group.user.id} group={group} locale={locale} />;
                        })}
                    </Accordion>
                )}
            </div>
        </>
    );
}

export { Dashboard };
