import type { MapFillMode } from '@/lib/domain/mapFill';
import type { HomePeriod } from './utils/period';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json' with { type: 'json' };
import { fillWeights } from '@/lib/domain/mapFill';
import { countryBuyers, countryRollup } from '@/lib/domain/periodRollup';
import { cn } from '@/lib/utils/cn';
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
import { periodLabel } from './utils/format';
import { toMapCountries } from './utils/mapCountries';
import { resolvePeriod } from './utils/period';
import { CountryPanel } from './components/CountryPanel';
import { FillModePicker } from './components/FillModePicker';
import { MapLegend } from './components/MapLegend';
import { PeriodPicker } from './components/PeriodPicker';

const routeApi = getRouteApi('/_authenticated/home/');

// The tooltip names a market in full; the atlas's own labels abbreviate ("W. Sahara", "Dem. Rep.
// Congo"). Registering twice is harmless — the parser registers the same table for its own reason.
countries.registerLocale(enLocale);

const countryName = (geo: string): string => {
    return countries.getName(geo, 'en') ?? geo;
};

// Home (offers-and-home/13, PRD stories 46–53): the period's geography in one look. The server hands
// back the frozen Geo Rollups within the viewer's row-scope — a buyer's own pushes, a lead's team,
// everyone's for bdm and head — and `countryRollup` picks each buyer's latest push per day and sums
// per market (ADR-0004). The map is a chart primitive that knows none of this (ADR-0025): what it
// gets is a tone per country and the words for its hover card. A click on a market opens it beside
// the map (slice 14) — the same rollup, split by buyer — and the choice lives in the URL, as does
// the fill mode (slice 15): colour is always the zone, a mode only ranks the wash's strength.
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
    const mapCountries = toMapCountries(rows, countryName, fillWeights(rows, search.mode));
    const selected = search.country ?? null;

    function handlePeriodChange(next: HomePeriod) {
        // The period is replaced whole (a preset carries no `from`/`to`); the opened country and
        // the fill mode stay.
        navigate({
            search: (previous) => {
                return { country: previous.country, mode: previous.mode, ...next };
            },
            replace: true,
        });
    }

    function handleSelect(country: string | null) {
        navigate({
            search: (previous) => {
                return { ...previous, country: country ?? undefined };
            },
            replace: true,
        });
    }

    function handleModeChange(mode: MapFillMode) {
        navigate({
            search: (previous) => {
                return { ...previous, mode };
            },
            replace: true,
        });
    }

    function handleClose() {
        handleSelect(null);
    }

    function renderPanel() {
        if (selected === null) {
            return null;
        }

        // The panel's rows come off the rows the map was painted from: one read, two views of it.
        const nicknames = new Map(
            (data?.snapshots ?? []).map((row) => {
                return [row.buyerUserId, row.buyerNickname] as const;
            })
        );
        const buyers = (data ? countryBuyers(data, selected) : []).map((row) => {
            return { ...row, nickname: nicknames.get(row.buyerUserId) ?? row.buyerUserId };
        });
        const market = rows.find((row) => {
            return row.geo === selected;
        });

        return (
            <CountryPanel
                geo={selected}
                name={countryName(selected)}
                market={market}
                buyers={buyers}
                isLoading={isPending}
                onClose={handleClose}
            />
        );
    }

    return (
        <>
            <MainLayoutHeader>
                <MainLayoutHeaderTitle meta={periodLabel(resolved.from, resolved.to)}>Home</MainLayoutHeaderTitle>
                <MainLayoutHeaderActions>
                    <PeriodPicker period={period} onChange={handlePeriodChange} />
                </MainLayoutHeaderActions>
            </MainLayoutHeader>

            <div className={cn('grid gap-3', selected !== null && 'lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)]')}>
                <div className="lg:col-span-full">
                    <FillModePicker mode={search.mode} onChange={handleModeChange} />
                </div>

                <WorldMap
                    countries={mapCountries}
                    regionLabels={REGION_LABELS}
                    isStale={isPlaceholderData}
                    selectedCode={selected}
                    onSelect={handleSelect}
                    className="w-full min-w-0"
                />

                {renderPanel()}

                <div className="flex flex-wrap items-center justify-between gap-2 lg:col-span-full">
                    <MapLegend mode={search.mode} />
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
