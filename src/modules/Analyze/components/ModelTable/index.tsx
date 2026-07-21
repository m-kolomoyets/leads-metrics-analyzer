import type { ModelRow } from '@/lib/domain/allocate';
import type { GeoThresholds, ThresholdPair } from '@/lib/domain/types';
import type { Locale } from '../../utils/i18n';
import { zoneFor } from '@/lib/domain/verdict';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { ZONE_TEXT_CLASS } from '../../constants';
import { cost, pct, ratioPct, usd } from '../../utils/format';
import { ui } from '../../utils/i18n';

type ModelTableProps = {
    title: string;
    firstCol: string;
    rows: ModelRow[];
    thresholds: GeoThresholds;
    locale: Locale;
    // OS rows carry clicks (CPC shown); offers do not.
    showCpc?: boolean;
    // Copy-to-clipboard of the rows' identities (offer IDs), reusing the shared hook. Omit the trio
    // to render the table without a copy button (the OS table has nothing worth copying).
    copiedKey?: string;
    onCopy?: (text: string, key: string) => void;
    copyKey?: string;
};

// A zone-graded cost cell (CPI/CPR/CPS/CPC): em dash when the denominator was zero, else the cost
// tinted by its band. Cost is on ALLOCATED (estimated) Spend⁺ — the caption says so.
function CostCell({ value, pair }: { value: number | null; pair: ThresholdPair }) {
    if (value === null) {
        return <td className="p-2 font-mono">—</td>;
    }
    return <td className={cn('p-2 font-mono', ZONE_TEXT_CLASS[zoneFor(value, pair)])}>{cost(value)}</td>;
}

// A ModelTable (doc 06): allocated Offer or OS rows, the standard metric family on estimated Spend⁺.
// Offers hide CPC (no clicks source); OS shows it. The identical shape for both — only the first
// column label and the CPC column differ.
function ModelTable({
    title,
    firstCol,
    rows,
    thresholds,
    locale,
    showCpc = false,
    copiedKey,
    onCopy,
    copyKey,
}: ModelTableProps) {
    const idLine = rows
        .map((row) => {
            return row.key;
        })
        .join(', ');

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <h3 className="text-muted-foreground text-[13px] font-normal tracking-widest uppercase">{title}</h3>
                {onCopy && copyKey && (
                    <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        disabled={rows.length === 0}
                        onClick={() => {
                            onCopy(idLine, copyKey);
                        }}
                    >
                        {copiedKey === copyKey ? ui('copied', locale) : ui('copyIds', locale)}
                    </Button>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-right text-xs">
                    <thead>
                        <tr className="text-muted-foreground border-b">
                            <th className="p-2 text-left font-normal whitespace-nowrap">{firstCol}</th>
                            {[
                                'Inst',
                                'Reg',
                                'Sale',
                                'Rev',
                                'EPC',
                                'ROI',
                                ...(showCpc ? ['CPC'] : []),
                                'CPI',
                                'CPR',
                                'CPS',
                                'I2R',
                                'R2S',
                            ].map((col) => {
                                return (
                                    <th key={col} className="p-2 font-normal">
                                        {col}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => {
                            const { metrics } = row;
                            return (
                                <tr key={row.key} className="border-b">
                                    <td
                                        className="max-w-80 truncate p-2 text-left font-mono"
                                        title={row.label || row.key}
                                    >
                                        {row.label || row.key}
                                    </td>
                                    <td className="p-2 font-mono">{metrics.installs}</td>
                                    <td className="p-2 font-mono">{metrics.regs}</td>
                                    <td className="p-2 font-mono">{metrics.sales}</td>
                                    <td className={cn('p-2 font-mono', metrics.revenue > 0 && 'text-success')}>
                                        {usd(metrics.revenue)}
                                    </td>
                                    <td className="text-muted-foreground p-2 font-mono">{cost(metrics.epc)}</td>
                                    <td
                                        className={cn(
                                            'p-2 font-mono font-bold',
                                            metrics.roi !== null && (metrics.roi >= 0 ? 'text-success' : 'text-danger')
                                        )}
                                    >
                                        {pct(metrics.roi)}
                                    </td>
                                    {showCpc && <CostCell value={metrics.cpc} pair={thresholds.clicks} />}
                                    <CostCell value={metrics.cpi} pair={thresholds.installs} />
                                    <CostCell value={metrics.cpr} pair={thresholds.regs} />
                                    <CostCell value={metrics.cps} pair={thresholds.sales} />
                                    <td className="text-muted-foreground p-2 font-mono">
                                        {ratioPct(metrics.inst2reg)}
                                    </td>
                                    <td className="text-muted-foreground p-2 font-mono">{ratioPct(metrics.reg2dep)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <p className="text-muted-foreground text-[10px]">{ui('allocEstimate', locale)}</p>
        </div>
    );
}

export { ModelTable };
