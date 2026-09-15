import type { FillModePickerProps } from './types';
import { MAP_FILL_MODES } from '@/lib/domain/mapFill';
import { Segmented, SegmentedItem } from '@/components/ui/Segmented';
import { FILL_MODE_HINTS, FILL_MODE_LABELS } from '../../constants';

// The map's fill mode (PRD story 50): what the strength of a wash means. Three plain words; the
// hint on hover says the rule, the legend below the map says it again in the mode's own paint.
function FillModePicker({ mode, onChange }: FillModePickerProps) {
    return (
        <Segmented label="Map fill">
            {MAP_FILL_MODES.map((token) => {
                return (
                    <SegmentedItem
                        key={token}
                        selected={token === mode}
                        title={FILL_MODE_HINTS[token]}
                        onSelect={() => {
                            onChange(token);
                        }}
                        className="px-2 py-0.5 text-xs"
                    >
                        {FILL_MODE_LABELS[token]}
                    </SegmentedItem>
                );
            })}
        </Segmented>
    );
}

export { FillModePicker };
