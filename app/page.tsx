'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
import { Mail, AlertTriangle, Sparkles, Clock, Zap, Search, Trash } from 'lucide-react';

type TabFilter = 'all' | 'action' | 'today' | 'noise';

export default function InboxPage() {
  const { emails, archiveEmail, markAsRead, archiveAllNoise } = useEmails();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);

  const currentSelectedEmail = useMemo(() => emails?.find(e => e.id === selectedEmailId) || null, [emails, selectedEmailId]);

  const filteredEmails = useMemo(() => {
    if (!emails) return [];
    let list = [...emails].sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e => e.sender.name.toLowerCase().includes(q) || e.subject.toLowerCase().includes(q));
    }
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    switch (activeTab) {
      case 'action': return list.filter(e => e.suggestedAction === 'Respond' || e.priority === 'High');
      case 'today': return list.filter(e => new Date(e.receivedAt) >= todayStart);
      case 'noise': return list.filter(e => e.suggestedAction === 'Archive');
      default: return list;
    }
  }, [emails, searchQuery, activeTab]);

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

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-[#0B0D12]">
        <Header 
          title="Inbox" 
          onReply={() => { if(selectedEmailId) { setIsDetailsOpen(true); setIsDrafting(true); } }}
          onArchive={() => selectedEmailId && handleArchiveEmail(selectedEmailId)}
          onSnooze={() => console.log("Snoozed")}
        />
        
        <div className="flex-1 overflow-hidden flex flex-col p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-white/5 border-white/10 rounded-xl" />
            </div>
            <Button variant="outline" size="icon" className="rounded-xl border-white/10 bg-white/5" onClick={archiveAllNoise}><Trash className="w-4 h-4" /></Button>
          </div>

          <div className="flex-1 overflow-hidden bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col">
            <div className="px-6 border-b border-white/5">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabFilter)}>
                <TabsList className="h-14 bg-transparent p-0 gap-8">
                  {['all', 'action', 'today', 'noise'].map((tab) => (
                    <TabsTrigger key={tab} value={tab} className="rounded-none border-b-2 border-transparent text-[10px] font-bold uppercase tracking-widest data-[state=active]:border-blue-500 data-[state=active]:text-white text-gray-500">{tab}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <EmailList emails={filteredEmails} selectedEmail={currentSelectedEmail} onSelectEmail={handleSelectEmail} />
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