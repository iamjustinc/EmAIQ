'use client';

import { cn } from '@/lib/utils';
import type { ThemePresetMeta } from '@/lib/appearance/theme-metadata';

interface ThemePreviewCardProps {
  meta: ThemePresetMeta;
  selected: boolean;
  onSelect: () => void;
}

export function ThemePreviewCard({ meta, selected, onSelect }: ThemePreviewCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group relative w-full overflow-hidden rounded-2xl border text-left transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        selected
          ? 'border-primary shadow-[0_0_0_1px_var(--color-primary)] shadow-lg shadow-primary/15'
          : 'border-border hover:border-primary/40 hover:shadow-lg',
      )}
      aria-pressed={selected}
    >
      {/* Mini UI strip */}
      <div className="relative h-[4.25rem] overflow-hidden border-b border-border/60 bg-muted/40 px-2.5 py-2">
        <div className="flex h-full gap-1">
          {meta.swatches.map((c, i) => (
            <div
              key={i}
              className="flex-1 rounded-md shadow-inner transition-transform duration-300 group-hover:scale-[1.02]"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-2 bottom-1.5 flex gap-1 opacity-60">
          <div className="h-1 w-4 rounded-full bg-foreground/20" />
          <div className="h-1 flex-1 rounded-full bg-foreground/10" />
        </div>
      </div>
      <div className="space-y-1 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold tracking-tight text-foreground">{meta.name}</p>
          {selected && (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
              Active
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{meta.description}</p>
      </div>
    </button>
  );
}
