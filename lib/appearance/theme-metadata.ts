import type { ThemePresetId } from '@/lib/appearance/types';

export interface ThemePresetMeta {
  id: ThemePresetId;
  name: string;
  description: string;
  swatches: [string, string, string, string]; // [Bg, Surface, Accent, Text]
  shortLabel: string;
}

export const THEME_PRESETS: ThemePresetMeta[] = [
  {
    id: 'midnight-intelligence',
    name: 'Midnight Intelligence',
    shortLabel: 'Midnight',
    description: 'Premium dark SaaS — Linear × Superhuman focus.',
    swatches: ['#070B14', '#0D1320', '#3B82F6', '#F5F7FB'],
  },
  {
    id: 'creator-editorial',
    name: 'Creator Editorial',
    shortLabel: 'Editorial',
    description: 'Warm cream canvas, ink type, coral accents.',
    swatches: ['#F7F1EB', '#FFF8F2', '#F59E72', '#201B18'],
  },
  {
    id: 'sunlit-creator',
    name: 'Sunlit Creator',
    shortLabel: 'Sunlit',
    description: 'Aqua teals and sunset golds from the coast.',
    swatches: ['#FFF9F5', '#FFFFFF', '#4DB6AC', '#2D242E'],
  },
];

export function getThemeMeta(id: ThemePresetId): ThemePresetMeta {
  return THEME_PRESETS.find((t) => t.id === id) ?? THEME_PRESETS[2]; // Defaults to Sunlit if not found
}