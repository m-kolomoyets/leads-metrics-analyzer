import type { DynamicsMode } from '@/components/dynamics/types';
import { Suspense, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { cn } from '@/lib/utils/cn';
import { kyivDay } from '@/lib/utils/kyivDay';
import { useMinuteClock } from '@/hooks/useMinuteClock';
import { dynamicsRosterQueryOptions } from '@/services/dynamics/queries';
import { DataAge } from '@/components/dynamics/DataAge';
import { MemberCard } from '@/components/dynamics/MemberCard';
import { ModeToggle } from '@/components/dynamics/ModeToggle';
import { RefreshButton } from '@/components/dynamics/RefreshButton';
import { TeamTabs } from '@/components/dynamics/TeamTabs';
import {
    MainLayoutHeader,
    MainLayoutHeaderActions,
    MainLayoutHeaderTitle,
} from '@/components/layouts/MainLayoutHeader';
import { PendingArea } from '@/components/PendingArea';
import { buyerTabs } from './utils/buyerTabs';
import { activeBuyer, tabsOfTeam, teamsOf } from './utils/frame';
import { BuyerDay } from './components/BuyerDay';
import { DayPickerControl } from './components/DayPickerControl';

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
    const today = kyivDay(now);
    // This is the day being READ, which is today until a link says otherwise.
    const reportDate = search.day ?? today;

    // `useQuery` with the previous day held on screen, deliberately not `useSuspenseQuery`: a
    // suspending read would take the header and the day picker down with it every time the reader
    // picks another day, which is the one control they are standing on. The old day stays, dimmed,
    // until the new one lands.
    const { data: roster, isPlaceholderData } = useQuery({
        ...dynamicsRosterQueryOptions({ reportDate }),
        placeholderData: keepPreviousData,
    });

    const tabs = buyerTabs(roster ?? [], now);
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

    function selectDay(nextDay: string) {
        // The buyer is kept and the geo is dropped: the same person on another day is the point of
        // the control, but the market they ran then is rarely the one they are running now.
        navigate({ search: { day: nextDay === today ? undefined : nextDay, buyer: search.buyer }, replace: true });
    }

    function selectGeo(nextGeo: string) {
        navigate({ search: { ...search, geo: nextGeo }, replace: true });
    }

    return (
        <>
            <MainLayoutHeader>
                <MainLayoutHeaderTitle>Dynamics</MainLayoutHeaderTitle>
                <DayPickerControl reportDate={reportDate} today={today} onSelect={selectDay} />
                <DataAge takenAt={buyer?.lastTakenAt ?? null} now={now} />
                <MainLayoutHeaderActions>
                    <ModeToggle mode={mode} onSelect={setMode} />
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
                                        geoProfits={tab.geoProfits}
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
                    // Keyed on the buyer so switching people remounts the boundary rather than
                    // holding the previous person's markets on screen while the next day loads.
                    <Suspense key={`${buyer.id}-${reportDate}`} fallback={<PendingArea label="Working out the day…" />}>
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
