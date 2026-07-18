import type {
    CreatePresetInput,
    DeletePresetInput,
    RenamePresetInput,
    SavePresetVersionInput,
    SaveSharedSettingsInput,
} from './schemas';
import { mutationOptions, queryOptions } from '@tanstack/react-query';
import {
    createPresetFn,
    deletePresetFn,
    getSharedSettingsFn,
    listPresetsFn,
    renamePresetFn,
    savePresetVersionFn,
    saveSharedSettingsFn,
} from './functions';
import { presetKeys } from './queryKeys';

export const presetsQueryOptions = () => {
    return queryOptions({
        queryKey: presetKeys.listQueryKey(),
        queryFn() {
            return listPresetsFn();
        },
    });
};

// `teamId` is a Head-only override (any team, or `null`/absent for the global row); every other role's
// value is ignored server-side. Omitting it keeps the route loader's preloaded key.
export const sharedSettingsQueryOptions = (teamId?: string | null) => {
    const scoped = teamId ?? null;
    return queryOptions({
        queryKey: presetKeys.sharedSettingsQueryKey(scoped),
        queryFn() {
            return getSharedSettingsFn({ data: { teamId: scoped } });
        },
    });
};

export const createPresetMutationOptions = () => {
    return mutationOptions({
        mutationKey: presetKeys.createMutationKey(),
        mutationFn(data: CreatePresetInput) {
            return createPresetFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: presetKeys.listQueryKey() });
        },
    });
};

export const savePresetVersionMutationOptions = () => {
    return mutationOptions({
        mutationKey: presetKeys.saveVersionMutationKey(),
        mutationFn(data: SavePresetVersionInput) {
            return savePresetVersionFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: presetKeys.listQueryKey() });
        },
    });
};

export const renamePresetMutationOptions = () => {
    return mutationOptions({
        mutationKey: presetKeys.renameMutationKey(),
        mutationFn(data: RenamePresetInput) {
            return renamePresetFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: presetKeys.listQueryKey() });
        },
    });
};

export const deletePresetMutationOptions = () => {
    return mutationOptions({
        mutationKey: presetKeys.deleteMutationKey(),
        mutationFn(data: DeletePresetInput) {
            return deletePresetFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: presetKeys.listQueryKey() });
        },
    });
};

export const saveSharedSettingsMutationOptions = () => {
    return mutationOptions({
        mutationKey: presetKeys.saveSharedSettingsMutationKey(),
        mutationFn(data: SaveSharedSettingsInput) {
            return saveSharedSettingsFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            // Refresh every scope (base key is a prefix of all of them) — a Head may have written a
            // team other than the one currently shown.
            client.invalidateQueries({ queryKey: presetKeys.sharedSettingsBaseKey() });
        },
    });
};
