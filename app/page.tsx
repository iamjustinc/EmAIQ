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
  const { emails, archiveEmail, markAsSent, markAsRead, snoozeEmail, toggleFavorite } = useEmails();
  const { firstName } = useUser(); 
  
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState(''); // New state for search
  const [isDrafting, setIsDrafting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const hasSeenWelcome = sessionStorage.getItem('emaiq_welcome_seen');
    if (!hasSeenWelcome) {
      setIsLoading(true);
      const timer = setTimeout(() => { 
        setIsLoading(false); 
        sessionStorage.setItem('emaiq_welcome_seen', 'true');
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, []);

  const currentSelectedEmail = useMemo(() => 
    emails?.find(e => e.id === selectedEmailId) || null, [emails, selectedEmailId]
  );

  // Filter logic for both Tabs and Search
  const filteredEmails = useMemo(() => {
    let result = emails || [];

    // Apply Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(email => 
        email.sender.name.toLowerCase().includes(query) ||
        email.subject.toLowerCase().includes(query) ||
        email.bodyPreview.toLowerCase().includes(query)
      );
    }

    return result;
  }, [emails, searchQuery]);

  const handleSelectEmail = useCallback((email: Email) => {
    markAsRead(email.id);
    setSelectedEmailId(email.id);
    setIsDetailsOpen(true);
    setIsDrafting(false); 
  }, [markAsRead]);

  const stats = useMemo(() => {
    const safeEmails = emails || [];
    const unread = safeEmails.filter((e) => !e.isRead).length;
    const urgentCount = safeEmails.filter((e) => e.urgency.label === 'High').length;
    const focusHours = (urgentCount * 0.25).toFixed(1);
    return { unread, urgent: urgentCount, focusTime: `${focusHours}h` };
  }, [emails]);

  if (isLoading || !isMounted) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
        <div className="relative mb-8 animate-in fade-in zoom-in duration-700">
          <Mail className="h-12 w-12 text-primary" />
          <div className="absolute inset-0 h-12 w-12 animate-pulse blur-2xl bg-primary/30" />
        </div>
        <div className="h-[1px] w-48 overflow-hidden rounded-full bg-border">
          <div className="h-full origin-left animate-outlook-load bg-primary" />
        </div>
        <p className="mt-6 animate-in slide-in-from-bottom-2 text-[11px] font-black uppercase tracking-[0.4em] text-foreground duration-1000">
          Welcome {firstName}!
        </p>
        <p className="mt-2 text-[8px] font-medium uppercase tracking-[0.3em] text-muted-foreground">Syncing Inbox</p>
        <style jsx>{`
          @keyframes outlook-load {
            0% { transform: scaleX(0); opacity: 1; }
            70% { transform: scaleX(0.8); opacity: 1; }
            100% { transform: scaleX(1); opacity: 0; }
          }
          .animate-outlook-load { animation: outlook-load 2s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
        `}</style>
      </div>
    );
  }

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-background animate-in fade-in duration-500">
        <Header 
          title="Inbox" 
          searchValue={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <main className="flex-1 overflow-y-auto flex flex-col w-full scrollbar-hide">
          <div className="px-8 pb-6 pt-8">
            <div className="grid grid-cols-1 gap-app md:grid-cols-4">
              <KPICard title="Unread" value={stats.unread} icon={Mail} subtitle="Messages" variant="default" onClick={() => setActiveTab('all')} />
              <KPICard title="Urgent" value={stats.urgent} icon={AlertCircle} subtitle="Actions" variant="danger" onClick={() => setActiveTab('action')} />
              <KPICard title="Noise" value="21%" icon={Trash2} subtitle="Auto-filtered" variant="warning" onClick={() => setActiveTab('noise')} />
              <KPICard title="Focus Time" value={stats.focusTime} icon={Zap} subtitle="Remaining" variant="default" onClick={() => setActiveTab('action')} />
            </div>
          </div>

          <div className="flex-1 px-8 pb-8">
            <div className="flex min-h-[500px] flex-col overflow-hidden rounded-card-ui border border-border bg-card shadow-2xl">
              <EmailList 
                emails={filteredEmails} 
                selectedEmail={currentSelectedEmail} 
                onSelectEmail={handleSelectEmail} 
                onToggleFavorite={toggleFavorite}
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
              />
            </div>
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