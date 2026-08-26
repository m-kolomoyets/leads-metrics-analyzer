export type PendingAreaProps = {
    // Said in the reader's terms — what is being worked out, not "Loading".
    label: string;
    // 'block' fills the space the awaited content will take; 'inline' rides in a row of controls.
    variant?: 'block' | 'inline';
    className?: string;
};
