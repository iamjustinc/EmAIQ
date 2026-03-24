'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useEmails } from '@/hooks/useEmails';
import { useUser } from '@/lib/user-context';
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { KPICard } from '@/components/kpi-card';
import { EmailList } from '@/components/email-list';
import { EmailDetailSheet } from '@/components/email-detail-sheet';
import { Email } from '@/lib/types';
import { Mail, Zap, AlertCircle, Trash2, Chrome, KeyRound } from 'lucide-react';

const MOCK_LOGIN_EMAIL = 'justin.chang@mail.utoronto.ca';
const LOGIN_STORAGE_KEY = 'emaiq_mock_logged_in';
const LOGIN_EMAIL_STORAGE_KEY = 'emaiq_mock_email';

type BootStage = 'boot' | 'signin' | 'welcome' | 'ready';

export default function InboxPage() {
  const { emails, archiveEmail, markAsSent, markAsRead, snoozeEmail, toggleFavorite } = useEmails();
  const { firstName } = useUser();
  const pathname = usePathname();

  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [bootStage, setBootStage] = useState<BootStage>('boot');
  const [welcomeLabel, setWelcomeLabel] = useState('Welcome');
  const [loginEmail, setLoginEmail] = useState(MOCK_LOGIN_EMAIL);

  useEffect(() => {
    setIsMounted(true);

    const storedEmail = localStorage.getItem(LOGIN_EMAIL_STORAGE_KEY) || MOCK_LOGIN_EMAIL;
    const isLoggedIn = localStorage.getItem(LOGIN_STORAGE_KEY) === 'true';

    setLoginEmail(storedEmail);

    if (isLoggedIn) {
      setWelcomeLabel(`Welcome back, ${firstName}`);
      setBootStage('welcome');

      const timer = setTimeout(() => {
        setBootStage('ready');
      }, 1600);

      return () => clearTimeout(timer);
    }

    setWelcomeLabel('Welcome to EmAIQ');
    setBootStage('boot');

    const timer = setTimeout(() => {
      setBootStage('signin');
    }, 1400);

    return () => clearTimeout(timer);
  }, [firstName]);

  const handleMockSignIn = useCallback(() => {
    localStorage.setItem(LOGIN_STORAGE_KEY, 'true');
    localStorage.setItem(LOGIN_EMAIL_STORAGE_KEY, loginEmail || MOCK_LOGIN_EMAIL);

    setWelcomeLabel(`Welcome, ${firstName}`);
    setBootStage('welcome');

    setTimeout(() => {
      setBootStage('ready');
    }, 1500);
  }, [firstName, loginEmail]);

  const handleInstantCleanUp = useCallback(() => {
    const noiseEmails = emails?.filter(
      (e) => (e.category?.toLowerCase() === 'noise' || e.urgency.label === 'Low') && !e.isActioned
    );
    noiseEmails?.forEach((email) => archiveEmail(email.id));
  }, [emails, archiveEmail]);

  const pageTitle = useMemo(() => {
    if (pathname === '/sent') return 'Sent';
    if (pathname === '/favorites') return 'Favorites';
    if (pathname === '/archived') return 'Archived';
    return 'Inbox';
  }, [pathname]);

  const currentSelectedEmail = useMemo(
    () => emails?.find((e) => e.id === selectedEmailId) || null,
    [emails, selectedEmailId]
  );

  const filteredEmails = useMemo(() => {
    let result = emails || [];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (email) =>
          email.sender.name.toLowerCase().includes(query) ||
          email.subject.toLowerCase().includes(query) ||
          email.body.toLowerCase().includes(query)
      );
    }
    return result;
  }, [emails, searchQuery]);

  const handleSelectEmail = useCallback(
    (email: Email) => {
      markAsRead(email.id);
      setSelectedEmailId(email.id);
      setIsDetailsOpen(true);
      setIsDrafting(false);
    },
    [markAsRead]
  );

  const stats = useMemo(() => {
    const safeEmails = emails || [];
    const unread = safeEmails.filter((e) => !e.isRead && !e.isActioned).length;
    const urgentCount = safeEmails.filter((e) => e.urgency.label === 'High' && !e.isActioned).length;
    const focusHours = (urgentCount * 0.25).toFixed(1);
    return { unread, urgent: urgentCount, focusTime: `${focusHours}h` };
  }, [emails]);

  if (!isMounted || bootStage === 'boot' || bootStage === 'welcome') {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
        <Mail className="h-12 w-12 text-primary animate-pulse" />
        <p className="mt-6 text-[11px] font-black uppercase tracking-[0.4em] text-foreground">
          {welcomeLabel}
        </p>
      </div>
    );
  }

  if (bootStage === 'signin') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background px-6">
        <div className="w-full max-w-md rounded-[2.5rem] border border-border bg-card p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <div className="mb-8 flex flex-col items-center text-center">
            <Mail className="h-12 w-12 text-primary" />
            <p className="mt-6 text-[11px] font-black uppercase tracking-[0.4em] text-foreground">
              Welcome to EmAIQ
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground">Sign in as:</h1>
            <p className="mt-2 text-sm text-muted-foreground">{loginEmail}</p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleMockSignIn}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-border bg-background text-sm font-bold text-foreground transition-colors hover:bg-muted/50"
            >
              <Chrome className="h-5 w-5" />
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleMockSignIn}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-border bg-background text-sm font-bold text-foreground transition-colors hover:bg-muted/50"
            >
              <Mail className="h-5 w-5" />
              Continue with Outlook
            </button>

            <button
              type="button"
              onClick={handleMockSignIn}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-border bg-background text-sm font-bold text-foreground transition-colors hover:bg-muted/50"
            >
              <KeyRound className="h-5 w-5" />
              Continue with Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-background animate-in fade-in duration-500">
        <Header
          title={pageTitle}
          searchValue={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
        />

        <main className="flex-1 overflow-y-auto flex flex-col w-full scrollbar-hide">
          <div className="px-10 pb-8 pt-10">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
              <KPICard title="Unread" value={stats.unread} icon={Mail} subtitle="Messages" onClick={() => setActiveTab('all')} />
              <KPICard title="Urgent" value={stats.urgent} icon={AlertCircle} subtitle="Actions" variant="danger" onClick={() => setActiveTab('action')} />
              <KPICard title="Noise" value="21%" icon={Trash2} subtitle="Auto-filtered" variant="warning" onClick={() => setActiveTab('noise')} />
              <KPICard title="Focus Time" value={stats.focusTime} icon={Zap} subtitle="Remaining" onClick={() => setActiveTab('all')} />
            </div>
          </div>

          <div className="flex-1 px-10 pb-10">
            <div className="relative flex min-h-[500px] flex-col overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl">
              <EmailList
                emails={filteredEmails}
                selectedEmail={currentSelectedEmail}
                onSelectEmail={handleSelectEmail}
                onToggleFavorite={toggleFavorite}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onInstantCleanUp={handleInstantCleanUp}
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
          onSnooze={(id, hours) => snoozeEmail(id, hours)}
          isDrafting={isDrafting}
          setIsDrafting={setIsDrafting}
        />
      </div>
    </AppShell>
  );
}