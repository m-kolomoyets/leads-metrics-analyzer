import type { AdminTeam, AdminUser } from '@/services/admin/types';

export type UsersSectionProps = {
    users: AdminUser[];
    teams: AdminTeam[];
};
