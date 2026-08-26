import type { RollupDimension } from '@/lib/auth/dimensionRollup';
import type { RollupRow } from './utils/rows';
import { cn } from '@/lib/utils/cn';
import { int, ratioPct } from '@/components/report/utils/format';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { DIMENSION_LABEL, RATE_COLUMNS, STAGE_COLUMNS } from './constants';

type RollupTableProps = {
    dimension: RollupDimension;
    rows: RollupRow[];
    totals: RollupRow;
};

// Funnel counts | conversion rates. The `border-l` on the first rate column draws the divider across
// head, body and foot — the analyzer's column-block convention, minus every money block.
const BLOCK_START = 'border-l';

// The cells of one row, shared by the data rows and the totals footer. Counts only — this component
// takes a `RollupRow`, which has no dollar field to render even if one were asked for.
function RowCells({ row }: { row: RollupRow }) {
    return (
        <>
            <TableCell isNumeric>{int(row.linkClicks)}</TableCell>
            <TableCell isNumeric>{int(row.installs)}</TableCell>
            <TableCell isNumeric>{int(row.regs)}</TableCell>
            <TableCell isNumeric>{int(row.sales)}</TableCell>
            <TableCell isNumeric className={cn('text-muted-foreground', BLOCK_START)}>
                {ratioPct(row.click2inst)}
            </TableCell>
            <TableCell isNumeric className="text-muted-foreground">
                {ratioPct(row.inst2reg)}
            </TableCell>
            <TableCell isNumeric className="text-muted-foreground">
                {ratioPct(row.reg2dep)}
            </TableCell>
            <TableCell isNumeric className="text-muted-foreground">
                {ratioPct(row.inst2sale)}
            </TableCell>
        </>
    );
}

// The one table of every dollar-free surface: facts summed by the viewer's single dimension (Creative
// for a Designer, Offer for a BDM). It is fed by two reads — the company-wide roll-up on `/analyze`
// and one buyer's day on Dynamics (#10) — and knows about neither. Rows are ordered by Sales, so the
// creatives / offers that earn lead. The footer restates the funnel, hidden for a single row where it
// would just repeat it.
function RollupTable({ dimension, rows, totals }: RollupTableProps) {
    const showFooter = rows.length > 1;

    return (
        <Table density="compact" className="text-xs">
            <TableHeader>
                <TableRow>
                    <TableHead>{DIMENSION_LABEL[dimension]}</TableHead>
                    {STAGE_COLUMNS.map((label) => {
                        return (
                            <TableHead key={label} isNumeric>
                                {label}
                            </TableHead>
                        );
                    })}
                    {RATE_COLUMNS.map((label, index) => {
                        return (
                            <TableHead key={label} isNumeric className={cn(index === 0 && BLOCK_START)}>
                                {label}
                            </TableHead>
                        );
                    })}
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row) => {
                    return (
                        <TableRow key={row.key}>
                            <TableCell className="max-w-80 truncate" title={row.key}>
                                <span className="text-accent font-medium">{row.key}</span>
                            </TableCell>
                            <RowCells row={row} />
                        </TableRow>
                    );
                })}
            </TableBody>
            {showFooter && (
                <TableFooter>
                    <TableRow>
                        <TableCell className="text-muted-foreground">Total</TableCell>
                        <RowCells row={totals} />
                    </TableRow>
                </TableFooter>
            )}
        </Table>
    );
}

export { RollupTable };
