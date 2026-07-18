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

// An unsigned conversion ratio, one decimal (I2R / R2S): 12.5%; null → em dash.
export function ratioPct(value: number | null): string {
    return value === null ? '—' : `${value.toFixed(1)}%`;
}

// A CTR percentage, two decimals (#35 creative table): 1.34%; null (no impressions) → em dash.
export function ctrPct(value: number | null): string {
    return value === null ? '—' : `${value.toFixed(2)}%`;
}

// The flag emoji for a two-letter country code, via Unicode regional-indicator symbols (no lookup
// table). "IN" → 🇮🇳. Non-AZ input falls back to the white flag.
export function flagEmoji(cc: string): string {
    const code = cc.toUpperCase();
    if (!/^[A-Z]{2}$/.test(code)) {
        return '🏳';
    }
    return String.fromCodePoint(
        ...[...code].map((ch) => {
            return 0x1f1e6 + ch.charCodeAt(0) - 65;
        })
    );
}
