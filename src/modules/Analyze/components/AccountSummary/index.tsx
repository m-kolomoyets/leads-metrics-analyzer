import type { AccountCounts, AccountRollup } from '@/lib/domain/accounts';
import type { Metrics } from '@/lib/domain/aggregate';
import type { GeoThresholds, ThresholdPair, Zone } from '@/lib/domain/types';
import type { Locale } from '../../utils/i18n';
import { metricsFor, sumTotals } from '@/lib/domain/aggregate';
import { zoneFor } from '@/lib/domain/verdict';
import { cn } from '@/lib/utils/cn';
import { SALES_TEXT_CLASS, ZONE_TEXT_CLASS } from '../../constants';
import { cost, int, pct, usd, usdRound, usdSigned } from '../../utils/format';
import { ui } from '../../utils/i18n';

type AccountSummaryProps = {
    accounts: AccountRollup[];
    // Grades the cost cells by band; undefined (no preset) → plain cost, no tint.
    thresholds: GeoThresholds | undefined;
    locale: Locale;
    // Triage state, owned by the parent — drives the ✓ marker and drops the alarm styling.
    isReviewed: (account: string) => boolean;
    // Uncollapse the target block + scroll it into view (anchor `id="acc-<account>"`).
    onJump: (account: string) => void;
};

// Column groups, mirroring CreativeTable: a `border-l` on the first column of each block draws the
// divider across head, body and foot. Funnel counts (Clicks…EPC) | money | cost-per | waste.
const BLOCK_START = 'border-l';

// Block-start columns: Rev, CPC and Waste open blocks 2/3/4 (block 1 runs Clicks…EPC).
const HEAD_COLS: Array<{ label: string; start?: boolean }> = [
    { label: 'Clicks' },
    { label: 'Inst' },
    { label: 'Reg' },
    { label: 'Sale' },
    { label: 'EPC' },
    { label: 'Rev', start: true },
    { label: 'Spend' },
    { label: 'Profit' },
    { label: 'ROI' },
    { label: 'CPC', start: true },
    { label: 'CPI' },
    { label: 'CPR' },
    { label: 'CPS' },
];

const ZONES: Zone[] = ['red', 'yellow', 'green', 'neutral'];
const ZONE_EMOJI: Record<Zone, string> = { red: '🔴', yellow: '🟡', green: '🟢', neutral: '⚪' };

// A zone-graded cost cell, mirroring ModelTable: em dash on null, else band-tinted (or plain when the
// geo carries no thresholds, or in the totals footer).
function CostCell({
    value,
    pair,
    className,
    plain,
}: {
    value: number | null;
    pair: ThresholdPair | undefined;
    className?: string;
    plain?: boolean;
}) {
    if (value === null) {
        return <td className={cn('p-2 font-mono', className)}>—</td>;
    }
    const zone = pair && !plain ? ZONE_TEXT_CLASS[zoneFor(value, pair)] : undefined;
    return <td className={cn('p-2 font-mono', zone, className)}>{cost(value)}</td>;
}

// The metric cells shared by an account row and the totals footer. `plain` (footer) drops the tints
// so the sums / re-derived averages render in the default foreground.
function MetricCells({
    m,
    waste,
    thresholds,
    plain,
}: {
    m: Metrics;
    waste: number;
    thresholds: GeoThresholds | undefined;
    plain?: boolean;
}) {
    const dim = plain ? undefined : 'text-muted-foreground';
    return (
        <>
            <td className="p-2 font-mono">{int(m.linkClicks)}</td>
            <td className="p-2 font-mono">{int(m.installs)}</td>
            <td className="p-2 font-mono">{int(m.regs)}</td>
            <td className="p-2 font-mono">{int(m.sales)}</td>
            <td className={cn('p-2 font-mono', dim)}>{cost(m.epc)}</td>
            <td className={cn('p-2 font-mono', BLOCK_START, !plain && m.revenue > 0 && 'text-success')}>
                {m.revenue > 0 ? usdRound(m.revenue) : '—'}
            </td>
            <td className="p-2 font-mono font-bold">{usd(m.spendPlus)}</td>
            <td className={cn('p-2 font-mono font-bold', !plain && (m.profit >= 0 ? 'text-success' : 'text-danger'))}>
                {usdSigned(m.profit)}
            </td>
            <td
                className={cn(
                    'p-2 font-mono font-bold',
                    !plain && m.roi !== null && (m.roi >= 0 ? 'text-success' : 'text-danger')
                )}
            >
                {pct(m.roi)}
            </td>
            <CostCell value={m.cpc} pair={thresholds?.clicks} className={BLOCK_START} plain={plain} />
            <CostCell value={m.cpi} pair={thresholds?.installs} plain={plain} />
            <CostCell value={m.cpr} pair={thresholds?.regs} plain={plain} />
            <CostCell value={m.cps} pair={thresholds?.sales} plain={plain} />
            <td className={cn('p-2 font-mono', BLOCK_START, waste > 0 && !plain ? 'text-danger' : dim)}>
                {waste > 0 ? usd(waste) : '—'}
            </td>
        </>
    );
}

// Per-geo jump-to-block nav table over the S2 account roll-ups (#36). Pure UI — every figure comes from
// the same `accountsFor` compute the AccountBlocks render, so totals / zone counts / problem flag match
// exactly. A row click uncollapses + scrolls to its AccountBlock. Waste reuses the S4 estimate. The
// footer rolls every account up via metricsFor(Σ totals): counts / money summed, EPC / ROI / cost-per
// re-derived off the sums (never averaged averages), zone markers summed. Hidden for a single account,
// where the total would just repeat the row.
function AccountSummary({ accounts, thresholds, locale, isReviewed, onJump }: AccountSummaryProps) {
    if (accounts.length === 0) {
        return null;
    }

    const showFooter = accounts.length > 1;
    const totals = metricsFor(
        sumTotals(
            accounts.map((account) => {
                return account.metrics;
            })
        )
    );
    const totalWaste = accounts.reduce((sum, account) => {
        return sum + account.waste;
    }, 0);
    const totalCounts: AccountCounts = { green: 0, yellow: 0, red: 0, neutral: 0, sales: 0 };
    for (const account of accounts) {
        for (const zone of ZONES) {
            totalCounts[zone] += account.counts[zone];
        }
        totalCounts.sales += account.counts.sales;
    }

    return (
        <section className="glass-tint tint-blue tint-s5 flex flex-col gap-2 rounded-2xl p-4">
            <h3 className="text-muted-foreground text-[13px] font-normal tracking-widest uppercase">
                {ui('accountSummary', locale)} <span className="normal-case">· {ui('summaryHint', locale)}</span>
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-right text-xs">
                    <thead>
                        <tr className="text-muted-foreground border-b">
                            <th className="w-6 p-2 text-left font-normal">
                                <span className="sr-only">{ui('reviewed', locale)}</span>
                            </th>
                            <th className="p-2 text-left font-normal whitespace-nowrap">Account ID</th>
                            {HEAD_COLS.map((col) => {
                                return (
                                    <th
                                        key={col.label}
                                        className={cn('p-2 font-normal whitespace-nowrap', col.start && BLOCK_START)}
                                    >
                                        {col.label}
                                    </th>
                                );
                            })}
                            <th className={cn('p-2 font-normal whitespace-nowrap', BLOCK_START)}>
                                {ui('wasteCol', locale)}
                            </th>
                            {ZONES.map((zone) => {
                                return (
                                    <th
                                        key={zone}
                                        className={cn(
                                            'p-2 font-normal',
                                            ZONE_TEXT_CLASS[zone],
                                            zone === 'red' && BLOCK_START
                                        )}
                                    >
                                        {ZONE_EMOJI[zone]}
                                    </th>
                                );
                            })}
                            <th className={cn('p-2 font-normal', SALES_TEXT_CLASS)}>💰</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account) => {
                            const { metrics, counts, problem, waste } = account;
                            const reviewed = isReviewed(account.account);
                            // Reviewed rows keep full contrast — the figures stay readable so a call can
                            // be revisited; only the alarm styling (tint, rule, 🚨) is retired.
                            const alarm = problem !== null && !reviewed;
                            return (
                                <tr
                                    key={account.account}
                                    className={cn(
                                        'hover:bg-muted/30 cursor-pointer border-b',
                                        alarm && 'bg-danger/15 border-l-2 border-l-danger'
                                    )}
                                    onClick={() => {
                                        onJump(account.account);
                                    }}
                                >
                                    <td className="text-success w-6 p-2 text-left">{reviewed && '✓'}</td>
                                    <td className={cn('p-2 text-left font-mono', alarm && 'font-bold text-danger')}>
                                        {account.account} {alarm && '🚨'}
                                    </td>
                                    <MetricCells m={metrics} waste={waste} thresholds={thresholds} />
                                    {ZONES.map((zone) => {
                                        return (
                                            <td
                                                key={zone}
                                                className={cn(
                                                    'p-2 font-mono',
                                                    ZONE_TEXT_CLASS[zone],
                                                    zone === 'red' && BLOCK_START
                                                )}
                                            >
                                                {counts[zone]}
                                            </td>
                                        );
                                    })}
                                    <td className={cn('p-2 font-mono', SALES_TEXT_CLASS)}>{counts.sales}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    {showFooter && (
                        <tfoot>
                            <tr className="border-t-2 font-semibold">
                                <td className="w-6 p-2" />
                                <td className="text-muted-foreground p-2 text-left whitespace-nowrap">
                                    {ui('totalAvg', locale)}
                                </td>
                                <MetricCells m={totals} waste={totalWaste} thresholds={thresholds} plain />
                                {ZONES.map((zone) => {
                                    return (
                                        <td
                                            key={zone}
                                            className={cn(
                                                'p-2 font-mono',
                                                ZONE_TEXT_CLASS[zone],
                                                zone === 'red' && BLOCK_START
                                            )}
                                        >
                                            {totalCounts[zone]}
                                        </td>
                                    );
                                })}
                                <td className={cn('p-2 font-mono', SALES_TEXT_CLASS)}>{totalCounts.sales}</td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
            <p className="text-muted-foreground text-[10px]">{ui('wasteEstimate', locale)}</p>
        </section>
    );
}

export { AccountSummary };
