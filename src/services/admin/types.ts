import type { UserRole, UserStatus } from '@/lib/constants';

// Admin API row shapes — never carry the password hash.
export type AdminUser = {
    id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    teamId: string | null;
};

// Returned when the Head creates or re-invites an `invited` user. `activationToken` is the raw,
// shown-once token (null for a non-invited create) — the panel builds the activation link from it.
export type InvitedUser = AdminUser & {
    activationToken: string | null;
};

export type AdminTeam = {
    id: string;
    name: string;
    leadId: string | null;
};
