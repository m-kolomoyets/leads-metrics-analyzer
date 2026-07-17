import type { SelectFieldItem } from '@/components/Form/components/SelectField/types';
import type { AdminTeam } from '@/services/admin/types';

export type TeamRowProps = {
    team: AdminTeam;
    leadOptions: SelectFieldItem[];
};
