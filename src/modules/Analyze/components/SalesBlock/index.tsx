import type { CampaignRollup } from '@/lib/domain/accounts';
import type { Locale } from '../../utils/i18n';
import { sumTotals } from '@/lib/domain/aggregate';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { usd } from '../../utils/format';
import { ui } from '../../utils/i18n';

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
            <div className="flex items-center gap-2">
                <span
                    className="flex size-5 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-black"
                    aria-hidden="true"
                >
                    $
                </span>
                <span className="text-sm font-semibold">{ui('sales', locale)}</span>
                <span className="text-muted-foreground font-mono text-xs">{campaigns.length}</span>
            </div>

            <p className="text-muted-foreground font-mono text-[11px] leading-relaxed">
                Spend {usd(stat.spend)} · Clicks {stat.linkClicks} · Inst {stat.installs} · Reg {stat.regs} · Sales{' '}
                {stat.sales}
            </p>

            <textarea
                readOnly
                value={idLine}
                aria-label="sales campaign ids"
                className="bg-background/60 h-10 w-full resize-y rounded-md border p-2 font-mono text-[11px]"
            />

            <Button
                type="button"
                variant="outline"
                size="sm"
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
