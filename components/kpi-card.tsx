'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon?: LucideIcon;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  onClick?: () => void;
  active?: boolean;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  onClick,
  active
}: KPICardProps) {
  const isNoiseCard = title === 'Noise';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full flex-col gap-4 rounded-[2rem] border p-6 text-left transition-all duration-300 group shadow-sm',
        // Aesthetic: Use var(--card) and Seafoam var(--border)
        'bg-card text-card-foreground border-border',
        onClick && 'hover:border-primary hover:shadow-md active:scale-[0.98]',
        // Active state uses the Sky Blue (primary)
        active && 'ring-2 ring-primary border-primary bg-primary/5'
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div
          className={cn(
            'rounded-2xl border p-2.5 transition-colors',
            // Varients mapped to Sunlit palette
            variant === 'danger'
              ? 'border-muted/20 bg-muted/10 text-muted' // Pink for alerts
              : 'border-primary/20 bg-primary/10 text-primary' // Blue for defaults
          )}
        >
          {isNoiseCard ? <Sparkles className="h-5 w-5" /> : Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
          {title}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-4xl font-black tracking-tighter text-foreground">
          {value}
        </span>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">
          {subtitle}
        </span>
      </div>
    </button>
  );
}