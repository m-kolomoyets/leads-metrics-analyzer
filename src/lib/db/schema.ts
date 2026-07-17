// Drizzle schema — server-side only. Tables are added per ticket:
//   T2 (#3)  — user, session
//   T4a (#5) — team (adds user.team_id FK)
//   T5 (#7)  — preset, preset_version, shared_settings, shared_settings_version
//   T6 (#8)  — snapshot, snapshot_fact, applied_ruleset, applied_ruleset_geo
// See docs/specs/0001-multi-user-auth-teams-persistence.md and docs/adr/0002, 0006, 0007.

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
    // team_id FK is added in T4a (#5) once the team table exists.
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

export type UserRow = typeof user.$inferSelect;
export type SessionRow = typeof session.$inferSelect;
