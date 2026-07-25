import type { CampaignRollup } from '@/lib/domain/accounts';
import type { BucketZone } from '../../constants';
import type { Locale } from '../../utils/i18n';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { ZONE_BUTTON_CLASS, ZONE_CARD_CLASS, ZONE_GLYPH } from '../../constants';
import { actionLabel, ui } from '../../utils/i18n';
import { Pill } from '../Pill';

type BucketBlockProps = {
    zone: BucketZone;
    campaigns: CampaignRollup[];
    locale: Locale;
    copiedKey: string;
    onCopy: (text: string, key: string) => void;
    copyKey: string;
};

// One action bucket (СТОП / ТРИМАЄМО / БУСТ) under an Account: a zone-tinted glass panel with the
// bucket pill + campaign count and a one-click copy of every campaign id in it.
function BucketBlock({ zone, campaigns, locale, copiedKey, onCopy, copyKey }: BucketBlockProps) {
    const idLine = campaigns
        .map((campaign) => {
            return campaign.campaign;
        })
        .join(', ');

    return (
        <div
            className={cn(
                'flex min-w-48 flex-1 flex-col gap-3 rounded-xl border p-3 backdrop-blur',
                ZONE_CARD_CLASS[zone]
            )}
        >
            <Pill color={zone} glyph={ZONE_GLYPH[zone]} label={actionLabel(zone, locale)} count={campaigns.length} />

            <textarea
                readOnly
                value={idLine}
                aria-label={`${actionLabel(zone, locale)} campaign ids`}
                className="bg-background/60 min-h-14 w-full flex-1 resize-none rounded-md border p-2 font-mono text-[11px]"
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
