'use client'

import React, { useMemo } from 'react'
import { Reply, UserPlus, Archive, Clock, Star, Mail, AlertCircle, Sparkles, Zap } from 'lucide-react'
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
    <div className="relative flex-1 overflow-y-auto bg-card scrollbar-hide">
      {/* 
         NOTE: If you see DUPLICATE buttons, delete the block below 
         and move it to your parent page.tsx instead.
      */}
      <div className="grid grid-cols-4 gap-4 px-6 pt-8 pb-4">
        {[
          { label: 'Unread', val: (emails ?? []).filter(e => !e.isRead).length, icon: Mail, tab: 'unread' },
          { label: 'Urgent', val: (emails ?? []).filter(e => e.urgency.label === 'High').length, icon: AlertCircle, tab: 'action' },
          { label: 'Noise', val: '21%', icon: Sparkles, tab: 'noise' },
          { label: 'Focus Time', val: '1.3h', icon: Zap, tab: 'all' }
        ].map((s) => (
          <button 
            key={s.label}
            onClick={() => setActiveTab(s.tab)}
            className={cn(
              "flex flex-col items-start p-6 rounded-[2rem] border transition-all text-left",
              activeTab === s.tab ? "bg-primary/5 border-primary shadow-sm" : "bg-card border-border hover:border-primary/40"
            )}
          >
            <div className="flex justify-between w-full mb-4">
              <s.icon className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</span>
            </div>
            <div className="text-3xl font-black tracking-tighter text-foreground">{s.val}</div>
          </button>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-30 flex items-center border-b border-border bg-background/95 px-6 backdrop-blur-md">
        {['ALL', 'ACTION', 'TODAY', 'NOISE'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={cn(
              'border-b-2 px-8 py-5 text-[10px] font-black tracking-[0.25em] transition-all',
              activeTab.toUpperCase() === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[60px_40px_160px_1fr_140px_100px] border-b border-border bg-muted/30 px-6 py-3 sticky top-[58px] z-20">
        {['PRI', '', 'SENDER', 'MESSAGE DETAIL', 'AI SUGGESTION', 'RECEIVED'].map((h, i) => (
          <div key={i} className="text-[9px] font-black tracking-[0.2em] text-muted-foreground/60 uppercase">{h}</div>
        ))}
      </div>

      {/* Email Rows */}
      <div className="divide-y divide-border/40">
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            onClick={() => onSelectEmail(email)}
            className={cn(
              'grid grid-cols-[60px_40px_160px_1fr_140px_100px] items-center px-6 py-4 cursor-pointer transition-all',
              selectedEmail?.id === email.id ? 'bg-primary/[0.03] shadow-[inset_3px_0_0_var(--primary)]' : 'hover:bg-muted/20'
            )}
          >
            <div className="flex items-center gap-2">
               <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(email.id); }} className="p-2">
                <Star className={cn('h-4 w-4', email.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30')} />
              </button>
            </div>
            <div />
            <div className="text-[13px] font-black text-foreground truncate">{email.sender.name}</div>
            <div className="text-[13px] font-bold text-foreground/70 truncate pr-8">{email.subject}</div>
            <div className="text-[10px] font-black text-primary/80 uppercase">{email.suggestedAction}</div>
            <div className="text-[10px] font-black text-muted-foreground/40 text-right uppercase">{email.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  )
}