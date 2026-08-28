import type { RollupDimension } from '@/lib/auth/dimensionRollup';
import { Suspense } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { cn } from '@/lib/utils/cn';
import { kyivDay } from '@/lib/utils/kyivDay';
import { useMinuteClock } from '@/hooks/useMinuteClock';
import { dynamicsDimensionRosterQueryOptions } from '@/services/dynamics/queries';
import { buyerTabs } from '@/modules/Dynamics/utils/buyerTabs';
import { activeBuyer, tabsOfTeam, teamsOf } from '@/modules/Dynamics/utils/frame';
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
import { DayPickerControl } from './components/DayPickerControl';

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

    const today = kyivDay(now);
    // This is the day being READ, which is today until a link says otherwise.
    const reportDate = search.day ?? today;

    // `useQuery` with the previous day held on screen, deliberately not `useSuspenseQuery`: a
    // suspending read would take the header and the day picker down with it every time the reader
    // picks another day, which is the one control they are standing on. The old day stays, dimmed,
    // until the new one lands.
    const { data: roster, isPlaceholderData } = useQuery({
        ...dynamicsDimensionRosterQueryOptions({ reportDate }),
        placeholderData: keepPreviousData,
    });

    // The roster carries no `totalProfit` field, so every tab that pushed reads `reported` rather
    // than green or red: there is no money here to grade anyone on.
    const tabs = buyerTabs(roster ?? [], now);
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

    function selectDay(nextDay: string) {
        // The buyer is kept and the geo is dropped, for the same reason as on the trajectory page.
        navigate({ search: { day: nextDay === today ? undefined : nextDay, buyer: search.buyer }, replace: true });
    }

    function selectGeo(nextGeo: string) {
        navigate({ search: { ...search, geo: nextGeo }, replace: true });
    }

    return (
        <>
            <MainLayoutHeader>
                <MainLayoutHeaderTitle>{PAGE_TITLE[dimension]}</MainLayoutHeaderTitle>
                <DayPickerControl reportDate={reportDate} today={today} onSelect={selectDay} />
                <DataAge takenAt={buyer?.lastTakenAt ?? null} now={now} />
                <MainLayoutHeaderActions>
                    <RefreshButton />
                </MainLayoutHeaderActions>
            </MainLayoutHeader>

            {/* The CONTENT reloads, never the frame: the header above stays put through a day
                change and the day's own body dims until the new roster lands. */}
            <div
                className={cn(
                    'flex flex-col gap-4',
                    isPlaceholderData && 'opacity-60 motion-safe:transition-opacity motion-safe:duration-150'
                )}
            >
                {!roster && <PendingArea label="Working out the day…" />}

                {teams.length > 0 && <TeamTabs teams={teams} activeId={teamId} onSelect={selectTeam} />}

                {teamTabs.length > 0 && (
                    <section aria-label="Team">
                        <div className="flex flex-wrap gap-3">
                            {teamTabs.map((tab) => {
                                return (
                                    <MemberCard
                                        key={tab.id}
                                        selected={tab.id === buyer?.id}
                                        tab={tab}
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
                        key={`${buyer.id}-${reportDate}`}
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
