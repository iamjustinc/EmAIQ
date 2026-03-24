'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { useUserStore } from '@/store/use-user-store';
import { useAppearanceSettings } from '@/lib/appearance-context';
import { AppearanceSettingsPanel } from '@/components/appearance/appearance-settings-panel';
import { toast } from 'sonner';
import {
  User,
  Shield,
  Palette,
  ChevronRight,
  ArrowLeft,
  KeyRound,
  BrainCircuit,
  Type,
  BellRing,
  Plus,
  X,
  LogOut,
  Mail,
  Chrome,
  Loader2,
  Database,
} from 'lucide-react';

type SettingsView =
  | 'menu'
  | 'profile'
  | 'emailAccounts'
  | 'passwordSecurity'
  | 'privacyData'
  | 'appearance'
  | 'aiConfig'
  | 'priorityPreferences';

  const AI_SETTINGS_STORAGE_KEY = 'emaiq-ai-settings';
  const PRIORITY_SETTINGS_STORAGE_KEY = 'emaiq-priority-settings';
  const LOGGED_IN_EMAIL = 'jason@emaiq.app';

export default function SettingsPage() {
  const { firstName, signOff, setProfile } = useUserStore();
  const { themePreset, density, fontScale } = useAppearanceSettings();

  const [view, setView] = useState<SettingsView>('menu');

  const [firstNameDraft, setFirstNameDraft] = useState(firstName);
  const [signOffDraft, setSignOffDraft] = useState(signOff);

  const [draftTone, setDraftTone] = useState([75]);
  const [autoSummarization, setAutoSummarization] = useState(true);

  const [vipSenders, setVipSenders] = useState<string[]>([
    'manager@company.com',
    'vp-sales@company.com',
  ]);
  const [priorityTeams, setPriorityTeams] = useState<string[]>([
    'Leadership',
    'Finance',
    'Customer Success',
  ]);
  const [boostManagerEmails, setBoostManagerEmails] = useState(true);
  const [newVipSender, setNewVipSender] = useState('');
  const [newPriorityTeam, setNewPriorityTeam] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSwitchAccount, setShowSwitchAccount] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setFirstNameDraft(firstName);
    setSignOffDraft(signOff);
  }, [firstName, signOff, view]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = window.localStorage.getItem(AI_SETTINGS_STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (typeof parsed.draftTone === 'number') {
        setDraftTone([parsed.draftTone]);
      }
      if (typeof parsed.autoSummarization === 'boolean') {
        setAutoSummarization(parsed.autoSummarization);
      }
    } catch {
      // ignore bad localStorage data
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = window.localStorage.getItem(PRIORITY_SETTINGS_STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.vipSenders)) {
        setVipSenders(parsed.vipSenders.filter(Boolean));
      }
      if (Array.isArray(parsed.priorityTeams)) {
        setPriorityTeams(parsed.priorityTeams.filter(Boolean));
      }
      if (typeof parsed.boostManagerEmails === 'boolean') {
        setBoostManagerEmails(parsed.boostManagerEmails);
      }
    } catch {
      // ignore bad localStorage data
    }
  }, []);

  const headerTitle = useMemo(() => {
    const titles: Record<SettingsView, string> = {
      menu: 'Settings',
      profile: 'Edit Profile',
      emailAccounts: 'Email Accounts',
      passwordSecurity: 'Security',
      privacyData: 'Privacy & Data',
      appearance: 'Appearance',
      aiConfig: 'AI Intelligence',
      priorityPreferences: 'Priority Preferences',
    };
    return titles[view];
  }, [view]);

  const toneLabel = useMemo(() => {
    const value = draftTone[0] ?? 75;
    if (value <= 35) return 'Very Conservative';
    if (value <= 55) return 'Conservative';
    if (value <= 70) return 'Balanced';
    if (value <= 85) return 'Direct';
    return 'Very Direct';
  }, [draftTone]);

  const toneDescription = useMemo(() => {
    const value = draftTone[0] ?? 75;
    if (value <= 35) {
      return 'Drafts will sound more careful, polite, and lower-commitment.';
    }
    if (value <= 55) {
      return 'Drafts will stay measured and professional with softer language.';
    }
    if (value <= 70) {
      return 'Drafts will balance warmth, clarity, and confidence.';
    }
    if (value <= 85) {
      return 'Drafts will sound more decisive and action-oriented.';
    }
    return 'Drafts will be highly assertive, concise, and strongly directed.';
  }, [draftTone]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(firstNameDraft, signOff);
    toast.success('Profile updated!');
    setView('menu');
  };

  const handleAISave = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        AI_SETTINGS_STORAGE_KEY,
        JSON.stringify({
          draftTone: draftTone[0] ?? 75,
          autoSummarization,
        }),
      );
    }

    toast.success('AI preferences updated!');
    setView('menu');
  };

  const handleAddVipSender = () => {
    const value = newVipSender.trim();
    if (!value) return;
    if (vipSenders.includes(value)) {
      toast.error('That sender is already added.');
      return;
    }
    setVipSenders((prev) => [...prev, value]);
    setNewVipSender('');
  };

  const handleRemoveVipSender = (value: string) => {
    setVipSenders((prev) => prev.filter((item) => item !== value));
  };

  const handleAddPriorityTeam = () => {
    const value = newPriorityTeam.trim();
    if (!value) return;
    if (priorityTeams.includes(value)) {
      toast.error('That team is already added.');
      return;
    }
    setPriorityTeams((prev) => [...prev, value]);
    setNewPriorityTeam('');
  };

  const handleRemovePriorityTeam = (value: string) => {
    setPriorityTeams((prev) => prev.filter((item) => item !== value));
  };

  const handlePrioritySave = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        PRIORITY_SETTINGS_STORAGE_KEY,
        JSON.stringify({
          vipSenders,
          priorityTeams,
          boostManagerEmails,
        }),
      );
    }

    toast.success('Priority preferences updated!');
    setView('menu');
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);

    setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(AI_SETTINGS_STORAGE_KEY);
          window.localStorage.removeItem(PRIORITY_SETTINGS_STORAGE_KEY);
        }
        toast.success('Logged out successfully.');
        setShowLogoutConfirm(false);
        window.location.reload();
      } finally {
        setIsLoggingOut(false);
      }
    }, 900);
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-background">
        <Header title={headerTitle} hideSearch />

        <div className="flex-1 overflow-auto p-6 md:p-10">
          <div className="mx-auto max-w-2xl space-y-6">
            {view !== 'menu' && (
              <button
                onClick={() => setView('menu')}
                className="group mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Settings
              </button>
            )}

{view === 'menu' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-2xl transition-all hover:border-primary/20">
                  <div className="relative z-10 flex items-center gap-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-black text-primary-foreground shadow-lg shadow-primary/20">
                      {firstName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-black tracking-tight text-foreground">
                        {firstName}
                      </h3>
                      <p className="truncate text-sm text-muted-foreground">
                        Logged in as {LOGGED_IN_EMAIL}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setView('profile')}
                      className="rounded-xl border-border bg-background text-[10px] font-bold uppercase tracking-widest"
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                {[
                    {
                      label: 'Security',
                      icon: Shield,
                      desc: 'Sign-in method, sessions, and password access',
                      target: 'passwordSecurity',
                    },
                    {
                      label: 'Privacy & Data',
                      icon: Database,
                      desc: 'AI data usage, personalization, and reset controls',
                      target: 'privacyData',
                    },
                    {
                      label: 'Appearance',
                      icon: Palette,
                      desc: 'Themes and typography',
                      target: 'appearance',
                    },
                    {
                      label: 'AI Intelligence',
                      icon: BrainCircuit,
                      desc: 'Signature, draft tone, and summarization',
                      target: 'aiConfig',
                    },
                    {
                      label: 'Priority Preferences',
                      icon: BellRing,
                      desc: 'VIP senders, teams, and urgency boosts',
                      target: 'priorityPreferences',
                    },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setView(item.target as SettingsView)}
                      className="group flex items-center gap-4 rounded-[1.5rem] border border-border bg-card p-5 text-left transition-all hover:bg-muted/50 active:scale-[0.98]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-foreground">{item.label}</h4>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary" />
                    </button>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setShowSwitchAccount(true)}
                    className="group flex items-center gap-4 rounded-[1.5rem] border border-border bg-card p-5 text-left transition-all hover:bg-muted/50 active:scale-[0.98]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-foreground">Switch Account</h4>
                      <p className="text-xs text-muted-foreground">
                        Sign in with Google, Outlook, or email
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="group flex items-center gap-4 rounded-[1.5rem] border border-[#F6B3C4]/40 bg-card p-5 text-left transition-all hover:bg-[#F6B3C4]/10 active:scale-[0.98]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6B3C4]/15 text-[#D95D5D]">
                      <LogOut className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-[#D95D5D]">Log Out</h4>
                      <p className="text-xs text-muted-foreground">
                        Sign out of your current account
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

{view === 'profile' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-[2rem] border border-border bg-card p-8 shadow-xl">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight">Identity Settings</h3>
                  </div>

                  <form onSubmit={handleProfileSave} className="space-y-6">
                  <div className="grid gap-6">
  <div className="space-y-2">
    <Label className="ml-1 text-[10px] font-black uppercase tracking-widest opacity-50">
      Preferred First Name
    </Label>
    <Input
      value={firstNameDraft}
      onChange={(e) => setFirstNameDraft(e.target.value)}
      className="h-12 rounded-xl border-border bg-muted/30"
      placeholder="e.g. Justin"
    />
  </div>

  <div className="space-y-2">
    <Label className="ml-1 text-[10px] font-black uppercase tracking-widest opacity-50">
      Logged-In Email
    </Label>
    <div className="h-12 rounded-xl border border-border/80 bg-[#E7ECEC] px-4 flex items-center text-sm font-medium text-[#5F6B6B]">
      {LOGGED_IN_EMAIL}
    </div>
    <p className="ml-1 text-[10px] text-muted-foreground">
      This email is currently connected to your account.
    </p>
  </div>
</div>

                    <Button
                      type="submit"
                      className="h-14 w-full rounded-2xl bg-primary text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                    >
                      Save Profile Changes
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {view === 'aiConfig' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-[2rem] border border-border bg-card p-8 shadow-xl">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Type className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight">AI Email Preferences</h3>
                      <p className="text-xs text-muted-foreground">
                        Control how AI signs, drafts, and summarizes emails.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div className="space-y-3">
                      <Label className="ml-1 text-[10px] font-black uppercase tracking-widest opacity-50">
                        Email Signature
                      </Label>
                      <div className="rounded-xl border border-border bg-muted/20 p-4">
                        <p className="text-sm font-medium italic text-foreground">
                          "{signOff}, {firstName}"
                        </p>
                      </div>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setView('profile')}
                        className="h-auto p-0 text-[9px] font-bold uppercase text-primary"
                      >
                        Edit Signature
                      </Button>
                    </div>

                    <Separator className="opacity-50" />

                    <div className="space-y-5">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-primary">
                        <span>Conservative</span>
                        <span>Draft Tone</span>
                        <span>Aggressive</span>
                      </div>

                      <Slider
                        value={draftTone}
                        onValueChange={setDraftTone}
                        max={100}
                        step={1}
                        className="w-full py-4 [&_[role=slider]]:h-7 [&_[role=slider]]:w-7 [&_[role=slider]]:border-2 [&_[role=slider]]:border-[#A8D0D0] [&_[role=slider]]:bg-white [&_[role=slider]]:shadow-md [&>span:first-child]:h-2 [&>span:first-child]:bg-[#A8D0D0]/25 [&>span:first-child_span]:bg-[#7FC6DA]"
                      />

                      <div className="rounded-xl border border-border bg-muted/20 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-foreground">{toneLabel}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {toneDescription}
                            </p>
                          </div>
                          <div className="shrink-0 rounded-full border border-border bg-background px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                            {draftTone[0]}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="opacity-50" />

                    <div className="flex items-center justify-between gap-6">
                      <div>
                        <h4 className="text-sm font-bold">Auto-Summarization</h4>
                        <p className="text-xs text-muted-foreground">
                          Automatically summarize longer threads in the inbox view.
                        </p>
                      </div>
                      <Switch
                        checked={autoSummarization}
                        onCheckedChange={setAutoSummarization}
                      />
                    </div>

                    <Button
                      onClick={handleAISave}
                      className="h-14 w-full rounded-2xl bg-primary text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                    >
                      Save AI Preferences
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {view === 'priorityPreferences' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-[2rem] border border-border bg-card p-8 shadow-xl">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <BellRing className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight">Priority Preferences</h3>
                      <p className="text-xs text-muted-foreground">
                        Customize inbox prioritization beyond AI scoring.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div className="space-y-4">
                      <div>
                        <Label className="ml-1 text-[10px] font-black uppercase tracking-widest opacity-50">
                          VIP Senders
                        </Label>
                        <p className="ml-1 mt-1 text-xs text-muted-foreground">
                          Emails from these senders should receive a stronger urgency boost.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Input
                          value={newVipSender}
                          onChange={(e) => setNewVipSender(e.target.value)}
                          className="h-12 rounded-xl border-border bg-muted/30"
                          placeholder="e.g. manager@company.com"
                        />
                        <Button
                          type="button"
                          onClick={handleAddVipSender}
                          className="h-12 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest"
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Add
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {vipSenders.map((sender) => (
                          <div
                            key={sender}
                            className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-[10px] font-bold text-foreground shadow-sm"
                          >
                            <span>{sender}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveVipSender(sender)}
                              className="text-muted-foreground transition-colors hover:text-destructive"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="opacity-50" />

                    <div className="space-y-4">
                      <div>
                        <Label className="ml-1 text-[10px] font-black uppercase tracking-widest opacity-50">
                          Priority Teams / Departments
                        </Label>
                        <p className="ml-1 mt-1 text-xs text-muted-foreground">
                          Boost urgency when an email is associated with these groups.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Input
                          value={newPriorityTeam}
                          onChange={(e) => setNewPriorityTeam(e.target.value)}
                          className="h-12 rounded-xl border-border bg-muted/30"
                          placeholder="e.g. Finance or Leadership"
                        />
                        <Button
                          type="button"
                          onClick={handleAddPriorityTeam}
                          className="h-12 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest"
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Add
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {priorityTeams.map((team) => (
                          <div
                            key={team}
                            className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-[10px] font-bold text-foreground shadow-sm"
                          >
                            <span>{team}</span>
                            <button
                              type="button"
                              onClick={() => handleRemovePriorityTeam(team)}
                              className="text-muted-foreground transition-colors hover:text-destructive"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="opacity-50" />

                    <div className="flex items-center justify-between gap-6">
                      <div>
                        <h4 className="text-sm font-bold">Manager Role Boost</h4>
                        <p className="text-xs text-muted-foreground">
                          Prioritize emails that appear to come from manager-level roles.
                        </p>
                      </div>
                      <Switch
                        checked={boostManagerEmails}
                        onCheckedChange={setBoostManagerEmails}
                      />
                    </div>

                    <Button
                      onClick={handlePrioritySave}
                      className="h-14 w-full rounded-2xl bg-primary text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                    >
                      Save Priority Preferences
                    </Button>
                  </div>
                </div>
              </div>
            )}

{view === 'passwordSecurity' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-[2rem] border border-border bg-card p-8 shadow-xl">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight">Security</h3>
                      <p className="text-xs text-muted-foreground">
                        Manage sign-in access and session security.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <Label className="ml-1 text-[10px] font-black uppercase tracking-widest opacity-50">
                        Sign-In Method
                      </Label>
                      <div className="rounded-xl border border-border bg-muted/20 p-4">
                        <p className="text-sm font-bold text-foreground">Outlook</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Your password is managed through Outlook or Microsoft.
                        </p>
                      </div>
                    </div>

                    <Separator className="opacity-50" />

                    <div className="space-y-3">
                      <Label className="ml-1 text-[10px] font-black uppercase tracking-widest opacity-50">
                        Current Session
                      </Label>
                      <div className="rounded-xl border border-border bg-muted/20 p-4">
                        <p className="text-sm font-bold text-foreground">{LOGGED_IN_EMAIL}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          This session is currently active on this device.
                        </p>
                      </div>
                    </div>

                    <Separator className="opacity-50" />

                    <div className="space-y-3">
                      <Label className="ml-1 text-[10px] font-black uppercase tracking-widest opacity-50">
                        Password Access
                      </Label>
                      <div className="rounded-xl border border-border bg-[#EAF0F6] p-4">
                        <p className="text-sm font-bold text-foreground">
                          Password changes are not managed here
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Because this account uses Outlook sign-in, password updates should be made through your email provider.
                        </p>
                      </div>
                    </div>

                    <Separator className="opacity-50" />

                    <div className="grid gap-4 md:grid-cols-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowSwitchAccount(true)}
                        className="h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                      >
                        Switch Account
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowLogoutConfirm(true)}
                        className="h-12 rounded-xl border-[#F6B3C4]/60 text-[#D95D5D] hover:bg-[#F6B3C4]/10 text-[10px] font-bold uppercase tracking-widest"
                      >
                        Log Out
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === 'privacyData' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-[2rem] border border-border bg-card p-8 shadow-xl">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight">Privacy & Data</h3>
                      <p className="text-xs text-muted-foreground">
                        Review how EmAIQ uses personalization and inbox data.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <Label className="ml-1 text-[10px] font-black uppercase tracking-widest opacity-50">
                        AI Data Usage
                      </Label>
                      <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-foreground">Email-based prioritization</p>
                            <p className="text-xs text-muted-foreground">
                              EmAIQ may use inbox context to personalize urgency and ranking.
                            </p>
                          </div>
                          <Switch checked />
                        </div>

                        <Separator className="opacity-40" />

                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-foreground">AI summaries and drafts</p>
                            <p className="text-xs text-muted-foreground">
                              EmAIQ may use email content to generate summaries and draft responses.
                            </p>
                          </div>
                          <Switch checked />
                        </div>
                      </div>
                    </div>

                    <Separator className="opacity-50" />

                    <div className="space-y-3">
                      <Label className="ml-1 text-[10px] font-black uppercase tracking-widest opacity-50">
                        Personalization Memory
                      </Label>
                      <div className="rounded-xl border border-border bg-muted/20 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-foreground">Remember my preferences</p>
                            <p className="text-xs text-muted-foreground">
                              Save AI tone, urgency preferences, and personalization choices for this account.
                            </p>
                          </div>
                          <Switch checked />
                        </div>
                      </div>
                    </div>

                    <Separator className="opacity-50" />

                    <div className="space-y-3">
                      <Label className="ml-1 text-[10px] font-black uppercase tracking-widest opacity-50">
                        Reset Controls
                      </Label>
                      <div className="rounded-xl border border-[#F6B3C4]/40 bg-[#FFF7F8] p-4">
                        <p className="text-sm font-bold text-foreground">Clear personalization data</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Reset saved AI preferences, urgency customization, and learned personalization signals.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4 h-10 rounded-xl border-[#F6B3C4]/60 text-[#D95D5D] hover:bg-[#F6B3C4]/10 text-[10px] font-bold uppercase tracking-widest"
                        >
                          Reset Privacy Data
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === 'appearance' && <AppearanceSettingsPanel />}

{view === 'appearance' && <AppearanceSettingsPanel />}
          </div>
        </div>

{showSwitchAccount && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
    <div className="relative w-full max-w-md rounded-[2rem] border border-[#D7E6E6] bg-white p-8 shadow-[0_25px_80px_rgba(0,0,0,0.18)]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black tracking-tight text-[#2D3436]">Switch Account</h3>
          <p className="text-sm text-[#6B7280]">
            Choose a sign-in method for another account.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowSwitchAccount(false)}
          className="rounded-full p-2 text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#2D3436]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-[#D7E6E6] bg-white text-sm font-bold text-[#2D3436] transition-colors hover:bg-[#F8FAFA]"
        >
          <Chrome className="h-5 w-5" />
          Continue with Google
        </button>

        <button
          type="button"
          className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-[#D7E6E6] bg-white text-sm font-bold text-[#2D3436] transition-colors hover:bg-[#F8FAFA]"
        >
          <Mail className="h-5 w-5" />
          Continue with Outlook
        </button>

        <button
          type="button"
          className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-[#D7E6E6] bg-white text-sm font-bold text-[#2D3436] transition-colors hover:bg-[#F8FAFA]"
        >
          <KeyRound className="h-5 w-5" />
          Continue with Email
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </AppShell>
  );
}