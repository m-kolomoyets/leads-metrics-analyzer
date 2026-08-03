import { Loader } from '@/components/ui/Loader';

// The pending state for a range change on the feed and the archive. It sits INSIDE the page, under
// the range picker, because the picker is the thing that caused it: replacing the whole page — header,
// controls and all — with a spinner would take away the control the reader just used.
function ListLoader() {
    return (
        <div className="text-muted-foreground flex justify-center py-16" role="status" aria-live="polite">
            <Loader className="size-6" />
        </div>
    );
}

export { ListLoader };
