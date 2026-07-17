import type { AdminTeam, AdminUser } from './types';
import { randomBytes } from 'node:crypto';
import { createServerFn } from '@tanstack/react-start';
import { eq } from 'drizzle-orm';
import { requireHead } from '@/lib/auth/guards';
import { hashPassword } from '@/lib/auth/password';
import { db } from '@/lib/db';
import { team, user } from '@/lib/db/schema';
import {
    createTeamInputSchema,
    createUserInputSchema,
    deleteTeamInputSchema,
    updateTeamInputSchema,
    updateTeamLeadInputSchema,
    updateUserInputSchema,
} from './schemas';

// Head-only admin API (T4a, #5). Every handler gates on `requireHead()` first — a non-Head caller is
// rejected before any DB work. Row/dimension read-visibility is governed by the pure access-policy
// seam (`scopeFor`); these mutations have no rows to scope, so the explicit head edge check is the
// gate. Because role/status/team live in the DB (the session store's source of truth), a
// reassignment takes effect on the target user's next request (spec story 4).

// Postgres unique_violation — a duplicate email hits the `user.email` unique index.
const isUniqueViolation = (error: unknown) => {
    return (error as { code?: string } | null)?.code === '23505';
};

const USER_COLUMNS = {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    teamId: user.teamId,
} as const;

const TEAM_COLUMNS = {
    id: team.id,
    name: team.name,
    leadId: team.leadId,
} as const;

// Head-only reads backing the admin panel (T4b, #6). Same `requireHead` edge gate as the mutations —
// the list is administrative data (every user, every team) that only the Head may see.
export const listUsersFn = createServerFn({ method: 'GET' }).handler(async (): Promise<AdminUser[]> => {
    await requireHead();

    return db.select(USER_COLUMNS).from(user).orderBy(user.email);
});

export const listTeamsFn = createServerFn({ method: 'GET' }).handler(async (): Promise<AdminTeam[]> => {
    await requireHead();

    return db.select(TEAM_COLUMNS).from(team).orderBy(team.name);
});

export const createTeamFn = createServerFn({ method: 'POST' })
    .inputValidator(createTeamInputSchema)
    .handler(async ({ data }): Promise<AdminTeam> => {
        await requireHead();

        const [row] = await db
            .insert(team)
            .values({ name: data.name })
            .returning({ id: team.id, name: team.name, leadId: team.leadId });

        return row;
    });

export const createUserFn = createServerFn({ method: 'POST' })
    .inputValidator(createUserInputSchema)
    .handler(async ({ data }): Promise<AdminUser> => {
        await requireHead();

        // A created user is invited, not self-registered — no chosen password yet. Store a hash of
        // an unguessable random secret so the NOT NULL column holds; the account cannot log in until
        // an activation flow (out of scope here) sets a real password, and `invited`/`disabled`
        // statuses already block login regardless.
        const passwordHash = await hashPassword(randomBytes(32).toString('hex'));

        try {
            const [row] = await db
                .insert(user)
                .values({
                    email: data.email,
                    passwordHash,
                    role: data.role,
                    status: data.status,
                    teamId: data.teamId ?? null,
                })
                .returning(USER_COLUMNS);

            return row;
        } catch (error) {
            if (isUniqueViolation(error)) {
                throw new Error('A user with this email already exists');
            }

            throw error;
        }
    });

export const updateUserFn = createServerFn({ method: 'POST' })
    .inputValidator(updateUserInputSchema)
    .handler(async ({ data }): Promise<AdminUser> => {
        await requireHead();

        // Build the SET from present fields only. A null teamId is a real change (unassign), so it is
        // keyed on `!== undefined`, not truthiness.
        const updates: Partial<{ role: AdminUser['role']; status: AdminUser['status']; teamId: string | null }> = {};

        if (data.role !== undefined) {
            updates.role = data.role;
        }

        if (data.status !== undefined) {
            updates.status = data.status;
        }

        if (data.teamId !== undefined) {
            updates.teamId = data.teamId;
        }

        const [row] = await db.update(user).set(updates).where(eq(user.id, data.id)).returning(USER_COLUMNS);

        if (!row) {
            throw new Error('User not found');
        }

        return row;
    });

export const updateTeamFn = createServerFn({ method: 'POST' })
    .inputValidator(updateTeamInputSchema)
    .handler(async ({ data }): Promise<AdminTeam> => {
        await requireHead();

        const [row] = await db
            .update(team)
            .set({ name: data.name })
            .where(eq(team.id, data.id))
            .returning({ id: team.id, name: team.name, leadId: team.leadId });

        if (!row) {
            throw new Error('Team not found');
        }

        return row;
    });

// Deleting a team unplaces its members and clears its lead pointer automatically — both `user.team_id`
// and `team.lead_id` FKs are declared `on delete set null` (schema.ts), so no member is deleted.
export const deleteTeamFn = createServerFn({ method: 'POST' })
    .inputValidator(deleteTeamInputSchema)
    .handler(async ({ data }): Promise<{ id: string }> => {
        await requireHead();

        const [row] = await db.delete(team).where(eq(team.id, data.id)).returning({ id: team.id });

        if (!row) {
            throw new Error('Team not found');
        }

        return row;
    });

export const setTeamLeadFn = createServerFn({ method: 'POST' })
    .inputValidator(updateTeamLeadInputSchema)
    .handler(async ({ data }): Promise<AdminTeam> => {
        await requireHead();

        // One lead per team is the single `lead_id` column. Designating a lead also places that user
        // on the team so team-scoped visibility routes correctly (spec story 23) — both writes commit
        // together or not at all.
        const row = await db.transaction(async (tx) => {
            const [updated] = await tx
                .update(team)
                .set({ leadId: data.leadId })
                .where(eq(team.id, data.id))
                .returning({ id: team.id, name: team.name, leadId: team.leadId });

            if (!updated) {
                throw new Error('Team not found');
            }

            if (data.leadId) {
                await tx.update(user).set({ teamId: data.id }).where(eq(user.id, data.leadId));
            }

            return updated;
        });

        return row;
    });
