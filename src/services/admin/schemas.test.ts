import {
    createTeamInputSchema,
    createUserInputSchema,
    updateTeamLeadInputSchema,
    updateUserInputSchema,
} from './schemas';

// Pure Zod-boundary tests (ADR-0005). The admin API is Head-only and DB-bound, so the unit-testable
// seam is input validation: the invariants the server functions trust (valid email, known role,
// uuid ids, "at least one field to update"). No DB, no session.

const UUID_A = '11111111-1111-4111-8111-111111111111';
const UUID_B = '22222222-2222-4222-8222-222222222222';

describe('createUserInputSchema', () => {
    it('accepts a valid user and trims the email', () => {
        const parsed = createUserInputSchema.parse({
            email: '  buyer@example.com  ',
            nickname: 'buyer',
            role: 'buyer',
            teamId: UUID_A,
        });
        expect(parsed).toEqual({
            email: 'buyer@example.com',
            nickname: 'buyer',
            role: 'buyer',
            status: 'invited',
            teamId: UUID_A,
        });
    });

    it('defaults status to invited when omitted', () => {
        expect(createUserInputSchema.parse({ email: 'a@b.co', nickname: 'a', role: 'bdm' }).status).toBe('invited');
    });

    it('allows a null teamId (teamless user)', () => {
        expect(
            createUserInputSchema.parse({ email: 'a@b.co', nickname: 'a', role: 'head', teamId: null }).teamId
        ).toBeNull();
    });

    it('rejects an unknown role', () => {
        expect(createUserInputSchema.safeParse({ email: 'a@b.co', nickname: 'a', role: 'admin' }).success).toBe(false);
    });

    it('rejects a malformed email', () => {
        expect(createUserInputSchema.safeParse({ email: 'nope', nickname: 'a', role: 'buyer' }).success).toBe(false);
    });

    it('rejects a non-uuid teamId', () => {
        expect(
            createUserInputSchema.safeParse({ email: 'a@b.co', nickname: 'a', role: 'buyer', teamId: 'x' }).success
        ).toBe(false);
    });

    it('trims the nickname', () => {
        expect(createUserInputSchema.parse({ email: 'a@b.co', nickname: '  Nick  ', role: 'buyer' }).nickname).toBe(
            'Nick'
        );
    });

    it('rejects a missing nickname', () => {
        expect(createUserInputSchema.safeParse({ email: 'a@b.co', role: 'buyer' }).success).toBe(false);
    });

    it('rejects a blank nickname', () => {
        expect(createUserInputSchema.safeParse({ email: 'a@b.co', nickname: '   ', role: 'buyer' }).success).toBe(
            false
        );
    });
});

describe('updateUserInputSchema', () => {
    it('accepts a partial update of a single field', () => {
        expect(updateUserInputSchema.parse({ id: UUID_A, role: 'team_lead' })).toEqual({
            id: UUID_A,
            role: 'team_lead',
        });
    });

    it('allows a null teamId to unassign a user from any team', () => {
        expect(updateUserInputSchema.parse({ id: UUID_A, teamId: null }).teamId).toBeNull();
    });

    it('rejects an update carrying no changed field', () => {
        expect(updateUserInputSchema.safeParse({ id: UUID_A }).success).toBe(false);
    });

    it('accepts a nickname-only update and trims it', () => {
        expect(updateUserInputSchema.parse({ id: UUID_A, nickname: '  Nick  ' })).toEqual({
            id: UUID_A,
            nickname: 'Nick',
        });
    });

    it('rejects a blank nickname', () => {
        expect(updateUserInputSchema.safeParse({ id: UUID_A, nickname: '  ' }).success).toBe(false);
    });

    it('rejects a non-uuid id', () => {
        expect(updateUserInputSchema.safeParse({ id: 'x', role: 'buyer' }).success).toBe(false);
    });
});

describe('createTeamInputSchema', () => {
    it('accepts a named team and trims the name', () => {
        expect(createTeamInputSchema.parse({ name: '  Olympus  ' })).toEqual({ name: 'Olympus' });
    });

    it('rejects an empty name', () => {
        expect(createTeamInputSchema.safeParse({ name: '   ' }).success).toBe(false);
    });
});

describe('updateTeamLeadInputSchema', () => {
    it('accepts a team id and a lead id', () => {
        expect(updateTeamLeadInputSchema.parse({ id: UUID_A, leadId: UUID_B })).toEqual({ id: UUID_A, leadId: UUID_B });
    });

    it('allows a null leadId to clear the lead', () => {
        expect(updateTeamLeadInputSchema.parse({ id: UUID_A, leadId: null }).leadId).toBeNull();
    });

    it('rejects a non-uuid team id', () => {
        expect(updateTeamLeadInputSchema.safeParse({ id: 'x', leadId: UUID_B }).success).toBe(false);
    });
});
