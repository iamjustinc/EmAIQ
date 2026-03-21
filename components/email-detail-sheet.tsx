'use client';

import React, { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Email } from '@/lib/types';
import { 
  Archive, 
  ArrowLeft, 
  Send, 
  X, 
  CheckCircle2 
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
    // Simulate API call
    await new Promise((res) => setTimeout(res, 800));
    setIsSending(false);
    setSentSuccess(true);
    
    // Clean up and close after showing success state
    setTimeout(() => {
      setSentSuccess(false);
      setIsDrafting(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-[#0F1117] text-white border-l border-white/10 p-0 overflow-y-auto">
        
        {/* Header Section */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0F1117] sticky top-0 z-10">
          <SheetTitle className="text-xl font-bold text-white">Email Detail</SheetTitle>
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
              </div>

              {/* Email Content Body */}
              <div className="bg-white/5 p-5 rounded-2xl text-base leading-relaxed border border-white/10 text-gray-300 min-h-[180px] whitespace-pre-wrap">
                {email.body || "No preview available for this email."}
              </div>

              {/* Action Section */}
              <div className="flex flex-col gap-3 pt-4">
                {!isDrafting ? (
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 text-lg font-medium transition-all" 
                      onClick={() => setIsDrafting(true)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                      Respond
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2 border-white/10 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl py-6 text-lg font-medium transition-all"
                      onClick={() => onArchive(email.id)}
                    >
                      <Archive className="h-5 w-5" />
                      Archive
                    </Button>
                  </div>
                ) : (
                  <div className="w-full space-y-4 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                         <span className="text-xs font-bold uppercase tracking-widest text-blue-400">AI-Drafting Enabled</span>
                       </div>
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="h-7 text-xs text-gray-400 hover:text-white" 
                         onClick={() => setIsDrafting(false)}
                       >
                         Cancel
                       </Button>
                    </div>
                    <Textarea 
                      placeholder="Type your response..." 
                      className="min-h-[160px] bg-white/5 border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 text-white p-4 resize-none"
                      autoFocus
                    />
                    <Button 
                      className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-7 text-lg font-bold shadow-lg shadow-blue-900/20"
                      onClick={handleSend}
                      disabled={isSending}
                    >
                      {isSending ? (
                        <span className="animate-pulse">Sending...</span>
                      ) : (
                        <><Send className="h-5 w-5" /> Send Reply</>
                      )}
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