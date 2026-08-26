import type { ReactNode } from 'react';

// A row of tabs picks one of several views; a row of toggles sets one of several modes. The a11y
// contract differs (`tab`/`aria-selected` vs `aria-pressed`) but the paint does not, so the shape is
// declared once here and read off the context by every item.
export type SegmentedMode = 'tabs' | 'toggle';

export type SegmentedProps = {
    // Names the row in the a11y tree — a tablist without one is an unlabelled landmark.
    label: string;
    mode?: SegmentedMode;
    className?: string;
    children: ReactNode;
};

export type SegmentedItemProps = {
    selected: boolean;
    onSelect: () => void;
    // Hover hint, used by the mode toggle to spell out what each position means.
    title?: string;
    className?: string;
    children: ReactNode;
};
