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
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  onClick,
}: KPICardProps) {
  const isNoiseCard = title === 'Noise';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-5 rounded-card-ui border border-border bg-card text-left text-card-foreground transition-all duration-300 group',
        'p-card-ui',
        onClick && 'cursor-pointer hover:border-primary/25 hover:bg-muted/30',
      )}
    >
      <div
        className={cn(
          'rounded-2xl border p-3',
          isNoiseCard
            ? 'border-success/20 bg-success/10 text-success'
            : variant === 'default'
              ? 'border-primary/20 bg-primary/10 text-primary group-hover:bg-primary/15'
              : variant === 'danger'
                ? 'border-danger/20 bg-danger/10 text-danger group-hover:bg-danger/15'
                : variant === 'warning'
                  ? 'border-warning/20 bg-warning/10 text-warning group-hover:bg-warning/15'
                  : 'border-muted-foreground/20 bg-muted text-muted-foreground',
        )}
      >
        {isNoiseCard ? (
          <Sparkles className="h-6 w-6" />
        ) : Icon ? (
          <Icon className="h-6 w-6" />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col">
        <span className="text-label-scale font-bold uppercase tracking-[0.3em] text-muted-foreground group-hover:text-foreground/80">
          {title}
        </span>
        <span
          className={cn(
            'text-kpi-scale font-bold tracking-tight',
            isNoiseCard ? 'text-success' : 'text-foreground',
          )}
        >
          {value}
        </span>
        <span className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
          {subtitle}
        </span>
      </div>
    </button>
  );
}
