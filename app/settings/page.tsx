'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/lib/user-context';
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Mail,
  Zap,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export default function SettingsPage() {
  const { firstName, setFirstName } = useUser();
  const [showProfileEdit, setShowProfileEdit] = useState(false);

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

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-[#0B0D12]">
        <Header 
          title={showProfileEdit ? "Edit Profile" : "Settings"} 
          showSearch={false} 
          showFilters={false} 
        />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-2xl space-y-6">
            
            {!showProfileEdit ? (
              <div className="animate-in fade-in duration-500">
                {/* Connected Email Box */}
                <div className="rounded-2xl border border-white/5 bg-[#0F1117] p-5 shadow-xl mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                      <Mail className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">Connected Email</h3>
                      <p className="text-xs text-gray-500">{firstName.toLowerCase()}.johnson@company.com</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/10 bg-transparent text-gray-400 hover:bg-white/5 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider">
                    Manage Connection
                  </Button>
                </div>

                {/* Main Settings Menu */}
                <div className="space-y-6">
                  {settingsSections.map((section) => (
                    <div key={section.title} className="rounded-2xl border border-white/5 bg-[#0F1117] p-5 shadow-xl">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                          <section.icon className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm">{section.title}</h3>
                          <p className="text-xs text-gray-500">{section.description}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {section.items.map((item) => (
                          <button
                            key={item}
                            onClick={() => item === 'Profile' && setShowProfileEdit(true)}
                            className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-[13px] text-gray-400 hover:bg-white/5 hover:text-white transition-all group"
                          >
                            <span className="flex items-center gap-2">
                              {item}
                              {item === 'Profile' && (
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold uppercase tracking-wider ml-2">
                                  {firstName}
                                </span>
                              )}
                            </span>
                            <ChevronRight className="h-4 w-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Profile Edit Sub-page */
              <div className="animate-in fade-in slide-in-from-right-4 duration-400">
                <button 
                  onClick={() => setShowProfileEdit(false)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors mb-8 group"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Settings
                </button>

                <div className="rounded-2xl border border-white/5 bg-[#0F1117] p-8 shadow-2xl">
                  <div className="flex items-center gap-5 mb-10">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-blue-500/20">
                      {firstName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">Your Profile</h3>
                      <p className="text-sm text-gray-500">Update how you appear in the dashboard</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 ml-1">First Name</label>
                      <Input 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-white/5 border-white/10 h-14 text-white text-base focus-visible:ring-1 focus-visible:ring-blue-500/50 rounded-2xl px-5 transition-all"
                        placeholder="Enter your name..."
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        onClick={() => setShowProfileEdit(false)}
                        className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-blue-600/20"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}