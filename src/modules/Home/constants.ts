import type { WorldMapRegion } from '@/components/charts/WorldMap/types';
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
