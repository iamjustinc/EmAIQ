'use client';

import React, { useState } from 'react';
import { useEmails } from '@/hooks/useEmails';
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { EmailList } from '@/components/email-list';
import { EmailDetailSheet } from '@/components/email-detail-sheet';
import { Email } from '@/lib/types';

export default function ArchivedPage() {
  const { allEmails, toggleFavorite, markAsRead, archiveEmail, markAsSent, snoozeEmail } = useEmails();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Filter for archived emails
  const archivedEmails = (allEmails || []).filter(e => e.status === 'archived' || e.isArchived);

  const currentSelectedEmail = archivedEmails.find(e => e.id === selectedEmailId) || null;

  const handleSelectEmail = (email: Email) => {
    markAsRead(email.id);
    setSelectedEmailId(email.id);
    setIsDetailsOpen(true);
    setIsDrafting(false);
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-[#F4F7F7]">
        <Header title="Archived" hideSearch />
        <main className="flex w-full flex-1 flex-col overflow-hidden p-8">
          <div className="flex flex-1 flex-col overflow-hidden rounded-[2.5rem] border border-[#A8D0D0]/40 bg-white shadow-xl">
            <EmailList 
              emails={archivedEmails} 
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