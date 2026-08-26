import type { BuyerTab, BuyerTabState } from '@/modules/Dynamics/utils/buyerTabs';
import { DASH, usdSigned } from '@/components/report/utils/format';
import { Segmented, SegmentedItem } from '@/components/ui/Segmented';

// The buyer tab row — the point of the page (SPEC §6.2). One tab per person the viewer may see, the
// team lead among them under their own nickname with no special label or position. Each tab carries
// the nickname and the day's total profit, and the row is already ordered problems-first by
// `buyerTabs`, so a lead reading left to right meets trouble before success.
//
// The colour is arithmetic, never magnitude: one dollar of loss is red, zero is green.

// A tab states its Zone in its text and nowhere else — no border, no fill. The selected tab is the
// `ui/Segmented` wash, so "which buyer am I reading" and "how is that buyer doing" are two different
// channels and a row of eight graded tabs is not a row of eight alarms.
const STATE_CLASS: Record<BuyerTabState, string> = {
    missing: 'text-zone-red',
    stale: 'text-zone-yellow',
    loss: 'text-zone-red',
    profit: 'text-zone-green',
    // Reported, ungraded: the dollar-free roles have no total to colour by, so the tab states the
    // fact of the push and claims nothing about it.
    reported: 'text-foreground',
    awaited: 'text-muted-foreground',
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
        <Segmented label="Buyer">
            {tabs.map((tab) => {
                const marker = STATE_MARKER[tab.state];

                return (
                    <SegmentedItem
                        key={tab.id}
                        selected={tab.id === activeId}
                        className={STATE_CLASS[tab.state]}
                        onSelect={() => {
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
                            <span className="text-xs tabular-nums opacity-80">
                                {tab.totalProfit === null ? DASH : usdSigned(tab.totalProfit)}
                            </span>
                        )}
                    </SegmentedItem>
                );
            })}
        </Segmented>
    );
}

export { BuyerTabs };
