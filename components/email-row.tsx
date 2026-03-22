'use client';

import { Star } from 'lucide-react'; // Added Star
import { cn } from '@/lib/utils';
import { Email } from '@/lib/types';
import { CategoryBadge } from '@/components/category-badge';
import { UrgencyBadge } from '@/components/urgency-badge';
import { ActionBadge } from '@/components/action-badge';
import { formatDistanceToNow } from '@/lib/date-utils';

interface EmailRowProps {
  email: Email;
  onClick: (email: Email) => void;
  onToggleFavorite: (id: string) => void; // Added this
  isSelected?: boolean;
}

export function EmailRow({ email, onClick, onToggleFavorite, isSelected }: EmailRowProps) {
  return (
    <div className={cn(
      'group flex w-full items-center gap-3 px-4 py-2.5 text-left transition-all duration-150 border-l-2',
      isSelected ? 'bg-sidebar-accent border-l-primary' : 'border-l-transparent hover:bg-sidebar-accent/50',
      !email.isRead && !isSelected && 'bg-primary/5'
    )}>
      <div className="flex w-2 shrink-0 justify-center">
        {!email.isRead && (
          <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_6px_rgba(139,124,255,0.5)]" />
        )}
      </div>

      {/* Star Toggle */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(email.id);
        }}
        className="shrink-0 transition-colors"
      >
        <Star className={cn(
          "h-4 w-4",
          email.isFavorite ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/40 group-hover:text-muted-foreground"
        )} />
      </button>

      <div className="w-32 shrink-0 cursor-pointer" onClick={() => onClick(email)}>
        <p className={cn('truncate text-sm', !email.isRead ? 'font-semibold' : 'opacity-70')}>
          {email.sender.name}
        </p>
      </div>

      <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onClick(email)}>
        <p className={cn('truncate text-sm', !email.isRead ? 'font-semibold' : 'opacity-70')}>
          {email.subject}
        </p>
        <p className="truncate text-xs mt-0.5 opacity-60 group-hover:opacity-100">
          {email.bodyPreview}
        </p>
      </div>

      {/* Badges and Time - Hidden on small screens */}
      <div className="w-20 shrink-0 hidden md:block"><CategoryBadge category={email.category} compact /></div>
      <div className="w-16 shrink-0 hidden lg:block"><UrgencyBadge label={email.urgency.label} score={email.urgency.score} compact /></div>
      <div className="w-24 shrink-0 hidden xl:block"><ActionBadge action={email.suggestedAction} compact /></div>
      <div className="w-16 shrink-0 text-right text-xs opacity-60">
        {formatDistanceToNow(email.receivedAt)}
      </div>
    </div>
  );
}