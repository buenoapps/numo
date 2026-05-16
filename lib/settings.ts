import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react';

import { applyLocale, type LocaleOverride } from '@/lib/i18n';

/**
 * Stored under a versioned key so changes to the shape don't have to migrate
 * — bumping the version simply resets parents to the latest defaults.
 */
const STORAGE_KEY = 'numo.settings.v3';

export type PageKey = 'listen' | 'count' | 'add' | 'sub';

export type PageConfig = {
  /** Show this page on Home and let the user open it. */
  enabled: boolean;
  /** Include 0 in the value range (addends / minuend / count / shown number). */
  includeZero: boolean;
  /** Upper bound. Semantics vary slightly per page (see callers). */
  until: number;
};

export type Settings = {
  pages: Record<PageKey, PageConfig>;
  soundsEnabled: boolean;
  languageOverride: LocaleOverride;
};

export const DEFAULT_SETTINGS: Settings = {
  pages: {
    listen: { enabled: true, includeZero: true, until: 10 },
    count: { enabled: true, includeZero: false, until: 10 },
    add: { enabled: true, includeZero: true, until: 10 },
    sub: { enabled: false, includeZero: true, until: 10 },
  },
  soundsEnabled: true,
  languageOverride: 'device',
};

function mergePageConfig(defaults: PageConfig, partial: Partial<PageConfig> | undefined): PageConfig {
  return { ...defaults, ...(partial ?? {}) };
}

function fromStorage(parsed: Partial<Settings>): Settings {
  return {
    soundsEnabled: parsed.soundsEnabled ?? DEFAULT_SETTINGS.soundsEnabled,
    languageOverride: parsed.languageOverride ?? DEFAULT_SETTINGS.languageOverride,
    pages: {
      listen: mergePageConfig(DEFAULT_SETTINGS.pages.listen, parsed.pages?.listen),
      count: mergePageConfig(DEFAULT_SETTINGS.pages.count, parsed.pages?.count),
      add: mergePageConfig(DEFAULT_SETTINGS.pages.add, parsed.pages?.add),
      sub: mergePageConfig(DEFAULT_SETTINGS.pages.sub, parsed.pages?.sub),
    },
  };
}

type SettingsContextValue = {
  settings: Settings;
  hydrated: boolean;
  setPageConfig: (page: PageKey, patch: Partial<PageConfig>) => void;
  setSoundsEnabled: (enabled: boolean) => void;
  setLanguageOverride: (override: LocaleOverride) => void;
  resetSettings: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        let next = DEFAULT_SETTINGS;
        if (raw) {
          try {
            next = fromStorage(JSON.parse(raw) as Partial<Settings>);
          } catch {
            // malformed payload — fall back to defaults
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
    setPageConfig: (page, patch) =>
      persist({
        ...settings,
        pages: {
          ...settings.pages,
          [page]: { ...settings.pages[page], ...patch },
        },
      }),
    setSoundsEnabled: (enabled) => persist({ ...settings, soundsEnabled: enabled }),
    setLanguageOverride: (override) => {
      applyLocale(override);
      persist({ ...settings, languageOverride: override });
    },
    resetSettings: () => {
      applyLocale(DEFAULT_SETTINGS.languageOverride);
      setSettings(DEFAULT_SETTINGS);
      AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    },
  };

  return createElement(SettingsContext.Provider, { value }, children);
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
