import type { Locale } from '@/components/report/utils/i18n';
import type { CampaignRollup } from '@/lib/domain/accounts';
import type { GeoThresholds, ThresholdPair } from '@/lib/domain/types';
import { zoneFor } from '@/lib/domain/verdict';
import { cn } from '@/lib/utils/cn';
import { ZONE_ACCENT_CLASS, ZONE_TEXT_CLASS } from '@/components/report/constants';
import { int, usd } from '@/components/report/utils/format';
import { ui, verdictWhy } from '@/components/report/utils/i18n';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';

type AccountCampaignsProps = {
    campaigns: CampaignRollup[];
    // Grades the CPC/CPI/CPR/CPS cells by band (reference `<Metric>`); undefined → plain neutral.
    thresholds: GeoThresholds | undefined;
    locale: Locale;
    isExcluded: (campaign: string) => boolean;
    onToggle: (campaign: string) => void;
};

const COLUMNS = ['Campaign', 'Spend', 'Rev', 'Clicks', 'Inst', 'Reg', 'Sale', 'CPC', 'CPI', 'CPR', 'CPS'] as const;

// A zone-graded cost cell (CPC/CPI/CPR/CPS): em dash on null, else `$x.xx` in its band's colour and
// carrying the extra weight in the red zone.
function CostCell({ value, pair }: { value: number | null; pair: ThresholdPair | undefined }) {
    if (value === null) {
        return (
            <TableCell isNumeric className="text-muted-foreground">
                —
            </TableCell>
        );
    }
    if (!pair) {
        return <TableCell isNumeric>{usd(value)}</TableCell>;
    }
    const zone = zoneFor(value, pair);
    return (
        <TableCell isNumeric className={cn(zone === 'red' && 'font-medium', ZONE_TEXT_CLASS[zone])}>
            {usd(value)}
        </TableCell>
    );
}

// The Account's campaigns at Campaign grain, one row each with an exclude toggle. Toggling a row
// mutes it (parent recomputes the account/geo roll-ups) — the row stays visible, dimmed, so it can be
// brought back. The "Чому" column renders the structured verdict per locale.
function AccountCampaigns({ campaigns, thresholds, locale, isExcluded, onToggle }: AccountCampaignsProps) {
    return (
        <Table density="compact">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-8" />
                    <TableHead className="w-1.5 p-0" />
                    {COLUMNS.map((col) => {
                        return (
                            <TableHead key={col} isNumeric={col !== 'Campaign'}>
                                {col}
                            </TableHead>
                        );
                    })}
                    <TableHead>{ui('why', locale)}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {campaigns.map((campaign) => {
                    const { metrics, verdict } = campaign;
                    const excluded = isExcluded(campaign.campaign);
                    return (
                        <TableRow key={campaign.campaign} className={cn(excluded && 'opacity-40')}>
                            <TableCell>
                                <input
                                    type="checkbox"
                                    checked={!excluded}
                                    aria-label={`include ${campaign.campaign}`}
                                    onChange={() => {
                                        onToggle(campaign.campaign);
                                    }}
                                />
                            </TableCell>
                            <TableCell className={cn('p-0', ZONE_ACCENT_CLASS[verdict.verdict])} />
                            <TableCell className="text-muted-foreground text-xs">{campaign.campaign}</TableCell>
                            <TableCell isNumeric>{usd(metrics.spendPlus)}</TableCell>
                            <TableCell
                                isNumeric
                                className={metrics.revenue > 0 ? ZONE_TEXT_CLASS.green : 'text-muted-foreground'}
                            >
                                {metrics.revenue > 0 ? usd(metrics.revenue) : '—'}
                            </TableCell>
                            <TableCell isNumeric>{int(metrics.linkClicks)}</TableCell>
                            <TableCell isNumeric>{int(metrics.installs)}</TableCell>
                            <TableCell isNumeric>{int(metrics.regs)}</TableCell>
                            <TableCell isNumeric>{int(metrics.sales)}</TableCell>
                            <CostCell value={metrics.cpc} pair={thresholds?.clicks} />
                            <CostCell value={metrics.cpi} pair={thresholds?.installs} />
                            <CostCell value={metrics.cpr} pair={thresholds?.regs} />
                            <CostCell value={metrics.cps} pair={thresholds?.sales} />
                            <TableCell className="text-muted-foreground text-xs whitespace-normal">
                                {verdictWhy(verdict, locale)}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

export { AccountCampaigns };
