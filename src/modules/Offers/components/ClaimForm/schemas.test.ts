import { claimFormSchema } from './schemas';

describe('claimFormSchema', () => {
    it('turns empty boxes into null and digits into counts', () => {
        expect(claimFormSchema.parse({ installs: ' 100 ', regs: '', sales: '6' })).toEqual({
            installs: 100,
            regs: null,
            sales: 6,
        });
    });

    it('refuses a count beyond the column range', () => {
        expect(claimFormSchema.safeParse({ installs: '99999999999', regs: '', sales: '' }).success).toBe(false);
    });

    it('refuses anything but digits', () => {
        const result = claimFormSchema.safeParse({ installs: '1.5', regs: '-3', sales: 'six' });

        expect(result.success).toBe(false);
        expect(
            result.success
                ? []
                : result.error.issues.map((issue) => {
                      return issue.path[0];
                  })
        ).toEqual(['installs', 'regs', 'sales']);
    });
});
