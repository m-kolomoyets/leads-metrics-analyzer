import type { Viewer } from './scope';
import { scopeFor } from './scope';

// SERVER-usable pure seam (ADR-0007). Composes the access-policy descriptor (`scopeFor`) with a
// preset's ownership into a single verdict. Presets live in the dollar dimensions, so a viewer whose
// dimension-scope excludes them (designer/bdm) sees nothing; ownership grants edit; row-scope grants
// read. Kept pure (no DB) so it is the tested authorization seam and the list/read queries can filter
// on the same rules. `scopeFor` alone is insufficient — it never encodes owner-only edit.

// The minimal preset identity the verdict needs — the full row is not required.
export type PresetSubject = {
    ownerUserId: string;
    teamId: string | null;
};

// 'edit' → owner may append versions / rename; 'read' → visible but immutable; 'none' → not visible.
export type PresetAccess = 'edit' | 'read' | 'none';

// Presets roll up under the Geo dollar dimension; a viewer must hold it to see any preset at all.
const PRESET_DIMENSION = 'geo';

export const presetAccessFor = (viewer: Viewer, preset: PresetSubject): PresetAccess => {
    // Owner-only edit (spec §Ownership & stamping) — outranks every row/dimension consideration.
    if (preset.ownerUserId === viewer.id) {
        return 'edit';
    }

    const scope = scopeFor(viewer);

    // Designer/BDM carry `rowScope: 'all'` but only their own creative/offer dimension — never the
    // dollar tables presets belong to.
    if (!scope.dimensions.includes(PRESET_DIMENSION)) {
        return 'none';
    }

    switch (scope.rowScope) {
        case 'all': {
            return 'read';
        }
        case 'team': {
            return preset.teamId !== null && preset.teamId === scope.teamId ? 'read' : 'none';
        }
        case 'own': {
            // A non-owner under own-scope (buyer) never sees a teammate's preset.
            return 'none';
        }
    }
};
