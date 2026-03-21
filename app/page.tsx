'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';

// CRITICAL: You must import your custom hook here
import { useEmails } from '@/hooks/useEmails'; 

// Ensure all UI components are imported
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { KPICard } from '@/components/kpi-card';
import { EmailList } from '@/components/email-list';
import { EmailDetailSheet } from '@/components/email-detail-sheet';
import { Email } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Clean Lucide imports (no duplicate path imports)
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
  // If useEmails is not exported correctly from '@/hooks/useEmails', this will crash
  const { emails, archiveEmail, markAsRead, archiveAllNoise } = useEmails();
  
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);

  const filteredEmails = useMemo(() => {
    if (!emails) return [];
    let list = [...emails].sort((a, b) => 
      new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e => 
        e.sender.name.toLowerCase().includes(q) || 
        e.subject.toLowerCase().includes(q)
      );
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
    return emails?.find(e => e.id === selectedEmailId) || null;
  }, [emails, selectedEmailId]);

  const handleSelectEmail = useCallback((email: Email) => {
    markAsRead(email.id);
    setSelectedEmailId(email.id);
    setIsDetailsOpen(true);
    setIsDrafting(false); 
  }, [markAsRead]);

  const handleArchiveEmail = useCallback((emailId: string) => {
    const currentIndex = filteredEmails.findIndex(e => e.id === emailId);
    const nextEmail = filteredEmails[currentIndex + 1] || filteredEmails[currentIndex - 1];

    archiveEmail(emailId);

    if (nextEmail) {
      setSelectedEmailId(nextEmail.id);
    } else {
      setIsDetailsOpen(false);
      setSelectedEmailId(null);
    }
  }, [filteredEmails, archiveEmail]);

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
    const urgentCount = safeEmails.filter((e) => e.priority === 'High' || e.category === 'Urgent').length;
    const noiseCount = safeEmails.filter((e) => e.suggestedAction === 'Archive').length;
    const needsAction = safeEmails.filter((e) => e.suggestedAction === 'Respond' && !e.isRead).length;
    const minutes = (needsAction * 5) + ((unread - needsAction) * 2);
    const noisePercent = safeEmails.length ? Math.round((noiseCount / safeEmails.length) * 100) : 0;
    
    return { 
      unread, 
      urgent: urgentCount, 
      noisePercent, 
      estimatedTime: minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h ${minutes % 60}m` 
    };
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
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-11 w-11 rounded-xl border-white/10 bg-white/5" 
              onClick={archiveAllNoise}
            >
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
                    <TabsTrigger 
                      key={tab} 
                      value={tab} 
                      className="h-14 rounded-none border-b-2 border-transparent bg-transparent px-0 text-[10px] font-bold uppercase tracking-widest data-[state=active]:border-blue-500 data-[state=active]:text-white text-gray-500"
                    >
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