import type { FileType } from '@/lib/domain/parse';
import type { UploadedFile } from '../../types';
import { useState } from 'react';
import { parseFile } from '@/lib/domain/parse';
import { cn } from '@/lib/utils/cn';

type FileDropzonesProps = {
    files: UploadedFile[];
    onChange: (files: UploadedFile[]) => void;
};

const ZONES: { type: FileType; label: string; hint: string }[] = [
    { type: 'fb', label: 'Facebook Ads', hint: 'Spend export (multi-file)' },
    { type: 'kt-main', label: 'Keitaro — Main', hint: 'Installs / regs / sales (multi-file)' },
    { type: 'kt-clicks', label: 'Keitaro — Clicks', hint: 'Link-click report (multi-file)' },
];

const TYPE_LABEL: Record<FileType, string> = {
    fb: 'FB',
    'kt-main': 'KT main',
    'kt-clicks': 'KT clicks',
};

// Every type stacks: exports are sliced per account/date range and `mergeParsed` concatenating them is
// what reassembles the period. Caveat for the Keitaro zones — overlapping date ranges double-count
// clicks and sum `UC (campaign)` uniques, which are not additive. Slices must not overlap; the zone
// warns once a type holds more than one file.
const OVERLAP_WARN_TYPES: FileType[] = ['kt-main', 'kt-clicks'];

// Any file dropped in any zone is routed by its detected content type, never the slot it landed in.
function toUploaded(picked: File[]): Promise<UploadedFile[]> {
    return Promise.all(
        picked.map(async (file) => {
            // Parse once here, at ingest — store the rows, not the raw text. `analyzeParsed` merges
            // these on every recompute without re-running Papa.parse (parse-once, grade-many).
            const { type, parsed } = parseFile(await file.text());
            return { name: file.name, lastModified: file.lastModified, size: file.size, type, parsed };
        })
    );
}

// Finder drags in files with an empty/odd MIME type, so fall back to the extension.
function isCsv(file: File) {
    return file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv');
}

// A rejected file still gets listed as unknown — silently dropping it looks like a broken upload.
function toRejected(file: File): UploadedFile {
    const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '(no extension)';
    return {
        name: file.name,
        lastModified: file.lastModified,
        size: file.size,
        type: null,
        parsed: {
            warnings: [
                {
                    kind: 'unknown-file-type',
                    headers: [],
                    reason: `Not a CSV file — "${ext}" is not readable. Export the report as CSV and upload it again.`,
                },
            ],
        },
    };
}

// The one-sentence explanation attached at parse time, if any.
function unknownReasonOf(file: UploadedFile): string | null {
    const warning = file.parsed.warnings?.find((w) => {
        return w.kind === 'unknown-file-type';
    });
    return warning?.reason ?? null;
}

// Name alone is too weak: re-exporting the same report over a new date range keeps the filename, and
// dropping it would be silently ignored. Size + mtime separate those while still catching a true
// double-drop of one file.
function keyOf(file: UploadedFile) {
    return `${file.name}|${file.size}|${file.lastModified}`;
}

// Applied to the whole list after every add: drop exact re-drops. Everything else stacks, whichever
// zone it landed in — routing is by detected content type, never by slot.
function reconcile(next: UploadedFile[]): UploadedFile[] {
    const seen = new Set<string>();
    return next.filter((file) => {
        const key = keyOf(file);
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

// Rows that survived parse hygiene — the count the reference showed per file, and the quickest tell
// that an export came back empty or truncated.
function rowCountOf(file: UploadedFile) {
    const { fb = [], ktMain = [], ktClicks = [] } = file.parsed;
    return fb.length + ktMain.length + ktClicks.length;
}

function formatStamp(ms: number) {
    const date = new Date(ms);
    const pad = (value: number) => {
        return String(value).padStart(2, '0');
    };
    const day = `${pad(date.getMonth() + 1)}.${pad(date.getDate())}.${date.getFullYear()}`;
    // Time matters: two same-day re-exports of one report differ only here.
    return `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function zoneHint(hint: string, loaded: number, isDraggedOver: boolean) {
    if (isDraggedOver) {
        return 'Drop to add';
    }
    if (loaded === 0) {
        return hint;
    }
    return loaded > 1 ? `✓ ${loaded} files` : '✓ loaded';
}

function FileDropzones({ files, onChange }: FileDropzonesProps) {
    const [draggedOver, setDraggedOver] = useState<FileType | null>(null);

    async function addFiles(picked: File[]) {
        if (picked.length === 0) {
            return;
        }
        const accepted = picked.filter(isCsv);
        const rejected = picked.filter((file) => {
            return !isCsv(file);
        });
        const added = await toUploaded(accepted);
        onChange(reconcile([...files, ...added, ...rejected.map(toRejected)]));
    }

    async function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
        const { files: picked } = event.target;
        if (!picked?.length) {
            return;
        }
        const list = Array.from(picked);
        event.target.value = '';
        await addFiles(list);
    }

    function handleDragOver(event: React.DragEvent<HTMLLabelElement>, zone: FileType) {
        // Must preventDefault on dragover too, otherwise the browser navigates to the dropped file.
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        setDraggedOver(zone);
    }

    function handleDragLeave(event: React.DragEvent<HTMLLabelElement>) {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
            return;
        }
        setDraggedOver(null);
    }

    async function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
        event.preventDefault();
        setDraggedOver(null);
        await addFiles(Array.from(event.dataTransfer.files));
    }

    function removeAt(index: number) {
        onChange(
            files.filter((_, i) => {
                return i !== index;
            })
        );
    }

    return (
        <section className="bg-surface border-border flex flex-col gap-4 rounded-md border p-4">
            <h3 className="text-muted-foreground text-xs font-medium tracking-widest uppercase">1 · Files</h3>
            <div className="grid gap-3 sm:grid-cols-3">
                {ZONES.map((zone) => {
                    const loaded = files.filter((file) => {
                        return file.type === zone.type;
                    }).length;
                    const active = loaded > 0;
                    const isDraggedOver = draggedOver === zone.type;
                    const warnOverlap = loaded > 1 && OVERLAP_WARN_TYPES.includes(zone.type);
                    return (
                        <label
                            key={zone.type}
                            className={cn(
                                'flex cursor-pointer flex-col gap-1 rounded-lg border-[1.5px] border-dashed p-4 text-sm transition-colors',
                                active
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border bg-background/40 hover:bg-accent/40',
                                isDraggedOver && 'border-primary bg-primary/20'
                            )}
                            onDragOver={(event) => {
                                handleDragOver(event, zone.type);
                            }}
                            onDragLeave={handleDragLeave}
                            onDrop={(event) => {
                                void handleDrop(event);
                            }}
                        >
                            <span className="font-semibold">{zone.label}</span>
                            <span className="text-muted-foreground text-xs">
                                {zoneHint(zone.hint, loaded, isDraggedOver)}
                            </span>
                            {warnOverlap && (
                                <span className="text-warning text-xs">
                                    ⚠ Date ranges must not overlap — clicks double-count and uniques do not sum.
                                </span>
                            )}
                            <input
                                type="file"
                                accept=".csv,text/csv"
                                multiple
                                className="mt-2 text-xs"
                                onChange={(event) => {
                                    void handleInput(event);
                                }}
                            />
                        </label>
                    );
                })}
            </div>

            {files.length > 0 && (
                <ul className="flex flex-col gap-1 text-sm">
                    {files.map((file, index) => {
                        const reason = file.type ? null : unknownReasonOf(file);
                        return (
                            <li key={keyOf(file)} className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            'rounded px-1.5 py-0.5 text-xs',
                                            file.type ? 'bg-accent' : 'text-zone-red border-zone-red border'
                                        )}
                                    >
                                        {file.type ? TYPE_LABEL[file.type] : 'unknown'}
                                    </span>
                                    <span className="truncate">
                                        {file.name} ({formatStamp(file.lastModified)})
                                    </span>
                                    {file.type && (
                                        <span className="text-muted-foreground shrink-0 text-xs">
                                            {rowCountOf(file)} rows
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        className="text-muted-foreground text-xs hover:underline"
                                        onClick={() => {
                                            removeAt(index);
                                        }}
                                    >
                                        remove
                                    </button>
                                </div>
                                {reason && <span className="text-zone-red pl-1 text-xs">{reason}</span>}
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}

export { FileDropzones };
