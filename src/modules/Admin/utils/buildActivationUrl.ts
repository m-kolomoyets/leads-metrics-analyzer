// Build the shareable activation link from a raw invitation token. Client-only (reads
// window.location.origin) — the panel renders it for the Head to copy and hand-deliver.
export const buildActivationUrl = (token: string): string => {
    return `${window.location.origin}/activate?token=${encodeURIComponent(token)}`;
};
