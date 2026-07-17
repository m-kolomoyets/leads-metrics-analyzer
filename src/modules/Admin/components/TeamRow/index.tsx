import type { TeamRowProps } from './types';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    deleteTeamMutationOptions,
    setTeamLeadMutationOptions,
    updateTeamMutationOptions,
} from '@/services/admin/queries';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { NO_TEAM_VALUE } from '../../constants';
import { LeadCombobox } from '../LeadCombobox';

// A single team row: rename inline, set/clear lead, or delete (two-step confirm — the repo bans
// window.confirm, so the destructive action reveals an explicit confirm/cancel pair).
function TeamRow({ team, leadOptions }: TeamRowProps) {
    const { mutate: setTeamLead } = useMutation(setTeamLeadMutationOptions());
    const { mutateAsync: updateTeam, isPending: isRenaming } = useMutation(updateTeamMutationOptions());
    const { mutate: deleteTeam, isPending: isDeleting } = useMutation(deleteTeamMutationOptions());

    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [name, setName] = useState(team.name);

    const handleRename = async () => {
        const trimmed = name.trim();

        if (!trimmed || trimmed === team.name) {
            setIsEditing(false);
            setName(team.name);

            return;
        }

        await updateTeam(
            { id: team.id, name: trimmed },
            {
                onSuccess() {
                    toast.success('Team renamed');
                    setIsEditing(false);
                },
                onError(error) {
                    toast.error(error instanceof Error ? error.message : 'Failed to rename team');
                },
            }
        );
    };

    return (
        <tr className="border-b last:border-b-0">
            <td className="px-3 py-2">
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <Input
                            className="min-w-0 flex-1"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                            aria-label="Team name"
                        />
                        <Button size="sm" className="shrink-0" onClick={handleRename} isLoading={isRenaming}>
                            Save
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="shrink-0"
                            onClick={() => {
                                setIsEditing(false);
                                setName(team.name);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <span className="block truncate">{team.name}</span>
                )}
            </td>
            <td className="px-3 py-2">
                <LeadCombobox
                    options={leadOptions}
                    value={team.leadId ?? NO_TEAM_VALUE}
                    onChange={(value) => {
                        setTeamLead({
                            id: team.id,
                            leadId: value === NO_TEAM_VALUE ? null : value,
                        });
                    }}
                />
            </td>
            <td className="px-3 py-2 text-right">
                {isConfirmingDelete ? (
                    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                        <span className="text-muted-foreground text-xs">Delete team?</span>
                        <Button
                            size="sm"
                            variant="destructive"
                            isLoading={isDeleting}
                            onClick={() => {
                                deleteTeam(
                                    { id: team.id },
                                    {
                                        onSuccess() {
                                            toast.success('Team deleted');
                                        },
                                        onError(error) {
                                            toast.error(
                                                error instanceof Error ? error.message : 'Failed to delete team'
                                            );
                                        },
                                    }
                                );
                            }}
                        >
                            Confirm
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                setIsConfirmingDelete(false);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-end gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            disabled={isEditing}
                            onClick={() => {
                                setIsEditing(true);
                            }}
                        >
                            Rename
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                setIsConfirmingDelete(true);
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </td>
        </tr>
    );
}

export { TeamRow };
