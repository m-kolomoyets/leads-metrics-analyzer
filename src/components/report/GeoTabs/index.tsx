import { cn } from '@/lib/utils/cn';
import { usdRound } from '@/components/report/utils/format';

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

// Geo navigation: one square-cornered tab per parsed geo on the chrome surface. Selection is the
// one thing here that earns the accent; the rest rest achromatic. Selecting reruns the per-geo view
// (state lives in the parent).
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
                            'flex items-center rounded-md border px-3 py-1.5 text-sm font-medium motion-safe:transition-colors motion-safe:duration-150',
                            selected
                                ? 'border-accent bg-accent text-accent-foreground'
                                : 'text-muted-foreground hover:text-foreground border-border bg-surface'
                        )}
                        onClick={() => {
                            onSelect(geo);
                        }}
                    >
                        {flag && (
                            <span aria-hidden={true} className="mr-1.5 text-base">
                                {flag}
                            </span>
                        )}
                        {geo}
                        {spend !== undefined && (
                            <span className="ml-1.5 tabular-nums opacity-80">{usdRound(spend)}</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export { GeoTabs };
