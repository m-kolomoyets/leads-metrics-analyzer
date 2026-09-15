import type { BuyerRating, RatingSort } from '@/lib/domain/periodRollup';

// A rating row with the name to print it under.
export type BuyerRatingRow = BuyerRating & {
    nickname: string;
};

export type BuyerRatingProps = {
    rows: BuyerRatingRow[];
    sort: RatingSort;
    onSortChange: (next: RatingSort) => void;
    // The first read of the period is still out.
    isLoading?: boolean;
};
