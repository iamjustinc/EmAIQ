'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Archive,
  Reply,
  Clock,
  Users,
  Zap,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Email } from '@/lib/types'
import { useUserStore } from '@/store/use-user-store'

interface EmailDetailSheetProps {
  email: Email | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onArchive: (id: string) => void
  onSent: (id: string) => void
  onSnooze: (id: string, hours: number) => void
  isDrafting: boolean
  setIsDrafting: (val: boolean) => void
}

type Mode = 'default' | 'reply' | 'delegate'

export function EmailDetailSheet({
  email,
  open,
  onOpenChange,
  onArchive,
  onSent,
  onSnooze,
  isDrafting,
  setIsDrafting,
}: EmailDetailSheetProps) {
  const [mode, setMode] = useState<Mode>('default')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showFullEmail, setShowFullEmail] = useState(false)
  const [replyText, setReplyText] = useState('')

  const { firstName: globalFirstName, signOff: globalSignOff } = useUserStore()

  useEffect(() => {
    if (open && email) {
      setIsAnalyzing(true)
      setShowFullEmail(false)
      setMode('default')
      setIsDrafting(false)
      setReplyText('')

      const timer = setTimeout(() => {
        setIsAnalyzing(false)
      }, 450)

      return () => clearTimeout(timer)
    }
  }, [open, email, setIsDrafting])

  const generatedDraft = useMemo(() => {
    if (!email) return ''
    const senderFirstName = email.sender.name.split(' ')[0]
    const lines = email.analysis?.summary ?? []
    const signature = `\n\n${globalSignOff},\n${globalFirstName}`

    if (lines.length === 0) {
      return `Hi ${senderFirstName},\n\nThanks for your email. I’ve received this and will take a look right away.${signature}`
    }
    return `Hi ${senderFirstName},\n\nThanks for flagging this. I understand that ${lines[0].toLowerCase()}\n\nI’ll take care of it and follow up shortly.${signature}`
  }, [email, globalFirstName, globalSignOff]) 

  if (!email) return null

  const resetAndClose = () => {
    setMode('default')
    setIsDrafting(false)
    setReplyText('')
    onOpenChange(false)
  }

  const handleUseDraft = () => {
    setReplyText(generatedDraft)
    setMode('reply')
    setIsDrafting(true)
  }

  const handleRespond = () => {
    setReplyText('') 
    setMode('reply')
    setIsDrafting(true)
  }

  const handleSend = () => {
    onSent(email.id)
    resetAndClose()
  }

  const handleArchive = () => {
    onArchive(email.id)
    resetAndClose()
  }

  const handleSnooze = (hours: number) => {
    onSnooze(email.id, hours)
    resetAndClose()
  }

  const priorityLabel = email.urgency?.label === 'High' ? 'Critical' : 'Priority'
  const priorityClass = email.urgency?.label === 'High'
    ? 'border-destructive/30 bg-destructive/5 text-destructive'
    : 'border-border bg-card text-muted-foreground'

  return (
    <Sheet open={open} onOpenChange={(val) => { if (!val) resetAndClose() }}>
      <SheetContent
        side="right"
        className="w-[520px] max-w-[95vw] border-l border-border bg-sheet-solid p-0 shadow-2xl outline-none"
      >
        <div className="flex h-full flex-col overflow-hidden bg-sheet-solid">
          {/* Header */}
          <div className="shrink-0 border-b border-border px-10 pb-8 pt-12">
            <div className="mb-8 flex items-start justify-between">
              <div className="flex gap-3">
                <div className={`rounded-full border px-5 py-2 text-[10px] font-black uppercase tracking-[0.22em] ${priorityClass}`}>
                  <AlertCircle className="mr-2 inline h-4 w-4" />
                  {priorityLabel}
                </div>
                <div className="rounded-full border border-primary/25 bg-primary/5 px-5 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                  AI Scanned
                </div>
              </div>
            </div>
            <h2 className="text-[32px] font-black leading-[1.05] tracking-tight text-foreground">
              {email.subject}
            </h2>
            <div className="mt-8 flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.22em]">
              <span className="text-muted-foreground">Sender:</span>
              <span className="text-primary">{email.sender.name}</span>
            </div>
          </div>

          {/* Body - Point 3 Fix: Tightened Padding */}
          <div className="scrollbar-hide flex-1 overflow-y-auto px-10 py-4">
            {isAnalyzing ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
              </div>
            ) : mode === 'reply' ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
                  <div className="mb-6 flex items-center gap-3">
                    <Reply className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Drafting Response</span>
                  </div>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[350px] border-none bg-transparent p-0 text-base leading-relaxed text-foreground focus-visible:ring-0"
                    placeholder="Type your message..."
                    autoFocus
                  />
                </div>
              </div>
            ) : mode === 'delegate' ? (
              <div className="space-y-6 p-2">
                <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm text-center">
                  <Users className="mx-auto mb-4 h-8 w-8 text-primary" />
                  <h3 className="text-lg font-black uppercase tracking-widest mb-6">Select Recipient</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {['Operations Team', 'Engineering', 'Executive Assistant'].map((team) => (
                      <Button key={team} variant="outline" className="h-16 rounded-2xl border-border font-black uppercase tracking-widest hover:bg-primary/5" onClick={() => { onSent(email.id); resetAndClose(); }}>
                        {team}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4"> {/* Reduced gap from 6 to 4 */}
                <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="h-4 w-4 fill-primary text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Intelligence Report</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="h-9 rounded-xl border border-primary/20 bg-primary/5 px-4 text-[9px] font-black uppercase tracking-[0.22em] text-primary"
                      onClick={handleUseDraft}
                    >
                      Use AI Draft
                    </Button>
                  </div>
                  <ul className="space-y-4">
                    {(email.analysis?.summary ?? []).map((point, i) => (
                      <li key={i} className="flex gap-5">
                        <span className="mt-1 text-[11px] font-black text-primary/40">0{i + 1}</span>
                        <p className="text-[15px] font-bold leading-snug tracking-tight text-foreground/90">
                          {point}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setShowFullEmail(!showFullEmail)}
                    className="flex w-full items-center justify-between text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
                  >
                    <span>Original Message</span>
                    {showFullEmail ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {showFullEmail && (
                    <div className="mt-4 rounded-2xl border border-border bg-muted/20 p-6 text-[14px] leading-relaxed text-foreground/70 italic">
                      {email.body || email.bodyPreview}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer - Point 3 Fix: Massive Contrast for Respond Button */}
          <div className="shrink-0 border-t border-border bg-background p-10">
            {mode === 'default' ? (
              <div className="grid grid-cols-2 gap-5">
                <Button
                  className="h-28 rounded-[2.5rem] bg-foreground text-background shadow-action transition-all active:scale-95"
                  onClick={handleRespond}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Reply className="h-6 w-6" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Respond</span>
                  </div>
                </Button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-28 rounded-[2.5rem] border-border bg-card text-muted-foreground shadow-action transition-all active:scale-95">
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="h-6 w-6" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Later</span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="top" className="w-56 rounded-[1.5rem] p-2">
                    {[1, 3, 24].map(h => (
                      <Button key={h} variant="ghost" className="w-full justify-start font-black uppercase text-[10px] tracking-widest" onClick={() => handleSnooze(h)}>
                        {h === 24 ? 'Tomorrow' : `${h} Hours`}
                      </Button>
                    ))}
                  </PopoverContent>
                </Popover>

                <Button variant="outline" className="h-16 rounded-2xl border-border bg-card text-muted-foreground uppercase text-[10px] font-black tracking-widest" onClick={() => setMode('delegate')}>
                  Delegate
                </Button>
                <Button variant="outline" className="h-16 rounded-2xl border-destructive/20 text-destructive bg-destructive/5 uppercase text-[10px] font-black tracking-widest" onClick={handleArchive}>
                  Archive
                </Button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Button variant="outline" className="h-16 flex-1 rounded-2xl" onClick={() => setMode('default')}>Cancel</Button>
                <Button className="h-16 flex-[1.5] rounded-2xl bg-primary text-white font-black uppercase tracking-widest" onClick={() => { onSent(email.id); resetAndClose(); }}>
                  {mode === 'reply' ? 'Send Reply' : 'Delegate Now'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}