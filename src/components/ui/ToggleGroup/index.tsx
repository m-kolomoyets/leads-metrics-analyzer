import type { ToggleGroupProps, ToggleProps } from './types';
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import { cn } from '@/lib/utils/cn';

// Styled Base UI ToggleGroup (base-ui.com/react/components/toggle-group): one bordered tray holding
// several toggles, single- or multi-select through the primitive's `multiple` prop. The tray is the
// point — a row of loose chips reads as four unrelated controls, while one tray reads as one setting
// with several positions, and the primitive gives it the arrow-key roving focus that implies.

function ToggleGroup({ className, ...props }: ToggleGroupProps) {
    return (
        <ToggleGroupPrimitive
            data-slot="toggle-group"
            className={cn('border-border flex w-fit items-center gap-0.5 rounded-lg border p-0.5', className)}
            {...props}
        />
    );
}

// Pressed state rides `data-pressed`, so a toggle can be styled without the caller tracking it.
function Toggle({ className, ...props }: ToggleProps) {
    return (
        <TogglePrimitive
            data-slot="toggle"
            className={cn(
                'text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 data-[pressed]:surface-accent flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1 text-xs font-medium outline-none transition-colors focus-visible:ring-3 data-[pressed]:text-white',
                className
            )}
            {...props}
        />
    );
}

export { Toggle, ToggleGroup };
