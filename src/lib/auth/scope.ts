import type { UserRole } from '@/lib/constants';

// The single authorization seam (ADR-0007). `scopeFor(viewer)` is a pure function — no DB, no HTTP —
// mapping a viewer's role to a visibility descriptor on two independent axes: row-scope (whose
// Snapshots) and dimension-scope (which tables). Every list/read query consults this descriptor;
// no server function hand-rolls a role check. This is the highest-value test seam (ADR-0005).

// The five dimension tables a fact rolls up into (CONTEXT.md §Dimensions + Offer).
export type Dimension = 'campaign' | 'account' | 'geo' | 'creative' | 'offer';

// Which Snapshots a viewer may read.
export type RowScope = 'own' | 'team' | 'all';

// The trusted viewer identity passed in from inside a server function (ADR-0006). `teamId` is
// carried once the team table lands (T4a, #5); absent/null until a user is placed on a team.
export type Viewer = {
    id: string;
    role: UserRole;
    teamId?: string | null;
};

// The visibility descriptor. `userId`/`teamId` are bound only for the row-scope that needs them, so
// a query builder can apply them unconditionally.
export type VisibilityScope = {
    rowScope: RowScope;
    userId?: string;
    teamId?: string;
    dimensions: Dimension[];
};

// Every dimension — the full-visibility set shared by head, team_lead and buyer.
const ALL_DIMENSIONS: Dimension[] = ['campaign', 'account', 'geo', 'creative', 'offer'];

export const scopeFor = (viewer: Viewer): VisibilityScope => {
    switch (viewer.role) {
        case 'head': {
            return { rowScope: 'all', dimensions: [...ALL_DIMENSIONS] };
        }
        case 'team_lead': {
            return { rowScope: 'team', teamId: viewer.teamId ?? undefined, dimensions: [...ALL_DIMENSIONS] };
        }
        case 'buyer': {
            return { rowScope: 'own', userId: viewer.id, dimensions: [...ALL_DIMENSIONS] };
        }
        case 'designer': {
            return { rowScope: 'all', dimensions: ['creative'] };
        }
        case 'bdm': {
            return { rowScope: 'all', dimensions: ['offer'] };
        }
    }
};
