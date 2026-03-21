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
      <div className="flex flex-col h-64 items-center justify-center space-y-3 opacity-20">
        <Mail className="h-10 w-10" />
        <p className="text-sm font-medium tracking-widest uppercase">Inbox Zero Achieved</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto scrollbar-hide">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/5 bg-[#0F1117]/80 backdrop-blur-md px-6 py-3 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">
        <div className="w-2 shrink-0" />
        <div className="w-36 shrink-0">Sender</div>
        <div className="min-w-0 flex-1">Message Detail</div>
        <div className="w-20 shrink-0 hidden md:block">Priority</div>
        <div className="w-16 shrink-0 text-right">Received</div>
      </div>

      <div className="divide-y divide-white/5">
        {emails.map((email) => (
          <EmailRow
            key={email.id}
            email={email}
            onClick={() => onSelectEmail(email)}
            isSelected={selectedEmail?.id === email.id}
          />
        ))}
      </div>
    </div>
  );
}