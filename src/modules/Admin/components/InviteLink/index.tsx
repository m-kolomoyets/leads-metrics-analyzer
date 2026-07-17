import type { InviteLinkProps } from './types';
import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { buildActivationUrl } from '../../utils/buildActivationUrl';

// Shows the one-time activation link with a copy button. The Head hand-delivers it (no email infra).
function InviteLink({ token }: InviteLinkProps) {
    const url = buildActivationUrl(token);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            toast.success('Link copied');
        } catch {
            toast.error('Could not copy — select and copy manually');
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-sm">
                Share this one-time link so they can set a password. It expires and works once.
            </p>
            <div className="flex items-center gap-2">
                <Input className="min-w-0 flex-1" value={url} readOnly aria-label="Activation link" />
                <Button size="sm" variant="outline" className="shrink-0" onClick={handleCopy}>
                    <CopyIcon className="size-4" />
                    Copy
                </Button>
            </div>
        </div>
    );
}

export { InviteLink };
