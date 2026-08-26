import type { Locale } from '@/components/report/utils/i18n';
import type { AccountRollup } from '@/lib/domain/accounts';
import { cn } from '@/lib/utils/cn';
import { usd } from '@/components/report/utils/format';
import { problemReason, ui } from '@/components/report/utils/i18n';

type ProblemAccountsProps = {
    accounts: AccountRollup[];
    locale: Locale;
    // The analyst's triage marks. Omitted on a read-only report: Reviewed is an analyst's private
    // progress note and never leaves Analyze (spec story 34), so nothing here is struck through and
    // the header counts every flagged account as outstanding.
    isReviewed?: (account: string) => boolean;
};

// Top-of-geo alarm strip: the accounts flagged Problem (doc 04), so a buyer sees broken tracking /
// launches before scrolling the roll-up. Recomputes with exclusions since it reads the same rollups.
// It is a worklist, so reviewing an account strikes it through rather than removing it — the pass
// stays auditable, and the header counts what is still outstanding.
function ProblemAccounts({ accounts, locale, isReviewed }: ProblemAccountsProps) {
    const flagged = accounts.filter((account) => {
        return account.problem !== null;
    });
    if (flagged.length === 0) {
        return null;
    }
    const outstanding = flagged.filter((account) => {
        return !isReviewed?.(account.account);
    }).length;

    return (
        <section className="glass-tint tint-red rounded-lg p-4">
            <p className="text-danger mb-2.5 text-[13px] font-normal tracking-widest uppercase">
                🚨 {ui('problemAccounts', locale)} ({outstanding}/{flagged.length})
            </p>
            <ul className="flex flex-col gap-1 text-xs">
                {flagged.map((account) => {
                    const reviewed = isReviewed?.(account.account) ?? false;
                    return (
                        <li
                            key={account.account}
                            className={cn('text-muted-foreground', reviewed && 'line-through opacity-60')}
                        >
                            <span className="text-foreground font-mono">{account.account}</span>{' '}
                            {usd(account.metrics.spendPlus)} ·{' '}
                            {problemReason(account.problem!, account.metrics.spendPlus, account.metrics.cpi, locale)}
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

export { ProblemAccounts };
