export type NavbarUserCardProps = Pick<React.ComponentProps<'div'>, 'className'> & {
    // The bar has no room for two lines of identity beside the tabs, but the dropdown it opens does.
    // Same card either way, so the reader recognises what they clicked.
    withDetails?: boolean;
};
