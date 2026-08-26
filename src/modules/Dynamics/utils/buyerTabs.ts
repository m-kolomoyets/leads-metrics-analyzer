import type { DynamicsRosterUser } from '@/services/dynamics/types';
import { hoursSince, kyivHour } from '@/lib/utils/kyivDay';

// The buyer tab row's arithmetic (SPEC §6.2) — the page's primary signal surface, kept pure so the
// rules are testable without a DOM (ADR-0005). A lead must know who to walk over to before clicking
// anything, so the row answers two questions: what state is each person in, and who do I read first.
//
// Colouring is purely arithmetic. One dollar of loss is red, zero is green; there are no magnitude
// thresholds anywhere on this page.

// The hour a report is expected by, Kyiv time: before it, a person with no push is simply early.
const REPORT_DUE_HOUR = 10;

// How old the latest push may be before the tab warns. Cumulative pushes mean an old one is not
// wrong, only unreliable — hence amber, not red.
const STALE_AFTER_HOURS = 3;

export type BuyerTabState =
    // No Snapshot today and it is past 10:00 Kyiv — red with a `?`.
    | 'missing'
    // Latest push older than three hours — amber warning.
    | 'stale'
    // Total profit below zero.
    | 'loss'
    // Total profit at or above zero.
    | 'profit'
    // No push yet, but it is not due — or a push that froze no rollup, so there is no total to
    // colour. Not a problem and not a success; it renders neutral and sorts last.
    | 'awaited';

export type BuyerTab = DynamicsRosterUser & {
    state: BuyerTabState;
};

// The states in the order a lead should meet them: problems first, left to right.
const STATE_RANK: Record<BuyerTabState, number> = {
    missing: 0,
    stale: 1,
    loss: 2,
    profit: 3,
    awaited: 4,
};

export function buyerTabState(person: DynamicsRosterUser, now: Date): BuyerTabState {
    if (person.lastTakenAt === null) {
        return kyivHour(now) >= REPORT_DUE_HOUR ? 'missing' : 'awaited';
    }

    const takenAt = new Date(person.lastTakenAt);

    if (!Number.isNaN(takenAt.getTime()) && hoursSince(takenAt, now) > STALE_AFTER_HOURS) {
        return 'stale';
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

    if (a.state === 'loss') {
        // Ascending: the deepest loss is the leftmost thing a lead sees.
        return (a.totalProfit ?? 0) - (b.totalProfit ?? 0);
    }

    if (a.state === 'profit') {
        return (b.totalProfit ?? 0) - (a.totalProfit ?? 0);
    }

    return a.nickname.localeCompare(b.nickname);
}

export function buyerTabs(roster: DynamicsRosterUser[], now: Date): BuyerTab[] {
    return roster
        .map((person): BuyerTab => {
            return { ...person, state: buyerTabState(person, now) };
        })
        .sort(byState);
}
