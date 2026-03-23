'use client';

import React, { useState, useMemo } from 'react';
import { useEmails } from '@/hooks/useEmails';
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { EmailList } from '@/components/email-list';
import { EmailDetailSheet } from '@/components/email-detail-sheet';
import { Email } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function ArchivedPage() {
  const { allEmails, loading, toggleFavorite, markAsRead, archiveEmail, markAsSent, snoozeEmail } = useEmails();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Use useMemo to ensure the filter recalculates correctly when allEmails updates
  const archivedEmails = useMemo(() => {
    return (allEmails || []).filter(e => e.isActioned === true);
  }, [allEmails]);

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
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#7FC6DA]" />
              </div>
            ) : (
              <EmailList 
                emails={archivedEmails} 
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
          isDrafting={isDrafting} 
          setIsDrafting={setIsDrafting} 
        />
      </div>
    </AppShell>
  );
}