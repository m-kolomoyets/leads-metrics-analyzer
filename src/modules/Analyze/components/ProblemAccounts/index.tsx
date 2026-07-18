import type { AccountRollup } from '@/lib/domain/accounts';
import type { Locale } from '../../utils/i18n';
import { usd } from '../../utils/format';
import { problemReason, ui } from '../../utils/i18n';

type ProblemAccountsProps = {
    accounts: AccountRollup[];
    locale: Locale;
};

// Top-of-geo alarm strip: the accounts flagged Problem (doc 04), so a buyer sees broken tracking /
// launches before scrolling the roll-up. Recomputes with exclusions since it reads the same rollups.
function ProblemAccounts({ accounts, locale }: ProblemAccountsProps) {
    const flagged = accounts.filter((account) => {
        return account.problem !== null;
    });
    if (flagged.length === 0) {
        return null;
    }

    return (
        <div className="rounded-xl border border-red-500/40 bg-red-500/5 p-3">
            <p className="mb-2 text-sm font-semibold text-red-500">
                🚨 {ui('problemAccounts', locale)} ({flagged.length})
            </p>
            <ul className="flex flex-col gap-1 text-xs">
                {flagged.map((account) => {
                    return (
                        <li key={account.account} className="text-muted-foreground">
                            <span className="text-foreground font-mono">{account.account}</span>{' '}
                            {usd(account.metrics.spend)} ·{' '}
                            {problemReason(account.problem!, account.metrics.spendPlus, account.metrics.cpi, locale)}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export { ProblemAccounts };
