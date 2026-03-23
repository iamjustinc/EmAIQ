'use client';

import React, { useState } from 'react';
import { useEmails } from '@/hooks/useEmails';
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { EmailList } from '@/components/email-list';
import { EmailDetailSheet } from '@/components/email-detail-sheet';
import { Email } from '@/lib/types';

export default function SentPage() {
  const { allEmails, toggleFavorite, markAsRead, archiveEmail, markAsSent, snoozeEmail } = useEmails();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const sentEmails = (allEmails || []).filter(e => e.status === 'sent' || e.isSent);
  const currentSelectedEmail = sentEmails.find(e => e.id === selectedEmailId) || null;

  const handleSelectEmail = (email: Email) => {
    markAsRead(email.id);
    setSelectedEmailId(email.id);
    setIsDetailsOpen(true);
    setIsDrafting(false);
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-background">
        <Header title="Sent" hideSearch />
        <main className="flex w-full flex-1 flex-col overflow-hidden px-10 pb-10 pt-6">
          <div className="relative flex flex-1 flex-col overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl">
            <EmailList 
              emails={sentEmails} 
              selectedEmail={currentSelectedEmail} 
              onSelectEmail={handleSelectEmail} 
              onToggleFavorite={toggleFavorite}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              hideTabs
            />
          </div>
        </main>

        <EmailDetailSheet 
          email={currentSelectedEmail} 
          open={isDetailsOpen} 
          onOpenChange={setIsDetailsOpen} 
          onArchive={archiveEmail} 
          onSent={markAsSent} 
          onSnooze={snoozeEmail} 
          isDrafting={isDrafting} 
          setIsDrafting={setIsDrafting} 
        />
      </div>
    </AppShell>
  );
}