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
  Zap,
  AlertCircle,
  Loader2,
  ChevronDown,
  X
} from 'lucide-react'

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
  const [isDelegating, setIsDelegating] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showFullEmail, setShowFullEmail] = useState(false)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    if (open && email) {
      setIsAnalyzing(true)
      const timer = setTimeout(() => setIsAnalyzing(false), 800)
      return () => clearTimeout(timer)
    }
  }, [open, email])

  const handleAction = (type: 'archive' | 'sent' | 'snooze', value?: number) => {
    if (!email) return
    if (type === 'archive') onArchive(email.id)
    if (type === 'sent') onSent(email.id)
    if (type === 'snooze' && value) onSnooze(email.id, value)
    onOpenChange(false)
  }

  if (!email) return null

  return (
    <Sheet open={open} onOpenChange={(val) => {
      onOpenChange(val)
      if (!val) { setIsDrafting(false); setIsDelegating(false); }
    }}>
      <SheetOverlay className="bg-black/10 backdrop-blur-[1px] z-[399]" />
      
      <SheetContent
        side="right"
        className="z-[400] flex h-full w-[480px] max-w-[95vw] flex-col border-l border-border p-0 shadow-2xl bg-sheet-solid pointer-events-auto outline-none"
      >
        <div className="flex h-full flex-col overflow-hidden">
          
          {/* Header */}
          <div className="shrink-0 p-8 pb-4">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="rounded-full border border-danger/20 bg-danger/5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-danger">
                  <AlertCircle className="mr-1 h-3 w-3 inline" />
                  {email.urgency?.label === 'High' ? 'Critical' : 'Priority'}
                </div>
                <div className="rounded-full border border-border bg-white px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  AI Scanned
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-lg border border-border bg-white text-muted-foreground"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <h2 className="text-[26px] font-bold leading-tight tracking-tight text-foreground">
              {email.subject}
            </h2>

            <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="text-muted-foreground">From:</span>
              <span className="text-primary">{email.sender.name}</span>
            </div>
          </div>

          {/* Content */}
          <div className="scrollbar-hide flex-1 space-y-8 overflow-y-auto px-8 py-4">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
              </div>
            ) : (
              <>
                <div className="rounded-[2.5rem] border border-border bg-white p-8 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Zap className="h-4 w-4 fill-primary text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
                        Intelligence Report
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      className="h-9 rounded-2xl bg-primary/10 px-4 text-[9px] font-black uppercase tracking-widest text-primary"
                    >
                      <Zap className="mr-1 h-3 w-3 fill-primary" />
                      Use Draft
                    </Button>
                  </div>

                  <ul className="space-y-5">
                    {email.analysis?.summary?.map((point, i) => (
                      <li key={i} className="flex gap-5">
                        <span className="mt-0.5 text-[10px] font-black text-primary">0{i + 1}</span>
                        <p className="text-[14px] leading-relaxed text-foreground/80 font-medium italic">
                          {point}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border/60 pt-6">
                  <button
                    onClick={() => setShowFullEmail(!showFullEmail)}
                    className="flex w-full items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                  >
                    <span>Original Thread</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showFullEmail ? 'rotate-180' : ''}`} />
                  </button>
                  {showFullEmail && (
                    <div className="mt-4 text-[13px] leading-relaxed text-muted-foreground/80">
                      {email.body || email.bodyPreview}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Action Grid */}
          {!isAnalyzing && (
            <div className="shrink-0 border-t border-border/60 p-8 bg-[#f7f1eb] z-50">
              {!isDrafting && !isDelegating ? (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="flex h-24 flex-col gap-1.5 rounded-[2rem] bg-primary text-white shadow-action hover:bg-primary/90 transition-all active:scale-[0.96]"
                    onClick={(e) => { e.stopPropagation(); setIsDrafting(true); }}
                  >
                    <Reply className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Respond</span>
                  </Button>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex h-24 flex-col gap-1.5 rounded-[2rem] border-border bg-white text-muted-foreground shadow-action hover:bg-muted/5 active:scale-[0.96]">
                        <Clock className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Later</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="z-[600] w-48 rounded-2xl border-border bg-white p-2 shadow-2xl">
                       <Button variant="ghost" className="w-full justify-start text-[10px] font-bold" onClick={() => handleAction('snooze', 24)}>Tomorrow</Button>
                    </PopoverContent>
                  </Popover>

                  <Button
                    variant="outline"
                    className="flex h-24 flex-col gap-1.5 rounded-[2rem] border-border bg-white text-muted-foreground shadow-action active:scale-[0.96]"
                    onClick={(e) => { e.stopPropagation(); setIsDelegating(true); }}
                  >
                    <Users className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Delegate</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex h-24 flex-col gap-1.5 rounded-[2rem] border-danger/20 bg-white text-danger hover:bg-danger/5 shadow-action active:scale-[0.96]"
                    onClick={(e) => { e.stopPropagation(); handleAction('archive'); }}
                  >
                    <Archive className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Archive</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <Textarea 
                    className="min-h-[150px] rounded-3xl border-border bg-white focus-visible:ring-primary p-6 text-sm" 
                    placeholder="Type your response..." 
                    value={replyText} 
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-2xl h-12 font-bold text-[10px] uppercase tracking-widest" onClick={() => {setIsDrafting(false); setIsDelegating(false);}}>Cancel</Button>
                    <Button className="flex-[2] rounded-2xl h-12 bg-primary text-white font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20" onClick={() => handleAction('sent')}>Send Response</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}