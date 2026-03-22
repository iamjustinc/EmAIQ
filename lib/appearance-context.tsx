'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  type AppearanceState,
  type DensityMode,
  type FontScaleMode,
  type ThemePresetId,
  DEFAULT_APPEARANCE,
  STORAGE_KEY,
  isDensityMode,
  isFontScaleMode,
  isThemePresetId,
} from '@/lib/appearance/types';

interface AppearanceContextValue extends AppearanceState {
  setThemePreset: (id: ThemePresetId) => void;
  setDensity: (d: DensityMode) => void;
  setFontScale: (f: FontScaleMode) => void;
  resetAppearance: () => void;
}

const AppearanceContext = createContext<AppearanceContextValue | undefined>(undefined);

function parseStored(json: string | null): Partial<AppearanceState> {
  if (!json) return {};
  try {
    const raw = JSON.parse(json) as Record<string, unknown>;
    const out: Partial<AppearanceState> = {};
    if (typeof raw.themePreset === 'string' && isThemePresetId(raw.themePreset)) {
      out.themePreset = raw.themePreset;
    }
    if (typeof raw.density === 'string' && isDensityMode(raw.density)) {
      out.density = raw.density;
    }
    if (typeof raw.fontScale === 'string' && isFontScaleMode(raw.fontScale)) {
      out.fontScale = raw.fontScale;
    }
    return out;
  } catch {
    return {};
  }
}

function applyToDocument(state: AppearanceState) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.theme = state.themePreset;
  root.dataset.density = state.density;
  root.dataset.fontScale = state.fontScale;

  const lightThemes: ThemePresetId[] = [
    'creator-editorial',
    'sunlit-creator',
    'ocean-air',
    'sunset-ocean',
  ];

  root.classList.toggle('dark', !lightThemes.includes(state.themePreset));
  root.classList.toggle('light', lightThemes.includes(state.themePreset));
}

function persist(state: AppearanceState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

/** Global appearance / theme / density / font-scale provider. */
export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppearanceState>(DEFAULT_APPEARANCE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = parseStored(
      typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null,
    );

    const next: AppearanceState = {
      ...DEFAULT_APPEARANCE,
      ...stored,
    };

    setState(next);
    applyToDocument(next);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    applyToDocument(state);
    persist(state);
  }, [state, ready]);

  const setThemePreset = useCallback((id: ThemePresetId) => {
    setState((s) => ({ ...s, themePreset: id }));
  }, []);

  const setDensity = useCallback((density: DensityMode) => {
    setState((s) => ({ ...s, density }));
  }, []);

  const setFontScale = useCallback((fontScale: FontScaleMode) => {
    setState((s) => ({ ...s, fontScale }));
  }, []);

  const resetAppearance = useCallback(() => {
    setState(DEFAULT_APPEARANCE);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      setThemePreset,
      setDensity,
      setFontScale,
      resetAppearance,
    }),
    [state, setThemePreset, setDensity, setFontScale, resetAppearance],
  );

  return (
    <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>
  );
}

export function useAppearanceSettings(): AppearanceContextValue {
  const ctx = useContext(AppearanceContext);
  if (!ctx) {
    throw new Error('useAppearanceSettings must be used within AppearanceProvider');
  }
  return ctx;
}

/** Alias for documentation / future naming consistency */
export { AppearanceProvider as AppearanceSettingsProvider };

/** Safe optional hook for components that may render outside provider (should not happen). */
export function useAppearanceSettingsOptional(): AppearanceContextValue | null {
  return useContext(AppearanceContext) ?? null;
}