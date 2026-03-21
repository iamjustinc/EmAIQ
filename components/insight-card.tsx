'use client';

import { cn } from '@/lib/utils';
import { Lightbulb, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';

interface InsightCardProps {
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success';
}

const typeConfig = {
  info: {
    icon: Lightbulb,
    gradient: 'from-info/20 to-info/5',
    borderColor: 'border-info/30',
    iconBg: 'bg-info/20',
    iconStyle: 'text-info',
  },
  warning: {
    icon: AlertTriangle,
    gradient: 'from-warning/20 to-warning/5',
    borderColor: 'border-warning/30',
    iconBg: 'bg-warning/20',
    iconStyle: 'text-warning',
  },
  success: {
    icon: CheckCircle,
    gradient: 'from-success/20 to-success/5',
    borderColor: 'border-success/30',
    iconBg: 'bg-success/20',
    iconStyle: 'text-success',
  },
};

export function InsightCard({ title, description, type }: InsightCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border p-5',
        'bg-gradient-to-br backdrop-blur-xl',
        'bg-card/60',
        config.borderColor,
        config.gradient
      )}
    >
      {/* Glassmorphism glow effect */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5 blur-xl" />
      
      <div className="relative flex items-start gap-3">
        <div className={cn('rounded-lg p-2', config.iconBg)}>
          <Icon className={cn('h-4 w-4', config.iconStyle)} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <Sparkles className="h-3 w-3 text-primary/60" />
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
