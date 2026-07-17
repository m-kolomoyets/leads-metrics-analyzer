import type { UserRole, UserStatus } from '@/lib/constants';

// Admin API row shapes — never carry the password hash.
export type AdminUser = {
    id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    teamId: string | null;
};

export type AdminTeam = {
    id: string;
    name: string;
    leadId: string | null;
};
