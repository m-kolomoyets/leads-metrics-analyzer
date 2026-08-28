# Design system

The look is a trading terminal: flat, opaque, dense, quiet. Colour appears only where a
[Zone](../CONTEXT.md#judgement) is being reported ([ADR-0019](adr/0019-colour-is-spent-on-zone-only.md)).
Depth is two levels and one shadow ([ADR-0021](adr/0021-two-surface-levels.md)). Every value below is
declared once, as a CSS custom property in `src/styles/index.css`, and read by canvas through the
palette bridge ([ADR-0020](adr/0020-css-tokens-are-the-single-palette-source.md)).

Unlike the ADRs, this file is expected to change. The ADRs record the constraints; this records the
numbers currently satisfying them.

## Chrome — achromatic

Two surfaces, two borders. Neutral greys, a faint cool cast in dark mode. Dark mode's stack runs
downward: the page is grey and a card is cut out of it in near-black, so a card is read by its own
lightness before its border is read at all. The overlay is the one step back up, because a popover
has to separate from the card it was opened from rather than sink further into it.

| token | dark | light | used for |
| --- | --- | --- | --- |
| `--background` | `#1b1b1f` | `#fafafa` | the page |
| `--surface` | `#08080a` | `#ffffff` | inline: cards, panels, tables, navbar |
| `--surface-overlay` | `#17171a` | `#ffffff` | floating: popover, menu, dialog, sheet, tooltip, toast |
| `--border` | `#2a2a2f` | `#e4e4e4` | hairlines, table rules, dividers |
| `--border-strong` | `#3d3d43` | `#d0d0d0` | input borders, header/total rules |
| `--foreground` | `#f2f2f2` | `#131313` | body text, figures |
| `--muted-foreground` | `#9b9b9b` | `#5f5f5f` | labels, column heads, secondary figures |
| `--faint` | `#6b6b6b` | `#8a8a8a` | disabled, placeholder |

## Accent — interactive and selected only

| token | dark | light |
| --- | --- | --- |
| `--accent` | `#4c82f7` | `#1f5fd0` |

One blue in both themes — the dark accent darkened for light mode, not a second hue. On a filled
accent (a primary button) the ink is `--accent-foreground`: white in light mode (5.82:1), `#000000`
in dark (5.84:1, where white would be 3.59:1). The same holds for `--destructive-foreground`.

Legitimate uses, exhaustively: focus ring, active nav item, selected tab, chosen metric, checked
control, link. Never a background wash, never a border on a resting element, never decoration.

## Zone — the only other colour

`green` renders teal and `yellow` renders amber; the names are the DB enum, not the paint.

| Zone | dark | light |
| --- | --- | --- |
| `green` | `#26a69a` | `#008275` |
| `yellow` | `#e0a33e` | `#ad6200` |
| `red` | `#ef5350` | `#a82727` |
| `neutral` | `#9b9b9b` | `#5f5f5f` |

Tokens are `--zone-green`, `--zone-yellow`, `--zone-red`, `--zone-neutral`.

Amber is the invented one — the charting library the triad was first drawn on is binary and ships
no third colour, so these values
are not inherited and **must be measured, not eyeballed**: ≥4.5:1 against their own surface, and
distinguishable from both teal and red under deuteranopia. Light-mode amber is the tightest.

Measured (contrast against `--surface`; ΔE is a Viénot deuteranopia simulation in CIELAB):

| theme | teal | amber | red | ΔE amber–red | ΔE amber–teal |
| --- | --- | --- | --- | --- | --- |
| dark | 6.68 | 9.03 | 5.74 | 22.7 | 71.5 |
| light | 4.72 | 4.64 | 7.04 | 20.0 | 62.3 |

Light mode is where the constraint bites: amber cannot be both ≥4.5:1 on white and lighter than a
mid red, so the light red stays the darkest of the three and the separation is bought in lightness
rather than hue. The first-attempt light triad (`#00897b`/`#a97400`/`#d32f2f`) measured 4.32 / 4.05
/ 4.98 with an amber–red ΔE of 11 — it failed on two counts and is why these numbers are recorded.
The current triad was lightened to the 4.5:1 floor on teal and amber; red followed only as far as
`#a82727`, because every step lighter than that eats the amber–red ΔE (at `#c62828` it collapses to
9.1, worse than the failed first attempt).

`--sales` — `#a78bfa` dark, `#6d28d9` light — sits outside this scale. A sale is a fact, not a
judgement, so the sales block may not borrow Zone green; violet is reserved for it and used nowhere
else.

## Elevation

| token | dark | light |
| --- | --- | --- |
| `--shadow-overlay` | `0 4px 16px rgb(0 0 0 / 0.6)` | `0 4px 12px rgb(0 0 0 / 0.12)` |
| `--glow-rest` | `65%` | `32%` |
| `--glow-peak` | `88%` | `46%` |

The only *neutral* shadow in the app. Inline surfaces get `1px solid var(--border)` and a lightness
step.

The one other `box-shadow` is the **zone glow**: `glow-zone-green` / `-yellow` / `-red` / `glow-sales`,
each `0 0 28px -4px` of its own colour at `--glow-strength`, which breathes between `--glow-rest` and
`--glow-peak` on a 4.8s clock. It is not an elevation step — it may only
be worn by a block that already carries that colour's hairline, so a glowing block is judged, not
floating ([ADR-0021](adr/0021-two-surface-levels.md)). Neutral has no glow: that is what makes a graded
block read as a signal. Light mode runs at less than half the strength — a coloured halo on white
becomes a smudge long before it becomes a signal.

## Radius

`--radius: 0.5rem`. Three steps, nothing above.

| step | value |
| --- | --- |
| `sm` | 4px |
| `md` | 8px |
| `lg` | 12px |

`rounded-full` is for avatars. `xl`, `2xl`, `3xl`, `4xl` are removed from the theme so they cannot
creep back.

## Type

Inter only — one webfont, `wght 400..600`. Roboto Mono is dropped; `font-variant-numeric:
tabular-nums` gives aligned digits without the terminal-code look.

| role | size | weight |
| --- | --- | --- |
| labels, column heads, chart axes | 13px | 400/500 |
| body, table cells | 15px | 400 |
| section headings | 17px | 600 |
| headline figures | 22px max | 600 |

Weights are **400 / 500 / 600**. 700 is not in the vocabulary — emphasis comes from weight, Zone
colour and alignment, not size.

The scale is Tailwind's own, moved one step up (~+8%) by redeclaring `--text-xs` … `--text-3xl` in
`@theme`. Declared there rather than by resizing the root, so spacing and radius — both rem-based —
stay exactly where they were.

Chart `layout.fontFamily` is set to Inter and `layout.fontSize` to 13, so canvas text matches the
DOM text beside it.

## Interaction

| token | dark | light |
| --- | --- | --- |
| `--hover` | `rgb(255 255 255 / 0.08)` | `rgb(90 90 90 / 0.1)` |
| `--hover-strong` | `rgb(255 255 255 / 0.14)` | `rgb(90 90 90 / 0.16)` |

One wash for every hover — button, menu item, select option, nav tab — and one step up for the
row that is actually selected. Translucent on purpose: it reads the same over `--surface`,
`--surface-overlay` and the navbar, so no surface needs a hover token of its own. `--muted` is an
alias of `--surface` and is therefore **not** a hover: a secondary button hovering onto it changed
nothing at all, which is the bug these two tokens exist to fix.

Navigation and menus spend no accent. The accent is the focus ring, a chosen metric and a link — the
active nav tab reads medium weight and a `--foreground` underline, so "where I am" and "what I am
pointing at" differ in weight rather than in hue.

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

State changes only, 120–160ms. Two ambient exceptions, both slow, low-amplitude and on the same 4.8s
clock so the page has one rhythm rather than two: an unreviewed problem account pulses its border
opacity, and a zone glow breathes between `--glow-rest` and `--glow-peak`. Strength only — no
geometry moves, so nothing reflows. Everything respects `prefers-reduced-motion`.

## The frame — navbar and header

Chrome is one material stacked above the page: `--surface`, ruled with `--border`, at the same
density as the tables it frames. Neither band invents a vocabulary of its own.

The **navbar** (`components/layouts/MainLayout/components/MainNavbar`) is two bands under one
hairline each, sticky at the top of every screen. The upper band, 44px, is identity: the `Adjoin`
mark and the team beside it, the account dropdown at the trailing end. The lower band, 40px, is the
tab row — the reports first, then `Admin` past a hairline, because Admin is a different job and most
roles cannot open it at all. A role that cannot open a route never sees its tab. The active tab is
medium weight and a 2px `--foreground` underline on the band's own bottom edge — achromatic signals,
no accent ([ADR-0019](adr/0019-colour-is-spent-on-zone-only.md)). The row scrolls inside itself
rather than wrapping, so the bar is the same height on every screen.

The **header** is `components/layouts/MainLayoutHeader`, sticky at `--navbar-height` so it parks
directly under the bar, 48px, one `--border` rule under it, and two slots in a fixed order:
`MainLayoutHeaderTitle`, `MainLayoutHeaderActions`.
The title is 17px/600 with anything qualifying it — a report date, a buyer — beside it in
`--muted-foreground` rather than baked into the heading. Pages used to hand-roll this with a
`flex-1` spacer and a size each, which is how one page ended up at 20px and the next at 17px; the
layout belongs to the component and a page only says what goes in it. The language switch is one
`LocaleSwitch` (a `Segmented`) on all four bilingual pages, not four button rows.

## Rows of choices

Geo tabs, buyer tabs, team tabs and the chart's mode toggle are one primitive, `ui/Segmented`. A
resting item is flat text in `--muted-foreground`; the chosen one wears `--hover-strong` and
`--foreground` — the same "where I am" wash the app spends on a selected row, one step up from the
`--hover` every item shares. No tray, no border, no accent fill: the accent here is the focus ring
and nothing else. `mode="toggle"` swaps `role="tab"`/`aria-selected` for `aria-pressed` and changes
nothing about the paint.

A caller with something to say about an option says it in the item's own text — a buyer tab's Zone,
a geo's Spend⁺. Never in a fill: eight coloured fills is a row of eight alarms, and the selected
state would then have nothing left to be.

## Figures

Every headline readout is `components/Figure`, three lines:

| line | size | ink |
| --- | --- | --- |
| label | 13px, uppercase, tracked | `--muted-foreground` |
| value (+ unit beside it) | 17px (`md`) / 22px (`lg`), tabular | `--foreground`, or the Zone |
| meta — delta, threshold pair, share | 13px, tabular | `--muted-foreground` |

The unit is demoted, never baked into the figure: `$1,204.55` is the figure and `USD` is 13px beside
it, because "$1,204.55 spend" set as one line reads as one 22px shout.

A figure is painted only where it **is** a Zone judgement — ROI, a cost against its band, waste
against its band. An ungraded fact stays `--foreground`: Spend, a Geo Total, a count. `neutral` is
the absence of a grade, not a grade to paint, so it takes no colour either. A green revenue says
"good" about a number with no opinion attached to it, which is the rule ADR-0019 exists to hold.

## Tables

`ui/Table` owns the table rules so a report table cannot re-derive them: hairline row rules and **no
zebra** (striping is a workaround for rows too tall to track across, and at this density a 1px rule
does the same job), figures right-aligned and `tabular-nums` through the `isNumeric` prop, column
heads at 12px in `--muted-foreground`, an optional sticky header, and a total row in `<tfoot>` under
one `--border-strong` rule. Two densities, `default` and `compact`.

## Charts

Beyond the palette bridge: no vertical grid (the crosshair answers "which push"), horizontal grid
hairline-dotted, no scale borders — the card's own edge is the rule. The one flat-coloured line on a
chart (money / ROI, which takes no verdict) carries a wash under it at `0.14` alpha, fading to
nothing at the foot of the pane; a zone-graded stroke gets none, because it has no single hue to
fade, and neither do the dashed cost lines, where several fills at once would be mud.

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
one of these, it is a regression. `glow-zone-*` is not one of them: the deleted glows were ambient
decoration on chrome, this one is a zone report and appears nowhere a zone is not already declared.
