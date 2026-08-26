// WCAG 2.1 relative luminance and contrast ratio, over the hex literals declared in
// `src/styles/index.css`. The /design route prints the Zone ratios beside their swatches so the
// numbers recorded in `docs/design-system.md` are re-measured on every render rather than trusted.

const parseHex = (hex: string) => {
    const value = hex.replace('#', '');
    const full =
        value.length === 3
            ? value
                  .split('')
                  .map((char) => {
                      return `${char}${char}`;
                  })
                  .join('')
            : value;

    return [
        Number.parseInt(full.slice(0, 2), 16),
        Number.parseInt(full.slice(2, 4), 16),
        Number.parseInt(full.slice(4, 6), 16),
    ];
};

const channelLuminance = (channel: number) => {
    const ratio = channel / 255;

    if (ratio <= 0.03928) {
        return ratio / 12.92;
    }

    return ((ratio + 0.055) / 1.055) ** 2.4;
};

const relativeLuminance = (hex: string) => {
    const [red, green, blue] = parseHex(hex);

    return 0.2126 * channelLuminance(red) + 0.7152 * channelLuminance(green) + 0.0722 * channelLuminance(blue);
};

export function contrastRatio(foreground: string, background: string) {
    const first = relativeLuminance(foreground);
    const second = relativeLuminance(background);
    const lighter = Math.max(first, second);
    const darker = Math.min(first, second);

    return (lighter + 0.05) / (darker + 0.05);
}

// Two decimals is how the table in `docs/design-system.md` records them.
export function formatContrastRatio(foreground: string, background: string) {
    return `${contrastRatio(foreground, background).toFixed(2)}:1`;
}
