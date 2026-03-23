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
  {
    id: 'eco-signal',
    name: 'Eco Signal',
    shortLabel: 'Eco',
    description: 'Earthy greens with amber signal.',
    swatches: ['#173222', '#264734', '#E29A2D', '#F8F1E7'],
  },
  {
    id: 'ocean-air',
    name: 'Ocean Air',
    shortLabel: 'Ocean',
    description: 'Cool, airy blues with crisp coastal clarity.',
    swatches: ['#EEF6FA', '#FFFFFF', '#4DA3D9', '#183247'],
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