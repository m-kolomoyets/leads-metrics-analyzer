import type { BinaryLike, ScryptOptions } from 'node:crypto';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

// SERVER-ONLY. Passwords are stored exclusively as scrypt hashes (spec story 5). Imported only inside
// `createServerFn` handlers, so it never reaches the client bundle. scrypt is memory-hard and ships in
// Node's `crypto` core, so there is no native addon to trace/copy into the deployed server functions.

// promisify collapses scrypt to its no-options overload; restore the options-aware signature.
const scryptAsync = promisify(scrypt) as (
    password: BinaryLike,
    salt: BinaryLike,
    keylen: number,
    options: ScryptOptions
) => Promise<Buffer>;

// OWASP-acceptable scrypt parameters. N (CPU/memory cost) = 2^16, r = 8, p = 1 → ~64 MiB per hash.
// maxmem must exceed 128 * N * r or Node throws, so give it 2x headroom.
const N = 2 ** 16;
const R = 8;
const P = 1;
const KEYLEN = 32;
const MAXMEM = 128 * N * R * 2;
const OPTIONS = { N, r: R, p: P, maxmem: MAXMEM };

// Encoded as `scrypt$N$r$p$saltHex$hashHex` so the cost parameters travel with each hash and can be
// tuned later without invalidating existing rows (verify reads them back per-hash).
export const hashPassword = async (password: string) => {
    const salt = randomBytes(16);
    const derived = (await scryptAsync(password, salt, KEYLEN, OPTIONS)) as Buffer;

    return `scrypt$${N}$${R}$${P}$${salt.toString('hex')}$${derived.toString('hex')}`;
};

export const verifyPassword = async (stored: string, password: string) => {
    const [scheme, n, r, p, saltHex, hashHex] = stored.split('$');
    if (scheme !== 'scrypt' || !n || !r || !p || !saltHex || !hashHex) {
        return false;
    }

    const expected = Buffer.from(hashHex, 'hex');
    const derived = (await scryptAsync(password, Buffer.from(saltHex, 'hex'), expected.length, {
        N: Number(n),
        r: Number(r),
        p: Number(p),
        maxmem: MAXMEM,
    })) as Buffer;

    return timingSafeEqual(derived, expected);
};
