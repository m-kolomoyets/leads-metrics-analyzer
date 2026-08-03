import type { Locale } from '@/components/report/utils/i18n';
import type { RangeToken, ReportRange } from '../../types';
import { ui } from '@/components/report/utils/i18n';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { RANGE_TOKENS } from '../../types';

type RangePickerProps = {
    range: ReportRange;
    onChange: (next: ReportRange) => void;
    locale: Locale;
};

// The token labels, keyed to the i18n bag. Static map rather than a template so the keys stay
// greppable and the strings stay in one file.
const TOKEN_LABEL: Record<RangeToken, string> = {
    '1d': 'range1d',
    '3d': 'range3d',
    '7d': 'range7d',
    '30d': 'range30d',
    all: 'rangeAll',
    custom: 'rangeCustom',
};

// The range control. Every change goes back out through `onChange` and lands in the URL, so a view is
// shareable and survives a reload (spec stories 20, 21).
function RangePicker({ range, onChange, locale }: RangePickerProps) {
    function selectToken(token: RangeToken) {
        // Switching to a token drops the custom edges: leaving them in the URL would make a `7d` link
        // carry dates that mean nothing, and pasting it back would look like a bug.
        onChange(token === 'custom' ? { range: 'custom', from: range.from, to: range.to } : { range: token });
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1" role="group" aria-label={ui('range', locale)}>
                {RANGE_TOKENS.map((token) => {
                    return (
                        <Button
                            key={token}
                            type="button"
                            size="xs"
                            variant={token === range.range ? 'default' : 'ghost'}
                            aria-pressed={token === range.range}
                            onClick={() => {
                                selectToken(token);
                            }}
                        >
                            {ui(TOKEN_LABEL[token], locale)}
                        </Button>
                    );
                })}
            </div>

            {range.range === 'custom' && (
                <div className="flex flex-wrap items-center gap-2">
                    <Label htmlFor="report-range-from" className="text-muted-foreground text-xs">
                        {ui('rangeFrom', locale)}
                    </Label>
                    <Input
                        id="report-range-from"
                        type="date"
                        className="h-8 w-40"
                        value={range.from ?? ''}
                        onChange={(event) => {
                            onChange({ ...range, from: event.target.value || undefined });
                        }}
                    />
                    <Label htmlFor="report-range-to" className="text-muted-foreground text-xs">
                        {ui('rangeTo', locale)}
                    </Label>
                    <Input
                        id="report-range-to"
                        type="date"
                        className="h-8 w-40"
                        value={range.to ?? ''}
                        onChange={(event) => {
                            onChange({ ...range, to: event.target.value || undefined });
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export { RangePicker };
