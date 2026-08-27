import type { LocaleSwitchProps } from './types';
import { LOCALES } from '@/components/report/utils/i18n';
import { Segmented, SegmentedItem } from '@/components/ui/Segmented';

// Which language the report surfaces speak, on the four pages that speak two. It was four copies of
// the same button row, and four copies is four chances for one of them to drift — the header is the
// place a reader learns the app's shape, so the same control has to be the same object everywhere.
//
// A `Segmented`, like every other row of choices in the app: the chosen locale wears `--hover-strong`
// and the rest are flat text. Where the choice is KEPT differs by page — the URL on `/analyze`, a
// stored preference on the feed — and that stays the caller's business.
function LocaleSwitch({ locale, onSelect }: LocaleSwitchProps) {
    return (
        <Segmented label="Language" mode="toggle">
            {LOCALES.map((code) => {
                return (
                    <SegmentedItem
                        key={code}
                        selected={code === locale}
                        onSelect={() => {
                            onSelect(code);
                        }}
                    >
                        {code.toUpperCase()}
                    </SegmentedItem>
                );
            })}
        </Segmented>
    );
}

export { LocaleSwitch };
