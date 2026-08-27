# CSS custom properties are the single palette source; canvas reads them, never the reverse

Every colour, radius, font and size in this app is declared once, as a CSS custom property in
`src/styles/index.css`, under `:root` and `.dark`. Nothing is ever declared in TypeScript and
mirrored into CSS.

**The canvas half of this ADR is retired.** It was written while the charts were canvas, which
cannot read a custom property — `ctx.strokeStyle = 'var(--danger)'` silently paints nothing — so
they read the *resolved* values through one bridge, `useChartPalette` (`getComputedStyle`, re-read
on a theme flip). The charts are SVG now ([ADR-0022](0022-recharts-renders-the-redesigned-
charts.md)): `var(--zone-green)` resolves in an SVG attribute like anywhere else, so the bridge was
deleted along with the library. The direction below is what still binds — CSS declares, everything
else reads.

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

- A hardcoded colour anywhere near a chart is a defect. If a value is needed and has no token, the
  fix is to add the token, not the hex.
- On the canvas charts this cost a bridge (`ChartPalette`, a shared `chartOptionsFor` factory and a
  `FALLBACK` for the first paint), and every appearance field left off it fell through to the
  library's own design system. On SVG all of that is gone: a chart writes `var(--zone-green)` into
  an attribute and the cascade does the rest.
