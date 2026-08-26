export type TableProps = React.ComponentProps<'table'> & {
    // Row height. `default` is the reading density; `compact` is for the long report tables where
    // the point is how many rows fit on one screen.
    density?: 'default' | 'compact';
    // The scroll container, not the table. A caller that wants a sticky header sets a max height
    // here — the header can only stick against something that scrolls.
    containerClassName?: string;
};

export type TableHeaderProps = React.ComponentProps<'thead'> & {
    isSticky?: boolean;
};

export type TableBodyProps = React.ComponentProps<'tbody'>;

// The total row. Rendered as a `<tfoot>` so it stays out of the body's rules and keeps its own,
// heavier one.
export type TableFooterProps = React.ComponentProps<'tfoot'>;

export type TableRowProps = React.ComponentProps<'tr'>;

// `isNumeric` right-aligns and switches on tabular figures. Every column of numbers wants both, and
// a column that has one without the other is the bug this prop exists to prevent.
export type TableHeadProps = React.ComponentProps<'th'> & {
    isNumeric?: boolean;
};

export type TableCellProps = React.ComponentProps<'td'> & {
    isNumeric?: boolean;
};

export type TableCaptionProps = React.ComponentProps<'caption'>;
