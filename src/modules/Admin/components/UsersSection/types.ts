import type { AdminTeam, AdminUserListItem } from '@/services/admin/types';

export type UsersSectionProps = {
    users: AdminUserListItem[];
    teams: AdminTeam[];
    currentUserId: string;
};
