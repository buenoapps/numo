import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react';

import { applyLocale, type LocaleOverride } from '@/lib/i18n';

/**
 * Stored under a versioned key so changes to the shape don't have to migrate
 * — bumping the version simply resets parents to the latest defaults.
 */
const STORAGE_KEY = 'numo.settings.v2';

export type PageKey = 'numbers' | 'count' | 'add' | 'sub';

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

const DEFAULTS: Settings = {
  pages: {
    numbers: { enabled: true, includeZero: true, until: 10 },
    count: { enabled: true, includeZero: true, until: 10 },
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
    soundsEnabled: parsed.soundsEnabled ?? DEFAULTS.soundsEnabled,
    languageOverride: parsed.languageOverride ?? DEFAULTS.languageOverride,
    pages: {
      numbers: mergePageConfig(DEFAULTS.pages.numbers, parsed.pages?.numbers),
      count: mergePageConfig(DEFAULTS.pages.count, parsed.pages?.count),
      add: mergePageConfig(DEFAULTS.pages.add, parsed.pages?.add),
      sub: mergePageConfig(DEFAULTS.pages.sub, parsed.pages?.sub),
    },
  };
}

type SettingsContextValue = {
  settings: Settings;
  hydrated: boolean;
  setPageConfig: (page: PageKey, patch: Partial<PageConfig>) => void;
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
        let next = DEFAULTS;
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
  };

  return createElement(SettingsContext.Provider, { value }, children);
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
