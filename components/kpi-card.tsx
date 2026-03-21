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
  default: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
};

const bgStyles = {
  default: 'bg-primary/10',
  success: 'bg-success/10',
  warning: 'bg-warning/10',
  danger: 'bg-danger/10',
  info: 'bg-info/10',
};

export function KPICard({ title, value, subtitle, icon: Icon, trend, variant = 'default' }: KPICardProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-3">
      <div className="flex items-center gap-3">
        <div className={cn('rounded-lg p-2', bgStyles[variant])}>
          <Icon className={cn('h-4 w-4', variantStyles[variant])} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground truncate">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <p className={cn('text-xl font-semibold', variantStyles[variant])}>{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      {trend && (
        <p className={cn(
          'mt-2 text-xs font-medium pl-11',
          trend.isPositive ? 'text-success' : 'text-danger'
        )}>
          {trend.isPositive ? '+' : ''}{trend.value}% from yesterday
        </p>
      )}
    </div>
  );
}
