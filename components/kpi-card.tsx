'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const variantStyles = {
  default: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
  success: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
  warning: 'text-orange-400 border-orange-500/20 bg-orange-500/5',
  danger: 'text-red-400 border-red-500/20 bg-red-500/5',
  info: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
};

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = 'default' 
}: KPICardProps) {
  // Safety check for production builds
  if (!Icon) return null;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0F1117] p-6 shadow-2xl transition-all hover:border-white/10">
      <div className="flex flex-col gap-5">
        <div className={cn(
          'w-fit rounded-2xl border p-3 shadow-inner',
          variantStyles[variant] || variantStyles.default
        )}>
          <Icon className="h-5 w-5" />
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold tracking-tight text-white">
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
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}
