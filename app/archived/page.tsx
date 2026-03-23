'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useEmails } from '@/hooks/useEmails';
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { EmailList } from '@/components/email-list';
import { EmailDetailSheet } from '@/components/email-detail-sheet';
import { Email } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function ArchivedPage() {
  // Pulling allEmails and loading state from your hook
  const { allEmails, loading, toggleFavorite, markAsRead, archiveEmail, markAsSent, snoozeEmail } = useEmails();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Filter for ONLY actioned emails. 
  // We use allEmails because 'emails' from the hook is pre-filtered for the Inbox.
  const archivedEmails = useMemo(() => {
    if (!allEmails || allEmails.length === 0) return [];
    return allEmails.filter(e => e.isActioned === true);
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
            {/* CRITICAL: If the sidebar shows a number but the list is empty, 
               it means the hook is done loading, but the filter might be returning 
               an empty array. 
            */}
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#7FC6DA]" />
              </div>
            ) : (
              <EmailList 
                emails={archivedEmails} // Passing the filtered archived list
                selectedEmail={currentSelectedEmail} 
                onSelectEmail={handleSelectEmail} 
                onToggleFavorite={toggleFavorite}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                hideTabs // This prevents the 'All/Unread' tabs from re-filtering your archive
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