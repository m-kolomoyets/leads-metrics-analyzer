import type { UploadedFile } from '../types';

// The persisted Analyze draft (#persist). Only the *inputs* are stored — the uploaded files and the
// analyst's toggles. The report itself is derived (`analyzeParsed` over merged rows) and recomputing
// it on hydrate is cheaper than reading it back, so freezing it would only risk a stale rebuild.
//
// Two records, not one: the rows are megabytes and change on upload only, while the toggles are a
// few hundred bytes and change on every click. Writing them together would re-clone the whole upload
// each time an account is marked reviewed.

// A draft is a convenience, not a document. Past a week it is likelier to be yesterday's numbers
// wearing today's date than something the analyst wants back, so it ages out on read.
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type FilesDraft = {
    savedAt: number;
    files: UploadedFile[];
};

export type ViewDraft = {
    savedAt: number;
    // `${geo}:${campaign}` / `${geo}:${account}` keys, as the module composes them.
    excluded: string[];
    collapsed: string[];
    reviewed: string[];
    selectedPresetByGeo: Record<string, string>;
};

// Keyed per user: a shared machine must never hand one analyst another's upload back.
export function filesDraftKey(userId: string): string {
    return `analyze-draft-files:${userId}`;
}

export function viewDraftKey(userId: string): string {
    return `analyze-draft-view:${userId}`;
}

export function isDraftFresh(savedAt: number, now: number): boolean {
    return now - savedAt < DRAFT_TTL_MS && savedAt <= now;
}
