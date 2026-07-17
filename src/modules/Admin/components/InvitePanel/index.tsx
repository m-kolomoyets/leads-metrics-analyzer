import type { InvitePanelProps } from './types';
import { useMutation } from '@tanstack/react-query';
import { resendInvitationMutationOptions } from '@/services/admin/queries';
import { Button } from '@/components/ui/Button';
import { InviteLink } from '../InviteLink';

// Re-issues an invitation for an already-invited user and shows the fresh link. Reissuing invalidates
// the previous token (server upsert), so an old, mislaid link stops working.
function InvitePanel({ userId }: InvitePanelProps) {
    const { mutate, data, isPending, isError } = useMutation(resendInvitationMutationOptions());

    const handleGenerate = () => {
        mutate({ id: userId });
    };

    return (
        <div className="flex flex-col gap-4">
            {!!data?.activationToken && <InviteLink token={data.activationToken} />}

            {isError && <p className="text-destructive text-sm">Could not generate a link. Try again.</p>}

            <Button variant="outline" onClick={handleGenerate} isLoading={isPending}>
                {data ? 'Generate new link' : 'Generate invite link'}
            </Button>
        </div>
    );
}

export { InvitePanel };
