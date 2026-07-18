export const presetKeys = {
    all: ['presets'] as const,
    listQueryKey() {
        return [...presetKeys.all, 'list'] as const;
    },
    sharedSettingsQueryKey() {
        return [...presetKeys.all, 'shared-settings'] as const;
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
    saveSharedSettingsMutationKey() {
        return [...presetKeys.all, 'save-shared-settings'] as const;
    },
};
