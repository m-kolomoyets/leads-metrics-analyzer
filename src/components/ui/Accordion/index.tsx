import type {
    AccordionHeaderProps,
    AccordionItemProps,
    AccordionPanelProps,
    AccordionProps,
    AccordionTriggerProps,
} from './types';
import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// Styled Base UI Accordion (base-ui.com/react/components/accordion). Chrome-free on purpose — the
// primitive carries only the disclosure behaviour, so an item can sit inside whatever panel the page
// already uses. Panel height animates off `--accordion-panel-height`.

function Accordion({ className, ...props }: AccordionProps) {
    return <AccordionPrimitive.Root data-slot="accordion" className={cn('flex flex-col', className)} {...props} />;
}

function AccordionItem({ className, ...props }: AccordionItemProps) {
    return <AccordionPrimitive.Item data-slot="accordion-item" className={cn('flex flex-col', className)} {...props} />;
}

// Renders an `<h3>`; wrap only the clickable title in the Trigger so sibling controls (dropdowns,
// buttons) can share the header row without nesting inside a button.
function AccordionHeader({ className, ...props }: AccordionHeaderProps) {
    return <AccordionPrimitive.Header data-slot="accordion-header" className={cn(className)} {...props} />;
}

function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
    return (
        <AccordionPrimitive.Trigger
            data-slot="accordion-trigger"
            className={cn(
                'text-muted-foreground hover:text-foreground group flex cursor-pointer items-center gap-2 rounded-sm motion-safe:transition-colors motion-safe:duration-150',
                className
            )}
            {...props}
        >
            {/* `data-panel-open` sits on the trigger, so the icon reads it through the group. */}
            <ChevronDownIcon className="size-4 shrink-0 duration-150 ease-out group-data-[panel-open]:rotate-180 motion-safe:transition-transform" />
            {children}
        </AccordionPrimitive.Trigger>
    );
}

function AccordionPanel({ className, children, ...props }: AccordionPanelProps) {
    return (
        <AccordionPrimitive.Panel
            data-slot="accordion-panel"
            className={cn(
                'h-[var(--accordion-panel-height)] overflow-hidden motion-safe:transition-[height] data-[ending-style]:h-0 data-[starting-style]:h-0',
                className
            )}
            {...props}
        >
            {children}
        </AccordionPrimitive.Panel>
    );
}

export { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger };
