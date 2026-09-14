import type { RatingPeriod } from '@/lib/domain/offerRating';

export const DEFAULT_RATING_PERIOD: RatingPeriod = 'month';

export const RATING_PERIOD_LABELS: Record<RatingPeriod, string> = {
    week: 'Week',
    month: 'Month',
    '90d': '90 days',
    year: 'Year',
};
