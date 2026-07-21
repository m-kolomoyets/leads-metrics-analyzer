import { createContext } from 'react';
import { useLocalStorageValue } from '@react-hookz/web';
import { LS_BG_ANIM_KEY } from '@/lib/constants';
import { useSafeContext } from '@/hooks/useSafeContext';

// Persisted on/off toggle for the animated gradient background. Mirrors ThemeContext.
type BackgroundProviderProps = {
    children: React.ReactNode;
    storageKey?: string;
};

type BackgroundProviderState = {
    isAnimated: boolean;
    setAnimated: (value: boolean) => void;
};

const BackgroundProviderContext = createContext<BackgroundProviderState>({} as BackgroundProviderState);
BackgroundProviderContext.displayName = 'BackgroundProviderContext';

export function BackgroundProvider({ children, storageKey = LS_BG_ANIM_KEY }: BackgroundProviderProps) {
    const { value, set } = useLocalStorageValue(storageKey, { defaultValue: 'on' });
    const isAnimated = value !== 'off';

    const setAnimated = (next: boolean) => {
        set(next ? 'on' : 'off');
    };

    return <BackgroundProviderContext value={{ isAnimated, setAnimated }}>{children}</BackgroundProviderContext>;
}

export const useBackground = () => {
    const context = useSafeContext(BackgroundProviderContext);

    return context;
};
