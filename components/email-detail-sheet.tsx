'use client';

import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Email } from '@/lib/types';
import { Archive, Reply, Clock, Users, X, CheckCircle2, Zap, AlertCircle, Loader2, Mail, ChevronDown, ChevronUp, ChevronRight, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailDetailSheetProps {
  email: Email | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onArchive: (emailId: string) => void;
  isDrafting: boolean;
  setIsDrafting: (isDrafting: boolean) => void;
}

export function EmailDetailSheet({ email, open, onOpenChange, onArchive, isDrafting, setIsDrafting }: EmailDetailSheetProps) {
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [isDelegating, setIsDelegating] = useState(false);
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

  const handleAction = async (msg: string) => {
    setIsSending(true);
    setSuccessMessage(msg);
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
    <Sheet open={open} onOpenChange={(val) => { onOpenChange(val); if(!val) { setIsDrafting(false); setIsDelegating(false); } }}>
      <SheetContent className="w-full sm:max-w-md bg-[#0F1117] text-white border-l border-white/10 p-0 flex flex-col h-full shadow-2xl overflow-hidden">
        
        {/* Header - Fixed to match high density */}
        <div className="p-8 pb-6 border-b border-white/5">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[9px] font-black text-red-500 uppercase tracking-widest">
                <AlertCircle className="h-3 w-3" /> {email.priority === 'High' ? 'Critical' : 'Priority'}
              </div>
              <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-400 uppercase tracking-widest">
                AI Scanned
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-gray-600 hover:text-white hover:bg-white/5 rounded-full transition-colors">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-100">{email.subject}</h2>
          <p className="text-xs text-gray-500 mt-3 font-bold uppercase tracking-widest">From: <span className="text-blue-400 ml-1">{email.sender.name}</span></p>
        </div>

        {/* Content */}
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
          ) : (
            <>
              {/* The Intelligence Report - Restoration Complete */}
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-5 relative">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-3.5 w-3.5 text-blue-400 fill-blue-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400">Intelligence Report</span>
                </div>
                <ul className="space-y-4">
                  {email.analysis?.summary?.map((point, i) => (
                    <li key={i} className="flex gap-4 group">
                      <span className="text-blue-500 font-black text-[10px] mt-1 tracking-tighter">0{i+1}</span>
                      <p className="text-[13px] leading-relaxed text-gray-300 group-hover:text-white transition-colors">
                        {point}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Email Body Expander */}
              <div className="border-t border-white/5 pt-6">
                <button onClick={() => setShowFullEmail(!showFullEmail)} className="flex items-center justify-between w-full text-gray-500 hover:text-gray-300 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Original Thread</span>
                  {showFullEmail ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {showFullEmail && (
                  <div className="mt-4 text-[13px] leading-relaxed text-gray-400 bg-white/[0.01] p-4 rounded-xl border border-white/5">
                    {email.body || email.bodyPreview}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer - The 4-Button Grid Restoration */}
        {!sentSuccess && !isAnalyzing && (
          <div className="p-8 border-t border-white/5 bg-[#0F1117] mt-auto">
            {!isDrafting && !isDelegating ? (
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-20 bg-blue-600 hover:bg-blue-500 rounded-2xl flex flex-col gap-1 transition-all" onClick={() => setIsDrafting(true)}>
                  <Reply className="h-4 w-4" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Respond</span>
                </Button>
                <Button variant="outline" className="h-20 border-white/10 bg-white/5 rounded-2xl flex flex-col gap-1 text-gray-400" onClick={() => handleAction("Snoozed")}>
                  <Clock className="h-4 w-4" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Later</span>
                </Button>
                <Button variant="outline" className="h-20 border-white/10 bg-white/5 rounded-2xl flex flex-col gap-1 text-gray-400" onClick={() => setIsDelegating(true)}>
                  <Users className="h-4 w-4" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Delegate</span>
                </Button>
                <Button variant="outline" className="h-20 border-white/10 bg-white/5 rounded-2xl flex flex-col gap-1 text-red-400/60 hover:text-red-400" onClick={() => handleAction("Archived")}>
                  <Archive className="h-4 w-4" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Archive</span>
                </Button>
              </div>
            ) : isDrafting && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4">
                <Textarea 
                  className="min-h-[180px] bg-white/5 border-white/10 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none" 
                  value={replyText} 
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Drafting response..."
                />
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-white/10 bg-white/5" onClick={() => setIsDrafting(false)}>Cancel</Button>
                  <Button className="flex-[2] bg-blue-600" onClick={() => handleAction("Response Sent")}>Send Message</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
