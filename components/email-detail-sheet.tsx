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

  const handleUseDraft = () => {
    const draft = email.analysis?.summary?.[0] 
      ? `Hi ${email.sender.name.split(' ')[0]},\n\nI've noted that ${email.analysis.summary[0].toLowerCase()} I'll get back to you shortly.`
      : "Hi, thanks for the update. I'm looking into this now.";
    setReplyText(draft);
    setIsDrafting(true);
  };

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
    <Sheet open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if(!val) { setIsDrafting(false); setIsDelegating(false); }
    }}>
      <SheetContent className="w-full sm:max-w-md bg-[#0F1117] text-white border-l border-white/10 p-0 flex flex-col h-full shadow-2xl">
        {/* Header Section */}
        <div className="p-6 border-b border-white/10 bg-[#0F1117] z-20">
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400 uppercase tracking-wider">
                <AlertCircle className="h-3 w-3" /> {email.priority || 'High'} Priority
              </div>
              <div className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                {email.analysis?.sentiment || 'Formal'} Tone
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-gray-400 -mt-2 hover:bg-white/5 rounded-full transition-colors"><X className="h-5 w-5" /></Button>
          </div>
          <h2 className="text-2xl font-bold leading-tight tracking-tight">{email.subject}</h2>
          <p className="text-sm text-gray-400 mt-1">From: <span className="text-gray-200">{email.sender.name}</span></p>
        </div>

        {/* Middle Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {sentSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in zoom-in">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <h3 className="text-xl font-medium">{successMessage}</h3>
            </div>
          ) : isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-blue-400 animate-pulse" />
                <Loader2 className="h-12 w-12 text-blue-500/20 animate-spin absolute -top-2 -left-2" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400/60 text-center">Analyzing with Alex...</p>
            </div>
          ) : (
            <>
              {/* Intelligence Box */}
              <div className="space-y-4 bg-white/[0.03] border border-white/10 p-5 rounded-2xl shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-400/80">Intelligence Report</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleUseDraft} className="h-7 px-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-tighter">
                    <Zap className="h-3 w-3 mr-1 fill-blue-400" /> Use Draft
                  </Button>
                </div>
                <ul className="space-y-2.5">
                  {email.analysis?.summary?.map((point, i) => (
                    <li key={i} className="text-sm text-gray-300 flex gap-3 leading-relaxed">
                      <span className="text-blue-500 font-bold mt-0.5">0{i+1}</span> {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expandable Email Body */}
              <div className="space-y-4">
                <Button variant="ghost" className="w-full flex items-center justify-between px-2 text-gray-400 hover:text-white" onClick={() => setShowFullEmail(!showFullEmail)}>
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-500/50" /><span className="text-xs font-bold uppercase tracking-widest">Original Message</span></div>
                  {showFullEmail ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                <div className={`overflow-hidden transition-all duration-500 ${showFullEmail ? 'max-h-[2000px] opacity-100' : 'max-h-24 opacity-60'}`}>
                  <div className={`text-sm leading-relaxed text-gray-400 border-l border-white/10 pl-4 py-2 ${!showFullEmail && 'line-clamp-3'}`}>
                    {email.body || email.bodyPreview}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!sentSuccess && !isAnalyzing && (
          <div className="p-6 border-t border-white/10 bg-[#0B0D12]/50 backdrop-blur-md">
            {!isDrafting && !isDelegating ? (
               <div className="grid grid-cols-2 gap-3 mb-4">
                 <Button className="flex flex-col items-center justify-center h-20 gap-1 bg-blue-600 rounded-2xl" onClick={() => setIsDrafting(true)}>
                   <Reply className="h-5 w-5" /><span className="text-[10px] font-bold uppercase">Respond</span>
                 </Button>
                 <Button variant="outline" className="flex flex-col items-center justify-center h-20 gap-1 border-white/10 bg-white/5 text-gray-300 rounded-2xl" onClick={() => handleAction("Scheduled for Review")}>
                   <Clock className="h-5 w-5" /><span className="text-[10px] font-bold uppercase">Review Later</span>
                 </Button>
                 <Button variant="outline" className="flex flex-col items-center justify-center h-20 gap-1 border-white/10 bg-white/5 text-gray-300 rounded-2xl" onClick={() => setIsDelegating(true)}>
                   <Users className="h-5 w-5" /><span className="text-[10px] font-bold uppercase">Delegate</span>
                 </Button>
                 <Button variant="outline" className="flex flex-col items-center justify-center h-20 gap-1 border-red-500/20 bg-red-500/5 text-red-400 rounded-2xl" onClick={() => onArchive(email.id)}>
                   <Archive className="h-5 w-5" /><span className="text-[10px] font-bold uppercase">Archive</span>
                 </Button>
               </div>
            ) : isDelegating ? (
              <div className="space-y-4 mb-4 animate-in slide-in-from-right-4">
                <div className="flex justify-between items-center"><span className="text-[10px] font-bold uppercase text-blue-400">Delegate Task</span><Button variant="ghost" size="sm" onClick={() => setIsDelegating(false)}>Back</Button></div>
                {['Sarah (Ops)', 'Mike (Tech)', 'Support Team'].map(p => (
                  <Button key={p} variant="outline" className="w-full justify-between border-white/5 bg-white/5 py-6 px-4 rounded-xl hover:bg-white/10" onClick={() => handleAction(`Delegated to ${p}`)}>
                    <span className="text-sm font-medium text-gray-200">{p}</span><ChevronRight className="h-4 w-4 text-gray-600" />
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-4 animate-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-blue-400 flex items-center gap-1"><Zap className="h-3 w-3 fill-blue-400" /> AI Draft Active</span>
                  <Button variant="ghost" size="sm" onClick={() => setIsDrafting(false)}>Back</Button>
                </div>
                <Textarea className="min-h-[140px] bg-white/5 border-white/10 rounded-xl" value={replyText} onChange={(e) => setReplyText(e.target.value)} autoFocus />
                <Button className="w-full h-14 bg-blue-600 rounded-xl font-bold" onClick={() => handleAction("Reply Sent")}>Send Message</Button>
              </div>
            )}
            <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-2 opacity-30">
              <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400">Secure OAuth 2.0 Connection</span>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
