'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  const { emails, archiveEmail, markAsRead, archiveAllNoise } = useEmails();
  
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);

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

  const currentSelectedEmail = useMemo(() => {
    return emails.find(e => e.id === selectedEmailId) || null;
  }, [emails, selectedEmailId]);

  const handleSelectEmail = (email: Email) => {
    markAsRead(email.id);
    setSelectedEmailId(email.id);
    setIsDetailsOpen(true);
    setIsDrafting(false); 
  };

  const handleArchiveEmail = (emailId: string) => {
    // SUPERHUMAN LOGIC: Find the next email before deleting the current one
    const currentIndex = filteredEmails.findIndex(e => e.id === emailId);
    const nextEmail = filteredEmails[currentIndex + 1] || filteredEmails[currentIndex - 1];

    archiveEmail(emailId);

    if (nextEmail) {
      setSelectedEmailId(nextEmail.id);
    } else {
      setIsDetailsOpen(false);
      setSelectedEmailId(null);
    }
  };

  // KEYBOARD SHORTCUTS ENGINE
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in a search box or reply area
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (!selectedEmailId) return;

      switch (e.key.toLowerCase()) {
        case 'r': // Reply
          setIsDetailsOpen(true);
          setIsDrafting(true);
          break;
        case 'e': // Archive
          handleArchiveEmail(selectedEmailId);
          break;
        case 's': // Snooze / Review Later
          // Simulate Snooze
          handleArchiveEmail(selectedEmailId);
          break;
        case 'escape':
          setIsDetailsOpen(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEmailId, filteredEmails]);

  // Stats calculation
  const stats = useMemo(() => {
    const unread = emails.filter((e) => !e.isRead).length;
    const urgent = emails.filter((e) => e.priority === 'High' || e.category === 'Urgent').length;
    const noiseReduced = emails.filter((e) => e.suggestedAction === 'Archive').length;
    const needsAction = emails.filter((e) => e.suggestedAction === 'Respond' && !e.isRead).length;
    const estimatedMinutes = needsAction * 5 + (unread - needsAction) * 2;
    const noisePercent = emails.length ? Math.round((noiseReduced / emails.length) * 100) : 0;
    return { unread, urgent, noiseReduced, noisePercent, estimatedTime: estimatedMinutes < 60 ? `${estimatedMinutes}m` : `${Math.floor(estimatedMinutes / 60)}h ${estimatedMinutes % 60}m` };
  }, [emails]);

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-[#0B0D12]">
        <div className="flex items-center justify-center gap-2 border-b border-white/5 bg-blue-500/5 px-4 py-2">
          <Zap className="h-3 w-3 text-blue-400 animate-pulse" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-blue-400/80">
            Meet Alex <span className="mx-2 opacity-30">•</span> {stats.unread} Unread <span className="mx-2 opacity-30">•</span> {stats.urgent} Urgent
          </p>
        </div>

        <Header title="Inbox" />
        
        <div className="flex-1 overflow-hidden flex flex-col p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
              <Input
                placeholder="Search command (⌘K)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500/50"
              />
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-white/10 bg-white/5 hover:bg-red-500/10 hover:text-red-500 text-gray-500" onClick={archiveAllNoise}>
              <Trash className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KPICard title="Unread" value={stats.unread} icon={Mail} />
            <KPICard title="Urgent" value={stats.urgent} icon={AlertTriangle} variant="danger" />
            <KPICard title="Noise" value={`${stats.noisePercent}%`} icon={Sparkles} variant="success" />
            <KPICard title="Focus Time" value={stats.estimatedTime} icon={Clock} variant="info" />
          </div>

          <div className="flex-1 overflow-hidden bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col">
            <div className="px-6 border-b border-white/5">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabFilter)}>
                <TabsList className="h-14 w-full justify-start bg-transparent p-0 gap-8">
                  {['all', 'action', 'today', 'noise'].map((tab) => (
                    <TabsTrigger key={tab} value={tab} className="h-14 rounded-none border-b-2 border-transparent bg-transparent px-0 text-[10px] font-bold uppercase tracking-widest data-[state=active]:border-blue-500 data-[state=active]:text-white text-gray-500 transition-all">
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <EmailList
              emails={filteredEmails}
              selectedEmail={currentSelectedEmail}
              onSelectEmail={handleSelectEmail}
            />
          </div>
        </div>

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