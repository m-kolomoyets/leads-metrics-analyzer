import type { ReactNode } from 'react';

export type MainLayoutHeaderProps = React.PropsWithChildren<React.ComponentProps<'header'>>;

export type MainLayoutHeaderTitleProps = React.ComponentProps<'h1'> & {
    // What qualifies the name — a report date, a dimension, a buyer. Muted and beside the title
    // rather than inside it, so the page's name stays one word the eye can find every time.
    meta?: ReactNode;
};

export type MainLayoutHeaderActionsProps = React.ComponentProps<'div'>;
