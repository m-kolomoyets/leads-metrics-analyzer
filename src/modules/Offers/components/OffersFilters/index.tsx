import type { OfferClaimFilter, OfferDeadlineFilter } from '../../schemas';
import type { OfferFilterOption, OffersFiltersProps } from './types';
import { SearchIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Segmented, SegmentedItem } from '@/components/ui/Segmented';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

// Select values must be non-empty, so "no filter" travels as this sentinel and is mapped back to
// `undefined` (absent from the URL) on the way out. Ids are uuids, so it can collide with nothing.
const ANY = 'any';

const DEADLINE_OPTIONS: { value: OfferDeadlineFilter; label: string }[] = [
    { value: 'none', label: 'No deadline' },
    { value: 'any', label: 'Has deadline' },
    { value: 'due-soon', label: 'Due soon' },
    { value: 'overdue', label: 'Overdue' },
];

const CLAIM_OPTIONS: { value: OfferClaimFilter; label: string }[] = [
    { value: 'yes', label: 'Has claim' },
    { value: 'no', label: 'No claim' },
];

type FilterSelectProps = {
    label: string;
    anyLabel: string;
    value: string | undefined;
    options: OfferFilterOption[];
    onChange: (value: string | undefined) => void;
};

function FilterSelect({ label, anyLabel, value, options, onChange }: FilterSelectProps) {
    const items = [{ value: ANY, label: anyLabel }, ...options];

    return (
        <Select
            items={items}
            value={value ?? ANY}
            onValueChange={(next) => {
                onChange(next === ANY ? undefined : (next as string));
            }}
        >
            <SelectTrigger aria-label={label} className="w-auto min-w-36">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {items.map((item) => {
                    return (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
}

// The directory's controls (PRD stories 11, 13, 14). Every change goes out through `onChange` and
// lands in the URL, so a sliced view is shareable and survives a reload — same contract as the feed's
// range. The team and buyer options come from the cards the viewer can see, so the picker never names
// a team or person the viewer could not otherwise find here.
function OffersFilters({ search, onChange, teams, buyers }: OffersFiltersProps) {
    const isFiltered =
        search.q !== undefined ||
        search.team !== undefined ||
        search.buyer !== undefined ||
        search.deadline !== undefined ||
        search.claim !== undefined;

    function handleClear() {
        onChange({ archived: search.archived });
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-56 flex-1 sm:max-w-80">
                <SearchIcon
                    className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2"
                    aria-hidden="true"
                />
                <Input
                    type="search"
                    aria-label="Search by offer id or text"
                    placeholder="Search id or text"
                    autoComplete="off"
                    className="pl-8"
                    value={search.q ?? ''}
                    onChange={(e) => {
                        const q = e.target.value;

                        // Whitespace-only is the same as empty: it matches everything and should
                        // not sit in the URL.
                        onChange({ ...search, q: q.trim() === '' ? undefined : q });
                    }}
                />
            </div>

            <FilterSelect
                label="Team"
                anyLabel="Any team"
                value={search.team}
                options={teams}
                onChange={(team) => {
                    // A buyer belongs to one team; keeping a buyer from another team would make the
                    // two filters contradict each other and match nothing.
                    onChange({ ...search, team, buyer: undefined });
                }}
            />
            <FilterSelect
                label="Buyer"
                anyLabel="Any buyer"
                value={search.buyer}
                options={buyers}
                onChange={(buyer) => {
                    onChange({ ...search, buyer });
                }}
            />
            <FilterSelect
                label="Deadline"
                anyLabel="Any deadline"
                value={search.deadline}
                options={DEADLINE_OPTIONS}
                onChange={(deadline) => {
                    onChange({ ...search, deadline: deadline as OfferDeadlineFilter | undefined });
                }}
            />
            <FilterSelect
                label="Advertiser claim"
                anyLabel="Any claim"
                value={search.claim}
                options={CLAIM_OPTIONS}
                onChange={(claim) => {
                    onChange({ ...search, claim: claim as OfferClaimFilter | undefined });
                }}
            />

            {isFiltered && (
                <Button type="button" size="xs" variant="ghost" onClick={handleClear}>
                    <XIcon data-icon="inline-start" />
                    Clear
                </Button>
            )}

            <Segmented label="Archived" className="ml-auto">
                <SegmentedItem
                    selected={!search.archived}
                    onSelect={() => {
                        onChange({ ...search, archived: false });
                    }}
                >
                    Live
                </SegmentedItem>
                <SegmentedItem
                    selected={search.archived}
                    onSelect={() => {
                        onChange({ ...search, archived: true });
                    }}
                >
                    Archived
                </SegmentedItem>
            </Segmented>
        </div>
    );
}

export { OffersFilters };
