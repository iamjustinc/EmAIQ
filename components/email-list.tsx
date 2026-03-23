'use client'

import React, { useMemo } from 'react'
import { Star, AlertCircle } from 'lucide-react'
import { Email } from '@/lib/types'
import { cn } from '@/lib/utils'

interface EmailListProps {
  emails: Email[]; selectedEmail: Email | null; onSelectEmail: (email: Email) => void;
  onToggleFavorite: (id: string) => void; activeTab: string; setActiveTab: (tab: string) => void;
}

export function EmailList({ emails, selectedEmail, onSelectEmail, onToggleFavorite, activeTab, setActiveTab }: EmailListProps) {
  
  const filteredEmails = useMemo(() => {
    const safe = emails ?? []
    const tab = activeTab.toLowerCase()
    if (tab === 'action' || tab === 'urgent') return safe.filter((e) => e.urgency.label === 'High')
    if (tab === 'unread') return safe.filter((e) => !e.isRead)
    if (tab === 'noise') return safe.filter((e) => e.urgency.label === 'Low')
    return safe
  }, [emails, activeTab])

  return (
    <div className="relative flex-1 overflow-y-auto bg-[#F4F7F7] scrollbar-hide">
      {/* Navigation Tabs */}
      <div className="sticky top-0 z-30 flex items-center border-b border-[#A8D0D0] bg-[#F4F7F7]/95 px-6 backdrop-blur-md">
        {['ALL', 'ACTION', 'TODAY', 'NOISE'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={cn(
              'border-b-2 px-8 py-5 text-[10px] font-black tracking-[0.25em] transition-all',
              activeTab.toUpperCase() === tab 
                ? 'border-[#99BED4] text-[#99BED4]' 
                : 'border-transparent text-muted-foreground/60 hover:text-[#99BED4]/70'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[60px_40px_160px_1fr_140px_100px] border-b border-[#A8D0D0]/30 bg-[#A8D0D0]/10 px-6 py-3 sticky top-[58px] z-20">
        {['PRI', '', 'SENDER', 'MESSAGE DETAIL', 'AI SUGGESTION', 'RECEIVED'].map((h, i) => (
          <div key={i} className="text-[9px] font-black tracking-[0.2em] text-muted-foreground/50 uppercase">{h}</div>
        ))}
      </div>

      {/* Email Rows */}
      <div className="divide-y divide-[#A8D0D0]/20">
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            onClick={() => onSelectEmail(email)}
            className={cn(
              'grid grid-cols-[60px_40px_160px_1fr_140px_100px] items-center px-6 py-4 cursor-pointer transition-all',
              selectedEmail?.id === email.id ? 'bg-[#99BED4]/5 shadow-[inset_4px_0_0_#99BED4]' : 'hover:bg-[#A8D0D0]/10',
              // READ VS UNREAD: Read messages use a darker/muted background
              email.isRead ? 'opacity-70 bg-[#A8A29A]/5' : 'bg-white'
            )}
          >
            <div className="flex items-center gap-2">
               <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(email.id); }} className="p-2">
                <Star className={cn('h-4 w-4 transition-colors', email.isFavorite ? 'fill-[#99BED4] text-[#99BED4]' : 'text-muted-foreground/20')} />
              </button>
            </div>
            
            <div className="flex justify-center">
              {email.urgency.label === 'High' && (
                <AlertCircle className="h-4 w-4 text-[#F6B3C4]" /> 
              )}
            </div>

            <div className={cn("text-[13px] font-black truncate", email.isRead ? "text-foreground/60" : "text-foreground")}>
              {email.sender.name}
            </div>
            <div className={cn("text-[13px] truncate pr-8", email.isRead ? "font-medium text-foreground/40" : "font-bold text-foreground/80")}>
              {email.subject}
            </div>
            
            {/* ACTION: Respond uses Sunset Pink (#F6B3C4) */}
            <div className={cn(
              "text-[10px] font-black uppercase tracking-wider",
              email.suggestedAction === 'RESPOND' ? "text-[#F6B3C4]" : "text-[#99BED4]"
            )}>
              {email.suggestedAction}
            </div>

            <div className="text-[10px] font-black text-muted-foreground/30 text-right uppercase">{email.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  )
}