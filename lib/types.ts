/**
 * Appearance / theme system — extend with new presets by:
 * 1. Add id here and to `ThemePresetMeta` in theme-metadata.ts
 * 2. Add matching `[data-theme="your-id"] { ... }` block in appearance-themes.css
 */

export type ThemePresetId =
  | 'midnight-intelligence'
  | 'creator-editorial'
  | 'sunlit-creator'
  | 'eco-signal'
  | 'ocean-air'
  | 'sunset-ocean';

export type DensityMode = 'compact' | 'comfortable' | 'spacious';

export type FontScaleMode = 'small' | 'medium' | 'large';

export interface AppearanceState {
  themePreset: ThemePresetId;
  density: DensityMode;
  fontScale: FontScaleMode;
}

export const DEFAULT_APPEARANCE: AppearanceState = {
  themePreset: 'creator-editorial',
  density: 'comfortable',
  fontScale: 'medium',
};

export const STORAGE_KEY = 'quail-appearance';

export function isThemePresetId(v: string): v is ThemePresetId {
  return (
    v === 'midnight-intelligence' ||
    v === 'creator-editorial' ||
    v === 'sunlit-creator' ||
    v === 'eco-signal' ||
    v === 'ocean-air' ||
    v === 'sunset-ocean'
  );
}

export function isDensityMode(v: string): v is DensityMode {
  return v === 'compact' || v === 'comfortable' || v === 'spacious';
}

export function isFontScaleMode(v: string): v is FontScaleMode {
  return v === 'small' || v === 'medium' || v === 'large';
}