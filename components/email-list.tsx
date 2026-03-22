'use client';

import React, { useMemo } from 'react';
import { Email } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Reply, UserPlus, Archive, Clock, Star } from 'lucide-react';

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  onSelectEmail: (email: Email) => void;
  onToggleFavorite: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hideTabs?: boolean;
}

export function EmailList({ 
  emails, 
  selectedEmail, 
  onSelectEmail, 
  onToggleFavorite, 
  activeTab, 
  setActiveTab,
  hideTabs = false 
}: EmailListProps) {
  
  const filteredEmails = useMemo(() => {
    const safeEmails = emails || [];
    const currentTab = activeTab.toLowerCase();
    if (currentTab === 'action') return safeEmails.filter(e => e.urgency.label === 'High');
    if (currentTab === 'noise') return safeEmails.filter(e => e.urgency.label === 'Low' || e.sender.name.toLowerCase().includes('news'));
    return safeEmails;
  }, [emails, activeTab]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#0F1117] relative">
      {/* Tabs */}
      {!hideTabs && (
        <div className="flex items-center border-b border-white/5 px-6 sticky top-0 bg-[#0F1117] z-20">
          {['ALL', 'ACTION', 'TODAY', 'NOISE'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab.toLowerCase())} 
              className={cn(
                "px-8 py-4 text-[10px] font-bold tracking-[0.2em] transition-all border-b-2", 
                activeTab.toUpperCase() === tab ? "text-white border-white" : "text-gray-500 border-transparent hover:text-gray-300"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Table Header - adjusted z-index and top offset */}
      <div className={cn(
        "flex items-center gap-4 px-8 py-3 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600 sticky bg-[#0F1117] z-10 border-b border-white/[0.02]",
        hideTabs ? "top-0" : "top-[53px]" 
      )}>
        <div className="w-16 shrink-0 text-center">PRI</div>
        <div className="w-4 shrink-0" />
        <div className="w-40 shrink-0">Sender</div>
        <div className="flex-1 min-w-0">Message Detail</div>
        <div className="w-32 shrink-0 text-center text-blue-400">AI SUGGESTION</div>
        <div className="w-20 shrink-0 text-right">Received</div>
      </div>

      <div className="divide-y divide-white/[0.02]">
        {filteredEmails.map((email) => {
          const isSelected = selectedEmail?.id === email.id;
          const isUnread = !email.isRead;
          const isHighPriority = email.urgency.label === 'High';

          const actionConfig = (() => {
            const action = email.suggestedAction;
            if (action === 'Respond') return { Icon: Reply, label: 'Reply', styles: "bg-blue-500/10 border-blue-500/20 text-blue-400" };
            if (action === 'Delegate') return { Icon: UserPlus, label: 'Delegate', styles: "bg-zinc-500/10 border-zinc-500/20 text-zinc-400" };
            if (action === 'Review Later') return { Icon: Clock, label: 'Review Later', styles: "bg-amber-900/10 border-amber-900/20 text-amber-800" };
            return { Icon: Archive, label: 'Clear', styles: "bg-red-950/20 border-red-900/30 text-red-900" };
          })();

          const { Icon, label, styles } = actionConfig;

          return (
            <div 
              key={email.id} 
              className={cn(
                "w-full flex items-center gap-4 px-8 py-5 transition-all text-left group cursor-pointer",
                isSelected ? "bg-blue-600/15 shadow-[inset_4px_0_0_#3b82f6]" : isUnread ? "bg-[#141721]" : "hover:bg-white/[0.01]",
              )}
              onClick={() => onSelectEmail(email)}
            >
              {/* 1. URGENCY & STAR BUTTON */}
              <div className="w-16 shrink-0 flex justify-center items-center gap-2">
                <div className="w-4 flex justify-center">
                  {isHighPriority ? (
                    <div className="flex gap-0.5 text-amber-500 font-black text-sm tracking-tighter drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                      <span>!</span><span>!</span>
                    </div>
                  ) : (
                    <div className="h-1 w-1 rounded-full bg-white/5" />
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(email.id);
                  }}
                  className="group/star relative p-1 outline-none"
                >
                  <Star className={cn(
                    "h-4 w-4 transition-all duration-300 transform active:scale-150",
                    email.isFavorite 
                      ? "fill-[#FACC15] text-[#FACC15] scale-100" 
                      : "text-gray-700 opacity-40 group-hover/star:opacity-100"
                  )} />
                </button>
              </div>

              {/* 2. UNREAD DOT */}
              <div className="w-4 shrink-0 flex justify-center">
                {isUnread && <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />}
              </div>

              {/* 3. SENDER */}
              <div className="w-40 shrink-0">
                <span className={cn("text-sm truncate block", isUnread ? "text-white font-bold" : "text-gray-400 font-medium")}>
                  {email.sender.name}
                </span>
              </div>

              {/* 4. CONTENT */}
              <div className="flex-1 min-w-0 flex flex-col">
                <span className={cn("text-[13px] truncate", isUnread ? "text-white font-medium" : "text-gray-300")}>
                  {email.subject}
                </span>
                <span className="text-[11px] text-gray-500 truncate mt-0.5">
                  {email.bodyPreview}
                </span>
              </div>

              {/* 5. AI SUGGESTION */}
              <div className="w-32 shrink-0 flex justify-center">
                <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-bold uppercase", styles)}>
                  <Icon className="h-3 w-3" />
                  {label}
                </div>
              </div>

              {/* 6. TIME */}
              <div className="w-20 shrink-0 text-right">
                <span className={cn("text-[10px] font-bold uppercase", isUnread ? "text-blue-400" : "text-gray-600")}>
                  14h ago
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}