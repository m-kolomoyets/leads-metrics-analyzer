# Chart palette bridge — widen it, and share one options factory

**Depends on 01. Parallelizable with 03 and 05.**

## What to build

`useChartPalette` currently carries seven fields, so everything it does not carry falls back to
Lightweight Charts' own defaults — a different design system showing through in the middle of ours.
Today the axis labels render in the library's system stack (`-apple-system, BlinkMacSystemFont,
'Trebuchet MS', Roboto, Ubuntu`) while every number beside them renders in Inter, the grid is
`#D6DCDE`, the scale borders are `#2B2B43` and the crosshair is `#758696`.

Widen `ChartPalette` to the whole appearance surface v5 exposes: `layout.textColor`, `fontFamily`,
`fontSize`, `grid.vertLines`/`horzLines`, `crosshair.vertLine`/`horzLine` including
`labelBackgroundColor`, `leftPriceScale`/`rightPriceScale` `borderColor`, `timeScale.borderColor`,
and `layout.panes.separatorColor`/`separatorHoverColor`. Keep `FALLBACK` honest against the dark
theme's real values — it is what the first paint uses.

Then add one `chartOptionsFor(palette)` factory and have both charts spread it instead of
hand-rolling their own literal (`TrajectoryChart/index.tsx:100-118`, `Sparkline/index.tsx:50-57`).
`Sparkline`'s suppressions — hidden scales, hidden crosshair, no grid — stay as its own overrides on
top. A third chart added later should inherit the system rather than re-derive it; that is the
failure this slice exists to prevent (ADR-0020).

Zone colours in `ZoneSeries` keep reading `palette.zone[zone]`, which is already correct — they just
resolve to teal and amber now (ADR-0019).

## Acceptance criteria

- [ ] `ChartPalette` covers layout, grid, crosshair, both price scales, time scale and pane separator
- [ ] No Lightweight Charts default colour is visible anywhere in either chart
- [ ] Chart axis text renders in Inter at 12px, matching the DOM text beside it
- [ ] Both charts build their options from `chartOptionsFor(palette)`
- [ ] `FALLBACK` matches the dark theme's real token values
- [ ] Flipping the theme repaints both charts with no reload
- [ ] `pnpm tsc` and `pnpm lint` pass
