'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, LucideIcon } from 'lucide-react';

export function KPICard({ title, value, subtitle, icon: Icon, variant = 'default', onClick, active }: KPICardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full flex-col gap-4 rounded-[2.5rem] border p-6 text-left transition-all duration-300 group',
        'bg-[#ECD7D1]/20 border-[#A8D0D0]', // Blush Beige background + Seafoam border
        onClick && 'hover:bg-white hover:border-[#99BED4] hover:shadow-xl active:scale-[0.98]',
        active && 'ring-2 ring-[#99BED4] border-[#99BED4] bg-white'
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div className={cn(
          'rounded-2xl border p-2.5 transition-colors',
          variant === 'danger' 
            ? 'border-[#F6B3C4]/20 bg-[#F6B3C4]/10 text-[#F6B3C4]' // Sunset Pink
            : 'border-[#99BED4]/20 bg-[#99BED4]/10 text-[#99BED4]'  // Sky Blue
        )}>
          {title === 'Noise' ? <Sparkles className="h-5 w-5" /> : Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#A8A29A]">{title}</span>
      </div>

      <div className="flex flex-col">
        <span className="text-4xl font-black tracking-tighter text-foreground">{value}</span>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#A8A29A]/70">{subtitle}</span>
      </div>
    </button>
  );
}