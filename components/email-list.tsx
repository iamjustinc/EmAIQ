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

    if (tab === 'action') {
      return safe.filter((e) => e.urgency.label === 'High')
    }

    if (tab === 'noise') {
      return safe.filter(
        (e) =>
          e.urgency.label === 'Low' ||
          e.sender.name.toLowerCase().includes('news'),
      )
    }

    return safe
  }, [emails, activeTab])

  return (
    <div className="relative flex-1 overflow-y-auto bg-card scrollbar-hide">
      {!hideTabs && (
        <div className="sticky top-0 z-30 flex items-center border-b border-border bg-card/95 px-6">
          {['ALL', 'ACTION', 'TODAY', 'NOISE'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={cn(
                'border-b-2 px-8 py-4 text-[10px] font-bold tracking-[0.2em] transition-all',
                activeTab.toUpperCase() === tab
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground/80',
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      <div
        className={cn(
          'email-list-grid email-list-header sticky z-20',
          hideTabs ? 'top-0' : 'top-[53px]',
        )}
      >
        <div className="email-list-header-label">PRI</div>
        <div />
        <div className="email-list-header-label">SENDER</div>
        <div className="email-list-header-label">MESSAGE DETAIL</div>
        <div className="email-list-header-label text-primary">AI SUGGESTION</div>
        <div className="email-list-header-label">RECEIVED</div>
      </div>

      <div className="relative z-10 divide-y divide-border/60">
        {filteredEmails.map((email) => {
          const isSelected = selectedEmail?.id === email.id
          const isUnread = !email.isRead
          const isHighPriority = email.urgency.label === 'High'

          const { Icon, label, styles } = (() => {
            switch (email.suggestedAction) {
              case 'Respond':
                return {
                  Icon: Reply,
                  label: 'Reply',
                  styles: 'border-primary/30 bg-primary/5 text-primary',
                }
              case 'Delegate':
                return {
                  Icon: UserPlus,
                  label: 'Delegate',
                  styles:
                    'border-border bg-white text-muted-foreground',
                }
              case 'Review Later':
                return {
                  Icon: Clock,
                  label: 'Review Later',
                  styles: 'border-warning/35 bg-warning/5 text-warning',
                }
              default:
                return {
                  Icon: Archive,
                  label: 'Clear',
                  styles:
                    'border-destructive/30 bg-destructive/5 text-destructive',
                }
            }
          })()

          return (
            <div
              key={email.id}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectEmail(email)
                }
              }}
              onClick={() => onSelectEmail(email)}
              className={cn(
                'email-list-grid email-row cursor-pointer px-row py-row',
                isSelected
                  ? 'bg-[color:color-mix(in_oklab,var(--primary)_10%,white)] shadow-[inset_4px_0_0_var(--primary)]'
                  : isUnread
                    ? 'bg-[color:color-mix(in_oklab,var(--primary)_7%,white)]'
                    : 'bg-card',
              )}
            >
              <div className="flex w-16 shrink-0 items-center justify-center gap-2">
                <div className="flex w-4 justify-center">
                  {isHighPriority ? (
                    <div className="flex gap-0.5 text-sm font-black tracking-tighter text-warning">
                      <span>!</span>
                      <span>!</span>
                    </div>
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-border" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFavorite(email.id)
                  }}
                  className="relative p-1 outline-none"
                >
                  <Star
                    className={cn(
                      'h-4 w-4 transition-all duration-200',
                      email.isFavorite
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground opacity-45 hover:opacity-100',
                    )}
                  />
                </button>
              </div>

              <div className="flex w-4 shrink-0 justify-center">
                {isUnread && (
                  <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_12px_color-mix(in_oklab,var(--primary)_55%,transparent)]" />
                )}
              </div>

              <div className="w-40 shrink-0">
                <span
                  className={cn(
                    'block truncate',
                    isUnread
                      ? 'font-bold text-foreground'
                      : 'font-medium text-foreground/70',
                  )}
                >
                  {email.sender.name}
                </span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <span
                  className={cn(
                    'truncate',
                    isUnread ? 'font-medium text-foreground' : 'text-foreground/70',
                  )}
                >
                  {email.subject}
                </span>
                <span className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {email.bodyPreview}
                </span>
              </div>

              <div className="flex w-32 shrink-0 justify-center">
                <div
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase',
                    styles,
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </div>
              </div>

              <div className="flex w-28 shrink-0 items-center justify-end">
                <span
                  className={cn(
                    'shrink-0 text-[10px] font-bold uppercase',
                    isUnread ? 'text-primary' : 'text-muted-foreground',
                  )}
                >
                  14H AGO
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}