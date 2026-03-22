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
  /* ---------------------------------------------------------------------- */
  /* filtering by tab                                                       */
  /* ---------------------------------------------------------------------- */
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

  /* ---------------------------------------------------------------------- */
  /* JSX                                                                    */
  /* ---------------------------------------------------------------------- */
  return (
    <div className="relative flex-1 overflow-y-auto bg-card scrollbar-hide">
      {/* ── TAB BAR ─────────────────────────────────────────────────────── */}
      {!hideTabs && (
        <div className="sticky top-0 z-30 flex items-center border-b border-border bg-card/80 px-6 backdrop-blur-md">
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

      {/* ── GRID-ALIGNED HEADER (“whisper” labels) ──────────────────────── */}
      <div
        className={cn(
          'email-list-grid email-list-header sticky z-20 backdrop-blur-sm',
          hideTabs ? 'top-0' : 'top-[53px]',
        )}
      >
        <div className="email-list-header-label">PRI</div>
        <div /> {/* spacer for unread-dot column */}
        <div className="email-list-header-label">SENDER</div>
        <div className="email-list-header-label">MESSAGE DETAIL</div>
        <div className="email-list-header-label">AI&nbsp;SUGGESTION</div>
        <div className="email-list-header-label">RECEIVED</div>
      </div>

      {/* ── EMAIL ROWS ──────────────────────────────────────────────────── */}
      <div className="relative z-10 divide-y divide-border/60">
        {filteredEmails.map((email) => {
          const isSelected = selectedEmail?.id === email.id
          const isUnread = !email.isRead
          const isHighPriority = email.urgency.label === 'High'

          /* label colours ------------------------------------------------ */
          const isClient = email.category === 'Client'
          const labelStyles = isClient
            ? 'border-success/30 bg-success/10 text-success'
            : 'border-border bg-secondary/60 text-muted-foreground'

          /* action chip config ------------------------------------------ */
          const { Icon, label, styles } = (() => {
            switch (email.suggestedAction) {
              case 'Respond':
                return {
                  Icon: Reply,
                  label: 'Reply',
                  styles: 'border-primary/25 bg-primary/10 text-primary',
                }
              case 'Delegate':
                return {
                  Icon: UserPlus,
                  label: 'Delegate',
                  styles:
                    'border-muted-foreground/25 bg-muted text-muted-foreground',
                }
              case 'Review Later':
                return {
                  Icon: Clock,
                  label: 'Review Later',
                  styles: 'border-warning/30 bg-warning/10 text-warning',
                }
              default:
                return {
                  Icon: Archive,
                  label: 'Clear',
                  styles:
                    'border-destructive/30 bg-destructive/10 text-destructive',
                }
            }
          })()

          /* row ---------------------------------------------------------- */
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
              className={cn(
                'email-list-grid email-row cursor-pointer px-row py-row transition-colors duration-200',
                isSelected
                  ? 'bg-primary/10 shadow-[inset_4px_0_0_var(--primary)]'
                  : isUnread
                  ? 'bg-muted/40'
                  : 'hover:bg-muted/25',
              )}
              onClick={() => onSelectEmail(email)}
            >
              {/* PRI + star */}
              <div className="flex w-16 shrink-0 items-center justify-center gap-2">
                <div className="flex w-4 justify-center">
                  {isHighPriority ? (
                    <div className="flex gap-0.5 text-sm font-black tracking-tighter text-warning drop-shadow-[0_0_6px_color-mix(in_oklab,var(--warning)40%,transparent)]">
                      <span>!</span>
                      <span>!</span>
                    </div>
                  ) : (
                    <div className="h-1 w-1 rounded-full bg-border" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFavorite(email.id)
                  }}
                  className="group/star relative p-1 outline-none"
                >
                  <Star
                    className={cn(
                      'h-4 w-4 transition-all duration-300 active:scale-150',
                      email.isFavorite
                        ? 'scale-100 fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground opacity-40 group-hover/star:opacity-100',
                    )}
                  />
                </button>
              </div>

              {/* unread dot */}
              <div className="flex w-4 shrink-0 justify-center">
                {isUnread && (
                  <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_color-mix(in_oklab,var(--primary)55%,transparent)]" />
                )}
              </div>

              {/* sender */}
              <div className="w-40 shrink-0">
                <span
                  className={cn(
                    'block truncate',
                    isUnread
                      ? 'font-bold text-foreground'
                      : 'font-medium text-muted-foreground',
                  )}
                >
                  {email.sender.name}
                </span>
              </div>

              {/* subject + preview */}
              <div className="flex min-w-0 flex-1 flex-col">
                <span
                  className={cn(
                    'truncate',
                    isUnread ? 'font-medium' : 'text-foreground/90',
                  )}
                >
                  {email.subject}
                </span>
                <span className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {email.bodyPreview}
                </span>
              </div>

              {/* action chip */}
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

              {/* category & time */}
              <div className="flex w-32 shrink-0 items-center justify-end gap-3">
                <span
                  className={cn(
                    'rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-widest',
                    labelStyles,
                  )}
                >
                  {email.category}
                </span>
                <span
                  className={cn(
                    'shrink-0 text-[10px] font-bold uppercase',
                    isUnread ? 'text-primary' : 'text-muted-foreground',
                  )}
                >
                  14h ago
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}