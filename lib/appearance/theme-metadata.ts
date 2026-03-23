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
    description: 'Premium dark SaaS — Sunlit Creator Dark Reflection.',
    swatches: ['#1F2426', '#2A3133', '#F59E72', '#E6E1DC'], // [Bg, Surface, Accent, Text]
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
    description: 'Sky blues, sunset pinks, and soft seafoam.',
    swatches: ['#F4F7F7', '#F6B3C4', '#99BED4', '#2D3436'],
  },
];