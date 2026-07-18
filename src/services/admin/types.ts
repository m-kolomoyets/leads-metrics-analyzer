import type { UserRole, UserStatus } from '@/lib/constants';

// Admin API row shapes — never carry the password hash.
export type AdminUser = {
    id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    teamId: string | null;
};

// A user row as listed in the admin panel. Carries `hasPendingReset` — true when the user has an
// unredeemed `password_reset` row (#42) — which drives the attention icon on their row.
export type AdminUserListItem = AdminUser & {
    hasPendingReset: boolean;
};

// Returned when the Head creates or re-invites an `invited` user. `activationToken` is the raw,
// shown-once token (null for a non-invited create) — the panel builds the activation link from it.
export type InvitedUser = AdminUser & {
    activationToken: string | null;
};

// Returned when the Head mints a reset link for an `active` user (#43). `resetToken` is the raw,
// shown-once token — the panel builds the `/reset-password?token=...` link from it.
export type ResetLinkUser = AdminUser & {
    resetToken: string;
};

export type AdminTeam = {
    id: string;
    name: string;
    leadId: string | null;
};
