'use client';

import { useState, useMemo, useCallback } from 'react';
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { KPICard } from '@/components/kpi-card';
import { EmailList } from '@/components/email-list';
import { EmailDetailSheet } from '@/components/email-detail-sheet';
import emailData from '@/email.json';
import { Email } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Mail, AlertTriangle, Sparkles, Clock, Zap, Search } from 'lucide-react';

const initialEmails: Email[] = emailData as Email[];

type TabFilter = 'all' | 'action' | 'today' | 'week' | 'noise';

export default function InboxPage() {
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = useMemo(() => {
    const unread = emails.filter((e) => !e.isRead).length;
    const urgent = emails.filter((e) => e.urgency.label === 'High').length;
    const noiseReduced = emails.filter((e) => e.suggestedAction === 'Archive').length;
    const needsAction = emails.filter((e) => e.suggestedAction === 'Respond' && !e.isActioned).length;
    const estimatedMinutes = needsAction * 5 + (unread - needsAction) * 2;
    const noisePercent = Math.round((noiseReduced / emails.length) * 100);
    
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

  const markAsRead = useCallback((emailId: string) => {
    setEmails(prev => prev.map(e => 
      e.id === emailId ? { ...e, isRead: true } : e
    ));
  }, []);

  const handleSelectEmail = useCallback((email: Email) => {
    setSelectedEmail(email);
    setSheetOpen(true);
    // Mark as read when opening
    if (!email.isRead) {
      markAsRead(email.id);
    }
  }, [markAsRead]);

  const handleArchiveEmail = useCallback((emailId: string) => {
    // Archive means remove from the inbox list.
    setEmails((prev) => prev.filter((e) => e.id !== emailId));
    setSelectedEmail((prev) => (prev?.id === emailId ? null : prev));
  }, []);

  const sortedEmails = useMemo(() => {
    return [...emails].sort((a, b) => {
      if (b.urgency.score !== a.urgency.score) {
        return b.urgency.score - a.urgency.score;
      }
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
        return searchFilteredEmails.filter(e => e.suggestedAction === 'Respond' || e.urgency.label === 'High');
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

  const tabCounts = useMemo(() => ({
    all: searchFilteredEmails.length,
    action: searchFilteredEmails.filter(e => e.suggestedAction === 'Respond' || e.urgency.label === 'High').length,
    today: searchFilteredEmails.filter(e => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return new Date(e.receivedAt) >= todayStart;
    }).length,
    week: searchFilteredEmails.length,
    noise: searchFilteredEmails.filter(e => e.suggestedAction === 'Archive' || e.category === 'Newsletter').length,
  }), [searchFilteredEmails]);

  // Update selectedEmail reference when emails change
  const currentSelectedEmail = useMemo(() => {
    if (!selectedEmail) return null;
    return emails.find(e => e.id === selectedEmail.id) || null;
  }, [emails, selectedEmail]);

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        {/* Demo Banner */}
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
          {/* Search Bar */}
          <div className="px-4 pt-3 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by sender or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50"
              />
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-3 px-4 pb-3 lg:grid-cols-4">
            <KPICard
              title="Unread"
              value={stats.unread}
              subtitle={`${emails.length} total`}
              icon={Mail}
              variant="default"
            />
            <KPICard
              title="Urgent"
              value={stats.urgent}
              subtitle="Needs attention"
              icon={AlertTriangle}
              variant="danger"
            />
            <KPICard
              title="Noise Reduced"
              value={stats.noiseReduced}
              subtitle="Auto-archived"
              icon={Sparkles}
              variant="success"
            />
            <KPICard
              title="Clear Time"
              value={stats.estimatedTime}
              subtitle="Estimated"
              icon={Clock}
              variant="info"
            />
          </div>

          {/* Tabs */}
          <div className="border-y border-border bg-card/30">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabFilter)} className="w-full">
              <TabsList className="w-full justify-start gap-0 rounded-none border-0 bg-transparent p-0 h-10">
                <TabsTrigger 
                  value="all" 
                  className="relative rounded-none border-0 bg-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
                >
                  All
                  <span className="ml-1.5 text-xs text-muted-foreground">({tabCounts.all})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="action" 
                  className="relative rounded-none border-0 bg-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
                >
                  Action Required
                  <span className="ml-1.5 text-xs text-danger">({tabCounts.action})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="today" 
                  className="relative rounded-none border-0 bg-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
                >
                  Today
                  <span className="ml-1.5 text-xs text-muted-foreground">({tabCounts.today})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="week" 
                  className="relative rounded-none border-0 bg-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
                >
                  This Week
                  <span className="ml-1.5 text-xs text-muted-foreground">({tabCounts.week})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="noise" 
                  className="relative rounded-none border-0 bg-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
                >
                  Noise
                  <span className="ml-1.5 text-xs text-muted-foreground">({tabCounts.noise})</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-auto">
            <EmailList
              emails={filteredEmails}
              selectedEmail={currentSelectedEmail}
              onSelectEmail={handleSelectEmail}
            />
          </div>
        </div>

        <EmailDetailSheet
          email={currentSelectedEmail}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          onArchive={handleArchiveEmail}
        />
      </div>
    </AppShell>
  );
}
