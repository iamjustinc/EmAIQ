'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-background text-foreground transition-colors duration-300">
  <Sidebar />
  <main className="min-w-0 flex-1 overflow-auto">{children}</main>
</div>
  );
}
