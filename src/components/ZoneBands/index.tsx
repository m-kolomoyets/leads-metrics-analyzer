import { cn } from '@/lib/utils/cn';
import { ZoneSign } from '@/components/ZoneSign';

type ZoneBandsProps = {
    // The two bounds, already in the metric's own units.
    greenBelow: number;
    redAbove: number;
    // How a bound reads. Percent bands pass a percent formatter; money passes money.
    format: (value: number) => string;
    // Zone names in the reader's language, for the dots' hover titles.
    greenLabel: string;
    yellowLabel: string;
    redLabel: string;
    className?: string;
};

// The band as it is READ: ● < 8 % ● ≤ 14 % < ●. The same sentence `ZoneRangeInput` sets, minus the
// fields — so the plan looks the same whether the reader is editing it in Analyze or meeting it
// frozen on a report. The dot is the zone; spelling "green / yellow / red" beside a colour the app
// already speaks in colour everywhere else only made the line longer.
function ZoneBands({ greenBelow, redAbove, format, greenLabel, yellowLabel, redLabel, className }: ZoneBandsProps) {
    return (
        <div
            className={cn('text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm tabular-nums', className)}
        >
            <ZoneSign zone="green" label={greenLabel} sign="<" />
            <span>{format(greenBelow)}</span>
            <ZoneSign zone="yellow" label={yellowLabel} sign="≤" className="ml-0.5" />
            <span>{format(redAbove)}</span>
            <ZoneSign zone="red" label={redLabel} sign="<" signFirst={true} />
        </div>
    );
}

export { ZoneBands };
