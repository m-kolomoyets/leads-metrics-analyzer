import type { MapFillMode } from '@/lib/domain/mapFill';

export type FillModePickerProps = {
    mode: MapFillMode;
    onChange: (next: MapFillMode) => void;
};
