# Design system

The look is a trading terminal: flat, opaque, dense, quiet. Colour appears only where a
[Zone](../CONTEXT.md#judgement) is being reported ([ADR-0019](adr/0019-colour-is-spent-on-zone-only.md)).
Depth is two levels and one shadow ([ADR-0021](adr/0021-two-surface-levels.md)). Every value below is
declared once, as a CSS custom property in `src/styles/index.css`, and read by canvas through the
palette bridge ([ADR-0020](adr/0020-css-tokens-are-the-single-palette-source.md)).

Unlike the ADRs, this file is expected to change. The ADRs record the constraints; this records the
numbers currently satisfying them.

## Chrome — achromatic

Two surfaces, two borders. Neutral greys, no cast.

| token | dark | light | used for |
| --- | --- | --- | --- |
| `--background` | `#101010` | `#fafafa` | the page |
| `--surface` | `#171717` | `#ffffff` | inline: cards, panels, tables, sidebar |
| `--surface-overlay` | `#1e1e1e` | `#ffffff` | floating: popover, menu, dialog, sheet, tooltip, toast |
| `--border` | `#2b2b2b` | `#e4e4e4` | hairlines, table rules, dividers |
| `--border-strong` | `#3d3d3d` | `#d0d0d0` | input borders, header/total rules |
| `--foreground` | `#e8e8e8` | `#131313` | body text, figures |
| `--muted-foreground` | `#8f8f8f` | `#5f5f5f` | labels, column heads, secondary figures |
| `--faint` | `#5c5c5c` | `#8a8a8a` | disabled, placeholder |

## Accent — interactive and selected only

| token | dark | light |
| --- | --- | --- |
| `--accent` | `#2196f3` | `#1976d2` |

On a filled accent (a primary button) the ink is `--accent-foreground`: white in light mode, `#101010`
in dark, because white on `#2196f3` measures 3.12:1. The same holds for `--destructive-foreground`.

Legitimate uses, exhaustively: focus ring, active nav item, selected tab, chosen metric, checked
control, link. Never a background wash, never a border on a resting element, never decoration.

## Zone — the only other colour

`green` renders teal and `yellow` renders amber; the names are the DB enum, not the paint.

| Zone | dark | light |
| --- | --- | --- |
| `green` | `#26a69a` | `#00796b` |
| `yellow` | `#e0a33e` | `#ab5e00` |
| `red` | `#ef5350` | `#9b1c1c` |
| `neutral` | `#8f8f8f` | `#5f5f5f` |

Tokens are `--zone-green`, `--zone-yellow`, `--zone-red`, `--zone-neutral`.

Amber is the invented one — Lightweight Charts is binary and ships no third colour, so these values
are not inherited and **must be measured, not eyeballed**: ≥4.5:1 against their own surface, and
distinguishable from both teal and red under deuteranopia. Light-mode amber is the tightest.

Measured (contrast against `--surface`; ΔE is a Viénot deuteranopia simulation in CIELAB):

| theme | teal | amber | red | ΔE amber–red | ΔE amber–teal |
| --- | --- | --- | --- | --- | --- |
| dark | 5.98 | 8.09 | 5.14 | 22.7 | 71.5 |
| light | 5.32 | 4.85 | 8.15 | 19.8 | 60.2 |

Light mode is where the constraint bites: amber cannot be both ≥4.5:1 on white and lighter than a
mid red, so the light red is darkened to `#9b1c1c` and the separation is bought in lightness rather
than hue. The first-attempt light triad (`#00897b`/`#a97400`/`#d32f2f`) measured 4.32 / 4.05 / 4.98
with an amber–red ΔE of 11 — it failed on two counts and is why these numbers are recorded.

## Elevation

| token | dark | light |
| --- | --- | --- |
| `--shadow-overlay` | `0 4px 12px rgb(0 0 0 / 0.45)` | `0 4px 12px rgb(0 0 0 / 0.12)` |

The only shadow in the app. Inline surfaces get `1px solid var(--border)` and a lightness step.

## Radius

`--radius: 0.25rem`. Three steps, nothing above.

| step | value |
| --- | --- |
| `sm` | 2px |
| `md` | 4px |
| `lg` | 6px |

`rounded-full` is for avatars. `xl`, `2xl`, `3xl`, `4xl` are removed from the theme so they cannot
creep back.

## Type

Inter only — one webfont, `wght 400..600`. Roboto Mono is dropped; `font-variant-numeric:
tabular-nums` gives aligned digits without the terminal-code look.

| role | size | weight |
| --- | --- | --- |
| labels, column heads, chart axes | 12px | 400/500 |
| body, table cells | 14px | 400 |
| section headings | 16px | 600 |
| headline figures | 20px max | 600 |

Weights are **400 / 500 / 600**. 700 is not in the vocabulary — emphasis comes from weight, Zone
colour and alignment, not size.

Chart `layout.fontFamily` is set to Inter and `layout.fontSize` to 12, so canvas text matches the
DOM text beside it.

## Icons

Lucide at `strokeWidth={1.5}`, set once by the `LucideProvider` in `src/routes/__root.tsx` rather
than at call sites — it reaches the icons inside Base UI's portals and react-day-picker too, and a
call site that passes `strokeWidth` is overriding the system, not applying it. Sizes: 16px (`size-4`)
default, 12px (`size-3`) inline with 12px text. Nothing larger outside avatars and empty-state art.

## Focus

One treatment everywhere: a 2px `--accent` outline at 1px offset. Held at 2px deliberately — a
hairline would be more consistent with the rest of the system and would fail WCAG 2.2 focus
appearance.

It is declared once, as a `:focus-visible` rule in `@layer base`, not as a class each primitive
remembers to wear — that is what makes "exactly one treatment" a property of the stylesheet rather
than a thing to keep re-checking. `outline` rather than a ring so it follows the element's own radius
and survives an `overflow-hidden` ancestor. A primitive opts out with `outline-none`, which is a
utility and outranks the base layer; the only legitimate opt-outs are popups that take focus
programmatically and draw no visible ring. Where the focus lands on a descendant but the wrapper is
what reads as the control — the two combobox input groups — `.focus-ring-within` repeats the same
two numbers.

## Motion

State changes only, 120–160ms. No ambient animation, with one exception: an unreviewed problem
account pulses its border opacity — no glow, low amplitude, slow. Everything respects
`prefers-reduced-motion`.

## Tables

`ui/Table` owns the table rules so a report table cannot re-derive them: hairline row rules and **no
zebra** (striping is a workaround for rows too tall to track across, and at this density a 1px rule
does the same job), figures right-aligned and `tabular-nums` through the `isNumeric` prop, column
heads at 12px in `--muted-foreground`, an optional sticky header, and a total row in `<tfoot>` under
one `--border-strong` rule. Two densities, `default` and `compact`.

## The workbench

`/design` (dev-only, outside `_authenticated` — `src/routes/design.tsx`) renders every token above and
every `ui/` primitive in every state it supports, with light and dark side by side rather than behind
the switcher. Zone swatches re-measure their contrast against their own surface on each render, so the
table above is checked rather than trusted.

It is the checklist: a primitive is migrated when it looks right on that page, not when the one screen
using it looks right. Overlay primitives portal to `document.body`, so an opened dialog, menu or
tooltip wears the app's own theme — check the second one with the theme switcher.

## Deleted vocabulary

`surface-glass`, `glass-tint`, `tint-*`, `surface-accent`, `pill`, `pill-*`, `glow-soft`,
`glow-fade`, every `backdrop-filter`, `BackgroundCanvas`, `BackgroundContext`. If a diff reintroduces
one of these, it is a regression.
