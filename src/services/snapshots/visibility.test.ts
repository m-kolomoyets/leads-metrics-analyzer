import type { SQL } from 'drizzle-orm';
import type { Viewer } from '@/lib/auth/scope';
import { PgDialect } from 'drizzle-orm/pg-core';
import { describe, expect, it } from 'vitest';
import { scopeFor } from '@/lib/auth/scope';
import {
    activeSnapshotsOnly,
    listSnapshotsFilter,
    matchesNoRows,
    readableSnapshotFilter,
    rosterSnapshotJoinOn,
    userRowFilter,
} from './visibility';

// Renders a clause to SQL text with its parameters inlined, so a test can assert on the predicate
// rather than on `$1`. No connection is opened — `PgDialect` is pure string building.
const dialect = new PgDialect();

const render = (clause: SQL | undefined): string => {
    if (!clause) {
        return '';
    }

    const { sql, params } = dialect.sqlToQuery(clause);

    return params.reduce<string>((text, param, index) => {
        return text.replaceAll(`$${index + 1}`, String(param));
    }, sql);
};

const ACTIVE = '"snapshot"."status" = active';

const buyer: Viewer = { id: 'buyer-1', role: 'buyer', teamId: 'team-1' };
const lead: Viewer = { id: 'lead-1', role: 'team_lead', teamId: 'team-1' };
const head: Viewer = { id: 'head-1', role: 'head', teamId: null };

describe('activeSnapshotsOnly', () => {
    it('filters on the lifecycle column', () => {
        expect(render(activeSnapshotsOnly())).toContain(ACTIVE);
    });
});

// The Snapshot list, the Report feed and the archive all read through this one filter, so covering it
// covers all three: the feed and the archive differ only in how they group the rows it returns.
describe('listSnapshotsFilter', () => {
    it('excludes replaced snapshots for a buyer, alongside the own-rows scope', () => {
        const clause = render(listSnapshotsFilter(scopeFor(buyer)));

        expect(clause).toContain(ACTIVE);
        expect(clause).toContain('"snapshot"."created_by_user_id" = buyer-1');
    });

    it('excludes replaced snapshots for a team lead, alongside the stamped-team scope', () => {
        const clause = render(listSnapshotsFilter(scopeFor(lead)));

        expect(clause).toContain(ACTIVE);
        expect(clause).toContain('"snapshot"."team_id" = team-1');
    });

    it('excludes replaced snapshots for the head too — a superseded push counts for nobody', () => {
        expect(render(listSnapshotsFilter(scopeFor(head)))).toContain(ACTIVE);
    });
});

describe('rosterSnapshotJoinOn', () => {
    it('keeps the lifecycle filter in the join so the last push reported ignores replaced snapshots', () => {
        const clause = render(rosterSnapshotJoinOn());

        expect(clause).toContain(ACTIVE);
        expect(clause).toContain('"snapshot"."created_by_user_id" = "user"."id"');
    });
});

describe('readableSnapshotFilter', () => {
    it('hides a replaced snapshot from its own author — it is no longer openable as a report', () => {
        expect(render(readableSnapshotFilter(buyer))).toContain(ACTIVE);
    });

    it('hides a replaced snapshot from a team lead', () => {
        expect(render(readableSnapshotFilter(lead))).toContain(ACTIVE);
    });

    it('lets the head read a replaced snapshot for audit', () => {
        expect(readableSnapshotFilter(head)).toBeUndefined();
    });

    it('applies to a dollar-barred role, which is not the head despite its all-rows scope', () => {
        expect(render(readableSnapshotFilter({ id: 'd', role: 'designer' }))).toContain(ACTIVE);
    });
});

// The roster half of the row-scope axis: the same rule as `snapshotRowFilter`, spelled over `user`.
describe('userRowFilter', () => {
    it('pins a buyer to their own user row', () => {
        expect(render(userRowFilter(scopeFor(buyer)))).toContain('"user"."id" = buyer-1');
    });

    it('scopes a lead to their team', () => {
        expect(render(userRowFilter(scopeFor(lead)))).toContain('"user"."team_id" = team-1');
    });

    it('applies no filter for the head', () => {
        expect(render(userRowFilter(scopeFor(head)))).toBe('');
    });
});

describe('matchesNoRows', () => {
    it('is true only for a team-scope viewer with no team', () => {
        expect(matchesNoRows(scopeFor({ id: 'lead-2', role: 'team_lead', teamId: null }))).toBe(true);
        expect(matchesNoRows(scopeFor(lead))).toBe(false);
        expect(matchesNoRows(scopeFor(buyer))).toBe(false);
        expect(matchesNoRows(scopeFor(head))).toBe(false);
    });
});

// The Dynamics tab row joins the same roster for a single day: a buyer with no push today must
// still come back as a row reading "missing", which is why the day rides in the ON clause.
describe('rosterSnapshotJoinOn with a report date', () => {
    it('narrows the join to that day, keeping the lifecycle filter', () => {
        const clause = render(rosterSnapshotJoinOn('2026-08-26'));

        expect(clause).toContain('"snapshot"."report_date" = 2026-08-26');
        expect(clause).toContain(ACTIVE);
    });

    it('joins every day when no date is given', () => {
        expect(render(rosterSnapshotJoinOn())).not.toContain('report_date');
    });
});
