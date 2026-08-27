# The trajectory draws one day and does not zoom

`TrajectoryCard` renders every push of the day at a fixed range. There is no panning, no scroll-zoom
and no brush selector.

## Why

The axis is `taken_at` ([ADR-0017](0017-dynamics-axis-is-taken-at.md)) and the window is one buyer's
day — a handful of pushes, not a price history. Both questions a lead brings to this chart are
answered without moving it: _which way is it bending_ is read off the shape, and _what was it at
17:00_ is read off the tooltip.

Panning came free with Lightweight Charts, which is the only reason the current chart has it. Free
is not the same as earned: nothing in the spec asks for it, and a day that fits on screen has
nothing to pan to.

## Consequences

- A capability the current chart has is being removed on purpose. If a buyer ever pushes often
  enough that a day stops fitting, this decision is the first thing to revisit — and a `<Brush>`
  under the plot is the cheap answer, at the cost of chrome the design does not have.
- The chart no longer needs to keep a viewport, which removes a whole class of state: no saved
  range, no "reset zoom" affordance, no disagreement between what the chart shows and what the
  header reports.
