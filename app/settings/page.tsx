'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider'; // Ensure you have this shadcn component
import { useUser } from '@/lib/user-context';
import { useAppearanceSettings } from '@/lib/appearance-context';
import { getThemeMeta } from '@/lib/appearance/theme-metadata';
import { AppearanceSettingsPanel } from '@/components/appearance/appearance-settings-panel';
import { toast } from 'sonner';
import {
  User,
  Bell,
  Shield,
  Palette,
  Mail,
  Zap,
  ChevronRight,
  ArrowLeft,
  Trash2,
  KeyRound,
  Lock,
  Smartphone,
  BrainCircuit,
} from 'lucide-react';

type SettingsView = 'menu' | 'profile' | 'emailAccounts' | 'passwordSecurity' | 'appearance' | 'aiConfig';

function formatSettingLabel(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function SettingsPage() {
  const {
    firstName, setFirstName, primaryEmail, setPrimaryEmail,
    connectedAccounts, addConnectedAccount, removeConnectedAccount,
    passcodeEnabled, setPasscodeEnabled, hasPasscode, setPasscode,
    changePasscode, twoFactorEnabled, setTwoFactorEnabled,
    hasPassword, passwordLastChanged, changePassword,
  } = useUser();

  const { themePreset, density, fontScale } = useAppearanceSettings();
  const [view, setView] = useState<SettingsView>('menu');
  const [newAccountEmail, setNewAccountEmail] = useState('');
  const [primaryDraft, setPrimaryDraft] = useState('');
  const [urgencyThreshold, setUrgencyThreshold] = useState([75]);

  useEffect(() => {
    setPrimaryDraft(primaryEmail);
  }, [primaryEmail, view]);

  // Form States
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pinNew, setPinNew] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinCurrent, setPinCurrent] = useState('');
  const [showPinChange, setShowPinChange] = useState(false);

  const headerTitle = useMemo(() => {
    const titles: Record<SettingsView, string> = {
      menu: 'Settings',
      profile: 'Edit Profile',
      emailAccounts: 'Email Accounts',
      passwordSecurity: 'Security',
      appearance: 'Appearance',
      aiConfig: 'AI Intelligence'
    };
    return titles[view];
  }, [view]);

  // View Handlers
  const navigateTo = (newView: SettingsView) => setView(newView);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await changePassword({ current: hasPassword ? pwCurrent : undefined, next: pwNew, confirm: pwConfirm });
    if (!res.ok) return toast.error(res.error);
    setPwCurrent(''); setPwNew(''); setPwConfirm('');
    toast.success('Security updated');
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-background">
        <Header title={headerTitle} hideSearch />

        <div className="flex-1 overflow-auto p-6 md:p-10">
          <div className="mx-auto max-w-2xl space-y-6">
            
            {/* BACK BUTTON */}
            {view !== 'menu' && (
              <button
                onClick={() => { setView('menu'); setShowPinChange(false); }}
                className="group mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Settings
              </button>
            )}

            {/* MAIN MENU */}
            {view === 'menu' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* ACCOUNT SUMMARY CARD */}
                <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-2xl transition-all hover:border-primary/20">
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-black text-primary-foreground shadow-lg shadow-primary/20">
                            {firstName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-black tracking-tight text-foreground">{firstName}</h3>
                            <p className="truncate text-sm text-muted-foreground">{primaryEmail}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setView('profile')} className="rounded-xl border-border bg-background font-bold uppercase tracking-widest text-[10px]">
                            Edit
                        </Button>
                    </div>
                </div>

                {/* SETTINGS SECTIONS */}
                <div className="grid gap-4">
                  {[
                    { label: 'Security & Privacy', icon: Shield, desc: 'Passwords, 2FA, and Passcodes', target: 'passwordSecurity' },
                    { label: 'Appearance', icon: Palette, desc: 'Themes, density, and typography', target: 'appearance' },
                    { label: 'Email Connections', icon: Mail, desc: 'Manage linked mailboxes', target: 'emailAccounts' },
                    { label: 'AI Intelligence', icon: BrainCircuit, desc: 'Urgency levels and automation', target: 'aiConfig' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => navigateTo(item.target as SettingsView)}
                      className="group flex items-center gap-4 rounded-[1.5rem] border border-border bg-card p-5 text-left transition-all hover:bg-muted/50 active:scale-[0.98]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
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

            {/* AI CONFIGURATION VIEW */}
            {view === 'aiConfig' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-[2rem] border border-border bg-card p-8 shadow-xl">
                  <div className="mb-8">
                    <h3 className="text-lg font-black tracking-tight text-foreground">AI Urgency Threshold</h3>
                    <p className="text-sm text-muted-foreground">Adjust when an email is flagged as "Urgent" based on AI confidence.</p>
                  </div>
                  
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary">
                        <span>Conservative</span>
                        <span>{urgencyThreshold}% Confidence</span>
                        <span>Aggressive</span>
                      </div>
                      <Slider 
                        value={urgencyThreshold} 
                        onValueChange={setUrgencyThreshold} 
                        max={100} 
                        step={1} 
                        className="py-4"
                      />
                    </div>

                    <Separator className="opacity-50" />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold">Auto-Summarization</h4>
                        <p className="text-xs text-muted-foreground">AI will summarize threads longer than 3 emails.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PASSWORD & SECURITY VIEW (Simplified/Cleaned) */}
            {view === 'passwordSecurity' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="rounded-[2rem] border border-border bg-card p-8 shadow-xl">
                        <div className="mb-8 flex items-center gap-4">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                                <KeyRound className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-black tracking-tight">Access Control</h3>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">New Password</Label>
                                    <Input type="password" value={pwNew} onChange={(e) => setPwNew(e.target.value)} className="h-12 rounded-xl bg-muted/30 border-border" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Confirm Password</Label>
                                    <Input type="password" value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)} className="h-12 rounded-xl bg-muted/30 border-border" />
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-12 rounded-xl bg-primary font-bold uppercase tracking-widest text-[10px]">Update Access</Button>
                        </form>
                    </div>

                    {/* PASSCODE BLOCK */}
                    <div className="rounded-[2rem] border border-border bg-card p-8 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Device Passcode</h4>
                                    <p className="text-xs text-muted-foreground">Lock screen after 5 minutes of inactivity.</p>
                                </div>
                            </div>
                            <Switch checked={passcodeEnabled} onCheckedChange={setPasscodeEnabled} />
                        </div>
                    </div>
                </div>
            )}

            {/* PORT EXISTING VIEWS (Profile, EmailAccounts, Appearance) below using the same rounded-[2rem] patterns */}
            {view === 'appearance' && <AppearanceSettingsPanel />}
            
          </div>
        </div>
      </div>
    </AppShell>
  );
}