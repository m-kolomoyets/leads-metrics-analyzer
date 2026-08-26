import type { DynamicsSnapshot } from '@/lib/domain/dynamics';
import type { BuyerTab } from './buyerTabs';

// The Team → Buyer → Geo frame's arithmetic (SPEC §6.1). Three levels, always in this order, for
// every role — only which teams and buyers appear changes, and that is already decided on the server.
//
// Every level here treats its URL param as a request, not an instruction: a shared link that names a
// buyer who left, or a market nobody ran today, opens the page on its first tab rather than on an
// empty screen (the same call `activeGeo` makes for the detailed report).

// The label a teamless person's tab row sits under. The Head belongs to no team and still reports.
export const NO_TEAM_LABEL = 'No team';

export type FrameTeam = {
    id: string | null;
    name: string;
};

// Teams in the order their first buyer appears — so the team row inherits the buyer row's
// problems-first ordering, and the team holding the worst tab is itself leftmost.
export function teamsOf(tabs: BuyerTab[]): FrameTeam[] {
    const teams: FrameTeam[] = [];

    for (const tab of tabs) {
        const known = teams.some((team) => {
            return team.id === tab.teamId;
        });

        if (!known) {
            teams.push({ id: tab.teamId, name: tab.teamName ?? NO_TEAM_LABEL });
        }
    }

    return teams;
}

export function tabsOfTeam(tabs: BuyerTab[], teamId: string | null): BuyerTab[] {
    return tabs.filter((tab) => {
        return tab.teamId === teamId;
    });
}

// Which buyer the page is reading. The param wins only when that person is still in the row; a buyer
// who was disabled, or who belongs to a team the reader cannot see, falls back to the first tab —
// which, given the ordering, is the person most worth looking at anyway.
export function activeBuyer(tabs: BuyerTab[], requested: string | undefined): BuyerTab | null {
    const match = tabs.find((tab) => {
        return tab.id === requested;
    });

    return match ?? tabs[0] ?? null;
}

// The day's most recent push. Snapshots are cumulative, so the latest one is the day so far — the
// geo row and the header both read off it. The server orders by `taken_at`; the sort here is a
// belt-and-braces reordering, not a second opinion (ADR-0017).
export function latestSnapshot(snapshots: DynamicsSnapshot[]): DynamicsSnapshot | null {
    let latest: DynamicsSnapshot | null = null;

    for (const snapshot of snapshots) {
        const instant = Date.parse(snapshot.takenAt);

        if (Number.isNaN(instant)) {
            continue;
        }

        if (!latest || instant >= Date.parse(latest.takenAt)) {
            latest = snapshot;
        }
    }

    return latest;
}

export type GeoTab = {
    geo: string;
    spendPlus: number;
};

// The markets the geo row offers: only those with spend, sorted by spend descending (SPEC §6.3). A
// geo the buyer reported at zero spend is not a market they are running, so it is not a tab.
export function geoTabs(snapshots: DynamicsSnapshot[]): GeoTab[] {
    const latest = latestSnapshot(snapshots);

    if (!latest) {
        return [];
    }

    return latest.geoRollups
        .filter((rollup) => {
            return rollup.spendPlus > 0;
        })
        .map((rollup): GeoTab => {
            return { geo: rollup.geo, spendPlus: rollup.spendPlus };
        })
        .sort((a, b) => {
            return b.spendPlus - a.spendPlus;
        });
}
