'use client';

import React from 'react';
import { Email } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Reply, UserPlus, Clock, Archive, MoreHorizontal } from 'lucide-react';

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  onSelectEmail: (email: Email) => void;
}

export function EmailList({ emails, selectedEmail, onSelectEmail }: EmailListProps) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#0F1117]">
      {/* Sticky Header with exact original spacing */}
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-white/5 bg-[#0F1117]/95 backdrop-blur-md px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">
        <div className="w-4 shrink-0" />
        <div className="w-48 shrink-0">Sender</div>
        <div className="flex-1 min-w-0">Message Detail</div>
        <div className="w-16 shrink-0 text-center">Priority</div>
        <div className="w-32 shrink-0 text-center">Action</div>
        <div className="w-20 shrink-0 text-right">Received</div>
      </div>

      <div className="divide-y divide-white/[0.02]">
        {emails.map((email) => {
          const isSelected = selectedEmail?.id === email.id;
          
          return (
            <button
              key={email.id}
              onClick={() => onSelectEmail(email)}
              className={cn(
                "w-full flex items-center gap-4 px-8 py-5 transition-all duration-150 border-l-2 text-left group",
                isSelected 
                  ? "bg-blue-600/10 border-blue-500 shadow-[inset_4px_0_12px_rgba(59,130,246,0.05)]" 
                  : "border-transparent hover:bg-white/[0.02]"
              )}
            >
              {/* Glowy Unread Dot */}
              <div className="w-4 shrink-0 flex justify-center">
                {!email.isRead && (
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                )}
              </div>

              {/* Sender Column */}
              <div className="w-48 shrink-0">
                <span className={cn(
                  "text-sm truncate block tracking-tight",
                  !email.isRead ? "text-white font-semibold" : "text-gray-400 font-medium"
                )}>
                  {email.sender.name}
                </span>
              </div>

              {/* Message Details */}
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <span className={cn(
                  "text-[13px] truncate tracking-tight",
                  !email.isRead ? "text-gray-100 font-medium" : "text-gray-400"
                )}>
                  {email.subject}
                </span>
                <span className="text-[11px] text-gray-600 truncate font-medium">
                  {email.bodyPreview}
                </span>
              </div>

              {/* Priority Circle Badge */}
              <div className="w-16 shrink-0 flex justify-center">
                <div className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-black border shadow-sm",
                  email.priority === 'High' 
                    ? "bg-red-500/10 border-red-500/30 text-red-500" 
                    : email.priority === 'Medium'
                    ? "bg-orange-500/10 border-orange-500/30 text-orange-500"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                )}>
                  {email.priority?.[0] || 'L'}
                </div>
              </div>

              {/* Action Buttons - These match the "original" pill style */}
              <div className="w-32 shrink-0 flex justify-center">
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all",
                  isSelected 
                    ? "bg-blue-600 border-blue-400 text-white" 
                    : "bg-white/5 border-white/10 text-gray-400 group-hover:border-white/20"
                )}>
                  {email.suggestedAction === 'Respond' ? (
                    <Reply className="h-3 w-3" />
                  ) : email.suggestedAction === 'Archive' ? (
                    <Archive className="h-3 w-3" />
                  ) : (
                    <UserPlus className="h-3 w-3" />
                  )}
                  <span className="text-[9px] font-bold uppercase tracking-tight">
                    {email.suggestedAction === 'Respond' ? 'Reply' : email.suggestedAction === 'Archive' ? 'Clear' : 'Delegate'}
                  </span>
                </div>
              </div>

              {/* Received Time */}
              <div className="w-20 shrink-0 text-right">
                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
                  14h ago
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}