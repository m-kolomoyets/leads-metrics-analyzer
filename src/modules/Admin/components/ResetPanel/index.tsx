import type { ResetPanelProps } from './types';
import { useMutation } from '@tanstack/react-query';
import { generateResetLinkMutationOptions } from '@/services/admin/queries';
import { Button } from '@/components/ui/Button';
import { ResetLink } from '../ResetLink';

// Mints a hand-delivered reset link for a user who requested one and shows the fresh link. Re-minting
// invalidates the previous token (server upsert), so an old, mislaid link stops working.
function ResetPanel({ userId }: ResetPanelProps) {
    const { mutate, data, isPending, isError } = useMutation(generateResetLinkMutationOptions());

    const handleGenerate = () => {
        mutate({ id: userId });
    };

    return (
        <div className="flex flex-col gap-4">
            {!!data?.resetToken && <ResetLink token={data.resetToken} />}

            {isError && <p className="text-destructive text-sm">Could not generate a link. Try again.</p>}

            <Button variant="outline" onClick={handleGenerate} isLoading={isPending}>
                {data ? 'Generate new link' : 'Generate reset link'}
            </Button>
        </div>
    );
}

export { ResetPanel };
