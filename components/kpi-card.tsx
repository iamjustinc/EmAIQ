'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string; // We'll use this for the "Trend" text like "Based on 12 archives"
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

// Map your variants to the specific "Alex" color palette
const variantStyles = {
  default: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
  success: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
  warning: 'text-orange-400 border-orange-500/20 bg-orange-500/5',
  danger: 'text-red-400 border-red-500/20 bg-red-500/5',
  info: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
};

const iconColors = {
  default: 'text-blue-400',
  success: 'text-emerald-400',
  warning: 'text-orange-400',
  danger: 'text-red-400',
  info: 'text-purple-400',
};

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = 'default' 
}: KPICardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0F1117] p-6 shadow-2xl transition-all hover:border-white/10">
      {/* Decorative background glow on hover */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5 blur-3xl transition-opacity group-hover:opacity-100 opacity-0" />

      <div className="flex flex-col gap-5">
        {/* Icon Header */}
        <div className={cn(
          'w-fit rounded-2xl border p-3 shadow-inner transition-transform group-hover:scale-110 duration-300',
          variantStyles[variant]
        )}>
          <Icon className={cn('h-5 w-5', iconColors[variant])} />
        </div>

        {/* Value Section */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold tracking-tight text-white transition-colors group-hover:text-blue-50">
              {value}
            </h3>
            {trend && (
              <span className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-md border',
                trend.isPositive 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              )}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </span>
            )}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 group-hover:text-gray-400 transition-colors">
            {title}
          </p>
        </div>

        {/* Footer/Subtitle Section */}
        {(subtitle || trend) && (
          <div className="mt-2 pt-4 border-t border-white/[0.03]">
            <p className="text-[10px] font-medium text-gray-600 tracking-wide">
              {subtitle || (trend?.isPositive ? 'Performing better than yesterday' : 'Action required')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
