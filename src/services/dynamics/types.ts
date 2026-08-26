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
};
