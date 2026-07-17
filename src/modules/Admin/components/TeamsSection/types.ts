import type { AdminTeam, AdminUser } from '@/services/admin/types';

export type TeamsSectionProps = {
    users: AdminUser[];
    teams: AdminTeam[];
};
