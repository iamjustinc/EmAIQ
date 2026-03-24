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
import { Mail, Zap, AlertCircle, Trash2, Chrome, Loader2 } from 'lucide-react';

const MOCK_LOGIN_EMAIL = 'example@example.com';
const MOCK_LOGIN_NAME = 'Example';
const LOGIN_STORAGE_KEY = 'emaiq_mock_logged_in';

type BootStage = 'boot' | 'welcome' | 'signin' | 'password' | 'signing-in' | 'ready';

export default function InboxPage() {
  const { emails, archiveEmail, markAsSent, markAsRead, snoozeEmail, toggleFavorite } = useEmails();
  const { firstName, primaryEmail, setFirstName, setPrimaryEmail } = useUser();
  const pathname = usePathname();

  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [bootStage, setBootStage] = useState<BootStage>('boot');
  const [loginFirstName, setLoginFirstName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [rememberMe, setRememberMe] = useState(true);


  useEffect(() => {
    setIsMounted(true);

    const isLoggedIn = localStorage.getItem(LOGIN_STORAGE_KEY) === 'true';

    if (isLoggedIn) {
      setBootStage('ready');
      return;
    }

    setLoginFirstName('');
    setLoginEmail('');
    setBootStage('welcome');

    const timer = setTimeout(() => {
      setBootStage('signin');
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  const handleIdentityConfirm = useCallback(() => {
    setBootStage('password');
  }, []);
  
  const handlePasswordConfirm = useCallback(() => {
    const safeName = loginFirstName.trim() || MOCK_LOGIN_NAME;
    const safeEmail = loginEmail.trim() || MOCK_LOGIN_EMAIL;
  
    setFirstName(safeName);
    setPrimaryEmail(safeEmail);
  
    if (rememberMe) {
      localStorage.setItem(LOGIN_STORAGE_KEY, 'true');
    } else {
      localStorage.removeItem(LOGIN_STORAGE_KEY);
    }
    setBootStage('signing-in');
  
    setTimeout(() => {
      setBootStage('ready');
    }, 3000);
  }, [loginFirstName, loginEmail, setFirstName, setPrimaryEmail]);

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

  if (!isMounted || bootStage === 'boot') {
    return <div className="fixed inset-0 z-[100] bg-background" />;
  }

  if (bootStage === 'welcome') {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
        <Mail className="h-12 w-12 text-primary animate-pulse" />
        <p className="mt-6 text-[11px] font-black uppercase tracking-[0.4em] text-foreground">
          Welcome to EmAIQ
        </p>
      </div>
    );
  }

  if (bootStage === 'signing-in') {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-6 text-[11px] font-black uppercase tracking-[0.4em] text-foreground">
          Signing In...
        </p>
      </div>
    );
  }

  if (bootStage === 'password') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background px-6">
        <div className="w-full max-w-md rounded-[2.5rem] border border-border bg-card p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <div className="mb-8 flex flex-col items-center text-center">
            <Mail className="h-12 w-12 text-primary" />
            <p className="mt-6 text-[11px] font-black uppercase tracking-[0.4em] text-foreground">
              Welcome to EmAIQ
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground">
              Enter password
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Signing in as {loginEmail || 'example@example.com'}
            </p>
          </div>
  
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 pr-20 text-sm font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-[#7FC6DA] hover:opacity-80"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
  
            <button
              type="button"
              onClick={handlePasswordConfirm}
              disabled={loginPassword.trim().length === 0}
              className={`mt-2 flex h-14 w-full items-center justify-center rounded-xl text-sm font-black text-white transition-all
                ${
                  loginPassword.trim().length === 0
                    ? 'bg-[#7FC6DA]/30 cursor-not-allowed opacity-60'
                    : 'bg-[#7FC6DA] hover:opacity-90'
                }
              `}
            >
              Confirm
            </button>
  
            <button
              type="button"
              onClick={() => setBootStage('signin')}
              className="flex h-12 w-full items-center justify-center rounded-xl border border-border bg-background text-sm font-bold text-foreground transition-colors hover:bg-muted/50"
            >
              Back
            </button>
          </div>
        </div>
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
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                First Name
              </label>
              <input
                type="text"
                value={loginFirstName}
                onChange={(e) => setLoginFirstName(e.target.value)}
                placeholder="Example"
                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Email Address
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@example.com"
                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
              />
            </div>

            <button
  type="button"
  onClick={handleIdentityConfirm}
  disabled={
    loginFirstName.trim().length === 0 ||
    loginEmail.trim().length === 0 ||
    !loginEmail.includes('@') ||
    !loginEmail.includes('.')
  }
  className={`mt-2 flex h-14 w-full items-center justify-center rounded-xl text-sm font-black text-white transition-all
    ${
      loginFirstName.trim().length === 0 ||
      loginEmail.trim().length === 0 ||
      !loginEmail.includes('@') ||
      !loginEmail.includes('.')
        ? 'bg-[#7FC6DA]/30 cursor-not-allowed opacity-60'
        : 'bg-[#7FC6DA] hover:opacity-90'
    }
  `}
>
  Confirm
</button>

<label className="mt-3 flex items-center gap-3 text-sm font-medium text-foreground cursor-pointer">
  <input
    type="checkbox"
    checked={rememberMe}
    onChange={(e) => setRememberMe(e.target.checked)}
    className="h-4 w-4 rounded border border-border accent-[#7FC6DA]"
  />
  <span>Remember me</span>
</label>

          </div>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
              Or log in with
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleIdentityConfirm}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-border bg-background text-sm font-bold text-foreground transition-colors hover:bg-muted/50"
            >
              <Chrome className="h-5 w-5" />
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleIdentityConfirm}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-border bg-background text-sm font-bold text-foreground transition-colors hover:bg-muted/50"
            >
              <Mail className="h-5 w-5" />
              Continue with Outlook
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
        <div className="px-4 pb-6 pt-6 sm:px-6 sm:pb-7 sm:pt-7 md:px-8 lg:px-10 lg:pb-8 lg:pt-10">
  <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
    <KPICard title="Unread" value={stats.unread} icon={Mail} subtitle="Messages" onClick={() => setActiveTab('all')} />
    <KPICard title="Urgent" value={stats.urgent} icon={AlertCircle} subtitle="Actions" variant="danger" onClick={() => setActiveTab('action')} />
    <KPICard title="Noise" value="21%" icon={Trash2} subtitle="Auto-filtered" variant="warning" onClick={() => setActiveTab('noise')} />
    <KPICard title="Focus Time" value={stats.focusTime} icon={Zap} subtitle="Remaining" onClick={() => setActiveTab('all')} />
  </div>
</div>

          <div className="flex-1 px-4 pb-6 sm:px-6 sm:pb-8 md:px-8 lg:px-10 lg:pb-10">
          <div className="relative flex min-h-[420px] flex-col overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-2xl sm:min-h-[460px] sm:rounded-[2rem] lg:min-h-[500px] lg:rounded-[2.5rem]">
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