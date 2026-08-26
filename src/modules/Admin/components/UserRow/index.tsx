import type { UserRowProps } from './types';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { TriangleAlertIcon } from 'lucide-react';
import { toast } from 'sonner';
import { deleteUserMutationOptions } from '@/services/admin/queries';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TableCell, TableRow } from '@/components/ui/Table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import { getTeamName } from '../../utils/teamOptions';

const STATUS_VARIANT = {
    active: 'default',
    invited: 'secondary',
    disabled: 'destructive',
} as const;

// A single user row. Delete uses a two-step inline confirm (the repo bans window.confirm); deleting a
// user who leads a team leaves that team leaderless server-side.
function UserRow({ user, teams, currentUserId, onEdit, onInvite, onReset }: UserRowProps) {
    const { mutate: deleteUser, isPending: isDeleting } = useMutation(deleteUserMutationOptions());
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const isSelf = user.id === currentUserId;

    return (
        <TableRow>
            <TableCell className="font-medium">{user.nickname}</TableCell>
            <TableCell>
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
            </TableCell>
            <TableCell>
                <Badge variant="outline">{user.role}</Badge>
            </TableCell>
            <TableCell>{getTeamName(user.teamId, teams)}</TableCell>
            <TableCell>
                <Badge variant={STATUS_VARIANT[user.status]}>{user.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
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
                        {user.hasPendingReset && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    onReset(user);
                                }}
                            >
                                Reset link
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
            </TableCell>
        </TableRow>
    );
}

export { UserRow };
