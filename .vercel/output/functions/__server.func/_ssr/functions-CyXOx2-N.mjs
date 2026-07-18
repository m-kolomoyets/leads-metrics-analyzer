import { randomBytes } from 'node:crypto';
import {
    c as createTeamInputSchema,
    a as createUserInputSchema,
    d as deleteTeamInputSchema,
    b as deleteUserInputSchema,
    r as resendInvitationInputSchema,
    R as ROLES_IDS,
    e as updateTeamInputSchema,
    u as updateTeamLeadInputSchema,
    f as updateUserInputSchema,
} from './schemas-BFwg8Iyq.mjs';
import { e as eq } from '../_libs/drizzle-orm.mjs';
import { a as createServerFn, c as createServerRpc } from './index.mjs';
import {
    d as db,
    g as getSessionUser,
    a as hashInvitationToken,
    h as hashPassword,
    i as invitation,
    t as team,
    u as user,
} from './password-ZqIeyFWn.mjs';
import '../_libs/react.mjs';
import '../_libs/dotenv.mjs';
import '../_libs/postgres.mjs';
import '@node-rs/argon2';
import 'node:async_hooks';
import 'node:stream';
import '../_libs/tanstack__react-router.mjs';
import '../_libs/tanstack__router-core.mjs';
import '../_libs/tanstack__history.mjs';
import 'node:stream/web';
import '../_libs/react-dom.mjs';
import 'util';
import 'async_hooks';
import 'crypto';
import 'stream';
import '../_libs/isbot.mjs';
import '../_libs/zod.mjs';
import 'path';
import 'fs';
import 'os';
import 'net';
import 'tls';
import 'perf_hooks';

const UNAUTHORIZED_MESSAGE = 'Not authenticated';
const FORBIDDEN_MESSAGE = 'Forbidden';
const requireHead = async () => {
    const me = await getSessionUser();
    if (!me) {
        throw new Error(UNAUTHORIZED_MESSAGE);
    }
    if (me.role !== ROLES_IDS.head) {
        throw new Error(FORBIDDEN_MESSAGE);
    }
    return me;
};
const INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1e3;
const issueInvitation = async (userId) => {
    const rawToken = randomBytes(32).toString('base64url');
    const tokenHash = hashInvitationToken(rawToken);
    const expiresAt = new Date(Date.now() + INVITATION_TTL_MS);
    await db
        .insert(invitation)
        .values({ userId, tokenHash, expiresAt })
        .onConflictDoUpdate({
            target: invitation.userId,
            set: { tokenHash, expiresAt, usedAt: null },
        });
    return rawToken;
};
const isUniqueViolation = (error) => {
    return error?.code === '23505';
};
const USER_COLUMNS = {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    teamId: user.teamId,
};
const TEAM_COLUMNS = {
    id: team.id,
    name: team.name,
    leadId: team.leadId,
};
const listUsersFn_createServerFn_handler = createServerRpc(
    {
        id: '6d69451eee36ff58fb791cbb4eec0f15e3ea56b6b1cf8d46d959d43547a6fbb3',
        name: 'listUsersFn',
        filename: 'src/services/admin/functions.ts',
    },
    (opts) => listUsersFn.__executeServer(opts)
);
const listUsersFn = createServerFn({
    method: 'GET',
}).handler(listUsersFn_createServerFn_handler, async () => {
    await requireHead();
    return db.select(USER_COLUMNS).from(user).orderBy(user.email);
});
const listTeamsFn_createServerFn_handler = createServerRpc(
    {
        id: '45893ca7f6a1a2b0ddd1eab61ee06e5568c27b0977a5c12f1b0e803535312e74',
        name: 'listTeamsFn',
        filename: 'src/services/admin/functions.ts',
    },
    (opts) => listTeamsFn.__executeServer(opts)
);
const listTeamsFn = createServerFn({
    method: 'GET',
}).handler(listTeamsFn_createServerFn_handler, async () => {
    await requireHead();
    return db.select(TEAM_COLUMNS).from(team).orderBy(team.name);
});
const createTeamFn_createServerFn_handler = createServerRpc(
    {
        id: 'f1629487f63b203d7703bbab0987d78ec5a5fd55b5f1da4a061f8891d9dff976',
        name: 'createTeamFn',
        filename: 'src/services/admin/functions.ts',
    },
    (opts) => createTeamFn.__executeServer(opts)
);
const createTeamFn = createServerFn({
    method: 'POST',
})
    .inputValidator(createTeamInputSchema)
    .handler(createTeamFn_createServerFn_handler, async ({ data }) => {
        await requireHead();
        const [row] = await db
            .insert(team)
            .values({
                name: data.name,
            })
            .returning({
                id: team.id,
                name: team.name,
                leadId: team.leadId,
            });
        return row;
    });
const createUserFn_createServerFn_handler = createServerRpc(
    {
        id: '234f4cead3236d9dbf1e5435c147da848cc8d58286433eb3fe7f127f9f6cee98',
        name: 'createUserFn',
        filename: 'src/services/admin/functions.ts',
    },
    (opts) => createUserFn.__executeServer(opts)
);
const createUserFn = createServerFn({
    method: 'POST',
})
    .inputValidator(createUserInputSchema)
    .handler(createUserFn_createServerFn_handler, async ({ data }) => {
        await requireHead();
        const passwordHash = await hashPassword(randomBytes(32).toString('hex'));
        let row;
        try {
            [row] = await db
                .insert(user)
                .values({
                    email: data.email,
                    passwordHash,
                    role: data.role,
                    status: data.status,
                    teamId: data.teamId ?? null,
                })
                .returning(USER_COLUMNS);
        } catch (error) {
            if (isUniqueViolation(error)) {
                throw new Error('A user with this email already exists');
            }
            throw error;
        }
        const activationToken = row.status === 'invited' ? await issueInvitation(row.id) : null;
        return {
            ...row,
            activationToken,
        };
    });
const deleteUserFn_createServerFn_handler = createServerRpc(
    {
        id: '11a07940daad52d178b28c761c31f13e0abf489057b0545f01b18e88f37e23e8',
        name: 'deleteUserFn',
        filename: 'src/services/admin/functions.ts',
    },
    (opts) => deleteUserFn.__executeServer(opts)
);
const deleteUserFn = createServerFn({
    method: 'POST',
})
    .inputValidator(deleteUserInputSchema)
    .handler(deleteUserFn_createServerFn_handler, async ({ data }) => {
        const me = await requireHead();
        if (me.id === data.id) {
            throw new Error('You cannot delete your own account');
        }
        const deleted = await db.transaction(async (tx) => {
            await tx
                .update(team)
                .set({
                    leadId: null,
                })
                .where(eq(team.leadId, data.id));
            const [row] = await tx.delete(user).where(eq(user.id, data.id)).returning({
                id: user.id,
            });
            return row;
        });
        if (!deleted) {
            throw new Error('User not found');
        }
        return deleted;
    });
const resendInvitationFn_createServerFn_handler = createServerRpc(
    {
        id: '5dae9ea880ac4b6fc903edbb803c9a8f7204127c6bbeded7b8286402673f232d',
        name: 'resendInvitationFn',
        filename: 'src/services/admin/functions.ts',
    },
    (opts) => resendInvitationFn.__executeServer(opts)
);
const resendInvitationFn = createServerFn({
    method: 'POST',
})
    .inputValidator(resendInvitationInputSchema)
    .handler(resendInvitationFn_createServerFn_handler, async ({ data }) => {
        await requireHead();
        const [row] = await db.select(USER_COLUMNS).from(user).where(eq(user.id, data.id)).limit(1);
        if (!row) {
            throw new Error('User not found');
        }
        if (row.status !== 'invited') {
            throw new Error('Only invited users can be re-invited');
        }
        const activationToken = await issueInvitation(row.id);
        return {
            ...row,
            activationToken,
        };
    });
const updateUserFn_createServerFn_handler = createServerRpc(
    {
        id: 'eed2d0a904899c29f8b6f308600676242b268d9827ca9d37fd051a72a96ab871',
        name: 'updateUserFn',
        filename: 'src/services/admin/functions.ts',
    },
    (opts) => updateUserFn.__executeServer(opts)
);
const updateUserFn = createServerFn({
    method: 'POST',
})
    .inputValidator(updateUserInputSchema)
    .handler(updateUserFn_createServerFn_handler, async ({ data }) => {
        await requireHead();
        const updates = {};
        if (data.role !== void 0) {
            updates.role = data.role;
        }
        if (data.status !== void 0) {
            updates.status = data.status;
        }
        if (data.teamId !== void 0) {
            updates.teamId = data.teamId;
        }
        const [row] = await db.update(user).set(updates).where(eq(user.id, data.id)).returning(USER_COLUMNS);
        if (!row) {
            throw new Error('User not found');
        }
        return row;
    });
const updateTeamFn_createServerFn_handler = createServerRpc(
    {
        id: 'c9fe8570b6ba7c14cef30cfedd5a8ed7e79b6654992f280c6569c005a92691e1',
        name: 'updateTeamFn',
        filename: 'src/services/admin/functions.ts',
    },
    (opts) => updateTeamFn.__executeServer(opts)
);
const updateTeamFn = createServerFn({
    method: 'POST',
})
    .inputValidator(updateTeamInputSchema)
    .handler(updateTeamFn_createServerFn_handler, async ({ data }) => {
        await requireHead();
        const [row] = await db
            .update(team)
            .set({
                name: data.name,
            })
            .where(eq(team.id, data.id))
            .returning({
                id: team.id,
                name: team.name,
                leadId: team.leadId,
            });
        if (!row) {
            throw new Error('Team not found');
        }
        return row;
    });
const deleteTeamFn_createServerFn_handler = createServerRpc(
    {
        id: 'c4e96b41d3c28bedef7426fc9a09126d4197153b4285d64558a96b563da0c38a',
        name: 'deleteTeamFn',
        filename: 'src/services/admin/functions.ts',
    },
    (opts) => deleteTeamFn.__executeServer(opts)
);
const deleteTeamFn = createServerFn({
    method: 'POST',
})
    .inputValidator(deleteTeamInputSchema)
    .handler(deleteTeamFn_createServerFn_handler, async ({ data }) => {
        await requireHead();
        const [row] = await db.delete(team).where(eq(team.id, data.id)).returning({
            id: team.id,
        });
        if (!row) {
            throw new Error('Team not found');
        }
        return row;
    });
const setTeamLeadFn_createServerFn_handler = createServerRpc(
    {
        id: 'ba37af0122d3475dd1b7289425ea54d9ddeecd11372fa2e7f24fbd03f12ddca0',
        name: 'setTeamLeadFn',
        filename: 'src/services/admin/functions.ts',
    },
    (opts) => setTeamLeadFn.__executeServer(opts)
);
const setTeamLeadFn = createServerFn({
    method: 'POST',
})
    .inputValidator(updateTeamLeadInputSchema)
    .handler(setTeamLeadFn_createServerFn_handler, async ({ data }) => {
        await requireHead();
        const row = await db.transaction(async (tx) => {
            const [updated] = await tx
                .update(team)
                .set({
                    leadId: data.leadId,
                })
                .where(eq(team.id, data.id))
                .returning({
                    id: team.id,
                    name: team.name,
                    leadId: team.leadId,
                });
            if (!updated) {
                throw new Error('Team not found');
            }
            if (data.leadId) {
                await tx
                    .update(user)
                    .set({
                        teamId: data.id,
                    })
                    .where(eq(user.id, data.leadId));
            }
            return updated;
        });
        return row;
    });
export {
    createTeamFn_createServerFn_handler,
    createUserFn_createServerFn_handler,
    deleteTeamFn_createServerFn_handler,
    deleteUserFn_createServerFn_handler,
    listTeamsFn_createServerFn_handler,
    listUsersFn_createServerFn_handler,
    resendInvitationFn_createServerFn_handler,
    setTeamLeadFn_createServerFn_handler,
    updateTeamFn_createServerFn_handler,
    updateUserFn_createServerFn_handler,
};
