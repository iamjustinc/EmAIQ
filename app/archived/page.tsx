'use client';

import React, { useState } from 'react';
import { useEmails } from '@/hooks/useEmails';
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { EmailList } from '@/components/email-list';

export default function ArchivedPage() {
  const { allEmails, toggleFavorite, markAsRead } = useEmails();
  const [activeTab, setActiveTab] = useState('all');

  const archivedEmails = (allEmails || []).filter(e => e.isActioned);

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-[#0B0D12]">
        <Header title="Archived" />
        <main className="flex-1 overflow-hidden flex flex-col p-8 w-full">
          <div className="flex-1 overflow-hidden bg-[#0F1117] border border-white/5 rounded-[32px] flex flex-col shadow-2xl">
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