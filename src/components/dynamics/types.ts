// How the chart reads a day. Shared across the Dynamics component family because the toggle that
// sets it lives in the page header while the only thing it affects is the chart (SPEC §6.4/§6.6).
//
// `cumulative` is the honest picture of the day: a Snapshot covers 00:00 to its own push time, so a
// bad morning keeps dragging on it. `delta` answers a different and equally true question — what is
// this buyer buying right now. Both numbers are correct; they answer different questions, and the
// toggle is what lets a lead ask the second one.
export type DynamicsMode = 'cumulative' | 'delta';
