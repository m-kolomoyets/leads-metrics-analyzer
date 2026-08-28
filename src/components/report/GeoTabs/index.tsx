import { flagEmoji } from '@/lib/utils/flagEmoji';
import { usdRound } from '@/components/report/utils/format';
import { Segmented, SegmentedItem } from '@/components/ui/Segmented';

type GeoTabsProps = {
    geos: string[];
    active: string;
    // Spend⁺ per geo, mono-stamped on each tab like the reference nav.
    spendByGeo?: Record<string, number>;
    onSelect: (geo: string) => void;
};

// Geo navigation: one tab per parsed geo. It is the app's one row-of-choices control (`ui/Segmented`),
// so the selected geo reads as a wash rather than as a bordered or accent-filled chip — the figures
// under it are the page. Selecting reruns the per-geo view (state lives in the parent).
function GeoTabs({ geos, active, spendByGeo, onSelect }: GeoTabsProps) {
    return (
        <Segmented label="Geo">
            {geos.map((geo) => {
                const spend = spendByGeo?.[geo];
                const flag = flagEmoji(geo);
                return (
                    <SegmentedItem
                        key={geo}
                        selected={geo === active}
                        onSelect={() => {
                            onSelect(geo);
                        }}
                    >
                        {flag && (
                            <span aria-hidden={true} className="text-base">
                                {flag}
                            </span>
                        )}
                        {geo}
                        {spend !== undefined && (
                            <span className="text-muted-foreground text-xs tabular-nums">{usdRound(spend)}</span>
                        )}
                    </SegmentedItem>
                );
            })}
        </Segmented>
    );
}

export { GeoTabs };
