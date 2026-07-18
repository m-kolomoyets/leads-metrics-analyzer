export const presetKeys = {
    all: ['presets'] as const,
    listQueryKey() {
        return [...presetKeys.all, 'list'] as const;
    },
    // The base key for every shared-settings scope — invalidate it to refresh all of them at once.
    sharedSettingsBaseKey() {
        return [...presetKeys.all, 'shared-settings'] as const;
    },
    // A specific scope: the viewer's default (null/undefined) shares the base key so the route loader's
    // preload is reused; a Head targeting a team appends its id.
    sharedSettingsQueryKey(teamId?: string | null) {
        const scoped = teamId ?? null;
        return scoped === null
            ? presetKeys.sharedSettingsBaseKey()
            : ([...presetKeys.sharedSettingsBaseKey(), scoped] as const);
    },
    createMutationKey() {
        return [...presetKeys.all, 'create'] as const;
    },
    saveVersionMutationKey() {
        return [...presetKeys.all, 'save-version'] as const;
    },
    renameMutationKey() {
        return [...presetKeys.all, 'rename'] as const;
    },
    deleteMutationKey() {
        return [...presetKeys.all, 'delete'] as const;
    },
    saveSharedSettingsMutationKey() {
        return [...presetKeys.all, 'save-shared-settings'] as const;
    },
};
