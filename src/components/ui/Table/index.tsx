import type {
    TableBodyProps,
    TableCaptionProps,
    TableCellProps,
    TableFooterProps,
    TableHeaderProps,
    TableHeadProps,
    TableProps,
    TableRowProps,
} from './types';
import { cn } from '@/lib/utils/cn';

// shadcn's `table` (ui.shadcn.com/docs/components/base/table) with the system's table rules folded
// in, so a report table cannot re-derive them: hairline row rules and no zebra, figures right and
// tabular, column heads small and grey, an optional sticky header and one heavier total rule.
//
// Zebra striping is deliberately absent. It is a workaround for rows that are too tall to track
// across, and at this density a 1px rule does the same job without painting half the table.

function Table({ className, containerClassName, density = 'default', ...props }: TableProps) {
    return (
        // The scroll lives HERE, and only here: `min-w-0` so the container may be narrower than the
        // table inside it, `overflow-x-auto` so the table scrolls under its own header rather than
        // widening the page. A table is the one thing on these pages allowed to be wider than the
        // viewport — a report has as many columns as the buyer uploaded.
        <div
            data-slot="table-container"
            className={cn('relative w-full min-w-0 max-w-full overflow-x-auto overflow-y-visible', containerClassName)}
        >
            <table
                data-slot="table"
                data-density={density}
                className={cn('w-full caption-bottom border-collapse text-sm', className)}
                {...props}
            />
        </div>
    );
}

function TableHeader({ className, isSticky = false, ...props }: TableHeaderProps) {
    return (
        <thead
            data-slot="table-header"
            className={cn(
                'border-border-strong border-b',
                // The header needs its own opaque surface or the rows scroll through it.
                isSticky && 'bg-surface sticky top-0 z-10',
                className
            )}
            {...props}
        />
    );
}

function TableBody({ className, ...props }: TableBodyProps) {
    return <tbody data-slot="table-body" className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

function TableFooter({ className, ...props }: TableFooterProps) {
    return (
        <tfoot
            data-slot="table-footer"
            className={cn('border-border-strong border-t font-medium [&>tr]:border-0', className)}
            {...props}
        />
    );
}

function TableRow({ className, ...props }: TableRowProps) {
    return (
        <tr
            data-slot="table-row"
            className={cn(
                'border-border hover:bg-muted data-[state=selected]:bg-muted border-b motion-safe:transition-colors motion-safe:duration-150',
                className
            )}
            {...props}
        />
    );
}

// Small, grey and normal-weight-ish: a column head labels the column, it does not compete with the
// figures under it.
function TableHead({ className, isNumeric = false, ...props }: TableHeadProps) {
    return (
        <th
            data-slot="table-head"
            data-numeric={isNumeric || undefined}
            className={cn(
                'text-muted-foreground h-8 px-2 text-left align-middle text-xs font-medium whitespace-nowrap in-data-[density=compact]:h-7',
                isNumeric && 'text-right',
                className
            )}
            {...props}
        />
    );
}

function TableCell({ className, isNumeric = false, ...props }: TableCellProps) {
    return (
        <td
            data-slot="table-cell"
            data-numeric={isNumeric || undefined}
            className={cn(
                'px-2 py-1.5 align-middle whitespace-nowrap in-data-[density=compact]:py-1',
                isNumeric && 'text-right tabular-nums',
                className
            )}
            {...props}
        />
    );
}

function TableCaption({ className, ...props }: TableCaptionProps) {
    return (
        <caption data-slot="table-caption" className={cn('text-muted-foreground mt-3 text-xs', className)} {...props} />
    );
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
