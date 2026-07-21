import type { GeoRollup } from '@/lib/domain';
import type { GeoThresholds, ThresholdPair, Zone } from '@/lib/domain/types';
import type { Locale } from '../../utils/i18n';
import { zoneFor } from '@/lib/domain/verdict';
import { cn } from '@/lib/utils/cn';
import { ZONE_TEXT_CLASS } from '../../constants';
import { cost, flagEmoji, pct, usd } from '../../utils/format';
import { ui } from '../../utils/i18n';

type GeoStatProps = {
    geo: string;
    rollup: GeoRollup;
    // Grades the header CPC/CPI/CPR/CPS line by band; undefined (no preset) → plain neutral.
    thresholds: GeoThresholds | undefined;
    // Σ Spend⁺ wasted over the geo's included red campaigns (from the account roll-ups).
    waste: number;
    // The active preset's Waste Zones band (% of Spend⁺), or undefined when the geo has no preset.
    wasteZone: ThresholdPair | undefined;
    locale: Locale;
};

// Reference ROI bands (fixed, unlike the tunable cost zones): loss → red, thin → yellow, healthy → green.
function roiTone(roi: number | null): Zone {
    if (roi === null) {
        return 'neutral';
    }
    if (roi < -20) {
        return 'red';
    }
    return roi <= 30 ? 'yellow' : 'green';
}

// The glass-tint classes for a zone (index.css). Neutral keeps the plain blue tint.
const TONE_TINT: Record<Zone, string> = {
    green: 'glass-tint tint-green',
    yellow: 'glass-tint tint-yellow',
    red: 'glass-tint tint-red',
    neutral: 'glass-tint tint-blue tint-s5',
};

// A band-tinted CPC/CPI/CPR/CPS value, mirroring the reference `<Metric>`.
function Metric({ value, pair }: { value: number | null; pair: ThresholdPair | undefined }) {
    const graded = value !== null && pair;
    const tone: Zone = graded ? zoneFor(value, pair) : 'neutral';
    return (
        <span className={cn('font-mono', graded ? ZONE_TEXT_CLASS[tone] : 'text-muted-foreground')}>
            ${cost(value)}
        </span>
    );
}

function Stat({
    label,
    value,
    size,
    className,
}: {
    label: string;
    value: string;
    size: 'md' | 'lg';
    className?: string;
}) {
    return (
        <div className="flex flex-col">
            <span className="text-muted-foreground text-[11px] tracking-widest uppercase">{label}</span>
            <span className={cn('font-mono font-bold', size === 'lg' ? 'text-2xl' : 'text-xl', className)}>
                {value}
            </span>
        </div>
    );
}

// The market-level hero (S4): a blue-tinted glass panel with the geo label + graded cost line, then two
// glowing stat pills — Spend/Revenue/Profit/ROI (glow tinted by the ROI band) and the waste readout
// (glow tinted by its Waste-Zone band). Attributed / untagged gap (ADR-0003) rides under the first pill.
function GeoStat({ geo, rollup, thresholds, waste, wasteZone, locale }: GeoStatProps) {
    const { metrics } = rollup;
    const wastePct = metrics.spendPlus > 0 ? (waste / metrics.spendPlus) * 100 : 0;
    const wasteTone: Zone = wasteZone ? zoneFor(wastePct, wasteZone) : 'neutral';
    const roi = roiTone(metrics.roi);

    return (
        <section className="glass-tint tint-blue tint-s5 flex flex-col gap-4 rounded-2xl p-4">
            <div className="flex flex-wrap items-center gap-4">
                <span className="text-2xl font-bold">
                    {flagEmoji(geo)} {geo}
                </span>
                <span className="bg-border h-9 w-px" />
                <span className="text-muted-foreground text-sm">
                    CPC <Metric value={metrics.cpc} pair={thresholds?.clicks} /> · CPI{' '}
                    <Metric value={metrics.cpi} pair={thresholds?.installs} /> · CPR{' '}
                    <Metric value={metrics.cpr} pair={thresholds?.regs} /> · CPS{' '}
                    <Metric value={metrics.cps} pair={thresholds?.sales} />
                </span>
            </div>

            <div className="flex flex-wrap gap-4">
                <div
                    className={cn(
                        'glow-soft flex min-w-64 flex-1 flex-col gap-3 rounded-2xl px-5 py-4',
                        TONE_TINT[roi]
                    )}
                >
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                        <Stat label="Spend" value={usd(metrics.spendPlus)} size="md" />
                        <Stat
                            label={ui('geoTotal', locale)}
                            value={usd(metrics.revenue)}
                            size="md"
                            className={metrics.revenue > 0 ? 'text-success' : 'text-muted-foreground'}
                        />
                        <Stat
                            label="Profit"
                            value={`${metrics.profit >= 0 ? '+' : '−'}${usd(Math.abs(metrics.profit))}`}
                            size="lg"
                            className={metrics.profit >= 0 ? 'text-success' : 'text-danger'}
                        />
                        <Stat label="ROI" value={pct(metrics.roi)} size="lg" className={ZONE_TEXT_CLASS[roi]} />
                    </div>
                </div>

                <div
                    className={cn(
                        'glow-soft flex min-w-64 flex-1 items-center gap-6 rounded-2xl px-5 py-4',
                        TONE_TINT[wasteTone]
                    )}
                >
                    <Stat
                        label={ui('wasteTitle', locale)}
                        value={usd(waste)}
                        size="lg"
                        className={ZONE_TEXT_CLASS[wasteTone]}
                    />
                    <Stat
                        label={ui('wastePctOfSpend', locale)}
                        value={`${wastePct.toFixed(1)}%`}
                        size="lg"
                        className={ZONE_TEXT_CLASS[wasteTone]}
                    />
                    <span className="flex-1" />
                    {wasteZone && (
                        <div className="text-muted-foreground text-right text-[10px] leading-relaxed">
                            {ui('wasteZone', locale)}:
                            <br />
                            <span className={ZONE_TEXT_CLASS.green}>&lt;{wasteZone.gy}%</span> ·{' '}
                            <span className={ZONE_TEXT_CLASS.yellow}>
                                {wasteZone.gy}–{wasteZone.yr}%
                            </span>{' '}
                            · <span className={ZONE_TEXT_CLASS.red}>&gt;{wasteZone.yr}%</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export { GeoStat };
