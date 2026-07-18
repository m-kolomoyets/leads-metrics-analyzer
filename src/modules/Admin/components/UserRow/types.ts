import type { AdminTeam, AdminUser, AdminUserListItem } from '@/services/admin/types';

export type UserRowProps = {
    user: AdminUserListItem;
    teams: AdminTeam[];
    // The signed-in Head — the delete control is hidden on their own row (server also blocks self-delete).
    currentUserId: string;
    onEdit: (user: AdminUser) => void;
    onInvite: (user: AdminUser) => void;
};
