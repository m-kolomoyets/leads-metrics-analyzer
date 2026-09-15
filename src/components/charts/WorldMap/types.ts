import type { ChartTone } from '../types';
import type { WORLD_MAP_REGIONS } from './constants';

export type WorldMapRegion = (typeof WORLD_MAP_REGIONS)[number];

// One line of the hover card: a label and an already-formatted value. The primitive prints what it
// is handed and knows nothing about money, ROI or buyers (ADR-0025).
type WorldMapTooltipRow = {
    label: string;
    value: string;
    // Paints the value; absent means the muted default.
    tone?: ChartTone;
};

type WorldMapTooltip = {
    title: string;
    rows: WorldMapTooltipRow[];
};

// A country the caller has something to say about. Anything not listed is drawn as outline only.
export type WorldMapCountry = {
    // ISO 3166-1 alpha-2, upper case.
    code: string;
    // Paints the stroke at full strength and the fill as a wash.
    tone: ChartTone;
    // Scales the wash (0–1) between the faintest and the strongest wash the theme allows; absent
    // paints the flat default. The caller ranks (a fill mode, slice 15), the map only shades.
    fillWeight?: number;
    tooltip: WorldMapTooltip;
};

// Shapes ship; the dot grid is an experiment on the Design System page (slice 17) and not a mode a
// page picks yet.
export type WorldMapRender = 'shapes' | 'dots';

export type WorldMapProps = {
    countries: WorldMapCountry[];
    // The panel's labels, in the caller's language — the keys are the primitive's, the words are not.
    regionLabels: Record<WorldMapRegion, string>;
    // The name shown for an outline-only country under the pointer, from the atlas's own English
    // names; a caller with better names passes them here, keyed by code.
    countryNames?: Record<string, string>;
    render?: WorldMapRender;
    // Dims the whole plot while a new period loads, so the old map stays legible underneath.
    isStale?: boolean;
    // The country drawn as chosen — a heavier stroke, a fuller wash. Only a listed country can be
    // chosen: an outline has nothing to open.
    selectedCode?: string | null;
    // Fired on a click on a listed country; drag and wheel never reach it. The caller owns the
    // selection (a URL param, say) and hands it back as `selectedCode`.
    onSelect?: (code: string) => void;
    className?: string;
};
