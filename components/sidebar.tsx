'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUser } from '@/lib/user-context'; // Assuming you have the UserContext
import {
  Inbox, BarChart3, Settings, ChevronLeft, ChevronRight,
  Mail, Sparkles, Send, Star, Archive, UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar({ defaultCollapsed = false }: { defaultCollapsed?: boolean }) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const pathname = usePathname();
  const { firstName } = useUser(); // Get name for profile section

  const mainNav = [
    { name: 'Inbox', href: '/', icon: Inbox },
    { name: 'Sent', href: '/sent', icon: Send },
    { name: 'Favorites', href: '/favorites', icon: Star },
    { name: 'Archived', href: '/archived', icon: Archive },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  return (
    <aside className={cn(
      'flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-60'
    )}>
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Mail className="h-4 w-4 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold text-foreground tracking-tight">EmAIQ</span>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-2 overflow-y-auto pt-4">
        {mainNav.map((item) => (
          <Link
            key={item.name} href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
              pathname === item.href ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-2 space-y-1">
        {/* Profile Section */}
        <Link href="/settings" className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-sidebar-accent/50",
          isCollapsed ? "justify-center" : ""
        )}>
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0 shadow-inner">
            {firstName.charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-foreground truncate">{firstName}</span>
              <span className="text-[10px] text-muted-foreground">Free Tier</span>
            </div>
          )}
        </Link>

        {/* Settings Below Profile */}
        <Link href="/settings" className={cn(
          'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
          pathname === '/settings' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-muted-foreground hover:bg-sidebar-accent/50'
        )}>
          <Settings className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </Link>

        <Button
          variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-center text-muted-foreground mt-2"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}