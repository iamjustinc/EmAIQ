'use client';

import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Mail,
  Zap,
  ChevronRight
} from 'lucide-react';

const settingsSections = [
  {
    title: 'Account',
    description: 'Manage your account settings and preferences',
    icon: User,
    items: ['Profile', 'Email accounts', 'Password & security'],
  },
  {
    title: 'Notifications',
    description: 'Configure how you receive alerts and updates',
    icon: Bell,
    items: ['Email notifications', 'Push notifications', 'Digest frequency'],
  },
  {
    title: 'AI Settings',
    description: 'Customize AI behavior and analysis preferences',
    icon: Zap,
    items: ['Urgency thresholds', 'Auto-archive rules', 'Summary style'],
  },
  {
    title: 'Privacy',
    description: 'Control your data and privacy settings',
    icon: Shield,
    items: ['Data retention', 'Export data', 'Delete account'],
  },
  {
    title: 'Appearance',
    description: 'Customize the look and feel of EmailIQ',
    icon: Palette,
    items: ['Theme', 'Density', 'Font size'],
  },
];

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <Header title="Settings" showSearch={false} showFilters={false} />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-2xl space-y-6">
            {/* Connected Email */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Connected Email</h3>
                  <p className="text-sm text-muted-foreground">alex.johnson@company.com</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-border bg-card text-foreground hover:bg-sidebar-accent">
                Manage Connection
              </Button>
            </div>

            {/* Settings Sections */}
            {settingsSections.map((section) => (
              <div key={section.title} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-accent">
                    <section.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
                    >
                      <span>{item}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
