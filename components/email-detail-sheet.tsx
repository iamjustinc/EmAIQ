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
  Zap,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Check,
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

type Mode = 'default' | 'reply'

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
  const [successAction, setSuccessAction] = useState<string | null>(null)

  const { firstName: globalFirstName, signOff: globalSignOff } = useUserStore()

  useEffect(() => {
    if (open && email) {
      setIsAnalyzing(true)
      setShowFullEmail(false)
      setMode('default')
      setIsDrafting(false)
      setReplyText('')
      setSuccessAction(null)
      const timer = setTimeout(() => setIsAnalyzing(false), 450)
      return () => clearTimeout(timer)
    }
  }, [open, email, setIsDrafting])

  const generatedDraft = useMemo(() => {
    if (!email) return ''
    const senderFirstName = email.sender.name.split(' ')[0]
    const lines = email.analysis?.summary ?? []
    const signature = `\n\n${globalSignOff},\n${globalFirstName}`
    if (lines.length === 0) return `Hi ${senderFirstName},\n\nThanks for your email.${signature}`
    return `Hi ${senderFirstName},\n\nI understand that ${lines[0].toLowerCase()}\n\nI’ll take care of it.${signature}`
  }, [email, globalFirstName, globalSignOff]) 

  if (!email) return null

  const triggerSuccess = (actionType: string, callback: () => void) => {
    setSuccessAction(actionType)
    setTimeout(() => {
      callback()
      setSuccessAction(null)
      setMode('default')
      setIsDrafting(false)
      onOpenChange(false)
    }, 800)
  }

  const priorityLabel = email.urgency?.label === 'High' ? 'Critical' : 'Priority'
  const priorityClass = email.urgency?.label === 'High'
    ? 'border-destructive/30 bg-destructive/5 text-destructive'
    : 'border-border bg-card text-muted-foreground'

  return (
    <Sheet open={open} onOpenChange={(val) => { if (!val) { setMode('default'); onOpenChange(false); } }}>
      <SheetContent side="right" className="w-[520px] max-w-[95vw] border-l border-border bg-background p-0 shadow-2xl outline-none">
        <div className="flex h-full flex-col overflow-hidden bg-background">
          <div className="shrink-0 border-b border-border px-10 pb-6 pt-10">
            <div className="mb-6 flex gap-3">
              <div className={`rounded-full border px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] ${priorityClass}`}>
                <AlertCircle className="mr-1.5 inline h-3.5 w-3.5" />
                {priorityLabel}
              </div>
              <div className="rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-primary">AI Scanned</div>
            </div>
            <h2 className="text-[28px] font-black leading-tight tracking-tight text-foreground">{email.subject}</h2>
            <div className="mt-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
              <span className="text-muted-foreground">Sender:</span>
              <span className="text-primary">{email.sender.name}</span>
            </div>
          </div>

          <div className="scrollbar-hide flex-1 overflow-y-auto px-10 py-6">
            {isAnalyzing ? (
              <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary/40" /></div>
            ) : mode === 'reply' ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2 text-primary font-black uppercase text-[9px] tracking-widest">
                    <Reply className="h-3.5 w-3.5" /> Drafting Response
                  </div>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[220px] border-none bg-transparent p-0 text-[15px] leading-relaxed text-foreground focus-visible:ring-0"
                    placeholder="Type your message..."
                    autoFocus
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary font-black uppercase text-[9px] tracking-widest">
                      <Zap className="h-3.5 w-3.5 fill-primary" /> Intelligence Report
                    </div>
                    <Button variant="ghost" className="h-8 rounded-lg border border-primary/20 bg-primary/5 px-3 text-[9px] font-black uppercase tracking-widest text-primary" onClick={() => { setReplyText(generatedDraft); setMode('reply'); setIsDrafting(true); }}>
                      Use AI Draft
                    </Button>
                  </div>
                  <ul className="space-y-3">
                    {(email.analysis?.summary ?? []).map((point, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="mt-1 text-[10px] font-black text-primary/40">0{i + 1}</span>
                        <p className="text-[13px] font-bold leading-normal tracking-tight text-foreground/90">{point}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <button type="button" onClick={() => setShowFullEmail(!showFullEmail)} className="flex w-full items-center justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">
                    <span>Original Message</span>
                    {showFullEmail ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {showFullEmail && <div className="mt-3 rounded-xl border border-border bg-muted/10 p-5 text-[13px] leading-relaxed text-foreground/70 italic">{email.body || email.bodyPreview}</div>}
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-border bg-background p-8">
            {mode === 'default' ? (
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-24 rounded-[2rem] bg-foreground text-background shadow-lg" onClick={() => { setReplyText(''); setMode('reply'); setIsDrafting(true); }}>
                  <div className="flex flex-col items-center gap-2">
                    <Reply className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Respond</span>
                  </div>
                </Button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-24 rounded-[2rem] border-border bg-card text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Later</span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="top" align="center" className="w-48 rounded-2xl p-2 z-[9999] bg-popover border-border shadow-2xl opacity-100 !opacity-100">
                    {[1, 3, 24].map(h => (
                      <Button key={h} variant="ghost" className="w-full justify-start font-black uppercase text-[9px] tracking-widest" onClick={() => triggerSuccess('later', () => onSnooze(email.id, h))}>
                        {h === 24 ? 'Tomorrow' : `${h} Hours`}
                      </Button>
                    ))}
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-14 rounded-2xl border-border bg-card text-muted-foreground uppercase text-[10px] font-black tracking-widest">
                      Delegate
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="top" className="w-56 rounded-2xl p-2 z-[9999] bg-popover border-border shadow-2xl opacity-100 !opacity-100">
                    <div className="px-3 py-2 text-[8px] font-black uppercase tracking-tighter text-muted-foreground/60 border-b mb-1">Assign To</div>
                    {['Operations Team', 'Priyanka (Sales)', 'Engineering'].map((team) => (
                      <Button key={team} variant="ghost" className="w-full justify-start font-black uppercase text-[9px] tracking-widest" onClick={() => triggerSuccess('delegate', () => onSent(email.id))}>
                        {team}
                      </Button>
                    ))}
                  </PopoverContent>
                </Popover>

                <Button variant="outline" className="h-14 rounded-2xl border-destructive/20 text-destructive bg-destructive/5 uppercase text-[10px] font-black tracking-widest" onClick={() => triggerSuccess('archive', () => onArchive(email.id))}>
                  {successAction === 'archive' ? <Check className="h-5 w-5 animate-in zoom-in" /> : 'Archive'}
                </Button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Button variant="outline" className="h-14 flex-1 rounded-2xl border-border" onClick={() => { setMode('default'); setIsDrafting(false); }}>Cancel</Button>
                <Button className="h-14 flex-[1.5] rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest" onClick={() => triggerSuccess('send', () => onSent(email.id))}>
                  {successAction === 'send' ? <Check className="h-5 w-5 animate-in zoom-in" /> : 'Send Message'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}