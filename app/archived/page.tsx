'use client';

import React, { useState } from 'react';
import { useEmails } from '@/hooks/useEmails';
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { EmailList } from '@/components/email-list';

export default function ArchivedPage() {
  const { allEmails, toggleFavorite, markAsRead } = useEmails();
  const [activeTab, setActiveTab] = useState('all');

  // Logic: Only show emails that have been actioned/archived
  const archivedEmails = (allEmails || []).filter(e => e.isActioned);

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-background">
        <Header title="Archived" hideSearch />
        <main className="flex w-full flex-1 flex-col overflow-hidden p-8">
          <div className="flex flex-1 flex-col overflow-hidden rounded-card-ui border border-border bg-card shadow-2xl">
            <EmailList 
              emails={archivedEmails} 
              selectedEmail={null} 
              onSelectEmail={(e) => markAsRead(e.id)} 
              onToggleFavorite={toggleFavorite}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              hideTabs
            />
          </div>
        </main>
      </div>
    </AppShell>
  );
}