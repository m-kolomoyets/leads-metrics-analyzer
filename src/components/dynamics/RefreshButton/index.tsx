import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { RefreshCwIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { dynamicsKeys } from '@/services/dynamics/queryKeys';
import { Button } from '@/components/ui/Button';

// The header's manual refresh (SPEC §6.4). Nothing on this page polls — the data age label just
// mutes itself and asks for a refresh — so this is the one way a newer push reaches the screen.
//
// It invalidates the whole `dynamics` key rather than the day in view: the roster decides which
// tabs exist and how stale each one is, and refetching a day without it would leave the tabs
// describing a picture that is no longer on screen.

function RefreshButton() {
    const queryClient = useQueryClient();
    const fetching = useIsFetching({ queryKey: dynamicsKeys.all }) > 0;

    function refresh() {
        void queryClient.invalidateQueries({ queryKey: dynamicsKeys.all });
    }

    return (
        <Button
            variant="outline"
            size="default"
            title="Pull the latest pushes for this day"
            disabled={fetching}
            onClick={refresh}
        >
            <RefreshCwIcon data-icon="inline-start" className={cn(fetching && 'motion-safe:animate-spin')} />
            {fetching ? 'Refreshing…' : 'Refresh'}
        </Button>
    );
}

export { RefreshButton };
