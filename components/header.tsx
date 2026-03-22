'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  title: string;
  /** When omitted, search is empty and inert unless you pass handlers. */
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Hide the inbox search bar (settings, analytics, etc.). */
  hideSearch?: boolean;
}

export function Header({
  title,
  searchValue = '',
  onSearchChange,
  hideSearch = false,
}: HeaderProps) {
  const handleSearch = onSearchChange ?? (() => {});

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#0B0D12] px-8">
      {/* Title Section */}
      <div className="flex items-center min-w-0">
        <h1 className="text-xs font-black uppercase tracking-[0.3em] text-white truncate">
          {title}
        </h1>
      </div>

      {!hideSearch ? (
        <div className="relative group shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 transition-colors group-focus-within:text-blue-400" />
          <Input
            placeholder="Search emails..."
            value={searchValue}
            onChange={handleSearch}
            className="h-9 w-80 pl-10 text-[11px] bg-white/[0.03] border-white/5 rounded-xl focus:bg-white/[0.05] focus:border-blue-500/50 focus:ring-0 transition-all placeholder:text-gray-600"
          />
        </div>
      ) : (
        <div className="w-80 shrink-0" aria-hidden />
      )}
    </header>
  );
}