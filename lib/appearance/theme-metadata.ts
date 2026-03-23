import type { ThemePresetId } from '@/lib/appearance/types';

export interface ThemePresetMeta {
  id: ThemePresetId;
  name: string;
  description: string;
  swatches: [string, string, string, string];
  shortLabel: string;
}

export const THEME_PRESETS: ThemePresetMeta[] = [
  {
    id: 'midnight-intelligence',
    name: 'Midnight Intelligence',
    shortLabel: 'Midnight',
    description: 'Premium dark SaaS with layered ocean-charcoal surfaces and sunset orange accents.',
    swatches: ['#1F2426', '#2A3133', '#F59E72', '#E6E1DC'],
  },
  {
    id: 'sunlit-creator',
    name: 'Sunlit Creator',
    shortLabel: 'Sunlit',
    description: 'Sky blues, sunset pinks, and soft seafoam.',
    swatches: ['#F4F7F7', '#F6B3C4', '#99BED4', '#2D3436'],
  },
];

export function getThemeMeta(id: ThemePresetId): ThemePresetMeta {
  return THEME_PRESETS.find((t) => t.id === id) ?? THEME_PRESETS[0];
}