// Display formatters for the analyzer (S2). Every number goes through an `Intl.NumberFormat`
// instance created once at module scope (constructing one per call is the expensive part).
// Money/cost show two decimals; a null cost-per (zero denominator) shows an em dash.
// Reason/zone strings live at the i18n edge (`utils/i18n.ts`).

// Numbers are reported in USD and read by a mixed uk/en team, so the numeric locale is fixed:
// dot decimal separator, comma grouping — independent of the UI locale and the browser's.
const NUMBER_LOCALE = 'en-US';

const DASH = '—';

const integerFormat = new Intl.NumberFormat(NUMBER_LOCALE, { maximumFractionDigits: 0 });

const decimalFormat = new Intl.NumberFormat(NUMBER_LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const usdFormat = new Intl.NumberFormat(NUMBER_LOCALE, { style: 'currency', currency: 'USD' });

const usdSignedFormat = new Intl.NumberFormat(NUMBER_LOCALE, {
    style: 'currency',
    currency: 'USD',
    signDisplay: 'always',
});

const usdRoundFormat = new Intl.NumberFormat(NUMBER_LOCALE, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

// Percent formatters take a ratio (0.42), while the domain hands out percent points (42) — `percent`
// below does the /100. `signDisplay: 'exceptZero'` gives the ROI its leading +.
const signedPercentFormat = new Intl.NumberFormat(NUMBER_LOCALE, {
    style: 'percent',
    maximumFractionDigits: 0,
    signDisplay: 'exceptZero',
});

const percentFormats = [0, 1, 2].map((digits) => {
    return new Intl.NumberFormat(NUMBER_LOCALE, {
        style: 'percent',
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });
});

// A count: 1,234 (grouped, no decimals).
export function int(value: number): string {
    return integerFormat.format(value);
}

// A dollar amount: $1,234.56.
export function usd(value: number): string {
    return usdFormat.format(value);
}

// A signed dollar amount, e.g. Profit: +$120.00 / -$45.00.
export function usdSigned(value: number): string {
    return usdSignedFormat.format(value);
}

// A whole-dollar amount (compact chrome: tab spend, summary revenue): $1,234.
export function usdRound(value: number): string {
    return usdRoundFormat.format(value);
}

// A cost-per metric: em dash when the denominator was zero (metric "not shown", not zero).
export function cost(value: number | null): string {
    return value === null ? DASH : decimalFormat.format(value);
}

// A percentage with sign, e.g. ROI +42% / -15%; null → em dash. Input is percent points.
export function pct(value: number | null): string {
    return value === null ? DASH : signedPercentFormat.format(value / 100);
}

// An unsigned percentage in percent points, `digits` decimals (default 1); null → em dash.
export function percent(value: number | null, digits: 0 | 1 | 2 = 1): string {
    return value === null ? DASH : percentFormats[digits].format(value / 100);
}

// An unsigned conversion ratio, one decimal (I2R / R2S): 12.5%; null → em dash.
export function ratioPct(value: number | null): string {
    return percent(value, 1);
}

// A CTR percentage, two decimals (#35 creative table): 1.34%; null (no impressions) → em dash.
export function ctrPct(value: number | null): string {
    return percent(value, 2);
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
