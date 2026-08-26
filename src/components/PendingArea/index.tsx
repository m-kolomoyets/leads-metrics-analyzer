import type { PendingAreaProps } from './types';
import { cn } from '@/lib/utils/cn';
import { Loader } from '@/components/ui/Loader';

// The one shape every "still working" moment on Dynamics and Analyze takes: a spinner plus the
// sentence that says what is missing. A bare line of text (what the Suspense fallbacks used to be)
// reads as the answer rather than as the wait, which is exactly the confusion this removes.
//
// `role="status"` + `aria-live="polite"` so a screen reader is told the page is still working out a
// figure instead of silently landing on a half-empty frame; `aria-busy` marks the region itself.
function PendingArea({ label, variant = 'block', className }: PendingAreaProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className={cn(
                'text-muted-foreground flex items-center gap-2 text-sm',
                variant === 'block' && 'justify-center py-12',
                className
            )}
        >
            <Loader className={variant === 'block' ? 'size-5' : 'size-3.5'} />
            <span>{label}</span>
        </div>
    );
}

export { PendingArea };
