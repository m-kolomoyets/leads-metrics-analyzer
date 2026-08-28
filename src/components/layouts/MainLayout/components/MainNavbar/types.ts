export type MainNavbarProps = React.ComponentProps<'header'> & {
    /** Scrolling down folds the identity row away and leaves the tab row parked at the top. */
    isCondensed?: boolean;
};
