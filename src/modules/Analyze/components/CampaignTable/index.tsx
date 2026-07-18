import type { Fact, GeoThresholds } from '@/lib/domain/types';
import { metricsFor } from '@/lib/domain/aggregate';
import { verdictFor } from '@/lib/domain/verdict';
import { cn } from '@/lib/utils/cn';
import { cost, money, reasonText, ZONE_CLASS } from '../../utils/format';

type CampaignTableProps = {
    facts: Fact[];
    // The geo's active thresholds, or undefined when no preset is saved (rows grade neutral).
    thresholds: GeoThresholds | undefined;
};

const COLUMNS = ['Campaign ID', 'Spend', 'Rev', 'Clicks', 'Inst', 'Reg', 'Sale', 'CPC', 'CPI', 'CPR', 'CPS', 'Reason'];

// Raw, unstyled proof table (S1): the CampRow columns straight off the compute layer. CPC/CPI/CPR/CPS
// and the verdict reason are derived per-row (`Fact` carries only counts + summary zone, ADR-0010).
function CampaignTable({ facts, thresholds }: CampaignTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-right text-sm">
                <thead>
                    <tr className="border-b">
                        {COLUMNS.map((col) => {
                            return (
                                <th key={col} className={cn('p-2', col === 'Campaign ID' && 'text-left')}>
                                    {col}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {facts.map((fact) => {
                        const metrics = metricsFor(fact);
                        const verdict = thresholds
                            ? verdictFor(fact, thresholds)
                            : { zone: 'neutral' as const, reason: null };
                        return (
                            <tr
                                key={`${fact.campaign}-${fact.creative}-${fact.reportDate}`}
                                className={cn('border-b', ZONE_CLASS[verdict.zone])}
                            >
                                <td className="p-2 text-left font-mono text-xs">{fact.campaign}</td>
                                <td className="p-2">{money(fact.spend)}</td>
                                <td className="p-2">{money(fact.revenue)}</td>
                                <td className="p-2">{fact.linkClicks}</td>
                                <td className="p-2">{fact.installs}</td>
                                <td className="p-2">{fact.regs}</td>
                                <td className="p-2">{fact.sales}</td>
                                <td className="p-2">{cost(metrics.cpc)}</td>
                                <td className="p-2">{cost(metrics.cpi)}</td>
                                <td className="p-2">{cost(metrics.cpr)}</td>
                                <td className="p-2">{cost(metrics.cps)}</td>
                                <td className="p-2 text-left">{reasonText(verdict.reason)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export { CampaignTable };
