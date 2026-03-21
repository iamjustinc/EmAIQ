'use client';

import React, { useState, useMemo } from 'react';
import { useEmails } from '@/hooks/useEmails'; 
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { KPICard } from '@/components/kpi-card';
import { EmailList } from '@/components/email-list';
import { EmailDetailSheet } from '@/components/email-detail-sheet';
import { Email } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Zap, 
  Search, 
  Trash 
} from 'lucide-react';

type TabFilter = 'all' | 'action' | 'today' | 'week' | 'noise';

export default function InboxPage() {
  const {
    emails,
    archiveEmail,
    markAsRead,
    archiveAllNoise,
  } = useEmails();
  
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  // Correct placement for state
  const [isDrafting, setIsDrafting] = useState(false);

  const stats = useMemo(() => {
    const unread = emails.filter((e) => !e.isRead).length;
    const urgent = emails.filter((e) => e.priority === 'High' || e.category === 'Urgent').length;
    const noiseReduced = emails.filter((e) => e.suggestedAction === 'Archive').length;
    const needsAction = emails.filter((e) => e.suggestedAction === 'Respond' && !e.isRead).length;
    const estimatedMinutes = needsAction * 5 + (unread - needsAction) * 2;
    const noisePercent = emails.length
      ? Math.round((noiseReduced / emails.length) * 100)
      : 0;
      
    return {
      unread,
      urgent,
      noiseReduced,
      noisePercent,
      estimatedTime: estimatedMinutes < 60
        ? `${estimatedMinutes}m`
        : `${Math.floor(estimatedMinutes / 60)}h ${estimatedMinutes % 60}m`,
    };
  }, [emails]);

  const handleSelectEmail = (email: Email) => {
    setSelectedEmail(email);
    setSheetOpen(true);
    setIsDrafting(false); // Reset drafting view when switching emails
    if (!email.isRead) {
      markAsRead(email.id);
    }
  };

  const handleArchiveEmail = (emailId: string) => {
    archiveEmail(emailId);
    if (selectedEmail?.id === emailId) {
      setSheetOpen(false);
      setSelectedEmail(null);
    }
  };

  const sortedEmails = useMemo(() => {
    return [...emails].sort((a, b) => {
      return new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime();
    });
  }, [emails]);

  const searchFilteredEmails = useMemo(() => {
    if (!searchQuery.trim()) return sortedEmails;
    const query = searchQuery.toLowerCase();
    return sortedEmails.filter(e =>
      e.sender.name.toLowerCase().includes(query) ||
      e.subject.toLowerCase().includes(query)
    );
  }, [sortedEmails, searchQuery]);

  const filteredEmails = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    switch (activeTab) {
      case 'action':
        return searchFilteredEmails.filter(e => e.suggestedAction === 'Respond' || e.priority === 'High');
      case 'today':
        return searchFilteredEmails.filter(e => new Date(e.receivedAt) >= todayStart);
      case 'week':
        return searchFilteredEmails.filter(e => new Date(e.receivedAt) >= weekStart);
      case 'noise':
        return searchFilteredEmails.filter(e => e.suggestedAction === 'Archive' || e.category === 'Newsletter');
      default:
        return searchFilteredEmails;
    }
  }, [searchFilteredEmails, activeTab]);

  const currentSelectedEmail = useMemo(() => {
    if (!selectedEmail) return null;
    return emails.find(e => e.id === selectedEmail.id) || null;
  }, [emails, selectedEmail]);

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        {/* Banner */}
        <div className="flex items-center justify-center gap-2 border-b border-primary/20 bg-primary/5 px-4 py-2">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <p className="text-sm text-foreground">
            <span className="font-medium">Meet Alex</span>
            <span className="text-muted-foreground mx-2">—</span>
            <span className="text-muted-foreground">{stats.unread} unread emails, {stats.urgent} urgent, {stats.noisePercent}% noise reduced today</span>
          </p>
        </div>

        <Header title="Inbox" />
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Search and Clean Button */}
          <div className="flex items-center px-4 pt-3 pb-2 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by sender or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-card border-border text-foreground"
              />
            </div>
            <Button
              variant="ghost"
              className="ml-2 px-2 h-9 text-red-500 border border-red-500/40 flex gap-1"
              onClick={archiveAllNoise}
            >
              <Trash className="w-4 h-4" />
              Clean Inbox
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 px-4 pb-3 lg:grid-cols-4">
            <KPICard title="Unread" value={stats.unread} subtitle="Total" icon={Mail} variant="default" />
            <KPICard title="Urgent" value={stats.urgent} subtitle="Attention" icon={AlertTriangle} variant="danger" />
            <KPICard title="Noise Reduced" value={stats.noiseReduced} subtitle="Saved" icon={Sparkles} variant="success" />
            <KPICard title="Clear Time" value={stats.estimatedTime} subtitle="Estimated" icon={Clock} variant="info" />
          </div>

          {/* Tabs */}
          <div className="border-y border-border bg-card/30">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabFilter)} className="w-full">
              <TabsList className="w-full justify-start gap-0 rounded-none border-0 bg-transparent h-10">
                {['all', 'action', 'today', 'week', 'noise'].map((tab) => (
                  <TabsTrigger 
                    key={tab}
                    value={tab} 
                    className="rounded-none border-0 bg-transparent px-4 py-2 text-sm font-medium"
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-auto">
            <EmailList
              emails={filteredEmails}
              selectedEmail={currentSelectedEmail}
              onSelectEmail={handleSelectEmail}
              markAsRead={markAsRead}
              archiveEmail={handleArchiveEmail}
            />
          </div>
        </div>

        {/* Sidebar Detail Sheet */}
        <EmailDetailSheet
          email={currentSelectedEmail}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          onArchive={handleArchiveEmail}
          isDrafting={isDrafting}
          setIsDrafting={setIsDrafting}
        />
      </div>
    </AppShell>
  );
}