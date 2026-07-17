import { hashPassword } from '../src/lib/auth/password';
import { db } from '../src/lib/db';
import { user } from '../src/lib/db/schema';

// Seeds (or resets) a single Head user so auth can be exercised locally before the admin panel
// (T4b) exists. Credentials come from SEED_EMAIL / SEED_PASSWORD, with dev defaults.
// Run: pnpm db:seed

const email = process.env.SEED_EMAIL ?? 'head@example.com';
const password = process.env.SEED_PASSWORD ?? 'password123';

const passwordHash = await hashPassword(password);

await db
    .insert(user)
    .values({ email, passwordHash, role: 'head', status: 'active' })
    .onConflictDoUpdate({
        target: user.email,
        set: { passwordHash, role: 'head', status: 'active' },
    });

// eslint-disable-next-line no-console
console.log(`Seeded head user: ${email} / ${password}`);

process.exit(0);
