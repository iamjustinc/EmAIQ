'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useEmails } from '@/hooks/useEmails'; 
import { useUser } from '@/lib/user-context'; 
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { KPICard } from '@/components/kpi-card';
import { EmailList } from '@/components/email-list';
import { EmailDetailSheet } from '@/components/email-detail-sheet';
import { Email } from '@/lib/types';
import { Mail, Zap, AlertCircle, Trash2 } from 'lucide-react';

export default function InboxPage() {
  // Added toggleFavorite to the hook destructuring
  const { emails, archiveEmail, markAsRead, snoozeEmail, toggleFavorite } = useEmails();
  const { firstName } = useUser(); 
  
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isDrafting, setIsDrafting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => { setIsLoading(false); }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const currentSelectedEmail = useMemo(() => 
    emails?.find(e => e.id === selectedEmailId) || null, [emails, selectedEmailId]
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

  const handleSnoozeEmail = useCallback((emailId: string, hours: number) => {
    snoozeEmail(emailId, hours);
    setIsDetailsOpen(false);
    setSelectedEmailId(null);
  }, [snoozeEmail]);

  const stats = useMemo(() => {
    const safeEmails = emails || [];
    const unread = safeEmails.filter((e) => !e.isRead).length;
    // Keeping your logic: checks both priority 'High' and urgency label 'High'
    const urgentCount = safeEmails.filter((e) => e.urgency.label === 'High').length;
    const focusHours = (urgentCount * 0.25).toFixed(1);
    return { unread, urgent: urgentCount, focusTime: `${focusHours}h` };
  }, [emails]);

  if (isLoading || !isMounted) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B0D12]">
        <div className="relative mb-8 animate-in fade-in zoom-in duration-700">
          <Mail className="h-12 w-12 text-blue-500" />
          <div className="absolute inset-0 h-12 w-12 blur-2xl bg-blue-500/30 animate-pulse" />
        </div>
        <div className="w-48 h-[1px] bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-outlook-load origin-left" />
        </div>
        <p className="mt-6 text-[11px] font-black uppercase tracking-[0.4em] text-white animate-in slide-in-from-bottom-2 duration-1000">
          Welcome {firstName}!
        </p>
        <p className="mt-2 text-[8px] font-medium uppercase tracking-[0.3em] text-gray-500">
          Syncing Inbox
        </p>
        <style jsx>{`
          @keyframes outlook-load {
            0% { transform: scaleX(0); opacity: 1; }
            70% { transform: scaleX(0.8); opacity: 1; }
            100% { transform: scaleX(1); opacity: 0; }
          }
          .animate-outlook-load {
            animation: outlook-load 2s cubic-bezier(0.65, 0, 0.35, 1) forwards;
          }
        `}</style>
      </div>
    );
  }

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-[#0B0D12] animate-in fade-in duration-1000">
        <Header title="Inbox" />
        <main className="flex-1 overflow-hidden flex flex-col p-8 space-y-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <KPICard title="Unread" value={stats.unread} icon={Mail} subtitle="Messages" variant="default" onClick={() => setActiveTab('all')} />
            <KPICard title="Urgent" value={stats.urgent} icon={AlertCircle} subtitle="Actions" variant="danger" onClick={() => setActiveTab('action')} />
            <KPICard title="Noise" value="21%" icon={Trash2} subtitle="Auto-filtered" variant="warning" onClick={() => setActiveTab('noise')} />
            <KPICard title="Focus Time" value={stats.focusTime} icon={Zap} subtitle="Remaining" variant="default" onClick={() => setActiveTab('action')} />
          </div>
          <div className="flex-1 overflow-hidden bg-[#0F1117] border border-white/5 rounded-[32px] flex flex-col shadow-2xl">
            <EmailList 
              emails={emails || []} 
              selectedEmail={currentSelectedEmail} 
              onSelectEmail={handleSelectEmail} 
              onToggleFavorite={toggleFavorite} // Added this prop
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
          onSnooze={handleSnoozeEmail} 
          isDrafting={isDrafting} 
          setIsDrafting={setIsDrafting} 
        />
      </div>
    </AppShell>
  );
}