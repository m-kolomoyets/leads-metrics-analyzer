import type { Viewer } from './scope';
import { DIMENSION_DENIED } from './denial';
import { assertRollupRead, ROLLUP_ONLY, rollupDimensionFor } from './dimensionRollup';

// External-behavior tests (ADR-0005/0007) for the T7 (#9) dimension-scoping seam. Designer and BDM
// are barred from every dollar table (campaign/account/geo) and instead read a single company-wide
// roll-up keyed by the one non-dollar dimension their `scopeFor` descriptor carries — Creative for a
// Designer, Offer for a BDM. Every viewer that still holds a dollar dimension (head/team_lead/buyer)
// uses the full Snapshot read path and gets `null` here, never a restricted roll-up.

describe('rollupDimensionFor', () => {
    const cases: Array<{ name: string; viewer: Viewer; expected: string | null }> = [
        {
            name: 'designer rolls up by creative only',
            viewer: { id: 'u-des', role: 'designer' },
            expected: 'creative',
        },
        {
            name: 'bdm rolls up by offer only',
            viewer: { id: 'u-bdm', role: 'bdm' },
            expected: 'offer',
        },
        {
            name: 'head holds dollar dimensions — no restricted roll-up',
            viewer: { id: 'u-head', role: 'head' },
            expected: null,
        },
        {
            name: 'team_lead holds dollar dimensions — no restricted roll-up',
            viewer: { id: 'u-tl', role: 'team_lead', teamId: 't-1' },
            expected: null,
        },
        {
            name: 'buyer holds dollar dimensions — no restricted roll-up',
            viewer: { id: 'u-buyer', role: 'buyer' },
            expected: null,
        },
    ];

    it.each(cases)('$name', ({ viewer, expected }) => {
        expect(rollupDimensionFor(viewer)).toBe(expected);
    });
});

// The per-buyer dimension reads behind the Dynamics page's dollar-free frames (#10). Both refusals
// are external behavior: a Designer who asks for offers must be REFUSED, never handed an empty table
// that reads as "this buyer ran none".
describe('assertRollupRead', () => {
    const designer: Viewer = { id: 'u-des', role: 'designer' };
    const bdm: Viewer = { id: 'u-bdm', role: 'bdm' };

    it('lets a designer read creatives', () => {
        expect(assertRollupRead(designer, 'creative')).toBe('creative');
    });

    it('lets a bdm read offers', () => {
        expect(assertRollupRead(bdm, 'offer')).toBe('offer');
    });

    it('denies a designer asking for offers', () => {
        expect(() => {
            return assertRollupRead(designer, 'offer');
        }).toThrow(DIMENSION_DENIED);
    });

    it('denies a bdm asking for creatives', () => {
        expect(() => {
            return assertRollupRead(bdm, 'creative');
        }).toThrow(DIMENSION_DENIED);
    });

    it.each([
        { name: 'head', viewer: { id: 'u-head', role: 'head' } as Viewer },
        { name: 'team_lead', viewer: { id: 'u-tl', role: 'team_lead', teamId: 't-1' } as Viewer },
        { name: 'buyer', viewer: { id: 'u-buyer', role: 'buyer' } as Viewer },
    ])('sends a $name back to the fact path', ({ viewer }) => {
        expect(() => {
            return assertRollupRead(viewer, 'offer');
        }).toThrow(ROLLUP_ONLY);
    });
});
