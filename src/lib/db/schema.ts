// Drizzle schema — server-side only. Tables are added per ticket:
//   T2 (#3)  — user, session
//   T4a (#5) — team (adds user.team_id FK)
//   T4c (#14) — invitation (one-time activation token)
//   T5 (#7)  — preset, preset_version, shared_settings, shared_settings_version
//   T6 (#8)  — snapshot, snapshot_fact, applied_ruleset, applied_ruleset_geo
// See docs/specs/0001-multi-user-auth-teams-persistence.md and docs/adr/0002, 0006, 0007.

import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// One role per user (spec §Roles). DB enum, not a TS enum — repo bans TS `enum`.
export const userRole = pgEnum('user_role', ['head', 'team_lead', 'buyer', 'designer', 'bdm']);

// Head sets status; a disabled user cannot log in (spec story 22, 24).
export const userStatus = pgEnum('user_status', ['active', 'invited', 'disabled']);

export const user = pgTable('user', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    // Argon2id hash only — never the plaintext (spec story 5).
    passwordHash: text('password_hash').notNull(),
    role: userRole('role').notNull().default('buyer'),
    status: userStatus('status').notNull().default('invited'),
    // A user belongs to at most one team (spec §Teams). Nullable: head/designer/bdm are teamless,
    // and a buyer exists before placement. Forward ref to `team` (declared below) needs the
    // AnyPgColumn annotation to break the circular-type inference (drizzle circular-FK guidance).
    // `set null` so deleting a team unplaces its members rather than deleting them.
    teamId: uuid('team_id').references(
        (): AnyPgColumn => {
            return team.id;
        },
        { onDelete: 'set null' }
    ),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// A team has exactly one lead (spec §Teams) — `lead_id` is a single nullable FK, so a team can be
// created before its lead is designated (PATCH /admin/teams/:id). `set null` so deleting the lead
// user leaves the team leaderless rather than cascading. The `user` back-reference above closes the
// cycle; this direction points at the already-declared `user`, so a plain arrow suffices.
export const team = pgTable('team', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    leadId: uuid('lead_id').references(
        () => {
            return user.id;
        },
        { onDelete: 'set null' }
    ),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Server-side sessions (spec §Roles): the session id is an opaque token held in an httpOnly cookie.
// Deleting the row revokes access on the next request; expiresAt bounds inactivity.
export const session = pgTable('session', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
        .notNull()
        .references(
            () => {
                return user.id;
            },
            { onDelete: 'cascade' }
        ),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Invitation (T4c, #14): a one-time, expiring token that lets an `invited` user set their password
// and activate. Only the sha256 hash of the token is stored — never the raw token. One active
// invitation per user (`user_id` unique); re-inviting replaces the row. `on delete cascade` so
// deleting a user drops their invitation.
export const invitation = pgTable('invitation', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
        .notNull()
        .unique()
        .references(
            () => {
                return user.id;
            },
            { onDelete: 'cascade' }
        ),
    tokenHash: text('token_hash').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    // Null until redeemed; set to the redemption time so a token cannot be reused.
    usedAt: timestamp('used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type UserRow = typeof user.$inferSelect;
export type SessionRow = typeof session.$inferSelect;
export type TeamRow = typeof team.$inferSelect;
export type InvitationRow = typeof invitation.$inferSelect;
