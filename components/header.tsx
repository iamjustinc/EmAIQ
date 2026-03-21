'use client';

import { Search } from 'lucide-react';
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
    <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#0B0D12] px-8">
      {/* Title Section */}
      <h1 className="text-xs font-black uppercase tracking-[0.3em] text-white">
        {title}
      </h1>
      
      <div className="flex items-center gap-10">
        {/* Shortcut Legend */}
        <div className="flex items-center gap-6 text-[9px] font-bold uppercase tracking-widest text-gray-500">
          <button onClick={onReply} className="flex items-center gap-2 hover:text-white transition-colors group">
            <Kbd className="bg-white/5 border-white/10 group-hover:border-white/20">R</Kbd>
            <span>Reply</span>
          </button>
          <button onClick={onArchive} className="flex items-center gap-2 hover:text-white transition-colors group">
            <Kbd className="bg-white/5 border-white/10 group-hover:border-white/20">E</Kbd>
            <span>Archive</span>
          </button>
          <button onClick={onSnooze} className="flex items-center gap-2 hover:text-white transition-colors group">
            <Kbd className="bg-white/5 border-white/10 group-hover:border-white/20">S</Kbd>
            <span>Snooze</span>
          </button>
          <div className="h-4 w-[1px] bg-white/10 mx-2" /> {/* Divider */}
          <div className="flex items-center gap-2 opacity-60">
            <Kbd className="bg-white/5 border-white/10">⌘</Kbd>
            <Kbd className="bg-white/5 border-white/10">K</Kbd>
            <span>Search</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 transition-colors group-focus-within:text-blue-400" />
          <Input 
            placeholder="Search emails..." 
            className="h-9 w-72 pl-10 text-[11px] bg-white/[0.03] border-white/5 rounded-xl focus:bg-white/[0.05] focus:border-blue-500/50 focus:ring-0 transition-all placeholder:text-gray-600" 
          />
        </div>
      </div>
    </header>
  );
}
