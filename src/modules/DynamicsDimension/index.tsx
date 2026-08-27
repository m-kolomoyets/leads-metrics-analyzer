import type { RollupDimension } from '@/lib/auth/dimensionRollup';
import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { monthDays, monthLabel, monthRange } from '@/lib/utils/calendarMonth';
import { kyivDay } from '@/lib/utils/kyivDay';
import { useMinuteClock } from '@/hooks/useMinuteClock';
import { dynamicsDimensionHistoryQueryOptions, dynamicsDimensionRosterQueryOptions } from '@/services/dynamics/queries';
import { buyerTabs } from '@/modules/Dynamics/utils/buyerTabs';
import { activeBuyer, tabsOfTeam, teamsOf } from '@/modules/Dynamics/utils/frame';
import { dimensionMemberDays } from '@/modules/Dynamics/utils/memberDays';
import { DataAge } from '@/components/dynamics/DataAge';
import { MemberCard } from '@/components/dynamics/MemberCard';
import { RefreshButton } from '@/components/dynamics/RefreshButton';
import { TeamTabs } from '@/components/dynamics/TeamTabs';
import {
    MainLayoutHeader,
    MainLayoutHeaderActions,
    MainLayoutHeaderTitle,
} from '@/components/layouts/MainLayoutHeader';
import { PendingArea } from '@/components/PendingArea';
import { PAGE_TITLE } from './constants';
import { BuyerDimensionDay } from './components/BuyerDimensionDay';

const routeApi = getRouteApi('/_authenticated/dashboard/dynamics');

// The dollar-free branch of the Dynamics page (#10) — the Designer's and the BDM's frame. It reuses
// the trajectory page's frame rather than extending it: same Team → Buyer → Geo levels, same tab
// arithmetic, same clock. What it drops is everything built on money — the comparison panel, the
// chart, the mode toggle — and what it keeps in their place is one table at full depth.
//
// Which dimension that table is keyed by is decided by `scopeFor` via `rollupDimensionFor` and passed
// in; no role literal appears here or below (ADR-0007, ADR-0009).

type DynamicsDimensionProps = {
    dimension: RollupDimension;
};

function DynamicsDimension({ dimension }: DynamicsDimensionProps) {
    const search = routeApi.useSearch();
    const navigate = routeApi.useNavigate();
    const now = useMinuteClock();

    // Two different questions, and conflating them is what put the "today" mark on a past day: this
    // is NOW (ADR-0017), and it is what the month grids date themselves against.
    const today = kyivDay(now);
    // This is the day being READ, which is today until a link says otherwise.
    const reportDate = search.day ?? today;

    const month = monthRange(reportDate);

    const { data: roster } = useSuspenseQuery(dynamicsDimensionRosterQueryOptions({ reportDate }));
    // The same grid, with the only thing this viewer may know about a past day in it: whether it was
    // reported. Every reported dot is neutral — there is no money here to grade anyone on.
    const { data: history } = useSuspenseQuery(dynamicsDimensionHistoryQueryOptions(month));

    const days = monthDays(reportDate);
    const historyOf = new Map(
        history.map((entry) => {
            return [entry.buyerId, entry.reportedDates];
        })
    );

    // The roster carries no `totalProfit` field, so every tab that pushed reads `reported` rather
    // than green or red: there is no money here to grade anyone on.
    const tabs = buyerTabs(roster, now);
    const buyer = activeBuyer(tabs, search.buyer);
    const teams = teamsOf(tabs);
    const teamId = buyer?.teamId ?? null;
    const teamTabs = tabsOfTeam(tabs, teamId);

    function selectBuyer(nextBuyer: string) {
        // The geo is dropped with the buyer, for the same reason as on the trajectory page: the
        // market this person ran is rarely the market the last one did.
        navigate({ search: { day: search.day, buyer: nextBuyer }, replace: true });
    }

    function selectTeam(nextTeamId: string | null) {
        const [first] = tabsOfTeam(tabs, nextTeamId);

        if (first) {
            selectBuyer(first.id);
        }
    }

    function selectGeo(nextGeo: string) {
        navigate({ search: { ...search, geo: nextGeo }, replace: true });
    }

    return (
        <>
            <MainLayoutHeader>
                <MainLayoutHeaderTitle meta={reportDate}>{PAGE_TITLE[dimension]}</MainLayoutHeaderTitle>
                <DataAge takenAt={buyer?.lastTakenAt ?? null} now={now} />
                <MainLayoutHeaderActions>
                    <RefreshButton />
                </MainLayoutHeaderActions>
            </MainLayoutHeader>

            <div className="flex flex-col gap-4">
                {teams.length > 0 && <TeamTabs teams={teams} activeId={teamId} onSelect={selectTeam} />}

                {teamTabs.length > 0 && (
                    <section className="flex flex-col gap-2" aria-label="Team">
                        <h2 className="text-muted-foreground text-xs">{monthLabel(reportDate)}</h2>

                        <div className="flex flex-wrap gap-3">
                            {teamTabs.map((tab) => {
                                return (
                                    <MemberCard
                                        key={tab.id}
                                        days={dimensionMemberDays(days, historyOf.get(tab.id) ?? [], today)}
                                        reading={reportDate}
                                        selected={tab.id === buyer?.id}
                                        tab={tab}
                                        today={today}
                                        onSelect={() => {
                                            selectBuyer(tab.id);
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </section>
                )}

                {buyer ? (
                    <Suspense
                        // Keyed on the buyer so switching people remounts the boundary rather than
                        // holding the previous person's markets on screen while the next day loads.
                        key={buyer.id}
                        fallback={<PendingArea label="Working out the day…" />}
                    >
                        <BuyerDimensionDay
                            dimension={dimension}
                            buyerId={buyer.id}
                            reportDate={reportDate}
                            geo={search.geo}
                            onSelectGeo={selectGeo}
                        />
                    </Suspense>
                ) : (
                    <p className="text-muted-foreground text-sm">There is nobody to show a day for yet.</p>
                )}
            </div>
        </>
    );
}

export { DynamicsDimension };
