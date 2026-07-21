import type { FileType } from '@/lib/domain/parse';
import type { UploadedFile } from '../../types';
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
function toUploaded(fileList: FileList): Promise<UploadedFile[]> {
    return Promise.all(
        Array.from(fileList).map(async (file) => {
            const text = await file.text();
            return { name: file.name, text, type: parseFile(text).type };
        })
    );
}

function FileDropzones({ files, onChange }: FileDropzonesProps) {
    async function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
        const { files: picked } = event.target;
        if (!picked?.length) {
            return;
        }
        const added = await toUploaded(picked);
        event.target.value = '';
        onChange([...files, ...added]);
    }

    function removeAt(index: number) {
        onChange(
            files.filter((_, i) => {
                return i !== index;
            })
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-3">
                {ZONES.map((zone) => {
                    return (
                        <label
                            key={zone.type}
                            className="flex cursor-pointer flex-col gap-1 rounded-md border border-dashed p-4 text-sm hover:bg-accent/40"
                        >
                            <span className="font-medium">{zone.label}</span>
                            <span className="text-muted-foreground text-xs">{zone.hint}</span>
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
                        return (
                            <li key={`${file.name}-${index}`} className="flex items-center gap-2">
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
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export { FileDropzones };
