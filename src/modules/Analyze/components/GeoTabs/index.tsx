import { cn } from '@/lib/utils/cn';

// ISO-2 → flag emoji via Unicode regional-indicator offset. Returns null for anything that is not two
// A–Z letters (unknown/aggregate geo), so the label falls back to the raw code.
function flagEmoji(geo: string): string | null {
    if (!/^[A-Za-z]{2}$/.test(geo)) {
        return null;
    }
    const base = 0x1f1e6 - 0x41; // regional indicator 'A' minus ASCII 'A'
    const code = geo.toUpperCase();
    return String.fromCodePoint(base + code.charCodeAt(0), base + code.charCodeAt(1));
}

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
                const flag = flagEmoji(geo);
                return (
                    <button
                        key={geo}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        className={cn(
                            'rounded-lg border px-3.5 py-2 text-sm transition-colors flex items-center',
                            selected
                                ? 'surface-accent border-primary font-bold text-white'
                                : 'text-muted-foreground hover:text-foreground border-border bg-transparent'
                        )}
                        onClick={() => {
                            onSelect(geo);
                        }}
                    >
                        {flag && (
                            <span aria-hidden={true} className="mr-1.5 text-lg">
                                {flag}
                            </span>
                        )}
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
