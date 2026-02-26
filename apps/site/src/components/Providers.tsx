'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { MobileNavProvider } from './MobileNavContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MobileNavProvider>{children}</MobileNavProvider>
    </ThemeProvider>
  );
}
