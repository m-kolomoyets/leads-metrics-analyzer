import { resolvePeriod } from './period';

// The Home period (offers-and-home/13, PRD story 46): a calendar month, not a rolling window. The
// feed's `range`/`from`/`to` params are reused verbatim so a custom window links across pages; only
// the token vocabulary differs.

describe('resolvePeriod', () => {
    it('resolves `month` to the whole calendar month today sits in', () => {
        expect(resolvePeriod({ range: 'month' }, '2026-09-15')).toEqual({ from: '2026-09-01', to: '2026-09-30' });
        expect(resolvePeriod({ range: 'month' }, '2028-02-10')).toEqual({ from: '2028-02-01', to: '2028-02-29' });
    });

    it('resolves `last-month` to the previous calendar month, across a year boundary', () => {
        expect(resolvePeriod({ range: 'last-month' }, '2026-09-15')).toEqual({
            from: '2026-08-01',
            to: '2026-08-31',
        });
        expect(resolvePeriod({ range: 'last-month' }, '2026-01-03')).toEqual({
            from: '2025-12-01',
            to: '2025-12-31',
        });
    });

    it('takes a custom window as given, ordered, and fills a missing edge with today', () => {
        expect(resolvePeriod({ range: 'custom', from: '2026-09-03', to: '2026-09-09' }, '2026-09-15')).toEqual({
            from: '2026-09-03',
            to: '2026-09-09',
        });
        expect(resolvePeriod({ range: 'custom', from: '2026-09-09', to: '2026-09-03' }, '2026-09-15')).toEqual({
            from: '2026-09-03',
            to: '2026-09-09',
        });
        expect(resolvePeriod({ range: 'custom', from: '2026-09-03' }, '2026-09-15')).toEqual({
            from: '2026-09-03',
            to: '2026-09-15',
        });
        expect(resolvePeriod({ range: 'custom' }, '2026-09-15')).toEqual({ from: '2026-09-15', to: '2026-09-15' });
    });
});
