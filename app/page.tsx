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
  
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);

  // Stats calculation
  const stats = useMemo(() => {
    const unread = emails.filter((e) => !e.isRead).length;
    const urgent = emails.filter((e) => e.priority === 'High' || e.category === 'Urgent').length;
    const noiseReduced = emails.filter((e) => e.suggestedAction === 'Archive').length;
    const needsAction = emails.filter((e) => e.suggestedAction === 'Respond' && !e.isRead).length;
    const estimatedMinutes = needsAction * 5 + (unread - needsAction) * 2;
    const noisePercent = emails.length ? Math.round((noiseReduced / emails.length) * 100) : 0;
      
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

  // Derived state: Get the full email object from the master list using the ID
  const currentSelectedEmail = useMemo(() => {
    return emails.find(e => e.id === selectedEmailId) || null;
  }, [emails, selectedEmailId]);

  const handleSelectEmail = (email: Email) => {
    setSelectedEmailId(email.id);
    setIsDetailsOpen(true);
    setIsDrafting(false); 
    if (!email.isRead) {
      markAsRead(email.id);
    }
  };

  const handleArchiveEmail = (emailId: string) => {
    archiveEmail(emailId);
    if (selectedEmailId === emailId) {
      setIsDetailsOpen(false);
      setSelectedEmailId(null);
    }
  };

  // Filter Logic
  const filteredEmails = useMemo(() => {
    let list = [...emails].sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e => e.sender.name.toLowerCase().includes(q) || e.subject.toLowerCase().includes(q));
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (activeTab) {
      case 'action': return list.filter(e => e.suggestedAction === 'Respond' || e.priority === 'High');
      case 'today': return list.filter(e => new Date(e.receivedAt) >= todayStart);
      case 'noise': return list.filter(e => e.suggestedAction === 'Archive');
      default: return list;
    }
  }, [emails, searchQuery, activeTab]);

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-background">
        {/* Top Intelligence Banner */}
        <div className="flex items-center justify-center gap-2 border-b border-primary/10 bg-primary/5 px-4 py-2">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <p className="text-xs sm:text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Meet Alex</span>
            <span className="mx-2">—</span>
            {stats.unread} unread, {stats.urgent} urgent, {stats.noisePercent}% noise reduced
          </p>
        </div>

        <Header title="Inbox" />
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Search & Actions */}
          <div className="flex items-center px-4 pt-3 pb-2 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inbox..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-500"
              onClick={archiveAllNoise}
            >
              <Trash className="w-4 h-4 mr-2" />
              Clean Noise
            </Button>
          </div>

          {/* KPI Section */}
          <div className="grid grid-cols-2 gap-3 px-4 pb-4 lg:grid-cols-4">
            <KPICard title="Unread" value={stats.unread} icon={Mail} />
            <KPICard title="Urgent" value={stats.urgent} icon={AlertTriangle} variant="danger" />
            <KPICard title="Noise" value={`${stats.noisePercent}%`} icon={Sparkles} variant="success" />
            <KPICard title="Focus Time" value={stats.estimatedTime} icon={Clock} variant="info" />
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-border px-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabFilter)}>
              <TabsList className="h-12 w-full justify-start bg-transparent p-0 gap-6">
                {['all', 'action', 'today', 'noise'].map((tab) => (
                  <TabsTrigger 
                    key={tab}
                    value={tab} 
                    className="h-12 rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground shadow-none"
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Main List */}
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

        {/* Global Detail Sheet */}
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