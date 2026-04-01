'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUser } from '@/lib/user-context';
import { useEmails } from '@/hooks/useEmails';
import {
  Inbox,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Mail,
  Sparkles,
  Send,
  Star,
  Archive,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar({ defaultCollapsed = false }: { defaultCollapsed?: boolean }) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const pathname = usePathname();
  const { firstName, primaryEmail } = useUser();
  
  const { allEmails } = useEmails(); 
  // Tracks both manually archived and "Instant Cleaned" noise
  const archivedCount = allEmails.filter(e => e.isActioned).length;
  const snoozedCount = allEmails.filter(e => e.snoozedUntil && Number(e.snoozedUntil) > Date.now()).length;

  const mainNav = [
    { name: 'Inbox', href: '/dashboard', icon: Inbox },
    { name: 'Sent', href: '/sent', icon: Send },
    { name: 'Favorites', href: '/favorites', icon: Star },
    { name: 'Snoozed', href: '/snoozed', icon: Clock },
    { name: 'Archived', href: '/archived', icon: Archive },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  return (
    <aside
    className={cn(
      'hidden h-dvh shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 md:flex',
      isCollapsed ? 'md:w-16' : 'md:w-56 lg:w-60',
    )}
    >
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Mail className="h-4 w-4" />
        </div>
        {!isCollapsed && (
          <div className="flex items-center gap-1">
            <span className="text-lg font-black tracking-tight text-[#2D3436]">Quail</span>
            <Sparkles className="h-4 w-4 fill-primary text-primary" />
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3 pt-4 scrollbar-hide">
        {mainNav.map((item) => {
          const isActive = pathname === item.href;
          const displayCount = item.name === 'Archived' ? archivedCount : item.name === 'Snoozed' ? snoozedCount : 0;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl transition-all group py-3 px-4 text-[13px] font-bold tracking-tight',
                isActive
                  ? 'bg-foreground text-background shadow-md' 
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
              {!isCollapsed && (
                <div className="flex flex-1 items-center justify-between">
                  <span>{item.name}</span>
                  {(displayCount > 0 || (item.name === 'Archived' && archivedCount > 0)) && (
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-black",
                      isActive 
                        ? "bg-white/20 text-white" 
                        : item.name === 'Snoozed' 
                          ? "bg-[#F6B3C4]/20 text-[#D95D5D]" 
                          : "bg-[#7FC6DA]/20 text-[#7FC6DA]"
                    )}>
                      {displayCount}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-sidebar-border p-3 space-y-1">
      <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-xl py-3 px-4 transition-all hover:bg-sidebar-accent group',
            isCollapsed && 'justify-center'
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-black shadow-md">
            {firstName?.charAt(0).toUpperCase() || 'J'}
          </div>
          {!isCollapsed && (
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-[12px] font-black leading-tight text-foreground">
                {firstName || 'Justin'}
              </span>
              <span className="truncate text-[10px] font-bold text-muted-foreground/60">
                {primaryEmail || 'justin.chang@mail.utoronto.ca'}
              </span>
            </div>
          )}
        </Link>

        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-xl py-3 px-4 text-[13px] font-bold transition-all group',
            pathname === '/settings' ? 'bg-foreground text-background shadow-md' : 'text-muted-foreground hover:bg-sidebar-accent'
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </Link>

        <Button
          variant="ghost"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mt-2 w-full justify-center text-muted-foreground/40 hover:text-foreground"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}