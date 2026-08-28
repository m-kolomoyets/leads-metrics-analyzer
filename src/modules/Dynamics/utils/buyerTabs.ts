import type { DynamicsDimensionRosterUser, RosterGeoProfit } from '@/services/dynamics/types';
import { hoursSince, kyivHour } from '@/lib/utils/kyivDay';

// The buyer tab row's arithmetic (SPEC §6.2) — the page's primary signal surface, kept pure so the
// rules are testable without a DOM (ADR-0005). A lead must know who to walk over to before clicking
// anything, so the row answers two questions: what state is each person in, and who do I read first.
//
// Colouring is purely arithmetic. One dollar of loss is red, zero is green; there are no magnitude
// thresholds anywhere on this page.

// The hour a report is expected by, Kyiv time: before it, a person with no push is simply early.
// Exported so the card that PAINTS the missing state can say the same hour it was decided by — a
// warning that will not say what it is waiting for is a warning nobody can act on.
export const REPORT_DUE_HOUR = 10;

// How old the latest push may be before the card warns. Cumulative pushes mean an old one is not
// wrong, only unreliable — hence amber, not red.
export const STALE_AFTER_HOURS = 3;

export type BuyerTabState =
    // No Snapshot today and it is past 10:00 Kyiv — red with a `?`.
    | 'missing'
    // Latest push older than three hours — amber warning.
    | 'stale'
    // Total profit below zero.
    | 'loss'
    // Total profit at or above zero.
    | 'profit'
    // Pushed, and there is no money dimension to grade the push on — the Designer/BDM row (#10).
    | 'reported'
    // No push yet, but it is not due — or a push that froze no rollup, so there is no total to
    // colour. Not a problem and not a success; it renders neutral and sorts last.
    | 'awaited';

// What the tab row needs of a person. `totalProfit` is OPTIONAL rather than nullable-only, and the
// two mean different things: null is a push that froze no rollup, undefined is a viewer whose scope
// carries no dollar dimension, so no total was ever selected for them (#10).
export type RosterTabUser = DynamicsDimensionRosterUser & {
    totalProfit?: number | null;
    // The same push's markets, unsummed — the card's breakdown. Absent for the same viewers whose
    // total is absent: no dollar dimension, so no market figures were selected either (#10).
    geoProfits?: RosterGeoProfit[];
};

export type BuyerTab = RosterTabUser & {
    state: BuyerTabState;
};

// The states in the order a lead should meet them: problems first, left to right.
const STATE_RANK: Record<BuyerTabState, number> = {
    missing: 0,
    stale: 1,
    loss: 2,
    profit: 3,
    // Never mixed with loss/profit — a row is either graded on money or it is not — so it shares
    // profit's rank and falls through to nickname order.
    reported: 3,
    awaited: 4,
};

export function buyerTabState(person: RosterTabUser, now: Date): BuyerTabState {
    if (person.lastTakenAt === null) {
        return kyivHour(now) >= REPORT_DUE_HOUR ? 'missing' : 'awaited';
    }

    const takenAt = new Date(person.lastTakenAt);

    if (!Number.isNaN(takenAt.getTime()) && hoursSince(takenAt, now) > STALE_AFTER_HOURS) {
        return 'stale';
    }

    // No dollar dimension at all: they reported, and there is nothing to colour it by. Distinct from
    // the null below, which is a push that carried no total.
    if (person.totalProfit === undefined) {
        return 'reported';
    }

    if (person.totalProfit === null) {
        return 'awaited';
    }

    return person.totalProfit < 0 ? 'loss' : 'profit';
}

// Problems first, then losses deepest-first, then profits largest-first. Within a state with no
// number to sort on, nickname order — so the row does not reshuffle between renders.
function byState(a: BuyerTab, b: BuyerTab): number {
    const gap = STATE_RANK[a.state] - STATE_RANK[b.state];

    if (gap !== 0) {
        return gap;
    }

    // Both sides must be in the SAME state before a total is compared. `profit` and `reported` share
    // a rank, so a row holding both used to compare one person's money against a person who has no
    // money dimension at all — and the answer flipped depending on which of the two the sort happened
    // to hand over first, which is a row that reshuffles for no reason the reader can see.
    if (a.state !== b.state) {
        return a.nickname.localeCompare(b.nickname);
    }

    if (a.state === 'loss') {
        // Ascending: the deepest loss is the leftmost thing a lead sees.
        return (a.totalProfit ?? 0) - (b.totalProfit ?? 0);
    }

    if (a.state === 'profit') {
        return (b.totalProfit ?? 0) - (a.totalProfit ?? 0);
    }

    return a.nickname.localeCompare(b.nickname);
}

export function buyerTabs(roster: RosterTabUser[], now: Date): BuyerTab[] {
    return roster
        .map((person): BuyerTab => {
            return { ...person, state: buyerTabState(person, now) };
        })
        .sort(byState);
}
