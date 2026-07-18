import { a as activateInputSchema, l as loginInputSchema } from './schemas-ELPmZsuS.mjs';
import { c as and, e as eq } from '../_libs/drizzle-orm.mjs';
import { a as createServerFn, c as createServerRpc } from './index.mjs';
import {
    c as createSession,
    d as db,
    b as destroySession,
    g as getSessionUser,
    a as hashInvitationToken,
    h as hashPassword,
    i as invitation,
    u as user,
    v as verifyPassword,
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
import 'node:crypto';
import '../_libs/zod.mjs';
import 'path';
import 'fs';
import 'os';
import 'net';
import 'tls';
import 'perf_hooks';

const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';
const DUMMY_PASSWORD_HASH =
    '$argon2id$v=19$m=19456,t=2,p=1$aD/SRybOA88SOuzoKxdk5Q$TgmabwP9ljp3m87r2CH0zuUVs6ATUUS/TtFxHqHI5j8';
const loginFn_createServerFn_handler = createServerRpc(
    {
        id: 'ebfc11faca05eae0aa69ac0fed4d252bd151c9caf5e3b97f56c115ee04adcf98',
        name: 'loginFn',
        filename: 'src/services/auth/functions.ts',
    },
    (opts) => loginFn.__executeServer(opts)
);
const loginFn = createServerFn({
    method: 'POST',
})
    .inputValidator(loginInputSchema)
    .handler(loginFn_createServerFn_handler, async ({ data }) => {
        const [found] = await db
            .select({
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
                passwordHash: user.passwordHash,
            })
            .from(user)
            .where(eq(user.email, data.email))
            .limit(1);
        const isValid = await verifyPassword(found?.passwordHash ?? DUMMY_PASSWORD_HASH, data.password);
        if (!found || found.status !== 'active' || !isValid) {
            throw new Error(INVALID_CREDENTIALS_MESSAGE);
        }
        await createSession(found.id);
        return {
            id: found.id,
            email: found.email,
            role: found.role,
            status: found.status,
        };
    });
const INVALID_INVITATION_MESSAGE = 'This invitation link is invalid or has expired';
const activateFn_createServerFn_handler = createServerRpc(
    {
        id: 'de679316d5ed59ce667549d45bf242b425b91745d24de4534c58ef303c01d680',
        name: 'activateFn',
        filename: 'src/services/auth/functions.ts',
    },
    (opts) => activateFn.__executeServer(opts)
);
const activateFn = createServerFn({
    method: 'POST',
})
    .inputValidator(activateInputSchema)
    .handler(activateFn_createServerFn_handler, async ({ data }) => {
        const tokenHash = hashInvitationToken(data.token);
        const [invite] = await db
            .select({
                id: invitation.id,
                userId: invitation.userId,
                expiresAt: invitation.expiresAt,
                usedAt: invitation.usedAt,
            })
            .from(invitation)
            .where(eq(invitation.tokenHash, tokenHash))
            .limit(1);
        if (!invite || invite.usedAt || invite.expiresAt <= /* @__PURE__ */ new Date()) {
            throw new Error(INVALID_INVITATION_MESSAGE);
        }
        const passwordHash = await hashPassword(data.password);
        const activated = await db.transaction(async (tx) => {
            const [row] = await tx
                .update(user)
                .set({
                    passwordHash,
                    status: 'active',
                })
                .where(and(eq(user.id, invite.userId), eq(user.status, 'invited')))
                .returning({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                });
            if (!row) {
                throw new Error(INVALID_INVITATION_MESSAGE);
            }
            await tx
                .update(invitation)
                .set({
                    usedAt: /* @__PURE__ */ new Date(),
                })
                .where(eq(invitation.id, invite.id));
            return row;
        });
        await createSession(activated.id);
        return activated;
    });
const logoutFn_createServerFn_handler = createServerRpc(
    {
        id: '541821caf8acb648a6880b1dd1a4064ae0cde067de0c012d4e72e79439c9d1a3',
        name: 'logoutFn',
        filename: 'src/services/auth/functions.ts',
    },
    (opts) => logoutFn.__executeServer(opts)
);
const logoutFn = createServerFn({
    method: 'POST',
}).handler(logoutFn_createServerFn_handler, async () => {
    await destroySession();
    return {
        success: true,
    };
});
const meFn_createServerFn_handler = createServerRpc(
    {
        id: '61e62bee5fe070e3d3451243793279e26aa2ea6e59850d90ff70cb33d287d148',
        name: 'meFn',
        filename: 'src/services/auth/functions.ts',
    },
    (opts) => meFn.__executeServer(opts)
);
const meFn = createServerFn({
    method: 'GET',
}).handler(meFn_createServerFn_handler, () => {
    return getSessionUser();
});
export {
    activateFn_createServerFn_handler,
    loginFn_createServerFn_handler,
    logoutFn_createServerFn_handler,
    meFn_createServerFn_handler,
};
