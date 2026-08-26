import type { DynamicsMode } from '../types';
import { cn } from '@/lib/utils/cn';

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
        <div className="border-border flex rounded-lg border p-0.5" role="group" aria-label="Chart mode">
            {MODES.map((option) => {
                const selected = option.mode === mode;

                return (
                    <button
                        key={option.mode}
                        type="button"
                        aria-pressed={selected}
                        title={option.hint}
                        className={cn(
                            'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                            selected ? 'surface-accent text-white' : 'text-muted-foreground hover:text-foreground'
                        )}
                        onClick={() => {
                            onSelect(option.mode);
                        }}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}

export { ModeToggle };
