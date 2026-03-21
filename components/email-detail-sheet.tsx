'use client';

import React, { useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Email } from '@/lib/types';
import { 
  Archive, 
  ArrowLeft, 
  Send, 
  X, 
  CheckCircle2,
  Sparkles,
  Zap
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

  if (!email) return null;

  const handleSend = async () => {
    setIsSending(true);
    await new Promise((res) => setTimeout(res, 800));
    setIsSending(false);
    setSentSuccess(true);
    
    setTimeout(() => {
      setSentSuccess(false);
      setIsDrafting(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-[#0F1117] text-white border-l border-white/10 p-0 overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0F1117] sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Email Analysis</h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)} 
            className="text-gray-400 hover:text-white hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {sentSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in zoom-in">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <h3 className="text-xl font-medium">Reply Sent!</h3>
            </div>
          ) : (
            <>
              {/* Subject & Sender */}
              <div className="space-y-1">
                <h2 className="text-2xl font-bold leading-tight">{email.subject}</h2>
                <p className="text-sm text-gray-400">
                  From: <span className="text-gray-200">{email.sender.name}</span>
                </p>
                {email.analysis?.sentiment && (
                  <span className="inline-block mt-2 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                    {email.analysis.sentiment} Tone
                  </span>
                )}
              </div>

              {/* AI SUMMARY SECTION - Re-added feature */}
              <div className="space-y-3 bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-blue-400">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Smart Summary</span>
                </div>
                <ul className="space-y-2">
                  {email.analysis?.summary?.map((point, i) => (
                    <li key={i} className="text-sm text-gray-300 flex gap-2 leading-relaxed">
                      <span className="text-blue-500 shrink-0">•</span> {point}
                    </li>
                  )) || <li className="text-sm text-gray-500 italic">No summary points available.</li>}
                </ul>
              </div>

              {/* EMAIL BODY - Fixed naming to bodyPreview */}
              <div className="bg-white/5 p-5 rounded-2xl text-base leading-relaxed border border-white/10 text-gray-400 min-h-[150px] whitespace-pre-wrap">
                {email.bodyPreview || email.body || "No message content available."}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-4">
                {!isDrafting ? (
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 text-lg font-medium" 
                      onClick={() => setIsDrafting(true)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                      Respond
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2 border-white/10 text-red-400 hover:bg-red-500/10 rounded-xl py-6 text-lg font-medium"
                      onClick={() => onArchive(email.id)}
                    >
                      <Archive className="h-5 w-5" />
                      Archive
                    </Button>
                  </div>
                ) : (
                  <div className="w-full space-y-4 animate-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Drafting Reply</span>
                       <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-400" onClick={() => setIsDrafting(false)}>Cancel</Button>
                    </div>
                    <Textarea 
                      placeholder="Type your response..." 
                      className="min-h-[160px] bg-white/5 border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 text-white p-4 resize-none"
                      autoFocus
                    />
                    <Button 
                      className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-7 text-lg font-bold"
                      onClick={handleSend}
                      disabled={isSending}
                    >
                      {isSending ? "Sending..." : <><Send className="h-5 w-5" /> Send Reply</>}
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}