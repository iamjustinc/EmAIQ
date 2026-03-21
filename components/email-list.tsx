'use client';

import React, { useMemo } from 'react';
import { Email } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Reply, UserPlus, Archive } from 'lucide-react';

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  onSelectEmail: (email: Email) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function EmailList({ 
  emails, 
  selectedEmail, 
  onSelectEmail, 
  activeTab, 
  setActiveTab 
}: EmailListProps) {
  
  // Filtering Logic linked to KPI Cards and Tabs
  const filteredEmails = useMemo(() => {
    const safeEmails = emails || [];
    const currentTab = activeTab.toLowerCase();

    if (currentTab === 'action') {
      // Filters for High priority/urgency emails
      return safeEmails.filter(e => e.priority === 'High' || e.urgency.label === 'High');
    }
    if (currentTab === 'noise') {
      // Filters for Low priority or marketing/newsletter keywords
      return safeEmails.filter(e => 
        e.priority === 'Low' || 
        e.sender.name.toLowerCase().includes('news') ||
        e.subject.toLowerCase().includes('promo')
      );
    }
    if (currentTab === 'today') {
      // Filters for emails received within hours (not days)
      return safeEmails.filter(e => e.receivedTime?.includes('h'));
    }
    return safeEmails; // Default 'all'
  }, [emails, activeTab]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#0F1117]">
      {/* Navigation Bar */}
      <div className="flex items-center border-b border-white/5 px-6 sticky top-0 bg-[#0F1117] z-10">
        {['ALL', 'ACTION', 'TODAY', 'NOISE'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={cn(
              "px-8 py-4 text-[10px] font-bold tracking-[0.2em] transition-all border-b-2",
              activeTab.toUpperCase() === tab 
                ? "text-white border-white" 
                : "text-gray-500 border-transparent hover:text-gray-300"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Headers */}
      <div className="flex items-center gap-4 px-8 py-3 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600 sticky top-[53px] bg-[#0F1117] z-10">
        <div className="w-4 shrink-0" />
        <div className="w-40 shrink-0">Sender</div>
        <div className="flex-1 min-w-0">Message Detail</div>
        <div className="w-24 shrink-0 text-right">Priority</div>
        <div className="w-32 shrink-0 text-center">Action</div>
        <div className="w-20 shrink-0 text-right">Received</div>
      </div>

      <div className="divide-y divide-white/[0.02]">
        {filteredEmails.length > 0 ? (
          filteredEmails.map((email) => {
            const isSelected = selectedEmail?.id === email.id;
            
            return (
              <button
                key={email.id}
                onClick={() => onSelectEmail(email)}
                className={cn(
                  "w-full flex items-center gap-4 px-8 py-5 transition-all text-left group animate-in fade-in slide-in-from-top-1",
                  isSelected ? "bg-blue-600/5 shadow-[inset_4px_0_0_#3b82f6]" : "hover:bg-white/[0.01]"
                )}
              >
                {/* Unread Indicator */}
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

                {/* Message Detail */}
                <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                  <div className="flex flex-col min-w-0">
                    <span className={cn("text-[13px] truncate", !email.isRead ? "text-white" : "text-gray-300")}>
                      {email.subject}
                    </span>
                    <span className="text-[11px] text-gray-500 truncate">{email.bodyPreview}</span>
                  </div>
                  
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border shrink-0",
                    email.sender.name.includes('Avery') || email.sender.name.includes('Priya') 
                      ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                      : "bg-purple-500/10 border-purple-500/20 text-purple-400"
                  )}>
                    {email.sender.name.includes('Avery') || email.sender.name.includes('Priya') ? 'Client' : 'Internal'}
                  </span>
                </div>

                {/* Priority/Urgency Indicator */}
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

                {/* Suggested Action Badge */}
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

                {/* Timestamp */}
                <div className="w-20 shrink-0 text-right">
                  <span className="text-[10px] text-gray-600 font-bold uppercase">{email.receivedTime || '14h ago'}</span>
                </div>
              </button>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-600">
            <p className="text-[10px] font-bold uppercase tracking-widest">No messages in {activeTab}</p>
          </div>
        )}
      </div>
    </div>
  );
}