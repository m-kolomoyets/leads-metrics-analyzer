import type { BucketZone } from '@/components/report/constants';
import type { Locale } from '@/components/report/utils/i18n';
import type { CampaignRollup } from '@/lib/domain/accounts';
import { cn } from '@/lib/utils/cn';
import { ZONE_BUTTON_CLASS, ZONE_GLYPH, ZONE_PANEL_CLASS } from '@/components/report/constants';
import { actionLabel, ui } from '@/components/report/utils/i18n';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '../StatusChip';

type BucketBlockProps = {
    zone: BucketZone;
    campaigns: CampaignRollup[];
    locale: Locale;
    copiedKey: string;
    onCopy: (text: string, key: string) => void;
    copyKey: string;
};

// One action bucket (СТОП / ТРИМАЄМО / БУСТ) under an Account: a panel hairlined in its zone over a
// trace of the same, with the bucket chip + campaign count and a one-click copy of every campaign id
// in it. Tinted so the row of four — three buckets and the violet sales block — reads as four
// purposes rather than four identical grey cards.
function BucketBlock({ zone, campaigns, locale, copiedKey, onCopy, copyKey }: BucketBlockProps) {
    const idLine = campaigns
        .map((campaign) => {
            return campaign.campaign;
        })
        .join(', ');

    return (
        <div className={cn('flex min-w-0 flex-col gap-3 rounded-md border p-3', ZONE_PANEL_CLASS[zone])}>
            <StatusChip
                zone={zone}
                glyph={ZONE_GLYPH[zone]}
                label={actionLabel(zone, locale)}
                count={campaigns.length}
            />

            <textarea
                readOnly
                value={idLine}
                aria-label={`${actionLabel(zone, locale)} campaign ids`}
                className="bg-background border-border min-h-14 w-full flex-1 resize-none rounded-sm border p-2 text-xs"
            />

            <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn('mt-auto', ZONE_BUTTON_CLASS[zone])}
                disabled={campaigns.length === 0}
                onClick={() => {
                    onCopy(idLine, copyKey);
                }}
            >
                {copiedKey === copyKey ? ui('copied', locale) : ui('copyIds', locale)}
            </Button>
        </div>
    );
}

export { BucketBlock };
