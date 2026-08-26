import type { ReactNode } from 'react';
import type { Zone } from '@/lib/domain/types';
import { cn } from '@/lib/utils/cn';
import { ZONE_CHIP_CLASS } from '@/components/report/constants';

type StatusChipProps = {
    // Which judgement the chip reports. `neutral` is for the counts that are not a judgement at all —
    // the sales tally — and reads achromatic rather than picking a colour it has no right to.
    zone: Zone;
    glyph: ReactNode;
    label: ReactNode;
    count?: number;
    className?: string;
};

// A status count: a small square-cornered chip on the chrome surface, hairline-bordered, with the
// glyph and the count in the Zone colour and the label in the foreground. It replaces the glowing
// gradient capsule — the count is the signal, the chip only bounds it.
function StatusChip({ zone, glyph, label, count, className }: StatusChipProps) {
    return (
        <span
            className={cn(
                'inline-flex w-fit items-center gap-2 rounded-sm border px-2 py-1',
                ZONE_CHIP_CLASS[zone],
                className
            )}
        >
            <span aria-hidden="true" className="text-xs">
                {glyph}
            </span>
            <span className="text-foreground text-sm font-medium">{label}</span>
            {count !== undefined && <span className="text-xs tabular-nums">{count}</span>}
        </span>
    );
}

export { StatusChip };
