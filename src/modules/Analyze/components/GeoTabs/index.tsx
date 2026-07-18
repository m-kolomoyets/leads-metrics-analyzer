import { cn } from '@/lib/utils/cn';

type GeoTabsProps = {
    geos: string[];
    active: string;
    onSelect: (geo: string) => void;
};

// Geo navigation: one tab per parsed geo. Selecting a tab reruns the per-geo view against that geo's
// preset (state lives in the parent). Roving focus is left to the browser — plain buttons in a tablist.
function GeoTabs({ geos, active, onSelect }: GeoTabsProps) {
    return (
        <div role="tablist" aria-label="Geo" className="flex flex-wrap gap-1 border-b">
            {geos.map((geo) => {
                const selected = geo === active;
                return (
                    <button
                        key={geo}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        className={cn(
                            '-mb-px border-b-2 px-3 py-1.5 text-sm font-medium transition-colors',
                            selected
                                ? 'border-primary text-foreground'
                                : 'text-muted-foreground hover:text-foreground border-transparent'
                        )}
                        onClick={() => {
                            onSelect(geo);
                        }}
                    >
                        {geo}
                    </button>
                );
            })}
        </div>
    );
}

export { GeoTabs };
