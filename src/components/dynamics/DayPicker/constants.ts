import type { HeatDayState } from '@/modules/Dynamics/utils/heatDays';

// The calendar's palette and vocabulary, in one table so the painted square and the spoken word
// cannot drift apart. Every state is said in BOTH channels: a month of colour is unreadable to a
// reader who gets none of it, and a grid of thirty squares carries no text beside the day number.

// The squares are filled rather than tinted — this is a heatmap, and a month read at a glance has to
// separate a green day from an amber one across a desk. The digit flips to the page's ground colour
// on the three graded states, which is the only way it stays legible on a saturated fill in both
// themes.
// The hover keeps the state's OWN fill, never the app's grey ghost-button wash: on a heatmap the
// fill is the datum, and a cell that turns grey under the pointer reads as a cell that lost its
// grade. Each state therefore restates its background at `hover:` — that beats the Button variant's
// `hover:bg-accent` on merge — and the shade itself is `heat-shade`, an inset wash on the background
// alone (see `styles/index.css`). The text colour is restated at `hover:` for the same reason the
// background is: the ghost variant lifts it to `--foreground`, which on a filled square is the one
// change that makes the figure unreadable at exactly the moment it is being pointed at.
export const DAY_HEAT_CLASS: Record<HeatDayState, string> = {
    // Later this month: nothing has happened, so the square is a slot rather than a mark. Not
    // disabled-looking on purpose — it is simply empty.
    future: 'text-muted-foreground/60 hover:bg-transparent hover:text-muted-foreground/60',
    // The month has passed this day and nobody pushed. The faintest wash of the grid's own green, so
    // the absences hold the shape of the month without reading as thirty alarms.
    unreported: 'bg-zone-green/12 hover:bg-zone-green/12 text-muted-foreground hover:text-muted-foreground',
    // Reported, and nothing to grade it on — a day with no Spend⁺, or a push that froze no rollup.
    // Said apart from `unreported` deliberately: a reported day must never read as a missing one.
    ungraded: 'bg-zone-neutral/45 hover:bg-zone-neutral/45 text-foreground hover:text-foreground',
    green: 'bg-zone-green hover:bg-zone-green text-background hover:text-background',
    yellow: 'bg-zone-yellow hover:bg-zone-yellow text-background hover:text-background',
    red: 'bg-zone-red hover:bg-zone-red text-background hover:text-background',
};

export const DAY_HEAT_LABEL: Record<HeatDayState, string> = {
    future: 'not yet',
    unreported: 'no report',
    ungraded: 'reported, not graded',
    green: 'green',
    yellow: 'yellow',
    red: 'red',
};
