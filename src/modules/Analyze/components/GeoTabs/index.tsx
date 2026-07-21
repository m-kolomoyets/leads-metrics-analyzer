import { cn } from '@/lib/utils/cn';

type GeoTabsProps = {
    geos: string[];
    active: string;
    // Spend⁺ per geo, mono-stamped on each tab like the reference nav.
    spendByGeo?: Record<string, number>;
    onSelect: (geo: string) => void;
};

// Geo navigation (reference nav): one glass pill per parsed geo. The active pill takes the blue
// gradient + glow; the rest stay ghost. Selecting reruns the per-geo view (state lives in the parent).
function GeoTabs({ geos, active, spendByGeo, onSelect }: GeoTabsProps) {
    return (
        <div role="tablist" aria-label="Geo" className="flex flex-wrap gap-2">
            {geos.map((geo) => {
                const selected = geo === active;
                const spend = spendByGeo?.[geo];
                return (
                    <button
                        key={geo}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        className={cn(
                            'rounded-lg border px-3.5 py-2 text-sm transition-colors',
                            selected
                                ? 'surface-accent border-primary font-bold text-white'
                                : 'text-muted-foreground hover:text-foreground border-border bg-transparent'
                        )}
                        onClick={() => {
                            onSelect(geo);
                        }}
                    >
                        {geo}
                        {spend !== undefined && (
                            <span className="ml-1.5 font-mono text-[11px] opacity-80">${spend.toFixed(0)}</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export { GeoTabs };
