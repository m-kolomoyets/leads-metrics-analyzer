import type { CampaignRollup } from '@/lib/domain/accounts';
import type { GeoThresholds, ThresholdPair } from '@/lib/domain/types';
import type { Locale } from '../../utils/i18n';
import { zoneFor } from '@/lib/domain/verdict';
import { cn } from '@/lib/utils/cn';
import { ZONE_ACCENT_CLASS, ZONE_TEXT_CLASS } from '../../constants';
import { cost, usd } from '../../utils/format';
import { ui, verdictWhy } from '../../utils/i18n';

type AccountCampaignsProps = {
    campaigns: CampaignRollup[];
    // Grades the CPC/CPI/CPR/CPS cells by band (reference `<Metric>`); undefined → plain neutral.
    thresholds: GeoThresholds | undefined;
    locale: Locale;
    isExcluded: (campaign: string) => boolean;
    onToggle: (campaign: string) => void;
};

const COLUMNS = ['Campaign', 'Spend', 'Rev', 'Clicks', 'Inst', 'Reg', 'Sale', 'CPC', 'CPI', 'CPR', 'CPS'] as const;

// A zone-graded cost cell (CPC/CPI/CPR/CPS): em dash on null, else `$x.xx` tinted by its band and
// bolded in the red zone — the reference `<Metric>`.
function CostCell({ value, pair }: { value: number | null; pair: ThresholdPair | undefined }) {
    if (value === null) {
        return <td className="text-muted-foreground p-2 font-mono">—</td>;
    }
    if (!pair) {
        return <td className="p-2 font-mono">${cost(value)}</td>;
    }
    const zone = zoneFor(value, pair);
    return (
        <td className={cn('p-2 font-mono', zone === 'red' && 'font-bold', ZONE_TEXT_CLASS[zone])}>${cost(value)}</td>
    );
}

// The Account's campaigns at Campaign grain, one row each with an exclude toggle. Toggling a row
// mutes it (parent recomputes the account/geo roll-ups) — the row stays visible, dimmed, so it can be
// brought back. The "Чому" column renders the structured verdict per locale.
function AccountCampaigns({ campaigns, thresholds, locale, isExcluded, onToggle }: AccountCampaignsProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-right text-sm">
                <thead>
                    <tr className="text-muted-foreground border-b text-xs">
                        <th className="w-8 p-2" />
                        <th className="w-1.5 p-0" />
                        {COLUMNS.map((col) => {
                            return (
                                <th key={col} className={cn('p-2 font-normal', col === 'Campaign' && 'text-left')}>
                                    {col}
                                </th>
                            );
                        })}
                        <th className="p-2 text-left font-normal">{ui('why', locale)}</th>
                    </tr>
                </thead>
                <tbody>
                    {campaigns.map((campaign) => {
                        const { metrics, verdict } = campaign;
                        const excluded = isExcluded(campaign.campaign);
                        return (
                            <tr key={campaign.campaign} className={cn('border-b', excluded && 'opacity-40')}>
                                <td className="p-2">
                                    <input
                                        type="checkbox"
                                        checked={!excluded}
                                        aria-label={`include ${campaign.campaign}`}
                                        onChange={() => {
                                            onToggle(campaign.campaign);
                                        }}
                                    />
                                </td>
                                <td className={cn('p-0', ZONE_ACCENT_CLASS[verdict.verdict])} />
                                <td className="text-muted-foreground p-2 text-left font-mono text-xs">
                                    {campaign.campaign}
                                </td>
                                <td className="p-2 font-mono">{usd(metrics.spendPlus)}</td>
                                <td
                                    className={cn(
                                        'p-2 font-mono',
                                        metrics.revenue > 0 ? 'text-success' : 'text-muted-foreground'
                                    )}
                                >
                                    {metrics.revenue > 0 ? usd(metrics.revenue) : '—'}
                                </td>
                                <td className="p-2 font-mono">{metrics.linkClicks}</td>
                                <td className="p-2 font-mono">{metrics.installs}</td>
                                <td className="p-2 font-mono">{metrics.regs}</td>
                                <td className="p-2 font-mono">{metrics.sales}</td>
                                <CostCell value={metrics.cpc} pair={thresholds?.clicks} />
                                <CostCell value={metrics.cpi} pair={thresholds?.installs} />
                                <CostCell value={metrics.cpr} pair={thresholds?.regs} />
                                <CostCell value={metrics.cps} pair={thresholds?.sales} />
                                <td className="text-muted-foreground p-2 text-left text-xs">
                                    {verdictWhy(verdict, locale)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export { AccountCampaigns };
