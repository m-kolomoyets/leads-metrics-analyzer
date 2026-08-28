// ISO-2 → flag emoji via the Unicode regional-indicator offset. Shared, because the geo row and the
// member card must draw the same market the same way — two copies of this drifted once already.
//
// Returns null for anything that is not two A–Z letters (an unknown or aggregate geo), so the caller
// falls back to the raw code rather than printing a pair of stray letter blocks.
export function flagEmoji(geo: string): string | null {
    if (!/^[A-Za-z]{2}$/.test(geo)) {
        return null;
    }

    // regional indicator 'A' minus ASCII 'A'
    const base = 0x1f1e6 - 0x41;
    const code = geo.toUpperCase();

    return String.fromCodePoint(base + code.charCodeAt(0), base + code.charCodeAt(1));
}
