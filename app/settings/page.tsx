'use client';

import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/lib/user-context'; // Import this
import { User, Bell, Shield, Palette, Mail, Zap, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const { firstName, setFirstName } = useUser(); // Hook into context

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <Header title="Settings" showSearch={false} showFilters={false} />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-2xl space-y-6">
            {/* Profile Edit Section */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                   <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Your Profile</h3>
                  <p className="text-sm text-muted-foreground">Change how you appear in EmailIQ</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">First Name</label>
                  <Input 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-sidebar-accent border-none h-12 text-foreground focus-visible:ring-1 focus-visible:ring-primary"
                    placeholder="Enter your name..."
                  />
                </div>
              </div>
            </div>

            {/* Connected Email */}
            <div className="rounded-2xl border border-border bg-card p-5 opacity-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-accent">
                  <Mail className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Connected Email</h3>
                  <p className="text-sm text-muted-foreground">{firstName.toLowerCase()}.johnson@company.com</p>
                </div>
              </div>
            </div>
            {/* Rest of your static sections... */}
          </div>
        </div>
      </div>
    </AppShell>
  );
}