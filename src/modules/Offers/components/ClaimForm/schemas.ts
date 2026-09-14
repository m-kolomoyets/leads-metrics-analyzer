import { z } from 'zod';
import { CLAIM_FIGURE_MAX } from '@/services/offers/schemas';

// The claim form's fields are text (an empty box means "not declared"); this schema turns each into
// the whole count the server wants, or null. Anything but digits is refused with a message the field
// shows inline.
const claimFigureFieldSchema = z
    .string()
    .trim()
    .regex(/^\d*$/, { error: 'Whole number only' })
    .transform((value) => {
        return value === '' ? null : Number(value);
    })
    .refine(
        (value) => {
            return value === null || value <= CLAIM_FIGURE_MAX;
        },
        { error: 'Too large' }
    );

export type ClaimFormValues = z.input<typeof claimFormSchema>;
export const claimFormSchema = z.object({
    installs: claimFigureFieldSchema,
    regs: claimFigureFieldSchema,
    sales: claimFigureFieldSchema,
});
