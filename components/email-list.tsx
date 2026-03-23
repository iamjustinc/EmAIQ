'use client'

import React, { useMemo } from 'react'
import { Star, AlertCircle } from 'lucide-react'
import { Email } from '@/lib/types'
import { cn } from '@/lib/utils'

interface EmailListProps {
  emails: Email[]; selectedEmail: Email | null; onSelectEmail: (email: Email) => void;
  onToggleFavorite: (id: string) => void; activeTab: string; setActiveTab: (tab: string) => void;
  hideTabs?: boolean;
}

export function EmailList({ emails, selectedEmail, onSelectEmail, onToggleFavorite, activeTab, setActiveTab, hideTabs = false }: EmailListProps) {
  const filteredEmails = useMemo(() => {
    const safeEmails = emails ?? []
    if (hideTabs) return safeEmails
    const tab = activeTab.toLowerCase()
    if (tab === 'action') return safeEmails.filter(e => e.urgency.label === 'High')
    if (tab === 'noise') return safeEmails.filter(e => e.urgency.label === 'Low')
    return safeEmails
  }, [emails, activeTab, hideTabs])

  return (
    <div className="relative flex-1 overflow-y-auto bg-[#F4F7F7] scrollbar-hide">
      {!hideTabs && (
        <div className="sticky top-0 z-30 flex items-center border-b-2 border-[#A8D0D0] bg-white px-6">
          {['ALL', 'ACTION', 'TODAY', 'NOISE'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={cn(
                'border-b-4 px-8 py-5 text-[10px] font-black tracking-[0.25em] transition-all',
                activeTab.toUpperCase() === tab 
                  ? 'border-[#7FC6DA] text-[#7FC6DA]' 
                  : 'border-transparent text-[#A8A29A] hover:text-[#7FC6DA]'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-[60px_40px_160px_1fr_140px_100px] border-b border-[#A8D0D0]/40 bg-[#F4F7F7] px-6 py-4 sticky top-0 z-20">
        {['PRI', '', 'SENDER', 'MESSAGE DETAIL', 'AI SUGGESTION', 'RECEIVED'].map((h, i) => (
          <div key={i} className="text-[9px] font-black tracking-[0.2em] text-[#A8A29A] uppercase">{h}</div>
        ))}
      </div>

      <div className="divide-y divide-[#A8D0D0]/20 px-2">
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            onClick={() => onSelectEmail(email)}
            className={cn(
              'grid grid-cols-[60px_40px_160px_1fr_140px_100px] items-center px-4 py-4 cursor-pointer transition-all my-1 rounded-2xl',
              selectedEmail?.id === email.id ? 'bg-white ring-2 ring-[#7FC6DA] shadow-lg scale-[1.01]' : 'hover:bg-white/80',
              email.isRead ? 'opacity-60' : 'bg-white shadow-sm'
            )}
          >
            <div className="flex items-center gap-2">
               <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(email.id); }} className="p-2">
                <Star className={cn('h-4 w-4', email.isFavorite ? 'fill-[#7FC6DA] text-[#7FC6DA]' : 'text-[#A8A29A]/30')} />
              </button>
            </div>
            <div className="flex justify-center">{email.urgency.label === 'High' && <AlertCircle className="h-4 w-4 text-[#F6B3C4]" />}</div>
            <div className={cn("text-[13px] font-black", email.isRead ? "text-[#A8A29A]" : "text-[#2D3436]")}>{email.sender.name}</div>
            <div className={cn("text-[13px] truncate pr-8", email.isRead ? "text-[#A8A29A]" : "text-[#2D3436]/80")}>{email.subject}</div>
            <div className="flex">
              <span className={cn(
                "px-3 py-1 rounded-full text-[9px] font-black tracking-widest border-2",
                email.suggestedAction === 'RESPOND' 
                  ? "bg-[#F6B3C4] border-[#F6B3C4] text-white"  /* Solid Pink Respond */
                  : "bg-[#7FC6DA] border-[#7FC6DA] text-white"  /* Solid Blue Delegate */
              )}>
                {email.suggestedAction}
              </span>
            </div>
            <div className="text-[10px] font-black text-[#A8A29A] text-right uppercase">{email.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  )
}