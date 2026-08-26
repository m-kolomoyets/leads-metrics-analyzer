import type { Locale } from '@/components/report/utils/i18n';
import type { CampaignRollup } from '@/lib/domain/accounts';
import { sumTotals } from '@/lib/domain/aggregate';
import { cn } from '@/lib/utils/cn';
import { SALES_BUTTON_CLASS } from '@/components/report/constants';
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
// ("З ПРОДАЖАМИ") with a funnel stat line and copyable ids. Zone-independent, so it wears no zone
// colour: a sale is a fact, not a judgement.
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

    return (
        <Card className="min-w-48 flex-1 gap-3 p-3">
            <StatusChip zone="neutral" glyph="$" label={ui('sales', locale)} count={campaigns.length} />

            <p className="text-muted-foreground text-xs leading-relaxed tabular-nums">
                Spend {usd(stat.spendPlus)} · Clicks {int(stat.linkClicks)} · Inst {int(stat.installs)} · Reg{' '}
                {int(stat.regs)} · Sales {int(stat.sales)}
            </p>

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
