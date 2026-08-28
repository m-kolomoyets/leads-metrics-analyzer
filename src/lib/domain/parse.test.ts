import type { FbRow, KtMainRow } from './parse';
import { detectType, mergeParsed, num, parseFiles } from './parse';

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
        ';;;;;;;99;99;0;0;999\n' + // totals — EVERY dimension empty
        'India;;;;363;WWL;GNU/Linux;6;6;0;0;0\n' + // untagged — Sub IDs empty, Country/Offer/OS real
        'India;c1;acc1;IN_1;363;WWL;;5;5;0;0;0\n' + // invalid (empty OS)
        'India;c1;acc1;IN_1;363;WWL;Android;5;3;1;0;120\n' +
        'India;{sub2};accX;IN_9;363;WWL;Android;2;2;0;0;50'; // unfired macro

    it('drops Totals (empty Country) FB rows and keeps real ones', () => {
        const out = parseFiles([fb]);
        expect(out.fb).toHaveLength(1);
        expect(out.fb[0].spend).toBe(10.5);
    });

    it('drops Totals + Invalid KT rows, tags unfired macro and untagged, resolves geo', () => {
        const out = parseFiles([ktMain]);
        // Untagged survives (real traffic that lost its referral); only Totals and Invalid drop.
        expect(out.ktMain).toHaveLength(3);
        const macro = out.ktMain.find((r) => {
            return r.unfiredMacro;
        });
        expect(macro?.geo).toBe('IN');
        expect(macro?.untagged).toBe(false);
        const untagged = out.ktMain.find((r) => {
            return r.untagged;
        });
        expect(untagged?.geo).toBe('IN');
        expect(untagged?.unfiredMacro).toBe(false);
        expect(out.ktMain[0].geo).toBe('IN');
    });

    it('an empty-everything row is the Totals Row and never becomes data', () => {
        // Distinguished from Untagged by having no Country either — counting it doubles the report.
        const out = parseFiles([ktMain]);
        expect(
            out.ktMain.some((r) => {
                return r.revenue === 999;
            })
        ).toBe(false);
    });

    it('treats an unexpanded Sub ID template as absence, not an identity', () => {
        const kt =
            'Country;Sub ID 2;Sub ID 4;Sub ID 5;Offer ID;Offer;OS;Clicks;UC (campaign);Conv.;Sales;Revenue\n' +
            'India;{{campaign.id}};{sub_id_4};{sub_id_5};363;WWL;Android;2;2;0;0;50';
        const row = parseFiles([kt]).ktMain[0];
        expect(row.unfiredMacro).toBe(true);
        expect(row.account).toBe('');
        expect(row.creative).toBe('');
    });

    it('does not mistake pipe-delimited offer names for the delimiter', () => {
        // Narrow export: every row repeats the same offer string, so its pipe count is constant and
        // PapaParse's default guess order would pick `|` over `;` and collapse the file into one column.
        const offer = '"SG | Longfu88 | RegForm (Slot) | CPA | 200 EUR | Android | KPI Yes | Falcons"';
        const rows = ['120246681556160106', '120246681556750106', '120246681556650106'].map((sub2) => {
            return `Singapore;${sub2};1641083631350576;🇸🇬_SG_50_[WealthEastMoney];12240;${offer};Android;17;5;2;2;457.5`;
        });
        const narrowKt = [
            'Country;"Sub ID 2";"Sub ID 4";"Sub ID 5";"Offer ID";Offer;OS;Clicks;"UC (campaign)";Conv.;Sales;Revenue',
            ...rows,
        ].join('\n');

        const out = parseFiles([narrowKt]);

        expect(out.ktMain).toHaveLength(3);
        expect(out.ktMain[0].geo).toBe('SG');
        expect(out.ktMain[0].creative).toBe('🇸🇬_SG_50_[WealthEastMoney]');
        expect(out.ktMain[0].offer).toBe('12240');
        expect(out.ktMain[0].revenue).toBe(457.5);
    });

    it.each([
        [';', 'semicolon'],
        [',', 'comma'],
        ['\t', 'tab'],
        ['|', 'pipe'],
        [':', 'colon'],
    ])('routes a KT main export delimited by %s (%s)', (delimiter) => {
        const csv = [
            [
                'Country',
                'Sub ID 2',
                'Sub ID 4',
                'Sub ID 5',
                'Offer ID',
                'Offer',
                'OS',
                'Clicks',
                'UC (campaign)',
                'Conv.',
                'Sales',
                'Revenue',
            ],
            ['India', 'c1', 'acc1', 'IN_1', '363', 'WWL', 'Android', '5', '3', '1', '0', '120'],
        ]
            .map((row) => {
                return row.join(delimiter);
            })
            .join('\n');

        const out = parseFiles([csv]);

        expect(out.ktMain).toHaveLength(1);
        expect(out.ktMain[0].geo).toBe('IN');
        expect(out.ktMain[0].revenue).toBe(120);
    });
});

// One FB line, as a pull of it would arrive. Only the figures differ between two pulls of the same
// line — every keying column is identical, which is what makes it a restatement rather than a slice.
const fb = (over: Partial<FbRow> = {}): FbRow => {
    return {
        geo: 'SG',
        account: 'acc1',
        campaign: 'c1',
        creative: 'cr1',
        spend: 100,
        impressions: 1000,
        reportStart: '2026-08-26',
        reportEnd: '2026-08-26',
        ...over,
    };
};

const ktMain = (over: Partial<KtMainRow> = {}): KtMainRow => {
    return {
        campaign: 'c1',
        account: 'acc1',
        creative: 'cr1',
        offer: '363',
        offerName: 'WWL',
        os: 'Android',
        installs: 3,
        regs: 2,
        sales: 1,
        revenue: 120,
        geo: 'SG',
        unfiredMacro: false,
        untagged: false,
        ...over,
    };
};

describe('mergeParsed', () => {
    it('takes the last pull of a line rather than adding the pulls together', () => {
        const out = mergeParsed([{ fb: [fb({ spend: 100 })] }, { fb: [fb({ spend: 260 })] }]);

        expect(out.fb).toHaveLength(1);
        expect(out.fb[0].spend).toBe(260);
    });

    it('still stacks lines the later pull does not restate', () => {
        const out = mergeParsed([
            { fb: [fb({ campaign: 'c1', spend: 100 })] },
            { fb: [fb({ campaign: 'c2', spend: 40 })] },
        ]);

        expect(out.fb).toHaveLength(2);
        expect(
            out.fb.reduce((total, row) => {
                return total + row.spend;
            }, 0)
        ).toBe(140);
    });

    it('treats another day as another line — a month of exports still stacks', () => {
        const out = mergeParsed([
            { fb: [fb({ reportStart: '2026-08-25', reportEnd: '2026-08-25', spend: 90 })] },
            { fb: [fb({ reportStart: '2026-08-26', reportEnd: '2026-08-26', spend: 100 })] },
        ]);

        expect(out.fb).toHaveLength(2);
    });

    it('supersedes Keitaro lines on their own grain — the export carries no date to key on', () => {
        const out = mergeParsed([
            { ktMain: [ktMain({ revenue: 120, sales: 1 })] },
            { ktMain: [ktMain({ revenue: 300, sales: 3 })] },
        ]);

        expect(out.ktMain).toHaveLength(1);
        expect(out.ktMain[0].revenue).toBe(300);
        expect(out.ktMain[0].sales).toBe(3);
    });

    it('keeps repeated grains WITHIN one file — only a later file supersedes', () => {
        const out = mergeParsed([{ fb: [fb({ spend: 100 }), fb({ spend: 60 })] }]);

        expect(out.fb).toHaveLength(2);
    });

    it('says how many rows an older pull lost, rather than dropping them silently', () => {
        const out = mergeParsed([{ fb: [fb(), fb({ campaign: 'c2' })] }, { fb: [fb({ spend: 260 })] }]);

        expect(out.warnings).toContainEqual({ kind: 'superseded-rows', type: 'fb', rows: 1 });
    });
});
