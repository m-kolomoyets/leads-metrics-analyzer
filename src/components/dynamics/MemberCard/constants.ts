import type { BuyerTabState } from '@/modules/Dynamics/utils/buyerTabs';
import type { MemberDayState } from '@/modules/Dynamics/utils/memberDays';
import { REPORT_DUE_HOUR, STALE_AFTER_HOURS } from '@/modules/Dynamics/utils/buyerTabs';

// The dot grid's palette and vocabulary, in one table so the drawn colour and the spoken word cannot
// drift apart. Every state is said in BOTH channels: a month of colour is unreadable to a reader who
// gets none of it, and a grid is thirty small marks with no text beside them.

export const DOT_CLASS: Record<MemberDayState, string> = {
    // A slot, not a mark: the day has not happened, so there is nothing to report about it yet. The
    // grid keeps its full width all month rather than growing a dot a day, and the slot is the
    // faintest thing on the card — present enough to hold the shape, quiet enough not to be read.
    future: 'bg-zone-green/10',
    // The unreported day is the grid's ground, and it is a dimmed green rather than a neutral grey:
    // the whole month is then ONE colour at two strengths, so what the eye picks out is the lit days
    // and not a change of hue. Quiet by design — a missing day is the absence of a report, and thirty
    // absences must not read as thirty alarms. The card's own state marker is where "this person has
    // not reported" is said loudly, and it says it about today, the only day anyone can still act on.
    unreported: 'bg-zone-green/25',
    ungraded: 'bg-zone-neutral',
    // A graded day is lit: the fill AND the halo, so the month's shape survives being glanced at
    // from across a desk. The three ungraded states above stay flat on purpose — the glow is what
    // separates a day that was judged from the ground it is read against, and a grid where every dot
    // glowed would have thirty signals and no shape.
    green: 'bg-zone-green glow-dot-green',
    yellow: 'bg-zone-yellow glow-dot-yellow',
    red: 'bg-zone-red glow-dot-red',
};

export const DOT_LABEL: Record<MemberDayState, string> = {
    future: 'not yet',
    unreported: 'no report',
    ungraded: 'reported, not graded',
    green: 'green',
    yellow: 'yellow',
    red: 'red',
};

// The states a dot is worth opening a day on. A day nobody reported has no report to open, so it is
// drawn and not linked — which also keeps a month grid from spending thirty tab stops on nothing.
export const OPENABLE_STATES: MemberDayState[] = ['ungraded', 'green', 'yellow', 'red'];

// The card header's half of the vocabulary: what the person's state is TODAY. Colour is arithmetic,
// never magnitude — one dollar of loss is red, zero is green — and the magnitude grading lives in the
// grid below, where a whole month is there to give it a scale.
export const STATE_CLASS: Record<BuyerTabState, string> = {
    missing: 'text-zone-red',
    stale: 'text-zone-yellow',
    loss: 'text-zone-red',
    profit: 'text-zone-green',
    // Reported, ungraded: the dollar-free roles have no total to colour by, so the card states the
    // fact of the push and claims nothing about it.
    reported: 'text-foreground',
    awaited: 'text-muted-foreground',
};

// The marker that says WHY a figure is coloured, so the state survives a reader who cannot separate
// red from amber. Both are also spelled out in the card's accessible text.
export const STATE_MARKER: Partial<Record<BuyerTabState, string>> = {
    missing: '?',
    stale: '⚠',
};

// What the marker is warning ABOUT, in the reader's own words and with the number it was decided by
// in it. A glyph that will not say what it means is a glyph a reader learns to ignore, and both of
// these are the page's one call to action: go and talk to this person.
export const STATE_HINT: Partial<Record<BuyerTabState, string>> = {
    missing: `Nothing pushed for today, and it is past ${REPORT_DUE_HOUR}:00 in Kyiv.`,
    stale: `The latest push is more than ${STALE_AFTER_HOURS} hours old. It is not wrong — a Snapshot restates the day so far — only behind.`,
};

export const STATE_LABEL: Record<BuyerTabState, string> = {
    missing: 'no report today',
    stale: 'data older than three hours',
    loss: 'at a loss',
    profit: 'in profit',
    reported: 'reported today',
    awaited: 'no report yet',
};
