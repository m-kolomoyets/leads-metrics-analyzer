// Build the shareable reset link from a raw reset token (#43). Client-only (reads
// window.location.origin) — the panel renders it for the Head to copy and hand-deliver. Token-only:
// no email in the URL, so the link leaks nothing about whose account it resets.
export const buildResetUrl = (token: string): string => {
    return `${window.location.origin}/reset-password?token=${encodeURIComponent(token)}`;
};
