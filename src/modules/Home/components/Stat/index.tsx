import type { StatProps } from './types';
import { cn } from '@/lib/utils/cn';

// One labelled figure in a `<dl>` of totals — the country panel's and "my stats"' shared cell.
function Stat({ label, value, className, hint }: StatProps) {
    return (
        <div className="flex flex-col gap-0.5">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className={cn('text-sm font-semibold tabular-nums', className)}>
                {value}
                {hint && <span className="text-muted-foreground ml-1 text-xs font-normal">({hint})</span>}
            </dd>
        </div>
    );
}

export { Stat };
