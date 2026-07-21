import type { FileType, ParsedFiles } from '@/lib/domain/parse';

// One ingested CSV: the type detected from its headers (so the UI can show routing-by-content —
// files routed by detected type, not by drop-zone slot) plus its already-parsed rows. Parsing happens
// once at ingest (`parseFile`); `analyzeParsed` merges these on recompute without re-running Papa.parse.
export type UploadedFile = {
    name: string;
    type: FileType | null;
    parsed: Partial<ParsedFiles>;
};
