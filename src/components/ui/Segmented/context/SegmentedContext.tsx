import type { SegmentedMode } from '../types';
import { createContext } from 'react';

export const SegmentedContext = createContext<SegmentedMode | undefined>(undefined);

SegmentedContext.displayName = 'SegmentedContext';
