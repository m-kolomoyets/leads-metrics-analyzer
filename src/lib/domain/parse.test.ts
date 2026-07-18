import { detectType, num, parseFiles } from './parse';

describe('num', () => {
    it('strips $ and whitespace', () => {
        expect(num('$1,234.50')).toBeCloseTo(1234.5);
        expect(num(' 6 704.20 ')).toBeCloseTo(6704.2);
    });
    it('treats comma as decimal only when no dot present', () => {
        expect(num('4,85')).toBeCloseTo(4.85);
        expect(num('1,234')).toBeCloseTo(1.234); // no dot → comma is the decimal
        expect(num('1,234.50')).toBeCloseTo(1234.5); // dot present → comma is thousands
    });
    it('non-numeric and empty → 0', () => {
        expect(num('')).toBe(0);
        expect(num('abc')).toBe(0);
        expect(num(null)).toBe(0);
    });
});

describe('detectType', () => {
    it('routes by columns, not drop-zone', () => {
        expect(detectType(['Country', 'Amount spent (USD)', 'Campaign ID'])).toBe('fb');
        expect(detectType(['Sub ID 2', 'Offer ID', 'Revenue'])).toBe('kt-main');
        expect(detectType(['Sub ID 2', 'ROI (confirmed)'])).toBe('kt-clicks');
        expect(detectType(['nonsense'])).toBeNull();
    });
});

describe('parseFiles hygiene', () => {
    const fb =
        'Country,Account ID,Campaign ID,Ad name,Amount spent (USD),Impressions,Reporting starts,Reporting ends\n,,,,999,0,2026-07-01,2026-07-16\nIN,acc1,c1,Ad A,10.5,100,2026-07-01,2026-07-16';
    const ktMain =
        'Country;Sub ID 2;Sub ID 4;Sub ID 5;Offer ID;Offer;OS;Clicks;UC (campaign);Conv.;Sales;Revenue\n' +
        'India;;;;363;WWL;GNU/Linux;6;6;0;0;0\n' + // totals (empty Sub ID 2)
        'India;c1;acc1;IN_1;363;WWL;;5;5;0;0;0\n' + // invalid (empty OS)
        'India;c1;acc1;IN_1;363;WWL;Android;5;3;1;0;120\n' +
        'India;{sub2};accX;IN_9;363;WWL;Android;2;2;0;0;50'; // unfired macro

    it('drops Totals (empty Country) FB rows and keeps real ones', () => {
        const out = parseFiles([fb]);
        expect(out.fb).toHaveLength(1);
        expect(out.fb[0].spend).toBe(10.5);
    });

    it('drops Totals + Invalid KT rows, tags unfired macro, resolves geo', () => {
        const out = parseFiles([ktMain]);
        expect(out.ktMain).toHaveLength(2); // one real + one macro; totals & invalid dropped
        const macro = out.ktMain.find((r) => {
            return r.unfiredMacro;
        });
        expect(macro?.geo).toBe('IN');
        expect(out.ktMain[0].geo).toBe('IN');
    });
});
