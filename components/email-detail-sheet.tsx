'use client';

import React, { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/tabs'; // Adjust if your Sheet is in /ui/sheet
import { Button } from '@/components/ui/button';
import { Email } from '@/lib/types';
import { Archive, ArrowLeft, Send, X, CheckCircle2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface EmailDetailSheetProps {
  email: Email | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onArchive: (id: string) => void;
  isDrafting: boolean;       // Must be exactly this
  setIsDrafting: (is: boolean) => void; // Must be exactly this
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
    // Simulate a network delay (Information Systems style!)
    await new Promise((res) => setTimeout(res, 800));
    setIsSending(false);
    setSentSuccess(true);
    
    // Auto-close after 1.5 seconds of showing success
    setTimeout(() => {
      setSentSuccess(false);
      setIsDrafting(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-[#0F1117] text-white border-l border-white/10">
        <SheetHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-4">
          <SheetTitle className="text-lg font-bold text-white">Email Detail</SheetTitle>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-gray-400">
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <div className="py-6 space-y-4">
          {sentSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <h3 className="text-xl font-medium">Reply Sent!</h3>
              <p className="text-sm text-gray-400 text-center">Your response to {email.sender.name} has been delivered.</p>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-semibold">{email.subject}</h2>
                <p className="text-sm text-gray-400">From: {email.sender.name}</p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl text-sm leading-relaxed border border-white/10 text-gray-300">
                {email.body || "No preview available for this email."}
              </div>

              <div className="flex gap-2 pt-4">
                {!isDrafting ? (
                  <>
                    <Button 
                      className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl" 
                      onClick={() => setIsDrafting(true)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Respond
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2 border-white/10 text-red-400 hover:bg-red-500/10 rounded-xl"
                      onClick={() => onArchive(email.id)}
                    >
                      <Archive className="h-4 w-4" />
                      Archive
                    </Button>
                  </>
                ) : (
                  <div className="w-full space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">AI-Drafting Enabled</span>
                       <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-400" onClick={() => setIsDrafting(false)}>Cancel</Button>
                    </div>
                    <Textarea 
                      placeholder="Type your response..." 
                      className="min-h-[120px] bg-white/5 border-white/10 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-white"
                      autoFocus
                    />
                    <Button 
                      className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6"
                      onClick={handleSend}
                      disabled={isSending}
                    >
                      {isSending ? "Sending..." : <><Send className="h-4 w-4" /> Send Reply</>}
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