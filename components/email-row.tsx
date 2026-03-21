'use client';

import { cn } from '@/lib/utils';
import { Email } from '@/lib/types';
import { CategoryBadge } from '@/components/category-badge';
import { UrgencyBadge } from '@/components/urgency-badge';
import { ActionBadge } from '@/components/action-badge';
import { formatDistanceToNow } from '@/lib/date-utils';

interface EmailRowProps {
  email: Email;
  onClick: (email: Email) => void;
  isSelected?: boolean;
}

export function EmailRow({ email, onClick, isSelected }: EmailRowProps) {
  return (
    <button
      onClick={() => onClick(email)}
      className={cn(
        'group flex w-full items-center gap-3 px-4 py-2.5 text-left transition-all duration-150',
        'border-l-2 border-l-transparent',
        // Hover state - subtle background highlight
        'hover:bg-sidebar-accent/50',
        // Selected state
        isSelected && 'bg-sidebar-accent border-l-primary',
        // Unread state - slightly different background
        !email.isRead && !isSelected && 'bg-primary/5'
      )}
    >
      {/* Unread indicator - blue dot */}
      <div className="flex w-2 shrink-0 justify-center">
        {!email.isRead && (
          <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_6px_rgba(139,124,255,0.5)]" />
        )}
      </div>

      {/* Sender */}
      <div className="w-36 shrink-0">
        <p className={cn(
          'truncate text-sm transition-colors',
          // Bold for unread, muted for read
          !email.isRead ? 'font-semibold text-foreground' : 'font-normal text-foreground/70'
        )}>
          {email.sender.name}
        </p>
      </div>

      {/* Subject & Preview */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={cn(
            'truncate text-sm transition-colors',
            // Bold for unread, muted for read
            !email.isRead ? 'font-semibold text-foreground' : 'font-normal text-foreground/70'
          )}>
            {email.subject}
          </p>
        </div>
        <p className={cn(
          'truncate text-xs mt-0.5 transition-opacity',
          !email.isRead ? 'text-muted-foreground' : 'text-muted-foreground/60',
          'opacity-70 group-hover:opacity-100'
        )}>
          {email.bodyPreview}
        </p>
      </div>

      {/* Category */}
      <div className="w-20 shrink-0 hidden md:block">
        <CategoryBadge category={email.category} compact />
      </div>

      {/* Urgency */}
      <div className="w-16 shrink-0 hidden lg:block">
        <UrgencyBadge label={email.urgency.label} score={email.urgency.score} compact />
      </div>

      {/* Recommended Action */}
      <div className="w-24 shrink-0 hidden xl:block">
        <ActionBadge action={email.suggestedAction} compact />
      </div>

      {/* Time */}
      <div className="w-16 shrink-0 text-right">
        <span className={cn(
          'text-xs transition-colors',
          !email.isRead ? 'text-muted-foreground' : 'text-muted-foreground/60'
        )}>
          {formatDistanceToNow(email.receivedAt)}
        </span>
      </div>
    </button>
  );
}
