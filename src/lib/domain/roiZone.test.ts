import { roiZone } from './roiZone';

// ROI zones (offers-and-home PRD): `< −20` red, `−20…+30` yellow, `> +30` green. Both edges sit in
// yellow — the constants are exclusive on the way out, not inclusive on the way in.
describe('roiZone', () => {
    it('is neutral when ROI is unknown', () => {
        expect(roiZone(null)).toBe('neutral');
        expect(roiZone(Number.NaN)).toBe('neutral');
    });

    it('is red below −20', () => {
        expect(roiZone(-20.01)).toBe('red');
        expect(roiZone(-100)).toBe('red');
    });

    it('is yellow from −20 through +30, edges included', () => {
        expect(roiZone(-20)).toBe('yellow');
        expect(roiZone(0)).toBe('yellow');
        expect(roiZone(30)).toBe('yellow');
    });

    it('is green above +30', () => {
        expect(roiZone(30.01)).toBe('green');
        expect(roiZone(250)).toBe('green');
    });
});
