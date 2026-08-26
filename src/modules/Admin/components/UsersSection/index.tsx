import type { AdminUser } from '@/services/admin/types';
import type { UsersSectionProps } from './types';
import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { CreateUserForm } from '../CreateUserForm';
import { EditUserForm } from '../EditUserForm';
import { InvitePanel } from '../InvitePanel';
import { ResetPanel } from '../ResetPanel';
import { UserRow } from '../UserRow';

function UsersSection({ users, teams, currentUserId }: UsersSectionProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [invitingUser, setInvitingUser] = useState<AdminUser | null>(null);
    const [resettingUser, setResettingUser] = useState<AdminUser | null>(null);

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

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nickname</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => {
                            return (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    teams={teams}
                                    currentUserId={currentUserId}
                                    onEdit={setEditingUser}
                                    onInvite={setInvitingUser}
                                    onReset={setResettingUser}
                                />
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>

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

            <Sheet
                open={!!resettingUser}
                onOpenChange={(open) => {
                    if (!open) {
                        setResettingUser(null);
                    }
                }}
            >
                <SheetContent className="gap-0">
                    <SheetHeader>
                        <SheetTitle>Reset link</SheetTitle>
                        <SheetDescription>
                            {resettingUser
                                ? `Generate a one-time password reset link for ${resettingUser.email}.`
                                : null}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="p-4">{!!resettingUser && <ResetPanel userId={resettingUser.id} />}</div>
                </SheetContent>
            </Sheet>
        </section>
    );
}

export { UsersSection };
