import type { HomePeriod } from './utils/period';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json' with { type: 'json' };
import { countryRollup } from '@/lib/domain/periodRollup';
import { kyivDay } from '@/lib/utils/kyivDay';
import { homeGeoQueryOptions } from '@/services/home/queries';
import { WorldMap } from '@/components/charts/WorldMap';
import {
    MainLayoutHeader,
    MainLayoutHeaderActions,
    MainLayoutHeaderTitle,
} from '@/components/layouts/MainLayoutHeader';
import { Loader } from '@/components/ui/Loader';
import { REGION_LABELS } from './constants';
import { toMapCountries } from './utils/mapCountries';
import { resolvePeriod } from './utils/period';
import { MapLegend } from './components/MapLegend';
import { PeriodPicker } from './components/PeriodPicker';

const routeApi = getRouteApi('/_authenticated/home/');

// The tooltip names a market in full; the atlas's own labels abbreviate ("W. Sahara", "Dem. Rep.
// Congo"). Registering twice is harmless — the parser registers the same table for its own reason.
countries.registerLocale(enLocale);

const countryName = (geo: string): string => {
    return countries.getName(geo, 'en') ?? geo;
};

const periodFormat = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'short' });

const periodLabel = (from: string, to: string): string => {
    return `${periodFormat.format(new Date(`${from}T00:00:00Z`))} — ${periodFormat.format(new Date(`${to}T00:00:00Z`))}`;
};

// Home (offers-and-home/13, PRD stories 46–53): the period's geography in one look. The server hands
// back the frozen Geo Rollups within the viewer's row-scope — a buyer's own pushes, a lead's team,
// everyone's for bdm and head — and `countryRollup` picks each buyer's latest push per day and sums
// per market (ADR-0004). The map is a chart primitive that knows none of this (ADR-0025): what it
// gets is a tone per country and the words for its hover card.
function Home() {
    const search = routeApi.useSearch();
    const navigate = routeApi.useNavigate();
    // Which month "this month" is, is a Kyiv question (ADR-0017), answered viewer-side so the server
    // only ever sees two dates.
    const today = kyivDay();
    const period: HomePeriod = { range: search.range, from: search.from, to: search.to };
    const resolved = resolvePeriod(period, today);

    // The previous period stays on screen, dimmed, until the new one lands: a suspending read would
    // take the picker down with it, and the picker is what the reader is standing on.
    const { data, isPending, isPlaceholderData } = useQuery({
        ...homeGeoQueryOptions(resolved),
        placeholderData: keepPreviousData,
    });
    const rows = data ? countryRollup(data) : [];
    const mapCountries = toMapCountries(rows, countryName);

    function handlePeriodChange(next: HomePeriod) {
        navigate({ search: next, replace: true });
    }

    return (
        <>
            <MainLayoutHeader>
                <MainLayoutHeaderTitle meta={periodLabel(resolved.from, resolved.to)}>Home</MainLayoutHeaderTitle>
                <MainLayoutHeaderActions>
                    <PeriodPicker period={period} onChange={handlePeriodChange} />
                </MainLayoutHeaderActions>
            </MainLayoutHeader>

            <div className="flex flex-col gap-3">
                <WorldMap
                    countries={mapCountries}
                    regionLabels={REGION_LABELS}
                    isStale={isPlaceholderData}
                    className="w-full"
                />

                <div className="flex flex-wrap items-center justify-between gap-2">
                    <MapLegend />
                    {isPending && <Loader />}
                    {!isPending && rows.length === 0 && (
                        <p className="text-muted-foreground text-xs">No reports in this period.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export { Home };
