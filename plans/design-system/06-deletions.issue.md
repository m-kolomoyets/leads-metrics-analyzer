# Deletions — remove what the new system has no place for

**Depends on 05. Land last.**

## What to build

Nothing. Remove:

- `src/components/BackgroundCanvas/` — 189 lines painting nine drifting blue blobs and a masked grid
  behind an app whose one real canvas is the chart. Glass existed because something moved behind it;
  with glass gone the blobs are a per-frame repaint spending contrast on nothing, in the one colour
  ADR-0019 took off the chrome budget.
- `src/context/BackgroundContext.tsx` and its provider wiring.
- `SidebarProfile/components/BackgroundItem/` — the toggle it drove.
- Any token, keyframe or utility left unreferenced after slices 03–05.

The theme switcher stays. It is a preference and an accessibility affordance; the blobs were
decoration pointing the opposite way from the goal.

Then verify the system holds: `pnpm knip` should find nothing orphaned, and a grep for the deleted
vocabulary should come back empty across the whole tree.

## Acceptance criteria

- [ ] `BackgroundCanvas`, `BackgroundContext` and `BackgroundItem` are gone, with no dangling imports
- [ ] Theme switcher still works, both directions, persisted
- [ ] `pnpm knip` reports no new unused files or exports
- [ ] `grep -rE 'glass|glow-soft|surface-accent|backdrop-filter|pill-|font-mono|rounded-(xl|2xl|3xl|4xl)|font-bold' src` is empty
- [ ] `pnpm tsc`, `pnpm lint`, `pnpm test:run` and `pnpm build` all pass
