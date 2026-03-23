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
} from 'lucide-react';

type SettingsView =
  | 'menu'
  | 'profile'
  | 'emailAccounts'
  | 'passwordSecurity'
  | 'appearance'
  | 'aiConfig';

const AI_SETTINGS_STORAGE_KEY = 'emaiq-ai-settings';

export default function SettingsPage() {
  const { firstName, signOff, setProfile } = useUserStore();
  const { themePreset, density, fontScale } = useAppearanceSettings();

  const [view, setView] = useState<SettingsView>('menu');

  const [firstNameDraft, setFirstNameDraft] = useState(firstName);
  const [signOffDraft, setSignOffDraft] = useState(signOff);

  const [draftTone, setDraftTone] = useState([75]);
  const [autoSummarization, setAutoSummarization] = useState(true);

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

  const headerTitle = useMemo(() => {
    const titles: Record<SettingsView, string> = {
      menu: 'Settings',
      profile: 'Edit Profile',
      emailAccounts: 'Email Accounts',
      passwordSecurity: 'Security',
      appearance: 'Appearance',
      aiConfig: 'AI Intelligence',
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
    setProfile(firstNameDraft, signOffDraft);
    toast.success('Profile and sign-off updated!');
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
                        Sign-off: {signOff}
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
                      label: 'Security & Privacy',
                      icon: Shield,
                      desc: 'Passwords and passcodes',
                      target: 'passwordSecurity',
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
                          Email Sign-Off Phrase
                        </Label>
                        <Input
                          value={signOffDraft}
                          onChange={(e) => setSignOffDraft(e.target.value)}
                          className="h-12 rounded-xl border-border bg-muted/30"
                          placeholder="e.g. Best, Cheers, Sincerely"
                        />
                        <p className="ml-1 text-[10px] text-muted-foreground">
                          This will be used by AI when generating email drafts.
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

            {view === 'passwordSecurity' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-[2rem] border border-border bg-card p-8 shadow-xl">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                      <KeyRound className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight">Access Control</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label className="ml-1 text-[10px] font-black uppercase tracking-widest opacity-50">
                          New Password
                        </Label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="h-12 rounded-xl border-border bg-muted/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="ml-1 text-[10px] font-black uppercase tracking-widest opacity-50">
                          Confirm Password
                        </Label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="h-12 rounded-xl border-border bg-muted/30"
                        />
                      </div>
                    </div>
                    <Button className="h-12 w-full rounded-xl bg-primary text-[10px] font-bold uppercase tracking-widest">
                      Update Access
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {view === 'appearance' && <AppearanceSettingsPanel />}
          </div>
        </div>
      </div>
    </AppShell>
  );
}