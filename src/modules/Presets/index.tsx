import type { PresetView } from '@/services/presets/types';
import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { presetsQueryOptions } from '@/services/presets/queries';
import { PresetCreator } from '@/modules/Analyze/components/PresetCreator';
import { ThresholdEditor } from '@/modules/Analyze/components/ThresholdEditor';
import { MainLayoutHeader } from '@/components/layouts/MainLayoutHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';

const routeApi = getRouteApi('/_authenticated');

// The manager reuses the analyzer's inline editor/creator, which are labelled via the analyzer i18n;
// the management chrome is English-only, so pin their locale.
const LOCALE = 'en';
const GEO_RE = /^[A-Za-z]{2}$/;

// Presets manager (#30 follow-up). The list is already row-scoped by the server — Head sees every
// preset, a Team Lead their team's, a Buyer only their own — so this table just renders what comes
// back. Create / import / edit / delete all reuse the analyzer's tested preset components.
function Presets() {
    const { data: presets } = useSuspenseQuery(presetsQueryOptions());
    const role = routeApi.useRouteContext({
        select(context) {
            return context.auth.me.role;
        },
    });
    const isHead = role === 'head';
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createGeo, setCreateGeo] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    // Derive the edited preset from the live list so a delete (row gone after invalidation) closes the
    // sheet on its own, and a save's fresh version flows straight through.
    const editingPreset = presets.find((preset) => {
        return preset.id === editingId;
    });
    const geo = createGeo.trim().toUpperCase();

    function openCreate() {
        setCreateGeo('');
        setIsCreateOpen(true);
    }

    return (
        <>
            <MainLayoutHeader>
                <h1 className="text-xl">Presets</h1>
                <span className="flex-1" />
                <Button size="sm" onClick={openCreate}>
                    <PlusIcon className="size-4" />
                    New preset
                </Button>
            </MainLayoutHeader>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Geo</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Creator</TableHead>
                            {isHead && <TableHead>Team</TableHead>}
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {presets.map((preset) => {
                            return (
                                <TableRow key={preset.id}>
                                    <TableCell className="font-medium">{preset.geo}</TableCell>
                                    <TableCell>{preset.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{preset.ownerEmail}</TableCell>
                                    {isHead && (
                                        <TableCell className="text-muted-foreground">
                                            {preset.teamName ?? '—'}
                                        </TableCell>
                                    )}
                                    <TableCell className="text-right">
                                        <Button
                                            size="xs"
                                            variant="ghost"
                                            onClick={() => {
                                                setEditingId(preset.id);
                                            }}
                                        >
                                            {preset.access === 'edit' ? 'Edit' : 'View'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {presets.length === 0 && (
                            <TableRow>
                                <TableCell className="text-muted-foreground text-center" colSpan={isHead ? 5 : 4}>
                                    No presets yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <SheetContent className="gap-0 overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>New preset</SheetTitle>
                        <SheetDescription>
                            Enter a Geo, then create the thresholds by hand or import them.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 p-4">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="create-geo">Geo</Label>
                            <Input
                                id="create-geo"
                                className="w-24 uppercase"
                                placeholder="IN"
                                maxLength={2}
                                value={createGeo}
                                onChange={(event) => {
                                    setCreateGeo(event.target.value);
                                }}
                            />
                        </div>
                        {GEO_RE.test(geo) ? (
                            <PresetCreator key={geo} geo={geo} locale={LOCALE} />
                        ) : (
                            <p className="text-muted-foreground text-sm">Enter a 2-letter Geo code to continue.</p>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet
                open={Boolean(editingPreset)}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingId(null);
                    }
                }}
            >
                <SheetContent className="gap-0 overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>
                            {editingPreset ? `${editingPreset.geo} · ${editingPreset.name}` : 'Preset'}
                        </SheetTitle>
                        <SheetDescription>Edit thresholds, rename, or delete this preset.</SheetDescription>
                    </SheetHeader>
                    <div className="p-4">{editingPreset && <PresetEditor preset={editingPreset} />}</div>
                </SheetContent>
            </Sheet>
        </>
    );
}

// Keyed on identity + active version + name so a saved threshold version or rename resets the inline
// editor's local drafts, matching how the analyzer mounts it.
function PresetEditor({ preset }: { preset: PresetView }) {
    return (
        <ThresholdEditor
            key={`${preset.id}:${preset.activeVersionId}:${preset.name}`}
            preset={preset}
            locale={LOCALE}
        />
    );
}

export { Presets };
