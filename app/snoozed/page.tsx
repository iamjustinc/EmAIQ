'use client';

import React, { useState, useMemo } from 'react';
import { useEmails } from '@/hooks/useEmails';
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { EmailList } from '@/components/email-list';
import { EmailDetailSheet } from '@/components/email-detail-sheet';
import { Email } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function SnoozedPage() {
  const { allEmails, loading, toggleFavorite, markAsRead, archiveEmail, markAsSent, snoozeEmail, cancelSnooze } = useEmails();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const snoozedEmails = useMemo(() => {
    if (!allEmails || allEmails.length === 0) return [];
    return allEmails.filter(e => e.snoozedUntil && Number(e.snoozedUntil) > Date.now());
  }, [allEmails]);

  const currentSelectedEmail = snoozedEmails.find(e => e.id === selectedEmailId) || null;

  const handleSelectEmail = (email: Email) => {
    markAsRead(email.id);
    setSelectedEmailId(email.id);
    setIsDetailsOpen(true);
    setIsDrafting(false);
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-[#F4F7F7]">
        <Header title="Snoozed" hideSearch />
        <main className="flex w-full flex-1 flex-col overflow-hidden px-10 pb-10 pt-6">
          <div className="relative flex flex-1 flex-col overflow-hidden rounded-[2.5rem] border border-[#A8D0D0]/40 bg-white shadow-xl">
            {loading ? (
              <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#7FC6DA]" /></div>
            ) : (
              <EmailList 
                emails={snoozedEmails} 
                selectedEmail={currentSelectedEmail} 
                onSelectEmail={handleSelectEmail} 
                onToggleFavorite={toggleFavorite}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                hideTabs
              />
            )}
          </div>
        </main>
        <EmailDetailSheet 
          email={currentSelectedEmail} 
          open={isDetailsOpen} 
          onOpenChange={setIsDetailsOpen} 
          onArchive={archiveEmail} 
          onSent={markAsSent} 
          onSnooze={snoozeEmail} 
          onCancelSnooze={cancelSnooze}
          isDrafting={isDrafting} 
          setIsDrafting={setIsDrafting} 
        />
      </div>
    </AppShell>
  );
}