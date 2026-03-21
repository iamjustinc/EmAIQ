import { cn } from '@/lib/utils';
import { UrgencyLabel } from '@/lib/types';

interface UrgencyBadgeProps {
  label: UrgencyLabel;
  score: number;
  showScore?: boolean;
  className?: string;
  compact?: boolean;
}

const urgencyStyles: Record<UrgencyLabel, string> = {
  High: 'bg-danger/10 text-danger',
  Medium: 'bg-warning/10 text-warning',
  Low: 'bg-success/10 text-success',
};

export function UrgencyBadge({ label, score, showScore = false, className, compact }: UrgencyBadgeProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span
        className={cn(
          'inline-flex items-center rounded-md font-medium',
          compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
          urgencyStyles[label]
        )}
      >
        {compact ? label[0] : label}
        {showScore && !compact && (
          <span className="ml-1 opacity-60">{score}</span>
        )}
      </span>
    </div>
  );
}
