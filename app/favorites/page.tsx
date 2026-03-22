'use client';

import React, { useState } from 'react';
import { useEmails } from '@/hooks/useEmails';
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { EmailList } from '@/components/email-list';

export default function FavoritesPage() {
  const { allEmails, toggleFavorite, markAsRead } = useEmails();
  const [activeTab, setActiveTab] = useState('all');

  // Logic: Show everything that is starred, regardless of archive status
  const favoriteEmails = (allEmails || []).filter(e => e.isFavorite);

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-background">
        <Header title="Favorites" hideSearch />
        <main className="flex w-full flex-1 flex-col overflow-hidden p-8">
          <div className="flex flex-1 flex-col overflow-hidden rounded-card-ui border border-border bg-card shadow-2xl">
            <EmailList 
              emails={favoriteEmails} 
              selectedEmail={null} 
              onSelectEmail={(e) => markAsRead(e.id)} 
              onToggleFavorite={toggleFavorite}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              hideTabs // Cleaner look for specific pages
            />
          </div>
        </main>
      </div>
    </AppShell>
  );
}