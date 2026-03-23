'use client'

import React, { useMemo } from 'react'
import { Star, AlertCircle } from 'lucide-react'
import { Email } from '@/lib/types'
import { cn } from '@/lib/utils'

interface EmailListProps {
  emails: Email[]
  selectedEmail: Email | null
  onSelectEmail: (email: Email) => void
  onToggleFavorite: (id: string) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  hideTabs?: boolean
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
  
  // FIX: This was missing, causing your "ReferenceError"
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
        <div className="sticky top-0 z-30 flex items-center border-b border-[#A8D0D0] bg-[#F4F7F7]/95 px-6 backdrop-blur-md">
          {['ALL', 'ACTION', 'TODAY', 'NOISE'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={cn(
                'border-b-2 px-8 py-5 text-[10px] font-black tracking-[0.25em] transition-all',
                activeTab.toUpperCase() === tab 
                  ? 'border-[#99BED4] text-[#99BED4]' 
                  : 'border-transparent text-muted-foreground/60 hover:text-[#7FC6DA]'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-[60px_40px_160px_1fr_140px_100px] border-b border-[#A8D0D0]/30 bg-[#A8D0D0]/10 px-6 py-3 sticky top-0 z-20">
        {['PRI', '', 'SENDER', 'MESSAGE DETAIL', 'AI SUGGESTION', 'RECEIVED'].map((h, i) => (
          <div key={i} className="text-[9px] font-black tracking-[0.2em] text-[#A8A29A] uppercase">{h}</div>
        ))}
      </div>

      <div className="divide-y divide-[#A8D0D0]/40">
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            onClick={() => onSelectEmail(email)}
            className={cn(
              'grid grid-cols-[60px_40px_160px_1fr_140px_100px] items-center px-6 py-4 cursor-pointer transition-all',
              selectedEmail?.id === email.id ? 'bg-[#7FC6DA]/10 shadow-[inset_4px_0_0_#7FC6DA]' : 'hover:bg-white',
              email.isRead ? 'opacity-70' : 'bg-white shadow-sm mx-2 my-1 rounded-xl border border-[#A8D0D0]/20'
            )}
          >
            <div className="flex items-center gap-2">
               <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(email.id); }} className="p-2">
                <Star className={cn('h-4 w-4', email.isFavorite ? 'fill-[#99BED4] text-[#99BED4]' : 'text-[#A8A29A]/30')} />
              </button>
            </div>
            
            <div className="flex justify-center">
              {email.urgency.label === 'High' && (
                <AlertCircle className="h-4 w-4 text-[#F6B3C4]" />
              )}
            </div>

            <div className={cn("text-[13px] font-black", email.isRead ? "text-[#A8A29A]" : "text-foreground")}>{email.sender.name}</div>
            <div className={cn("text-[13px] truncate pr-8", email.isRead ? "text-[#A8A29A]/70" : "text-foreground/80")}>{email.subject}</div>
            
            <div className="flex">
              <span className={cn(
                "px-3 py-1 rounded-full text-[9px] font-black tracking-widest border",
                email.suggestedAction === 'RESPOND' 
                  ? "bg-[#F6B3C4]/10 border-[#F6B3C4] text-[#F6B3C4]" 
                  : "bg-[#A8D0D0]/10 border-[#A8D0D0] text-[#7FC6DA]"
              )}>
                {email.suggestedAction}
              </span>
            </div>

            <div className="text-[10px] font-black text-[#A8A29A]/40 text-right uppercase">{email.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  )
}