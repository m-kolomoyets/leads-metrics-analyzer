import type { Locale } from '@/components/report/utils/i18n';
import type { ReportRange } from '@/modules/Dashboard/types';
import { Suspense, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import { visibleUsersQueryOptions } from '@/services/reports/queries';
import { ListLoader } from '@/modules/Dashboard/components/ListLoader';
import { RangePicker } from '@/modules/Dashboard/components/RangePicker';
import { resolveRange, todayISO } from '@/modules/Dashboard/utils/range';
import {
    MainLayoutHeader,
    MainLayoutHeaderActions,
    MainLayoutHeaderTitle,
} from '@/components/layouts/MainLayoutHeader';
import { LocaleSwitch } from '@/components/LocaleSwitch';
import { ui } from '@/components/report/utils/i18n';
import { Button } from '@/components/ui/Button';
import { ArchiveList } from './components/ArchiveList';

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

    // The roster does not move with the range, so it stays here: only the day list below suspends when
    // the window changes.
    const { data: users } = useSuspenseQuery(visibleUsersQueryOptions());
    // Named from the roster rather than the URL, so a stale id in a shared link shows the empty state
    // instead of a chip labelled with someone's raw id.
    const filteredUser = users.find((user) => {
        return user.id === search.user;
    });

    function changeRange(next: ReportRange) {
        // Replaced rather than pushed, as on the feed: the custom date inputs fire per keystroke. The
        // person filter rides along — changing the window should not silently widen the question back
        // out to the whole team.
        navigate({
            search: { range: next.range, from: next.from, to: next.to, user: search.user },
            replace: true,
        });
    }

    return (
        <>
            <MainLayoutHeader>
                <MainLayoutHeaderTitle>{ui('archive', locale)}</MainLayoutHeaderTitle>

                {/* The range travels with the link, so moving between the two surfaces never costs a
                    re-pick (spec story 21). Both pages validate the same three params. */}
                <Button size="xs" variant="ghost" render={<Link to="/dashboard" search={search} />}>
                    {ui('feed', locale)}
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

                    {/* The filter has to be visible and reversible: arriving from a buyer's feed row,
                        an archive showing one name and no explanation reads as an outage. */}
                    {filteredUser && (
                        <div className="flex items-center gap-2">
                            <span className="border-border rounded-lg border px-2 py-0.5 text-xs font-semibold">
                                {filteredUser.nickname}
                            </span>
                            <Button
                                size="xs"
                                variant="ghost"
                                render={
                                    <Link to="/dashboard/archive" search={{ ...search, user: undefined }}>
                                        {ui('allUsers', locale)}
                                    </Link>
                                }
                            />
                        </div>
                    )}
                </div>

                {/* Keyed on the window and the person, so changing either shows the loader HERE rather
                    than holding the previous days on screen — a navigation is a transition, and React
                    would otherwise keep the stale list and skip the fallback entirely. */}
                <Suspense key={`${resolved.from}:${resolved.to}:${search.user ?? ''}`} fallback={<ListLoader />}>
                    <ArchiveList
                        users={users}
                        range={range}
                        resolved={resolved}
                        today={today}
                        userId={search.user}
                        locale={locale}
                    />
                </Suspense>
            </div>
        </>
    );
}

export { Archive };
