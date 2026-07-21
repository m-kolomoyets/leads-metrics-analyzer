import type { Viewer } from './scope';
import { scopeFor } from './scope';

// SERVER-usable pure seam (ADR-0007). Composes the access-policy descriptor (`scopeFor`) with a
// preset's ownership into a single verdict. Presets live in the dollar dimensions, so a viewer whose
// dimension-scope excludes them (designer/bdm) sees nothing. Otherwise **visibility grants edit**:
// anyone whose row-scope surfaces a preset may retune its thresholds, rename or delete it — a preset
// is a shared team tool, not a personal artefact, and every write appends an immutable version
// (ADR-0002) so a change is auditable and never destroys the prior grading. Kept pure (no DB) so it
// is the tested authorization seam and the list/read queries can filter on the same rules.

// The minimal preset identity the verdict needs — the full row is not required.
export type PresetSubject = {
    ownerUserId: string;
    teamId: string | null;
};

// 'edit' → may append versions / rename / delete; 'read' → visible but immutable; 'none' → not
// visible. 'read' is retained for callers that render an immutable view (e.g. a snapshot-pinned
// preset); the live-preset verdict below never downgrades a visible preset below 'edit'.
export type PresetAccess = 'edit' | 'read' | 'none';

// Presets roll up under the Geo dollar dimension; a viewer must hold it to see any preset at all.
const PRESET_DIMENSION = 'geo';

export const presetAccessFor = (viewer: Viewer, preset: PresetSubject): PresetAccess => {
    // The owner always edits — outranks every row/dimension consideration.
    if (preset.ownerUserId === viewer.id) {
        return 'edit';
    }

    const scope = scopeFor(viewer);

    // Designer/BDM carry `rowScope: 'all'` but only their own creative/offer dimension — never the
    // dollar tables presets belong to.
    if (!scope.dimensions.includes(PRESET_DIMENSION)) {
        return 'none';
    }

    // Visible ⇒ editable. Row-scope is the only remaining question.
    switch (scope.rowScope) {
        case 'all': {
            return 'edit';
        }
        case 'team': {
            return preset.teamId !== null && preset.teamId === scope.teamId ? 'edit' : 'none';
        }
        case 'own': {
            // A non-owner under own-scope (buyer) never sees a teammate's preset — nothing to edit.
            return 'none';
        }
    }
};
