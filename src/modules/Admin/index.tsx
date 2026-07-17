import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { teamsQueryOptions, usersQueryOptions } from '@/services/admin/queries';
import { MainLayoutHeader } from '@/components/layouts/MainLayoutHeader';
import { Separator } from '@/components/ui/Separator';
import { TeamsSection } from './components/TeamsSection';
import { UsersSection } from './components/UsersSection';

const routeApi = getRouteApi('/_authenticated');

function Admin() {
    const { data: users } = useSuspenseQuery(usersQueryOptions());
    const { data: teams } = useSuspenseQuery(teamsQueryOptions());
    const currentUserId = routeApi.useRouteContext({
        select(context) {
            return context.auth.me.id;
        },
    });

    return (
        <>
            <MainLayoutHeader>
                <h1 className="text-xl">Admin</h1>
            </MainLayoutHeader>
            <div className="flex flex-col gap-8">
                <UsersSection users={users} teams={teams} currentUserId={currentUserId} />
                <Separator />
                <TeamsSection users={users} teams={teams} />
            </div>
        </>
    );
}

export { Admin };
