import type { Ruleset } from './index';
import type { GeoThresholds, ThresholdPair } from './types';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { creativesFor, parseCreative } from './creatives';
import { analyze } from './index';

// #35 golden tests: per-Geo creative table over the hand-verified `*big*` CSVs. FB Spend/Impressions
// are real; the KT funnel is allocated by Spend share, so allocated installs reconcile to each
// campaign's installs (Σ share = 1). Money asserts exact; allocated uniques with tolerance.

const REF = resolve(__dirname, '../../../references');
function fixture(name: string): string {
    return readFileSync(resolve(REF, name), 'utf-8');
}
const FB = fixture('FB.csv');
const KT_MAIN = fixture('KT_main.csv');
const KT_CLICKS = fixture('KT_Clicks.csv');

function pair(gy: number, yr: number): ThresholdPair {
    return { gy, yr };
}
const IN_THRESHOLDS: GeoThresholds = {
    installs: pair(2, 4),
    regs: pair(5, 10),
    sales: pair(30, 60),
    clicks: pair(0.2, 0.5),
};
const KR_THRESHOLDS: GeoThresholds = {
    installs: pair(10, 14),
    regs: pair(14, 25),
    sales: pair(100, 250),
    clicks: pair(4, 6),
};
const RULESET: Ruleset = {
    thresholds: { IN: IN_THRESHOLDS, KR: KR_THRESHOLDS },
    commission: { defaultCommission: 0.06, sellers: [] },
    reviewMultiplier: 2,
};

const result = analyze([FB, KT_MAIN, KT_CLICKS], RULESET);
function geoRows(code: string, thresholds: GeoThresholds) {
    const facts = result.facts.filter((f) => {
        return f.geo === code;
    });
    return creativesFor(facts, result.campaignCreatives, thresholds);
}

describe('parseCreative', () => {
    it('extracts CC_NN key + country prefix from a decorated ad name', () => {
        expect(parseCreative('🇮🇳 IN_93 [FortuneGems]')).toEqual({ key: 'IN_93', cc: 'IN' });
    });
    it('returns null when no key is present', () => {
        expect(parseCreative('generic banner')).toBeNull();
    });
});

describe('creativesFor — golden', () => {
    const inRows = geoRows('IN', IN_THRESHOLDS);
    const krRows = geoRows('KR', KR_THRESHOLDS);

    it('emits one row per creative key, Spend⁺-desc', () => {
        expect(inRows.length).toBeGreaterThan(0);
        const keys = inRows.map((r) => {
            return r.key;
        });
        expect(new Set(keys).size).toBe(keys.length);
        for (let i = 1; i < inRows.length; i++) {
            expect(inRows[i - 1].metrics.spendPlus).toBeGreaterThanOrEqual(inRows[i].metrics.spendPlus);
        }
    });

    it('every IN creative carries the IN prefix', () => {
        for (const row of inRows) {
            expect(row.cc).toBe('IN');
            expect(row.key.startsWith('IN_')).toBe(true);
        }
    });

    it('real Spend sums to the Geo attributed Spend (creatives cover every campaign)', () => {
        const rowSpend = inRows.reduce((sum, r) => {
            return sum + r.metrics.spend;
        }, 0);
        // Attributed Spend excludes untagged (which carries no FB spend anyway).
        const attributed = result.geos.find((g) => {
            return g.geo === 'IN';
        });
        expect(rowSpend).toBeCloseTo(attributed?.attributed.spend ?? -1, 1);
    });

    it('allocated installs reconcile to the Geo attributed installs (allocation invariant)', () => {
        const rowInstalls = inRows.reduce((sum, r) => {
            return sum + r.metrics.installs;
        }, 0);
        const factInstalls = result.facts
            .filter((f) => {
                return f.geo === 'IN';
            })
            .reduce((sum, f) => {
                return sum + f.installs;
            }, 0);
        expect(rowInstalls).toBeCloseTo(factInstalls, 4);
    });

    it('CPM uses Spend⁺ ÷ Impressions; CTR uses allocated clicks ÷ Impressions', () => {
        for (const row of inRows) {
            if (row.impressions > 0) {
                expect(row.cpm).toBeCloseTo((row.metrics.spendPlus / row.impressions) * 1000, 6);
                expect(row.ctr).toBeCloseTo((row.metrics.linkClicks / row.impressions) * 100, 6);
            } else {
                expect(row.cpm).toBeNull();
                expect(row.ctr).toBeNull();
            }
        }
    });

    it('verdict zone matches verdictFor on the creative metrics', () => {
        for (const row of inRows) {
            expect(['green', 'yellow', 'red', 'neutral']).toContain(row.verdict.verdict);
        }
        expect(krRows.length).toBeGreaterThan(0);
    });

    it('grades neutral when the Geo has no thresholds', () => {
        const facts = result.facts.filter((f) => {
            return f.geo === 'IN';
        });
        const rows = creativesFor(facts, result.campaignCreatives, undefined);
        for (const row of rows) {
            expect(row.verdict.verdict).toBe('neutral');
        }
    });
});
