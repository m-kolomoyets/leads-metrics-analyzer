import type { AdminUser } from '@/services/admin/types';
import type { UsersSectionProps } from './types';
import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
import { getTeamName } from '../../utils/teamOptions';
import { CreateUserForm } from '../CreateUserForm';
import { EditUserForm } from '../EditUserForm';
import { InvitePanel } from '../InvitePanel';

const STATUS_VARIANT = {
    active: 'default',
    invited: 'secondary',
    disabled: 'destructive',
} as const;

function UsersSection({ users, teams }: UsersSectionProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [invitingUser, setInvitingUser] = useState<AdminUser | null>(null);

    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Users</h2>
                <Button
                    size="sm"
                    onClick={() => {
                        setIsCreateOpen(true);
                    }}
                >
                    <PlusIcon className="size-4" />
                    New user
                </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                    <thead className="text-muted-foreground border-b">
                        <tr>
                            <th className="px-3 py-2 text-left font-medium">Email</th>
                            <th className="px-3 py-2 text-left font-medium">Role</th>
                            <th className="px-3 py-2 text-left font-medium">Team</th>
                            <th className="px-3 py-2 text-left font-medium">Status</th>
                            <th className="px-3 py-2" />
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            return (
                                <tr key={user.id} className="border-b last:border-b-0">
                                    <td className="px-3 py-2">{user.email}</td>
                                    <td className="px-3 py-2">
                                        <Badge variant="outline">{user.role}</Badge>
                                    </td>
                                    <td className="px-3 py-2">{getTeamName(user.teamId, teams)}</td>
                                    <td className="px-3 py-2">
                                        <Badge variant={STATUS_VARIANT[user.status]}>{user.status}</Badge>
                                    </td>
                                    <td className="px-3 py-2 text-right whitespace-nowrap">
                                        {user.status === 'invited' && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    setInvitingUser(user);
                                                }}
                                            >
                                                Invite link
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                setEditingUser(user);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <SheetContent className="gap-0">
                    <SheetHeader>
                        <SheetTitle>New user</SheetTitle>
                        <SheetDescription>Invite a user and assign their role, team, and status.</SheetDescription>
                    </SheetHeader>
                    <div className="p-4">
                        <CreateUserForm
                            teams={teams}
                            onSuccess={() => {
                                setIsCreateOpen(false);
                            }}
                        />
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet
                open={!!editingUser}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingUser(null);
                    }
                }}
            >
                <SheetContent className="gap-0">
                    <SheetHeader>
                        <SheetTitle>Edit user</SheetTitle>
                        <SheetDescription>Change this user&apos;s role, team, or status.</SheetDescription>
                    </SheetHeader>
                    <div className="p-4">
                        {!!editingUser && (
                            <EditUserForm
                                user={editingUser}
                                teams={teams}
                                onSuccess={() => {
                                    setEditingUser(null);
                                }}
                            />
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet
                open={!!invitingUser}
                onOpenChange={(open) => {
                    if (!open) {
                        setInvitingUser(null);
                    }
                }}
            >
                <SheetContent className="gap-0">
                    <SheetHeader>
                        <SheetTitle>Invite link</SheetTitle>
                        <SheetDescription>
                            {invitingUser ? `Generate a one-time activation link for ${invitingUser.email}.` : null}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="p-4">{!!invitingUser && <InvitePanel userId={invitingUser.id} />}</div>
                </SheetContent>
            </Sheet>
        </section>
    );
}

export { UsersSection };
