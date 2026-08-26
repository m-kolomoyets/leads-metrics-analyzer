import type { FileType } from '@/lib/domain/parse';
import type { UploadedFile } from '../../types';
import { useState } from 'react';
import { FileSpreadsheet, TriangleAlert, Upload, X } from 'lucide-react';
import { parseFile } from '@/lib/domain/parse';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

type FileDropzonesProps = {
    files: UploadedFile[];
    onChange: (files: UploadedFile[]) => void;
};

const ZONES: { type: FileType; label: string; hint: string }[] = [
    { type: 'fb', label: 'Facebook Ads', hint: 'Spend export (multi-file)' },
    { type: 'kt-main', label: 'Keitaro — Main', hint: 'Installs / regs / sales (multi-file)' },
    { type: 'kt-clicks', label: 'Keitaro — Clicks', hint: 'Link-click report (multi-file)' },
];

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
    // Once a zone holds files the list below it already states what is loaded, so the slot goes back
    // to advertising what else it takes.
    return loaded === 0 ? hint : 'Add more';
}

// One line per file, everywhere: name, then the two figures that say whether the export is the one
// you meant — when it was pulled, and how much survived parsing.
function FileRow({ file, onRemove }: { file: UploadedFile; onRemove: () => void }) {
    const reason = file.type ? null : unknownReasonOf(file);
    return (
        <li className="border-primary/20 hover:bg-primary/5 flex flex-col gap-0.5 px-3 py-2 not-first:border-t motion-safe:transition-colors motion-safe:duration-150">
            <div className="flex items-center gap-2">
                <span className="min-w-0 flex-1 truncate text-xs" title={file.name}>
                    {file.name}
                </span>
                <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                    {file.type ? `${rowCountOf(file)} rows · ${formatStamp(file.lastModified)}` : 'unreadable'}
                </span>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Remove ${file.name}`}
                    className="text-muted-foreground hover:bg-primary/15 hover:text-foreground -mr-1 shrink-0"
                    onClick={onRemove}
                >
                    <X />
                </Button>
            </div>
            {reason && <span className="text-zone-red text-xs">{reason}</span>}
        </li>
    );
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

    function handleDragOver(event: React.DragEvent<HTMLDivElement>, zone: FileType) {
        // Must preventDefault on dragover too, otherwise the browser navigates to the dropped file.
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        setDraggedOver(zone);
    }

    function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
            return;
        }
        setDraggedOver(null);
    }

    async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setDraggedOver(null);
        await addFiles(Array.from(event.dataTransfer.files));
    }

    // Identity is the dedupe key, not the index: the list is now rendered per zone, so an index into
    // a filtered slice is not an index into `files`.
    function remove(target: UploadedFile) {
        onChange(
            files.filter((file) => {
                return keyOf(file) !== keyOf(target);
            })
        );
    }

    const unknown = files.filter((file) => {
        return file.type === null;
    });

    return (
        <section className="bg-surface border-border flex flex-col gap-3 rounded-md border p-4">
            <h3 className="text-muted-foreground text-xs font-medium tracking-widest uppercase">Files</h3>
            <div className="grid gap-3 sm:grid-cols-3">
                {ZONES.map((zone) => {
                    const zoneFiles = files.filter((file) => {
                        return file.type === zone.type;
                    });
                    const isDraggedOver = draggedOver === zone.type;
                    const warnOverlap = zoneFiles.length > 1 && OVERLAP_WARN_TYPES.includes(zone.type);
                    return (
                        <div
                            key={zone.type}
                            className={cn(
                                'bg-primary/5 border-primary/25 flex flex-col overflow-hidden rounded-md border motion-safe:transition-colors motion-safe:duration-150',
                                zoneFiles.length === 0 ? 'border-dashed' : 'border-primary/40',
                                isDraggedOver && 'border-primary/70 bg-primary/15 border-solid'
                            )}
                            onDragOver={(event) => {
                                handleDragOver(event, zone.type);
                            }}
                            onDragLeave={handleDragLeave}
                            onDrop={(event) => {
                                void handleDrop(event);
                            }}
                        >
                            <label
                                className={cn(
                                    'hover:bg-primary/10 active:bg-primary/20 flex cursor-pointer items-center gap-2.5 p-3 motion-safe:transition-colors motion-safe:duration-150',
                                    'has-[input:focus-visible]:outline-accent has-[input:focus-visible]:-outline-offset-2 has-[input:focus-visible]:outline-2'
                                )}
                            >
                                <span className="border-primary/30 bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-sm border">
                                    {zoneFiles.length > 0 ? <FileSpreadsheet /> : <Upload />}
                                </span>
                                <span className="flex min-w-0 flex-col">
                                    <span className="truncate text-sm font-medium">{zone.label}</span>
                                    <span className="text-muted-foreground truncate text-xs">
                                        {zoneHint(zone.hint, zoneFiles.length, isDraggedOver)}
                                    </span>
                                </span>
                                {zoneFiles.length > 0 && (
                                    <span className="text-primary bg-primary/10 ml-auto shrink-0 rounded-sm px-1.5 py-0.5 text-xs tabular-nums">
                                        {zoneFiles.length}
                                    </span>
                                )}
                                <input
                                    type="file"
                                    accept=".csv,text/csv"
                                    multiple
                                    className="sr-only"
                                    onChange={(event) => {
                                        void handleInput(event);
                                    }}
                                />
                            </label>

                            {zoneFiles.length > 0 && (
                                <ul className="border-primary/25 border-t">
                                    {zoneFiles.map((file) => {
                                        return (
                                            <FileRow
                                                key={keyOf(file)}
                                                file={file}
                                                onRemove={() => {
                                                    remove(file);
                                                }}
                                            />
                                        );
                                    })}
                                </ul>
                            )}

                            {warnOverlap && (
                                <p className="text-warning border-primary/25 flex items-start gap-1.5 border-t px-3 py-2 text-xs">
                                    <TriangleAlert className="mt-px size-3 shrink-0" />
                                    Date ranges must not overlap — clicks double-count and uniques do not sum.
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {unknown.length > 0 && (
                <ul className="border-border flex flex-col rounded-md border">
                    {unknown.map((file) => {
                        return (
                            <FileRow
                                key={keyOf(file)}
                                file={file}
                                onRemove={() => {
                                    remove(file);
                                }}
                            />
                        );
                    })}
                </ul>
            )}
        </section>
    );
}

export { FileDropzones };
