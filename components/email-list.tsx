'use client';

import { Email } from '@/lib/types';
import { EmailRow } from '@/components/email-row';

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  onSelectEmail: (email: Email) => void;
}

export function EmailList({ emails, selectedEmail, onSelectEmail }: EmailListProps) {
  if (emails.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground">
        <p className="text-sm">No emails match your filter</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Header Row */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border/50 bg-background/95 backdrop-blur-sm px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <div className="w-2 shrink-0" />
        <div className="w-36 shrink-0">From</div>
        <div className="min-w-0 flex-1">Subject</div>
        <div className="w-20 shrink-0 hidden md:block">Category</div>
        <div className="w-16 shrink-0 hidden lg:block">Priority</div>
        <div className="w-24 shrink-0 hidden xl:block">Action</div>
        <div className="w-16 shrink-0 text-right">Time</div>
      </div>

      {/* Email Rows */}
      <div>
        {emails.map((email, index) => (
          <div key={email.id}>
            <EmailRow
              email={email}
              onClick={onSelectEmail}
              isSelected={selectedEmail?.id === email.id}
            />
            {index < emails.length - 1 && (
              <div className="mx-4 border-b border-border/30" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
