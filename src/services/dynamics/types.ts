import type { RollupDimension } from '@/lib/auth/dimensionRollup';
import type { UserRole } from '@/lib/constants';

// Wire shapes for the Dynamics page (ADR-0010, ADR-0017). The day read returns the domain's own
// `DynamicsSnapshot` unchanged, so `buildSeries`/`deltasFor` consume the response with no adapter in
// between; only the roster needs a shape of its own.

// One tab in the buyer row: a person the viewer may see, and when they last pushed FOR THAT DAY.
// `lastTakenAt` is null when they have not pushed today — which is the missing state the tab paints
// red, not "never pushed at all".
export type DynamicsRosterUser = {
    id: string;
    nickname: string;
    role: UserRole;
    // The team the person sits on now — the frame's first level (SPEC §6.1). Null for the Head, who
    // belongs to no team and still needs a tab of their own.
    teamId: string | null;
    teamName: string | null;
    lastTakenAt: string | null;
    // Σ of that buyer's Frozen Geo Rollup profits from their latest active push of the day — the
    // figure the tab colours from (SPEC §4.4). Already commission-inclusive and already carrying
    // untagged revenue (ADR-0003), so §4.4's "excluded traffic" caveat does not apply here. Null when
    // there is no push today, or when the push froze no rollup: no total to colour, not a zero.
    totalProfit: number | null;
    // The markets that same push froze, each with the profit IT carried — the card's breakdown under
    // the name (SPEC §6.2). Read from the LATEST push only: a Snapshot restates the day so far
    // (ADR-0017), so a market's line is what the last report said about it, never a sum across
    // pushes. Empty when there is no push today or the push froze no rollup.
    geoProfits: RosterGeoProfit[];
};

// One market of that push: the code as it was reported and the profit frozen against it.
export type RosterGeoProfit = {
    geo: string;
    profit: number;
};

// The dollar-free half of the roster, for the Designer/BDM frames (#10). Structurally the tab row
// minus its one money field: those roles hold no dollar dimension, so no total is selected for them
// server-side either — the field does not exist rather than arriving null.
export type DynamicsDimensionRosterUser = Omit<DynamicsRosterUser, 'totalProfit' | 'geoProfits'>;

// One row of a dollar-free day table: the viewer's single dimension, in one market, with the funnel
// counts that dimension earned. No Spend, no Revenue, no cost-per — the read never selects them.
export type DynamicsDimensionRow = {
    geo: string;
    key: string;
    linkClicks: number;
    installs: number;
    regs: number;
    sales: number;
};

// One buyer's day as a Designer or BDM reads it: WHOSE it is and WHEN it was pushed, which is the
// substance of the decision rather than metadata around it, plus the rows themselves.
//
// The rows come from the LATEST active push of the day and nothing is summed across pushes: a
// Snapshot restates the day so far (ADR-0017), so adding two pushes would double-count the day.
export type DynamicsDimensionDay = {
    dimension: RollupDimension;
    buyerNickname: string;
    // Null when the buyer has not pushed for this day at all — no rows, and nothing to date.
    takenAt: string | null;
    rows: DynamicsDimensionRow[];
};

// One day of a buyer's month, as the calendar's heatmap reads it: the day's total and the money it
// was taken over. Both come from the LATEST push of that day and nothing is summed across pushes —
// a Snapshot restates the day so far (ADR-0017).
export type DynamicsHistoryDay = {
    reportDate: string;
    // Σ of the push's Frozen Geo Rollups. Null when the push froze no rollup at all — no total to
    // grade, which is not a total of zero.
    profit: number | null;
    // The denominator the day's ROI is taken over, and the reason a zero-spend day cannot be graded.
    spendPlus: number;
    // The markets behind that total, biggest mover first — the same `{ geo, profit }` pair the cards
    // print, so the calendar cell can say WHICH market carried the day and not only that one did.
    geos: RosterGeoProfit[];
};

// One buyer's month. Keyed by buyer rather than nested into the roster so the two reads stay
// independent: the roster paints the cards, the history fills the day picker's calendar.
export type DynamicsBuyerHistory = {
    buyerId: string;
    days: DynamicsHistoryDay[];
};

// The dollar-free half of the same read (#10). A Designer or BDM holds no money dimension, so their
// calendar can only say WHETHER a day was reported — the dates are the whole payload.
export type DynamicsDimensionBuyerHistory = {
    buyerId: string;
    reportedDates: string[];
};
