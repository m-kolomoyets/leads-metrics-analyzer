import type { FileType } from '@/lib/domain/parse';
import type { UploadedFile } from '../../types';
import { useState } from 'react';
import { parseFile } from '@/lib/domain/parse';
import { cn } from '@/lib/utils/cn';

type FileDropzonesProps = {
    files: UploadedFile[];
    onChange: (files: UploadedFile[]) => void;
};

const ZONES: { type: FileType; label: string; hint: string; multiple: boolean }[] = [
    { type: 'fb', label: 'Facebook Ads', hint: 'Spend export (multi-file)', multiple: true },
    { type: 'kt-main', label: 'Keitaro — Main', hint: 'Installs / regs / sales', multiple: false },
    { type: 'kt-clicks', label: 'Keitaro — Clicks', hint: 'Link-click report', multiple: false },
];

const TYPE_LABEL: Record<FileType, string> = {
    fb: 'FB',
    'kt-main': 'KT main',
    'kt-clicks': 'KT clicks',
};

// Any file dropped in any zone is routed by its detected content type, never the slot it landed in.
function toUploaded(picked: File[]): Promise<UploadedFile[]> {
    return Promise.all(
        picked.map(async (file) => {
            // Parse once here, at ingest — store the rows, not the raw text. `analyzeParsed` merges
            // these on every recompute without re-running Papa.parse (parse-once, grade-many).
            const { type, parsed } = parseFile(await file.text());
            return { name: file.name, type, parsed };
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

function zoneHint(hint: string, active: boolean, isDraggedOver: boolean) {
    if (isDraggedOver) {
        return 'Drop to add';
    }
    return active ? '✓ loaded' : hint;
}

function FileDropzones({ files, onChange }: FileDropzonesProps) {
    const [draggedOver, setDraggedOver] = useState<FileType | null>(null);

    async function addFiles(picked: File[], multiple: boolean) {
        if (picked.length === 0) {
            return;
        }
        const accepted = picked.filter(isCsv);
        const rejected = picked.filter((file) => {
            return !isCsv(file);
        });
        const added = await toUploaded(multiple ? accepted : accepted.slice(0, 1));
        onChange([...files, ...added, ...rejected.map(toRejected)]);
    }

    async function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
        const { files: picked } = event.target;
        if (!picked?.length) {
            return;
        }
        const list = Array.from(picked);
        event.target.value = '';
        await addFiles(list, true);
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

    async function handleDrop(event: React.DragEvent<HTMLLabelElement>, multiple: boolean) {
        event.preventDefault();
        setDraggedOver(null);
        await addFiles(Array.from(event.dataTransfer.files), multiple);
    }

    function removeAt(index: number) {
        onChange(
            files.filter((_, i) => {
                return i !== index;
            })
        );
    }

    return (
        <section className="glass-tint tint-blue tint-s5 flex flex-col gap-4 rounded-2xl p-4">
            <h3 className="text-muted-foreground text-[13px] font-normal tracking-widest uppercase">1 · Files</h3>
            <div className="grid gap-3 sm:grid-cols-3">
                {ZONES.map((zone) => {
                    const active = files.some((file) => {
                        return file.type === zone.type;
                    });
                    const isDraggedOver = draggedOver === zone.type;
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
                                void handleDrop(event, zone.multiple);
                            }}
                        >
                            <span className="font-semibold">{zone.label}</span>
                            <span className="text-muted-foreground text-xs">
                                {zoneHint(zone.hint, active, isDraggedOver)}
                            </span>
                            <input
                                type="file"
                                accept=".csv,text/csv"
                                multiple={zone.multiple}
                                className="mt-2 text-xs"
                                onChange={handleInput}
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
                            <li key={`${file.name}-${index}`} className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            'rounded px-1.5 py-0.5 text-xs',
                                            file.type ? 'bg-accent' : 'bg-danger/15 text-danger'
                                        )}
                                    >
                                        {file.type ? TYPE_LABEL[file.type] : 'unknown'}
                                    </span>
                                    <span className="truncate">{file.name}</span>
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
                                {reason && <span className="text-danger pl-1 text-xs">{reason}</span>}
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}

export { FileDropzones };
