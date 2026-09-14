import { parseOfferString } from './offerString';

// The offer string parser (offers-and-home PRD §Offer Cards). Exactly two things come out of the
// string: the Payout (first USD/EUR amount) and the Assignment (last two non-empty `|` segments);
// everything else stays verbatim on the card as its caption. A miss on either is a typed failure
// naming the fragment, so the author knows what to fix — and nothing is saved.
describe('parseOfferString', () => {
    const FULL =
        'CL | Aldex | RegForm (Slot) | CPA | 27 USD | 5000 CLP | total | 30 | Android | ALL | | | KPI Yes | Falcons | Falcons';

    it('reads a USD payout and a team-wide assignment', () => {
        expect(parseOfferString(FULL)).toEqual({
            ok: true,
            value: {
                payout: { amount: 27, currency: 'USD' },
                assignment: { team: 'Falcons', recipient: null },
            },
        });
    });

    it('reads a EUR payout', () => {
        const parsed = parseOfferString('CPA | 25 EUR | Falcons | Falcons');

        expect(parsed.ok && parsed.value.payout).toEqual({ amount: 25, currency: 'EUR' });
    });

    it('ignores a local-currency amount after the USD one', () => {
        const parsed = parseOfferString('CPA | 27 USD | 5000 CLP | Falcons | Falcons');

        expect(parsed.ok && parsed.value.payout).toEqual({ amount: 27, currency: 'USD' });
    });

    it('takes the first USD/EUR amount when several appear', () => {
        const parsed = parseOfferString('CPA | 5000 CLP | 30 EUR | 27 USD | Falcons | Falcons');

        expect(parsed.ok && parsed.value.payout).toEqual({ amount: 30, currency: 'EUR' });
    });

    it('accepts a comma decimal and a glued currency', () => {
        const parsed = parseOfferString('CPA | 12,50USD | Falcons | Falcons');

        expect(parsed.ok && parsed.value.payout).toEqual({ amount: 12.5, currency: 'USD' });
    });

    it('matches the currency code case-insensitively', () => {
        const parsed = parseOfferString('CPA | 27 usd | Falcons | Falcons');

        expect(parsed.ok && parsed.value.payout).toEqual({ amount: 27, currency: 'USD' });
    });

    it('names the payout fragment when no USD/EUR amount is present', () => {
        expect(parseOfferString('CPA | 5000 CLP | Falcons | Falcons')).toEqual({ ok: false, fragment: 'payout' });
    });

    it('reads a buyer assignment when the recipient differs from the team', () => {
        const parsed = parseOfferString('CPA | 27 USD | KPI Yes | Falcons | MbChips');

        expect(parsed.ok && parsed.value.assignment).toEqual({ team: 'Falcons', recipient: 'MbChips' });
    });

    it('treats a recipient equal to the team (any case, padded) as team-wide', () => {
        const parsed = parseOfferString('CPA | 27 USD |  falcons  | FALCONS ');

        expect(parsed.ok && parsed.value.assignment).toEqual({ team: 'falcons', recipient: null });
    });

    it('skips trailing empty segments', () => {
        const parsed = parseOfferString('CPA | 27 USD | Falcons | MbChips | | ');

        expect(parsed.ok && parsed.value.assignment).toEqual({ team: 'Falcons', recipient: 'MbChips' });
    });

    it('names the assignment fragment when fewer than two segments follow the payout', () => {
        expect(parseOfferString('CPA | 27 USD | Falcons')).toEqual({ ok: false, fragment: 'assignment' });
        expect(parseOfferString('27 USD')).toEqual({ ok: false, fragment: 'assignment' });
    });

    it('reports the payout miss before the assignment miss', () => {
        expect(parseOfferString('')).toEqual({ ok: false, fragment: 'payout' });
    });
});
