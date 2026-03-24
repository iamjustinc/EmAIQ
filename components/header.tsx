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
      className={cn('flex min-h-[3.5rem] flex-wrap items-center gap-3 border-b border-border bg-background px-4 py-3 transition-colors duration-300 md:h-header-app md:flex-nowrap md:justify-between md:px-8 md:py-0',
        
      )}
    >
      <div className="flex min-w-0 items-center"><h1 className="truncate text-table-header font-black uppercase tracking-[0.25em] text-foreground md:tracking-[0.4em]">
        
          {title}
        </h1>
      </div>

      {!hideSearch ? (
        <div className="group relative w-full shrink-0 md:w-auto">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Search emails..."
            value={searchValue}
            onChange={handleSearch}
            className="h-9 w-full rounded-xl border-border bg-muted/30 pl-10 text-[length:var(--font-body)] font-medium text-foreground transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary/50 focus-visible:bg-muted/50 focus-visible:ring-0 md:w-72 lg:w-80"
          />
        </div>
      ) : (
        <div className="hidden w-72 shrink-0 md:block lg:w-80" aria-hidden />
      )}
    </header>
  );
}