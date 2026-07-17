import type { AdminTeam, AdminUser } from '@/services/admin/types';

export type EditUserFormProps = {
    user: AdminUser;
    teams: AdminTeam[];
    onSuccess: () => void;
};
