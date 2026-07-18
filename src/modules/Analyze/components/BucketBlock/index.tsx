import type { CampaignRollup } from '@/lib/domain/accounts';
import type { BucketZone } from '../../constants';
import type { Locale } from '../../utils/i18n';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { ZONE_ACCENT_CLASS, ZONE_CARD_CLASS, ZONE_GLYPH } from '../../constants';
import { actionLabel, ui } from '../../utils/i18n';

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
            <div className="flex items-center gap-2">
                <span
                    className={cn(
                        'flex size-5 items-center justify-center rounded-full text-[10px] font-bold text-black',
                        ZONE_ACCENT_CLASS[zone]
                    )}
                    aria-hidden="true"
                >
                    {ZONE_GLYPH[zone]}
                </span>
                <span className="text-sm font-semibold">{actionLabel(zone, locale)}</span>
                <span className="text-muted-foreground font-mono text-xs">{campaigns.length}</span>
            </div>

            <textarea
                readOnly
                value={idLine}
                aria-label={`${actionLabel(zone, locale)} campaign ids`}
                className="bg-background/60 h-14 w-full resize-y rounded-md border p-2 font-mono text-[11px]"
            />

            <Button
                type="button"
                variant="outline"
                size="sm"
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
