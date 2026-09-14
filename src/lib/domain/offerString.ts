// The offer string parser (offers-and-home PRD §Offer Cards). A BDM pastes the string an advertiser
// issued — `CL | Aldex | CPA | 27 USD | 5000 CLP | ... | Falcons | MbChips` — and the card keeps it
// verbatim as its caption. Exactly two things are read out of it and nothing else (PRD out of scope):
//   Payout     — the first USD/EUR amount. The second money value (`5000 CLP`) is the payment
//                system's minimum in local currency and takes no part in any figure.
//   Assignment — the last two non-empty `|` segments: team, then recipient. A recipient equal to
//                the team means the whole team; anything else names one buyer by nickname.
// Resolution against real teams and users happens server-side; this seam is pure and stays so.

export type OfferCurrency = 'USD' | 'EUR';

type OfferPayout = {
    amount: number;
    currency: OfferCurrency;
};

// `recipient` is null for a team-wide offer; otherwise the raw handle the string named.
export type OfferAssignment = {
    team: string;
    recipient: string | null;
};

type ParsedOfferString = {
    payout: OfferPayout;
    assignment: OfferAssignment;
};

// Which fragment could not be read — the error the author sees names it.
export type OfferStringFragment = 'payout' | 'assignment';

export type OfferStringParse = { ok: true; value: ParsedOfferString } | { ok: false; fragment: OfferStringFragment };

// `(\d+(?:[.,]\d+)?)\s*(USD|EUR)` from the request, first match wins. Case-insensitive so a hand-typed
// `27 usd` still parses; the amount may carry a comma decimal.
const PAYOUT_RE = /(\d+(?:[.,]\d+)?)\s*(USD|EUR)/i;
const SEGMENT_SEPARATOR = '|';

// The payout plus where it ends — the Assignment is read from the tail after it, so the payout
// segment can never be mistaken for a team name (`CPA | 27 USD | Falcons` has no recipient).
const parsePayout = (raw: string): { payout: OfferPayout; end: number } | null => {
    const match = PAYOUT_RE.exec(raw);

    if (!match) {
        return null;
    }

    const amount = Number(match[1].replace(',', '.'));
    const currency = match[2].toUpperCase() as OfferCurrency;

    return Number.isFinite(amount) ? { payout: { amount, currency }, end: match.index + match[0].length } : null;
};

// Team and recipient compare the way nicknames do — trimmed and case-folded — so `Falcons | FALCONS`
// is a team-wide offer, not a buyer called "FALCONS".
const isSameHandle = (a: string, b: string): boolean => {
    return a.trim().toLowerCase() === b.trim().toLowerCase();
};

const parseAssignment = (tail: string): OfferAssignment | null => {
    const segments = tail
        .split(SEGMENT_SEPARATOR)
        .map((segment) => {
            return segment.trim();
        })
        .filter(Boolean);

    if (segments.length < 2) {
        return null;
    }

    const team = segments[segments.length - 2];
    const recipient = segments[segments.length - 1];

    return { team, recipient: isSameHandle(team, recipient) ? null : recipient };
};

export const parseOfferString = (raw: string): OfferStringParse => {
    const found = parsePayout(raw);

    if (!found) {
        return { ok: false, fragment: 'payout' };
    }

    const assignment = parseAssignment(raw.slice(found.end));

    if (!assignment) {
        return { ok: false, fragment: 'assignment' };
    }

    return { ok: true, value: { payout: found.payout, assignment } };
};
