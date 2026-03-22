'use client'

import React, { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetOverlay } from '@/components/ui/sheet'
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

  const handleUseDraft = async () => {
    setIsGeneratingDraft(true)
    setIsDrafting(false)
    await new Promise((res) => setTimeout(res, 1200))

    const draft = email.analysis?.summary?.[0]
      ? `Hi ${email.sender.name.split(' ')[0]},

Regarding the ${email.subject.toLowerCase()}, ${email.analysis.summary[0]}. I'll handle this immediately.`
      : `Hi ${email.sender.name.split(' ')[0]},

Thanks for reaching out. I've received your email regarding "${email.subject}" and will get back to you shortly.`

    setReplyText(draft)
    setIsGeneratingDraft(false)
    setIsDrafting(true)
  }

  const handleAction = async (
    msg: string,
    type: 'archive' | 'sent' | 'snooze',
    hours?: number,
  ) => {
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
    <Sheet
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) {
          setIsDrafting(false)
          setIsDelegating(false)
        }
      }}
    >
      <SheetOverlay className="bg-black/20 backdrop-blur-[1px]" />

      <SheetContent
        side="right"
        className="z-[80] flex h-full w-[460px] max-w-[95vw] flex-col overflow-hidden border-l border-border bg-card p-0 text-card-foreground shadow-2xl"
      >
        <div className="relative flex h-full flex-col bg-card">
          <div className="relative border-b border-border bg-card p-panel pb-6">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 rounded-full border border-destructive/25 bg-destructive/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {email.urgency.label === 'High' ? 'Critical' : 'Priority'}
                </div>
                <div className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-primary">
                  AI Scanned
                </div>
              </div>
            </div>

            <h2 className="pr-10 text-2xl font-bold leading-tight tracking-tight text-foreground">
              {email.subject}
            </h2>

            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              From:
              <span className="ml-2 text-primary">{email.sender.name}</span>
            </p>
          </div>

          <div className="scrollbar-hide flex-1 space-y-8 overflow-y-auto bg-card p-panel pt-6">
            {sentSuccess ? (
              <div className="animate-in zoom-in flex flex-col items-center justify-center py-20 duration-300">
                <CheckCircle2 className="mb-4 h-12 w-12 text-success" />
                <h3 className="text-lg font-bold uppercase tracking-widest text-foreground">
                  {successMessage}
                </h3>
              </div>
            ) : isAnalyzing ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary">
                  Parsing Context...
                </p>
              </div>
            ) : isGeneratingDraft ? (
              <div className="animate-pulse flex flex-col items-center justify-center space-y-6 py-20">
                <div className="relative">
                  <Zap className="h-12 w-12 animate-bounce fill-primary/20 text-primary" />
                  <Sparkles className="absolute -right-2 -top-2 h-6 w-6 text-primary" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                  Synthesizing Draft...
                </p>
              </div>
            ) : (
              <>
                <div className="relative space-y-5 rounded-3xl border border-border bg-muted/30 p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 fill-primary text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                        Intelligence Report
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleUseDraft}
                      className="h-7 border border-primary/25 bg-primary/10 px-3 text-[9px] font-bold uppercase text-primary hover:bg-primary/20"
                    >
                      <Zap className="mr-1.5 h-3 w-3 fill-primary" />
                      Use Draft
                    </Button>
                  </div>

                  <ul className="space-y-4">
                    {email.analysis?.summary?.map((point, i) => (
                      <li key={i} className="group flex gap-4">
                        <span className="mt-1 text-[10px] font-black tracking-tighter text-primary">
                          0{i + 1}
                        </span>
                        <p className="text-[13px] leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground">
                          {point}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border pt-6">
                  <button
                    type="button"
                    onClick={() => setShowFullEmail(!showFullEmail)}
                    className="flex w-full items-center justify-between text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Original Thread
                    </span>
                    {showFullEmail ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {showFullEmail && (
                    <div className="mt-4 rounded-xl border border-border bg-muted/20 p-4 text-[13px] leading-relaxed text-muted-foreground">
                      {email.body || email.bodyPreview}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {!sentSuccess && !isAnalyzing && !isGeneratingDraft && (
            <div className="mt-auto border-t border-border bg-card p-panel">
              {!isDrafting && !isDelegating ? (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="flex h-20 flex-col gap-1 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setIsDrafting(true)}
                  >
                    <Reply className="h-4 w-4" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">
                      Respond
                    </span>
                  </Button>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex h-20 flex-col gap-1 rounded-2xl border-border bg-muted/40 text-muted-foreground"
                      >
                        <Clock className="h-4 w-4" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">
                          Later
                        </span>
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      side="top"
                      className="z-[110] w-48 rounded-xl border-border bg-popover p-2 shadow-2xl"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="p-2 text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                          Snooze until...
                        </p>

                        {[
                          { label: '1 Hour', v: 1 },
                          { label: '3 Hours', v: 3 },
                          { label: 'Tomorrow', v: 24 },
                        ].map((opt) => (
                          <Button
                            key={opt.label}
                            variant="ghost"
                            className="h-9 justify-start text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary"
                            onClick={() =>
                              handleAction(`Snoozed for ${opt.label}`, 'snooze', opt.v)
                            }
                          >
                            {opt.label}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Button
                    variant="outline"
                    className="flex h-20 flex-col gap-1 rounded-2xl border-border bg-muted/40 text-muted-foreground"
                    onClick={() => setIsDelegating(true)}
                  >
                    <Users className="h-4 w-4" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">
                      Delegate
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex h-20 flex-col gap-1 rounded-2xl border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10"
                    onClick={() => handleAction('Archived', 'archive')}
                  >
                    <Archive className="h-4 w-4" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">
                      Archive
                    </span>
                  </Button>
                </div>
              ) : isDrafting ? (
                <div className="animate-in slide-in-from-bottom-4 space-y-4">
                  <Textarea
                    className="min-h-[180px] rounded-2xl border-border bg-muted/30 p-4 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Drafting response..."
                  />

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-border bg-muted/30"
                      onClick={() => setIsDrafting(false)}
                    >
                      Cancel
                    </Button>

                    <Button
                      className="flex-[2] bg-primary text-primary-foreground"
                      onClick={() => handleAction('Response Sent', 'sent')}
                    >
                      Send Message
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="animate-in slide-in-from-bottom-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {['Sarah (Ops)', 'Mike (Sales)', 'Legal Team', 'Support'].map(
                      (team) => (
                        <Button
                          key={team}
                          variant="outline"
                          className="h-12 border-border bg-muted/30 text-[10px] font-bold uppercase tracking-widest hover:border-primary/50 hover:bg-primary/10"
                          onClick={() => handleAction(`Delegated to ${team}`, 'sent')}
                        >
                          {team}
                        </Button>
                      ),
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full text-[9px] font-bold uppercase tracking-widest text-muted-foreground"
                    onClick={() => setIsDelegating(false)}
                  >
                    Back to Actions
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}