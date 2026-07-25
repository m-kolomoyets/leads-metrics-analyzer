import type { FileType, ParsedFiles } from '@/lib/domain/parse';

// One ingested CSV: the type detected from its headers (so the UI can show routing-by-content —
// files routed by detected type, not by drop-zone slot) plus its already-parsed rows. Parsing happens
// once at ingest (`parseFile`); `analyzeParsed` merges these on recompute without re-running Papa.parse.
export type UploadedFile = {
    name: string;
    // OS mtime. The browser never exposes a real creation date, and neither Keitaro export carries a
    // date column, so this is the only stamp available for every type — shown next to the name so two
    // re-exports of the same report are told apart, and used as part of the dedupe key.
    lastModified: number;
    size: number;
    type: FileType | null;
    parsed: Partial<ParsedFiles>;
};
