import { createHash } from 'node:crypto';

// Pure, dependency-light token hashing (no db import — see ADR-0005 so it stays unit-testable).
// Hand-delivered tokens (invitation, reset) are high-entropy (256 bits), so a fast one-way hash
// suffices for at-rest storage and constant-work lookup — no slow password KDF needed. Only the hash
// is ever persisted.
const hashToken = (rawToken: string): string => {
    return createHash('sha256').update(rawToken).digest('hex');
};

export const hashInvitationToken = (rawToken: string): string => {
    return hashToken(rawToken);
};

// Password-reset tokens (#43) use the same hasher: minted by the Head, stored only as this hash.
export const hashResetToken = (rawToken: string): string => {
    return hashToken(rawToken);
};
