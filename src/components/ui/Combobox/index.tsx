import type {
    ComboboxContentProps,
    ComboboxEmptyProps,
    ComboboxInputGroupProps,
    ComboboxInputProps,
    ComboboxItemProps,
    ComboboxListProps,
    ComboboxTriggerProps,
} from './types';
import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// Styled Base UI Combobox (base-ui.com/react/components/combobox): a single-select dropdown with a
// built-in search input that filters `items` by substring. Mirrors the Select wrapper convention —
// pre-styled compound parts over the primitive. Root filters automatically against the typed input.

const Combobox = ComboboxPrimitive.Root;

function ComboboxInputGroup({ className, ...props }: ComboboxInputGroupProps) {
    return (
        <ComboboxPrimitive.InputGroup
            data-slot="combobox-input-group"
            className={cn(
                'border-input focus-ring-within flex h-8 w-full min-w-0 items-center gap-2 rounded-md border bg-transparent px-2.5 py-1 motion-safe:transition-colors motion-safe:duration-150',
                className
            )}
            {...props}
        />
    );
}

function ComboboxInput({ className, ...props }: ComboboxInputProps) {
    return (
        <ComboboxPrimitive.Input
            data-slot="combobox-input"
            className={cn('placeholder:text-faint flex-1 bg-transparent text-base outline-none md:text-sm', className)}
            {...props}
        />
    );
}

function ComboboxTrigger({ className, ...props }: ComboboxTriggerProps) {
    return (
        <ComboboxPrimitive.Trigger
            data-slot="combobox-trigger"
            className={cn('text-muted-foreground shrink-0 outline-none', className)}
            {...props}
        >
            <ChevronsUpDownIcon className="size-3.5" />
        </ComboboxPrimitive.Trigger>
    );
}

function ComboboxContent({ className, children, positionerProps, ...props }: ComboboxContentProps) {
    return (
        <ComboboxPrimitive.Portal>
            <ComboboxPrimitive.Positioner sideOffset={4} className="z-50 outline-none" {...positionerProps}>
                <ComboboxPrimitive.Popup
                    data-slot="combobox-content"
                    className={cn(
                        'bg-popover text-popover-foreground border-border shadow-overlay max-h-[min(24rem,var(--available-height))] min-w-[var(--anchor-width)] overflow-y-auto rounded-lg border p-1 outline-none',
                        className
                    )}
                    {...props}
                >
                    {children}
                </ComboboxPrimitive.Popup>
            </ComboboxPrimitive.Positioner>
        </ComboboxPrimitive.Portal>
    );
}

function ComboboxList({ className, ...props }: ComboboxListProps) {
    return <ComboboxPrimitive.List data-slot="combobox-list" className={cn('flex flex-col', className)} {...props} />;
}

function ComboboxItem({ className, children, ...props }: ComboboxItemProps) {
    return (
        <ComboboxPrimitive.Item
            data-slot="combobox-item"
            className={cn(
                'data-[highlighted]:bg-hover data-[selected]:bg-hover-strong relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                className
            )}
            {...props}
        >
            {children}
            <ComboboxPrimitive.ItemIndicator className="absolute right-2 flex items-center">
                <CheckIcon className="size-4" />
            </ComboboxPrimitive.ItemIndicator>
        </ComboboxPrimitive.Item>
    );
}

function ComboboxEmpty({ className, ...props }: ComboboxEmptyProps) {
    return (
        <ComboboxPrimitive.Empty
            data-slot="combobox-empty"
            className={cn('text-muted-foreground px-2 py-1.5 text-sm', className)}
            {...props}
        />
    );
}

export {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxInputGroup,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
};
