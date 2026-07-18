// Display formatters for the analyzer (S2). Money/cost show two decimals; a null cost-per (zero
// denominator) shows an em dash. Reason/zone strings live at the i18n edge (`utils/i18n.ts`).

export function money(value: number): string {
    return value.toFixed(2);
}

// A dollar amount: $1234.56.
export function usd(value: number): string {
    return `$${value.toFixed(2)}`;
}

// A cost-per metric: em dash when the denominator was zero (metric "not shown", not zero).
export function cost(value: number | null): string {
    return value === null ? '—' : value.toFixed(2);
}

// A percentage with sign, e.g. ROI +42% / −15%; null → em dash.
export function pct(value: number | null): string {
    if (value === null) {
        return '—';
    }
    return `${value >= 0 ? '+' : ''}${value.toFixed(0)}%`;
}
