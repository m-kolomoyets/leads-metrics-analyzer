# Idea 9 — "Stop writing `if (role === 'admin')` — write a policy seam instead"

**Angle:** teach-by-pattern
**Evidence:** ADR-0007 (single access policy seam), ADR-0009 (single route, scope-branched)

## LinkedIn (compact essay)

Five user roles. Two need dollar figures and every table; two see no dollars and one rolled-up dimension; one sees everything. The tempting move is `if (role === 'headOfSales')` scattered across every component that renders a number.

We centralized it instead: one function, `scopeFor(viewer)`, returns a descriptor of what that viewer is allowed to see — which dimensions, whether cost columns render. Every component branches on that descriptor, never on a role string.

It paid off immediately on a separate decision: should the dollar-visible roles and the no-dollar roles get one route or two? They share nothing at the data layer — one uploads a CSV and computes client-side, the other reads a server-side rollup. But they share everything at the shell layer: nav entry, page chrome, auth guard, empty states.

One route. The component reads `scopeFor(viewer)` and switches on the returned shape — not on `role`. Adding a sixth role later means teaching `scopeFor` about it once; every consumer already branches on the descriptor it returns.

Takeaway: when access rules touch more than one place, don't compare role strings at each call site — model the policy as data, computed once, and branch on that data everywhere else.

#SoftwareEngineering #SystemDesign #AccessControl #ReactArchitecture

## Twitter/X thread

1/ Five user roles, different data visible to each. The tempting code: `if (role === 'headOfSales')` sprinkled across every component that shows a number.

2/ We centralized it instead: one `scopeFor(viewer)` function returns a descriptor — which dimensions this viewer sees, whether dollar columns render at all.

3/ Every component branches on that descriptor's shape. Never on a raw role string.

4/ Paid off on a real fork: dollar roles and no-dollar roles share nothing at the data layer (client CSV compute vs. server rollup) — but share everything at the shell (nav, chrome, auth guard).

5/ Answer: one route. It reads `scopeFor(viewer)` and switches on what comes back. Not on role.

6/ Add a 6th role later? Teach `scopeFor` once. Every consumer already branches on its output — nothing else to touch.

7/ Rule: when access logic touches more than one place, don't compare role strings at each site. Model the policy as data, compute it once, branch on that everywhere.
