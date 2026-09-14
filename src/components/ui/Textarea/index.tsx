import type { TextareaProps } from './types';
import { cn } from '@/lib/utils/cn';

// The multi-line sibling of `Input`: same border, radius, invalid and disabled paint, so a comment
// box and a text field read as one family. Grows with `field-sizing-content` where supported.
function Textarea({ className, ...props }: TextareaProps) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                'border-input aria-invalid:border-destructive placeholder:text-faint field-sizing-content min-h-16 w-full min-w-0 rounded-md border bg-transparent px-2.5 py-1.5 text-base motion-safe:transition-colors motion-safe:duration-150 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                className
            )}
            {...props}
        />
    );
}

export { Textarea };
