'use client';

import React from 'react';
import { cn } from '@/lib/utils';
// Assuming Sparkles is the name of that green icon in lucide-react, 
// if not, we can import it from the exact source.
import { Sparkles, LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  // Make icon optional, because the Noise card will use its specific hardcoded one
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
  onClick 
}: KPICardProps) {
  
  // Is this the "Noise" card? If so, we override the icon and color.
  const isNoiseCard = title === 'Noise';

  return (
    <button
      onClick={onClick}
      className={cn(
        "bg-[#0F1117] border border-white/5 p-6 rounded-3xl flex items-center gap-5 w-full text-left transition-all group",
        onClick && "hover:border-blue-500/20 hover:bg-white/[0.01] cursor-pointer"
      )}
    >
      {/* Icon Container */}
      <div className={cn(
        "p-3 rounded-2xl border",
        // Specific styles for the green "Noise" card
        isNoiseCard 
          ? "bg-green-500/10 border-green-500/20 text-green-400"
          : variant === 'default'
          ? "bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-500/20"
          : variant === 'danger'
          ? "bg-red-500/10 border-red-500/20 text-red-500 group-hover:text-red-400 group-hover:bg-red-500/20"
          : variant === 'warning'
          ? "bg-orange-500/10 border-orange-500/20 text-orange-500 group-hover:text-orange-400 group-hover:bg-orange-500/20"
          : "bg-gray-500/10 border-gray-500/20 text-gray-500"
      )}>
        {/* USE THE GREEN STAR ICON for NOISE, otherwise use passed Icon */}
        {isNoiseCard ? (
          <Sparkles className="h-6 w-6" /> // This is the icon from image_2.png
        ) : Icon ? (
          <Icon className="h-6 w-6" />
        ) : null}
      </div>

      {/* Text Container */}
      <div className="flex flex-col">
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-600 group-hover:text-gray-400">
          {title}
        </span>
        <span className={cn(
          "text-3xl font-bold tracking-tight",
          isNoiseCard ? "text-green-400" : "text-white"
        )}>
          {value}
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 mt-1">
          {subtitle}
        </span>
      </div>
    </button>
  );
}