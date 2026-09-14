import type { OffersSearch } from '../../schemas';

export type OfferFilterOption = {
    value: string;
    label: string;
};

export type OffersFiltersProps = {
    search: OffersSearch;
    onChange: (next: OffersSearch) => void;
    teams: OfferFilterOption[];
    buyers: OfferFilterOption[];
};
