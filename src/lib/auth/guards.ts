import type { MeData } from '@/services/auth/types';
import { ROLES_IDS } from '@/lib/constants';
import { getSessionUser } from './session';

// SERVER-ONLY. Authorization edge checks for server functions. Row/dimension read-visibility flows
// through the pure access-policy seam (`scopeFor`, ADR-0007); the admin mutations have no row-scope
// to filter, so they are gated by this explicit `role === 'head'` edge check instead. `scopeFor`
// alone is insufficient — designer/bdm also carry `rowScope: 'all'` yet must never administer.

export const UNAUTHORIZED_MESSAGE = 'Not authenticated';
export const FORBIDDEN_MESSAGE = 'Forbidden';

// Resolves the current session user or rejects — the authenticated-any-role gate. Row/dimension
// visibility is then applied per query via `scopeFor(viewer)` built from the returned `MeData`
// (id, role, teamId). Use this for reads/writes open to any signed-in user; `requireHead` remains
// the edge gate for Head-only administration.
export const requireUser = async (): Promise<MeData> => {
    const me = await getSessionUser();

    if (!me) {
        throw new Error(UNAUTHORIZED_MESSAGE);
    }

    return me;
};

// Resolves the current session user and asserts they are the Head. Reads role fresh from the
// session store every request, so a demoted Head loses admin access on their next request
// (spec story 4). Throws on missing session or any non-head role.
export const requireHead = async (): Promise<MeData> => {
    const me = await getSessionUser();

    if (!me) {
        throw new Error(UNAUTHORIZED_MESSAGE);
    }

    if (me.role !== ROLES_IDS.head) {
        throw new Error(FORBIDDEN_MESSAGE);
    }

    return me;
};
