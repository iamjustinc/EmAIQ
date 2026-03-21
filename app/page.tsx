'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useEmails } from '@/hooks/useEmails'; 
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { KPICard } from '@/components/kpi-card';
import { EmailList } from '@/components/email-list';
import { EmailDetailSheet } from '@/components/email-detail-sheet';
import { Email } from '@/lib/types';
import { Mail, Zap, AlertCircle, Trash2 } from 'lucide-react';

export default function InboxPage() {
  const { emails, archiveEmail, markAsRead } = useEmails();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isDrafting, setIsDrafting] = useState(false);

  const currentSelectedEmail = useMemo(() => 
    emails?.find(e => e.id === selectedEmailId) || null, 
    [emails, selectedEmailId]
  );

  const handleSelectEmail = useCallback((email: Email) => {
    markAsRead(email.id);
    setSelectedEmailId(email.id);
    setIsDetailsOpen(true);
    setIsDrafting(false); 
  }, [markAsRead]);

  const handleArchiveEmail = useCallback((emailId: string) => {
    archiveEmail(emailId);
    setIsDetailsOpen(false);
    setSelectedEmailId(null);
  }, [archiveEmail]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (!selectedEmailId) return;

      const key = e.key.toLowerCase();
      if (key === 'r') {
        setIsDetailsOpen(true);
        setIsDrafting(true);
      } else if (key === 'e' || key === 's') {
        handleArchiveEmail(selectedEmailId);
      } else if (key === 'escape') {
        setIsDetailsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEmailId, handleArchiveEmail]);

  const stats = useMemo(() => {
    const safeEmails = emails || [];
    const unread = safeEmails.filter((e) => !e.isRead).length;
    const urgent = safeEmails.filter((e) => e.priority === 'High').length;
    return { unread, urgent };
  }, [emails]);

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-[#0B0D12]">
        <Header 
          title="Inbox" 
          onReply={() => { if(selectedEmailId) { setIsDetailsOpen(true); setIsDrafting(true); } }}
          onArchive={() => selectedEmailId && handleArchiveEmail(selectedEmailId)}
        />
        
        <main className="flex-1 overflow-hidden flex flex-col p-8 space-y-8 w-full">
          {/* KPI Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <KPICard 
              title="Unread" 
              value={stats.unread} 
              icon={Mail} 
              subtitle="Messages" 
              variant="default" 
              onClick={() => setActiveTab('all')}
            />
            <KPICard 
              title="Urgent" 
              value={stats.urgent} 
              icon={AlertCircle} 
              subtitle="Actions" 
              variant="danger" 
              onClick={() => setActiveTab('action')}
            />
            <KPICard 
              title="Noise" 
              value="21%" 
              icon={Trash2} 
              subtitle="Auto-filtered" 
              variant="warning" 
              onClick={() => setActiveTab('noise')}
            />
            <KPICard 
              title="Focus Time" 
              value="4.2h" 
              icon={Zap} 
              subtitle="Saved" 
              variant="default" 
              onClick={() => setActiveTab('all')}
            />
          </div>

          {/* Main Table Container - Full Width */}
          <div className="flex-1 overflow-hidden bg-[#0F1117] border border-white/5 rounded-[32px] flex flex-col shadow-2xl">
            <EmailList 
              emails={emails || []} 
              selectedEmail={currentSelectedEmail} 
              onSelectEmail={handleSelectEmail}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </main>

        <EmailDetailSheet
          email={currentSelectedEmail}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onArchive={handleArchiveEmail}
          isDrafting={isDrafting}
          setIsDrafting={setIsDrafting}
        /> 
      </div>
    </AppShell>
  );
}
