'use client';

import React from 'react';
import { Email } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Reply, UserPlus, FileSearch, Archive } from 'lucide-react';

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  onSelectEmail: (email: Email) => void;
}

export function EmailList({ emails, selectedEmail, onSelectEmail }: EmailListProps) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#0F1117]">
      {/* 4. Navigation Bar Spacing Fix */}
      <div className="flex items-center border-b border-white/5 px-6">
        {['ALL', 'ACTION', 'TODAY', 'NOISE'].map((tab) => (
          <button
            key={tab}
            className={cn(
              "px-8 py-4 text-[10px] font-bold tracking-[0.2em] transition-colors",
              tab === 'ALL' ? "text-white border-b border-white" : "text-gray-500 hover:text-gray-300"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Headers */}
      <div className="flex items-center gap-4 px-8 py-3 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
        <div className="w-4 shrink-0" />
        <div className="w-40 shrink-0">Sender</div>
        <div className="flex-1 min-w-0">Message Detail</div>
        <div className="w-24 shrink-0 text-right">Priority</div>
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
                "w-full flex items-center gap-4 px-8 py-5 transition-all text-left group",
                isSelected ? "bg-blue-600/5 shadow-[inset_4px_0_0_#3b82f6]" : "hover:bg-white/[0.01]"
              )}
            >
              {/* 3. Unread Highlight & Glow */}
              <div className="w-4 shrink-0 flex justify-center">
                {!email.isRead && (
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                )}
              </div>

              {/* Sender Column */}
              <div className="w-40 shrink-0">
                <span className={cn(
                  "text-sm truncate block",
                  !email.isRead ? "text-white font-semibold" : "text-gray-400"
                )}>
                  {email.sender.name}
                </span>
              </div>

              {/* 2. Message Detail + Sender Info (Client/Internal) */}
              <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                <div className="flex flex-col min-w-0">
                  <span className={cn("text-[13px] truncate", !email.isRead ? "text-white" : "text-gray-300")}>
                    {email.subject}
                  </span>
                  <span className="text-[11px] text-gray-500 truncate">{email.bodyPreview}</span>
                </div>
                
                {/* Restore the category tags */}
                <span className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border shrink-0",
                  email.sender.name.includes('Avery') || email.sender.name.includes('Priya') 
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                    : "bg-purple-500/10 border-purple-500/20 text-purple-400"
                )}>
                  {email.sender.name.includes('Avery') || email.sender.name.includes('Priya') ? 'Client' : 'Internal'}
                </span>
              </div>

              {/* 1. Dynamic Urgency/Priority */}
              <div className="w-24 shrink-0 flex justify-end">
                <div className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-black border",
                  email.urgency.label === 'High' 
                    ? "bg-red-500/10 border-red-500/30 text-red-500" 
                    : email.urgency.label === 'Medium'
                    ? "bg-orange-500/10 border-orange-500/30 text-orange-500"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                )}>
                  {email.urgency.label[0]}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-32 shrink-0 flex justify-center">
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[9px] font-bold uppercase",
                  isSelected ? "bg-blue-600 border-blue-400 text-white" : "bg-white/5 border-white/10 text-gray-400"
                )}>
                  {email.suggestedAction === 'Respond' ? <Reply className="h-3 w-3" /> : 
                   email.suggestedAction === 'Archive' ? <Archive className="h-3 w-3" /> : <UserPlus className="h-3 w-3" />}
                  {email.suggestedAction === 'Respond' ? 'Reply' : email.suggestedAction === 'Archive' ? 'Clear' : 'Delegate'}
                </div>
              </div>

              {/* Received Time */}
              <div className="w-20 shrink-0 text-right">
                <span className="text-[10px] text-gray-600 font-bold uppercase">{email.receivedTime || '14h ago'}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}