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
        'flex h-screen flex-col border-r border-white/5 bg-[#0B0D12] transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/5 px-4 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-500/20">
          <Mail className="h-4 w-4 text-white" />
        </div>
        {!isCollapsed && (
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-white tracking-tight">EmAIQ</span>
            <Sparkles className="h-4 w-4 text-blue-400 fill-blue-400" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto pt-4 scrollbar-hide">
        {mainNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all group',
                isActive
                  ? 'bg-blue-600/10 text-blue-400'
                  : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile & Settings Section */}
      <div className="mt-auto border-t border-white/5 p-2 space-y-1">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all hover:bg-white/5 group',
            isCollapsed ? 'justify-center' : ''
          )}
        >
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-lg">
            {firstName?.charAt(0).toUpperCase() || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-white font-semibold truncate leading-tight">{firstName}</span>
              <span className="text-[10px] text-gray-600 truncate leading-tight">View Profile</span>
            </div>
          )}
        </Link>

        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all group',
            pathname === '/settings' ? 'bg-white/5 text-white' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-center text-gray-600 hover:bg-white/5 hover:text-white mt-2"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}