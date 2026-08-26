# `ui/` primitives — retune all 23

**Depends on 01 and 02. Parallelizable with 04 and 05.**

## What to build

Walk every component in `src/components/ui/` and bring it onto the new tokens, checking each off in
`/design`.

The mechanical part, everywhere:

- radius → `sm`/`md`/`lg` only; the 13 `rounded-2xl`, 4 `rounded-xl` and 1 `rounded-4xl` call sites
  retune, `rounded-full` survives on avatars only;
- `font-bold` → `font-semibold`, all 35 occurrences; 700 leaves the vocabulary;
- lucide icons get `strokeWidth={1.5}`. Decide once whether that is a thin `Icon` wrapper or a pass
  over call sites — a wrapper is preferred because it cannot drift;
- focus collapses to one treatment: 2px `--accent` ring, 1px offset. `ring-3` (7 uses), `ring-2`
  (5), `ring-ring/50` (4) and `ring-sidebar` (5) all become it. Held at 2px on purpose — WCAG 2.2
  focus appearance, not an aesthetic call;
- transitions 120–160ms, state changes only.

The judgement part: each primitive is either **inline** (border + surface, no shadow) or **overlay**
(border + `--shadow-overlay`). Popover, DropdownMenu, Dialog, Sheet, Tooltip and Toast are overlays;
everything else is inline. A primitive that seems to want a third level is a design smell — push
back rather than adding a token (ADR-0021).

Also add a `ui/Table` primitive here — pull shadcn's `table` as the base rather than writing it — so
slice 05 has something to migrate onto. It owns density, hairline row rules (no zebra), right-aligned
`tabular-nums` numerics, small grey column heads, sticky header and the total-row rule.

## Acceptance criteria

- [ ] All 23 primitives render correctly in `/design`, both themes, every state
- [ ] No `rounded-xl`/`2xl`/`3xl`/`4xl` remains in `src/`
- [ ] No `font-bold` remains in `src/`
- [ ] Exactly one focus treatment across all primitives
- [ ] Every lucide icon renders at `strokeWidth={1.5}`
- [ ] Only overlay primitives carry a shadow; no inline surface does
- [ ] `ui/Table` exists with tabular numerics and hairline rules
- [ ] `pnpm tsc` and `pnpm lint` pass
