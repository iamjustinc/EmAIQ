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
import { cn } from '@/lib/utils'

interface EmailDetailSheetProps {
  email: Email | null; open: boolean; onOpenChange: (open: boolean) => void;
  onArchive: (id: string) => void; onSent: (id: string) => void;
  onSnooze: (id: string, hours: number) => void; isDrafting: boolean; setIsDrafting: (val: boolean) => void;
}

type Mode = 'default' | 'reply'

export function EmailDetailSheet({
  email, open, onOpenChange, onArchive, onSent, onSnooze, isDrafting, setIsDrafting,
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
      callback(); setSuccessAction(null); setMode('default'); setIsDrafting(false); onOpenChange(false);
    }, 800)
  }

  // AESTHETIC MAPPING
  const isHighUrgency = email.urgency?.label === 'High'
  const priorityLabel = isHighUrgency ? 'Critical' : 'Priority'
  
  // Sunset Pink for Critical, Warm Greige for Priority
  const priorityClass = isHighUrgency
    ? 'border-[#F6B3C4]/30 bg-[#F6B3C4]/10 text-[#F6B3C4]'
    : 'border-[#A8A29A]/20 bg-[#A8A29A]/5 text-[#A8A29A]'

  return (
    <Sheet open={open} onOpenChange={(val) => { if (!val) { setMode('default'); onOpenChange(false); } }}>
      <SheetContent side="right" className="w-[520px] max-w-[95vw] border-l border-[#A8D0D0]/30 bg-[#F4F7F7] p-0 shadow-2xl outline-none">
        <div className="flex h-full flex-col overflow-hidden">
          {/* Header Section */}
          <div className="shrink-0 border-b border-[#A8D0D0]/20 px-10 pb-6 pt-10 bg-white/50 backdrop-blur-sm">
            <div className="mb-6 flex gap-3">
              <div className={cn("rounded-full border px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] flex items-center", priorityClass)}>
                <AlertCircle className="mr-1.5 h-3.5 w-3.5" />
                {priorityLabel}
              </div>
              <div className="rounded-full border border-[#99BED4]/25 bg-[#99BED4]/5 px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-[#99BED4]">AI Scanned</div>
            </div>
            <h2 className="text-[28px] font-black leading-tight tracking-tight text-[#2D3436]">{email.subject}</h2>
            <div className="mt-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
              <span className="text-[#A8A29A]">Sender:</span>
              <span className="text-[#99BED4]">{email.sender.name}</span>
            </div>
          </div>

          <div className="scrollbar-hide flex-1 overflow-y-auto px-10 py-6">
            {isAnalyzing ? (
              <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#99BED4]/40" /></div>
            ) : mode === 'reply' ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="rounded-[2rem] border border-[#A8D0D0]/40 bg-white p-8 shadow-sm">
                  <div className="mb-4 flex items-center gap-2 text-[#99BED4] font-black uppercase text-[9px] tracking-widest">
                    <Reply className="h-3.5 w-3.5" /> Drafting Response
                  </div>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[250px] border-none bg-transparent p-0 text-[15px] leading-relaxed text-[#2D3436] focus-visible:ring-0 resize-none"
                    placeholder="Type your message..."
                    autoFocus
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Intelligence Report Box - Blush Beige Bg */}
                <div className="rounded-[2rem] border border-[#A8D0D0]/40 bg-[#ECD7D1]/10 p-8 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#99BED4] font-black uppercase text-[9px] tracking-widest">
                      <Zap className="h-3.5 w-3.5 fill-[#99BED4]" /> Intelligence Report
                    </div>
                    <Button variant="ghost" className="h-8 rounded-lg border border-[#99BED4]/30 bg-white px-3 text-[9px] font-black uppercase tracking-widest text-[#99BED4] hover:bg-[#99BED4] hover:text-white transition-all" onClick={() => { setReplyText(generatedDraft); setMode('reply'); setIsDrafting(true); }}>
                      Use AI Draft
                    </Button>
                  </div>
                  <ul className="space-y-4">
                    {(email.analysis?.summary ?? []).map((point, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="mt-1 text-[10px] font-black text-[#EFB3BB]">0{i + 1}</span>
                        <p className="text-[14px] font-bold leading-normal tracking-tight text-[#2D3436]/80">{point}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <button type="button" onClick={() => setShowFullEmail(!showFullEmail)} className="flex w-full items-center justify-between text-[9px] font-black uppercase tracking-widest text-[#A8A29A] hover:text-[#99BED4]">
                    <span>Original Message</span>
                    {showFullEmail ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {showFullEmail && <div className="mt-3 rounded-[1.5rem] border border-[#A8D0D0]/20 bg-white/50 p-6 text-[13px] leading-relaxed text-[#A8A29A] italic">{email.body || email.bodyPreview}</div>}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons Area */}
          <div className="shrink-0 border-t border-[#A8D0D0]/20 bg-white/80 backdrop-blur-md p-8">
            {mode === 'default' ? (
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-24 rounded-[2rem] bg-[#2D3436] text-white shadow-lg hover:bg-[#F6B3C4] transition-all duration-500" onClick={() => { setReplyText(''); setMode('reply'); setIsDrafting(true); }}>
                  <div className="flex flex-col items-center gap-2">
                    <Reply className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Respond</span>
                  </div>
                </Button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-24 rounded-[2rem] border-[#A8D0D0]/40 bg-white text-[#A8A29A] hover:border-[#99BED4]">
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Later</span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="top" align="center" className="w-48 rounded-2xl p-2 bg-white border-[#A8D0D0] shadow-2xl">
                    {[1, 3, 24].map(h => (
                      <Button key={h} variant="ghost" className="w-full justify-start font-black uppercase text-[9px] tracking-widest text-[#A8A29A]" onClick={() => triggerSuccess('later', () => onSnooze(email.id, h))}>
                        {h === 24 ? 'Tomorrow' : `${h} Hours`}
                      </Button>
                    ))}
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-14 rounded-2xl border-[#A8D0D0]/40 bg-white text-[#A8A29A] uppercase text-[10px] font-black tracking-widest hover:border-[#99BED4]">
                      Delegate
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="top" className="w-56 rounded-2xl p-2 bg-white border-[#A8D0D0] shadow-2xl">
                    <div className="px-3 py-2 text-[8px] font-black uppercase tracking-tighter text-[#A8A29A]/60 border-b border-[#A8D0D0]/20 mb-1">Assign To</div>
                    {['Operations Team', 'Priyanka (Sales)', 'Engineering'].map((team) => (
                      <Button key={team} variant="ghost" className="w-full justify-start font-black uppercase text-[9px] tracking-widest text-[#99BED4]" onClick={() => triggerSuccess('delegate', () => onSent(email.id))}>
                        {team}
                      </Button>
                    ))}
                  </PopoverContent>
                </Popover>

                <Button variant="outline" className="h-14 rounded-2xl border-[#F6B3C4]/20 text-[#F6B3C4] bg-[#F6B3C4]/5 uppercase text-[10px] font-black tracking-widest hover:bg-[#F6B3C4] hover:text-white transition-all" onClick={() => triggerSuccess('archive', () => onArchive(email.id))}>
                  {successAction === 'archive' ? <Check className="h-5 w-5 animate-in zoom-in" /> : 'Archive'}
                </Button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Button variant="outline" className="h-14 flex-1 rounded-2xl border-[#A8A29A]/20 text-[#A8A29A]" onClick={() => { setMode('default'); setIsDrafting(false); }}>Cancel</Button>
                <Button className="h-14 flex-[1.5] rounded-2xl bg-[#99BED4] text-white font-black uppercase tracking-widest hover:shadow-lg transition-all" onClick={() => triggerSuccess('send', () => onSent(email.id))}>
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