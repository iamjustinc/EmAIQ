import { cn } from '@/lib/utils';
import { Category } from '@/lib/types';

interface CategoryBadgeProps {
  category: Category;
  className?: string;
  compact?: boolean;
}

const categoryStyles: Record<Category, string> = {
  Client: 'bg-primary/10 text-primary',
  Internal: 'bg-info/10 text-info',
  Recruiting: 'bg-success/10 text-success',
  Finance: 'bg-warning/10 text-warning',
  Logistics: 'bg-muted-foreground/10 text-muted-foreground',
  Newsletter: 'bg-muted text-muted-foreground/70',
};

export function CategoryBadge({ category, className, compact }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md font-medium',
        compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
        categoryStyles[category],
        className
      )}
    >
      {category}
    </span>
  );
}
