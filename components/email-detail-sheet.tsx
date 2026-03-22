'use client'

import React, { useState, useEffect } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Email } from '@/lib/types'
import {
  Archive,
  Reply,
  Clock,
  Users,
  CheckCircle2,
  Zap,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X
} from 'lucide-react'

interface EmailDetailSheetProps {
  email: Email | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onArchive: (emailId: string) => void
  onSent: (emailId: string) => void
  onSnooze: (emailId: string, hours: number) => void
  isDrafting: boolean
  setIsDrafting: (isDrafting: boolean) => void
}

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
  const [sentSuccess, setSentSuccess] = useState(false)
  const [isDelegating, setIsDelegating] = useState(false)
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false)
  const [successMessage, setSuccessMessage] = useState('Action Completed')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showFullEmail, setShowFullEmail] = useState(false)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    if (open && email) {
      setIsAnalyzing(true)
      setShowFullEmail(false)
      setReplyText('')
      const timer = setTimeout(() => setIsAnalyzing(false), 800)
      return () => clearTimeout(timer)
    }
  }, [open, email?.id])

  if (!email) return null

  const handleAction = async (msg: string, type: 'archive' | 'sent' | 'snooze', hours?: number) => {
    setSuccessMessage(msg)
    await new Promise((res) => setTimeout(res, 400))
    setSentSuccess(true)
    setTimeout(() => {
      setSentSuccess(false)
      setIsDrafting(false)
      setIsDelegating(false)
      if (type === 'snooze' && hours) onSnooze(email.id, hours)
      else if (type === 'sent') onSent(email.id)
      else onArchive(email.id)
      onOpenChange(false)
    }, 1200)
  }

  return (
    <Sheet open={open} onOpenChange={(val) => {
      onOpenChange(val)
      if (!val) { setIsDrafting(false); setIsDelegating(false); }
    }}>
      <SheetContent
        side="right"
        className="z-[400] flex h-full w-[480px] max-w-[95vw] flex-col border-l border-border bg-background p-0 shadow-2xl transition-colors duration-500"
      >
        <div className="relative flex h-full flex-col">
          {/* Header Section */}
          <div className="p-8 pb-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 rounded-full border border-danger/20 bg-danger/5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-danger">
                  <AlertCircle className="h-3 w-3" />
                  {email.urgency.label === 'High' ? 'Critical' : 'Priority'}
                </div>
                <div className="rounded-full border border-border bg-card px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  AI Scanned
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-lg border border-border bg-card text-muted-foreground"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <h2 className="text-[28px] font-bold leading-[1.15] tracking-tight text-foreground">
              {email.subject}
            </h2>

            <div className="mt-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em]">
              <span className="text-muted-foreground">From:</span>
              <span className="text-primary">{email.sender.name}</span>
            </div>
          </div>

          <div className="scrollbar-hide flex-1 space-y-8 overflow-y-auto px-8 py-4">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
              </div>
            ) : (
              <>
                {/* Intelligence Report Card */}
                <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Zap className="h-4 w-4 fill-primary text-primary" />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">
                        Intelligence Report
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      className="h-10 rounded-2xl bg-primary/10 px-5 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/20"
                    >
                      <Zap className="mr-1.5 h-3.5 w-3.5 fill-primary" />
                      Use Draft
                    </Button>
                  </div>

                  <ul className="space-y-6">
                    {email.analysis?.summary?.map((point, i) => (
                      <li key={i} className="flex gap-5">
                        <span className="mt-0.5 text-[11px] font-black text-primary">0{i + 1}</span>
                        <p className="text-[14px] leading-relaxed text-foreground/80 font-medium">
                          {point}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Original Thread Toggle */}
                <div className="border-t border-border/60 pt-8">
                  <button
                    onClick={() => setShowFullEmail(!showFullEmail)}
                    className="flex w-full items-center justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
                  >
                    <span>Original Thread</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showFullEmail ? 'rotate-180' : ''}`} />
                  </button>
                  {showFullEmail && (
                    <div className="mt-4 text-sm leading-relaxed text-muted-foreground/80">
                      {email.body || email.bodyPreview}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Action Buttons Grid */}
          {!isAnalyzing && (
            <div className="mt-auto border-t border-border/60 p-8">
              {!isDrafting && !isDelegating ? (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="flex h-[84px] flex-col gap-1.5 rounded-[2.5rem] bg-primary text-white shadow-xl shadow-primary/20 hover:bg-primary/90"
                    onClick={() => setIsDrafting(true)}
                  >
                    <Reply className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Respond</span>
                  </Button>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex h-[84px] flex-col gap-1.5 rounded-[2.5rem] border-border bg-card text-muted-foreground hover:bg-muted/10">
                        <Clock className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Later</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="w-48 rounded-2xl border-border bg-card p-2 shadow-2xl">
                      {/* ... same snooze options ... */}
                    </PopoverContent>
                  </Popover>

                  <Button
                    variant="outline"
                    className="flex h-[84px] flex-col gap-1.5 rounded-[2.5rem] border-border bg-card text-muted-foreground hover:bg-muted/10"
                    onClick={() => setIsDelegating(true)}
                  >
                    <Users className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Delegate</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex h-[84px] flex-col gap-1.5 rounded-[2.5rem] border-danger/20 bg-card text-danger hover:bg-danger/5"
                    onClick={() => handleAction('Archived', 'archive')}
                  >
                    <Archive className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Archive</span>
                  </Button>
                </div>
              ) : (
                /* ... drafting/delegating states (keep your existing logic here) ... */
                <Button onClick={() => setIsDrafting(false)} className="w-full h-14 rounded-3xl">Back</Button>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}