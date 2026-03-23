'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, LucideIcon } from 'lucide-react';

// Assuming KPICardProps is defined in your types or locally
interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon?: LucideIcon;
  variant?: 'default' | 'danger';
  onClick?: () => void;
  active?: boolean;
}

export function KPICard({ title, value, subtitle, icon: Icon, variant = 'default', onClick, active }: KPICardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full flex-col gap-4 rounded-[2.5rem] border-2 p-6 text-left transition-all duration-300 group',
        // Increased background opacity and border strength
        'bg-[#ECD7D1]/40 border-[#A8D0D0]', 
        onClick && 'hover:bg-white hover:border-[#99BED4] hover:shadow-xl active:scale-[0.98]',
        // Solid white background when active for maximum pop
        active && 'ring-2 ring-[#99BED4] border-[#99BED4] bg-white shadow-lg scale-[1.02]'
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div className={cn(
          'rounded-2xl border-2 p-2.5 transition-colors',
          variant === 'danger' 
            ? 'border-[#F6B3C4] bg-[#F6B3C4]/20 text-[#F6B3C4]' // Sunset Pink (Higher Contrast)
            : 'border-[#99BED4] bg-[#99BED4]/20 text-[#99BED4]'  // Sky Blue (Higher Contrast)
        )}>
          {title === 'Noise' ? <Sparkles className="h-5 w-5" /> : Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
        {/* Darkened text from A8A29A to A8A29A/Solid for better readability */}
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8C867E]">{title}</span>
      </div>

      <div className="flex flex-col">
        {/* Solid charcoal foreground for the main value */}
        <span className="text-4xl font-black tracking-tighter text-[#2D3436]">{value}</span>
        <span className="mt-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#8C867E]">{subtitle}</span>
      </div>
    </button>
  );
}