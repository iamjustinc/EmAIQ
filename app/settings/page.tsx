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
import { useUserStore } from '@/store/use-user-store'; // Using your Zustand store
import { useAppearanceSettings } from '@/lib/appearance-context';
import { AppearanceSettingsPanel } from '@/components/appearance/appearance-settings-panel';
import { toast } from 'sonner';
import {
  User,
  Shield,
  Palette,
  Mail,
  ChevronRight,
  ArrowLeft,
  KeyRound,
  Lock,
  BrainCircuit,
  Type,
} from 'lucide-react';

type SettingsView = 'menu' | 'profile' | 'emailAccounts' | 'passwordSecurity' | 'appearance' | 'aiConfig';

export default function SettingsPage() {
  // Pulling from your Zustand Store
  const { firstName, signOff, setProfile } = useUserStore();
  
  const { themePreset, density, fontScale } = useAppearanceSettings();
  const [view, setView] = useState<SettingsView>('menu');
  
  // Local state for the form inputs
  const [firstNameDraft, setFirstNameDraft] = useState(firstName);
  const [signOffDraft, setSignOffDraft] = useState(signOff);
  const [urgencyThreshold, setUrgencyThreshold] = useState([75]);

  // Sync local draft when store changes or view changes
  useEffect(() => {
    setFirstNameDraft(firstName);
    setSignOffDraft(signOff);
  }, [firstName, signOff, view]);

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

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(firstNameDraft, signOffDraft);
    toast.success('Profile and Sign-off updated!');
    setView('menu');
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
                onClick={() => setView('menu')}
                className="group mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Settings
              </button>
            )}

            {/* MAIN MENU */}
            {view === 'menu' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-2xl transition-all hover:border-primary/20">
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-black text-primary-foreground shadow-lg shadow-primary/20">
                            {firstName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-black tracking-tight text-foreground">{firstName}</h3>
                            <p className="truncate text-sm text-muted-foreground">Sign-off: {signOff}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setView('profile')} className="rounded-xl border-border bg-background font-bold uppercase tracking-widest text-[10px]">
                            Edit Profile
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4">
                  {[
                    { label: 'Security & Privacy', icon: Shield, desc: 'Passwords and Passcodes', target: 'passwordSecurity' },
                    { label: 'Appearance', icon: Palette, desc: 'Themes and typography', target: 'appearance' },
                    { label: 'AI Intelligence', icon: BrainCircuit, desc: 'Urgency and Sign-offs', target: 'aiConfig' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setView(item.target as SettingsView)}
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

            {/* PROFILE EDIT VIEW */}
            {view === 'profile' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-[2rem] border border-border bg-card p-8 shadow-xl">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <User className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight">Identity Settings</h3>
                  </div>

                  <form onSubmit={handleProfileSave} className="space-y-6">
                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Preferred First Name</Label>
                        <Input 
                          value={firstNameDraft} 
                          onChange={(e) => setFirstNameDraft(e.target.value)} 
                          className="h-12 rounded-xl bg-muted/30 border-border" 
                          placeholder="e.g. Justin"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Email Sign-Off Phrase</Label>
                        <Input 
                          value={signOffDraft} 
                          onChange={(e) => setSignOffDraft(e.target.value)} 
                          className="h-12 rounded-xl bg-muted/30 border-border" 
                          placeholder="e.g. Best, Cheers, Sincerely"
                        />
                        <p className="text-[10px] text-muted-foreground ml-1">This will be used by AI when generating email drafts.</p>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-14 rounded-2xl bg-primary font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                      Save Profile Changes
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* AI CONFIGURATION VIEW */}
            {view === 'aiConfig' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-[2rem] border border-border bg-card p-8 shadow-xl">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Type className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight">Email Intelligence</h3>
                      <p className="text-xs text-muted-foreground">Customize how the AI communicates for you.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-10">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">AI Sign-Off Strategy</Label>
                      <div className="rounded-xl border border-border p-4 bg-muted/20">
                        <p className="text-xs font-medium text-foreground italic">"{signOff}, {firstName}"</p>
                      </div>
                      <Button variant="link" size="sm" onClick={() => setView('profile')} className="text-[9px] p-0 h-auto font-bold uppercase text-primary">Change Signature</Button>
                    </div>

                    <Separator className="opacity-50" />

                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary">
                        <span>Conservative</span>
                        <span>{urgencyThreshold}% Confidence</span>
                        <span>Aggressive</span>
                      </div>
                      <Slider value={urgencyThreshold} onValueChange={setUrgencyThreshold} max={100} step={1} className="py-4" />
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

            {/* SECURITY VIEW */}
            {view === 'passwordSecurity' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="rounded-[2rem] border border-border bg-card p-8 shadow-xl">
                        <div className="mb-8 flex items-center gap-4">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                                <KeyRound className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-black tracking-tight">Access Control</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">New Password</Label>
                                    <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-muted/30 border-border" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Confirm Password</Label>
                                    <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-muted/30 border-border" />
                                </div>
                            </div>
                            <Button className="w-full h-12 rounded-xl bg-primary font-bold uppercase tracking-widest text-[10px]">Update Access</Button>
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