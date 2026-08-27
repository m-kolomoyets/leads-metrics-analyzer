# Chart primitives are domain-free

`src/components/charts/` takes numbers, grades and formatted strings. It imports nothing from
`src/lib/domain/`. Knowing that a CPI is graded against a Snapshot's frozen thresholds is the
calling page's job — `src/modules/ChartsLab/utils/rows.ts` is the adapter that does it.

## Why

These primitives are the seed of the design system, and a component that imports the campaign domain
can only ever be used by the campaign domain. `MetricCard` does not need to know what a Snapshot is
to draw a figure beside a shape; it needs values, a grade per point and a label.

The grade type is the test of this. `ChartTone` is declared in `src/components/charts/types.ts` and
is structurally identical to the domain's `Zone`, so a caller holding a `Zone` passes it straight in
with no conversion — but the dependency arrow points one way only.

## Colour still comes from one place

Domain-free is not palette-free. `TONE_STROKE` maps each grade to a CSS custom property, and
Recharts writes that `var()` into the SVG attribute, so the charts read the same single palette
source as every other surface ([ADR-0020](0020-css-tokens-are-the-single-palette-source.md)) and
colour still means Zone and nothing else ([ADR-0019](0019-colour-is-spent-on-zone-only.md)).

The redesign's own tokens — `--chart-surface`, `--chart-grid`, `--chart-grid-dotted`, `--chart-halo-
opacity`, `--chart-halo-blur`, `--chart-fill-opacity`, `--chart-fill-blur`,
`--text-4xl`/`--text-5xl`, `--tracking-figure` — are **additive**. Nothing already in
`src/styles/index.css` changed value, so no existing screen moved a pixel when they landed, and
promoting the redesign later is a matter of replacing usages rather than unpicking overrides.

## Consequences

- Every page using these primitives writes an adapter. That duplication is the price of the boundary
  and is deliberate: the adapter is where the domain rules live, and it is testable without a DOM.
- A `ChartTone` that drifts from `Zone` is a defect. They are two names for one four-valued idea,
  and the day they disagree the compiler will not notice.
