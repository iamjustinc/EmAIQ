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
    <div className="relative flex-1 overflow-y-auto bg-background scrollbar-hide">
      {/* Navigation Tabs */}
      <div className="sticky top-0 z-30 flex items-center border-b border-border bg-background/95 px-6 backdrop-blur-md">
        {['ALL', 'ACTION', 'TODAY', 'NOISE'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={cn(
              'border-b-2 px-8 py-5 text-[10px] font-black tracking-[0.25em] transition-all',
              activeTab.toUpperCase() === tab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground/60 hover:text-primary/70'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[60px_40px_160px_1fr_140px_100px] border-b border-border bg-muted/10 px-6 py-3 sticky top-[58px] z-20">
        {['PRI', '', 'SENDER', 'MESSAGE DETAIL', 'AI SUGGESTION', 'RECEIVED'].map((h, i) => (
          <div key={i} className="text-[9px] font-black tracking-[0.2em] text-muted-foreground/50 uppercase">{h}</div>
        ))}
      </div>

      {/* Email Rows */}
      <div className="divide-y divide-border/20">
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            onClick={() => onSelectEmail(email)}
            className={cn(
              'grid grid-cols-[60px_40px_160px_1fr_140px_100px] items-center px-6 py-4 cursor-pointer transition-all',
              // Visual selection state using Sky Blue
              selectedEmail?.id === email.id ? 'bg-primary/5 shadow-[inset_4px_0_0_var(--primary)]' : 'hover:bg-muted/30',
              // READ VS UNREAD: Read messages use a darker/muted background, unread stay white/bright
              email.isRead ? 'opacity-70 bg-muted/5' : 'bg-card'
            )}
          >
            <div className="flex items-center gap-2">
               <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(email.id); }} className="p-2">
                <Star className={cn('h-4 w-4 transition-colors', email.isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground/20')} />
              </button>
            </div>
            
            <div className="flex justify-center">
              {email.urgency.label === 'High' && (
                <AlertCircle className="h-4 w-4 text-muted" /> 
              )}
            </div>

            {/* Typography adjustments for readability */}
            <div className={cn("text-[13px] font-black truncate", email.isRead ? "text-foreground/60" : "text-foreground")}>
              {email.sender.name}
            </div>
            <div className={cn("text-[13px] truncate pr-8", email.isRead ? "font-medium text-foreground/40" : "font-bold text-foreground/80")}>
              {email.subject}
            </div>
            
            {/* ACTION BUTTON: Uses Sunset Pink (var(--muted)) for Respond, Sky Blue for others */}
            <div className={cn(
              "text-[10px] font-black uppercase tracking-wider",
              email.suggestedAction === 'RESPOND' ? "text-muted" : "text-primary/80"
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