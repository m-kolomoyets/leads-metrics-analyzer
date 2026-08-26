# Tokens and utilities — the flat achromatic base

**Blocks everything else. Land first.**

## What to build

Rewrite `src/styles/index.css` to the palette in [`docs/design-system.md`](../../docs/design-system.md).

Declare the chrome, accent, Zone, elevation, radius and type tokens for `:root` and `.dark`. The
chrome is true neutral grey — no cool cast. Two surfaces (`--surface`, `--surface-overlay`), two
borders (`--border`, `--border-strong`), one shadow (`--shadow-overlay`), and nothing else that
expresses depth (ADR-0021).

**Delete, do not reskin:** the `surface-glass`, `surface-accent`, `glass-tint`, `tint-*`, `pill`,
`pill-*` and `glow-soft` utilities, the `glow-fade` keyframes, and every `backdrop-filter`. They
encode a depth model that no longer exists. The app will look broken until slice 03 lands — that is
expected on this branch (no compatibility aliases, deliberately).

`pulse-red` survives, reworked: border-opacity only, no glow `::after`, lower amplitude, slower.

Collapse the radius scale to `sm`/`md`/`lg` (2/4/6px) with `--radius: 0.25rem`. Remove `--radius-xl`
through `--radius-4xl` from `@theme inline` so those utilities stop existing.

Drop the Roboto Mono `<link>` from `src/routes/__root.tsx` and narrow the Inter request to
`wght@400..600`.

Amber is the invented Zone colour and the riskiest value in the system — measure it, in both themes,
before calling this done.

## Acceptance criteria

- [ ] `:root` and `.dark` carry the full token set from `docs/design-system.md`
- [ ] `grep -rE 'glass|surface-accent|glow-soft|backdrop-filter|pill' src/styles/index.css` is empty
- [ ] No `--radius-xl`/`2xl`/`3xl`/`4xl` in `@theme inline`
- [ ] Roboto Mono no longer requested; Inter requested at `wght@400..600`
- [ ] Only one shadow token exists in the file
- [ ] `pulse-red` animates border opacity only, no box-shadow, and is disabled under `prefers-reduced-motion`
- [ ] Both themes' Zone colours measured ≥4.5:1 against their own surface, with amber distinguishable from teal and red under deuteranopia
- [ ] `pnpm lint:stylelint` passes
