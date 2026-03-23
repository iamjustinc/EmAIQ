'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string; value: string | number; subtitle: string; icon?: LucideIcon;
  variant?: 'default' | 'danger' | 'warning' | 'success'; onClick?: () => void; active?: boolean;
}

export function KPICard({ title, value, subtitle, icon: Icon, variant = 'default', onClick, active }: KPICardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full flex-col gap-4 rounded-[2rem] border p-6 text-left transition-all duration-300 group shadow-sm',
        'bg-white text-foreground border-[#A8D0D0]', // Seafoam Border
        onClick && 'hover:border-[#99BED4] hover:shadow-md active:scale-[0.98]',
        active && 'ring-2 ring-[#99BED4] border-[#99BED4] bg-[#99BED4]/5'
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div className={cn(
          'rounded-2xl border p-2.5 transition-colors',
          variant === 'danger' ? 'border-[#F6B3C4]/20 bg-[#F6B3C4]/10 text-[#F6B3C4]' : 'border-[#99BED4]/20 bg-[#99BED4]/10 text-[#99BED4]'
        )}>
          {title === 'Noise' ? <Sparkles className="h-5 w-5" /> : Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">{title}</span>
      </div>

      <div className="flex flex-col">
        <span className="text-4xl font-black tracking-tighter text-foreground">{value}</span>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">{subtitle}</span>
      </div>
    </button>
  );
}