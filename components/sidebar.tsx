'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUser } from '@/lib/user-context';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar({ defaultCollapsed = false }: { defaultCollapsed?: boolean }) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const pathname = usePathname();
  const { firstName } = useUser();

  const mainNav = [
    { name: 'Inbox', href: '/', icon: Inbox },
    { name: 'Sent', href: '/sent', icon: Send },
    { name: 'Favorites', href: '/favorites', icon: Star },
    { name: 'Archived', href: '/archived', icon: Archive },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-60',
      )}
    >
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Mail className="h-4 w-4" />
        </div>
        {!isCollapsed && (
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold tracking-tight">EmAIQ</span>
            <Sparkles className="h-4 w-4 fill-primary text-primary" />
          </div>
        )}
      </div>

      <nav className="scrollbar-hide flex flex-1 flex-col gap-app overflow-y-auto p-2 pt-4">
        {mainNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl font-medium transition-all group',
                'py-[var(--sidebar-item-py)] px-[var(--sidebar-item-px)] text-[length:var(--font-body)]',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 border-t border-sidebar-border p-2">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-xl py-3 font-medium transition-all hover:bg-sidebar-accent group',
            isCollapsed ? 'justify-center' : '',
            'px-[var(--sidebar-item-px)]',
          )}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-[10px] font-black text-primary-foreground shadow-lg">
            {firstName?.charAt(0).toUpperCase() || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-semibold leading-tight text-sidebar-foreground">
                {firstName}
              </span>
              <span className="truncate text-[10px] leading-tight text-muted-foreground">View Profile</span>
            </div>
          )}
        </Link>

        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-xl py-2 font-medium transition-all group',
            'px-[var(--sidebar-item-px)]',
            pathname === '/settings'
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mt-2 w-full justify-center text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
