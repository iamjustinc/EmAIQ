'use client';

import { Search, Command } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';

interface HeaderProps {
  title: string;
  onReply?: () => void;
  onArchive?: () => void;
  onSnooze?: () => void;
}

export function Header({ title, onReply, onArchive, onSnooze }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-white/5 bg-[#0F1117]/80 backdrop-blur-md px-6">
      <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-white">{title}</h1>
      
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
          <button onClick={onReply} className="flex items-center gap-2 hover:text-white transition-colors">
            <Kbd className="bg-white/5 border-white/10">R</Kbd><span>Reply</span>
          </button>
          <button onClick={onArchive} className="flex items-center gap-2 hover:text-white transition-colors">
            <Kbd className="bg-white/5 border-white/10">E</Kbd><span>Archive</span>
          </button>
          <button onClick={onSnooze} className="flex items-center gap-2 hover:text-white transition-colors">
            <Kbd className="bg-white/5 border-white/10">S</Kbd><span>Snooze</span>
          </button>
          <div className="flex items-center gap-2 opacity-40">
            <Kbd className="bg-white/5 border-white/10">⌘</Kbd><Kbd className="bg-white/5 border-white/10">K</Kbd><span>Search</span>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
          <Input placeholder="Search emails..." className="h-9 w-64 pl-9 text-xs bg-white/5 border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500/50" />
        </div>
      </div>
    </header>
  );
}
