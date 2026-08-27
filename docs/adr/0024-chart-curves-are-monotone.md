# Chart curves are monotone

Every line in `src/components/charts/` is drawn with `type="monotone"`. Not `natural`, not `basis`,
and not `linear`.

## Why

The redesign wants a soft curve; the domain will not tolerate an invented one. `natural` and `basis`
splines overshoot — the drawn curve rises above the highest point it joins and dips below the
lowest. On a cost line that is a lie with consequences: a CPI whose real maximum was 2.38 would be
_drawn_ crossing 2.40, and the zone gradient would then turn red at a moment the cost never reached
the red threshold. The chart would be reporting a verdict the data does not support.

A monotone cubic cannot do that. It is smooth, it is rounded, and it is bounded by its own data
points, so every threshold crossing on screen is a crossing that happened.

`linear` is honest too, and is what the current chart draws — rejected only because the softness is
a real part of what the redesign is being judged on.

## Consequences

- The curve is visibly less swoopy than the template it is modelled on. That difference is the
  decision, not a fidelity failure.
- The rule is one constant, `CURVE`, in `src/components/charts/constants.ts`. A chart that sets its
  own curve type is bypassing this ADR.
