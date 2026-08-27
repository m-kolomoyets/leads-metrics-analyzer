import type { Locale } from '@/components/report/utils/i18n';
import type { ReportRange } from './types';
import { Suspense, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import { visibleUsersQueryOptions } from '@/services/reports/queries';
import {
    MainLayoutHeader,
    MainLayoutHeaderActions,
    MainLayoutHeaderTitle,
} from '@/components/layouts/MainLayoutHeader';
import { LocaleSwitch } from '@/components/LocaleSwitch';
import { ui } from '@/components/report/utils/i18n';
import { Button } from '@/components/ui/Button';
import { resolveRange, todayISO } from './utils/range';
import { FeedList } from './components/FeedList';
import { ListLoader } from './components/ListLoader';
import { RangePicker } from './components/RangePicker';

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

    // The roster does not move with the range, so it stays here: only the Snapshot list below suspends
    // when the window changes.
    const { data: users } = useSuspenseQuery(visibleUsersQueryOptions());

    function changeRange(next: ReportRange) {
        // Replaced rather than pushed: the custom date inputs fire on every keystroke, and a history
        // entry per keystroke would make Back an unusable way out of the page.
        navigate({ search: { range: next.range, from: next.from, to: next.to }, replace: true });
    }

    return (
        <>
            <MainLayoutHeader>
                <MainLayoutHeaderTitle>{ui('feed', locale)}</MainLayoutHeaderTitle>

                {/* The range travels with the link, so moving between the two surfaces never costs a
                    re-pick (spec story 21). Both pages validate the same three params. */}
                <Button size="xs" variant="ghost" render={<Link to="/dashboard/archive" search={search} />}>
                    {ui('archive', locale)}
                </Button>

                <MainLayoutHeaderActions>
                    <LocaleSwitch locale={locale} onSelect={setLocale} />
                </MainLayoutHeaderActions>
            </MainLayoutHeader>

            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <RangePicker range={range} onChange={changeRange} locale={locale} />
                    <span className="text-muted-foreground text-xs tabular-nums">
                        {resolved.from} → {resolved.to}
                    </span>
                </div>

                {/* Keyed on the window, so picking a new range shows the loader HERE rather than
                    keeping the previous list on screen: a navigation is a transition, and React would
                    otherwise hold the stale content and skip the fallback entirely. */}
                <Suspense key={`${resolved.from}:${resolved.to}`} fallback={<ListLoader />}>
                    <FeedList users={users} range={range} resolved={resolved} today={today} locale={locale} />
                </Suspense>
            </div>
        </>
    );
}

export { Dashboard };
