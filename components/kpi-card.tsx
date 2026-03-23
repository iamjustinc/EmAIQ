'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon?: LucideIcon;
  variant?: 'default' | 'danger' | 'warning';
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
        'bg-[#ECD7D1]/40 border-[#A8D0D0]', 
        onClick && 'hover:bg-white hover:border-[#7FC6DA] hover:shadow-xl active:scale-[0.98] cursor-pointer',
        active && 'ring-2 ring-[#7FC6DA] border-[#7FC6DA] bg-white shadow-lg scale-[1.02]'
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div className={cn(
          'rounded-2xl border-2 p-2.5 transition-colors',
          variant === 'danger' 
            ? 'border-[#F6B3C4] bg-[#F6B3C4]/20 text-[#D95D5D]' 
            : variant === 'warning'
            ? 'border-[#A8A29A] bg-[#A8A29A]/20 text-[#8C867E]'
            : 'border-[#7FC6DA] bg-[#7FC6DA]/20 text-[#7FC6DA]'
        )}>
          {title === 'Noise' ? <Sparkles className="h-5 w-5" /> : Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8C867E]">{title}</span>
      </div>

      <div className="flex flex-col">
        <span className="text-4xl font-black tracking-tighter text-[#2D3436]">{value}</span>
        <span className="mt-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#8C867E]">{subtitle}</span>
      </div>
    </button>
  );
}