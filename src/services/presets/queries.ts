import type { CreatePresetInput, RenamePresetInput, SavePresetVersionInput, SaveSharedSettingsInput } from './schemas';
import { mutationOptions, queryOptions } from '@tanstack/react-query';
import {
    createPresetFn,
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

export const sharedSettingsQueryOptions = () => {
    return queryOptions({
        queryKey: presetKeys.sharedSettingsQueryKey(),
        queryFn() {
            return getSharedSettingsFn();
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

export const saveSharedSettingsMutationOptions = () => {
    return mutationOptions({
        mutationKey: presetKeys.saveSharedSettingsMutationKey(),
        mutationFn(data: SaveSharedSettingsInput) {
            return saveSharedSettingsFn({ data });
        },
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            client.invalidateQueries({ queryKey: presetKeys.sharedSettingsQueryKey() });
        },
    });
};
