'use client';

import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Email } from '@/lib/types';
import { 
  Archive, 
  Reply, 
  Clock, 
  Users, 
  Send, 
  X, 
  CheckCircle2,
  Sparkles,
  Zap,
  AlertCircle,
  ChevronRight,
  Loader2
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
  email,
  open,
  onOpenChange,
  onArchive,
  isDrafting,
  setIsDrafting
}: EmailDetailSheetProps) {
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [isDelegating, setIsDelegating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Action Completed");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (open && email) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [open, email?.id]);

  if (!email) return null;

  const handleAction = async (msg: string) => {
    setIsSending(true);
    setSuccessMessage(msg);
    
    // Simulate the "Processing" time
    await new Promise((res) => setTimeout(res, 800));
    
    setIsSending(false);
    setSentSuccess(true);
    
    // Wait for the success checkmark to show, then remove the email
    setTimeout(() => {
      setSentSuccess(false);
      setIsDrafting(false);
      setIsDelegating(false);
      
      // THIS IS THE KEY: Call onArchive to remove it from the inbox list
      onArchive(email.id); 
      
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Sheet open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if(!val) { 
        setIsDrafting(false); 
        setIsDelegating(false); 
      }
    }}>
      <SheetContent className="w-full sm:max-w-md bg-[#0F1117] text-white border-l border-white/10 p-0 flex flex-col h-full shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-[#0F1117]">
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400 uppercase tracking-wider">
                <AlertCircle className="h-3 w-3" />
                {email.urgency?.label || 'High'} Priority
              </div>
              <div className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                {email.analysis?.sentiment || 'Formal'} Tone
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-gray-400 -mt-2 hover:bg-white/5 rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <h2 className="text-2xl font-bold leading-tight tracking-tight">{email.subject}</h2>
          <p className="text-sm text-gray-400 mt-1">From: <span className="text-gray-200">{email.sender.name}</span></p>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400/60 animate-pulse">
                Analyzing with Alex...
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 bg-white/[0.03] border border-white/10 p-5 rounded-2xl shadow-inner animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-2 text-blue-400">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-400/80">AI Intelligence Report</span>
                </div>
                <ul className="space-y-2.5">
                  {email.analysis?.summary?.map((point, i) => (
                    <li key={i} className="text-sm text-gray-300 flex gap-3 leading-relaxed">
                      <span className="text-blue-500 font-bold mt-0.5">0{i+1}</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-sm leading-relaxed text-gray-400 whitespace-pre-wrap px-1 animate-in fade-in duration-700">
                {email.bodyPreview || email.body}
              </div>
            </>
          )}
        </div>

        {/* Action Grid vs Forms */}
        {!sentSuccess && !isAnalyzing && (
          <div className="p-6 border-t border-white/10 bg-[#0B0D12] animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!isDrafting && !isDelegating ? (
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="flex flex-col items-center justify-center h-20 gap-1 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all active:scale-95"
                  onClick={() => setIsDrafting(true)}
                >
                  <Reply className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-tighter">Respond</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="flex flex-col items-center justify-center h-20 gap-1 border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 rounded-2xl transition-all active:scale-95"
                  onClick={() => handleAction("Scheduled for Review")}
                >
                  <Clock className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-tighter">Review Later</span>
                </Button>

                <Button 
                  variant="outline"
                  className="flex flex-col items-center justify-center h-20 gap-1 border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 rounded-2xl transition-all active:scale-95"
                  onClick={() => setIsDelegating(true)}
                >
                  <Users className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-tighter">Delegate</span>
                </Button>

                <Button 
                  variant="outline"
                  className="flex flex-col items-center justify-center h-20 gap-1 border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 rounded-2xl transition-all active:scale-95"
                  onClick={() => onArchive(email.id)}
                >
                  <Archive className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-tighter text-red-400">Archive</span>
                </Button>
              </div>
            ) : isDelegating ? (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Delegate Task</span>
                  <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-500" onClick={() => setIsDelegating(false)}>Back</Button>
                </div>
                <div className="space-y-2">
                  {['Sarah (Operations)', 'Mike (Product)', 'Legal Team'].map((person) => (
                    <Button 
                      key={person}
                      variant="outline" 
                      className="w-full justify-between border-white/5 bg-white/5 hover:bg-white/10 text-sm py-5 px-4 rounded-xl"
                      onClick={() => handleAction(`Delegated to ${person}`)}
                    >
                      {person}
                      <ChevronRight className="h-4 w-4 text-gray-600" />
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
                    <Zap className="h-3 w-3 fill-blue-400" /> AI Draft Ready
                  </span>
                  <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-500" onClick={() => setIsDrafting(false)}>Back</Button>
                </div>
                <Textarea 
                  placeholder="Draft your reply..." 
                  className="min-h-[140px] bg-white/5 border-white/10 rounded-xl text-white p-4 resize-none focus:ring-1 focus:ring-blue-500 outline-none"
                  autoFocus
                />
                <Button className="w-full h-14 gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold" onClick={() => handleAction("Reply Sent")}>
                  {isSending ? "Processing..." : <><Send className="h-4 w-4" /> Send Message</>}
                </Button>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}