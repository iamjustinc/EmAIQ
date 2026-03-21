'use client';

import { Search, Command } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';

interface HeaderProps {
  title: string;
  showSearch?: boolean;
}

export function Header({ title, showSearch = true }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      
      <div className="flex items-center gap-4">
        {/* Quick Actions */}
        <div className="hidden items-center gap-3 text-xs text-muted-foreground lg:flex">
          <div className="flex items-center gap-1.5">
            <Kbd className="bg-sidebar-accent/60">R</Kbd>
            <span>Reply</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Kbd className="bg-sidebar-accent/60">E</Kbd>
            <span>Archive</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Kbd className="bg-sidebar-accent/60">S</Kbd>
            <span>Snooze</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Kbd className="bg-sidebar-accent/60"><Command className="h-3 w-3" /></Kbd>
            <Kbd className="bg-sidebar-accent/60">K</Kbd>
            <span>Search</span>
          </div>
        </div>

        <div className="h-4 w-px bg-border" />
        
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search emails..."
              className="h-8 w-56 pl-8 text-sm bg-sidebar-accent/30 border-border/50 text-foreground placeholder:text-muted-foreground focus:bg-sidebar-accent/50"
            />
          </div>
        )}
      </div>
    </header>
  );
}
