import type { Locale } from '@/components/report/utils/i18n';
import type { AccountCounts, AccountRollup } from '@/lib/domain/accounts';
import type { Metrics } from '@/lib/domain/aggregate';
import type { GeoThresholds, ThresholdPair, Zone } from '@/lib/domain/types';
import { metricsFor, sumTotals } from '@/lib/domain/aggregate';
import { zoneFor } from '@/lib/domain/verdict';
import { cn } from '@/lib/utils/cn';
import { SALES_TEXT_CLASS, ZONE_TEXT_CLASS } from '@/components/report/constants';
import { cost, int, pct, usd, usdRound, usdSigned } from '@/components/report/utils/format';
import { ui } from '@/components/report/utils/i18n';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/Table';

type AccountSummaryProps = {
    accounts: AccountRollup[];
    // Grades the cost cells by band; undefined (no preset) → plain cost, no tint.
    thresholds: GeoThresholds | undefined;
    locale: Locale;
    // Triage state, owned by the parent — drives the ✓ marker and drops the alarm styling. Omitted on
    // a read-only report, which renders no Reviewed column at all: the marks are an analyst's private
    // progress notes and never leave Analyze (spec story 34).
    isReviewed?: (account: string) => boolean;
    // Uncollapse the target block + scroll it into view (anchor `id="acc-<account>"`). Omitted on a
    // read-only report, where there are no AccountBlocks to jump to — so the rows are not clickable.
    onJump?: (account: string) => void;
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
        return (
            <TableCell isNumeric className={className}>
                —
            </TableCell>
        );
    }
    const zone = pair && !plain ? ZONE_TEXT_CLASS[zoneFor(value, pair)] : undefined;
    return (
        <TableCell isNumeric className={cn(zone, className)}>
            {cost(value)}
        </TableCell>
    );
}

// The metric cells shared by an account row and the totals footer. `plain` (footer) drops the tints
// so the sums / re-derived averages render in the default foreground.
function MetricCells({
    m,
    waste,
    wasteGrain,
    thresholds,
    locale,
    plain,
}: {
    m: Metrics;
    waste: number;
    // 'account' marks Account Waste — measured whole, so it will not equal the account's campaign rows
    // (ADR-0014). Marked rather than silently shown, or the mismatch reads as an arithmetic bug.
    wasteGrain?: 'campaign' | 'account';
    thresholds: GeoThresholds | undefined;
    locale: Locale;
    plain?: boolean;
}) {
    const dim = plain ? undefined : 'text-muted-foreground';
    return (
        <>
            <TableCell isNumeric>{int(m.linkClicks)}</TableCell>
            <TableCell isNumeric>{int(m.installs)}</TableCell>
            <TableCell isNumeric>{int(m.regs)}</TableCell>
            <TableCell isNumeric>{int(m.sales)}</TableCell>
            <TableCell isNumeric className={dim}>
                {cost(m.epc)}
            </TableCell>
            <TableCell isNumeric className={cn(BLOCK_START, !plain && m.revenue > 0 && ZONE_TEXT_CLASS.green)}>
                {m.revenue > 0 ? usdRound(m.revenue) : '—'}
            </TableCell>
            <TableCell isNumeric className="font-medium">
                {usd(m.spendPlus)}
            </TableCell>
            <TableCell
                isNumeric
                className={cn('font-medium', !plain && (m.profit >= 0 ? ZONE_TEXT_CLASS.green : ZONE_TEXT_CLASS.red))}
            >
                {usdSigned(m.profit)}
            </TableCell>
            <TableCell
                isNumeric
                className={cn(
                    'font-medium',
                    !plain && m.roi !== null && (m.roi >= 0 ? ZONE_TEXT_CLASS.green : ZONE_TEXT_CLASS.red)
                )}
            >
                {pct(m.roi)}
            </TableCell>
            <CostCell value={m.cpc} pair={thresholds?.clicks} className={BLOCK_START} plain={plain} />
            <CostCell value={m.cpi} pair={thresholds?.installs} plain={plain} />
            <CostCell value={m.cpr} pair={thresholds?.regs} plain={plain} />
            <CostCell value={m.cps} pair={thresholds?.sales} plain={plain} />
            <TableCell isNumeric className={cn(BLOCK_START, waste > 0 && !plain ? ZONE_TEXT_CLASS.red : dim)}>
                {waste > 0 ? usd(waste) : '—'}
                {wasteGrain === 'account' && waste > 0 ? (
                    <abbr className="text-muted-foreground ml-0.5 no-underline" title={ui('wasteAccountGrain', locale)}>
                        *
                    </abbr>
                ) : null}
            </TableCell>
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
    // The whole triage column disappears rather than rendering an always-empty one.
    const showReviewed = isReviewed !== undefined;
    const totals = metricsFor(
        sumTotals(
            accounts.map((account) => {
                return account.metrics;
            })
        )
    );
    // The total mixes grains as soon as one account is problem-flagged, so it carries the marker too.
    const anyAccountGrain = accounts.some((account) => {
        return account.wasteGrain === 'account';
    });
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
        <section className="bg-surface border-border flex flex-col gap-2 rounded-md border p-4">
            <h3 className="text-foreground text-xs font-semibold tracking-widest uppercase">
                {ui('accountSummary', locale)} <span className="normal-case">· {ui('summaryHint', locale)}</span>
            </h3>
            <Table density="compact" className="text-xs">
                <TableHeader>
                    <TableRow>
                        {showReviewed && (
                            <TableHead className="w-6">
                                <span className="sr-only">{ui('reviewed', locale)}</span>
                            </TableHead>
                        )}
                        <TableHead>Account ID</TableHead>
                        {HEAD_COLS.map((col) => {
                            return (
                                <TableHead key={col.label} isNumeric className={cn(col.start && BLOCK_START)}>
                                    {col.label}
                                </TableHead>
                            );
                        })}
                        <TableHead isNumeric className={BLOCK_START}>
                            {ui('wasteCol', locale)}
                        </TableHead>
                        {ZONES.map((zone) => {
                            return (
                                <TableHead
                                    key={zone}
                                    isNumeric
                                    className={cn(ZONE_TEXT_CLASS[zone], zone === 'red' && BLOCK_START)}
                                >
                                    {ZONE_EMOJI[zone]}
                                </TableHead>
                            );
                        })}
                        <TableHead isNumeric className={SALES_TEXT_CLASS}>
                            💰
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {accounts.map((account) => {
                        const { metrics, counts, problem, waste, wasteGrain } = account;
                        const reviewed = isReviewed?.(account.account) ?? false;
                        // Reviewed rows keep full contrast — the figures stay readable so a call can
                        // be revisited; only the alarm styling (tint, rule, 🚨) is retired.
                        const alarm = problem !== null && !reviewed;
                        return (
                            <TableRow
                                key={account.account}
                                className={cn(
                                    onJump && 'hover:bg-background cursor-pointer',
                                    alarm && 'border-l-zone-red border-l-2'
                                )}
                                onClick={
                                    onJump &&
                                    (() => {
                                        onJump(account.account);
                                    })
                                }
                            >
                                {showReviewed && (
                                    <TableCell className="text-zone-green w-6">{reviewed && '✓'}</TableCell>
                                )}
                                <TableCell className={cn('tabular-nums', alarm && 'text-zone-red font-medium')}>
                                    {account.account} {alarm && '🚨'}
                                </TableCell>
                                <MetricCells
                                    m={metrics}
                                    waste={waste}
                                    wasteGrain={wasteGrain}
                                    thresholds={thresholds}
                                    locale={locale}
                                />
                                {ZONES.map((zone) => {
                                    return (
                                        <TableCell
                                            key={zone}
                                            isNumeric
                                            className={cn(ZONE_TEXT_CLASS[zone], zone === 'red' && BLOCK_START)}
                                        >
                                            {counts[zone]}
                                        </TableCell>
                                    );
                                })}
                                <TableCell isNumeric className={SALES_TEXT_CLASS}>
                                    {counts.sales}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                {showFooter && (
                    <TableFooter>
                        <TableRow className="font-medium">
                            {showReviewed && <TableCell className="w-6" />}
                            <TableCell className="text-muted-foreground">{ui('totalAvg', locale)}</TableCell>
                            <MetricCells
                                m={totals}
                                waste={totalWaste}
                                wasteGrain={anyAccountGrain ? 'account' : 'campaign'}
                                thresholds={thresholds}
                                locale={locale}
                                plain
                            />
                            {ZONES.map((zone) => {
                                return (
                                    <TableCell
                                        key={zone}
                                        isNumeric
                                        className={cn(ZONE_TEXT_CLASS[zone], zone === 'red' && BLOCK_START)}
                                    >
                                        {totalCounts[zone]}
                                    </TableCell>
                                );
                            })}
                            <TableCell isNumeric className={SALES_TEXT_CLASS}>
                                {totalCounts.sales}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
            <p className="text-muted-foreground text-xs">{ui('wasteEstimate', locale)}</p>
            {anyAccountGrain && <p className="text-muted-foreground text-xs">{ui('wasteAccountGrainNote', locale)}</p>}
        </section>
    );
}

export { AccountSummary };
