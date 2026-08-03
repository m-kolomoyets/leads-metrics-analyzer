import type { Locale } from '@/components/report/utils/i18n';
import type { ReportCard } from '../../types';
import { Link } from '@tanstack/react-router';
import { ArrowUpRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ZONE_TEXT_CLASS } from '@/components/report/constants';
import { GeoStat } from '@/components/report/GeoStat';
import { pct, percent, usd, usdSigned } from '@/components/report/utils/format';
import { ui } from '@/components/report/utils/i18n';
import { roiZone, ZONE_TINT_CLASS } from '@/components/report/utils/zones';
import { Button } from '@/components/ui/Button';
import { toGeoRollup } from '../../utils/toGeoRollup';

type SnapshotCardProps = {
    card: ReportCard;
    locale: Locale;
};

// Push time as the reader's local clock. Only the time is shown — the DATE that matters is the report
// date, printed beside it, and showing two dates would invite reading the wrong one as performance.
const timeFormat = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });

function Figure({ label, value, className }: { label: string; value: string; className?: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px] tracking-widest uppercase">{label}</span>
            <span className={cn('font-mono text-base font-bold', className)}>{value}</span>
        </div>
    );
}

// One pushed Snapshot: the headline an overseer judges a whole report by, then one `GeoStat` row per
// market — exactly the figures the buyer saw, graded by the ruleset they pinned (spec story 10).
//
// The headline carries NO cost-per line by design: each Geo has its own Threshold Pairs, so a blended
// CPI has nothing to grade it against, and unique counts do not sum across Geos (domain gotchas).
function SnapshotCard({ card, locale }: SnapshotCardProps) {
    const { headline } = card;
    // Tinted by the ROI band, so a bad day is visible from across the room (spec story 9). A Snapshot
    // with no frozen rollup has no ROI to band and stays neutral.
    const tone = roiZone(headline?.roi ?? null);
    const profitClass = (headline?.profit ?? 0) >= 0 ? 'text-success' : 'text-danger';

    return (
        <article className={cn('glow-soft flex flex-col gap-4 rounded-2xl p-4', ZONE_TINT_CLASS[tone])}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex flex-col">
                    <span className="font-mono text-lg font-bold">{card.reportDate}</span>
                    <span className="text-muted-foreground text-[11px]">
                        {ui('pushed', locale)} {timeFormat.format(new Date(card.takenAt))}
                    </span>
                </div>

                <span className="bg-border h-9 w-px" />

                {headline ? (
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <Figure label="Spend" value={usd(headline.spendPlus)} />
                        <Figure
                            label={ui('geoTotal', locale)}
                            value={usd(headline.geoTotal)}
                            className={headline.geoTotal > 0 ? 'text-success' : 'text-muted-foreground'}
                        />
                        <Figure label="Profit" value={usdSigned(headline.profit)} className={profitClass} />
                        {/* `pct` and `percent`, the same two formatters the Geo header uses, so a card
                            figure and the row beneath it never read as different kinds of number. */}
                        <Figure label="ROI" value={pct(headline.roi)} className={ZONE_TEXT_CLASS[tone]} />
                        <Figure
                            label={ui('wasteTitle', locale)}
                            value={`${usd(headline.waste)} · ${percent(headline.wastePct)}`}
                        />
                    </div>
                ) : (
                    <p className="text-muted-foreground text-xs">{ui('cardNoRollup', locale)}</p>
                )}

                <span className="flex-1" />

                <Button
                    size="xs"
                    variant="ghost"
                    render={<Link to="/dashboard/report/$snapshotId" params={{ snapshotId: card.snapshotId }} />}
                >
                    {ui('openReport', locale)}
                    <ArrowUpRightIcon />
                </Button>
            </div>

            {card.geos.map((geo) => {
                return (
                    <div key={geo.geo} className="flex flex-col gap-2">
                        <GeoStat
                            geo={geo.geo}
                            rollup={toGeoRollup(geo)}
                            thresholds={geo.thresholds ?? undefined}
                            waste={geo.waste}
                            wasteZone={card.wasteZones ?? undefined}
                            locale={locale}
                        />
                        <Link
                            to="/dashboard/report/$snapshotId"
                            params={{ snapshotId: card.snapshotId }}
                            search={{ geo: geo.geo }}
                            className="text-muted-foreground hover:text-foreground self-end text-xs underline underline-offset-4"
                        >
                            {ui('openGeo', locale)} {geo.geo} →
                        </Link>
                    </div>
                );
            })}
        </article>
    );
}

export { SnapshotCard };
