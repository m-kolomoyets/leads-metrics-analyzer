import { z } from 'zod';
import { USER_ROLES, USER_STATUSES } from '@/lib/constants';

// Zod input schemas for the Head-only admin API. Validated at the server-function boundary
// (`inputValidator`) so handlers can trust the shape. `:id` path params are carried in the payload.

const emailSchema = z
    .string()
    .trim()
    .min(1, { error: 'This field is required' })
    .pipe(z.email({ error: 'Invalid email' }));

// The human handle every user carries (#52). Required on create; blank is not a handle. Unique
// (case-insensitive, trimmed) — enforced server-side, see `findNicknameOwner`.
const nicknameSchema = z.string().trim().min(1, { error: 'This field is required' });

// Server-function rejection messages the admin forms route to the offending field. Shared here (not
// in `functions.ts`) because the client never imports the server module.
export const EMAIL_TAKEN_MESSAGE = 'A user with this email already exists';
export const NICKNAME_TAKEN_MESSAGE = 'This nickname is already taken';

const roleSchema = z.enum(USER_ROLES);
const statusSchema = z.enum(USER_STATUSES);

export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export const createUserInputSchema = z.object({
    email: emailSchema,
    nickname: nicknameSchema,
    role: roleSchema,
    // Nullable/optional: teamless roles (head/designer/bdm) and buyers created before placement.
    teamId: z.uuid().nullish(),
    status: statusSchema.default('invited'),
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
export const updateUserInputSchema = z
    .object({
        id: z.uuid(),
        nickname: nicknameSchema.optional(),
        role: roleSchema.optional(),
        // null unassigns the user from any team; undefined leaves the current team untouched.
        teamId: z.uuid().nullish(),
        status: statusSchema.optional(),
    })
    // Reject a no-op PATCH: at least one mutable field must be present (a null teamId still counts).
    .refine(
        (value) => {
            return (
                value.nickname !== undefined ||
                value.role !== undefined ||
                value.teamId !== undefined ||
                value.status !== undefined
            );
        },
        { error: 'No fields to update' }
    );

export type DeleteUserInput = z.infer<typeof deleteUserInputSchema>;
export const deleteUserInputSchema = z.object({
    id: z.uuid(),
});

export type ResendInvitationInput = z.infer<typeof resendInvitationInputSchema>;
export const resendInvitationInputSchema = z.object({
    id: z.uuid(),
});

export type GenerateResetLinkInput = z.infer<typeof generateResetLinkInputSchema>;
export const generateResetLinkInputSchema = z.object({
    id: z.uuid(),
});

export type CreateTeamInput = z.infer<typeof createTeamInputSchema>;
export const createTeamInputSchema = z.object({
    name: z.string().trim().min(1, { error: 'This field is required' }),
});

export type UpdateTeamInput = z.infer<typeof updateTeamInputSchema>;
export const updateTeamInputSchema = z.object({
    id: z.uuid(),
    name: z.string().trim().min(1, { error: 'This field is required' }),
});

export type DeleteTeamInput = z.infer<typeof deleteTeamInputSchema>;
export const deleteTeamInputSchema = z.object({
    id: z.uuid(),
});

export type UpdateTeamLeadInput = z.infer<typeof updateTeamLeadInputSchema>;
export const updateTeamLeadInputSchema = z.object({
    id: z.uuid(),
    // null clears the lead; a uuid designates one (spec story 23).
    leadId: z.uuid().nullable(),
});
