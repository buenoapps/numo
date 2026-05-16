import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react';

import { DEFAULT_MONSTER, type Monster } from '@/constants/monsters';
import { applyLocale, type LocaleOverride } from '@/lib/i18n';

/**
 * Multi-user store. v4 introduces the `users` map and `activeUserId`; the
 * v3 single-user payload is intentionally not migrated.
 */
const STORAGE_KEY = 'numo.store.v4';

export type PageKey = 'listen' | 'count' | 'add' | 'sub';

export type PageConfig = {
  enabled: boolean;
  includeZero: boolean;
  until: number;
};

export type PerUserSettings = {
  pages: Record<PageKey, PageConfig>;
  soundsEnabled: boolean;
  languageOverride: LocaleOverride;
};

export type ScoredOp = 'count' | 'add' | 'sub';

export type Stat = { correct: number; wrong: number };
export type Stats = Record<ScoredOp, Stat>;

export type User = {
  id: string;
  name: string;
  monster: Monster;
  createdAt: number;
  settings: PerUserSettings;
  stats: Stats;
};

type Store = {
  activeUserId: string | null;
  users: Record<string, User>;
};

const DEFAULT_PER_USER_SETTINGS: PerUserSettings = {
  pages: {
    listen: { enabled: true, includeZero: true, until: 10 },
    count: { enabled: true, includeZero: false, until: 10 },
    add: { enabled: true, includeZero: true, until: 10 },
    sub: { enabled: false, includeZero: true, until: 10 },
  },
  soundsEnabled: true,
  languageOverride: 'device',
};

const DEFAULT_STATS: Stats = {
  count: { correct: 0, wrong: 0 },
  add: { correct: 0, wrong: 0 },
  sub: { correct: 0, wrong: 0 },
};

const EMPTY_STORE: Store = { activeUserId: null, users: {} };

function mergePageConfig(
  defaults: PageConfig,
  partial: Partial<PageConfig> | undefined,
): PageConfig {
  return { ...defaults, ...(partial ?? {}) };
}

function mergeSettings(partial: Partial<PerUserSettings> | undefined): PerUserSettings {
  const fallback = DEFAULT_PER_USER_SETTINGS;
  if (!partial) return fallback;
  return {
    soundsEnabled: partial.soundsEnabled ?? fallback.soundsEnabled,
    languageOverride: partial.languageOverride ?? fallback.languageOverride,
    pages: {
      listen: mergePageConfig(fallback.pages.listen, partial.pages?.listen),
      count: mergePageConfig(fallback.pages.count, partial.pages?.count),
      add: mergePageConfig(fallback.pages.add, partial.pages?.add),
      sub: mergePageConfig(fallback.pages.sub, partial.pages?.sub),
    },
  };
}

function mergeStats(partial: Partial<Stats> | undefined): Stats {
  if (!partial) return DEFAULT_STATS;
  return {
    count: { ...DEFAULT_STATS.count, ...(partial.count ?? {}) },
    add: { ...DEFAULT_STATS.add, ...(partial.add ?? {}) },
    sub: { ...DEFAULT_STATS.sub, ...(partial.sub ?? {}) },
  };
}

function mergeUser(raw: Partial<User> & { id: string }): User {
  return {
    id: raw.id,
    name: raw.name ?? '',
    monster: raw.monster ?? DEFAULT_MONSTER,
    createdAt: raw.createdAt ?? Date.now(),
    settings: mergeSettings(raw.settings),
    stats: mergeStats(raw.stats),
  };
}

function fromStorage(parsed: Partial<Store>): Store {
  const users: Record<string, User> = {};
  for (const [id, raw] of Object.entries(parsed.users ?? {})) {
    if (raw && typeof raw === 'object') users[id] = mergeUser({ ...raw, id });
  }
  const activeUserId =
    parsed.activeUserId && users[parsed.activeUserId] ? parsed.activeUserId : null;
  return { activeUserId, users };
}

function generateUserId(): string {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

type SettingsContextValue = {
  /** Hydration completed (the AsyncStorage read finished). */
  hydrated: boolean;
  /** All users keyed by id. */
  users: Record<string, User>;
  /** The currently active user, or null when none have been created yet. */
  activeUser: User | null;
  /** The active user's settings (shortcut so screens stay simple). */
  settings: PerUserSettings;

  // Active-user mutations
  setPageConfig: (page: PageKey, patch: Partial<PageConfig>) => void;
  setSoundsEnabled: (enabled: boolean) => void;
  setLanguageOverride: (override: LocaleOverride) => void;
  setMonster: (monster: Monster) => void;
  /** Increment a first-attempt stat for the active user. */
  incrementStats: (op: ScoredOp, correct: boolean) => void;
  /**
   * Reset the active user's settings + stats back to defaults. Keeps the
   * user record (id, name, monster) intact.
   */
  resetSettings: () => void;

  // Multi-user mutations
  addUser: (name: string, monster: Monster) => User;
  switchUser: (id: string) => void;
  deleteUser: (id: string) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>(EMPTY_STORE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        let next = EMPTY_STORE;
        if (raw) {
          try {
            next = fromStorage(JSON.parse(raw) as Partial<Store>);
          } catch {
            // malformed payload — fall back to empty
          }
        }
        setStore(next);
        const activeUser = next.activeUserId ? next.users[next.activeUserId] : null;
        if (activeUser) applyLocale(activeUser.settings.languageOverride);
        setHydrated(true);
      })
      .catch(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = (next: Store) => {
    setStore(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const updateActive = (mutator: (user: User) => User) => {
    if (!store.activeUserId) return;
    const current = store.users[store.activeUserId];
    if (!current) return;
    const updated = mutator(current);
    persist({
      ...store,
      users: { ...store.users, [updated.id]: updated },
    });
  };

  const activeUser: User | null = store.activeUserId ? store.users[store.activeUserId] ?? null : null;

  const value: SettingsContextValue = {
    hydrated,
    users: store.users,
    activeUser,
    settings: activeUser?.settings ?? DEFAULT_PER_USER_SETTINGS,

    setPageConfig: (page, patch) =>
      updateActive((u) => ({
        ...u,
        settings: {
          ...u.settings,
          pages: { ...u.settings.pages, [page]: { ...u.settings.pages[page], ...patch } },
        },
      })),

    setSoundsEnabled: (enabled) =>
      updateActive((u) => ({ ...u, settings: { ...u.settings, soundsEnabled: enabled } })),

    setLanguageOverride: (override) => {
      applyLocale(override);
      updateActive((u) => ({ ...u, settings: { ...u.settings, languageOverride: override } }));
    },

    setMonster: (monster) => updateActive((u) => ({ ...u, monster })),

    incrementStats: (op, correct) =>
      updateActive((u) => {
        const prev = u.stats[op];
        const next: Stat = correct
          ? { correct: prev.correct + 1, wrong: prev.wrong }
          : { correct: prev.correct, wrong: prev.wrong + 1 };
        return { ...u, stats: { ...u.stats, [op]: next } };
      }),

    resetSettings: () =>
      updateActive((u) => ({
        ...u,
        settings: DEFAULT_PER_USER_SETTINGS,
        stats: DEFAULT_STATS,
      })),

    addUser: (name, monster) => {
      const id = generateUserId();
      const newUser: User = {
        id,
        name: name.trim() || '',
        monster,
        createdAt: Date.now(),
        settings: DEFAULT_PER_USER_SETTINGS,
        stats: DEFAULT_STATS,
      };
      persist({ activeUserId: id, users: { ...store.users, [id]: newUser } });
      applyLocale(newUser.settings.languageOverride);
      return newUser;
    },

    switchUser: (id) => {
      if (!store.users[id]) return;
      const target = store.users[id];
      applyLocale(target.settings.languageOverride);
      persist({ ...store, activeUserId: id });
    },

    deleteUser: (id) => {
      if (!store.users[id]) return;
      const nextUsers = { ...store.users };
      delete nextUsers[id];
      const remainingIds = Object.keys(nextUsers);
      const nextActiveId =
        store.activeUserId === id ? remainingIds[0] ?? null : store.activeUserId;
      persist({ activeUserId: nextActiveId, users: nextUsers });
    },
  };

  return createElement(SettingsContext.Provider, { value }, children);
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
