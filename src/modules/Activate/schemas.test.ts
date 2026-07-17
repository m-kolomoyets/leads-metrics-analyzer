import { activateFormSchema } from './schemas';

// Client activation form invariants (ADR-0005): password floor + confirmation match.
describe('activateFormSchema', () => {
    it('accepts a strong, matching password', () => {
        expect(activateFormSchema.safeParse({ password: 'longenough', confirmPassword: 'longenough' }).success).toBe(
            true
        );
    });

    it('rejects a password shorter than 8 characters', () => {
        expect(activateFormSchema.safeParse({ password: 'short', confirmPassword: 'short' }).success).toBe(false);
    });

    it('rejects a mismatched confirmation on the confirmPassword path', () => {
        const result = activateFormSchema.safeParse({ password: 'longenough', confirmPassword: 'different1' });
        expect(result.success).toBe(false);

        if (!result.success) {
            expect(
                result.error.issues.some((issue) => {
                    return issue.path[0] === 'confirmPassword';
                })
            ).toBe(true);
        }
    });
});
