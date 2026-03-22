'use client';

import React, { useState } from 'react';
import { useEmails } from '@/hooks/useEmails';
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { EmailList } from '@/components/email-list';

export default function SentPage() {
  const { allEmails, toggleFavorite, markAsRead } = useEmails();
  const [activeTab, setActiveTab] = useState('all');

  // Logic: Only show emails that were marked as Sent
  const sentEmails = (allEmails || []).filter(e => e.isSent);

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-[#0B0D12]">
        <Header title="Sent" />
        <main className="flex-1 overflow-hidden flex flex-col p-8 w-full">
          <div className="flex-1 overflow-hidden bg-[#0F1117] border border-white/5 rounded-[32px] flex flex-col shadow-2xl">
            <EmailList 
              emails={sentEmails} 
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