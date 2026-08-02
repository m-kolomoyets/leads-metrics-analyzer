// Drizzle schema — server-side only. Tables are added per ticket:
//   T2 (#3)  — user, session
//   T4a (#5) — team (adds user.team_id FK)
//   T4c (#14) — invitation (one-time activation token)
//   (#41) — password_reset (hand-delivered password reset)
//   T5 (#7)  — preset, preset_version, shared_settings, shared_settings_version ✓
//   T6 (#8)  — applied_ruleset, applied_ruleset_geo, snapshot, snapshot_fact ✓
// See docs/specs/0001-multi-user-auth-teams-persistence.md and docs/adr/0002, 0006, 0007.

import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { date, doublePrecision, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// One role per user (spec §Roles). DB enum, not a TS enum — repo bans TS `enum`.
export const userRole = pgEnum('user_role', ['head', 'team_lead', 'buyer', 'designer', 'bdm']);

// Head sets status; a disabled user cannot log in (spec story 22, 24).
export const userStatus = pgEnum('user_status', ['active', 'invited', 'disabled']);

export const user = pgTable('user', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    // Human handle shown wherever a person is named (Report feed, #52). Required — existing rows were
    // backfilled once from the email local-part. Not unique: two people may share a first name.
    nickname: text('nickname').notNull(),
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

// Password reset (#41): a hand-delivered reset, mirroring `invitation`. A pending request is a row
// with `used_at IS NULL`; a null `token_hash` means the Head has requested but not yet minted a link.
// One row per user (`user_id` unique) — re-requesting upserts. `on delete cascade` drops the row with
// the user. Only the sha256 hash of the token is ever stored, never the raw token.
export const passwordReset = pgTable('password_reset', {
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
    requestedAt: timestamp('requested_at', { withTimezone: true }).notNull().defaultNow(),
    // Null until the Head mints a link; set to the sha256 hash of the raw token then.
    tokenHash: text('token_hash'),
    // Null until a link is minted; bounds the token's lifetime once set.
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    // Null until redeemed; set to the redemption time so a token cannot be reused.
    usedAt: timestamp('used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Preset (T5, #7): a per-Geo named threshold set, owned by its creator (`owner_user_id`) and scoped
// to a team (`team_id`). Identity = owner × team × geo × name. Editing NEVER mutates in place — each
// save appends an immutable `preset_version` and repoints `active_version_id` (ADR-0002), so a past
// judgement always reproduces. `active_version_id` ↔ `preset_version.preset_id` is a circular FK, so
// the pointer uses the AnyPgColumn annotation (like user/team). `team_id` is `set null` so deleting a
// team preserves the preset's history rather than dropping it; `owner_user_id` cascades — a deleted
// user's presets go with them.
export const preset = pgTable('preset', {
    id: uuid('id').primaryKey().defaultRandom(),
    teamId: uuid('team_id').references(
        () => {
            return team.id;
        },
        { onDelete: 'set null' }
    ),
    ownerUserId: uuid('owner_user_id')
        .notNull()
        .references(
            () => {
                return user.id;
            },
            { onDelete: 'cascade' }
        ),
    geo: text('geo').notNull(),
    name: text('name').notNull(),
    activeVersionId: uuid('active_version_id').references(
        (): AnyPgColumn => {
            return presetVersion.id;
        },
        { onDelete: 'set null' }
    ),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Append-only version stream for a preset. A row is INSERTed on every save and never UPDATEd; the
// parent's `active_version_id` names the current one. `thresholds` holds that Geo's threshold pairs
// (installs/regs/sales/clicks `{gy, yr}`) and Waste Zones as jsonb — untyped here so schema.ts stays
// self-contained across the drizzle-kit/client boundary; the service layer validates the shape with
// Zod on read/write. `on delete cascade` drops the history when its preset is deleted.
export const presetVersion = pgTable('preset_version', {
    id: uuid('id').primaryKey().defaultRandom(),
    presetId: uuid('preset_id')
        .notNull()
        .references(
            () => {
                return preset.id;
            },
            { onDelete: 'cascade' }
        ),
    thresholds: jsonb('thresholds').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Shared settings (T5, #7): team-global tunables (Review Multiplier, default Commission, Seller
// rules — domain doc 05) versioned immutably the same way as presets. One row per team (`team_id`
// unique); its `active_version_id` points at the current append-only version. `team_id` is nullable
// for the single global row a teamless Head owns — Postgres treats NULLs as distinct, so the unique
// constraint still binds real teams while leaving the global row unconstrained (the writer upserts it).
export const sharedSettings = pgTable('shared_settings', {
    id: uuid('id').primaryKey().defaultRandom(),
    teamId: uuid('team_id')
        .unique()
        .references(
            () => {
                return team.id;
            },
            { onDelete: 'cascade' }
        ),
    activeVersionId: uuid('active_version_id').references(
        (): AnyPgColumn => {
            return sharedSettingsVersion.id;
        },
        { onDelete: 'set null' }
    ),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const sharedSettingsVersion = pgTable('shared_settings_version', {
    id: uuid('id').primaryKey().defaultRandom(),
    sharedSettingsId: uuid('shared_settings_id')
        .notNull()
        .references(
            () => {
                return sharedSettings.id;
            },
            { onDelete: 'cascade' }
        ),
    payload: jsonb('payload').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Snapshots (T6, #8): a saved analysis pins the exact ruleset versions that produced it via a frozen
// Applied Ruleset (ADR-0002 at multi-user granularity), so later preset edits never change a saved
// Snapshot's numbers. `applied_ruleset` names the Shared-settings version in force; `applied_ruleset_geo`
// names one Preset version per analyzed Geo. Both point at the immutable version tables — a Snapshot
// can only be built from ALREADY-SAVED versions (spec story 35, "push forces save first").
// `shared_settings_version_id` is nullable so a teamless creator (with no shared settings) can still
// snapshot; `set null` on the version keeps the bundle if history is pruned.
export const appliedRuleset = pgTable('applied_ruleset', {
    id: uuid('id').primaryKey().defaultRandom(),
    sharedSettingsVersionId: uuid('shared_settings_version_id').references(
        () => {
            return sharedSettingsVersion.id;
        },
        { onDelete: 'set null' }
    ),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// One frozen Preset version per Geo the Snapshot analyzed. `preset_version_id` is `set null` rather
// than cascade so pruning a preset's history never silently rewrites what a saved Snapshot pinned.
export const appliedRulesetGeo = pgTable('applied_ruleset_geo', {
    id: uuid('id').primaryKey().defaultRandom(),
    appliedRulesetId: uuid('applied_ruleset_id')
        .notNull()
        .references(
            () => {
                return appliedRuleset.id;
            },
            { onDelete: 'cascade' }
        ),
    geo: text('geo').notNull(),
    presetVersionId: uuid('preset_version_id').references(
        () => {
            return presetVersion.id;
        },
        { onDelete: 'set null' }
    ),
});

// The traffic-light grade a fact carries — a cost metric graded against a Threshold Pair, or the
// funnel-derived Verdict (domain doc 04). `neutral` = no call yet.
export const factZone = pgEnum('fact_zone', ['green', 'yellow', 'red', 'neutral']);

// A saved Snapshot (spec §Snapshots). Creator-owned (`created_by_user_id`) and STAMPED with the
// creator's team at creation (`team_id`) so a member's later transfer never re-attributes their past
// Snapshots (spec story 13, ADR row-scope). Row-scope visibility filters on this stamped `team_id`.
// Immutable once saved — rows are only ever INSERTed. `owner` cascades; `team_id` is `set null` so a
// deleted team leaves the Snapshot standing (still creator-attributed). `meta` carries report-level
// context (date range, source hashes) as jsonb.
export const snapshot = pgTable('snapshot', {
    id: uuid('id').primaryKey().defaultRandom(),
    createdByUserId: uuid('created_by_user_id')
        .notNull()
        .references(
            () => {
                return user.id;
            },
            { onDelete: 'cascade' }
        ),
    teamId: uuid('team_id').references(
        () => {
            return team.id;
        },
        { onDelete: 'set null' }
    ),
    appliedRulesetId: uuid('applied_ruleset_id')
        .notNull()
        .references(() => {
            return appliedRuleset.id;
        }),
    reportDate: date('report_date').notNull(),
    takenAt: timestamp('taken_at', { withTimezone: true }).notNull().defaultNow(),
    meta: jsonb('meta'),
});

// A Snapshot's facts at grain Campaign × Creative × Date — enough to rebuild every roll-up and chart
// later (spec story 34). Money as double precision (Spend⁺ = Spend×(1+commission) is the numerator of
// every cost metric — domain gotchas); funnel counts as integers. `verdict` is the campaign action,
// `zone` the ROI/spend grade; both frozen at save. Append-only with its parent Snapshot.
export const snapshotFact = pgTable('snapshot_fact', {
    id: uuid('id').primaryKey().defaultRandom(),
    snapshotId: uuid('snapshot_id')
        .notNull()
        .references(
            () => {
                return snapshot.id;
            },
            { onDelete: 'cascade' }
        ),
    campaign: text('campaign').notNull(),
    creative: text('creative').notNull(),
    reportDate: date('report_date').notNull(),
    geo: text('geo').notNull(),
    account: text('account').notNull(),
    offer: text('offer').notNull(),
    os: text('os'),
    spend: doublePrecision('spend').notNull(),
    spendPlus: doublePrecision('spend_plus').notNull(),
    revenue: doublePrecision('revenue').notNull(),
    linkClicks: integer('link_clicks').notNull(),
    installs: integer('installs').notNull(),
    regs: integer('regs').notNull(),
    sales: integer('sales').notNull(),
    verdict: factZone('verdict').notNull(),
    zone: factZone('zone').notNull(),
});

export type UserRow = typeof user.$inferSelect;
export type SessionRow = typeof session.$inferSelect;
export type TeamRow = typeof team.$inferSelect;
export type InvitationRow = typeof invitation.$inferSelect;
export type PasswordResetRow = typeof passwordReset.$inferSelect;
export type PresetRow = typeof preset.$inferSelect;
export type PresetVersionRow = typeof presetVersion.$inferSelect;
export type SharedSettingsRow = typeof sharedSettings.$inferSelect;
export type SharedSettingsVersionRow = typeof sharedSettingsVersion.$inferSelect;
export type AppliedRulesetRow = typeof appliedRuleset.$inferSelect;
export type AppliedRulesetGeoRow = typeof appliedRulesetGeo.$inferSelect;
export type SnapshotRow = typeof snapshot.$inferSelect;
export type SnapshotFactRow = typeof snapshotFact.$inferSelect;
