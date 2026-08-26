import type { Locale } from '@/components/report/utils/i18n';
import type { CampaignRollup } from '@/lib/domain/accounts';
import { sumTotals } from '@/lib/domain/aggregate';
import { cn } from '@/lib/utils/cn';
import { SALES_BUTTON_CLASS, SALES_CARD_CLASS, SALES_CHIP_CLASS } from '@/components/report/constants';
import { int, usd } from '@/components/report/utils/format';
import { ui } from '@/components/report/utils/i18n';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '../StatusChip';

type SalesBlockProps = {
    campaigns: CampaignRollup[];
    locale: Locale;
    copiedKey: string;
    onCopy: (text: string, key: string) => void;
    copyKey: string;
};

// The Account's campaigns that produced ≥1 sale — the buyer's proven winners, in their own panel
// ("З ПРОДАЖАМИ") with a funnel stat line and copyable ids. Zone-independent — a sale is a fact, not
// a judgement — so it wears violet, the one hue outside the Zone scale, rather than borrowing green.
function SalesBlock({ campaigns, locale, copiedKey, onCopy, copyKey }: SalesBlockProps) {
    const idLine = campaigns
        .map((campaign) => {
            return campaign.campaign;
        })
        .join(', ');
    const stat = sumTotals(
        campaigns.map((campaign) => {
            return campaign.totals;
        })
    );
    // One line per metric, each label+value kept as an unbreakable unit — the line wraps between
    // metrics instead of splitting "Sales 6" across two rows.
    const stats = [
        { label: 'Spend', value: usd(stat.spendPlus) },
        { label: 'Clicks', value: int(stat.linkClicks) },
        { label: 'Inst', value: int(stat.installs) },
        { label: 'Reg', value: int(stat.regs) },
        { label: 'Sales', value: int(stat.sales) },
    ];

    return (
        <Card className={cn('min-w-48 flex-1 gap-3 p-3', SALES_CARD_CLASS)}>
            <StatusChip
                zone="neutral"
                glyph="$"
                label={ui('sales', locale)}
                count={campaigns.length}
                className={SALES_CHIP_CLASS}
            />

            <ul className="text-muted-foreground flex flex-wrap gap-x-2 gap-y-0.5 text-xs leading-relaxed tabular-nums">
                {stats.map((entry, index) => {
                    return (
                        <li key={entry.label} className="whitespace-nowrap">
                            {entry.label} <span className="text-foreground/80">{entry.value}</span>
                            {index < stats.length - 1 ? <span aria-hidden="true"> ·</span> : null}
                        </li>
                    );
                })}
            </ul>

            <textarea
                readOnly
                value={idLine}
                aria-label="sales campaign ids"
                className="bg-background border-border min-h-10 w-full flex-1 resize-none rounded-sm border p-2 text-xs"
            />

            <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn('mt-auto', SALES_BUTTON_CLASS)}
                onClick={() => {
                    onCopy(idLine, copyKey);
                }}
            >
                {copiedKey === copyKey ? ui('copied', locale) : ui('copyIds', locale)}
            </Button>
        </Card>
    );
}

export { SalesBlock };
