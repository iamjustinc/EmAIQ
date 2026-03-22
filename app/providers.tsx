'use client';

import { UserProvider } from '@/lib/user-context';
import { AppearanceProvider } from '@/lib/appearance-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <AppearanceProvider>{children}</AppearanceProvider>
    </UserProvider>
  );
}
