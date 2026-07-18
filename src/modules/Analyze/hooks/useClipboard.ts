import { useState } from 'react';

// Copy-to-clipboard with a transient "copied" marker keyed by target, so many copy buttons can share
// one hook and each shows its own ✓ for a moment. Referential stability comes from the Compiler.
export function useClipboard(resetMs = 1500) {
    const [copied, setCopied] = useState<string | null>(null);

    function copy(text: string, key: string) {
        void navigator.clipboard?.writeText(text);
        setCopied(key);
        window.setTimeout(() => {
            setCopied((current) => {
                return current === key ? null : current;
            });
        }, resetMs);
    }

    return { copied, copy };
}
