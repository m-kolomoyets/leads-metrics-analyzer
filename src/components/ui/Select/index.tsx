import type { SelectContentProps, SelectItemProps, SelectTriggerProps, SelectValueProps } from './types';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// Styled Base UI Select (base-ui.com/react/components/select). Mirrors the Input/Button wrapper
// convention: pre-styled compound parts over the primitive. Used by the admin panel's role/team/
// status pickers via the Form `SelectField`.

const Select = SelectPrimitive.Root;

function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
    return (
        <SelectPrimitive.Trigger
            data-slot="select-trigger"
            className={cn(
                'border-input aria-invalid:border-destructive flex h-8 w-full min-w-0 items-center justify-between gap-2 rounded-md border bg-transparent px-2.5 py-1 text-base motion-safe:transition-colors motion-safe:duration-150 md:text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate',
                className
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon className="text-muted-foreground shrink-0">
                <ChevronsUpDownIcon className="size-3.5" />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    );
}

function SelectValue({ className, ...props }: SelectValueProps) {
    return (
        <SelectPrimitive.Value
            data-slot="select-value"
            className={cn('data-[empty]:text-muted-foreground', className)}
            {...props}
        />
    );
}

function SelectContent({ className, children, positionerProps, ...props }: SelectContentProps) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Positioner sideOffset={4} className="z-50 outline-none" {...positionerProps}>
                <SelectPrimitive.Popup
                    data-slot="select-content"
                    className={cn(
                        'bg-popover text-popover-foreground border-border shadow-overlay max-h-[min(24rem,var(--available-height))] min-w-[var(--anchor-width)] overflow-y-auto rounded-lg border p-1 outline-none',
                        className
                    )}
                    {...props}
                >
                    {children}
                </SelectPrimitive.Popup>
            </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
    );
}

function SelectItem({ className, children, ...props }: SelectItemProps) {
    return (
        <SelectPrimitive.Item
            data-slot="select-item"
            className={cn(
                'data-[highlighted]:bg-hover data-[selected]:bg-hover-strong relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                className
            )}
            {...props}
        >
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator className="absolute right-2 flex items-center">
                <CheckIcon className="size-4" />
            </SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
    );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
