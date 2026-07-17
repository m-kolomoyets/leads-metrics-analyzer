import { hash, verify } from '@node-rs/argon2';

// SERVER-ONLY. Passwords are stored exclusively as Argon2id hashes (spec story 5). Imported only
// inside `createServerFn` handlers, so it never reaches the client bundle. @node-rs/argon2 defaults
// to the Argon2id variant, so no algorithm option is passed.

export const hashPassword = (password: string) => {
    return hash(password);
};

export const verifyPassword = (passwordHash: string, password: string) => {
    return verify(passwordHash, password);
};
