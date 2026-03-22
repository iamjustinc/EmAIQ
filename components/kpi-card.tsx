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
  active?: boolean; // Added to show which filter is on
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
        // Critical: use var(--card) or var(--background) instead of 'bg-white'
        'bg-card text-card-foreground border-border',
        onClick && 'hover:border-primary/40 hover:shadow-md active:scale-[0.98]',
        active && 'ring-2 ring-primary border-primary bg-primary/5'
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div
          className={cn(
            'rounded-2xl border p-2.5 transition-colors',
            variant === 'danger'
              ? 'border-destructive/20 bg-destructive/10 text-destructive'
              : variant === 'warning'
                ? 'border-warning/20 bg-warning/10 text-warning'
                : 'border-primary/20 bg-primary/10 text-primary'
          )}
        >
          {isNoiseCard ? <Sparkles className="h-5 w-5" /> : Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">
          {title}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-4xl font-black tracking-tighter">
          {value}
        </span>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          {subtitle}
        </span>
      </div>
    </button>
  );
}