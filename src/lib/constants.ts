// NOTE: Don't forget to change the theme name in the theme script (src/routes/__root.tsx).
export const LS_THEME_KEY = '<appName>_ADMIN_Theme';
export const ONE_SECOND = 1_000;
export const ONE_MINUTE = 60 * ONE_SECOND;
export const COMMON_ERROR_MESSAGE = 'Uh-oh, something went wrong.';
export const FALLBACK_REDIRECT = '/dashboard' as const;

// The five user roles (spec §Roles). Kept in sync with the `user_role` Postgres enum in
// src/lib/db/schema.ts — that file is loaded by drizzle-kit standalone, so it duplicates the
// literals rather than importing them across the client/server boundary.
export const USER_ROLES = ['head', 'team_lead', 'buyer', 'designer', 'bdm'] as const;
export type UserRole = (typeof USER_ROLES)[number];

// Account statuses the Head sets (spec story 22). Mirrors the `user_status` Postgres enum.
export const USER_STATUSES = ['active', 'invited', 'disabled'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const ROLES_IDS = {
    head: 'head',
    teamLead: 'team_lead',
    buyer: 'buyer',
    designer: 'designer',
    bdm: 'bdm',
} as const;
