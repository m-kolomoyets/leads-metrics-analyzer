import type { Locale } from '@/components/report/utils/i18n';
import type { ReportDateGroup } from '@/modules/Dashboard/types';
import { SnapshotCard } from '@/modules/Dashboard/components/SnapshotCard';
import { ui } from '@/components/report/utils/i18n';

type DateGroupProps = {
    group: ReportDateGroup;
    locale: Locale;
};

// One day of data: the people who reported for it, and every Snapshot each of them pushed — including
// re-pushes, newest push first (spec stories 22–24).
//
// Nothing collapses here. The archive is the audit trail, and an overseer opening it has already named
// the window they care about; hiding rows behind a disclosure would only add a click to every lookup.
function DateGroup({ group, locale }: DateGroupProps) {
    return (
        <section className="border-border flex flex-col gap-4 rounded-lg border p-4">
            <h2 className="text-base font-semibold tabular-nums">{group.reportDate}</h2>

            {group.users.map(({ user, cards }) => {
                return (
                    <div key={user.id} className="flex flex-col gap-3">
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-foreground text-base font-semibold">{user.nickname}</h3>
                            {/* Shown only when a day carries more than one push from the same person.
                                That IS the archive's signal — a correction — and labelling the single
                                push "1 push" would bury it in noise the feed already covers. */}
                            {cards.length > 1 && (
                                <span className="text-muted-foreground text-xs">
                                    {cards.length} {ui('pushes', locale)}
                                </span>
                            )}
                        </div>

                        {cards.map((card) => {
                            return <SnapshotCard key={card.snapshotId} card={card} locale={locale} from="archive" />;
                        })}
                    </div>
                );
            })}
        </section>
    );
}

export { DateGroup };
