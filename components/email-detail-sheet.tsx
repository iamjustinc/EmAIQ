'use client';

import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Email } from '@/lib/types';
import { 
  Archive, Reply, Clock, Users, X, CheckCircle2, 
  Sparkles, Zap, AlertCircle, Loader2, Mail, 
  ChevronDown, ChevronUp, ChevronRight 
} from 'lucide-react';

interface EmailDetailSheetProps {
  email: Email | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onArchive: (emailId: string) => void;
  isDrafting: boolean;
  setIsDrafting: (isDrafting: boolean) => void;
}

export function EmailDetailSheet({
  email, open, onOpenChange, onArchive, isDrafting, setIsDrafting
}: EmailDetailSheetProps) {
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [isDelegating, setIsDelegating] = useState(false);
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

  const handleUseDraft = () => {
    const draft = email.analysis?.summary?.[0] 
      ? `Hi ${email.sender.name.split(' ')[0]},\n\nRegarding your note about ${email.subject.toLowerCase()}, I've reviewed the details. ${email.analysis.summary[0]} Let me know if you need anything else.`
      : `Hi ${email.sender.name.split(' ')[0]},\n\nThanks for reaching out. I'm looking into this now.`;
    setReplyText(draft);
    setIsDrafting(true);
  };

  const handleAction = async (msg: string) => {
    setIsSending(true);
    await new Promise((res) => setTimeout(res, 800));
    setIsSending(false);
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setIsDrafting(false);
      setIsDelegating(false);
      onArchive(email.id); 
      onOpenChange(false);
    }, 1200);
  };

  return (
    <Sheet open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if(!val) { setIsDrafting(false); setIsDelegating(false); }
    }}>
      <SheetContent className="w-full sm:max-w-md bg-[#0F1117] text-white border-l border-white/10 p-0 flex flex-col h-full shadow-2xl">
        <div className="p-6 border-b border-white/10 bg-[#0F1117] z-20">
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400 uppercase tracking-wider">
                <AlertCircle className="h-3 w-3" /> {email.priority || 'High'}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-gray-400 hover:bg-white/5 rounded-full transition-colors"><X className="h-5 w-5" /></Button>
          </div>
          <h2 className="text-xl font-bold leading-tight">{email.subject}</h2>
          <p className="text-xs text-gray-400 mt-1">From: <span className="text-gray-200">{email.sender.name}</span></p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {sentSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-lg font-medium">Done!</h3>
            </div>
          ) : isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Sparkles className="h-8 w-8 text-blue-400 animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400/60">AI Analysis in progress...</p>
            </div>
          ) : (
            <>
              <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Intelligence Report</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleUseDraft} className="h-7 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase">
                    <Zap className="h-3 w-3 mr-1 fill-blue-400" /> Use Draft
                  </Button>
                </div>
                <ul className="space-y-3">
                  {email.analysis?.summary?.map((point, i) => (
                    <li key={i} className="text-sm text-gray-300 flex gap-3"><span className="text-blue-500 font-bold">0{i+1}</span>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <Button variant="ghost" className="w-full justify-between px-0 text-gray-400 hover:text-white" onClick={() => setShowFullEmail(!showFullEmail)}>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Original Message</span>
                  {showFullEmail ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                <div className={`overflow-hidden transition-all duration-300 ${showFullEmail ? 'max-h-[1000px]' : 'max-h-20 opacity-40'}`}>
                  <p className="text-sm text-gray-400 border-l border-white/10 pl-4 py-1">{email.body || email.bodyPreview}</p>
                </div>
              </div>
            </>
          )}
        </div>

        {!sentSuccess && !isAnalyzing && (
          <div className="p-6 border-t border-white/10 bg-[#0B0D12]/50">
            {!isDrafting ? (
              <div className="grid grid-cols-2 gap-3">
                <Button className="h-16 bg-blue-600 rounded-xl" onClick={() => setIsDrafting(true)}><Reply className="mr-2 h-4 w-4" /> Respond</Button>
                <Button variant="outline" className="h-16 border-white/10 bg-white/5 rounded-xl" onClick={() => onArchive(email.id)}><Archive className="mr-2 h-4 w-4" /> Archive</Button>
              </div>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center"><span className="text-[10px] font-bold uppercase text-blue-400">Drafting Response</span><Button variant="ghost" size="sm" onClick={() => setIsDrafting(false)}>Cancel</Button></div>
                <Textarea className="min-h-[120px] bg-white/5 border-white/10 rounded-xl" value={replyText} onChange={(e) => setReplyText(e.target.value)} autoFocus />
                <Button className="w-full h-12 bg-blue-600 rounded-xl font-bold" onClick={() => handleAction("Sent")}>{isSending ? "Sending..." : "Send Now"}</Button>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
