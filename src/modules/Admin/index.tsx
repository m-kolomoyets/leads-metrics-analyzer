import { useSuspenseQuery } from '@tanstack/react-query';
import { teamsQueryOptions, usersQueryOptions } from '@/services/admin/queries';
import { MainLayoutHeader } from '@/components/layouts/MainLayoutHeader';
import { Separator } from '@/components/ui/Separator';
import { TeamsSection } from './components/TeamsSection';
import { UsersSection } from './components/UsersSection';

function Admin() {
    const { data: users } = useSuspenseQuery(usersQueryOptions());
    const { data: teams } = useSuspenseQuery(teamsQueryOptions());

    return (
        <>
            <MainLayoutHeader>
                <h1 className="text-xl">Admin</h1>
            </MainLayoutHeader>
            <div className="flex flex-col gap-8">
                <UsersSection users={users} teams={teams} />
                <Separator />
                <TeamsSection users={users} teams={teams} />
            </div>
        </>
    );
}

export { Admin };
