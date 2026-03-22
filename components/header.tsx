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
        'flex h-header-app min-h-[3.5rem] items-center justify-between border-b border-border bg-background px-8 transition-colors duration-300',
      )}
    >
      <div className="flex min-w-0 items-center">
        <h1 className="text-table-header font-black uppercase tracking-[0.4em] text-foreground truncate">
          {title}
        </h1>
      </div>

      {!hideSearch ? (
        <div className="group relative shrink-0">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Search emails..."
            value={searchValue}
            onChange={handleSearch}
            className="h-9 w-80 rounded-xl border-border bg-muted/30 pl-10 text-[length:var(--font-body)] font-medium text-foreground transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary/50 focus-visible:bg-muted/50 focus-visible:ring-0"
          />
        </div>
      ) : (
        <div className="w-80 shrink-0" aria-hidden />
      )}
    </header>
  );
}