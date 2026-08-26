import type { DynamicsMode } from '../types';
import { Segmented, SegmentedItem } from '@/components/ui/Segmented';

// The header's chart mode toggle (SPEC §6.4). It affects the chart and nothing else — not the
// comparison panel, not the sparklines, not the tables — which is why it is a two-state control with
// no memory rather than a page-wide setting.

const MODES: { mode: DynamicsMode; label: string; hint: string }[] = [
    {
        mode: 'cumulative',
        label: 'Cumulative',
        hint: 'Each push as the day so far, 00:00 to its own time.',
    },
    {
        mode: 'delta',
        label: 'Between reports',
        hint: 'Each push as what changed since the one before it.',
    },
];

type ModeToggleProps = {
    mode: DynamicsMode;
    onSelect: (mode: DynamicsMode) => void;
};

function ModeToggle({ mode, onSelect }: ModeToggleProps) {
    return (
        <Segmented label="Chart mode" mode="toggle">
            {MODES.map((option) => {
                return (
                    <SegmentedItem
                        key={option.mode}
                        selected={option.mode === mode}
                        title={option.hint}
                        className="text-xs"
                        onSelect={() => {
                            onSelect(option.mode);
                        }}
                    >
                        {option.label}
                    </SegmentedItem>
                );
            })}
        </Segmented>
    );
}

export { ModeToggle };
