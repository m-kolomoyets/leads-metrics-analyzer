# `/design` route — the workbench and the checklist

**Depends on 01. Blocks nothing, but every later slice is verified here.**

## What to build

A route rendering the whole system on one page: every token as a labelled swatch, and every `ui/`
primitive in every state it can be in — resting, hover, focus-visible, disabled, invalid, loading,
open — with both themes visible at once rather than behind the switcher.

This is not a demo page. It is the migration's definition of done: 23 primitives × 2 themes × states
is not a matrix anyone checks by clicking through the real app, and the light theme is where a
half-migrated component hides (ADR-0019's amber problem lives here too). A primitive is migrated when
it looks right on this page, not when the one screen using it looks right.

Sections: colour tokens (chrome, accent, Zone, both themes side by side), type scale with the weight
ramp, radius steps, the two surface levels next to each other, focus treatment, icon sizes at
`strokeWidth={1.5}`, then the primitives.

Decide and note in the file header whether this ships under `_authenticated` or is dev-only — either
is fine, but it should be a stated choice rather than an accident.

## Acceptance criteria

- [ ] Route renders every token in `docs/design-system.md` as a labelled swatch
- [ ] Every `ui/` primitive appears, in every state it supports
- [ ] Light and dark render side by side without toggling
- [ ] Zone swatches show their contrast ratio against their own surface
- [ ] The page is the checklist used by slices 03–05
- [ ] `pnpm tsc` and `pnpm lint` pass
