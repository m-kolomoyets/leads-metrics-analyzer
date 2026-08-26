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
    lastTakenAt: string | null;
};
