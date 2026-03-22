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
import { Mail, Zap, AlertCircle, Trash2, Sparkles } from 'lucide-react';

export default function InboxPage() {
  const { emails, archiveEmail, markAsSent, markAsRead, snoozeEmail, toggleFavorite } = useEmails();
  const { firstName } = useUser(); 
  
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredEmails = useMemo(() => {
    let result = emails || [];
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
        <Mail className="h-12 w-12 text-primary animate-pulse" />
        <p className="mt-6 text-[11px] font-black uppercase tracking-[0.4em] text-foreground">Welcome {firstName}!</p>
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
          {/* Point 2 Fix: Added massive padding and gap for KPI Cards */}
          <div className="px-10 pb-8 pt-10">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
              <KPICard title="Unread" value={stats.unread} icon={Mail} subtitle="Messages" />
              <KPICard title="Urgent" value={stats.urgent} icon={AlertCircle} subtitle="Actions" variant="danger" />
              <KPICard title="Noise" value="21%" icon={Trash2} subtitle="Auto-filtered" variant="warning" />
              <KPICard title="Focus Time" value={stats.focusTime} icon={Zap} subtitle="Remaining" />
            </div>
          </div>

          <div className="flex-1 px-10 pb-10">
            <div className="flex min-h-[500px] flex-col overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl">
              {/* Point 4: Empty State Handling */}
              {filteredEmails.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center p-20 text-center">
                  <div className="mb-6 rounded-full bg-primary/5 p-6 animate-float">
                    <Sparkles className="h-12 w-12 text-primary/40" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-foreground">Inbox Zero</h3>
                  <p className="mt-2 text-sm text-muted-foreground uppercase tracking-widest font-bold">You are all caught up for now.</p>
                </div>
              ) : (
                <EmailList 
                  emails={filteredEmails} 
                  selectedEmail={currentSelectedEmail} 
                  onSelectEmail={handleSelectEmail} 
                  onToggleFavorite={toggleFavorite}
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                />
              )}
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