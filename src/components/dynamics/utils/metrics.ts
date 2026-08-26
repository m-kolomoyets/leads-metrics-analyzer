import type { DynamicsFigures, DynamicsMetric } from '@/lib/domain/dynamics';
import { cost, costSigned, DASH, pct, usd, usdRound, usdSigned } from '@/components/report/utils/format';

// One place the Dynamics surfaces agree on what a metric is called, where its figure lives and how it
// reads. The comparison panel, the chart, its tooltip, the sparklines and the one-push metric tiles
// all go through here, so a CPI can never be a bare number on one surface and a dollar amount on the
// next — and so `spend` means Spend⁺ everywhere, which is the only spend a frozen rollup ever kept.

export const METRIC_LABEL: Record<DynamicsMetric, string> = {
    spend: 'Spend',
    revenue: 'Revenue',
    profit: 'Profit',
    roi: 'ROI',
    cpi: 'CPI',
    cpr: 'CPR',
    cps: 'CPS',
    cpc: 'CPC',
};

// Where a metric’s figure sits on a `DynamicsFigures`. Only `spend` needs the indirection: it is
// stored as Spend⁺ because that is the only cost a Snapshot froze.
export function metricValue(figures: DynamicsFigures, metric: DynamicsMetric): number | null {
    switch (metric) {
        case 'spend':
            return figures.spendPlus;
        case 'revenue':
            return figures.revenue;
        default:
            return figures[metric];
    }
}

type MetricFormat = {
    // The figure at rest.
    value: (value: number | null) => string;
    // The same figure as a movement — signed, because a change of "4.10" says nothing on its own.
    change: (value: number | null) => string;
    // The compact form an axis tick or a sparkline's trailing label uses, where there is no room for
    // cents and the reader is comparing shapes rather than auditing.
    axis: (value: number) => string;
};

function money(value: number | null): string {
    return value === null ? DASH : usd(value);
}

function moneySigned(value: number | null): string {
    return value === null ? DASH : usdSigned(value);
}

const MONEY_FORMAT: MetricFormat = { value: money, change: moneySigned, axis: usdRound };
const COST_FORMAT: MetricFormat = { value: cost, change: costSigned, axis: cost };

// ROI is a percentage in percent points and carries its sign at rest as well as in movement: an ROI
// of −15 % is the whole point of reading it.
const ROI_FORMAT: MetricFormat = {
    value: pct,
    change: pct,
    axis: (value: number): string => {
        return pct(value);
    },
};

export const METRIC_FORMAT: Record<DynamicsMetric, MetricFormat> = {
    spend: MONEY_FORMAT,
    revenue: MONEY_FORMAT,
    profit: { value: moneySigned, change: moneySigned, axis: usdRound },
    roi: ROI_FORMAT,
    cpi: COST_FORMAT,
    cpr: COST_FORMAT,
    cps: COST_FORMAT,
    cpc: COST_FORMAT,
};
