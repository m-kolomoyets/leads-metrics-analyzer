import { Button } from '@/components/ui/Button';

type DraftBannerProps = {
    savedAt: number;
    onClear: () => void;
};

// Shown only when the upload on screen came off disk. A silent restore is the failure mode worth
// avoiding: yesterday's export looks exactly like today's until someone reads the totals, so the
// draft says when it was taken and offers the one-click way out.
function DraftBanner({ savedAt, onClear }: DraftBannerProps) {
    return (
        <div
            role="status"
            className="border-border/60 bg-muted/40 flex flex-wrap items-center gap-3 rounded-md border px-3 py-2 text-sm"
        >
            <span className="text-muted-foreground">
                Restored your last upload from {new Date(savedAt).toLocaleString()}. Numbers are recomputed from those
                files — check the date before acting on them.
            </span>
            <span className="flex-1" />
            <Button type="button" size="xs" variant="outline" onClick={onClear}>
                Clear draft
            </Button>
        </div>
    );
}

export { DraftBanner };
