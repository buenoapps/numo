import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'numo.settings.v1';

export type Settings = {
  subtractionEnabled: boolean;
};

const DEFAULTS: Settings = {
  subtractionEnabled: false,
};

type SettingsContextValue = {
  settings: Settings;
  hydrated: boolean;
  setSubtractionEnabled: (enabled: boolean) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as Partial<Settings>;
            setSettings({ ...DEFAULTS, ...parsed });
          } catch {
            // ignore malformed payload, fall back to defaults
          }
        }
        setHydrated(true);
      })
      .catch(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = (next: Settings) => {
    setSettings(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const value: SettingsContextValue = {
    settings,
    hydrated,
    setSubtractionEnabled: (enabled) => persist({ ...settings, subtractionEnabled: enabled }),
  };

  return createElement(SettingsContext.Provider, { value }, children);
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
