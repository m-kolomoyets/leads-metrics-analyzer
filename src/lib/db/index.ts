import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// SERVER-ONLY. This module opens a Postgres connection using DATABASE_URL and must never be
// imported from client (SPA) code — doing so would leak the database credential into the browser
// bundle. It lives in the Node TypeScript project (see tsconfig.node.json), which keeps it out of
// the client build. See docs/adr/0006-authenticated-api-backend.md.
//
// The relational `schema` argument is wired in T2 once src/lib/db/schema.ts declares tables.

config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not set — the API server requires a Postgres connection.');
}

const client = postgres(connectionString);

export const db = drizzle({ client });
