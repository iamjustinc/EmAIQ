'use client';

import React, { useState, useMemo, useCallback } from 'react';
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
import { Search, Trash2, Mail, Zap, AlertCircle } from 'lucide-react';

type TabFilter = 'all' | 'action' | 'today' | 'noise';

export default function InboxPage() {
  const { emails, archiveEmail, markAsRead, archiveAllNoise } = useEmails();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);

  const currentSelectedEmail = useMemo(() => 
    emails?.find(e => e.id === selectedEmailId) || null, 
    [emails, selectedEmailId]
  );

  const filteredEmails = useMemo(() => {
    if (!emails) return [];
    let list = [...emails].sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e => e.sender.name.toLowerCase().includes(q) || e.subject.toLowerCase().includes(q));
    }

    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    switch (activeTab) {
      case 'action': return list.filter(e => e.priority === 'High' || e.suggestedAction === 'Respond');
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
        />
        
        <main className="flex-1 overflow-hidden flex flex-col p-8 space-y-8 max-w-[1600px] mx-auto w-full">
          {/* KPI Dashboard - High Contrast */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <KPICard title="Unread" value={emails?.filter(e => !e.isRead).length || 0} icon={Mail} subtitle="Messages" variant="default" />
            <KPICard title="Urgent" value={emails?.filter(e => e.priority === 'High').length || 0} icon={AlertCircle} subtitle="Actions" variant="danger" />
            <KPICard title="Noise" value="21%" icon={Trash2} subtitle="Auto-filtered" variant="warning" />
            <KPICard title="Focus Time" value="4.2h" icon={Zap} subtitle="Saved this week" variant="default" />
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-hidden bg-[#0F1117] border border-white/5 rounded-[32px] flex flex-col shadow-2xl">
            {/* 4. Navigation Bar Fix: Spaced out tabs */}
            <div className="px-2 flex items-center justify-between border-b border-white/5">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabFilter)} className="w-full max-w-2xl">
                <TabsList className="h-16 bg-transparent p-0 flex justify-start">
                  {['all', 'action', 'today', 'noise'].map((tab) => (
                    <TabsTrigger 
                      key={tab} 
                      value={tab} 
                      className="rounded-none border-b-2 border-transparent h-16 w-32 text-[10px] font-bold uppercase tracking-[0.2em] data-[state=active]:border-blue-500 data-[state=active]:bg-blue-500/5 data-[state=active]:text-white text-gray-500 transition-all"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-4 pr-8">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                  <Input 
                    placeholder="Quick find..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-64 bg-white/5 border-white/10 rounded-2xl text-xs pl-11 focus:border-blue-500/50 transition-all outline-none" 
                  />
                </div>
                {activeTab === 'noise' && (
                  <Button variant="ghost" size="sm" onClick={archiveAllNoise} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2 px-4 rounded-xl">
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Clear All</span>
                  </Button>
                )}
              </div>
            </div>

            <EmailList emails={filteredEmails} selectedEmail={currentSelectedEmail} onSelectEmail={handleSelectEmail} />
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
