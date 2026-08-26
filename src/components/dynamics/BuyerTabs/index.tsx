import type { BuyerTab, BuyerTabState } from '@/modules/Dynamics/utils/buyerTabs';
import { cn } from '@/lib/utils/cn';
import { DASH, usdSigned } from '@/components/report/utils/format';

// The buyer tab row — the point of the page (SPEC §6.2). One tab per person the viewer may see, the
// team lead among them under their own nickname with no special label or position. Each tab carries
// the nickname and the day's total profit, and the row is already ordered problems-first by
// `buyerTabs`, so a lead reading left to right meets trouble before success.
//
// The colour is arithmetic, never magnitude: one dollar of loss is red, zero is green.

// A tab rests on the chrome surface and reports its state in the Zone colour, in the text rather
// than as a fill — a row of eight filled tabs is a row of eight alarms.
const STATE_CLASS: Record<BuyerTabState, string> = {
    missing: 'border-zone-red bg-surface text-zone-red',
    stale: 'border-zone-yellow bg-surface text-zone-yellow',
    loss: 'border-zone-red bg-surface text-zone-red',
    profit: 'border-zone-green bg-surface text-zone-green',
    // Reported, ungraded: the dollar-free roles have no total to colour by, so the tab states the
    // fact of the push and claims nothing about it.
    reported: 'border-border bg-surface text-foreground',
    awaited: 'border-border bg-surface text-muted-foreground',
};

// The marker that says WHY a tab is coloured, so the state survives a reader who cannot separate red
// from amber. Both are also spelled out in the tab's accessible label below.
const STATE_MARKER: Record<BuyerTabState, string | null> = {
    missing: '?',
    stale: '⚠',
    loss: null,
    profit: null,
    reported: null,
    awaited: null,
};

const STATE_LABEL: Record<BuyerTabState, string> = {
    missing: 'no report today',
    stale: 'data older than three hours',
    loss: 'at a loss',
    profit: 'in profit',
    reported: 'reported today',
    awaited: 'no report yet',
};

type BuyerTabsProps = {
    tabs: BuyerTab[];
    activeId: string | null;
    onSelect: (buyerId: string) => void;
};

function BuyerTabs({ tabs, activeId, onSelect }: BuyerTabsProps) {
    return (
        <div role="tablist" aria-label="Buyer" className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
                const selected = tab.id === activeId;
                const marker = STATE_MARKER[tab.state];

                return (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        className={cn(
                            'flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium motion-safe:transition-colors motion-safe:duration-150',
                            STATE_CLASS[tab.state],
                            selected && 'border-accent bg-accent text-accent-foreground'
                        )}
                        onClick={() => {
                            onSelect(tab.id);
                        }}
                    >
                        {marker && <span aria-hidden={true}>{marker}</span>}
                        {tab.nickname}
                        {/* The state is spelled out, not only painted: colour and a marker glyph are
                            the same signal to a reader who gets neither. */}
                        <span className="sr-only">{STATE_LABEL[tab.state]}</span>
                        {/* Absent, not dashed: a viewer with no dollar dimension gets no money
                            column at all, where a dash would imply a figure that is merely missing.
                            A dash still marks a push that froze no rollup (CONTEXT.md). */}
                        {tab.totalProfit !== undefined && (
                            <span className="tabular-nums opacity-80">
                                {tab.totalProfit === null ? DASH : usdSigned(tab.totalProfit)}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export { BuyerTabs };
