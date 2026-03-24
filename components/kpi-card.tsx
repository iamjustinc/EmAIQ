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

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  onClick,
  active,
}: KPICardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex w-full min-w-0 flex-col gap-3 rounded-[1.75rem] border-2 p-4 text-left transition-all duration-300 sm:rounded-[2rem] sm:p-5 lg:rounded-[2.5rem] lg:p-6',
        'bg-[#ECD7D1]/40 border-[#A8D0D0]',
        onClick && 'cursor-pointer hover:border-[#7FC6DA] hover:bg-white hover:shadow-xl active:scale-[0.98]',
        active && 'scale-[1.02] border-[#7FC6DA] bg-white shadow-lg ring-2 ring-[#7FC6DA]'
      )}
    >
      <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className={cn(
            'rounded-xl border-2 p-2 transition-colors sm:rounded-2xl sm:p-2.5',
            variant === 'danger'
              ? 'border-[#F6B3C4] bg-[#F6B3C4]/20 text-[#D95D5D]'
              : variant === 'warning'
              ? 'border-[#A8A29A] bg-[#A8A29A]/20 text-[#8C867E]'
              : 'border-[#7FC6DA] bg-[#7FC6DA]/20 text-[#7FC6DA]'
          )}
        >
          {title === 'Noise' ? (
            <Sparkles className="h-5 w-5" />
          ) : Icon ? (
            <Icon className="h-5 w-5" />
          ) : null}
        </div>

        <span className="text-left text-[9px] font-black uppercase tracking-[0.2em] text-[#8C867E] sm:text-right sm:text-[10px] sm:tracking-[0.3em]">
          {title}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-3xl font-black tracking-tighter text-[#2D3436] sm:text-4xl">
          {value}
        </span>
        <span className="mt-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#8C867E]">
          {subtitle}
        </span>
      </div>
    </button>
  );
}