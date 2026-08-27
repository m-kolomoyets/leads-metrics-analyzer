import type { Locale } from '@/components/report/utils/i18n';
import type { AccountRollup } from '@/lib/domain/accounts';
import type { GeoThresholds, ThresholdPair } from '@/lib/domain/types';
import { useState } from 'react';
import { zoneFor } from '@/lib/domain/verdict';
import { cn } from '@/lib/utils/cn';
import { BUCKET_ZONES, SALES_PANEL_CLASS, SALES_TEXT_CLASS, ZONE_TEXT_CLASS } from '@/components/report/constants';
import { cost, pct, usd, usdRound, usdSigned } from '@/components/report/utils/format';
import { problemReason, ui } from '@/components/report/utils/i18n';
import { Button } from '@/components/ui/Button';
import { AccountCampaigns } from '../AccountCampaigns';
import { BucketBlock } from '../BucketBlock';
import { SalesBlock } from '../SalesBlock';
import { StatusChip } from '../StatusChip';

type AccountBlockProps = {
    account: AccountRollup;
    // Grades the campaign table's CPC/CPI/CPR/CPS cells by band (reference `<Metric>`).
    thresholds: GeoThresholds | undefined;
    locale: Locale;
    copiedKey: string;
    onCopy: (text: string, key: string) => void;
    isExcluded: (campaign: string) => boolean;
    onToggleExcluded: (campaign: string) => void;
    // Collapse is lifted so the summary nav table (#36) can uncollapse a block on row click.
    open: boolean;
    onToggleOpen: () => void;
    // Triage state, lifted so the parent can order handled accounts to the bottom.
    reviewed: boolean;
    onToggleReviewed: () => void;
};

// One Account panel: a hairline frame (red when Problem) with a metrics header, the three action
// buckets + sales block, and the full campaign table. `id="acc-<account>"` is the summary table's jump anchor;
// collapse and "reviewed" are both controlled by the parent.
function AccountBlock({
    account,
    thresholds,
    locale,
    copiedKey,
    onCopy,
    isExcluded,
    onToggleExcluded,
    open,
    onToggleOpen,
    reviewed,
    onToggleReviewed,
}: AccountBlockProps) {
    const { metrics, counts, problem } = account;

    const [campaignsOpen, setCampaignsOpen] = useState(false);

    const salesIds = new Set(
        account.salesCampaigns.map((campaign) => {
            return campaign.campaign;
        })
    );
    // Everything the sales table above doesn't already show — excluded sales campaigns land here too,
    // since exclusion drops them from `salesCampaigns`.
    const otherCampaigns = account.campaigns.filter((campaign) => {
        return !salesIds.has(campaign.campaign);
    });

    const included = account.campaigns.filter((campaign) => {
        return !campaign.excluded;
    });

    // Sales outrank the zone verdict: a campaign with ≥1 sale belongs to the sales block only, so the
    // buckets (СТОП / ТРИМАЄМО / БУСТ) never repeat an id the sales block already lists.
    const bucketCampaigns = included.filter((campaign) => {
        return campaign.metrics.sales === 0;
    });

    return (
        <section
            id={`acc-${account.account}`}
            className={cn(
                'bg-surface scroll-mt-4 rounded-md border p-4 motion-safe:transition-opacity',
                problem ? 'border-zone-red glow-zone-red' : 'border-border',
                // The pulse is a call to act, so reviewing silences it — the red frame and chip stay,
                // since the account is still Problem, only no longer unhandled.
                problem && !reviewed && 'pulse-red',
                reviewed && 'opacity-60'
            )}
        >
            <div className="flex flex-wrap items-center gap-3">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-expanded={open}
                    aria-label={open ? 'collapse account' : 'expand account'}
                    onClick={onToggleOpen}
                >
                    {open ? '▾' : '▸'}
                </Button>

                <button
                    type="button"
                    title="copy account id"
                    className={cn('text-base font-semibold tabular-nums', problem && ZONE_TEXT_CLASS.red)}
                    onClick={() => {
                        onCopy(account.account, `acc:${account.account}`);
                    }}
                >
                    {copiedKey === `acc:${account.account}` ? ui('copied', locale) : account.account}
                </button>

                {problem && <StatusChip zone="red" glyph="!" label={ui('problem', locale)} />}

                <label className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <input type="checkbox" checked={reviewed} onChange={onToggleReviewed} />
                    {ui('reviewed', locale)}
                </label>

                <span className="flex-1" />

                {/* Money | cost-per | zone markers — same three blocks as the summary table's column
                    groups, so the collapsed header reads like the row it stands for. */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <div className="flex items-center gap-3">
                        <Stat
                            label="Rev"
                            value={metrics.revenue > 0 ? usdRound(metrics.revenue) : '—'}
                            className={metrics.revenue > 0 ? ZONE_TEXT_CLASS.green : 'text-muted-foreground'}
                        />
                        <Stat label="Spend" value={usd(metrics.spendPlus)} className="font-medium" />
                        <Stat
                            label="Profit"
                            value={usdSigned(metrics.profit)}
                            className={cn(
                                'font-medium',
                                metrics.profit >= 0 ? ZONE_TEXT_CLASS.green : ZONE_TEXT_CLASS.red
                            )}
                        />
                        <Stat
                            label="ROI"
                            value={pct(metrics.roi)}
                            className={cn('font-medium', roiClass(metrics.roi))}
                        />
                    </div>

                    <div className="flex items-center gap-3 border-l pl-3">
                        <Stat
                            label="CPC"
                            value={cost(metrics.cpc)}
                            className={costClass(metrics.cpc, thresholds?.clicks)}
                        />
                        <Stat
                            label="CPI"
                            value={cost(metrics.cpi)}
                            className={costClass(metrics.cpi, thresholds?.installs)}
                        />
                        <Stat
                            label="CPR"
                            value={cost(metrics.cpr)}
                            className={costClass(metrics.cpr, thresholds?.regs)}
                        />
                        <Stat
                            label="CPS"
                            value={cost(metrics.cps)}
                            className={costClass(metrics.cps, thresholds?.sales)}
                        />
                    </div>

                    <span className="border-l pl-3 tabular-nums">
                        <span className={ZONE_TEXT_CLASS.red}>●{counts.red}</span>{' '}
                        <span className={ZONE_TEXT_CLASS.yellow}>●{counts.yellow}</span>{' '}
                        <span className={ZONE_TEXT_CLASS.green}>●{counts.green}</span>{' '}
                        <span className={ZONE_TEXT_CLASS.neutral}>●{counts.neutral}</span>{' '}
                        <span className={SALES_TEXT_CLASS}>●{counts.sales}</span>
                    </span>
                </div>
            </div>

            {problem && open && (
                <p className={cn('mt-2 text-xs', ZONE_TEXT_CLASS.red)}>
                    ⚠ {problemReason(problem, metrics.spendPlus, metrics.cpi, locale)} — {ui('checkManually', locale)}.
                </p>
            )}

            {open && (
                <div className="mt-4 flex flex-col gap-4">
                    {/* Three zone buckets, plus the sales block when there is one. A grid rather
                        than a wrap with a 12rem floor per block: the floor is what made a narrow
                        viewport scroll sideways instead of stacking. */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {BUCKET_ZONES.map((zone) => {
                            return (
                                <BucketBlock
                                    key={zone}
                                    zone={zone}
                                    campaigns={bucketCampaigns.filter((campaign) => {
                                        return campaign.verdict.verdict === zone;
                                    })}
                                    locale={locale}
                                    copiedKey={copiedKey}
                                    onCopy={onCopy}
                                    copyKey={`bucket:${account.account}:${zone}`}
                                />
                            );
                        })}
                        {account.salesCampaigns.length > 0 && (
                            <SalesBlock
                                campaigns={account.salesCampaigns}
                                locale={locale}
                                copiedKey={copiedKey}
                                onCopy={onCopy}
                                copyKey={`sales:${account.account}`}
                            />
                        )}
                    </div>

                    {account.salesCampaigns.length > 0 && (
                        <div className={cn('flex flex-col gap-2 rounded-md border p-3', SALES_PANEL_CLASS)}>
                            <span className={cn('text-sm font-medium', SALES_TEXT_CLASS)}>
                                {ui('salesCampaigns', locale)}
                            </span>
                            <AccountCampaigns
                                campaigns={account.salesCampaigns}
                                thresholds={thresholds}
                                locale={locale}
                                isExcluded={isExcluded}
                                onToggle={onToggleExcluded}
                            />
                        </div>
                    )}

                    {/* Sales ids get copied straight from the blocks above, so the no-sales campaigns —
                        the long tail nobody reads row by row — stay folded until asked for. */}
                    {otherCampaigns.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground w-fit gap-2"
                                aria-expanded={campaignsOpen}
                                onClick={() => {
                                    setCampaignsOpen((prev) => {
                                        return !prev;
                                    });
                                }}
                            >
                                <span aria-hidden>{campaignsOpen ? '▾' : '▸'}</span>
                                {ui('noSalesCampaigns', locale)} ({otherCampaigns.length})
                            </Button>

                            {campaignsOpen && (
                                <AccountCampaigns
                                    campaigns={otherCampaigns}
                                    thresholds={thresholds}
                                    locale={locale}
                                    isExcluded={isExcluded}
                                    onToggle={onToggleExcluded}
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

// One labelled figure in the header strip: dim label, coloured tabular value.
function Stat({ label, value, className }: { label: string; value: string; className?: string }) {
    return (
        <span className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="text-muted-foreground text-xs tracking-wide uppercase">{label}</span>
            <span className={cn('tabular-nums', className)}>{value}</span>
        </span>
    );
}

// Band tint for a cost-per figure, mirroring the campaign table; no preset (or null value) → dim.
function costClass(value: number | null, pair: ThresholdPair | undefined): string {
    if (value === null || !pair) {
        return 'text-muted-foreground';
    }
    return ZONE_TEXT_CLASS[zoneFor(value, pair)];
}

function roiClass(roi: number | null): string {
    if (roi === null) {
        return 'text-muted-foreground';
    }
    return roi >= 0 ? ZONE_TEXT_CLASS.green : ZONE_TEXT_CLASS.red;
}

export { AccountBlock };
