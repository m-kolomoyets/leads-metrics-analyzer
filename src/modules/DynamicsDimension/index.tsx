import type { RollupDimension } from '@/lib/auth/dimensionRollup';
import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { kyivDay } from '@/lib/utils/kyivDay';
import { useMinuteClock } from '@/hooks/useMinuteClock';
import { dynamicsDimensionRosterQueryOptions } from '@/services/dynamics/queries';
import { buyerTabs } from '@/modules/Dynamics/utils/buyerTabs';
import { activeBuyer, tabsOfTeam, teamsOf } from '@/modules/Dynamics/utils/frame';
import { BuyerTabs } from '@/components/dynamics/BuyerTabs';
import { DataAge } from '@/components/dynamics/DataAge';
import { TeamTabs } from '@/components/dynamics/TeamTabs';
import { MainLayoutHeader } from '@/components/layouts/MainLayoutHeader';
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

    const reportDate = search.day ?? kyivDay(now);

    const { data: roster } = useSuspenseQuery(dynamicsDimensionRosterQueryOptions({ reportDate }));

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
                <h1 className="text-xl">
                    {PAGE_TITLE[dimension]} · {reportDate}
                </h1>
                <DataAge takenAt={buyer?.lastTakenAt ?? null} now={now} />
            </MainLayoutHeader>

            <div className="flex flex-col gap-4">
                {teams.length > 0 && <TeamTabs teams={teams} activeId={teamId} onSelect={selectTeam} />}

                {teamTabs.length > 0 && (
                    <BuyerTabs tabs={teamTabs} activeId={buyer?.id ?? null} onSelect={selectBuyer} />
                )}

                {buyer ? (
                    <Suspense
                        // Keyed on the buyer so switching people remounts the boundary rather than
                        // holding the previous person's markets on screen while the next day loads.
                        key={buyer.id}
                        fallback={<p className="text-muted-foreground text-sm">Loading the day…</p>}
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
