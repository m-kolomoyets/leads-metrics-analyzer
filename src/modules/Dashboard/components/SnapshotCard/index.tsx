import type { Locale } from '@/components/report/utils/i18n';
import type { ReportCard } from '../../types';
import { Link } from '@tanstack/react-router';
import { ArrowUpRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { GeoStat } from '@/components/report/GeoStat';
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

// One pushed Snapshot: its dates, a link into the detailed report, and one `GeoStat` row per market —
// exactly the figures the buyer saw, graded by the ruleset they pinned (spec story 10).
//
// The card prints no figures of its own. Every number it could show is already in the `GeoStat` rows
// below it, and a summed copy sitting above them reads as a second, subtly different set of numbers.
// The summed headline survives only as the card's ROI tint, which is a colour rather than a figure.
function SnapshotCard({ card, locale }: SnapshotCardProps) {
    const { headline } = card;
    // Tinted by the ROI summed across the Snapshot's Geos, so a bad day is visible from across the
    // room (spec story 9). A Snapshot with no frozen rollup has no ROI to band and stays neutral.
    const tone = roiZone(headline?.roi ?? null);

    return (
        <article className={cn('glow-soft flex flex-col gap-4 rounded-2xl p-4', ZONE_TINT_CLASS[tone])}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex flex-col">
                    <span className="font-mono text-lg font-bold">{card.reportDate}</span>
                    <span className="text-muted-foreground text-[11px]">
                        {ui('pushed', locale)} {timeFormat.format(new Date(card.takenAt))}
                    </span>
                </div>

                {/* The only thing the header still says about the numbers: that there are none. A
                    pre-ADR-0015 Snapshot froze no rollup, so it renders no Geo rows either, and
                    without this line the card would read as an empty day rather than an unreadable
                    one (spec story 35). */}
                {!headline && <p className="text-muted-foreground text-xs">{ui('cardNoRollup', locale)}</p>}

                <span className="flex-1" />

                {/* Accented, not ghost: opening the detailed report is the one thing a reader does
                    from this card, and everything around it is a number rather than a control. */}
                <Button render={<Link to="/dashboard/report/$snapshotId" params={{ snapshotId: card.snapshotId }} />}>
                    {ui('openReport', locale)}
                    <ArrowUpRightIcon />
                </Button>
            </div>

            {card.geos.map((geo) => {
                return (
                    <GeoStat
                        key={geo.geo}
                        geo={geo.geo}
                        rollup={toGeoRollup(geo)}
                        thresholds={geo.thresholds ?? undefined}
                        waste={geo.waste}
                        wasteZone={card.wasteZones ?? undefined}
                        // The per-Geo entry point lives in the panel's own header, beside the market it
                        // belongs to — a link floating under the panel had to name its Geo again to say
                        // which market it opened.
                        action={
                            <Button
                                size="sm"
                                render={
                                    <Link
                                        to="/dashboard/report/$snapshotId"
                                        params={{ snapshotId: card.snapshotId }}
                                        search={{ geo: geo.geo }}
                                    />
                                }
                            >
                                {ui('openGeo', locale)}
                                <ArrowUpRightIcon />
                            </Button>
                        }
                        locale={locale}
                    />
                );
            })}
        </article>
    );
}

export { SnapshotCard };
