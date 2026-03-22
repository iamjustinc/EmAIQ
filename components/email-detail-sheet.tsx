'use client';

import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Email } from '@/lib/types';
import { Archive, Reply, Clock, Users, CheckCircle2, Zap, AlertCircle, Loader2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface EmailDetailSheetProps {
  email: Email | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onArchive: (emailId: string) => void;
  onSent: (emailId: string) => void; // New Prop
  onSnooze: (emailId: string, hours: number) => void;
  isDrafting: boolean;
  setIsDrafting: (isDrafting: boolean) => void;
}

export function EmailDetailSheet({ email, open, onOpenChange, onArchive, onSent, onSnooze, isDrafting, setIsDrafting }: EmailDetailSheetProps) {
  const [sentSuccess, setSentSuccess] = useState(false);
  const [isDelegating, setIsDelegating] = useState(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false); 
  const [successMessage, setSuccessMessage] = useState("Action Completed");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFullEmail, setShowFullEmail] = useState(false);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (open && email) {
      setIsAnalyzing(true);
      setShowFullEmail(false); 
      setReplyText("");
      const timer = setTimeout(() => setIsAnalyzing(false), 800);
      return () => clearTimeout(timer);
    }
  }, [open, email?.id]);

  if (!email) return null;

  const handleUseDraft = async () => {
    setIsGeneratingDraft(true);
    setIsDrafting(false);
    await new Promise(res => setTimeout(res, 1200));
    const draft = email.analysis?.summary?.[0] 
      ? `Hi ${email.sender.name.split(' ')[0]},\n\nRegarding the ${email.subject.toLowerCase()}, ${email.analysis.summary[0]}. I'll handle this immediately.`
      : `Hi ${email.sender.name.split(' ')[0]},\n\nThanks for reaching out. I've received your email regarding "${email.subject}" and will get back to you shortly.`;
    setReplyText(draft);
    setIsGeneratingDraft(false);
    setIsDrafting(true);
  };

  const handleAction = async (msg: string, type: 'archive' | 'sent' | 'snooze', hours?: number) => {
    setSuccessMessage(msg);
    await new Promise((res) => setTimeout(res, 400));
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setIsDrafting(false);
      setIsDelegating(false);
      if (type === 'snooze' && hours) onSnooze(email.id, hours);
      else if (type === 'sent') onSent(email.id);
      else onArchive(email.id);
      onOpenChange(false);
    }, 1200);
  };

  return (
    <Sheet open={open} onOpenChange={(val) => { onOpenChange(val); if(!val) { setIsDrafting(false); setIsDelegating(false); } }}>
      <SheetContent className="w-full sm:max-w-md bg-[#0F1117] text-white border-l border-white/10 p-0 flex flex-col h-full shadow-2xl overflow-hidden">
        <div className="p-8 pb-6 border-b border-white/5 relative">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[9px] font-black text-red-500 uppercase tracking-widest">
                <AlertCircle className="h-3 w-3" /> {email.priority === 'High' ? 'Critical' : 'Priority'}
              </div>
              <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-400 uppercase tracking-widest">AI Scanned</div>
            </div>
          </div>
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-100 pr-10">{email.subject}</h2>
          <p className="text-xs text-gray-500 mt-3 font-bold uppercase tracking-widest">From: <span className="text-blue-400 ml-1">{email.sender.name}</span></p>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8 scrollbar-hide">
          {sentSuccess ? (
            <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in duration-300">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-bold uppercase tracking-widest">{successMessage}</h3>
            </div>
          ) : isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-blue-500">Parsing Context...</p>
            </div>
          ) : isGeneratingDraft ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-pulse">
                <div className="relative">
                    <Zap className="h-12 w-12 text-blue-400 fill-blue-400/20 animate-bounce" />
                    <Sparkles className="h-6 w-6 text-blue-300 absolute -top-2 -right-2 animate-spin-slow" />
                </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Synthesizing Draft...</p>
            </div>
          ) : (
            <>
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-5 relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-blue-400 fill-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400">Intelligence Report</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleUseDraft} className="h-7 px-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[9px] font-bold uppercase border border-blue-500/20">
                    <Zap className="h-3 w-3 mr-1.5 fill-blue-400" /> Use Draft
                  </Button>
                </div>
                <ul className="space-y-4">
                  {email.analysis?.summary?.map((point, i) => (
                    <li key={i} className="flex gap-4 group">
                      <span className="text-blue-500 font-black text-[10px] mt-1 tracking-tighter">0{i+1}</span>
                      <p className="text-[13px] leading-relaxed text-gray-300 group-hover:text-white transition-colors">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-white/5 pt-6">
                <button onClick={() => setShowFullEmail(!showFullEmail)} className="flex items-center justify-between w-full text-gray-500 hover:text-gray-300 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Original Thread</span>
                  {showFullEmail ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {showFullEmail && <div className="mt-4 text-[13px] leading-relaxed text-gray-400 bg-white/[0.01] p-4 rounded-xl border border-white/5">{email.body || email.bodyPreview}</div>}
              </div>
            </>
          )}
        </div>

        {!sentSuccess && !isAnalyzing && !isGeneratingDraft && (
          <div className="p-8 border-t border-white/5 bg-[#0F1117] mt-auto">
            {!isDrafting && !isDelegating ? (
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-20 bg-blue-600 hover:bg-blue-500 rounded-2xl flex flex-col gap-1" onClick={() => setIsDrafting(true)}>
                  <Reply className="h-4 w-4" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Respond</span>
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-20 border-white/10 bg-white/5 rounded-2xl flex flex-col gap-1 text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Later</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="top" className="w-48 bg-[#1A1D25] border-white/10 p-2 rounded-xl shadow-2xl z-[110]">
                    <div className="flex flex-col gap-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 p-2">Snooze until...</p>
                      {[{ label: '1 Hour', v: 1 }, { label: '3 Hours', v: 3 }, { label: 'Tomorrow', v: 24 }].map((opt) => (
                        <Button key={opt.label} variant="ghost" className="justify-start h-9 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500/10 hover:text-blue-400"
                          onClick={() => handleAction(`Snoozed for ${opt.label}`, 'snooze', opt.v)}>{opt.label}</Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <Button variant="outline" className="h-20 border-white/10 bg-white/5 rounded-2xl flex flex-col gap-1 text-gray-400" onClick={() => setIsDelegating(true)}>
                  <Users className="h-4 w-4" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Delegate</span>
                </Button>
                <Button variant="outline" className="h-20 border-white/10 bg-white/5 rounded-2xl flex flex-col gap-1 text-red-400/60 hover:text-red-400" onClick={() => handleAction("Archived", 'archive')}>
                  <Archive className="h-4 w-4" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Archive</span>
                </Button>
              </div>
            ) : isDrafting ? (
              <div className="space-y-4 animate-in slide-in-from-bottom-4">
                <Textarea className="min-h-[180px] bg-white/5 border-white/10 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-white" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Drafting response..."/>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-white/10 bg-white/5" onClick={() => setIsDrafting(false)}>Cancel</Button>
                  <Button className="flex-[2] bg-blue-600" onClick={() => handleAction("Response Sent", 'sent')}>Send Message</Button>
                </div>
              </div>
            ) : (
                <div className="space-y-4 animate-in slide-in-from-bottom-4">
                   <div className="grid grid-cols-2 gap-3">
                        {['Sarah (Ops)', 'Mike (Sales)', 'Legal Team', 'Support'].map((team) => (
                            <Button key={team} variant="outline" className="h-12 border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500/10 hover:border-blue-500/50" onClick={() => handleAction(`Delegated to ${team}`, 'sent')}>
                                {team}
                            </Button>
                        ))}
                   </div>
                   <Button variant="ghost" className="w-full text-gray-500 text-[9px] font-bold uppercase tracking-widest" onClick={() => setIsDelegating(false)}>Back to Actions</Button>
                </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}