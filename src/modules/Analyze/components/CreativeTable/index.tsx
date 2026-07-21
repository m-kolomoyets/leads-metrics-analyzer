import type { CreativeRow } from '@/lib/domain/creatives';
import type { GeoThresholds, ThresholdPair } from '@/lib/domain/types';
import type { Locale } from '../../utils/i18n';
import { zoneFor } from '@/lib/domain/verdict';
import { cn } from '@/lib/utils/cn';
import { ZONE_ACCENT_CLASS, ZONE_TEXT_CLASS } from '../../constants';
import { cost, ctrPct, flagEmoji, usd } from '../../utils/format';
import { ui, verdictWhy } from '../../utils/i18n';

type CreativeTableProps = {
    rows: CreativeRow[];
    thresholds: GeoThresholds;
    locale: Locale;
    geo: string;
};

// A zone-graded cost cell (CPC/CPI/CPR/CPS) on the creative's Spend⁺ (real) + allocated funnel.
function CostCell({ value, pair }: { value: number | null; pair: ThresholdPair }) {
    if (value === null) {
        return <td className="p-2 font-mono">—</td>;
    }
    return <td className={cn('p-2 font-mono', ZONE_TEXT_CLASS[zoneFor(value, pair)])}>{cost(value)}</td>;
}

// #35 · Per-Geo Creative analysis table. One row per creative, verdict-zone striped on the left.
// Spend + CPM are real per creative; CPC/CPI/CPR/CPS + CTR ride the allocated funnel (estimate note).
function CreativeTable({ rows, thresholds, locale, geo }: CreativeTableProps) {
    if (rows.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-muted-foreground text-[13px] font-normal tracking-widest uppercase">
                🎨 {ui('creatives', locale)} · {geo}
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-right text-xs">
                    <thead>
                        <tr className="text-muted-foreground border-b">
                            <th className="w-1.5 p-0" />
                            <th className="p-2 text-left font-normal whitespace-nowrap">{ui('creative', locale)}</th>
                            {['Spend', 'CPC', 'CPI', 'CPR', 'CPS', 'CTR', 'CPM'].map((col) => {
                                return (
                                    <th key={col} className="p-2 font-normal">
                                        {col}
                                    </th>
                                );
                            })}
                            <th className="p-2 text-left font-normal whitespace-nowrap">{ui('why', locale)}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => {
                            const { metrics } = row;
                            return (
                                <tr key={row.key} className="border-b">
                                    <td className={cn('p-0', ZONE_ACCENT_CLASS[row.verdict.verdict])} />
                                    <td className="p-2 text-left whitespace-nowrap">
                                        <span className="text-base">{flagEmoji(row.cc)}</span>{' '}
                                        <span className="font-mono font-semibold">{row.key}</span>
                                    </td>
                                    <td className="p-2 font-mono font-bold">{usd(metrics.spend)}</td>
                                    <CostCell value={metrics.cpc} pair={thresholds.clicks} />
                                    <CostCell value={metrics.cpi} pair={thresholds.installs} />
                                    <CostCell value={metrics.cpr} pair={thresholds.regs} />
                                    <CostCell value={metrics.cps} pair={thresholds.sales} />
                                    <td className="text-muted-foreground p-2 font-mono">{ctrPct(row.ctr)}</td>
                                    <td className="text-muted-foreground p-2 font-mono">
                                        {row.cpm === null ? '—' : usd(row.cpm)}
                                    </td>
                                    <td className="text-muted-foreground p-2 text-left text-[11px]">
                                        {verdictWhy(row.verdict, locale)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <p className="text-muted-foreground text-[10px]">{ui('creativeEstimate', locale)}</p>
        </div>
    );
}

export { CreativeTable };
