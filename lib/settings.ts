import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react';

import { applyLocale, type LocaleOverride } from '@/lib/i18n';

const STORAGE_KEY = 'numo.settings.v1';

export type Settings = {
  subtractionEnabled: boolean;
  soundsEnabled: boolean;
  languageOverride: LocaleOverride;
};

const DEFAULTS: Settings = {
  subtractionEnabled: false,
  soundsEnabled: true,
  languageOverride: 'device',
};

type SettingsContextValue = {
  settings: Settings;
  hydrated: boolean;
  setSubtractionEnabled: (enabled: boolean) => void;
  setSoundsEnabled: (enabled: boolean) => void;
  setLanguageOverride: (override: LocaleOverride) => void;
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

  // Keep i18n in sync with the override on every render. Idempotent.
  applyLocale(settings.languageOverride);

  const persist = (next: Settings) => {
    setSettings(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const value: SettingsContextValue = {
    settings,
    hydrated,
    setSubtractionEnabled: (enabled) => persist({ ...settings, subtractionEnabled: enabled }),
    setSoundsEnabled: (enabled) => persist({ ...settings, soundsEnabled: enabled }),
    setLanguageOverride: (override) => persist({ ...settings, languageOverride: override }),
  };

  return createElement(SettingsContext.Provider, { value }, children);
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
