// Drizzle schema — server-side only. Tables are added per ticket:
//   T2 (#3)  — user, session
//   T4a (#5) — team (adds user.team_id FK)
//   T4c (#14) — invitation (one-time activation token)
//   (#41) — password_reset (hand-delivered password reset)
//   T5 (#7)  — preset, preset_version, shared_settings, shared_settings_version ✓
//   T6 (#8)  — applied_ruleset, applied_ruleset_geo, snapshot, snapshot_fact ✓
//   S2a (#53) — snapshot_geo, snapshot_creative, snapshot_campaign_model, snapshot_fact.attribution,
//               copied thresholds on applied_ruleset(_geo) ✓
//   D3 — snapshot.status/replaced_by/replaced_at (replaceable Snapshots) ✓
//   offers-and-home/04 — offer_card, fx_rate (Offer Cards, ADR-0027) ✓
//   offers-and-home/08 — offer_thread_entry, offer_card_seen (Thread, unread counts) ✓
//   offers-and-home/09 — offer_card.deadline ✓
// See docs/specs/0001-multi-user-auth-teams-persistence.md, docs/specs/0003-reports-feed-archive-detailed-report.md
// and docs/adr/0002, 0006, 0007, 0015, 0018.

import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import {
    boolean,
    date,
    doublePrecision,
    index,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    primaryKey,
    text,
    timestamp,
    unique,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';

// One role per user (spec §Roles). DB enum, not a TS enum — repo bans TS `enum`.
export const userRole = pgEnum('user_role', ['head', 'team_lead', 'buyer', 'designer', 'bdm']);

// Head sets status; a disabled user cannot log in (spec story 22, 24).
export const userStatus = pgEnum('user_status', ['active', 'invited', 'disabled']);

export const user = pgTable(
    'user',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        email: text('email').notNull().unique(),
        // Human handle shown wherever a person is named (Report feed, #52). Required — existing rows were
        // backfilled once from the email local-part. Unique case-insensitively (index below) so Assignment
        // can resolve a buyer from a handle; the migration disambiguated earlier duplicates with a suffix.
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
    },
    (t) => {
        // Mirrors `normalizeNickname` (trim + case-fold); the app trims before write, so `lower` suffices.
        return [uniqueIndex('user_nickname_lower_key').on(sql`lower(${t.nickname})`)];
    }
);

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
    // The RESOLVED shared settings, copied in at save (ADR-0015): Review Multiplier, Waste Zones and
    // the default Commission. The version id above stays as provenance, but the reference cannot be
    // relied on — it is `set null` when history is pruned, and a grade that a delete can erase is not
    // frozen. Null for Snapshots written before S2a (#53); they read `—` rather than being backfilled.
    settings: jsonb('settings'),
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
    // That Geo's resolved Threshold Pairs, copied in at save (ADR-0015). `preset_version` cascades
    // when its Preset is deleted and the pin above is `set null`, so a buyer tidying up Presets would
    // otherwise un-grade every Snapshot that pinned them. Null for pre-S2a (#53) Snapshots.
    thresholds: jsonb('thresholds'),
});

// The traffic-light grade a fact carries — a cost metric graded against a Threshold Pair, or the
// funnel-derived Verdict (domain doc 04). `neutral` = no call yet.
export const factZone = pgEnum('fact_zone', ['green', 'yellow', 'red', 'neutral']);

// How completely a fact is attributed (ADR-0012). `campaign_lost` is an Unfired-Macro row: real
// Account/Creative/Offer/OS/Geo, no Campaign and no Spend. Stored rather than inferred from the `—`
// display placeholder, because the Problem Account detector skips non-`full` facts on purpose and a
// money-losing safeguard must not hang off a UI string (ADR-0015).
export const factAttribution = pgEnum('fact_attribution', ['full', 'campaign_lost']);

// A Snapshot's lifecycle (ADR-0018). `active` is the only state a read ever counts; `replaced` marks
// a row superseded by a correction. There are no other states, and the column is not nullable — every
// pre-existing row reads `active` through the default, with no backfill script.
export const snapshotStatus = pgEnum('snapshot_status', ['active', 'replaced']);

// A saved Snapshot (spec §Snapshots). Creator-owned (`created_by_user_id`) and STAMPED with the
// creator's team at creation (`team_id`) so a member's later transfer never re-attributes their past
// Snapshots (spec story 13, ADR row-scope). Row-scope visibility filters on this stamped `team_id`.
// Immutable once saved — rows are only ever INSERTed, and the three lifecycle columns below are the
// single exception: a replacement flips them and touches nothing else, so the superseded row still
// rebuilds its own report for audit (ADR-0018). A replaced Snapshot is never DELETEd. `owner`
// cascades; `team_id` is `set null` so a deleted team leaves the Snapshot standing (still
// creator-attributed). `meta` carries report-level context (date range, source hashes) as jsonb.
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
    // Lifecycle (ADR-0018). `replaced_by` points at the correction that superseded this row — a
    // self-FK, so it carries the AnyPgColumn annotation like the other circular pointers above. It is
    // `set null` on delete rather than cascading: a Snapshot is never deleted, and if one ever were,
    // losing the pointer must not take the audit trail with it.
    status: snapshotStatus('status').notNull().default('active'),
    replacedBy: uuid('replaced_by').references(
        (): AnyPgColumn => {
            return snapshot.id;
        },
        { onDelete: 'set null' }
    ),
    replacedAt: timestamp('replaced_at', { withTimezone: true }),
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
    // Frozen at save from the compute layer's own `fact.attribution` (S2a, #53). Defaulted so rows
    // written before this column existed read `full`: it is the only class the old write path could
    // grade, and no honest value can be recovered for the rest without inferring from a placeholder.
    attribution: factAttribution('attribution').notNull().default('full'),
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

// The Frozen Geo Rollup (S2a, #53, ADR-0015): the header figures exactly as the buyer saw them. Its
// reason for existing is `geo_total` — the Geo Total counts Untagged Revenue, which never becomes a
// Fact (ADR-0003, ADR-0012) and so is unreconstructable in principle. The rest of the line is frozen
// alongside it so the Report feed renders hundreds of Geo rows without loading a single Fact.
// NULLABLE BY DESIGN as a table: a Snapshot written before this shipped simply has no row here, and
// the report renders `—` rather than fabricating an Attributed sum. Cost metrics are nullable for the
// same reason they are null in the compute layer — a zero denominator means "not shown", never 0.
export const snapshotGeo = pgTable(
    'snapshot_geo',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        snapshotId: uuid('snapshot_id')
            .notNull()
            .references(
                () => {
                    return snapshot.id;
                },
                { onDelete: 'cascade' }
            ),
        geo: text('geo').notNull(),
        spendPlus: doublePrecision('spend_plus').notNull(),
        // Revenue INCLUDING untagged — the Geo Total (ADR-0003). Deliberately ≥ `attributed_revenue`.
        geoTotal: doublePrecision('geo_total').notNull(),
        // Revenue from matched campaigns only; its gap to `geo_total` is the tracking-health signal.
        attributedRevenue: doublePrecision('attributed_revenue').notNull(),
        // The Geo Total's funnel, untagged rows INCLUDED (S2b, #54). Frozen for the same reason
        // `geo_total` is: an untagged row's installs and clicks never become a Fact either (ADR-0003),
        // so a rebuilt report could otherwise only report the Attributed funnel under a Geo-Total
        // revenue. Defaulted at the column so the rows written between #53 and #54 still read.
        linkClicks: integer('link_clicks').notNull().default(0),
        installs: integer('installs').notNull().default(0),
        regs: integer('regs').notNull().default(0),
        sales: integer('sales').notNull().default(0),
        profit: doublePrecision('profit').notNull(),
        roi: doublePrecision('roi'),
        cpc: doublePrecision('cpc'),
        cpi: doublePrecision('cpi'),
        cpr: doublePrecision('cpr'),
        cps: doublePrecision('cps'),
        // Σ each account's waste, mixed-grain by design (ADR-0014) — so it will not reconcile against
        // the account totals table, and the Problem Accounts block is what decomposes it.
        waste: doublePrecision('waste').notNull(),
    },
    (table) => {
        return [unique('snapshot_geo_snapshot_geo_key').on(table.snapshotId, table.geo)];
    }
);

// The Creative Split (S2a, #53): real per-creative Spend and Impressions, straight from Facebook —
// never allocated. It lives BELOW the Fact Grain (a Fact's `creative` is only the top-spending label),
// so without this the Creative table's CTR, CPM and Spend-share allocation have no inputs at all.
export const snapshotCreative = pgTable(
    'snapshot_creative',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        snapshotId: uuid('snapshot_id')
            .notNull()
            .references(
                () => {
                    return snapshot.id;
                },
                { onDelete: 'cascade' }
            ),
        geo: text('geo').notNull(),
        campaign: text('campaign').notNull(),
        // The raw FB ad name. Parsed to a creative key on read — parsing is a compute concern, and a
        // frozen key would freeze the parser with it.
        adName: text('ad_name').notNull(),
        spend: doublePrecision('spend').notNull(),
        impressions: integer('impressions').notNull(),
    },
    (table) => {
        return [unique('snapshot_creative_grain_key').on(table.snapshotId, table.geo, table.campaign, table.adName)];
    }
);

// The dimension a Campaign Model row breaks a campaign down by (domain doc 06).
export const modelDimension = pgEnum('model_dimension', ['offer', 'os']);

// The Campaign Model (S2a, #53): a campaign's Offer/OS funnel breakdown — the input the Offers and OS
// tables allocate over at the Geo unit cost (ADR-0013). Also below the Fact Grain: a Fact's `offer` is
// a representative label and its `os` is null whenever a campaign ran more than one. No Spend column —
// Facebook never measures Offer or OS spend; it is imputed on read, which is the whole point of
// keeping the allocation derived rather than frozen.
export const snapshotCampaignModel = pgTable(
    'snapshot_campaign_model',
    {
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
        dimension: modelDimension('dimension').notNull(),
        // Offer ID or OS value — the reconciling identity; `label` is its display name.
        key: text('key').notNull(),
        label: text('label').notNull(),
        revenue: doublePrecision('revenue').notNull(),
        // KT clicks has no Offer, so an offer row's clicks are legitimately 0 (domain doc 06).
        linkClicks: integer('link_clicks').notNull(),
        installs: integer('installs').notNull(),
        regs: integer('regs').notNull(),
        sales: integer('sales').notNull(),
    },
    (table) => {
        return [
            unique('snapshot_campaign_model_grain_key').on(
                table.snapshotId,
                table.campaign,
                table.dimension,
                table.key
            ),
        ];
    }
);

// Offer Cards (offers-and-home PRD, CONTEXT.md §Offer Cards). The currency the offer string declared
// the Payout in — the only two the parser reads (`domain/offerString`).
export const offerCurrency = pgEnum('offer_currency', ['USD', 'EUR']);

// Whether the Payout is fixed in USD yet (ADR-0027). `pending` only when the rate service was down at
// creation: the card exists, carries no `payout_usd`, and a retry fixes it on the day it succeeds.
export const offerFxStatus = pgEnum('offer_fx_status', ['fixed', 'pending']);

// One Offer Card per live `offer_id` (partial unique index below); an archived card may share its id
// with a newer one. The raw string is kept verbatim as the caption — only the Payout and the
// Assignment are read out of it, and the Assignment's raw team/recipient text is stored beside the
// resolved FKs so an Unresolved card (nobody matched) can be fixed later without re-parsing.
// `payout_original`/`payout_currency`/`fx_rate`/`fx_fetched_at`/`payout_usd` are ADR-0027's fields:
// fetched once, never refreshed. `team_id`/`buyer_user_id` `set null` so a deleted team or user
// leaves the card standing (it turns Unresolved); the creator cascades like a Snapshot's does.
export const offerCard = pgTable(
    'offer_card',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        // The external Keitaro offer id (`13002`) — the key cards join to Snapshot rows by.
        offerId: text('offer_id').notNull(),
        rawString: text('raw_string').notNull(),
        payoutOriginal: doublePrecision('payout_original').notNull(),
        payoutCurrency: offerCurrency('payout_currency').notNull(),
        fxStatus: offerFxStatus('fx_status').notNull().default('fixed'),
        // Null while `fx_status = 'pending'`. A USD offer stores rate 1.
        fxRate: doublePrecision('fx_rate'),
        fxFetchedAt: timestamp('fx_fetched_at', { withTimezone: true }),
        payoutUsd: doublePrecision('payout_usd'),
        // Assignment as the string named it, verbatim (trimmed). `recipient` equals `team` for a
        // team-wide offer.
        assignedTeamText: text('assigned_team_text').notNull(),
        assignedRecipientText: text('assigned_recipient_text').notNull(),
        teamId: uuid('team_id').references(
            () => {
                return team.id;
            },
            { onDelete: 'set null' }
        ),
        // Null for a team-wide offer, and for an Unresolved one.
        buyerUserId: uuid('buyer_user_id').references(
            () => {
                return user.id;
            },
            { onDelete: 'set null' }
        ),
        // True when the team or the named buyer matched nobody at creation — visible to bdm/head only
        // until fixed (PRD story 7–8).
        isAssignmentUnresolved: boolean('is_assignment_unresolved').notNull().default(false),
        createdByUserId: uuid('created_by_user_id')
            .notNull()
            .references(
                () => {
                    return user.id;
                },
                { onDelete: 'cascade' }
            ),
        // The day the offer must be launched by (CONTEXT.md §Deadline, slice 09) — a calendar date,
        // judged against Kyiv's today. Null when none was set.
        deadline: date('deadline'),
        // Null while live. Archiving keeps the row and its history; the partial unique index only
        // counts live cards.
        archivedAt: timestamp('archived_at', { withTimezone: true }),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (t) => {
        return [
            uniqueIndex('offer_card_live_offer_id_key')
                .on(t.offerId)
                .where(sql`${t.archivedAt} is null`),
        ];
    }
);

// The per-day FX cache (ADR-0027): one row per calendar day × base × quote, written the first time a
// card needs that day's rate, read by every later card the same day. `day` is the Kyiv calendar day
// the rate was fetched on (the app's one timezone, ADR-0017) — the cache key, not the ECB reference
// date, which is what `fetched_at` and the card's `fx_fetched_at` record.
export const fxRate = pgTable(
    'fx_rate',
    {
        day: date('day').notNull(),
        base: text('base').notNull(),
        quote: text('quote').notNull(),
        rate: doublePrecision('rate').notNull(),
        fetchedAt: timestamp('fetched_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (t) => {
        return [primaryKey({ columns: [t.day, t.base, t.quote] })];
    }
);

// A Thread entry's kind (CONTEXT.md §Thread): a person's comment, or a system entry written when
// the Deadline or the Assignment changes (slice 09). One stream, one order.
export const offerThreadEntryKind = pgEnum('offer_thread_entry_kind', [
    'comment',
    'deadline_changed',
    'assignment_changed',
]);

// An Offer Card's Thread (offers-and-home/08). `author_user_id` is the commenter, or the actor of a
// system entry; `set null` so a deleted user's words stay in the record. `body` is the comment text,
// or for a system entry the new value as text (the date, the assignment) — rendered, never parsed.
// A deleted comment keeps its row with `deleted_at` set, so the count of what was said and unread
// stays honest; the 15-minute edit/delete window is enforced by the server against `created_at`.
export const offerThreadEntry = pgTable(
    'offer_thread_entry',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        offerCardId: uuid('offer_card_id')
            .notNull()
            .references(
                () => {
                    return offerCard.id;
                },
                { onDelete: 'cascade' }
            ),
        authorUserId: uuid('author_user_id').references(
            () => {
                return user.id;
            },
            { onDelete: 'set null' }
        ),
        kind: offerThreadEntryKind('kind').notNull(),
        body: text('body').notNull(),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        editedAt: timestamp('edited_at', { withTimezone: true }),
        deletedAt: timestamp('deleted_at', { withTimezone: true }),
    },
    (t) => {
        return [index('offer_thread_entry_card_idx').on(t.offerCardId, t.createdAt)];
    }
);

// When a user last opened a card (offers-and-home/08) — the mark that unread counts are measured
// from. One row per user × card, upserted on every open.
export const offerCardSeen = pgTable(
    'offer_card_seen',
    {
        userId: uuid('user_id')
            .notNull()
            .references(
                () => {
                    return user.id;
                },
                { onDelete: 'cascade' }
            ),
        offerCardId: uuid('offer_card_id')
            .notNull()
            .references(
                () => {
                    return offerCard.id;
                },
                { onDelete: 'cascade' }
            ),
        lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (t) => {
        return [primaryKey({ columns: [t.userId, t.offerCardId] })];
    }
);

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
export type SnapshotGeoRow = typeof snapshotGeo.$inferSelect;
export type SnapshotCreativeRow = typeof snapshotCreative.$inferSelect;
export type SnapshotCampaignModelRow = typeof snapshotCampaignModel.$inferSelect;
export type OfferCardRow = typeof offerCard.$inferSelect;
export type FxRateRow = typeof fxRate.$inferSelect;
