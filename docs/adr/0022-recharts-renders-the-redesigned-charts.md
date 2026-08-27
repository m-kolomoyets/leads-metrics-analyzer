# Recharts renders the redesigned charts

The chart primitives in `src/components/charts/` are drawn by [Recharts](https://recharts.org) 3.x,
as SVG. The existing surfaces in `src/components/dynamics/` keep [Lightweight
Charts](https://tradingview.github.io/lightweight-charts/) until the redesign is accepted, at which
point Lightweight Charts is removed rather than kept alongside.

## Why

The redesign's language is a heavy stroke with a per-interval colour gradient, a blurred halo
hugging that stroke, rounded caps, a whisper of a grid and a tooltip built out of the app's own
components. Lightweight Charts draws to a canvas. Every one of those is either impossible on it or
is ours to hand-paint — `ZoneSeries` already exists precisely because the library's Line series
carries one colour and the trajectory needed a graded one. Continuing down that road means writing a
renderer.

In SVG the same list is `stroke="url(#id)"`, a CSS `filter: blur()`, `stroke-linecap`, a
`<CartesianGrid>` and a React component. The gradient in particular stops being a custom canvas
plugin and becomes one `<linearGradient>` with a stop per push — the same per-interval
verdict→verdict blend `ZoneSeries` paints by hand, expressed declaratively.

SVG also puts the charts back on the CSS token pipeline. Recharts writes colours into SVG
attributes, where `var(--zone-green)` resolves exactly as it does anywhere else, so the
`useChartPalette` bridge that exists only to read tokens _out_ of CSS and hand them to a canvas
([ADR-0020](0020-css-tokens-are-the-single-palette-source.md)) has nothing left to do.

## Verified before adoption, not after

- **React 19.2.7 + React Compiler.** Recharts' peer range admits React 19, but
  [recharts#6781](https://github.com/recharts/recharts/issues/6781) reports a fiber crash and
  [#6857](https://github.com/recharts/recharts/issues/6857) a blank render on 19.2.x. Neither
  reproduced here. The cause of the second is a `react-is@16` hoist — pnpm resolved Recharts' peer
  to the copy `prop-types` drags in — so `react-is` is pinned to the app's React in `pnpm-
  workspace.yaml`. Without that pin this decision is not safe.
- **SSR.** Recharts' `ResponsiveContainer` cannot render server-side; it needs real DOM dimensions.
  Irrelevant here — TanStack Start runs in SPA mode ([ADR-0008](0008-tanstack-start-on-vite-7.md)) —
  but it is the reason this ADR does not generalise to a future SSR build.

## Consequences

- **The bundle grows.** Measured, not estimated: the charts route chunk is 110 kB gzip against the
  `dynamics` chunk's 68 kB. Recharts ships an internal Redux store (`@reduxjs/toolkit`, `react-
  redux`, `immer`) and a d3 bundle (`victory-vendor`), and none of it tree-shakes away. Note that
  this is an _internal_ store belonging to the library, not a global store layer for the app — the
  repo still has none.
- **The tooltip is ours, not the library's.** Recharts' tooltip follows the pointer and its wrapper
  is `pointer-events: none`, so the link inside the trajectory's card could never be reached — it
  walks away from the cursor sent to press it, and would refuse the click if it stood still.
  `TrajectoryCard` keeps Recharts only for hit-testing (which push is the pointer over) and owns the
  card's position, its pin while the pointer is inside it, and its dismissal on the plot box — the
  same arrangement the Lightweight Charts version already arrived at. Watch for
  `activeTooltipIndex`, which is typed `number | TooltipIndex | undefined` where `TooltipIndex` is a
  **string**: a `typeof === 'number'` guard silently rejects every hover.
- **Pan and zoom are lost**, which the library gave free. See [ADR-0023](0023-the-trajectory-draws-
  one-day-and-does-not-zoom.md).
- **Two chart libraries are in the tree at once, deliberately and temporarily.** The comparison
  route is the whole point; the moment it resolves, one of them leaves. A third chart idiom
  appearing while both are present is a defect.

## Considered options

- **Hand-rolled SVG, no library.** Total control, no dependency. Rejected for the trajectory: it
  would mean rebuilding crosshair, hit-testing, tooltip positioning, axis ticks and scales — the
  riskiest component in the app to regress, in exchange for bundle size.
- **Stay on Lightweight Charts.** Cheapest, and the design would have to give up the gradient
  stroke, the halo and the rounded caps — i.e. give up the redesign.
- **Apache ECharts.** `markArea` and `visualMap` do zones and value-driven gradients natively.
  Canvas again, which loses the CSS/SVG token pipeline that is half the reason for the move.
