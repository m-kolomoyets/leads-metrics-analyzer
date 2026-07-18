import { createHash } from 'node:crypto';
import { hash, verify } from '@node-rs/argon2';
import { m as mainExports } from '../_libs/dotenv.mjs';
import {
    d as drizzle,
    e as eq,
    b as pgEnum,
    p as pgTable,
    a as text,
    t as timestamp,
    u as uuid,
} from '../_libs/drizzle-orm.mjs';
import { P as Postgres } from '../_libs/postgres.mjs';
import { d as deleteCookie, g as getCookie, s as setCookie } from './index.mjs';

mainExports.config({ path: '.env.local' });
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not set — the server requires a Postgres connection.');
}
const client = Postgres(connectionString);
const db = drizzle({ client });
const userRole = pgEnum('user_role', ['head', 'team_lead', 'buyer', 'designer', 'bdm']);
const userStatus = pgEnum('user_status', ['active', 'invited', 'disabled']);
const user = pgTable('user', {
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
        () => {
            return team.id;
        },
        { onDelete: 'set null' }
    ),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
const team = pgTable('team', {
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
const session = pgTable('session', {
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
const invitation = pgTable('invitation', {
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
const SESSION_COOKIE_NAME = 'lead_metrics_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1e3;
const SESSION_TTL_SECONDS = SESSION_TTL_MS / 1e3;
const isInvalidUuidError = (error) => {
    return error?.code === '22P02';
};
const writeSessionCookie = (sessionId) => {
    setCookie(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        path: '/',
        maxAge: SESSION_TTL_SECONDS,
    });
};
const createSession = async (userId) => {
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    const [row] = await db.insert(session).values({ userId, expiresAt }).returning({ id: session.id });
    writeSessionCookie(row.id);
};
const getSessionUser = async () => {
    const sessionId = getCookie(SESSION_COOKIE_NAME);
    if (!sessionId) {
        return null;
    }
    let rows;
    try {
        rows = await db
            .select({
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
                expiresAt: session.expiresAt,
            })
            .from(session)
            .innerJoin(user, eq(session.userId, user.id))
            .where(eq(session.id, sessionId))
            .limit(1);
    } catch (error) {
        if (isInvalidUuidError(error)) {
            deleteCookie(SESSION_COOKIE_NAME, { path: '/' });
        }
        return null;
    }
    const found = rows[0];
    if (!found || found.expiresAt.getTime() <= Date.now() || found.status !== 'active') {
        if (found) {
            await db.delete(session).where(eq(session.id, sessionId));
        }
        deleteCookie(SESSION_COOKIE_NAME, { path: '/' });
        return null;
    }
    return { id: found.id, email: found.email, role: found.role, status: found.status };
};
const destroySession = async () => {
    const sessionId = getCookie(SESSION_COOKIE_NAME);
    if (sessionId) {
        try {
            await db.delete(session).where(eq(session.id, sessionId));
        } catch {}
    }
    deleteCookie(SESSION_COOKIE_NAME, { path: '/' });
};
const hashInvitationToken = (rawToken) => {
    return createHash('sha256').update(rawToken).digest('hex');
};
const hashPassword = (password) => {
    return hash(password);
};
const verifyPassword = (passwordHash, password) => {
    return verify(passwordHash, password);
};
export {
    hashInvitationToken as a,
    destroySession as b,
    createSession as c,
    db as d,
    getSessionUser as g,
    hashPassword as h,
    invitation as i,
    team as t,
    user as u,
    verifyPassword as v,
};
