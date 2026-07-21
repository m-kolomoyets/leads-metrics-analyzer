import type { AccountRollup } from '@/lib/domain/accounts';
import type { GeoThresholds, ThresholdPair } from '@/lib/domain/types';
import type { Locale } from '../../utils/i18n';
import { zoneFor } from '@/lib/domain/verdict';
import { cn } from '@/lib/utils/cn';
import { Card } from '@/components/ui/Card';
import { ZONE_TEXT_CLASS } from '../../constants';
import { cost, pct } from '../../utils/format';
import { ui } from '../../utils/i18n';

type AccountSummaryProps = {
    accounts: AccountRollup[];
    // Grades the cost cells by band; undefined (no preset) → plain cost, no tint.
    thresholds: GeoThresholds | undefined;
    locale: Locale;
    // Uncollapse the target block + scroll it into view (anchor `id="acc-<account>"`).
    onJump: (account: string) => void;
};

// A zone-graded cost cell, mirroring ModelTable: em dash on null, else band-tinted (or plain when the
// geo carries no thresholds).
function CostCell({ value, pair }: { value: number | null; pair: ThresholdPair | undefined }) {
    if (value === null) {
        return <td className="p-2 font-mono">—</td>;
    }
    if (!pair) {
        return <td className="p-2 font-mono">{cost(value)}</td>;
    }
    return <td className={cn('p-2 font-mono', ZONE_TEXT_CLASS[zoneFor(value, pair)])}>{cost(value)}</td>;
}

// Per-geo jump-to-block nav table over the S2 account roll-ups (#36). Pure UI — every figure comes from
// the same `accountsFor` compute the AccountBlocks render, so totals / zone counts / problem flag match
// exactly. A row click uncollapses + scrolls to its AccountBlock. Waste reuses the S4 estimate.
function AccountSummary({ accounts, thresholds, locale, onJump }: AccountSummaryProps) {
    if (accounts.length === 0) {
        return null;
    }

    return (
        <Card variant="flat" className="gap-2 border-primary/30 bg-primary/5 p-4">
            <h3 className="text-sm font-semibold">
                {ui('accountSummary', locale)}{' '}
                <span className="text-muted-foreground font-normal">· {ui('summaryHint', locale)}</span>
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-right text-xs">
                    <thead>
                        <tr className="text-muted-foreground border-b">
                            <th className="p-2 text-left font-normal whitespace-nowrap">Account ID</th>
                            {['Spend', 'Rev', 'ROI', ui('wasteCol', locale), 'CPC', 'CPI', 'CPR', 'CPS'].map((col) => {
                                return (
                                    <th key={col} className="p-2 font-normal whitespace-nowrap">
                                        {col}
                                    </th>
                                );
                            })}
                            <th className={cn('p-2 font-normal', ZONE_TEXT_CLASS.red)}>🔴</th>
                            <th className={cn('p-2 font-normal', ZONE_TEXT_CLASS.yellow)}>🟡</th>
                            <th className={cn('p-2 font-normal', ZONE_TEXT_CLASS.green)}>🟢</th>
                            <th className={cn('p-2 font-normal', ZONE_TEXT_CLASS.neutral)}>⚪</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account) => {
                            const { metrics, counts, problem, waste } = account;
                            return (
                                <tr
                                    key={account.account}
                                    className={cn(
                                        'hover:bg-muted/30 cursor-pointer border-b',
                                        problem && 'bg-danger/5'
                                    )}
                                    onClick={() => {
                                        onJump(account.account);
                                    }}
                                >
                                    <td
                                        className={cn(
                                            'p-2 text-left font-mono',
                                            problem ? 'font-bold text-danger' : ''
                                        )}
                                    >
                                        {account.account} {problem && '🚨'}
                                    </td>
                                    <td className="p-2 font-mono font-bold">${metrics.spend.toFixed(2)}</td>
                                    <td className={cn('p-2 font-mono', metrics.revenue > 0 && 'text-success')}>
                                        {metrics.revenue > 0 ? `$${metrics.revenue.toFixed(0)}` : '—'}
                                    </td>
                                    <td
                                        className={cn(
                                            'p-2 font-mono font-bold',
                                            metrics.roi !== null && (metrics.roi >= 0 ? 'text-success' : 'text-danger')
                                        )}
                                    >
                                        {pct(metrics.roi)}
                                    </td>
                                    <td
                                        className={cn(
                                            'p-2 font-mono',
                                            waste > 0 ? 'text-danger' : 'text-muted-foreground'
                                        )}
                                    >
                                        {waste > 0 ? `$${waste.toFixed(2)}` : '—'}
                                    </td>
                                    <CostCell value={metrics.cpc} pair={thresholds?.clicks} />
                                    <CostCell value={metrics.cpi} pair={thresholds?.installs} />
                                    <CostCell value={metrics.cpr} pair={thresholds?.regs} />
                                    <CostCell value={metrics.cps} pair={thresholds?.sales} />
                                    <td className={cn('p-2 font-mono', ZONE_TEXT_CLASS.red)}>{counts.red}</td>
                                    <td className={cn('p-2 font-mono', ZONE_TEXT_CLASS.yellow)}>{counts.yellow}</td>
                                    <td className={cn('p-2 font-mono', ZONE_TEXT_CLASS.green)}>{counts.green}</td>
                                    <td className={cn('p-2 font-mono', ZONE_TEXT_CLASS.neutral)}>{counts.neutral}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <p className="text-muted-foreground text-[10px]">{ui('wasteEstimate', locale)}</p>
        </Card>
    );
}

export { AccountSummary };
