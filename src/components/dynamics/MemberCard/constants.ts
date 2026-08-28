import type { BuyerTabState } from '@/modules/Dynamics/utils/buyerTabs';
import { REPORT_DUE_HOUR, STALE_AFTER_HOURS } from '@/modules/Dynamics/utils/buyerTabs';

// The card's vocabulary: what the person's state is TODAY, said in colour and in words. Colour is
// arithmetic, never magnitude — one dollar of loss is red, zero is green — and nothing on the card
// grades a figure by size, because a card holds no scale to grade one against.
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
