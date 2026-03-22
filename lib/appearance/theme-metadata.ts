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
    description: 'Bright, high-energy warm light mode.',
    swatches: ['#F4EFEB', '#FBF8F5', '#F4A261', '#1F1722'],
  },
  {
    id: 'eco-signal',
    name: 'Eco Signal',
    shortLabel: 'Eco',
    description: 'Deep forest greens with amber highlights.',
    swatches: ['#173222', '#1F3B29', '#E29A2D', '#F8F1E7'],
  },
  {
    id: 'ocean-air',
    name: 'Ocean Air',
    shortLabel: 'Ocean',
    description: 'Cool coastal blues and crisp whites.',
    swatches: ['#EEF6FA', '#F7FBFD', '#4DA3D9', '#183247'],
  },
  {
    id: 'sunset-ocean',
    name: 'Sunset Ocean',
    shortLabel: 'Sunset',
    description: 'Warm coastal blush with ocean teal contrast.',
    swatches: ['#FFF4F1', '#FFF8F6', '#3C9C97', '#2A2326'],
  },
];

export function getThemeMeta(id: ThemePresetId): ThemePresetMeta {
  return THEME_PRESETS.find((t) => t.id === id) ?? THEME_PRESETS[0];
}