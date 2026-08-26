# CSS custom properties are the single palette source; canvas reads them, never the reverse

Every colour, radius, font and size in this app is declared once, as a CSS custom property in
`src/styles/index.css`, under `:root` and `.dark`. The charts are canvas and cannot read a custom
property — `ctx.strokeStyle = 'var(--danger)'` silently paints nothing — so they read the *resolved*
values through one bridge, `useChartPalette`, which resolves tokens with `getComputedStyle` and
re-reads them when the theme class on `<html>` changes.

The bridge is one-directional. No colour is ever declared in TypeScript and mirrored into CSS.

## Why

There are two worlds here that must agree — DOM and canvas — and the only way they stay agreeing is
if one of them is downstream of the other. The alternative considered was inverting it: define the
palette as a TypeScript object and generate the custom properties from it at build. That is cleaner
in the abstract and wrong for this stack. Tailwind v4's `@theme inline`, the shadcn primitives and
the `.dark` class variant all assume CSS-first; generating them from TS costs a build step and gives
up `@theme`'s utility generation, in exchange for removing a `getComputedStyle` call that runs once
per theme flip.

The real defect was never the direction. It was that the bridge was too narrow. It carried seven
fields — the zone triad, accent, background, muted, border, text — while `layout.fontFamily`, the
grid colour, the crosshair colour, the scale border and the pane separator were left at Lightweight
Charts' own defaults (`#D6DCDE`, `#2B2B43`, `#758696`). Those defaults are a *different* design
system, showing through in the middle of ours: the axis labels rendered in the library's system
stack while every number beside them rendered in Inter.

## Consequences

- `ChartPalette` covers the whole appearance surface the library exposes, not the subset a given
  chart happened to need.
- Both charts spread a shared `chartOptionsFor(palette)` factory rather than hand-rolling their own
  options literal. A third chart added later inherits the system instead of re-deriving it, which is
  the failure mode this exists to prevent.
- A hardcoded colour anywhere near a chart is a defect. If a value is needed on canvas and has no
  token, the fix is to add the token, not the hex.
- The palette is still resolved at runtime, so the first paint before the bridge reads uses
  `FALLBACK`. That constant must be kept honest against the dark theme's real values.
