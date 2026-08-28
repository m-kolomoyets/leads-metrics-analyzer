import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { logoutMutationOptions } from '@/services/auth/queries';
import { DropdownMenuItem } from '@/components/ui/DropdownMenu';

function LogoutItem() {
    const navigate = useNavigate();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutate: logout, isPending: isLogOutPending } = useMutation(logoutMutationOptions());

    return (
        <DropdownMenuItem
            onClick={() => {
                logout(undefined, {
                    async onSuccess() {
                        queryClient.clear();
                        await router.invalidate();
                        navigate({
                            to: '/login',
                            ignoreBlocker: true,
                        });
                    },
                });
            }}
            disabled={isLogOutPending}
        >
            <LogOut />
            Log out
        </DropdownMenuItem>
    );
}

export { LogoutItem };
