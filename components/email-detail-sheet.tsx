'use client';

import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Email } from '@/lib/types';
import { 
  Archive, Reply, Clock, Users, X, CheckCircle2, 
  Zap, AlertCircle, Loader2, Mail, 
  ChevronDown, ChevronUp, ChevronRight, Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
      const timer = setTimeout(() => setIsAnalyzing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [open, email?.id]);

  if (!email) return null;

  const handleUseDraft = () => {
    const draft = email.analysis?.summary?.[0] 
      ? `Hi ${email.sender.name.split(' ')[0]},\n\nRegarding the ${email.subject.toLowerCase()}, I've noted that ${email.analysis.summary[0].toLowerCase()} I'll handle this immediately.`
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
    }, 1000);
  };

  return (
    <Sheet open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if(!val) { setIsDrafting(false); setIsDelegating(false); }
    }}>
      <SheetContent className="w-full sm:max-w-md bg-[#0F1117] text-white border-l border-white/10 p-0 flex flex-col h-full shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="p-8 pb-6 border-b border-white/5 bg-[#0F1117]">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[9px] font-bold text-red-400 uppercase tracking-[0.1em]">
                <AlertCircle className="h-3 w-3" /> High Priority
              </div>
              <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 uppercase tracking-[0.1em]">
                {email.analysis?.sentiment || 'Urgent'} Tone
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-gray-500 hover:text-white -mt-2 hover:bg-white/5 rounded-full transition-colors">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <h2 className="text-2xl font-bold leading-tight tracking-tight pr-4">{email.subject}</h2>
          <p className="text-xs text-gray-500 mt-2 font-medium">From: <span className="text-gray-300 ml-1">{email.sender.name}</span></p>
        </div>

        {/* Middle Content */}
        <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8 scrollbar-hide">
          {sentSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">{successMessage}</h3>
            </div>
          ) : isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="relative">
                <Target className="h-8 w-8 text-blue-500 animate-pulse" />
                <Loader2 className="h-12 w-12 text-blue-500/10 animate-spin absolute -top-2 -left-2" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500/60">Alex Intelligence Engine</p>
            </div>
          ) : (
            <>
              {/* Intelligence Box - Restored to match original numbering and colors */}
              <div className="space-y-5 bg-[#161922] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Target className="h-12 w-12 text-blue-400" />
                </div>
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2.5">
                    <Zap className="h-3.5 w-3.5 text-blue-400 fill-blue-400" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400/90">AI Intelligence Report</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleUseDraft} className="h-7 px-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[9px] font-bold uppercase border border-blue-500/20">
                    <Zap className="h-3 w-3 mr-1.5 fill-blue-400" /> Use Draft
                  </Button>
                </div>

                <ul className="space-y-4 relative z-10">
                  {email.analysis?.summary?.map((point, i) => (
                    <li key={i} className="text-[13px] text-gray-300 flex gap-4 leading-relaxed group/item">
                      <span className="text-blue-500 font-bold text-[11px] mt-0.5 tracking-tighter">0{i+1}</span>
                      <span className="group-hover:text-white transition-colors">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expandable Email Body */}
              <div className="space-y-4">
                <Button 
                  variant="ghost" 
                  className="w-full flex items-center justify-between px-0 text-gray-500 hover:text-white hover:bg-transparent" 
                  onClick={() => setShowFullEmail(!showFullEmail)}
                >
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Original Message</span>
                  </div>
                  {showFullEmail ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                <div className={cn(
                  "overflow-hidden transition-all duration-300",
                  showFullEmail ? 'max-h-[1000px] opacity-100' : 'max-h-20 opacity-40'
                )}>
                  <div className="text-sm leading-relaxed text-gray-400 border-l border-white/5 pl-5 py-1">
                    {email.body || email.bodyPreview}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions - The 4-Button Grid */}
        {!sentSuccess && !isAnalyzing && (
          <div className="p-8 border-t border-white/5 bg-[#0F1117] mt-auto">
            {!isDrafting && !isDelegating ? (
               <div className="grid grid-cols-2 gap-4">
                 <Button className="flex flex-col items-center justify-center h-24 gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-2xl shadow-lg shadow-blue-900/20" onClick={() => setIsDrafting(true)}>
                   <Reply className="h-5 w-5" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Respond</span>
                 </Button>
                 <Button variant="outline" className="flex flex-col items-center justify-center h-24 gap-2 border-white/5 bg-white/[0.03] text-gray-300 hover:bg-white/[0.08] rounded-2xl" onClick={() => handleAction("Scheduled for Review")}>
                   <Clock className="h-5 w-5" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Review Later</span>
                 </Button>
                 <Button variant="outline" className="flex flex-col items-center justify-center h-24 gap-2 border-white/5 bg-white/[0.03] text-gray-300 hover:bg-white/[0.08] rounded-2xl" onClick={() => setIsDelegating(true)}>
                   <Users className="h-5 w-5" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Delegate</span>
                 </Button>
                 <Button variant="outline" className="flex flex-col items-center justify-center h-24 gap-2 border-white/5 bg-white/[0.03] text-red-400/80 hover:bg-red-500/5 hover:text-red-400 rounded-2xl group" onClick={() => onArchive(email.id)}>
                   <Archive className="h-5 w-5 group-hover:scale-110 transition-transform" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Archive</span>
                 </Button>
               </div>
            ) : isDelegating ? (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">Delegate Command</span>
                  <Button variant="ghost" size="sm" onClick={() => setIsDelegating(false)} className="text-[10px] uppercase h-6">Cancel</Button>
                </div>
                {['Sarah (Operations)', 'Technical Lead', 'Product Manager'].map(person => (
                  <Button key={person} variant="outline" className="w-full justify-between border-white/5 bg-white/[0.03] py-7 px-5 rounded-xl hover:bg-white/10" onClick={() => handleAction(`Delegated to ${person}`)}>
                    <span className="text-sm font-medium text-gray-200">{person}</span>
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
                    <Zap className="h-3 w-3 fill-blue-400" /> AI Draft Generation
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setIsDrafting(false)} className="text-[10px] uppercase h-6">Back</Button>
                </div>
                <Textarea 
                  className="min-h-[160px] bg-white/[0.02] border-white/10 rounded-2xl p-4 text-sm leading-relaxed resize-none focus:ring-1 focus:ring-blue-500/40" 
                  value={replyText} 
                  onChange={(e) => setReplyText(e.target.value)} 
                  placeholder="Drafting your response..."
                  autoFocus 
                />
                <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-900/40" onClick={() => handleAction("Reply Sent")}>
                  Send Response
                </Button>
              </div>
            )}
            
            {/* Security Footer */}
            <div className="mt-8 pt-6 border-t border-white/[0.03] flex items-center justify-center gap-3">
              <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-600">
                Secure OAuth 2.0 Connection • Zero Data Retention
              </span>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}