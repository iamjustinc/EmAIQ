'use client';

import React, { useState } from 'react';
import { useEmails } from '@/hooks/useEmails';
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { EmailList } from '@/components/email-list';

export default function ArchivedPage() {
  const { allEmails, toggleFavorite, markAsRead } = useEmails();
  const [activeTab, setActiveTab] = useState('all');

  // Logic: Show emails that are actioned
  const archivedEmails = (allEmails || []).filter(e => e.isActioned);

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-[#F4F7F7]">
        <Header title="Archived" hideSearch />
        <main className="flex w-full flex-1 flex-col overflow-hidden p-8">
          <div className="flex flex-1 flex-col overflow-hidden rounded-[2.5rem] border border-[#A8D0D0]/40 bg-white shadow-xl">
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