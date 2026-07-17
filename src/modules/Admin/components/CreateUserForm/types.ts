import type { AdminTeam } from '@/services/admin/types';

export type CreateUserFormProps = {
    teams: AdminTeam[];
    onSuccess: () => void;
};
