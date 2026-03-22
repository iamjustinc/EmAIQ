'use client'

import React, { useMemo } from 'react'
import { Reply, UserPlus, Archive, Clock, Star } from 'lucide-react'
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
  hideTabs = false,
}: EmailListProps) {
  const filteredEmails = useMemo(() => {
    const safe = emails ?? []
    const tab = activeTab.toLowerCase()
    if (tab === 'action') return safe.filter((e) => e.urgency.label === 'High')
    if (tab === 'noise') return safe.filter((e) => e.urgency.label === 'Low' || e.sender.name.toLowerCase().includes('news'))
    return safe
  }, [emails, activeTab])

  return (
    <div className="relative flex-1 overflow-y-auto bg-card scrollbar-hide">
      {!hideTabs && (
        <div className="sticky top-0 z-30 flex items-center border-b border-border bg-white/95 px-6 backdrop-blur-md">
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
      )}

      <div className={cn('grid grid-cols-[60px_40px_160px_1fr_140px_100px] border-b border-border bg-muted/30 px-6 py-3', hideTabs ? 'top-0' : 'top-[58px] sticky z-20')}>
        {['PRI', '', 'SENDER', 'MESSAGE DETAIL', 'AI SUGGESTION', 'RECEIVED'].map((h, i) => (
          <div key={i} className="text-[9px] font-black tracking-[0.2em] text-muted-foreground/60">{h}</div>
        ))}
      </div>

      <div className="divide-y divide-border/40">
        {filteredEmails.map((email) => {
          const isSelected = selectedEmail?.id === email.id
          const isUnread = !email.isRead
          const isHighPriority = email.urgency.label === 'High'

          const actionConfig = {
            Respond: { Icon: Reply, label: 'Reply', styles: 'border-primary/30 bg-primary/5 text-primary' },
            Delegate: { Icon: UserPlus, label: 'Delegate', styles: 'border-border bg-white text-muted-foreground' },
            'Review Later': { Icon: Clock, label: 'Later', styles: 'border-warning/30 bg-warning/5 text-warning' },
            default: { Icon: Archive, label: 'Clear', styles: 'border-destructive/20 bg-destructive/5 text-destructive' }
          }
          const action = actionConfig[email.suggestedAction as keyof typeof actionConfig] || actionConfig.default

          return (
            <div
              key={email.id}
              onClick={() => onSelectEmail(email)}
              className={cn(
                'grid grid-cols-[60px_40px_160px_1fr_140px_100px] items-center px-6 py-4 cursor-pointer transition-all',
                isSelected ? 'bg-primary/[0.03] shadow-[inset_3px_0_0_var(--primary)]' : isUnread ? 'bg-white' : 'hover:bg-muted/20'
              )}
            >
              <div className="flex items-center gap-2">
                {isHighPriority ? <span className="text-xs font-black tracking-tighter text-orange-500">!!</span> : <div className="h-1 w-1 rounded-full bg-border" />}
                {/* Point 5: Fixed Star button click event */}
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(email.id); }}
                  className="hover:scale-110 transition-transform"
                >
                  <Star className={cn('h-3.5 w-3.5', email.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30')} />
                </button>
              </div>

              <div className="flex justify-center">
                {isUnread && <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />}
              </div>

              <div className={cn('truncate pr-4 text-[13px] tracking-tight', isUnread ? 'font-black text-foreground' : 'font-medium text-muted-foreground')}>
                {email.sender.name}
              </div>

              <div className="flex flex-col min-w-0 pr-8">
                <span className={cn('truncate text-[13px] tracking-tight', isUnread ? 'font-bold text-foreground' : 'text-foreground/80')}>
                  {email.subject}
                </span>
                <span className="truncate text-[11px] text-muted-foreground/70">{email.bodyPreview}</span>
              </div>

              <div className="flex justify-start">
                <div className={cn('flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-widest', action.styles)}>
                  <action.Icon className="h-3 w-3" />
                  {action.label}
                </div>
              </div>

              <div className="text-right text-[10px] font-bold text-muted-foreground/50 uppercase tracking-tighter">
                14H AGO
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}