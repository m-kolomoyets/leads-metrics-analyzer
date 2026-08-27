import type { ReactNode } from 'react';

// One comparison: the same data, drawn the way it is drawn today and the way the redesign would draw
// it, stacked rather than side by side. The trajectory is a wide component — put in a column it
// renders at a shape neither version was designed for, and the comparison stops being fair.

type LaneProps = {
    label: string;
    children: ReactNode;
};

function Lane({ label, children }: LaneProps) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-muted-foreground text-xs font-medium tracking-widest uppercase">{label}</span>
            {children}
        </div>
    );
}

type PairProps = {
    title: string;
    note?: string;
    now: ReactNode;
    next: ReactNode;
};

function Pair({ title, note, now, next }: PairProps) {
    return (
        <section className="flex flex-col gap-4">
            <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                {note && <p className="text-muted-foreground mt-1 text-sm">{note}</p>}
            </div>
            <Lane label="Now">{now}</Lane>
            <Lane label="Next">{next}</Lane>
        </section>
    );
}

export { Pair };
