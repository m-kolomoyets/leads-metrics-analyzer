# Colour is spent on Zone only

Every surface in this app is achromatic — background, card, border, grid, divider, sidebar, table
rule. The only saturated colour in the chrome is one accent blue, and it is reserved for
*interactive and selected*: focus ring, active tab, chosen metric. Nothing is coloured to look nice.

Colour means [Zone](../../CONTEXT.md#judgement). Teal is green, red is red, amber is yellow, grey is
neutral. A reader who sees colour anywhere on a screen is looking at a judgement, and can trust that
without checking what kind of element it is.

## Why

The app's entire payload is a red→amber→green call on money. Contrast is the medium that call is
delivered in, and contrast is finite. The design this replaces spent blue on panel tints, panel
borders, gradient buttons, the grid behind the chart and glowing status pills — so the Zone triad
had to shout over a blue field to be seen at all. `--grid: rgb(37 99 235 / 0.05)` painted a blue
grid directly behind the zone-graded stroke of the trajectory chart, which is the one place in the
product where a colour gradient carries the meaning.

Every non-data colour is contrast stolen from the judgement. Spending none of it is not minimalism
for its own sake; it is the only way the triad reads at a glance.

The look this converges on is TradingView's, which is not a coincidence — the charts were drawn by
[Lightweight Charts](https://tradingview.github.io/lightweight-charts/) when this was decided, and
its own defaults follow the same rule (achromatic `#D6DCDE` grid, `#2B2B43` scale borders, colour
only on the series). The library has since left ([ADR-0022](0022-recharts-renders-the-redesigned-
charts.md)); the rule it agreed with did not.

## Considered options

- **Blue-tinted neutrals.** Greys carrying a cool cast, accent unchanged. Rejected as a half-measure:
  it keeps a brand signature but reintroduces exactly the field the triad has to fight.
- **Keep blue chrome, flatten it.** Rejected — flattening removes the glow but not the competition.

## Consequences

- The app no longer reads as "blue-branded". That identity is deliberately traded for legibility of
  the judgement.
- A new colour introduced anywhere in the chrome is a defect, not a style choice. The question to
  ask of any coloured pixel is "which Zone is this?" — if there is no answer, it should be grey.
- The accent blue has almost no legitimate homes left. Focus and selected-state are two of them,
  which is why they are unified rather than per-component ([design system](../design-system.md)).
