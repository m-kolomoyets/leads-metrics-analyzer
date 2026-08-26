import type { DynamicsMode } from '@/components/dynamics/types';
import { Suspense, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { kyivDay } from '@/lib/utils/kyivDay';
import { useMinuteClock } from '@/hooks/useMinuteClock';
import { dynamicsRosterQueryOptions } from '@/services/dynamics/queries';
import { BuyerTabs } from '@/components/dynamics/BuyerTabs';
import { DataAge } from '@/components/dynamics/DataAge';
import { ModeToggle } from '@/components/dynamics/ModeToggle';
import { RefreshButton } from '@/components/dynamics/RefreshButton';
import { TeamTabs } from '@/components/dynamics/TeamTabs';
import { MainLayoutHeader } from '@/components/layouts/MainLayoutHeader';
import { PendingArea } from '@/components/PendingArea';
import { buyerTabs } from './utils/buyerTabs';
import { activeBuyer, tabsOfTeam, teamsOf } from './utils/frame';
import { BuyerDay } from './components/BuyerDay';

const routeApi = getRouteApi('/_authenticated/dashboard/dynamics');

// The Dynamics page (SPEC §6): one buyer's day, read as a trajectory rather than a single number.
//
// The frame is Team → Buyer → Geo, identical for every role — only which teams and buyers arrive
// changes, and that is decided by row-scope on the server (ADR-0007), never by anything here. The
// buyer row is the point of the page: a lead must know who to walk over to before clicking anything.
function Dynamics() {
    const search = routeApi.useSearch();
    const navigate = routeApi.useNavigate();
    // One clock for the whole page: the tabs' missing/stale states and the header's data age age
    // together, off a client timer, with no polling (SPEC §6.4).
    const now = useMinuteClock();
    // Chart-only, and deliberately not in the URL: it is a way of looking at the day rather than part
    // of what is being looked at, so a shared link opens on the honest cumulative picture (SPEC §6.4).
    const [mode, setMode] = useState<DynamicsMode>('cumulative');

    // Which day "today" is, is a Kyiv question, and it is resolved viewer-side: the server is only
    // ever asked for a concrete date (ADR-0017). Only today has a UI; the param carries the rest.
    const reportDate = search.day ?? kyivDay(now);

    const { data: roster } = useSuspenseQuery(dynamicsRosterQueryOptions({ reportDate }));

    const tabs = buyerTabs(roster, now);
    // The buyer is resolved against the WHOLE row first, so a shared link opens on the person it
    // names whichever team they sit on; the team level then follows the buyer, not the other way
    // round. With no buyer asked for, the ordering has already put the worst tab first.
    const buyer = activeBuyer(tabs, search.buyer);
    const teams = teamsOf(tabs);
    const teamId = buyer?.teamId ?? null;
    const teamTabs = tabsOfTeam(tabs, teamId);

    function selectBuyer(nextBuyer: string) {
        // The geo is dropped: the market this buyer ran is rarely the market the last one did, and a
        // carried-over geo would open the next person on a fallback tab anyway.
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
                <h1 className="text-xl">Dynamics · {reportDate}</h1>
                <DataAge takenAt={buyer?.lastTakenAt ?? null} now={now} />
                <span className="flex-1" />
                <ModeToggle mode={mode} onSelect={setMode} />
                <RefreshButton />
            </MainLayoutHeader>

            <div className="flex flex-col gap-4">
                {teams.length > 0 && <TeamTabs teams={teams} activeId={teamId} onSelect={selectTeam} />}

                {teamTabs.length > 0 && (
                    <BuyerTabs tabs={teamTabs} activeId={buyer?.id ?? null} onSelect={selectBuyer} />
                )}

                {buyer ? (
                    // Keyed on the buyer so switching people remounts the boundary rather than
                    // holding the previous person's markets on screen while the next day loads.
                    <Suspense key={buyer.id} fallback={<PendingArea label="Working out the day…" />}>
                        <BuyerDay
                            buyerId={buyer.id}
                            reportDate={reportDate}
                            geo={search.geo}
                            onSelectGeo={selectGeo}
                            mode={mode}
                        />
                    </Suspense>
                ) : (
                    <p className="text-muted-foreground text-sm">There is nobody to show a day for yet.</p>
                )}
            </div>
        </>
    );
}

export { Dynamics };
