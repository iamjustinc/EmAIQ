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
// Import the global store
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

  // Grab the global user data (firstName and signOff)
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
    
    // Construct the signature using the global store values
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

  const handleDelegateStart = () => {
    setMode('delegate')
    setIsDrafting(false)
  }

  const handleDelegateComplete = () => {
    onSent(email.id)
    resetAndClose()
  }

  const priorityLabel = email.urgency?.label === 'High' ? 'Critical' : 'Priority'
  const priorityClass = email.urgency?.label === 'High'
    ? 'border-destructive/30 bg-destructive/5 text-destructive'
    : 'border-border bg-white text-muted-foreground'

  return (
    <Sheet open={open} onOpenChange={(val) => { if (!val) resetAndClose() }}>
      <SheetContent
        side="right"
        className="w-[480px] max-w-[95vw] border-l border-border bg-sheet-solid p-0 shadow-2xl outline-none"
      >
        <div className="flex h-full flex-col overflow-hidden bg-sheet-solid">
          {/* Header */}
          <div className="shrink-0 border-b border-border px-8 pb-6 pt-8">
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
            <h2 className="max-w-[18ch] text-[30px] font-bold leading-[1.08] tracking-tight text-foreground">
              {email.subject}
            </h2>
            <div className="mt-7 flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.22em]">
              <span className="text-muted-foreground">From:</span>
              <span className="text-primary">{email.sender.name}</span>
            </div>
          </div>

          {/* Body */}
          <div className="scrollbar-hide flex-1 overflow-y-auto px-8 py-6">
            {isAnalyzing ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-primary/50" />
              </div>
            ) : mode === 'reply' ? (
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <Reply className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Draft Response</span>
                  </div>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[200px] rounded-2xl border-border bg-white text-sm leading-relaxed text-foreground focus-visible:ring-1 focus-visible:ring-primary"
                    placeholder="Write your response..."
                    autoFocus
                  />
                </div>
              </div>
            ) : mode === 'delegate' ? (
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Delegate Task</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['Sarah (Ops)', 'Mike (Sales)', 'Priyanka', 'Support'].map((team) => (
                      <Button
                        key={team}
                        variant="outline"
                        className="h-14 rounded-2xl border-border bg-white text-[10px] font-black uppercase tracking-[0.18em] text-foreground transition-all active:scale-95"
                        onClick={handleDelegateComplete}
                      >
                        {team}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-[2.25rem] border border-border bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Zap className="h-4 w-4 fill-primary text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Intelligence Report</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="h-9 rounded-xl border border-primary/20 bg-primary/5 px-4 text-[9px] font-black uppercase tracking-[0.15em] text-primary transition-all active:scale-95"
                      onClick={handleUseDraft}
                    >
                      <Zap className="mr-1.5 h-3 w-3 fill-primary" />
                      Use Draft
                    </Button>
                  </div>
                  <ul className="space-y-4">
                    {(email.analysis?.summary ?? []).map((point, i) => (
                      <li key={i} className="flex gap-5">
                        <span className="mt-0.5 text-[11px] font-black text-primary">0{i + 1}</span>
                        <p className="max-w-[34ch] text-[15px] leading-[1.45] text-foreground/80 font-medium">
                          {point}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border/75 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowFullEmail((s) => !s)}
                    className="flex w-full items-center justify-between text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>Original Thread</span>
                    {showFullEmail ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {showFullEmail && (
                    <div className="mt-4 rounded-2xl border border-border bg-white/50 p-5 text-[13px] leading-relaxed text-foreground/75 italic">
                      {email.body || email.bodyPreview}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="shrink-0 border-t border-border/75 bg-sheet-solid p-8">
            {mode === 'default' && (
              <div className="grid grid-cols-2 gap-5">
                <Button
                  className="h-24 rounded-[2rem] bg-primary text-white border-none shadow-action transition-all hover:brightness-105 active:scale-[0.97]"
                  onClick={handleRespond}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Reply className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.18em]">Respond</span>
                  </div>
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-24 rounded-[2rem] border-border bg-white text-muted-foreground shadow-action transition-all hover:bg-muted/5 active:scale-[0.97]">
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.18em]">Later</span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="top" className="z-[500] w-52 rounded-2xl border-border bg-white p-2 shadow-2xl">
                    <div className="flex flex-col gap-1">
                      { [1, 3, 24].map(h => (
                        <Button key={h} variant="ghost" className="justify-start rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary/5" onClick={() => handleSnooze(h)}>
                          {h === 24 ? 'Tomorrow' : `${h} Hour${h > 1 ? 's' : ''}`}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <Button variant="outline" className="h-24 rounded-[2rem] border-border bg-white text-muted-foreground shadow-action transition-all hover:bg-muted/5 active:scale-[0.97]" onClick={handleDelegateStart}>
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.18em]">Delegate</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-24 rounded-[2rem] border-destructive/20 bg-white text-destructive shadow-action transition-all hover:bg-destructive/5 active:scale-[0.97]" onClick={handleArchive}>
                  <div className="flex flex-col items-center gap-2">
                    <Archive className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.18em]">Archive</span>
                  </div>
                </Button>
              </div>
            )}
            
            {(mode === 'reply' || mode === 'delegate') && (
               <div className="flex gap-4">
                <Button variant="outline" className="h-14 flex-1 rounded-2xl border-border bg-white active:scale-95" onClick={() => { setMode('default'); setIsDrafting(false); }}>
                  {mode === 'reply' ? 'Cancel' : 'Back'}
                </Button>
                <Button className="h-14 flex-[1.4] rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 active:scale-95" onClick={mode === 'reply' ? handleSend : handleDelegateComplete}>
                  {mode === 'reply' ? 'Send Message' : 'Confirm Delegate'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}