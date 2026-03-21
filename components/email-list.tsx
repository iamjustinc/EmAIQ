'use client';

import React, { useMemo } from 'react';
import { Email } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Reply, UserPlus, Archive, Clock } from 'lucide-react';

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  onSelectEmail: (email: Email) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function EmailList({ emails, selectedEmail, onSelectEmail, activeTab, setActiveTab }: EmailListProps) {
  const filteredEmails = useMemo(() => {
    const safeEmails = emails || [];
    const currentTab = activeTab.toLowerCase();
    if (currentTab === 'action') return safeEmails.filter(e => e.priority === 'High' || e.urgency.label === 'High');
    if (currentTab === 'noise') return safeEmails.filter(e => e.priority === 'Low' || e.sender.name.toLowerCase().includes('news') || e.subject.toLowerCase().includes('promo'));
    if (currentTab === 'today') return safeEmails.filter(e => e.receivedTime?.includes('h'));
    return safeEmails;
  }, [emails, activeTab]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#0F1117]">
      {/* Tabs */}
      <div className="flex items-center border-b border-white/5 px-6 sticky top-0 bg-[#0F1117] z-10">
        {['ALL', 'ACTION', 'TODAY', 'NOISE'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} className={cn("px-8 py-4 text-[10px] font-bold tracking-[0.2em] transition-all border-b-2", activeTab.toUpperCase() === tab ? "text-white border-white" : "text-gray-500 border-transparent hover:text-gray-300")}>
            {tab}
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div className="flex items-center gap-4 px-8 py-3 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600 sticky top-[53px] bg-[#0F1117] z-10">
        <div className="w-8 shrink-0 text-center">Pri</div>
        <div className="w-4 shrink-0" />
        <div className="w-40 shrink-0">Sender</div>
        <div className="flex-1 min-w-0">Message Detail</div>
        <div className="w-32 shrink-0 text-center text-blue-400">AI SUGGESTION</div>
        <div className="w-20 shrink-0 text-right">Received</div>
      </div>

      <div className="divide-y divide-white/[0.02]">
        {filteredEmails.length > 0 ? (
          filteredEmails.map((email) => {
            const isSelected = selectedEmail?.id === email.id;
            const isUnread = !email.isRead;
            const isReturned = email.snoozedUntil && email.snoozedUntil <= Date.now();
            const isHighPriority = email.urgency.label === 'High';

            // 1. AI SUGGESTION COLORS (Blue, Grey, Dark Red)
            const actionConfig = (() => {
              const action = email.suggestedAction;
              // Blue spectrum for Reply
              if (action === 'Respond') return { Icon: Reply, label: 'Reply', styles: "bg-blue-600/10 border-blue-500/30 text-blue-400" };
              // Grey spectrum for Delegate
              if (action === 'Delegate') return { Icon: UserPlus, label: 'Delegate', styles: "bg-zinc-800 border-zinc-700 text-zinc-400" };
              // Dark not shiny Red for Clear/Archive
              return { Icon: Archive, label: action === 'Archive' ? 'Clear' : action, styles: "bg-red-950/40 border-red-900/40 text-red-800" };
            })();

            const { Icon, label, styles } = actionConfig;
            
            // 2. CATEGORY COLORS (Emerald Green, Purple)
            const isClient = email.sender.name.includes('Avery') || email.sender.name.includes('Priya');

            return (
              <button 
                key={email.id} 
                onClick={() => onSelectEmail(email)} 
                className={cn(
                  "w-full flex items-center gap-4 px-8 py-5 transition-all text-left group animate-in fade-in slide-in-from-top-1",
                  isSelected ? "bg-blue-600/15 shadow-[inset_4px_0_0_#3b82f6]" : 
                  isUnread ? "bg-[#141721]" : "hover:bg-white/[0.01]",
                )}
              >
                {/* URGENCY */}
                <div className="w-8 shrink-0 flex justify-center items-center">
                  {isHighPriority ? (
                    <div className="flex gap-0.5 text-amber-500 font-black text-xl tracking-tighter drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
                      <span>!</span><span>!</span>
                    </div>
                  ) : (
                    <div className="h-1 w-1 rounded-full bg-white/5" />
                  )}
                </div>

                {/* UNREAD DOT */}
                <div className="w-4 shrink-0 flex justify-center">
                  {isUnread ? (
                    <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  ) : isReturned ? (
                    <Clock className="h-4 w-4 text-orange-500 animate-pulse" />
                  ) : null}
                </div>

                {/* SENDER */}
                <div className="w-40 shrink-0">
                  <span className={cn("text-sm truncate block", isUnread ? "text-white font-bold" : "text-gray-400 font-medium")}>
                    {email.sender.name}
                  </span>
                </div>

                {/* CONTENT & CATEGORY TAGS */}
                <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                       <span className={cn("text-[13px] truncate", isUnread ? "text-white font-medium" : "text-gray-300")}>{email.subject}</span>
                    </div>
                    <span className="text-[11px] text-gray-500 truncate mt-0.5">{email.bodyPreview}</span>
                  </div>

                  {/* CLIENT vs INTERNAL TAGS */}
                  <span className={cn(
                    "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shrink-0", 
                    isClient 
                      ? "bg-emerald-500 text-[#0F1117] shadow-[0_0_12px_rgba(16,185,129,0.2)]" 
                      : "bg-purple-700 text-white"
                  )}>
                    {isClient ? 'Client' : 'Internal'}
                  </span>
                </div>

                {/* AI SUGGESTION */}
                <div className="w-32 shrink-0 flex justify-center">
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[9px] font-bold uppercase",
                    isSelected ? "bg-blue-600 border-blue-400 text-white shadow-lg" : styles
                  )}>
                    <Icon className="h-3 w-3" />
                    {label}
                  </div>
                </div>

                {/* RECEIVED TIME */}
                <div className="w-20 shrink-0 text-right">
                  <span className={cn("text-[10px] font-bold uppercase", isUnread ? "text-blue-400" : "text-gray-600")}>
                    {email.receivedTime || '14h ago'}
                  </span>
                </div>
              </button>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-600">
            <p className="text-[10px] font-bold uppercase tracking-widest">No messages</p>
          </div>
        )}
      </div>
    </div>
  );
}
