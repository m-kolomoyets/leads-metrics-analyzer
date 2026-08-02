import type { RollupDimension } from '@/lib/auth/dimensionRollup';
import type { RollupRow } from '../../utils/rollupRows';
import { cn } from '@/lib/utils/cn';
import { int, ratioPct } from '@/modules/Analyze/utils/format';
import { DIMENSION_LABEL, RATE_COLUMNS, STAGE_COLUMNS } from '../../constants';

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
            <td className="p-2 font-mono">{int(row.linkClicks)}</td>
            <td className="p-2 font-mono">{int(row.installs)}</td>
            <td className="p-2 font-mono">{int(row.regs)}</td>
            <td className="p-2 font-mono">{int(row.sales)}</td>
            <td className={cn('text-muted-foreground p-2 font-mono', BLOCK_START)}>{ratioPct(row.click2inst)}</td>
            <td className="text-muted-foreground p-2 font-mono">{ratioPct(row.inst2reg)}</td>
            <td className="text-muted-foreground p-2 font-mono">{ratioPct(row.reg2dep)}</td>
            <td className="text-muted-foreground p-2 font-mono">{ratioPct(row.inst2sale)}</td>
        </>
    );
}

// The one table of the dollar-free branch: every saved Snapshot's facts summed by the viewer's single
// dimension (Creative for a Designer, Offer for a BDM). Rows are ordered by Sales, so the creatives /
// offers that earn lead. The footer restates the company-wide funnel, hidden for a single row where it
// would just repeat it.
function RollupTable({ dimension, rows, totals }: RollupTableProps) {
    const showFooter = rows.length > 1;

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-right text-xs">
                <thead>
                    <tr className="text-muted-foreground border-b">
                        <th className="p-2 text-left font-normal whitespace-nowrap">{DIMENSION_LABEL[dimension]}</th>
                        {STAGE_COLUMNS.map((label) => {
                            return (
                                <th key={label} className="p-2 font-normal">
                                    {label}
                                </th>
                            );
                        })}
                        {RATE_COLUMNS.map((label, index) => {
                            return (
                                <th key={label} className={cn('p-2 font-normal', index === 0 && BLOCK_START)}>
                                    {label}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => {
                        return (
                            <tr key={row.key} className="border-b">
                                <td className="max-w-80 truncate p-2 text-left" title={row.key}>
                                    <span className="text-primary font-mono font-bold">{row.key}</span>
                                </td>
                                <RowCells row={row} />
                            </tr>
                        );
                    })}
                </tbody>
                {showFooter && (
                    <tfoot>
                        <tr className="border-t-2 font-semibold">
                            <td className="text-muted-foreground p-2 text-left whitespace-nowrap">Total</td>
                            <RowCells row={totals} />
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
}

export { RollupTable };
