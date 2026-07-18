import { _ as _enum, e as email, o as object, s as string, u as uuid } from '../_libs/zod.mjs';

const LS_THEME_KEY = '<appName>_ADMIN_Theme';
const COMMON_ERROR_MESSAGE = 'Uh-oh, something went wrong.';
const FALLBACK_REDIRECT = '/dashboard';
const USER_ROLES = ['head', 'team_lead', 'buyer', 'designer', 'bdm'];
const USER_STATUSES = ['active', 'invited', 'disabled'];
const ROLES_IDS = {
    head: 'head',
    teamLead: 'team_lead',
    buyer: 'buyer',
    designer: 'designer',
    bdm: 'bdm',
};
const emailSchema = string()
    .trim()
    .min(1, { error: 'This field is required' })
    .pipe(email({ error: 'Invalid email' }));
const roleSchema = _enum(USER_ROLES);
const statusSchema = _enum(USER_STATUSES);
const createUserInputSchema = object({
    email: emailSchema,
    role: roleSchema,
    // Nullable/optional: teamless roles (head/designer/bdm) and buyers created before placement.
    teamId: uuid().nullish(),
    status: statusSchema.default('invited'),
});
const updateUserInputSchema = object({
    id: uuid(),
    role: roleSchema.optional(),
    // null unassigns the user from any team; undefined leaves the current team untouched.
    teamId: uuid().nullish(),
    status: statusSchema.optional(),
}).refine(
    (value) => {
        return value.role !== void 0 || value.teamId !== void 0 || value.status !== void 0;
    },
    { error: 'No fields to update' }
);
const deleteUserInputSchema = object({
    id: uuid(),
});
const resendInvitationInputSchema = object({
    id: uuid(),
});
const createTeamInputSchema = object({
    name: string().trim().min(1, { error: 'This field is required' }),
});
const updateTeamInputSchema = object({
    id: uuid(),
    name: string().trim().min(1, { error: 'This field is required' }),
});
const deleteTeamInputSchema = object({
    id: uuid(),
});
const updateTeamLeadInputSchema = object({
    id: uuid(),
    // null clears the lead; a uuid designates one (spec story 23).
    leadId: uuid().nullable(),
});
export {
    COMMON_ERROR_MESSAGE as C,
    FALLBACK_REDIRECT as F,
    LS_THEME_KEY as L,
    ROLES_IDS as R,
    USER_ROLES as U,
    createUserInputSchema as a,
    deleteUserInputSchema as b,
    createTeamInputSchema as c,
    deleteTeamInputSchema as d,
    updateTeamInputSchema as e,
    updateUserInputSchema as f,
    USER_STATUSES as g,
    resendInvitationInputSchema as r,
    updateTeamLeadInputSchema as u,
};
