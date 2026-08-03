import { activeGeo } from './activeGeo';

// The `geo` search param names the tab a link lands on (spec story 12). It comes off the URL, so it
// is whatever someone typed — the rule is that it selects a tab only when the Snapshot actually
// covers that market, and never blanks the page.

describe('activeGeo', () => {
    it('selects the requested geo when the snapshot covers it', () => {
        expect(activeGeo(['KR', 'IN'], 'IN')).toBe('IN');
    });

    it('falls back to the first geo when none was requested', () => {
        expect(activeGeo(['KR', 'IN'], undefined)).toBe('KR');
    });

    it('falls back to the first geo when the requested one is not in the snapshot', () => {
        expect(activeGeo(['KR', 'IN'], 'BR')).toBe('KR');
    });

    it('matches a lower-case request, since a geo is ISO-2 upper-case everywhere else', () => {
        expect(activeGeo(['KR', 'IN'], 'in')).toBe('IN');
    });

    it('reads a snapshot with no geo as no active tab', () => {
        expect(activeGeo([], 'KR')).toBeNull();
    });
});
