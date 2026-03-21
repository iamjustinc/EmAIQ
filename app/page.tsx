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
        
        <main className="flex-1 overflow-hidden flex flex-col p-8 space-y-8">
          {/* KPI Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KPICard 
              title="Unread Messages" 
              value={emails?.filter(e => !e.isRead).length || 0} 
              icon={Mail} 
              subtitle="+2 from last hour"
              variant="default"
            />
            <KPICard 
              title="Urgent Actions" 
              value={emails?.filter(e => e.priority === 'High').length || 0} 
              icon={AlertCircle} 
              subtitle="Requires immediate attention"
              variant="danger" 
            />
            <KPICard 
              title="Focus Time Saved" 
              value="4.2h" 
              icon={Zap} 
              subtitle="Based on 12 auto-archives"
              variant="warning" 
            />
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-hidden bg-[#0F1117] border border-white/5 rounded-3xl flex flex-col shadow-2xl">
            {/* Table Header / Tabs */}
            <div className="px-8 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabFilter)} className="w-auto">
                <TabsList className="h-16 bg-transparent p-0 gap-10">
                  {['all', 'action', 'today', 'noise'].map((tab) => (
                    <TabsTrigger 
                      key={tab} 
                      value={tab} 
                      className="rounded-none border-b-2 border-transparent h-16 px-0 text-[10px] font-bold uppercase tracking-[0.2em] data-[state=active]:border-blue-500 data-[state=active]:text-white text-gray-500 transition-all"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                  <Input 
                    placeholder="Quick find..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-48 bg-white/5 border-white/10 rounded-xl text-xs pl-9 focus:w-64 transition-all" 
                  />
                </div>
                {activeTab === 'noise' && (
                  <Button variant="ghost" size="sm" onClick={archiveAllNoise} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2 px-3">
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Clear All</span>
                  </Button>
                )}
              </div>
            </div>

            {/* The Actual List */}
            <EmailList 
              emails={filteredEmails} 
              selectedEmail={currentSelectedEmail} 
              onSelectEmail={handleSelectEmail} 
            />
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