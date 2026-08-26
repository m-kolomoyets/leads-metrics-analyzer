import type { SegmentedItemProps, SegmentedProps } from './types';
import { cn } from '@/lib/utils/cn';
import { useSafeContext } from '@/hooks/useSafeContext';
import { SegmentedContext } from './context/SegmentedContext';

// The one row-of-choices control in the app: geo tabs, buyer tabs, team tabs, chart mode. Flat text
// until chosen, and the chosen one wears `--hover-strong` — the same "where I am" wash the sidebar's
// selected row wears, one step up from the hover it shares with everything else.
//
// No tray, no borders, no accent. A resting item is a label; a bordered chip per option turned the
// picker into the loudest thing on a page whose figures are the point, and a filled accent chip made
// it louder still. The accent is the focus ring here and nothing else.
//
// A caller that also has something to SAY about an option — a Zone, a total — paints it in the item's
// own text (`className`), not in a fill: eight coloured fills is a row of eight alarms.

function Segmented({ label, mode = 'tabs', className, children }: SegmentedProps) {
    return (
        <SegmentedContext value={mode}>
            <div
                role={mode === 'tabs' ? 'tablist' : 'group'}
                aria-label={label}
                className={cn('flex flex-wrap items-center gap-1', className)}
            >
                {children}
            </div>
        </SegmentedContext>
    );
}

function SegmentedItem({ selected, onSelect, title, className, children }: SegmentedItemProps) {
    const mode = useSafeContext(SegmentedContext);

    return (
        <button
            type="button"
            role={mode === 'tabs' ? 'tab' : undefined}
            aria-selected={mode === 'tabs' ? selected : undefined}
            aria-pressed={mode === 'toggle' ? selected : undefined}
            title={title}
            className={cn(
                'text-muted-foreground hover:text-foreground hover:bg-hover flex cursor-pointer items-center gap-1.5 rounded-sm px-2.5 py-1 text-sm font-medium motion-safe:transition-colors motion-safe:duration-150',
                selected && 'bg-hover-strong text-foreground',
                className
            )}
            onClick={onSelect}
        >
            {children}
        </button>
    );
}

export { Segmented, SegmentedItem };
