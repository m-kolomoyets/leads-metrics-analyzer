import type { GeoRollup } from '@/lib/domain';
import type { ThresholdPair } from '@/lib/domain/types';
import type { Locale } from '../../utils/i18n';
import { zoneFor } from '@/lib/domain/verdict';
import { cn } from '@/lib/utils/cn';
import { ZONE_CARD_CLASS, ZONE_TEXT_CLASS } from '../../constants';
import { pct, usd } from '../../utils/format';
import { ui } from '../../utils/i18n';

type GeoStatProps = {
    rollup: GeoRollup;
    // Σ Spend⁺ wasted over the geo's included red campaigns (from the account roll-ups).
    waste: number;
    // The active preset's Waste Zones band (% of Spend⁺), or undefined when the geo has no preset.
    wasteZone: ThresholdPair | undefined;
    locale: Locale;
};

function Stat({ label, value, className }: { label: string; value: string; className?: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px] tracking-wide uppercase">{label}</span>
            <span className={cn('font-mono text-lg font-bold', className)}>{value}</span>
        </div>
    );
}

// The market-level totals (S4): the Geo Total (Spend⁺ / Revenue / Profit / ROI, untagged included),
// the Attributed figures beside it, and the honest gap between them (ADR-0003) — untagged revenue is
// real money, shown, not hidden. A second card grades the geo's waste against its Waste Zone band.
function GeoStat({ rollup, waste, wasteZone, locale }: GeoStatProps) {
    const { metrics, attributed } = rollup;
    // Untagged = the deliberate divergence: Geo Total minus Attributed (revenue FB failed to tag).
    const untaggedRevenue = metrics.revenue - attributed.revenue;
    const wastePct = metrics.spendPlus > 0 ? (waste / metrics.spendPlus) * 100 : 0;
    const wasteZoneGrade = wasteZone ? zoneFor(wastePct, wasteZone) : 'neutral';

    return (
        <div className="flex flex-col gap-3 lg:flex-row">
            <div
                className={cn(
                    'flex flex-1 flex-col gap-3 rounded-xl border p-4',
                    ZONE_CARD_CLASS[metrics.roi !== null && metrics.roi >= 0 ? 'green' : 'red']
                )}
            >
                <div className="flex flex-wrap gap-x-8 gap-y-3">
                    <Stat label="Spend" value={usd(metrics.spend)} />
                    <Stat label={ui('geoTotal', locale)} value={usd(metrics.revenue)} className="text-green-500" />
                    <Stat
                        label="Profit"
                        value={`${metrics.profit >= 0 ? '+' : '−'}${usd(Math.abs(metrics.profit))}`}
                        className={metrics.profit >= 0 ? 'text-green-500' : 'text-red-500'}
                    />
                    <Stat
                        label="ROI"
                        value={pct(metrics.roi)}
                        className={metrics.roi !== null && metrics.roi >= 0 ? 'text-green-500' : 'text-red-500'}
                    />
                </div>
                <div className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-1 text-xs">
                    <span>
                        {ui('attributed', locale)}: <span className="font-mono">{usd(attributed.revenue)}</span>
                    </span>
                    {untaggedRevenue > 0.01 && (
                        <span>
                            {ui('untaggedGap', locale)}: <span className="font-mono">{usd(untaggedRevenue)}</span>
                        </span>
                    )}
                </div>
                <p className="text-muted-foreground text-[10px]">{ui('divergenceNote', locale)}</p>
            </div>

            <div className={cn('flex flex-col gap-1 rounded-xl border p-4', ZONE_CARD_CLASS[wasteZoneGrade])}>
                <span className="text-muted-foreground text-[10px] tracking-wide uppercase">
                    {ui('wasteTitle', locale)}
                </span>
                <span className={cn('font-mono text-2xl font-bold', ZONE_TEXT_CLASS[wasteZoneGrade])}>
                    {usd(waste)}
                </span>
                <span className="text-muted-foreground text-xs">
                    {ui('wastePctOfSpend', locale)}: <span className="font-mono">{wastePct.toFixed(1)}%</span>
                </span>
                {wasteZone && (
                    <span className="text-muted-foreground text-[10px]">
                        {ui('wasteZone', locale)}: {wasteZone.gy}% / {wasteZone.yr}%
                    </span>
                )}
            </div>
        </div>
    );
}

export { GeoStat };
