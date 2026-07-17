import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// SERVER-ONLY. This module opens a Postgres connection using DATABASE_URL and must never be
// imported from client (SPA) code — doing so would leak the database credential into the browser
// bundle. With TanStack Start (ADR-0008) the client/server split is enforced by the bundler: this
// module is only ever imported inside `createServerFn` handlers, so it is stripped from the client
// bundle. See docs/adr/0006-authenticated-api-backend.md.

config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not set — the server requires a Postgres connection.');
}

const client = postgres(connectionString);

// Tables are imported directly by server functions (db.insert/select/delete). The drizzle v1
// relational query API (db.query.*) is not used yet, so no relations/schema arg is wired here.
export const db = drizzle({ client });
