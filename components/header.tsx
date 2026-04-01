'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
    <header
      className={cn(
        'flex h-16 items-center justify-between gap-3 border-b border-border bg-background px-4 transition-colors duration-300 md:px-8'
      )}
    >
      <div className="flex min-w-0 items-center">
        <h1 className="truncate text-table-header font-black uppercase tracking-[0.25em] text-foreground md:tracking-[0.4em]">
          {title}
        </h1>
      </div>

      {!hideSearch ? (
        <div className="group relative w-full max-w-[20rem] shrink-0">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Search emails..."
            value={searchValue}
            onChange={handleSearch}
            className="h-10 w-full rounded-2xl border-[#A8D0D0] bg-white/70 pl-10 text-[length:var(--font-body)] font-medium text-foreground shadow-sm transition-all placeholder:text-muted-foreground/60 focus-visible:border-[#7FC6DA] focus-visible:bg-white focus-visible:ring-0"
          />
        </div>
      ) : (
        <div className="hidden w-80 shrink-0 md:block" aria-hidden />
      )}
    </header>
  );
}