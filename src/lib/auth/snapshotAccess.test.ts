import type { Viewer } from './scope';
import type { SnapshotSubject } from './snapshotAccess';
import { snapshotAccessFor } from './snapshotAccess';

// External-behavior tests (ADR-0005/0007) for the T6 Snapshot row-scope seam. Snapshots are
// immutable once saved, so the verdict is only 'read' | 'none' (no 'edit'). Row-scope decides
// visibility: a Buyer sees own (by creator), a Team Lead sees its team (by the Snapshot's STAMPED
// team, not the creator's current team), the Head sees all. Designer/BDM lack the dollar dimensions
// a Snapshot rolls up into, so they see none here — their creative/offer dimension-scoping is T7.

const CREATOR = 'u-creator';
const TEAM = 't-1';

const own: SnapshotSubject = { createdByUserId: CREATOR, teamId: TEAM };
const teammate: SnapshotSubject = { createdByUserId: 'u-mate', teamId: TEAM };
const otherTeam: SnapshotSubject = { createdByUserId: 'u-x', teamId: 't-2' };
const teamless: SnapshotSubject = { createdByUserId: 'u-y', teamId: null };

describe('snapshotAccessFor', () => {
    const cases: Array<{ name: string; viewer: Viewer; subject: SnapshotSubject; expected: string }> = [
        {
            name: 'buyer reads its own snapshot',
            viewer: { id: CREATOR, role: 'buyer', teamId: TEAM },
            subject: own,
            expected: 'read',
        },
        {
            name: 'buyer cannot see a teammate’s snapshot',
            viewer: { id: CREATOR, role: 'buyer', teamId: TEAM },
            subject: teammate,
            expected: 'none',
        },
        {
            name: 'team_lead reads any snapshot stamped with its team',
            viewer: { id: 'u-tl', role: 'team_lead', teamId: TEAM },
            subject: teammate,
            expected: 'read',
        },
        {
            name: 'team_lead reads a former member’s snapshot still stamped to its team',
            viewer: { id: 'u-tl', role: 'team_lead', teamId: TEAM },
            subject: own,
            expected: 'read',
        },
        {
            name: 'team_lead cannot see another team’s snapshot',
            viewer: { id: 'u-tl', role: 'team_lead', teamId: TEAM },
            subject: otherTeam,
            expected: 'none',
        },
        {
            name: 'a teamless team_lead matches no team’s snapshots',
            viewer: { id: 'u-tl', role: 'team_lead', teamId: null },
            subject: teamless,
            expected: 'none',
        },
        {
            name: 'head reads every snapshot across teams',
            viewer: { id: 'u-head', role: 'head' },
            subject: otherTeam,
            expected: 'read',
        },
        {
            name: 'designer is denied whole snapshots (dollar dimensions) — T7 scopes facts',
            viewer: { id: 'u-des', role: 'designer' },
            subject: otherTeam,
            expected: 'none',
        },
        {
            name: 'bdm is denied whole snapshots (dollar dimensions) — T7 scopes facts',
            viewer: { id: 'u-bdm', role: 'bdm' },
            subject: otherTeam,
            expected: 'none',
        },
    ];

    it.each(cases)('$name', ({ viewer, subject, expected }) => {
        expect(snapshotAccessFor(viewer, subject)).toBe(expected);
    });
});
