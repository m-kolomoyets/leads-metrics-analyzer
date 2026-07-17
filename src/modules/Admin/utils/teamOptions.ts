import type { SelectFieldItem } from '@/components/Form/components/SelectField/types';
import type { AdminTeam, AdminUser } from '@/services/admin/types';
import { NO_TEAM_VALUE } from '../constants';

// Team Select items with a leading "No team" sentinel option (for teamless users / unassigning).
export const buildTeamOptions = (teams: AdminTeam[]): SelectFieldItem[] => {
    return [
        { value: NO_TEAM_VALUE, label: 'No team' },
        ...teams.map((team) => {
            return { value: team.id, label: team.name };
        }),
    ];
};

// Human label for a user's team column. Falls back to a dash for teamless users or a dangling id.
export const getTeamName = (teamId: string | null, teams: AdminTeam[]): string => {
    if (!teamId) {
        return '—';
    }

    return (
        teams.find((team) => {
            return team.id === teamId;
        })?.name ?? '—'
    );
};

// Members eligible to lead a team — a team's own members (and any as-yet-unplaced user). Kept simple:
// designating any user as lead also places them on the team server-side, so we offer all users.
export const buildLeadOptions = (users: AdminUser[]): SelectFieldItem[] => {
    return [
        { value: NO_TEAM_VALUE, label: 'No lead' },
        ...users.map((user) => {
            return { value: user.id, label: user.email };
        }),
    ];
};
