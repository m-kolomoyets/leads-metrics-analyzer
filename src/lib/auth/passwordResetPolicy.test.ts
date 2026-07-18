import type { UserStatus } from '@/lib/constants';
import type { ResetTokenState } from './passwordResetPolicy';
import { canRequestPasswordReset, isResetTokenUsable } from './passwordResetPolicy';

// External-behavior tests (ADR-0005). Table-driven over every status and every token state, incl. the
// expiry boundary. Prior art: scope.test.ts, tokenHash.test.ts.

describe('canRequestPasswordReset', () => {
    const cases: Array<{ status: UserStatus; expected: boolean }> = [
        { status: 'active', expected: true },
        { status: 'invited', expected: false },
        { status: 'disabled', expected: false },
    ];

    it.each(cases)('$status → $expected', ({ status, expected }) => {
        expect(canRequestPasswordReset(status)).toBe(expected);
    });
});

describe('isResetTokenUsable', () => {
    const now = new Date('2026-07-18T12:00:00.000Z');
    const hash = 'a'.repeat(64);
    const future = new Date('2026-07-18T13:00:00.000Z');
    const past = new Date('2026-07-18T11:00:00.000Z');

    const cases: Array<{ name: string; token: ResetTokenState; expected: boolean }> = [
        { name: 'valid unexpired token', token: { tokenHash: hash, expiresAt: future, usedAt: null }, expected: true },
        {
            name: 'missing token hash (no link minted)',
            token: { tokenHash: null, expiresAt: future, usedAt: null },
            expected: false,
        },
        { name: 'missing expiry', token: { tokenHash: hash, expiresAt: null, usedAt: null }, expected: false },
        { name: 'already used', token: { tokenHash: hash, expiresAt: future, usedAt: past }, expected: false },
        { name: 'expired', token: { tokenHash: hash, expiresAt: past, usedAt: null }, expected: false },
    ];

    it.each(cases)('$name → $expected', ({ token, expected }) => {
        expect(isResetTokenUsable(token, now)).toBe(expected);
    });

    it('is dead exactly at the expiry instant (strict boundary)', () => {
        expect(isResetTokenUsable({ tokenHash: hash, expiresAt: now, usedAt: null }, now)).toBe(false);
    });

    it('is alive one millisecond before expiry', () => {
        const expiresAt = new Date(now.getTime() + 1);
        expect(isResetTokenUsable({ tokenHash: hash, expiresAt, usedAt: null }, now)).toBe(true);
    });
});
