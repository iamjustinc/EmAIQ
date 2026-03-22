'use client';

import React from 'react';
import { useEmails } from '@/hooks/useEmails';
import { AppShell } from '@/components/app-shell';
import { Header } from '@/components/header';
import { EmailList } from '@/components/email-list';
import { Star } from 'lucide-react';

export default function FavoritesPage() {
  const { allEmails, toggleFavorite, loading } = useEmails();
  
  // persistent filter: shows everything that is starred
  const favoriteEmails = allEmails.filter(e => e.isFavorite);

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-[#0B0D12]">
        <Header title="Favorites" showSearch={false} />
        
        <main className="flex-1 overflow-hidden flex flex-col p-8 w-full">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Starred Items</h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">Persistent Collection</p>
            </div>
          </div>

          <div className="flex-1 overflow-hidden bg-[#0F1117] border border-white/5 rounded-[32px] flex flex-col shadow-2xl">
            {!loading && favoriteEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                  <Star className="h-8 w-8 text-gray-700" />
                </div>
                <p className="text-gray-500 text-sm font-medium">Your favorites list is empty</p>
              </div>
            ) : (
              <EmailList 
                emails={favoriteEmails} 
                onSelectEmail={() => {}} // Can be wired to a detail sheet later
                onToggleFavorite={toggleFavorite}
                activeTab="all"
                setActiveTab={() => {}}
              />
            )}
          </div>
        </main>
      </div>
    </AppShell>
  );
}