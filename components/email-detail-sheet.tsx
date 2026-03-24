'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
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

export function EmailDetailSheet({
  email, open, onOpenChange, onArchive, onSent, onSnooze, onCancelSnooze, isDrafting, setIsDrafting,
}: EmailDetailSheetProps) {
  const [mode, setMode] = useState<Mode>('default')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showFullEmail, setShowFullEmail] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [successAction, setSuccessAction] = useState<string | null>(null)

  const { signOff: globalSignOff } = useUserStore()
  const { firstName: globalFirstName } = useUser()  

  useEffect(() => {
    if (open && email) {
      setIsAnalyzing(true)
      setShowFullEmail(email.status === 'sent' || email.isSent)
      setMode('default')
      setIsDrafting(false)
      setReplyText('')
      setSuccessAction(null)
      const timer = setTimeout(() => setIsAnalyzing(false), 450)
      return () => clearTimeout(timer)
    }
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
  
    const cleanedSource = originalMessageText
      .replace(/\s+/g, ' ')
      .trim()
  
    const sourceSentences = cleanedSource
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .slice(0, 3)
  
    if (!cleanedSource) return existingSummary
  
    const sourceWordCount = cleanedSource.split(/\s+/).filter(Boolean).length
    const summaryWordCount = existingSummary
      .join(' ')
      .split(/\s+/)
      .filter(Boolean).length
  
    if (existingSummary.length === 0) return sourceSentences
    if (sourceWordCount > 0 && summaryWordCount > sourceWordCount) return sourceSentences
  
    return existingSummary
  }, [email, originalMessageText, globalFirstName])

  const generatedDraft = useMemo(() => {
    if (!email) return ''
    const senderFirstName = email.sender.name.split(' ')[0]
    const lines = intelligenceSummary
    const signature = `\n\n${globalSignOff},\n${globalFirstName}`
    if (lines.length === 0) return `Hi ${senderFirstName},\n\nThanks for your email.${signature}`
    return `Hi ${senderFirstName},\n\nI understand that ${lines[0].toLowerCase()}\n\nI’ll take care of it.${signature}`
  }, [email, intelligenceSummary, globalFirstName, globalSignOff])

  const handleUseAIDraft = () => {
    setMode('reply')
    setIsDrafting(true)
    setIsGenerating(true)
    setReplyText('')
    setTimeout(() => {
      setReplyText(generatedDraft)
      setIsGenerating(false)
    }, 1500)
  }

  if (!email) return null

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
  const isHighUrgency = email.urgency?.label === 'High'
  const priorityLabel = isHighUrgency ? 'Critical' : 'Priority'
  const priorityClass = isHighUrgency
    ? 'border-[#F6B3C4] bg-[#F6B3C4]/15 text-[#D95D5D]'
    : 'border-[#A8A29A] bg-[#A8A29A]/10 text-[#5D5D5D]'

  return (
    <Sheet open={open} onOpenChange={(val) => { if (!val) { setMode('default'); onOpenChange(false) } }}>
      <SheetContent
        side="right"
        className="w-[520px] max-w-[95vw] border-l-2 border-[#A8D0D0] bg-[#F4F7F7] p-0 shadow-2xl outline-none"
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Header Section */}
          <div className="shrink-0 border-b-2 border-[#A8D0D0]/20 px-10 pb-8 pt-10 bg-white">
            <div className="mb-6 flex gap-3">
              {isSent ? (
                <div className="rounded-full border-2 border-[#7FC6DA] bg-[#7FC6DA]/15 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7FC6DA] flex items-center shadow-sm">
                  <Send className="mr-1.5 h-3.5 w-3.5" /> Sent Message
                </div>
              ) : isSnoozed ? (
                <div className="rounded-full border-2 border-[#F6B3C4] bg-[#F6B3C4]/15 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#D95D5D] flex items-center shadow-sm">
                  <Clock className="mr-1.5 h-3.5 w-3.5" /> Snoozed Until {new Date(Number(email.snoozedUntil)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              ) : (
                <>
                  <div className={cn('rounded-full border-2 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] flex items-center shadow-sm', priorityClass)}>
                    <AlertCircle className="mr-1.5 h-3.5 w-3.5" />
                    {priorityLabel}
                  </div>
                  <div className="rounded-full border-2 border-[#7FC6DA] bg-[#7FC6DA]/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7FC6DA] shadow-sm">AI Scanned</div>
                </>
              )}
            </div>
            <h2 className="text-[28px] font-black leading-tight tracking-tight text-[#2D3436]">{email.subject}</h2>
            <div className="mt-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
              <span className="text-[#8C867E]">{isSent ? 'To:' : 'Sender:'}</span>
              <span className="text-[#7FC6DA] font-bold">{email.sender.name}</span>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="scrollbar-hide flex-1 overflow-y-auto px-10 py-8">
            {isAnalyzing ? (
              <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#7FC6DA]" /></div>
            ) : mode === 'reply' ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="rounded-[2rem] border-2 border-[#A8D0D0] bg-white p-8 shadow-sm min-h-[320px] flex flex-col">
                  <div className="mb-4 flex items-center gap-2 text-[#7FC6DA] font-black uppercase text-[9px] tracking-widest">
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
                      className="flex-1 border-none bg-transparent p-0 text-[15px] font-medium leading-relaxed text-[#2D3436] focus-visible:ring-0 resize-none"
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
                    <div className="mb-4 text-[#7FC6DA] font-black uppercase text-[9px] tracking-widest flex items-center gap-2">
                      <Check className="h-3 w-3" /> Your Response
                    </div>
                    <p className="text-[15px] font-medium leading-relaxed text-[#2D3436] whitespace-pre-wrap">
                      {email.replyBody || `Hi ${email.sender.name.split(' ')[0]},\n\nI've processed this request.\n\nBest,\n${globalFirstName}`}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-[2.5rem] border-2 border-[#A8D0D0] bg-white p-8 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#7FC6DA] font-black uppercase text-[9px] tracking-widest">
                        <Zap className="h-3.5 w-3.5 fill-[#7FC6DA]" /> Intelligence Report
                      </div>
                      <Button variant="outline" className="h-8 rounded-lg border-2 border-[#7FC6DA] text-[9px] font-black uppercase tracking-widest text-[#7FC6DA]" onClick={handleUseAIDraft}>
                        Use AI Draft
                      </Button>
                    </div>
                    <ul className="space-y-4">
                      {intelligenceSummary.map((point, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="mt-1 text-[10px] font-black text-[#F6B3C4]">0{i + 1}</span>
                          <p className="text-[15px] font-bold leading-snug text-[#2D3436]">{point}</p>
                        </li>
                      ))}
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
                    {showFullEmail ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {showFullEmail && (
                    <div className="mt-3 rounded-[1.5rem] border-2 border-[#A8D0D0]/20 bg-white/80 p-6 text-[14px] font-medium leading-relaxed text-[#5D5D5D] italic whitespace-pre-wrap">
                      {originalMessageText}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {!isSent && (
            <div className="shrink-0 border-t-2 border-[#A8D0D0]/30 bg-white p-8">
              {mode === 'default' ? (
                <div className="grid grid-cols-2 gap-4">
                  <Button className="h-24 rounded-[2rem] bg-[#2D3436] text-white shadow-xl hover:bg-[#7FC6DA] transition-all" onClick={() => { setReplyText(''); setMode('reply'); setIsDrafting(true) }}>
                    <div className="flex flex-col items-center gap-2">
                      <Reply className="h-5 w-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Respond</span>
                    </div>
                  </Button>

                  {isSnoozed ? (
                    <Button variant="outline" className="h-24 rounded-[2rem] border-2 border-[#7FC6DA] bg-[#7FC6DA]/5 text-[#7FC6DA] hover:bg-[#7FC6DA] hover:text-white transition-all shadow-sm" onClick={() => triggerSuccess('unsnooze', () => onCancelSnooze?.(email.id))}>
                      <div className="flex flex-col items-center gap-2">
                        <Undo2 className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Move to Inbox</span>
                      </div>
                    </Button>
                  ) : (
                    <Popover modal={false}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-24 rounded-[2rem] border-2 border-[#A8D0D0] bg-[#F4F7F7] text-[#2D3436] hover:border-[#7FC6DA] shadow-sm">
                          <div className="flex flex-col items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Later</span>
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="top" align="center" className="w-48 rounded-2xl p-2 bg-white border-2 border-[#A8D0D0] shadow-2xl z-[300]">
                        {[1, 3, 24].map(h => (
                          <Button key={h} variant="ghost" className="w-full justify-start font-black uppercase text-[10px] tracking-widest text-[#2D3436] hover:bg-[#7FC6DA]/10 hover:text-[#7FC6DA]" onClick={() => triggerSuccess('later', () => onSnooze(email.id, h))}>
                            {h === 24 ? 'Tomorrow' : `${h} Hours`}
                          </Button>
                        ))}
                      </PopoverContent>
                    </Popover>
                  )}

                  <Popover modal={false}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-16 rounded-2xl border-2 border-[#A8D0D0] bg-[#F4F7F7] text-[#2D3436] uppercase text-[11px] font-black tracking-widest hover:border-[#7FC6DA] shadow-sm">
                        Delegate
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="w-56 rounded-2xl p-2 bg-white border-2 border-[#A8D0D0] shadow-2xl z-[300]">
                      <div className="px-3 py-2 text-[9px] font-black uppercase tracking-tighter text-[#8C867E] border-b-2 border-[#F4F7F7] mb-1 text-center">Assign To</div>
                      {['Operations Team', 'Priyanka (Sales)', 'Engineering'].map((team) => (
                        <Button
                          key={team}
                          variant="ghost"
                          className="w-full justify-start font-black uppercase text-[10px] tracking-widest text-[#7FC6DA] hover:bg-[#7FC6DA]/10"
                          onClick={() => triggerSuccess('delegate', () => onSent(email.id))}
                        >
                          {team}
                        </Button>
                      ))}
                    </PopoverContent>
                  </Popover>

                  <Button variant="outline" className="h-16 rounded-2xl border-2 border-[#F6B3C4] text-[#D95D5D] bg-[#F6B3C4]/15 uppercase text-[11px] font-black tracking-widest hover:bg-[#F6B3C4] hover:text-white transition-all shadow-sm" onClick={() => triggerSuccess('archive', () => onArchive(email.id))}>
                    {successAction === 'archive' ? <Check className="h-5 w-5 animate-in zoom-in" /> : 'Archive'}
                  </Button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Button variant="outline" className="h-16 flex-1 rounded-2xl border-2 border-[#A8A29A] text-[#5D5D5D] font-black uppercase tracking-widest" onClick={() => { setMode('default'); setIsDrafting(false) }}>Cancel</Button>
                  <Button className="h-16 flex-[1.5] rounded-2xl bg-[#7FC6DA] text-white font-black uppercase tracking-widest hover:shadow-lg transition-all" onClick={() => triggerSuccess('send', () => onSent(email.id))}>
                    {successAction === 'send' ? <Check className="h-5 w-5 animate-in zoom-in" /> : 'Send Message'}
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