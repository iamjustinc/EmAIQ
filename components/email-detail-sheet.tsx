'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Reply,
  Clock,
  Zap,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Check,
  Send,
  Undo2,
} from 'lucide-react'
import { Email } from '@/lib/types'
import { useUserStore } from '@/store/use-user-store'
import { useUser } from '@/lib/user-context'
import { cn } from '@/lib/utils'

interface EmailDetailSheetProps {
  email: Email | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onArchive: (id: string) => void
  onSent: (id: string) => void
  onSnooze: (id: string, hours: number) => void
  onCancelSnooze?: (id: string) => void
  isDrafting: boolean
  setIsDrafting: (val: boolean) => void
}

type Mode = 'default' | 'reply'

type EmailAnalysis = {
  priority: 'low' | 'medium' | 'high' | 'critical'
  summary: string[]
  recommendedAction: 'respond' | 'review_later' | 'delegate' | 'archive'
  draftReply: string
}

export function EmailDetailSheet({
  email,
  open,
  onOpenChange,
  onArchive,
  onSent,
  onSnooze,
  onCancelSnooze,
  isDrafting,
  setIsDrafting,
}: EmailDetailSheetProps) {
  const [mode, setMode] = useState<Mode>('default')
  const [analysis, setAnalysis] = useState<EmailAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showFullEmail, setShowFullEmail] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [successAction, setSuccessAction] = useState<string | null>(null)

  const { signOff: globalSignOff } = useUserStore()
  const { firstName: globalFirstName } = useUser()

  useEffect(() => {
    if (!open || !email) return

    const runAnalysis = async () => {
      setIsAnalyzing(true)
      setAnalysis(null)
      setShowFullEmail(email.status === 'sent' || email.isSent)
      setMode('default')
      setIsDrafting(false)
      setReplyText('')
      setSuccessAction(null)

      try {
        const res = await fetch('/api/analyze-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: {
              subject: email.subject,
              fromName: email.sender.name,
              body: email.body || email.bodyPreview || '',
            },
          }),
        })

        const data = await res.json()
        console.log('analyze-email response:', data)

        if (!res.ok) {
          throw new Error(data?.error || 'Failed to analyze email')
        }

        setAnalysis(data)
      } catch (err) {
        console.error('LLM error:', err)
      } finally {
        setIsAnalyzing(false)
      }
    }

    runAnalysis()
  }, [open, email, setIsDrafting])

  const originalMessageText = useMemo(() => {
    if (!email) return ''
    const body = typeof email.body === 'string' ? email.body.trim() : ''
    const preview = typeof email.bodyPreview === 'string' ? email.bodyPreview.trim() : ''
    const source = body || preview
    return source.replace(/\bAlex\b/g, globalFirstName || 'Example')
  }, [email, globalFirstName])

  const intelligenceSummary = useMemo(() => {
    if (!email) return []

    const existingSummary = (email.analysis?.summary ?? []).map((line) =>
      line.replace(/\bAlex\b/g, globalFirstName || 'Example')
    )

    const cleanedSource = originalMessageText.replace(/\s+/g, ' ').trim()

    const sourceSentences = cleanedSource
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .slice(0, 3)

    if (!cleanedSource) return existingSummary

    const sourceWordCount = cleanedSource.split(/\s+/).filter(Boolean).length
    const summaryWordCount = existingSummary.join(' ').split(/\s+/).filter(Boolean).length

    if (existingSummary.length === 0) return sourceSentences
    if (sourceWordCount > 0 && summaryWordCount > sourceWordCount) return sourceSentences

    return existingSummary
  }, [email, originalMessageText, globalFirstName])

  const generatedDraft = useMemo(() => {
    if (!email) return ''
    const senderFirstName = email.sender.name.split(' ')[0]
    const lines = intelligenceSummary
    const signature = `\n\n${globalSignOff},\n${globalFirstName}`

    if (lines.length === 0) {
      return `Hi ${senderFirstName},\n\nThanks for your email.${signature}`
    }

    return `Hi ${senderFirstName},\n\nI understand that ${lines[0].toLowerCase()}\n\nI’ll take care of it.${signature}`
  }, [email, intelligenceSummary, globalFirstName, globalSignOff])

  const handleUseAIDraft = () => {
    setMode('reply')
    setIsDrafting(true)
    setIsGenerating(true)
    setReplyText('')

    setTimeout(() => {
      if (analysis?.draftReply) {
        setReplyText(analysis.draftReply)
      } else {
        setReplyText(generatedDraft)
      }
      setIsGenerating(false)
    }, 800)
  }

  if (!email) return null

  const handleSendMessage = async () => {
    if (!email) return
  
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email.sender.email,
          subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
          body: replyText || analysis?.draftReply || generatedDraft,
        }),
      })
  
      const data = await res.json()
  
      if (!res.ok) {
        throw new Error(
          data?.details?.message ||
          data?.error ||
          'Failed to send email'
        )
      }
  
      triggerSuccess('send', () => onSent(email.id))
    } catch (err) {
      console.error('Send email error:', err)
      alert(err instanceof Error ? err.message : 'Failed to send email')
    }
  }

  const triggerSuccess = (actionType: string, callback: () => void) => {
    setSuccessAction(actionType)
    setTimeout(() => {
      callback()
      setSuccessAction(null)
      setMode('default')
      setIsDrafting(false)
      onOpenChange(false)
    }, 600)
  }

  const isSent = email.status === 'sent' || email.isSent
  const isSnoozed = email.snoozedUntil && Number(email.snoozedUntil) > Date.now()

  const priority: EmailAnalysis['priority'] =
    analysis?.priority ?? (email.urgency?.label === 'High' ? 'critical' : 'medium')

  const recommended = analysis?.recommendedAction

  const priorityLabel =
    priority === 'critical'
      ? 'Critical'
      : priority === 'high'
      ? 'High Priority'
      : priority === 'medium'
      ? 'Priority'
      : 'Low'

  const priorityClass =
    priority === 'critical'
      ? 'border-[#F6B3C4] bg-[#F6B3C4]/15 text-[#D95D5D]'
      : priority === 'high'
      ? 'border-[#F6B3C4]/60 bg-[#F6B3C4]/10 text-[#D95D5D]'
      : 'border-[#A8A29A] bg-[#A8A29A]/10 text-[#5D5D5D]'

  return (
    <Sheet
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          setMode('default')
          onOpenChange(false)
        }
      }}
    >
      <SheetContent
        side="right"
        className="w-full max-w-full border-l-2 border-[#A8D0D0] bg-[#F4F7F7] p-0 shadow-2xl outline-none sm:max-w-[92vw] md:w-[520px] md:max-w-[95vw]"
      >
        <SheetTitle className="sr-only">
          {email ? `Email details for ${email.subject}` : 'Email details'}
        </SheetTitle>

        <div className="flex h-full flex-col overflow-hidden">
          <div className="shrink-0 border-b-2 border-[#A8D0D0]/20 bg-white px-4 pb-6 pt-6 sm:px-6 sm:pb-7 sm:pt-7 md:px-10 md:pb-8 md:pt-10">
            <div className="mb-6 flex gap-3">
              {isSent ? (
                <div className="flex items-center rounded-full border-2 border-[#7FC6DA] bg-[#7FC6DA]/15 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7FC6DA] shadow-sm">
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  Sent Message
                </div>
              ) : isSnoozed ? (
                <div className="flex items-center rounded-full border-2 border-[#F6B3C4] bg-[#F6B3C4]/15 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#D95D5D] shadow-sm">
                  <Clock className="mr-1.5 h-3.5 w-3.5" />
                  Snoozed Until{' '}
                  {new Date(Number(email.snoozedUntil)).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              ) : (
                <>
                  <div
                    className={cn(
                      'flex items-center rounded-full border-2 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm',
                      priorityClass
                    )}
                  >
                    <AlertCircle className="mr-1.5 h-3.5 w-3.5" />
                    {priorityLabel}
                  </div>
                  <div className="rounded-full border-2 border-[#7FC6DA] bg-[#7FC6DA]/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7FC6DA] shadow-sm">
                    {isAnalyzing ? 'Analyzing...' : 'AI Insights'}
                  </div>
                </>
              )}
            </div>

            <h2 className="text-[28px] font-black leading-tight tracking-tight text-[#2D3436]">
              {email.subject}
            </h2>

            <div className="mt-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
              <span className="text-[#8C867E]">{isSent ? 'To:' : 'Sender:'}</span>
              <span className="font-bold text-[#7FC6DA]">{email.sender.name}</span>
            </div>
          </div>

          <div className="scrollbar-hide flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 md:px-10 md:py-8">
            {isAnalyzing ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#7FC6DA]" />
              </div>
            ) : mode === 'reply' ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
                <div className="flex min-h-[320px] flex-col rounded-[2rem] border-2 border-[#A8D0D0] bg-white p-8 shadow-sm">
                  <div className="mb-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#7FC6DA]">
                    <Reply className="h-3.5 w-3.5" />
                    {isGenerating ? 'AI Intelligence is drafting...' : 'Drafting Response'}
                  </div>

                  {isGenerating ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 animate-pulse">
                      <Loader2 className="h-6 w-6 animate-spin text-[#7FC6DA]/60" />
                    </div>
                  ) : (
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 resize-none border-none bg-transparent p-0 text-[15px] font-medium leading-relaxed text-[#2D3436] focus-visible:ring-0"
                      placeholder="Type your message..."
                      autoFocus
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {isSent ? (
                  <div className="rounded-[2.5rem] border-2 border-[#7FC6DA]/30 bg-white p-8 shadow-sm">
                    <div className="mb-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#7FC6DA]">
                      <Check className="h-3 w-3" />
                      Your Response
                    </div>
                    <p className="whitespace-pre-wrap text-[15px] font-medium leading-relaxed text-[#2D3436]">
                      {email.replyBody ||
                        `Hi ${email.sender.name.split(' ')[0]},\n\nI've processed this request.\n\nBest,\n${globalFirstName}`}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-[2.5rem] border-2 border-[#A8D0D0] bg-white p-8 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#7FC6DA]">
                        <Zap className="h-3.5 w-3.5 fill-[#7FC6DA]" />
                        Intelligence Report
                      </div>
                      <Button
                        variant="outline"
                        className="h-8 rounded-lg border-2 border-[#7FC6DA] text-[9px] font-black uppercase tracking-widest text-[#7FC6DA]"
                        onClick={handleUseAIDraft}
                      >
                        Use AI Draft
                      </Button>
                    </div>

                    <ul className="space-y-4">
                      {(analysis?.summary?.length ? analysis.summary : intelligenceSummary).map(
                        (point, i) => (
                          <li key={i} className="flex gap-4">
                            <span className="mt-1 text-[10px] font-black text-[#F6B3C4]">
                              0{i + 1}
                            </span>
                            <p className="text-[15px] font-bold leading-snug text-[#2D3436]">
                              {point}
                            </p>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowFullEmail(!showFullEmail)}
                    className="flex w-full items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#8C867E] hover:text-[#7FC6DA]"
                  >
                    <span>{isSent ? 'Thread History' : 'Original Message'}</span>
                    {showFullEmail ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {showFullEmail && (
                    <div className="mt-3 whitespace-pre-wrap rounded-[1.5rem] border-2 border-[#A8D0D0]/20 bg-white/80 p-6 text-[14px] font-medium leading-relaxed text-[#5D5D5D] italic">
                      {originalMessageText}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {!isSent && (
            <div className="shrink-0 border-t-2 border-[#A8D0D0]/30 bg-white p-4 sm:p-6 md:p-8">
              {mode === 'default' ? (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className={cn(
                      'h-24 rounded-[2rem] shadow-xl transition-all',
                      recommended === 'respond'
                        ? 'bg-[#7FC6DA] text-white scale-[1.02]'
                        : 'bg-[#2D3436] text-white hover:bg-[#7FC6DA]'
                    )}
                    onClick={() => {
                      setReplyText('')
                      setMode('reply')
                      setIsDrafting(true)
                    }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Reply className="h-5 w-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Respond
                      </span>
                    </div>
                  </Button>

                  {isSnoozed ? (
                    <Button
                      variant="outline"
                      className="h-24 rounded-[2rem] border-2 border-[#7FC6DA] bg-[#7FC6DA]/5 text-[#7FC6DA] shadow-sm transition-all hover:bg-[#7FC6DA] hover:text-white"
                      onClick={() =>
                        triggerSuccess('unsnooze', () => onCancelSnooze?.(email.id))
                      }
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Undo2 className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Move to Inbox
                        </span>
                      </div>
                    </Button>
                  ) : (
                    <Popover modal={false}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'h-24 rounded-[2rem] border-2 bg-[#F4F7F7] text-[#2D3436] shadow-sm',
                            recommended === 'review_later'
                              ? 'border-[#7FC6DA] bg-[#7FC6DA]/15 text-[#7FC6DA]'
                              : 'border-[#A8D0D0] hover:border-[#7FC6DA]'
                          )}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              Later
                            </span>
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="top"
                        align="center"
                        className="z-[300] w-48 rounded-2xl border-2 border-[#A8D0D0] bg-white p-2 shadow-2xl"
                      >
                        {[1, 3, 24].map((h) => (
                          <Button
                            key={h}
                            variant="ghost"
                            className="w-full justify-start text-[10px] font-black uppercase tracking-widest text-[#2D3436] hover:bg-[#7FC6DA]/10 hover:text-[#7FC6DA]"
                            onClick={() => triggerSuccess('later', () => onSnooze(email.id, h))}
                          >
                            {h === 24 ? 'Tomorrow' : `${h} Hours`}
                          </Button>
                        ))}
                      </PopoverContent>
                    </Popover>
                  )}

                  <Popover modal={false}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'h-16 rounded-2xl border-2 bg-[#F4F7F7] text-[11px] font-black uppercase tracking-widest shadow-sm',
                          recommended === 'delegate'
                            ? 'border-[#7FC6DA] bg-[#7FC6DA]/15 text-[#7FC6DA]'
                            : 'border-[#A8D0D0] text-[#2D3436] hover:border-[#7FC6DA]'
                        )}
                      >
                        Delegate
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="top"
                      className="z-[300] w-56 rounded-2xl border-2 border-[#A8D0D0] bg-white p-2 shadow-2xl"
                    >
                      <div className="mb-1 border-b-2 border-[#F4F7F7] px-3 py-2 text-center text-[9px] font-black uppercase tracking-tighter text-[#8C867E]">
                        Assign To
                      </div>
                      {['Operations Team', 'Priyanka (Sales)', 'Engineering'].map((team) => (
                        <Button
                          key={team}
                          variant="ghost"
                          className="w-full justify-start text-[10px] font-black uppercase tracking-widest text-[#7FC6DA] hover:bg-[#7FC6DA]/10"
                          onClick={() => triggerSuccess('delegate', () => onSent(email.id))}
                        >
                          {team}
                        </Button>
                      ))}
                    </PopoverContent>
                  </Popover>

                  <Button
                    variant="outline"
                    className={cn(
                      'h-16 rounded-2xl border-2 text-[11px] font-black uppercase tracking-widest shadow-sm transition-all',
                      recommended === 'archive'
                        ? 'border-[#F6B3C4] bg-[#F6B3C4]/30 text-[#D95D5D]'
                        : 'border-[#F6B3C4] bg-[#F6B3C4]/15 text-[#D95D5D] hover:bg-[#F6B3C4] hover:text-white'
                    )}
                    onClick={() => triggerSuccess('archive', () => onArchive(email.id))}
                  >
                    {successAction === 'archive' ? (
                      <Check className="h-5 w-5 animate-in zoom-in" />
                    ) : (
                      'Archive'
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="h-16 flex-1 rounded-2xl border-2 border-[#A8A29A] font-black uppercase tracking-widest text-[#5D5D5D]"
                    onClick={() => {
                      setMode('default')
                      setIsDrafting(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
  className="h-16 flex-[1.5] rounded-2xl bg-[#7FC6DA] font-black uppercase tracking-widest text-white transition-all hover:shadow-lg"
  onClick={handleSendMessage}
>
  {successAction === 'send' ? (
    <Check className="h-5 w-5 animate-in zoom-in" />
  ) : (
    'Send Message'
  )}
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