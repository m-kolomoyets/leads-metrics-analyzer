import type { ObjectDotNotation } from '@/lib/types';
import type { AuthRole } from '@/services/auth/types';
import { notFound } from '@tanstack/react-router';
import { FALLBACK_REDIRECT, ROLES_IDS } from '@/lib/constants';

// NOTE: This is the template's demo route-gating (merchants/vouchers pages). The real, spec-driven
// visibility model — row-scope + dimension-scope via `scopeFor(viewer)` — lands in T3 (#4).
export const ROLES_CONFIG = {
    [ROLES_IDS.head]: { id: ROLES_IDS.head, label: 'Head' },
    [ROLES_IDS.teamLead]: { id: ROLES_IDS.teamLead, label: 'Team Lead' },
    [ROLES_IDS.buyer]: { id: ROLES_IDS.buyer, label: 'Buyer' },
    [ROLES_IDS.designer]: { id: ROLES_IDS.designer, label: 'Designer' },
    [ROLES_IDS.bdm]: { id: ROLES_IDS.bdm, label: 'BDM' },
} as const;

export type RolePermissionsKeys = ObjectDotNotation<typeof ROLES_PERMISSIONS>;
export const ROLES_PERMISSIONS = {
    // Home (offers-and-home PRD) — the post-login landing for every role but Designer, whose landing
    // stays as it was (story 58). Whether a viewer reads dollar figures there is `seesDollarsOn`'s
    // call, not this list's.
    home: {
        view: [ROLES_IDS.head, ROLES_IDS.teamLead, ROLES_IDS.buyer, ROLES_IDS.bdm],
    },
    // Offers (offers-and-home PRD). Same four roles: BDM issues the cards, the dollar roles work
    // them; a Designer has no part in an offer at all.
    offers: {
        view: [ROLES_IDS.head, ROLES_IDS.teamLead, ROLES_IDS.buyer, ROLES_IDS.bdm],
    },
    // Admin panel (T4b, #6) — Head-only. Mirrors the server-side `requireHead` gate on the admin API.
    admin: {
        view: [ROLES_IDS.head],
    },
    // The `/analyze` route (spec 0002). One route for all five roles (ADR-0009): dollar roles get the
    // live analyzer, Designer/BDM the dollar-free rollup branch (S6). Which branch renders is decided
    // by `scopeFor`, not by this list — this gate only says who may open the route at all.
    analyze: {
        view: [ROLES_IDS.head, ROLES_IDS.teamLead, ROLES_IDS.buyer, ROLES_IDS.designer, ROLES_IDS.bdm],
    },
    // The Report surfaces (spec 0003) — the detailed report and, later, the feed and archive. Dollar
    // roles only: Designer and BDM hold no campaign dimension, so a whole Snapshot is never theirs
    // (story 40). Server-side, `scopeFor` still decides which Snapshots each one can read.
    report: {
        view: [ROLES_IDS.head, ROLES_IDS.teamLead, ROLES_IDS.buyer],
    },
    // The Dynamics page (spec 0004). One route for all five roles, the way `/analyze` already
    // branches (ADR-0009): dollar roles get the trajectory, Designer/BDM their own dollar-free frame
    // (#10). Which branch renders is decided by `scopeFor`, not by this list — this gate only says
    // who may open the route at all, and the server still refuses each read on its own.
    dynamics: {
        view: [ROLES_IDS.head, ROLES_IDS.teamLead, ROLES_IDS.buyer, ROLES_IDS.designer, ROLES_IDS.bdm],
    },
    // Presets manager (#30 follow-up). Dollar roles only; server row-scope still narrows the rows
    // each one actually sees (Head all / Team Lead team / Buyer own).
    presets: {
        manage: [ROLES_IDS.head, ROLES_IDS.teamLead, ROLES_IDS.buyer],
    },
    merchants: {
        view: [ROLES_IDS.teamLead, ROLES_IDS.head],
        item: {
            view: [ROLES_IDS.teamLead, ROLES_IDS.head],
            update: [ROLES_IDS.head],
        },
    },
    vouchers: {
        view: [ROLES_IDS.head],
        update: [ROLES_IDS.head],
        item: {
            view: [ROLES_IDS.head],
        },
    },
} as const;

type PermissionsReduceResult = Record<string, Record<string, unknown> | string[]>;
export const hasPermissions = (permissionKey: RolePermissionsKeys, authRole?: AuthRole) => {
    const propertiesChain = permissionKey.split('.');
    const clonedRolesPermissions = structuredClone(ROLES_PERMISSIONS);
    const permissions = propertiesChain.reduce<PermissionsReduceResult>((acc, cur) => {
        return acc[cur as keyof typeof acc] as PermissionsReduceResult;
    }, clonedRolesPermissions);

    return Array.isArray(permissions) && permissions.includes(authRole);
};

// Where a fresh session lands. Home for every role that may open it; the Designer keeps the landing
// they had before Home existed (story 58).
export const landingFor = (role?: AuthRole) => {
    return hasPermissions('home.view', role) ? '/home' : FALLBACK_REDIRECT;
};

export const checkIsRouteAllowed = (rolePermissionKey: RolePermissionsKeys, role?: AuthRole) => {
    const isAllowed = hasPermissions(rolePermissionKey, role);

    if (!isAllowed) {
        throw notFound();
    }
};
