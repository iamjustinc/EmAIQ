'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAppearanceSettings } from '@/lib/appearance-context';
import type { DensityMode, FontScaleMode, ThemePresetId } from '@/lib/appearance/types';
import { THEME_PRESETS } from '@/lib/appearance/theme-metadata';
import { ThemePreviewCard } from '@/components/appearance/theme-preview-card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, LayoutGrid, Rows3, Type, Sparkles } from 'lucide-react';

const DENSITY_OPTIONS: { id: DensityMode; label: string; hint: string }[] = [
  { id: 'compact', label: 'Compact', hint: 'Maximum density' },
  { id: 'comfortable', label: 'Comfortable', hint: 'Balanced default' },
  { id: 'spacious', label: 'Spacious', hint: 'Editorial breathing room' },
];

const FONT_OPTIONS: { id: FontScaleMode; label: string; hint: string }[] = [
  { id: 'small', label: 'Small', hint: 'Productivity' },
  { id: 'medium', label: 'Medium', hint: 'Default' },
  { id: 'large', label: 'Large', hint: 'Presentations' },
];

function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string; hint: string }[];
  label: string;
}) {
  return (
    <div className="space-y-3">
      <Label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </Label>
      <div
        className="flex flex-wrap gap-1.5 rounded-2xl border border-border/80 bg-muted/30 p-1.5"
        role="radiogroup"
        aria-label={label}
      >
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.id)}
              className={cn(
                'flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-3 py-2.5 text-center transition-all duration-200',
                active
                  ? 'bg-card text-foreground shadow-sm ring-1 ring-primary/40'
                  : 'text-muted-foreground hover:bg-card/60 hover:text-foreground',
              )}
            >
              <span className="text-xs font-semibold">{opt.label}</span>
              <span className="mt-0.5 text-[10px] text-muted-foreground">{opt.hint}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AppearanceSettingsPanel() {
  const {
    themePreset,
    setThemePreset,
    density,
    setDensity,
    fontScale,
    setFontScale,
    resetAppearance,
  } = useAppearanceSettings();

  const [themeOpen, setThemeOpen] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-inner">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="text-title-scale font-bold tracking-tight text-foreground">Appearance</h2>
          <p className="text-sm text-muted-foreground">
            Tune the visual language of EmailIQ. Changes apply instantly and persist on this device.
          </p>
        </div>
      </div>

      {/* Theme — collapsible with preview grid */}
      <Collapsible open={themeOpen} onOpenChange={setThemeOpen}>
        <div className="overflow-hidden rounded-3xl border border-border/80 bg-card/40 shadow-sm">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 p-card-ui text-left transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 text-foreground">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Theme</p>
                  <p className="text-xs text-muted-foreground">
                    {THEME_PRESETS.find((t) => t.id === themePreset)?.name ?? 'Theme'}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  'h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300',
                  themeOpen && 'rotate-180',
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="animate-in slide-in-from-top-1 data-[state=closed]:animate-out data-[state=closed]:fade-out-0">
            <div className="border-t border-border/60 p-card-ui pt-0">
              <p className="mb-4 text-xs text-muted-foreground">
                Choose a preset. Each theme maps to semantic tokens — add new presets in{' '}
                <code className="rounded bg-muted px-1 py-0.5 text-[10px]">app/appearance-themes.css</code>.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {THEME_PRESETS.map((meta) => (
                  <ThemePreviewCard
                    key={meta.id}
                    meta={meta}
                    selected={themePreset === meta.id}
                    onSelect={() => setThemePreset(meta.id as ThemePresetId)}
                  />
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Density */}
      <div className="rounded-3xl border border-border/80 bg-card/40 p-card-ui shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 text-foreground">
            <Rows3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Density</p>
            <p className="text-xs text-muted-foreground">Spacing, padding, and row rhythm across the app.</p>
          </div>
        </div>
        <SegmentedControl
          label="Density mode"
          value={density}
          onChange={setDensity}
          options={DENSITY_OPTIONS}
        />
      </div>

      {/* Font size */}
      <div className="rounded-3xl border border-border/80 bg-card/40 p-card-ui shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 text-foreground">
            <Type className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Font size</p>
            <p className="text-xs text-muted-foreground">Controlled typography scale — not browser zoom.</p>
          </div>
        </div>
        <SegmentedControl
          label="Type scale"
          value={fontScale}
          onChange={setFontScale}
          options={FONT_OPTIONS}
        />
      </div>

      <div className="flex justify-end">
        <Button type="button" variant="outline" className="rounded-xl border-border/80" onClick={resetAppearance}>
          Reset to defaults
        </Button>
      </div>
    </div>
  );
}
