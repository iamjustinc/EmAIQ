'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
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
} from 'lucide-react';

type SettingsView = 'menu' | 'profile' | 'emailAccounts' | 'passwordSecurity' | 'appearance';

function formatSettingLabel(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function SettingsPage() {
  const {
    firstName,
    setFirstName,
    primaryEmail,
    setPrimaryEmail,
    connectedAccounts,
    addConnectedAccount,
    removeConnectedAccount,
    passcodeEnabled,
    setPasscodeEnabled,
    hasPasscode,
    setPasscode,
    changePasscode,
    twoFactorEnabled,
    setTwoFactorEnabled,
    hasPassword,
    passwordLastChanged,
    changePassword,
  } = useUser();

  const { themePreset, density, fontScale } = useAppearanceSettings();

  const [view, setView] = useState<SettingsView>('menu');

  const [newAccountEmail, setNewAccountEmail] = useState('');
  const [primaryDraft, setPrimaryDraft] = useState('');

  useEffect(() => {
    setPrimaryDraft(primaryEmail);
  }, [primaryEmail, view]);

  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');

  const [pinNew, setPinNew] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinCurrent, setPinCurrent] = useState('');
  const [showPinChange, setShowPinChange] = useState(false);

  const headerTitle = useMemo(() => {
    switch (view) {
      case 'profile':
        return 'Edit Profile';
      case 'emailAccounts':
        return 'Email Accounts';
      case 'passwordSecurity':
        return 'Password & Security';
      case 'appearance':
        return 'Appearance';
      default:
        return 'Settings';
    }
  }, [view]);

  const settingsSections = [
    {
      title: 'Account',
      description: 'Manage your account settings and preferences',
      icon: User,
      items: ['Profile', 'Email accounts', 'Password & security'] as const,
    },
    {
      title: 'Notifications',
      description: 'Configure how you receive alerts and updates',
      icon: Bell,
      items: ['Email notifications', 'Push notifications', 'Digest frequency'] as const,
    },
    {
      title: 'AI Settings',
      description: 'Customize AI behavior and analysis preferences',
      icon: Zap,
      items: ['Urgency thresholds', 'Auto-archive rules', 'Summary style'] as const,
    },
    {
      title: 'Privacy',
      description: 'Control your data and privacy settings',
      icon: Shield,
      items: ['Data retention', 'Export data', 'Delete account'] as const,
    },
    {
      title: 'Appearance',
      description: 'Customize the look and feel of EmailIQ',
      icon: Palette,
      items: ['Theme', 'Density', 'Font size'] as const,
    },
  ];

  function handleAccountItem(item: string) {
    if (item === 'Profile') {
      setView('profile');
      return;
    }
    if (item === 'Email accounts') {
      setView('emailAccounts');
      return;
    }
    if (item === 'Password & security') {
      setView('passwordSecurity');
      return;
    }
    toast.info('Coming soon', { description: `${item} will be available in a future update.` });
  }

  function handleAppearanceItem(item: string) {
    if (item === 'Theme' || item === 'Density' || item === 'Font size') {
      setView('appearance');
      return;
    }
    toast.info('Coming soon', { description: `${item} will be available in a future update.` });
  }

  async function handleSavePrimaryEmail() {
    const trimmed = primaryDraft.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error('Invalid email', { description: 'Enter a valid primary email address.' });
      return;
    }
    setPrimaryEmail(trimmed);
    toast.success('Primary email updated', { description: trimmed });
  }

  function handleAddAccount() {
    const result = addConnectedAccount(newAccountEmail);
    if (!result.ok) {
      toast.error('Could not add account', { description: result.error });
      return;
    }
    setNewAccountEmail('');
    toast.success('Account connected', {
      description: 'This device stores demo data in your browser only.',
    });
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await changePassword({
      current: hasPassword ? pwCurrent : undefined,
      next: pwNew,
      confirm: pwConfirm,
    });
    if (!res.ok) {
      toast.error('Password not updated', { description: res.error });
      return;
    }
    setPwCurrent('');
    setPwNew('');
    setPwConfirm('');
    toast.success(hasPassword ? 'Password updated' : 'Password created', {
      description: 'Stored locally for this demo session.',
    });
  }

  async function handleSavePasscode() {
    if (hasPasscode && showPinChange) {
      const res = await changePasscode(pinCurrent, pinNew);
      if (!res.ok) {
        toast.error('Passcode', { description: res.error });
        return;
      }
      setPinCurrent('');
      setPinNew('');
      setPinConfirm('');
      setShowPinChange(false);
      toast.success('Passcode updated');
      return;
    }
    if (pinNew !== pinConfirm) {
      toast.error('Passcodes do not match');
      return;
    }
    const res = await setPasscode(pinNew);
    if (!res.ok) {
      toast.error('Passcode', { description: res.error });
      return;
    }
    setPinNew('');
    setPinConfirm('');
    toast.success('Passcode saved', { description: 'Screen lock is enabled on this device.' });
  }

  const passwordChangedLabel = passwordLastChanged
    ? new Date(passwordLastChanged).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Never';

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-background">
        <Header title={headerTitle} hideSearch />

        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-2xl space-y-6">
            {view === 'menu' && (
              <div className="animate-in fade-in duration-500">
                <div className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-xl">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground">Connected Email</h3>
                      <p className="truncate text-xs text-muted-foreground">{primaryEmail}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setView('emailAccounts')}
                    className="border-border bg-transparent text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                  >
                    Manage Connection
                  </Button>
                </div>

                <div className="space-y-6">
                  {settingsSections.map((section) => (
                    <div
                      key={section.title}
                      className="rounded-2xl border border-border bg-card p-5 shadow-xl"
                    >
                      <div className="mb-4 flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50">
                          <section.icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
                          <p className="text-xs text-muted-foreground">{section.description}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {section.items.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              if (section.title === 'Account') handleAccountItem(item);
                              else if (section.title === 'Appearance') handleAppearanceItem(item);
                              else
                                toast.info('Coming soon', {
                                  description: `${item} will be available in a future update.`,
                                });
                            }}
                            className="group flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[13px] text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
                          >
                            <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left sm:flex-row sm:items-center sm:gap-2">
                              <span className="flex items-center gap-2">
                                {item}
                                {item === 'Profile' && (
                                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                                    {firstName}
                                  </span>
                                )}
                              </span>
                              {section.title === 'Appearance' && item === 'Theme' && (
                                <span className="text-[11px] text-muted-foreground/80 sm:ml-auto">
                                  {getThemeMeta(themePreset).shortLabel}
                                </span>
                              )}
                              {section.title === 'Appearance' && item === 'Density' && (
                                <span className="text-[11px] text-muted-foreground/80 sm:ml-auto">
                                  {formatSettingLabel(density)}
                                </span>
                              )}
                              {section.title === 'Appearance' && item === 'Font size' && (
                                <span className="text-[11px] text-muted-foreground/80 sm:ml-auto">
                                  {formatSettingLabel(fontScale)}
                                </span>
                              )}
                            </span>
                            <ChevronRight className="h-4 w-4 shrink-0 opacity-20 transition-opacity group-hover:opacity-100" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view !== 'menu' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-400">
                <button
                  type="button"
                  onClick={() => {
                    setView('menu');
                    setShowPinChange(false);
                  }}
                  className="group mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Settings
                </button>

                {view === 'profile' && (
                  <div className="rounded-2xl border border-white/5 bg-[#0F1117] p-8 shadow-2xl">
                    <div className="mb-10 flex items-center gap-5">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-3xl font-black text-white shadow-xl shadow-blue-500/20">
                        {firstName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-white">Your Profile</h3>
                        <p className="text-sm text-gray-500">Update how you appear in the dashboard</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="ml-1 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
                          First Name
                        </label>
                        <Input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="h-14 rounded-2xl border-white/10 bg-white/5 px-5 text-base text-white transition-all placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-blue-500/50"
                          placeholder="Enter your name..."
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={() => {
                          setView('menu');
                          toast.success('Profile saved');
                        }}
                        className="h-14 w-full rounded-2xl bg-blue-600 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}

                {view === 'emailAccounts' && (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-white/5 bg-[#0F1117] p-6 shadow-xl">
                      <h3 className="text-sm font-semibold text-white">Primary email</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Used for inbox identity and notifications in this demo.
                      </p>
                      <div className="mt-4 space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                          Address
                        </Label>
                        <Input
                          type="email"
                          value={primaryDraft}
                          onChange={(e) => setPrimaryDraft(e.target.value)}
                          className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                        />
                        <Button
                          type="button"
                          onClick={handleSavePrimaryEmail}
                          className="w-full bg-blue-600 hover:bg-blue-500"
                        >
                          Save primary email
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-[#0F1117] p-6 shadow-xl">
                      <h3 className="text-sm font-semibold text-white">Additional accounts</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Connect more mailboxes (stored locally for this demo).
                      </p>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <Input
                          type="email"
                          placeholder="name@company.com"
                          value={newAccountEmail}
                          onChange={(e) => setNewAccountEmail(e.target.value)}
                          className="h-12 flex-1 rounded-xl border-white/10 bg-white/5 text-white"
                        />
                        <Button type="button" onClick={handleAddAccount} className="shrink-0 bg-blue-600 hover:bg-blue-500">
                          Add account
                        </Button>
                      </div>

                      <Separator className="my-6 bg-white/10" />

                      {connectedAccounts.length === 0 ? (
                        <p className="text-sm text-gray-500">No additional accounts yet.</p>
                      ) : (
                        <ul className="space-y-2">
                          {connectedAccounts.map((a) => (
                            <li
                              key={a.id}
                              className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
                            >
                              <span className="truncate text-sm text-gray-300">{a.email}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="shrink-0 text-gray-500 hover:text-red-400"
                                onClick={() => {
                                  removeConnectedAccount(a.id);
                                  toast.success('Account removed');
                                }}
                                aria-label={`Remove ${a.email}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                {view === 'passwordSecurity' && (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-white/5 bg-[#0F1117] p-6 shadow-xl">
                      <div className="mb-4 flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                          <KeyRound className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">Password</h3>
                          <p className="text-xs text-gray-500">
                            Last changed: <span className="text-gray-400">{passwordChangedLabel}</span>
                          </p>
                          {!hasPassword && (
                            <p className="mt-2 text-xs text-amber-500/90">
                              No password set yet — create one to lock this demo profile on this device.
                            </p>
                          )}
                        </div>
                      </div>

                      <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        {hasPassword && (
                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-wider text-gray-500">
                              Current password
                            </Label>
                            <Input
                              type="password"
                              autoComplete="current-password"
                              value={pwCurrent}
                              onChange={(e) => setPwCurrent(e.target.value)}
                              className="h-12 border-white/10 bg-white/5 text-white"
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-wider text-gray-500">
                            {hasPassword ? 'New password' : 'Password'}
                          </Label>
                          <Input
                            type="password"
                            autoComplete="new-password"
                            value={pwNew}
                            onChange={(e) => setPwNew(e.target.value)}
                            className="h-12 border-white/10 bg-white/5 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-wider text-gray-500">
                            Confirm
                          </Label>
                          <Input
                            type="password"
                            autoComplete="new-password"
                            value={pwConfirm}
                            onChange={(e) => setPwConfirm(e.target.value)}
                            className="h-12 border-white/10 bg-white/5 text-white"
                          />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500">
                          {hasPassword ? 'Update password' : 'Create password'}
                        </Button>
                      </form>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-[#0F1117] p-6 shadow-xl">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                            <Lock className="h-5 w-5 text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-white">Passcode</h3>
                            <p className="text-xs text-gray-500">
                              {hasPasscode
                                ? 'A device passcode is set. Use digits only (4–8).'
                                : 'Add a short PIN for quick screen lock in this demo.'}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={passcodeEnabled}
                          onCheckedChange={(v) => {
                            setPasscodeEnabled(v);
                            if (!v) {
                              setPinNew('');
                              setPinConfirm('');
                              setPinCurrent('');
                              setShowPinChange(false);
                              toast.message('Passcode lock disabled');
                            }
                          }}
                        />
                      </div>

                      {passcodeEnabled && (
                        <div className="mt-6 space-y-4">
                          {hasPasscode && !showPinChange && (
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full border-white/10 bg-transparent text-gray-300 hover:bg-white/5"
                              onClick={() => setShowPinChange(true)}
                            >
                              Change passcode
                            </Button>
                          )}

                          {(!hasPasscode || showPinChange) && (
                            <>
                              {hasPasscode && showPinChange && (
                                <div className="space-y-2">
                                  <Label className="text-[10px] uppercase tracking-wider text-gray-500">
                                    Current passcode
                                  </Label>
                                  <Input
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={pinCurrent}
                                    onChange={(e) => setPinCurrent(e.target.value)}
                                    className="h-12 border-white/10 bg-white/5 text-white tracking-widest"
                                    placeholder="••••"
                                  />
                                </div>
                              )}
                              <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-wider text-gray-500">
                                  {hasPasscode && showPinChange ? 'New passcode' : 'New passcode'}
                                </Label>
                                <Input
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  value={pinNew}
                                  onChange={(e) => setPinNew(e.target.value)}
                                  className="h-12 border-white/10 bg-white/5 text-white tracking-widest"
                                  placeholder="••••"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-wider text-gray-500">
                                  Confirm passcode
                                </Label>
                                <Input
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  value={pinConfirm}
                                  onChange={(e) => setPinConfirm(e.target.value)}
                                  className="h-12 border-white/10 bg-white/5 text-white tracking-widest"
                                  placeholder="••••"
                                />
                              </div>
                              <div className="flex flex-col gap-2 sm:flex-row">
                                <Button
                                  type="button"
                                  className="flex-1 bg-blue-600 hover:bg-blue-500"
                                  onClick={handleSavePasscode}
                                >
                                  {hasPasscode && showPinChange ? 'Update passcode' : 'Save passcode'}
                                </Button>
                                {hasPasscode && showPinChange && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="border-white/10"
                                    onClick={() => {
                                      setShowPinChange(false);
                                      setPinCurrent('');
                                      setPinNew('');
                                      setPinConfirm('');
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-[#0F1117] p-6 shadow-xl">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                            <Smartphone className="h-5 w-5 text-violet-400" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-white">Two-factor authentication</h3>
                            <p className="text-xs text-gray-500">
                              Demo toggle — in production this would enroll SMS or an authenticator app.
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={twoFactorEnabled}
                          onCheckedChange={(v) => {
                            setTwoFactorEnabled(v);
                            toast(v ? '2FA enabled (demo)' : '2FA disabled (demo)');
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {view === 'appearance' && <AppearanceSettingsPanel />}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
