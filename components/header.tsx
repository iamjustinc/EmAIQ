'use client';

import { Search, Command } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';

interface HeaderProps {
  title: string;
  showSearch?: boolean;
  onReply?: () => void;
  onArchive?: () => void;
  onSnooze?: () => void;
}

export function Header({ title, showSearch = true, onReply, onArchive, onSnooze }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-white/5 bg-[#0F1117]/80 backdrop-blur-md px-6">
      <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-white">{title}</h1>
      
      <div className="flex items-center gap-6">
        <div className="hidden items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 lg:flex">
          <button onClick={onReply} className="flex items-center gap-1.5 hover:text-blue-400 transition-colors group">
            <Kbd className="bg-white/5 border-white/10 group-hover:border-blue-500/50">R</Kbd>
            <span>Reply</span>
          </button>
          <button onClick={onArchive} className="flex items-center gap-1.5 hover:text-red-400 transition-colors group">
            <Kbd className="bg-white/5 border-white/10 group-hover:border-red-500/50">E</Kbd>
            <span>Archive</span>
          </button>
          <button onClick={onSnooze} className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors group">
            <Kbd className="bg-white/5 border-white/10 group-hover:border-yellow-500/50">S</Kbd>
            <span>Snooze</span>
          </button>
          <div className="flex items-center gap-1.5 opacity-50">
            <Kbd className="bg-white/5 border-white/10"><Command className="h-3 w-3" /></Kbd>
            <Kbd className="bg-white/5 border-white/10">K</Kbd>
            <span>Search</span>
          </div>
        </div>

        <div className="h-4 w-px bg-white/10" />
        
        {showSearch && (
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
            <Input
              placeholder="Search emails..."
              className="h-9 w-64 pl-9 text-xs bg-white/5 border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500/50"
            />
          </div>
        )}
      </div>
    </header>
  );
}
