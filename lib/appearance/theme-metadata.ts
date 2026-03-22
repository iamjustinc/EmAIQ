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
    description: 'Premium dark SaaS — Linear × Superhuman focus.',
    swatches: ['#070B14', '#101827', '#3B82F6', '#F5F7FB'],
  },
  {
    id: 'creator-editorial',
    name: 'Creator Editorial',
    shortLabel: 'Editorial',
    description: 'Warm cream canvas, ink type, coral accents.',
    swatches: ['#F7F1EB', '#FFFDF9', '#F59E72', '#201B18'],
  },
  {
    id: 'sunset-ocean',
    name: 'Sunset Ocean',
    shortLabel: 'Sunset',
    description: 'Warm coastal blush with ocean teal contrast.',
    swatches: ['#FFF4F1', '#FFB5B0', '#8DD8CF', '#3C9C97'],
  },
];

export function getThemeMeta(id: ThemePresetId): ThemePresetMeta {
  return THEME_PRESETS.find((t) => t.id === id) ?? THEME_PRESETS[0];
}