import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react';

import { applyLocale, type LocaleOverride } from '@/lib/i18n';

const STORAGE_KEY = 'numo.settings.v1';

export type NumbersRange = 10 | 21;

export type Settings = {
  subtractionEnabled: boolean;
  soundsEnabled: boolean;
  languageOverride: LocaleOverride;
  numbersRange: NumbersRange;
};

const DEFAULTS: Settings = {
  subtractionEnabled: false,
  soundsEnabled: true,
  languageOverride: 'device',
  numbersRange: 10,
};

type SettingsContextValue = {
  settings: Settings;
  hydrated: boolean;
  setSubtractionEnabled: (enabled: boolean) => void;
  setSoundsEnabled: (enabled: boolean) => void;
  setLanguageOverride: (override: LocaleOverride) => void;
  setNumbersRange: (range: NumbersRange) => void;
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
        let next = DEFAULTS;
        if (raw) {
          try {
            next = { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) };
          } catch {
            // ignore malformed payload, fall back to defaults
          }
        }
        setSettings(next);
        applyLocale(next.languageOverride);
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
    setSoundsEnabled: (enabled) => persist({ ...settings, soundsEnabled: enabled }),
    setLanguageOverride: (override) => {
      // Apply BEFORE persist so the locale listener and the settings update
      // are batched into the same React update; consumers see the new locale
      // on the next render rather than flashing the old one first.
      applyLocale(override);
      persist({ ...settings, languageOverride: override });
    },
    setNumbersRange: (range) => persist({ ...settings, numbersRange: range }),
  };

  return createElement(SettingsContext.Provider, { value }, children);
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
