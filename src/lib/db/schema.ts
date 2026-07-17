// Drizzle schema — server-side only. Tables are added per ticket:
//   T2 (#3)  — user, session
//   T4a (#5) — team
//   T5 (#7)  — preset, preset_version, shared_settings, shared_settings_version
//   T6 (#8)  — snapshot, snapshot_fact, applied_ruleset, applied_ruleset_geo
// See docs/specs/0001-multi-user-auth-teams-persistence.md and docs/adr/0002, 0006, 0007.
//
// Empty for now: T1 establishes the migration + connection tooling only.

export {};
