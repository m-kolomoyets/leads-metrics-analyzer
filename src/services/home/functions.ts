import type { Viewer } from '@/lib/auth/scope';
import type { MeData } from '@/services/auth/types';
import type { HomeGeoView } from './types';
import { createServerFn } from '@tanstack/react-start';
import { and, eq, gte, inArray, lte } from 'drizzle-orm';
import { seesDollarsOn } from '@/lib/auth/dollarSurface';
import { FORBIDDEN_MESSAGE, requireUser } from '@/lib/auth/guards';
import { scopeFor } from '@/lib/auth/scope';
import { db } from '@/lib/db';
import { snapshot, snapshotGeo, user } from '@/lib/db/schema';
import { kyivDay } from '@/lib/utils/kyivDay';
import { listSnapshotsFilter, matchesNoRows } from '@/services/snapshots/visibility';
import { homeRangeInputSchema } from './schemas';

// Home API (offers-and-home/13). One read: the frozen Geo Rollups a viewer may see in a window.
// Selection only (ADR-0004) — the client picks the latest push per buyer per day and sums per market.

const viewerFrom = (me: MeData): Viewer => {
    return { id: me.id, role: me.role, teamId: me.teamId };
};

// Gated by the per-surface dollar permission rather than a dimension check: BDM holds no `geo`
// dimension in `scopeFor` (which keeps the feed and Dynamics closed to them) yet reads the map, and
// the Designer, who holds `creative`, does not (PRD stories 47, 58). Row-scoped through the same
// `listSnapshotsFilter` every Snapshot read composes: a buyer gets their own pushes, so their own
// countries (story 57); a team lead their team's; bdm/head everyone's.
export const listHomeGeoFn = createServerFn({ method: 'GET' })
    .inputValidator(homeRangeInputSchema)
    .handler(async ({ data }): Promise<HomeGeoView> => {
        const me = await requireUser();

        if (!seesDollarsOn('home', me.role)) {
            throw new Error(FORBIDDEN_MESSAGE);
        }

        const scope = scopeFor(viewerFrom(me));
        const today = kyivDay();
        const empty: HomeGeoView = { today, snapshots: [], geos: [] };

        if (matchesNoRows(scope)) {
            return empty;
        }

        const pushes = await db
            .select({
                snapshotId: snapshot.id,
                buyerUserId: snapshot.createdByUserId,
                // Named here so the country panel (slice 14) reads off the same rows — no second
                // fetch for who a buyer is.
                buyerNickname: user.nickname,
                reportDate: snapshot.reportDate,
                takenAt: snapshot.takenAt,
                status: snapshot.status,
            })
            .from(snapshot)
            .innerJoin(user, eq(user.id, snapshot.createdByUserId))
            .where(
                and(listSnapshotsFilter(scope), gte(snapshot.reportDate, data.from), lte(snapshot.reportDate, data.to))
            )
            .orderBy(snapshot.takenAt);

        if (pushes.length === 0) {
            return empty;
        }

        const geos = await db
            .select({
                snapshotId: snapshotGeo.snapshotId,
                geo: snapshotGeo.geo,
                spendPlus: snapshotGeo.spendPlus,
                geoTotal: snapshotGeo.geoTotal,
            })
            .from(snapshotGeo)
            .where(
                inArray(
                    snapshotGeo.snapshotId,
                    pushes.map((row) => {
                        return row.snapshotId;
                    })
                )
            );

        return {
            today,
            snapshots: pushes.map((row) => {
                return { ...row, takenAt: row.takenAt.toISOString() };
            }),
            geos,
        };
    });
