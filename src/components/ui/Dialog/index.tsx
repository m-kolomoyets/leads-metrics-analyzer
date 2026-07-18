import type {
    DialogCloseProps,
    DialogContentProps,
    DialogDescriptionProps,
    DialogFooterProps,
    DialogHeaderProps,
    DialogOverlayProps,
    DialogPortalProps,
    DialogProps,
    DialogTitleProps,
    DialogTriggerProps,
} from './types';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

function Dialog({ ...props }: DialogProps) {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogTriggerProps) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogClose({ ...props }: DialogCloseProps) {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogPortal({ ...props }: DialogPortalProps) {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogOverlay({ className, ...props }: DialogOverlayProps) {
    return (
        <DialogPrimitive.Backdrop
            data-slot="dialog-overlay"
            className={cn(
                'bg-black/10 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 motion-safe:transition-opacity motion-safe:duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0',
                className
            )}
            {...props}
        />
    );
}

function DialogContent({ className, children, showCloseButton = true, ...props }: DialogContentProps) {
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Popup
                data-slot="dialog-content"
                className={cn(
                    'bg-background fixed left-1/2 top-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border p-6 shadow-lg sm:max-w-md motion-safe:transition motion-safe:duration-200 data-ending-style:opacity-0 data-ending-style:scale-95 data-starting-style:opacity-0 data-starting-style:scale-95',
                    className
                )}
                {...props}
            >
                {children}
                {showCloseButton && (
                    <DialogPrimitive.Close
                        data-slot="dialog-close"
                        render={
                            <Button variant="ghost" className="absolute top-3 right-3" size="icon-sm">
                                <XIcon />
                                <span className="sr-only">Close</span>
                            </Button>
                        }
                    />
                )}
            </DialogPrimitive.Popup>
        </DialogPortal>
    );
}

function DialogHeader({ className, ...props }: DialogHeaderProps) {
    return <div data-slot="dialog-header" className={cn('gap-1 flex flex-col', className)} {...props} />;
}

function DialogFooter({ className, ...props }: DialogFooterProps) {
    return (
        <div
            data-slot="dialog-footer"
            className={cn('gap-2 flex flex-col-reverse sm:flex-row sm:justify-end', className)}
            {...props}
        />
    );
}

function DialogTitle({ className, ...props }: DialogTitleProps) {
    return (
        <DialogPrimitive.Title
            data-slot="dialog-title"
            className={cn('text-foreground text-base font-medium', className)}
            {...props}
        />
    );
}

function DialogDescription({ className, ...props }: DialogDescriptionProps) {
    return (
        <DialogPrimitive.Description
            data-slot="dialog-description"
            className={cn('text-muted-foreground text-sm', className)}
            {...props}
        />
    );
}

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
