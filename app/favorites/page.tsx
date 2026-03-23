'use client';

import React, { useState } from 'react';
import { useEmails } from '@/hooks/useEmails';
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { EmailList } from '@/components/email-list';
import { EmailDetailSheet } from '@/components/email-detail-sheet';
import { Email } from '@/lib/types';

export default function FavoritesPage() {
  const { allEmails, toggleFavorite, markAsRead, archiveEmail, markAsSent, snoozeEmail } = useEmails();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const favoriteEmails = (allEmails || []).filter(e => e.isFavorite);

  const currentSelectedEmail = favoriteEmails.find(e => e.id === selectedEmailId) || null;

  const handleSelectEmail = (email: Email) => {
    markAsRead(email.id);
    setSelectedEmailId(email.id);
    setIsDetailsOpen(true);
    setIsDrafting(false);
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-background">
        <Header title="Favorites" hideSearch />
        <main className="flex w-full flex-1 flex-col overflow-hidden p-8">
          <div className="flex flex-1 flex-col overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl">
            <EmailList 
              emails={favoriteEmails} 
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