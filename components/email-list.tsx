'use client'

import React, { useMemo } from 'react'
import { Star, AlertCircle, Eraser } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Email } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface EmailListProps {
  emails: Email[]; 
  selectedEmail: Email | null; 
  onSelectEmail: (email: Email) => void;
  onToggleFavorite: (id: string) => void; 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  onInstantCleanUp?: () => void;
  hideTabs?: boolean;
}

export function EmailList({ 
  emails, 
  selectedEmail, 
  onSelectEmail, 
  onToggleFavorite, 
  activeTab, 
  setActiveTab, 
  onInstantCleanUp,
  hideTabs = false 
}: EmailListProps) {
  const pathname = usePathname()

  const formatRelativeTime = (email: any) => {
    const rawTimestamp = email.timestamp || email.receivedAt;
    if (!rawTimestamp) return '---';
  
    const date = new Date(rawTimestamp);
    if (isNaN(date.getTime())) return String(rawTimestamp).toUpperCase();
  
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    if (diffInSeconds < 60) return 'JUST NOW';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}M AGO`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}H AGO`;
    return `${Math.floor(diffInSeconds / 86400)}D AGO`;
  };

  const filteredEmails = useMemo(() => {
    let list = emails ?? []

    if (pathname === '/sent') {
      list = list.filter(e => e.status === 'sent' || e.isSent)
    } else if (pathname === '/favorites') {
      list = list.filter(e => e.isFavorite)
    } else if (pathname === '/archived') {
      list = list.filter(e => e.isActioned === true)
    } else if (pathname === '/snoozed') {
      list = list.filter(e => e.snoozedUntil && Number(e.snoozedUntil) > Date.now())
    } else {
      list = list.filter(e => 
        !e.isActioned && 
        e.status !== 'sent' && 
        !e.isSent && 
        (!e.snoozedUntil || Number(e.snoozedUntil) <= Date.now())
      )
    }

    if (hideTabs) return list
    const tab = activeTab.toLowerCase()
    if (tab === 'action') return list.filter(e => e.urgency.label === 'High')
    if (tab === 'noise') return list.filter(e => e.urgency.label === 'Low')
    
    return list
  }, [emails, activeTab, hideTabs, pathname])

  return (
    <div className="relative flex-1 overflow-y-auto bg-[#F4F7F7] scrollbar-hide">
      {!hideTabs && (
        <div className="sticky top-0 z-30 flex items-center justify-between border-b-2 border-[#A8D0D0] bg-white px-6">
          <div className="flex">
            {['ALL', 'ACTION', 'TODAY', 'NOISE'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={cn(
                  'border-b-4 px-8 py-5 text-[10px] font-black tracking-[0.25em] transition-all',
                  activeTab.toUpperCase() === tab 
                    ? 'border-[#7FC6DA] text-[#7FC6DA]' 
                    : 'border-transparent text-[#8C867E] hover:text-[#7FC6DA]'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              onInstantCleanUp?.();
            }}
            variant="ghost"
            className="flex items-center gap-2 rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-tighter text-[#D95D5D] hover:bg-[#F6B3C4]/10 border-2 border-[#F6B3C4]/20 h-9"
          >
            <Eraser className="h-3.5 w-3.5" />
            Instant Clean Up
          </Button>
        </div>
      )}

      <div 
        className={cn(
          "grid grid-cols-[60px_40px_160px_1fr_140px_100px] border-b-2 border-[#A8D0D0]/40 bg-[#F4F7F7] px-6 py-4 sticky z-40",
          hideTabs ? "top-0" : "top-[62px]"
        )}
      >
        {['PRI', '', 'SENDER', 'MESSAGE DETAIL', 'AI SUGGESTION', 'RECEIVED'].map((h, i) => (
          <div key={i} className={cn(
            "text-[9px] font-black tracking-[0.2em] text-[#8C867E] uppercase",
            h === 'RECEIVED' ? "text-right" : ""
          )}>{h}</div>
        ))}
      </div>

      <div className="divide-y divide-[#A8D0D0]/20 px-2 relative z-10">
        {filteredEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#8C867E]">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Folder is empty</p>
          </div>
        ) : (
          filteredEmails.map((email) => (
            <div
              key={email.id}
              onClick={() => onSelectEmail(email)}
              className={cn(
                'grid grid-cols-[60px_40px_160px_1fr_140px_100px] items-center px-4 py-4 cursor-pointer transition-all my-1 rounded-2xl border-2',
                selectedEmail?.id === email.id 
                  ? 'bg-white border-[#7FC6DA] ring-4 ring-[#7FC6DA]/10 shadow-lg scale-[1.01] z-30' 
                  : email.isRead 
                    ? 'bg-[#F4F7F7] border-transparent opacity-80' 
                    : 'bg-white border-[#A8D0D0]/50 shadow-sm hover:border-[#7FC6DA]/50'
              )}
            >
              <div className="flex items-center gap-2">
                 <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onToggleFavorite(email.id); 
                  }} 
                  className="p-2 hover:scale-110 transition-transform"
                >
                  <Star className={cn('h-4 w-4', email.isFavorite ? 'fill-[#7FC6DA] text-[#7FC6DA]' : 'text-[#A8A29A]/40')} />
                </button>
              </div>
              <div className="flex justify-center">
                {email.urgency.label === 'High' && <AlertCircle className="h-4 w-4 text-[#F6B3C4]" />}
              </div>
              <div className={cn("text-[13px] font-black", email.isRead ? "text-[#8C867E]" : "text-[#2D3436]")}>
                {email.sender.name}
              </div>
              <div className={cn("text-[13px] truncate pr-8 font-medium", email.isRead ? "text-[#8C867E]/70" : "text-[#2D3436]/90")}>
                {email.subject}
              </div>
              <div className="flex">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black tracking-widest border-2 shadow-sm",
                  email.suggestedAction?.toUpperCase() === 'RESPOND' 
                    ? "bg-[#F6B3C4] border-[#F6B3C4] text-white" 
                    : "bg-[#7FC6DA] border-[#7FC6DA] text-white" 
                )}>
                  {email.suggestedAction}
                </span>
              </div>
              <div className="text-[10px] font-black text-[#8C867E] text-right uppercase pr-4">
                {formatRelativeTime(email)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}