import type { AccountRollup } from '@/lib/domain/accounts';
import type { GeoThresholds } from '@/lib/domain/types';
import type { Locale } from '../../utils/i18n';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { BUCKET_ZONES, ZONE_TEXT_CLASS } from '../../constants';
import { cost, pct, usd } from '../../utils/format';
import { problemReason, ui } from '../../utils/i18n';
import { AccountCampaigns } from '../AccountCampaigns';
import { BucketBlock } from '../BucketBlock';
import { Pill } from '../Pill';
import { SalesBlock } from '../SalesBlock';

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

// One Account panel: a glass frame (red when Problem) with a metrics header, the three action buckets
// + sales block, and the full campaign table. `id="acc-<account>"` is the summary table's jump anchor;
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

    const included = account.campaigns.filter((campaign) => {
        return !campaign.excluded;
    });

    return (
        <section
            id={`acc-${account.account}`}
            className={cn(
                'scroll-mt-4 rounded-2xl p-4 transition-opacity',
                problem ? 'glass-tint tint-red' : 'glass-tint tint-blue tint-s4',
                // The pulse is a call to act, so reviewing silences it — the red frame and pill stay,
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
                    className={cn('font-mono text-base font-bold', problem && 'text-danger')}
                    onClick={() => {
                        onCopy(account.account, `acc:${account.account}`);
                    }}
                >
                    {copiedKey === `acc:${account.account}` ? ui('copied', locale) : account.account}
                </button>

                {problem && <Pill color="red" glyph="!" label={ui('problem', locale)} />}

                <label className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <input type="checkbox" checked={reviewed} onChange={onToggleReviewed} />
                    {ui('reviewed', locale)}
                </label>

                <span className="flex-1" />

                <span className="font-mono text-sm">{usd(metrics.spend)}</span>
                <span className="text-sm">
                    ROI <span className={cn('font-mono font-bold', roiClass(metrics.roi))}>{pct(metrics.roi)}</span>
                </span>
                <span className="text-muted-foreground text-xs">
                    CPC {cost(metrics.cpc)} · CPI {cost(metrics.cpi)} · CPR {cost(metrics.cpr)} · CPS{' '}
                    {cost(metrics.cps)}
                </span>
                <span className="font-mono text-xs">
                    <span className={ZONE_TEXT_CLASS.red}>●{counts.red}</span>{' '}
                    <span className={ZONE_TEXT_CLASS.yellow}>●{counts.yellow}</span>{' '}
                    <span className={ZONE_TEXT_CLASS.green}>●{counts.green}</span>{' '}
                    <span className={ZONE_TEXT_CLASS.neutral}>●{counts.neutral}</span>
                </span>
            </div>

            {problem && open && (
                <p className="mt-2 text-xs text-danger">
                    ⚠ {problemReason(problem, metrics.spendPlus, metrics.cpi, locale)} — {ui('checkManually', locale)}.
                </p>
            )}

            {open && (
                <div className="mt-4 flex flex-col gap-4">
                    <div className="flex flex-wrap gap-3">
                        {BUCKET_ZONES.map((zone) => {
                            return (
                                <BucketBlock
                                    key={zone}
                                    zone={zone}
                                    campaigns={included.filter((campaign) => {
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
                        <div className="flex flex-col gap-2 rounded-xl border border-violet-500/30 bg-violet-500/5 p-3">
                            <span className="text-sm font-bold text-violet-400">{ui('salesCampaigns', locale)}</span>
                            <AccountCampaigns
                                campaigns={account.salesCampaigns}
                                thresholds={thresholds}
                                locale={locale}
                                isExcluded={isExcluded}
                                onToggle={onToggleExcluded}
                            />
                        </div>
                    )}

                    <AccountCampaigns
                        campaigns={account.campaigns}
                        thresholds={thresholds}
                        locale={locale}
                        isExcluded={isExcluded}
                        onToggle={onToggleExcluded}
                    />
                </div>
            )}
        </section>
    );
}

function roiClass(roi: number | null): string {
    if (roi === null) {
        return 'text-muted-foreground';
    }
    return roi >= 0 ? 'text-success' : 'text-danger';
}

export { AccountBlock };
