import type { Viewer } from './scope';
import { describe, expect, it } from 'vitest';
import { assertDimension, deniesDimension, DIMENSION_DENIED } from './denial';
import { scopeFor } from './scope';

const buyer: Viewer = { id: 'buyer-1', role: 'buyer', teamId: 'team-1' };
const lead: Viewer = { id: 'lead-1', role: 'team_lead', teamId: null };
const head: Viewer = { id: 'head-1', role: 'head', teamId: null };
const designer: Viewer = { id: 'designer-1', role: 'designer', teamId: null };
const bdm: Viewer = { id: 'bdm-1', role: 'bdm', teamId: null };

describe('deniesDimension', () => {
    it('denies the dollar dimensions to designer and bdm', () => {
        expect(deniesDimension(scopeFor(designer), 'campaign')).toBe(true);
        expect(deniesDimension(scopeFor(bdm), 'campaign')).toBe(true);
    });

    it('allows each role the dimension its own scope carries', () => {
        expect(deniesDimension(scopeFor(designer), 'creative')).toBe(false);
        expect(deniesDimension(scopeFor(bdm), 'offer')).toBe(false);
    });

    it('allows the dollar roles, a teamless lead included', () => {
        for (const viewer of [buyer, lead, head]) {
            expect(deniesDimension(scopeFor(viewer), 'campaign')).toBe(false);
        }
    });
});

describe('assertDimension', () => {
    // The whole point of the conversion: a barred role gets a refusal, never an empty result that
    // would read as "nobody reported anything today".
    it('throws the denial for a barred role', () => {
        expect(() => {
            return assertDimension(scopeFor(designer), 'campaign');
        }).toThrow(DIMENSION_DENIED);
    });

    it('passes silently for a role that carries the dimension', () => {
        expect(() => {
            return assertDimension(scopeFor(buyer), 'campaign');
        }).not.toThrow();
    });
});
