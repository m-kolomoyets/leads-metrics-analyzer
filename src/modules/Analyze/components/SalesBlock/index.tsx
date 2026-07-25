import type { CampaignRollup } from '@/lib/domain/accounts';
import type { Locale } from '../../utils/i18n';
import { sumTotals } from '@/lib/domain/aggregate';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SALES_BUTTON_CLASS } from '../../constants';
import { int, usd } from '../../utils/format';
import { ui } from '../../utils/i18n';
import { Pill } from '../Pill';

type SalesBlockProps = {
    campaigns: CampaignRollup[];
    locale: Locale;
    copiedKey: string;
    onCopy: (text: string, key: string) => void;
    copyKey: string;
};

// The Account's campaigns that produced ≥1 sale — the buyer's proven winners, in their own violet
// panel (reference "З ПРОДАЖАМИ") with a funnel stat line and copyable ids, independent of zone.
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
        <Card className="min-w-48 flex-1 gap-3 border-violet-500/30 bg-violet-500/5 p-3 backdrop-blur">
            <Pill color="violet" glyph="$" label={ui('sales', locale)} count={campaigns.length} />

            <p className="text-muted-foreground font-mono text-[11px] leading-relaxed">
                Spend {usd(stat.spendPlus)} · Clicks {int(stat.linkClicks)} · Inst {int(stat.installs)} · Reg{' '}
                {int(stat.regs)} · Sales {int(stat.sales)}
            </p>

            <textarea
                readOnly
                value={idLine}
                aria-label="sales campaign ids"
                className="bg-background/60 min-h-10 w-full flex-1 resize-none rounded-md border p-2 font-mono text-[11px]"
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
