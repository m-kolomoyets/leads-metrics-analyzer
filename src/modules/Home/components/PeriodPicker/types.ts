import type { HomePeriod } from '../../utils/period';

export type PeriodPickerProps = {
    period: HomePeriod;
    onChange: (next: HomePeriod) => void;
};
