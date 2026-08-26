import { cn } from '@/lib/utils/cn';
import { hoursSince, kyivClock } from '@/lib/utils/kyivDay';

// The header's data age (SPEC §6.4): "data as of 12:04", muting itself after an hour to invite a
// refresh. The clock ticks client-side only — no polling and no automatic refresh, both rejected as
// needless server load: the team already works this way with their tracker.

// After this long without a new push, the label mutes and says what to do about it.
const MUTE_AFTER_HOURS = 1;

type DataAgeProps = {
    // The latest active push for the day being read; null when there is none.
    takenAt: string | null;
    // Passed in rather than read here, so the whole page ages off one clock.
    now: Date;
};

function DataAge({ takenAt, now }: DataAgeProps) {
    const instant = takenAt === null ? null : new Date(takenAt);

    if (!instant || Number.isNaN(instant.getTime())) {
        return <span className="text-muted-foreground text-xs">no data today</span>;
    }

    const muted = hoursSince(instant, now) >= MUTE_AFTER_HOURS;

    return (
        <span className={cn('text-xs', muted ? 'text-muted-foreground/60' : 'text-muted-foreground')}>
            data as of {kyivClock(instant)}
            {muted && ' · refresh to update'}
        </span>
    );
}

export { DataAge };
