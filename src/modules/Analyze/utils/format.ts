import type { VerdictReason, Zone } from '@/lib/domain/types';

// Raw display helpers for the slice-1 proof table (styling proper lands in S2). Money/cost show two
// decimals; a null cost-per (zero denominator) shows an em dash.
export function money(value: number): string {
    return value.toFixed(2);
}

export function cost(value: number | null): string {
    return value === null ? '—' : value.toFixed(2);
}

// The structured verdict reason (ADR-0004) as a terse string: which stage decided, its metric+value.
export function reasonText(reason: VerdictReason | null): string {
    if (!reason) {
        return '—';
    }
    return `${reason.metric.toUpperCase()} ${reason.value.toFixed(2)}`;
}

// Minimal traffic-light background per zone — enough to see grading, not the S2 glass styling.
export const ZONE_CLASS: Record<Zone, string> = {
    green: 'bg-green-500/15',
    yellow: 'bg-yellow-500/15',
    red: 'bg-red-500/15',
    neutral: '',
};
