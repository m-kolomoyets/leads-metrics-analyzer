import type { WorldMapRegion } from '@/components/charts/WorldMap/types';
import type { MapFillMode } from '@/lib/domain/mapFill';
import type { HomePeriodToken } from './utils/period';

export const PERIOD_LABELS: Record<HomePeriodToken, string> = {
    month: 'This month',
    'last-month': 'Last month',
    custom: 'Custom',
};

export const REGION_LABELS: Record<WorldMapRegion, string> = {
    world: 'World',
    europe: 'Europe',
    asia: 'Asia',
    africa: 'Africa',
    'north-america': 'N. America',
    'south-america': 'S. America',
    oceania: 'Oceania',
};

// Plain words for the fill modes: what the wash's strength means, not how it is computed.
export const FILL_MODE_LABELS: Record<MapFillMode, string> = {
    profitability: 'Profitability',
    'profit-size': 'Profit size',
    presence: 'Presence',
};

export const FILL_MODE_HINTS: Record<MapFillMode, string> = {
    profitability: 'Colour only — every market at one strength',
    'profit-size': 'Stronger = bigger profit or loss',
    presence: 'Stronger = more spend',
};
