import type { PresetSubject } from './presetAccess';
import type { Viewer } from './scope';
import { presetAccessFor } from './presetAccess';

// External-behavior tests (ADR-0005/0007) for the T5 preset authorization seam. `presetAccessFor`
// composes `scopeFor` (row + dimension scope) with preset ownership into a single verdict:
//   - the owner always gets 'edit';
//   - a teammate / in-scope viewer also gets 'edit' — visibility grants edit (a preset is a shared
//     team tool and every write appends an immutable version);
//   - a viewer outside the row scope, or one whose dimensions exclude the dollar tables
//     (designer/bdm), gets 'none'.

const OWNER = 'u-owner';
const TEAM = 't-1';

const owned: PresetSubject = { ownerUserId: OWNER, teamId: TEAM };
const otherOwnerSameTeam: PresetSubject = { ownerUserId: 'u-mate', teamId: TEAM };
const otherTeam: PresetSubject = { ownerUserId: 'u-x', teamId: 't-2' };

describe('presetAccessFor', () => {
    const cases: Array<{ name: string; viewer: Viewer; preset: PresetSubject; expected: string }> = [
        {
            name: 'owner edits their own preset',
            viewer: { id: OWNER, role: 'buyer', teamId: TEAM },
            preset: owned,
            expected: 'edit',
        },
        {
            name: 'buyer sees only their own presets, not a teammate’s',
            viewer: { id: OWNER, role: 'buyer', teamId: TEAM },
            preset: otherOwnerSameTeam,
            expected: 'none',
        },
        {
            name: 'team_lead edits any preset in its team',
            viewer: { id: 'u-tl', role: 'team_lead', teamId: TEAM },
            preset: otherOwnerSameTeam,
            expected: 'edit',
        },
        {
            name: 'team_lead cannot see a preset from another team',
            viewer: { id: 'u-tl', role: 'team_lead', teamId: TEAM },
            preset: otherTeam,
            expected: 'none',
        },
        {
            name: 'team_lead editing their own preset gets edit',
            viewer: { id: OWNER, role: 'team_lead', teamId: TEAM },
            preset: owned,
            expected: 'edit',
        },
        {
            name: 'head edits every preset in any team',
            viewer: { id: 'u-head', role: 'head' },
            preset: otherTeam,
            expected: 'edit',
        },
        {
            name: 'designer is denied dollar-dimension presets entirely',
            viewer: { id: 'u-des', role: 'designer' },
            preset: otherTeam,
            expected: 'none',
        },
        {
            name: 'bdm is denied dollar-dimension presets entirely',
            viewer: { id: 'u-bdm', role: 'bdm' },
            preset: otherTeam,
            expected: 'none',
        },
    ];

    it.each(cases)('$name', ({ viewer, preset, expected }) => {
        expect(presetAccessFor(viewer, preset)).toBe(expected);
    });
});
