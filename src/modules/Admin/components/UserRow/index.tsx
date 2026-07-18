import type { UserRowProps } from './types';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { TriangleAlertIcon } from 'lucide-react';
import { toast } from 'sonner';
import { deleteUserMutationOptions } from '@/services/admin/queries';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import { getTeamName } from '../../utils/teamOptions';

const STATUS_VARIANT = {
    active: 'default',
    invited: 'secondary',
    disabled: 'destructive',
} as const;

// A single user row. Delete uses a two-step inline confirm (the repo bans window.confirm); deleting a
// user who leads a team leaves that team leaderless server-side.
function UserRow({ user, teams, currentUserId, onEdit, onInvite }: UserRowProps) {
    const { mutate: deleteUser, isPending: isDeleting } = useMutation(deleteUserMutationOptions());
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const isSelf = user.id === currentUserId;

    return (
        <tr className="border-b last:border-b-0">
            <td className="px-3 py-2">
                <span className="flex items-center gap-2">
                    {user.email}
                    {user.hasPendingReset && (
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <span className="text-destructive" aria-label="Password reset requested">
                                        <TriangleAlertIcon className="size-4" />
                                    </span>
                                }
                            />
                            <TooltipContent>Password reset requested</TooltipContent>
                        </Tooltip>
                    )}
                </span>
            </td>
            <td className="px-3 py-2">
                <Badge variant="outline">{user.role}</Badge>
            </td>
            <td className="px-3 py-2">{getTeamName(user.teamId, teams)}</td>
            <td className="px-3 py-2">
                <Badge variant={STATUS_VARIANT[user.status]}>{user.status}</Badge>
            </td>
            <td className="px-3 py-2 text-right whitespace-nowrap">
                {isConfirmingDelete ? (
                    <div className="flex items-center justify-end gap-2">
                        <span className="text-muted-foreground text-xs">Delete user?</span>
                        <Button
                            size="sm"
                            variant="destructive"
                            isLoading={isDeleting}
                            onClick={() => {
                                deleteUser(
                                    { id: user.id },
                                    {
                                        onSuccess() {
                                            toast.success('User deleted');
                                        },
                                        onError(error) {
                                            toast.error(
                                                error instanceof Error ? error.message : 'Failed to delete user'
                                            );
                                            setIsConfirmingDelete(false);
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
                    <>
                        {user.status === 'invited' && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    onInvite(user);
                                }}
                            >
                                Invite link
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                onEdit(user);
                            }}
                        >
                            Edit
                        </Button>
                        {!isSelf && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    setIsConfirmingDelete(true);
                                }}
                            >
                                Delete
                            </Button>
                        )}
                    </>
                )}
            </td>
        </tr>
    );
}

export { UserRow };
