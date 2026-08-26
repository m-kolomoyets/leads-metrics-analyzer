import type { UploadedFile } from '../types';
import type { FilesDraft, ViewDraft } from '../utils/draft';
import { createContext, useEffect, useState } from 'react';
import { idbDelete, idbGet, idbSet } from '@/lib/utils/idb';
import { useSafeContext } from '@/hooks/useSafeContext';
import { filesDraftKey, isDraftFresh, viewDraftKey } from '../utils/draft';

// The Analyze draft, held ABOVE the route so leaving the page and coming back keeps the upload
// (tier 1), and mirrored into IndexedDB so a reload keeps it too (tier 2). A Snapshot is the
// opposite act — a deliberate, immutable freeze that others can read — and nothing here writes one.

// Toggle sets keyed `${geo}:${…}`. Grouped because all three are per-upload triage that a new
// upload voids together.
type FlagBucket = 'excluded' | 'collapsed' | 'reviewed';

type DraftState = {
    files: UploadedFile[];
    excluded: ReadonlySet<string>;
    collapsed: ReadonlySet<string>;
    reviewed: ReadonlySet<string>;
    selectedPresetByGeo: Record<string, string>;
};

type AnalyzeDraftValue = DraftState & {
    // False until the stored draft has been read. The page renders nothing report-shaped meanwhile,
    // so a restored upload never flashes through an empty state on the way in.
    isHydrated: boolean;
    // When the on-screen draft came off disk rather than this session's upload — the banner's stamp.
    // Cleared by the next upload, because from then on the draft is what the analyst just did.
    restoredAt: number | null;
    replaceFiles: (files: UploadedFile[]) => void;
    toggleFlag: (bucket: FlagBucket, key: string) => void;
    setFlag: (bucket: FlagBucket, key: string, value: boolean) => void;
    selectPreset: (geo: string, presetId: string) => void;
    clearDraft: () => void;
};

type AnalyzeDraftProviderProps = {
    children: React.ReactNode;
    userId: string;
};

// Rows are written on a delay so a multi-file drop clones once, not once per file. The toggles get a
// shorter one — a click should be safe almost immediately, and the payload is tiny.
const FILES_WRITE_DELAY_MS = 500;
const VIEW_WRITE_DELAY_MS = 150;

const EMPTY_STATE: DraftState = {
    files: [],
    excluded: new Set(),
    collapsed: new Set(),
    reviewed: new Set(),
    selectedPresetByGeo: {},
};

const AnalyzeDraftContext = createContext<AnalyzeDraftValue>({} as AnalyzeDraftValue);
AnalyzeDraftContext.displayName = 'AnalyzeDraftContext';

function withFlag(current: ReadonlySet<string>, key: string, value: boolean): ReadonlySet<string> {
    const next = new Set(current);

    if (value) {
        next.add(key);
    } else {
        next.delete(key);
    }

    return next;
}

function AnalyzeDraftProvider({ children, userId }: AnalyzeDraftProviderProps) {
    const [state, setState] = useState<DraftState>(EMPTY_STATE);
    const [isHydrated, setIsHydrated] = useState(false);
    const [restoredAt, setRestoredAt] = useState<number | null>(null);

    useEffect(
        function hydrateFromStorage() {
            let isCancelled = false;

            async function read() {
                const [files, view] = await Promise.all([
                    idbGet<FilesDraft>(filesDraftKey(userId)),
                    idbGet<ViewDraft>(viewDraftKey(userId)),
                ]);

                if (isCancelled) {
                    return;
                }

                // The rows are the draft: without them the toggles key nothing, so a missing or aged
                // files record drops the pair rather than restoring half a session.
                if (!files?.files.length || !isDraftFresh(files.savedAt, Date.now())) {
                    void idbDelete(filesDraftKey(userId));
                    void idbDelete(viewDraftKey(userId));
                    setIsHydrated(true);

                    return;
                }

                setState({
                    files: files.files,
                    excluded: new Set(view?.excluded ?? []),
                    collapsed: new Set(view?.collapsed ?? []),
                    reviewed: new Set(view?.reviewed ?? []),
                    selectedPresetByGeo: view?.selectedPresetByGeo ?? {},
                });
                setRestoredAt(files.savedAt);
                setIsHydrated(true);
            }

            void read();

            return () => {
                isCancelled = true;
            };
        },
        [userId]
    );

    useEffect(
        function persistFiles() {
            if (!isHydrated) {
                return;
            }

            const timer = setTimeout(() => {
                if (!state.files.length) {
                    void idbDelete(filesDraftKey(userId));

                    return;
                }

                void idbSet(filesDraftKey(userId), { savedAt: Date.now(), files: state.files } satisfies FilesDraft);
            }, FILES_WRITE_DELAY_MS);

            return () => {
                clearTimeout(timer);
            };
        },
        [isHydrated, userId, state.files]
    );

    useEffect(
        function persistView() {
            if (!isHydrated) {
                return;
            }

            const timer = setTimeout(() => {
                if (!state.files.length) {
                    void idbDelete(viewDraftKey(userId));

                    return;
                }

                void idbSet(viewDraftKey(userId), {
                    savedAt: Date.now(),
                    excluded: [...state.excluded],
                    collapsed: [...state.collapsed],
                    reviewed: [...state.reviewed],
                    selectedPresetByGeo: state.selectedPresetByGeo,
                } satisfies ViewDraft);
            }, VIEW_WRITE_DELAY_MS);

            return () => {
                clearTimeout(timer);
            };
        },
        [isHydrated, userId, state.files, state.excluded, state.collapsed, state.reviewed, state.selectedPresetByGeo]
    );

    // A new upload replaces the facts, so every per-campaign / per-account toggle taken against the
    // old ones is void. `excluded` matters most: a stale mute silently drops campaigns from account
    // metrics, counts, waste and the Problem rules with no visible cue.
    function replaceFiles(files: UploadedFile[]) {
        setState({ ...EMPTY_STATE, files, selectedPresetByGeo: {} });
        setRestoredAt(null);
    }

    function setFlag(bucket: FlagBucket, key: string, value: boolean) {
        setState((current) => {
            return { ...current, [bucket]: withFlag(current[bucket], key, value) };
        });
    }

    function toggleFlag(bucket: FlagBucket, key: string) {
        setState((current) => {
            return { ...current, [bucket]: withFlag(current[bucket], key, !current[bucket].has(key)) };
        });
    }

    function selectPreset(geo: string, presetId: string) {
        setState((current) => {
            return { ...current, selectedPresetByGeo: { ...current.selectedPresetByGeo, [geo]: presetId } };
        });
    }

    function clearDraft() {
        setState(EMPTY_STATE);
        setRestoredAt(null);
        void idbDelete(filesDraftKey(userId));
        void idbDelete(viewDraftKey(userId));
    }

    return (
        <AnalyzeDraftContext
            value={{
                ...state,
                isHydrated,
                restoredAt,
                replaceFiles,
                toggleFlag,
                setFlag,
                selectPreset,
                clearDraft,
            }}
        >
            {children}
        </AnalyzeDraftContext>
    );
}

export const useAnalyzeDraft = () => {
    const context = useSafeContext(AnalyzeDraftContext);

    return context;
};

export { AnalyzeDraftProvider };
