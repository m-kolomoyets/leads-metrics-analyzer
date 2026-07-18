import type { FileType } from '@/lib/domain/parse';

// One ingested CSV: its raw text (fed to `analyze`) plus the type detected from its headers, so the
// UI can show routing-by-content (ADR: files routed by detected type, not by drop-zone slot).
export type UploadedFile = {
    name: string;
    text: string;
    type: FileType | null;
};
