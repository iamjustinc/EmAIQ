'use client';

import { cn } from '@/lib/utils';
import { UrgencyLabel } from '@/lib/types';
import { Star } from 'lucide-react';

interface UrgencyBadgeProps {
  label: UrgencyLabel;
  score: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  showScore?: boolean;
  className?: string;
  compact?: boolean;
}

const urgencyStyles: Record<UrgencyLabel, string> = {
  High: 'bg-danger/10 text-danger',
  Medium: 'bg-warning/10 text-warning',
  Low: 'bg-success/10 text-success',
};

export function UrgencyBadge({ 
  label, 
  score, 
  isFavorite, 
  onToggleFavorite, 
  showScore = false, 
  className, 
  compact 
}: UrgencyBadgeProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        className={cn(
          'inline-flex items-center rounded-md font-medium shrink-0',
          compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
          urgencyStyles[label]
        )}
      >
        {compact ? label[0] : label}
        {showScore && !compact && (
          <span className="ml-1 opacity-60">{score}</span>
        )}
      </span>

      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="group/star relative flex items-center justify-center outline-none"
        >
          <Star
            className={cn(
              "h-4 w-4 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] transform",
              isFavorite 
                ? "fill-yellow-400 text-yellow-400 scale-110" 
                : "text-muted-foreground group-hover/star:text-foreground/70 scale-100",
              "active:scale-150"
            )}
          />
          {isFavorite && (
            <div className="absolute inset-0 h-4 w-4 bg-yellow-400/20 blur-sm animate-pulse rounded-full" />
          )}
        </button>
      )}
    </div>
  );
}