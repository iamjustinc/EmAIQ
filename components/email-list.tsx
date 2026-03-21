'use client';

import React from 'react';
import { Email } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Reply, Users, Clock, Archive } from 'lucide-react';

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  onSelectEmail: (email: Email) => void;
}

export function EmailList({ emails, selectedEmail, onSelectEmail }: EmailListProps) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/5 bg-[#0F1117]/80 backdrop-blur-md px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
        <div className="w-2 shrink-0" />
        <div className="w-36 shrink-0">Sender</div>
        <div className="min-w-0 flex-1">Message Detail</div>
        <div className="w-16 shrink-0 text-right">Priority</div>
        <div className="w-24 shrink-0 text-right">Received</div>
      </div>

      <div className="divide-y divide-white/5">
        {emails.map((email) => (
          <button
            key={email.id}
            onClick={() => onSelectEmail(email)}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-4 transition-all duration-200 hover:bg-white/[0.03] text-left group",
              selectedEmail?.id === email.id ? "bg-blue-500/10" : ""
            )}
          >
            {/* Unread Indicator */}
            <div className="w-2 shrink-0">
              {!email.isRead && <div className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.5)]" />}
            </div>

            {/* Sender */}
            <div className="w-36 shrink-0">
              <span className={cn("text-sm truncate block", !email.isRead ? "text-gray-100 font-semibold" : "text-gray-400")}>
                {email.sender.name}
              </span>
            </div>

            {/* Content Preview */}
            <div className="min-w-0 flex-1 flex flex-col gap-0.5">
              <span className={cn("text-sm truncate", !email.isRead ? "text-white font-medium" : "text-gray-300")}>
                {email.subject}
              </span>
              <span className="text-xs text-gray-500 truncate">{email.bodyPreview}</span>
            </div>

            {/* Action Tag & Priority */}
            <div className="w-16 shrink-0 flex flex-col items-end gap-1.5">
               <div className={cn(
                 "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border",
                 email.urgency.label === 'High' ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-orange-500/10 border-orange-500/20 text-orange-500"
               )}>
                 {email.urgency.label[0]}
               </div>
            </div>

            {/* Timestamp */}
            <div className="w-24 shrink-0 text-right">
              <span className="text-[10px] text-gray-600 font-medium uppercase tracking-tight">14h ago</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
