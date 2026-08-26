import type { SQL } from 'drizzle-orm';
import type { Viewer } from '@/lib/auth/scope';
import { PgDialect } from 'drizzle-orm/pg-core';
import { describe, expect, it } from 'vitest';
import { scopeFor } from '@/lib/auth/scope';
import { dynamicsDayFilter, dynamicsDayTotalsFilter, visibleBuyerFilter } from './visibility';

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

const buyer: Viewer = { id: 'buyer-1', role: 'buyer', teamId: 'team-1' };
const lead: Viewer = { id: 'lead-1', role: 'team_lead', teamId: 'team-1' };
const teamlessLead: Viewer = { id: 'lead-2', role: 'team_lead', teamId: null };
const head: Viewer = { id: 'head-1', role: 'head', teamId: null };

// The scope matrix, read off the clause each role produces. A buyer asking for another buyer's day
// matches no row and is reported not-found by the handler; nothing here says "forbidden".
describe('visibleBuyerFilter', () => {
    it('pins a buyer to their own row', () => {
        const clause = render(visibleBuyerFilter(scopeFor(buyer), 'buyer-2'));

        expect(clause).toContain('"user"."id" = buyer-2');
        expect(clause).toContain('"user"."id" = buyer-1');
    });

    it('lets a lead reach any active member of their team', () => {
        const clause = render(visibleBuyerFilter(scopeFor(lead), 'buyer-9'));

        expect(clause).toContain('"user"."team_id" = team-1');
        expect(clause).toContain('"user"."status" = active');
    });

    it('lets a lead reach themselves through the same team clause, with no special case', () => {
        expect(render(visibleBuyerFilter(scopeFor(lead), 'lead-1'))).toContain('"user"."team_id" = team-1');
    });

    it('constrains the head to the asked-for buyer only', () => {
        const clause = render(visibleBuyerFilter(scopeFor(head), 'buyer-9'));

        expect(clause).toContain('"user"."id" = buyer-9');
        expect(clause).not.toContain('team_id');
    });

    it('binds an empty team for a teamless lead, so no user matches', () => {
        expect(render(visibleBuyerFilter(scopeFor(teamlessLead), 'buyer-9'))).toContain('"user"."team_id" = ');
    });
});

describe('dynamicsDayFilter', () => {
    it('filters the day on report_date, never taken_at', () => {
        const clause = render(dynamicsDayFilter(scopeFor(head), 'buyer-1', '2026-08-26'));

        expect(clause).toContain('"snapshot"."report_date" = 2026-08-26');
        expect(clause).not.toContain('taken_at');
    });

    it('excludes replaced snapshots for every role, the head included', () => {
        for (const viewer of [buyer, lead, head]) {
            expect(render(dynamicsDayFilter(scopeFor(viewer), 'buyer-1', '2026-08-26'))).toContain(
                '"snapshot"."status" = active'
            );
        }
    });

    it('carries the row-scope of the viewer alongside the buyer it was asked for', () => {
        expect(render(dynamicsDayFilter(scopeFor(buyer), 'buyer-2', '2026-08-26'))).toContain(
            '"snapshot"."created_by_user_id" = buyer-1'
        );
        expect(render(dynamicsDayFilter(scopeFor(lead), 'buyer-2', '2026-08-26'))).toContain(
            '"snapshot"."team_id" = team-1'
        );
    });
});

// The tab row reads every visible buyer's day at once, so its filter must narrow on exactly the two
// axes the single-buyer read does, minus the buyer.
describe('dynamicsDayTotalsFilter', () => {
    it('keeps the lifecycle and date filters and pins nobody in particular', () => {
        const clause = render(dynamicsDayTotalsFilter(scopeFor(head), '2026-08-26'));

        expect(clause).toContain('"snapshot"."status" = active');
        expect(clause).toContain('"snapshot"."report_date" = 2026-08-26');
        expect(clause).not.toContain('created_by_user_id');
    });

    it('still holds a lead to their own team', () => {
        expect(render(dynamicsDayTotalsFilter(scopeFor(lead), '2026-08-26'))).toContain(
            '"snapshot"."team_id" = team-1'
        );
    });

    it('still holds a buyer to their own pushes', () => {
        expect(render(dynamicsDayTotalsFilter(scopeFor(buyer), '2026-08-26'))).toContain(
            '"snapshot"."created_by_user_id" = buyer-1'
        );
    });
});
