import type { BuyerRating } from '@/lib/domain/periodRollup';

export type MyStatsProps = {
    // The viewer's own rating row; absent when they pushed nothing in the period.
    stats: BuyerRating | undefined;
    isLoading?: boolean;
};
