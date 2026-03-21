import { cn } from '@/lib/utils';
import { SuggestedAction } from '@/lib/types';
import { Reply, Clock, Users, Archive } from 'lucide-react';

interface ActionBadgeProps {
  action: SuggestedAction;
  className?: string;
  compact?: boolean;
}

const actionConfig: Record<SuggestedAction, { icon: typeof Reply; style: string; label: string }> = {
  Respond: { icon: Reply, style: 'bg-primary/10 text-primary', label: 'Reply' },
  'Review Later': { icon: Clock, style: 'bg-info/10 text-info', label: 'Review' },
  Delegate: { icon: Users, style: 'bg-warning/10 text-warning', label: 'Delegate' },
  Archive: { icon: Archive, style: 'bg-muted text-muted-foreground/70', label: 'Archive' },
};

export function ActionBadge({ action, className, compact }: ActionBadgeProps) {
  const config = actionConfig[action];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md font-medium',
        compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
        config.style,
        className
      )}
    >
      <Icon className={cn(compact ? 'h-2.5 w-2.5' : 'h-3 w-3')} />
      {compact ? config.label : action}
    </span>
  );
}
