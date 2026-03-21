'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#0B0D12] px-8">
      {/* Title Section restored to the left */}
      <h1 className="text-xs font-black uppercase tracking-[0.3em] text-white">
        {title}
      </h1>

      {/* Search Input on the right */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 transition-colors group-focus-within:text-blue-400" />
        <Input 
          placeholder="Search emails..." 
          className="h-9 w-80 pl-10 text-[11px] bg-white/[0.03] border-white/5 rounded-xl focus:bg-white/[0.05] focus:border-blue-500/50 focus:ring-0 transition-all placeholder:text-gray-600" 
        />
      </div>
    </header>
  );
}