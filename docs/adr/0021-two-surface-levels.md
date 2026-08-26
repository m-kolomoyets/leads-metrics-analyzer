# There are two surface levels, and one shadow

Depth in this app is spoken in exactly two levels:

- **Inline** — cards, panels, tables, the sidebar, section shells. A 1px hairline border and a step
  in background lightness. **No shadow.**
- **Overlay** — things that genuinely float over the page: `Popover`, `DropdownMenu`, `Dialog`,
  `Sheet`, `Tooltip`, `Toast`. Hairline border, a background step, and one flat neutral shadow token.

There is no third level, and there is one neutral shadow token. A component asking for a shadow while
sitting inline is a design smell to push back on, not a token to add.

The single amendment: a **zone glow** (`glow-zone-green` / `-yellow` / `-red`, and `glow-sales`) — a
28px bleed of the block's own zone colour. It is not a third depth level, because it does not signal
depth: it may only be worn by a block that already carries that colour's hairline, it is always that
same colour, and it never touches chrome. A glowing block is not floating, it is graded. Neutral gets
no glow, which is what keeps the graded ones legible as signal.

## Why

The design this replaces expressed depth with translucency: a gradient fill, `backdrop-filter:
blur(8px)`, a coloured glow and an inset highlight, over nine drifting blue blobs painted on a
canvas. Everything floated, so nothing did — an open dropdown over a table was ambiguous about which
layer it was on, because the table was already glowing too.

Restraint is what reads as confident, and hairlines are how a dense data surface stays legible: a
border costs one pixel of contrast and no blur, where a shadow bleeds into the row beneath it and a
blur costs a compositor pass on every scroll.

The purer option — hairlines everywhere, zero `box-shadow` in the app — was considered and rejected.
An unshadowed menu over a table is genuinely ambiguous about its layer, and that ambiguity costs the
reader more than the purity buys. TradingView's own menus drop a shadow. Two levels is the smallest
number that still answers "is this on the page or over it".

## Consequences

- `surface-glass`, `glass-tint`, the `tint-*` colours, `surface-accent`, `pill`, `glow-soft` and
  every `backdrop-filter` are deleted rather than reskinned. They encode a depth model that no longer
  exists.
- Elevation is not a scale. There is no `--shadow-sm`/`md`/`lg`; there is `--shadow-overlay`.
- The zone glow is not elevation either — its strength lives in `--glow-rest`/`--glow-peak` (lower in
  light mode, where a halo on white smudges), and its use is gated by ADR-0019, not by a depth
  decision. It breathes between the two on the same 4.8s clock as the problem-account border pulse.
- Nesting an inline surface inside another gives two hairlines and one lightness step, which is the
  intended reading — a subsection, not a new plane.
