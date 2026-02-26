'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export const MOBILE_DOCS_DRAWER_ID = 'mobile-docs-drawer';

interface MobileNavContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const MobileNavContext = createContext<MobileNavContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export function MobileNavProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <MobileNavContext.Provider value={{ isOpen, open, close }}>
      {children}
    </MobileNavContext.Provider>
  );
}

export function useMobileNav(): MobileNavContextValue {
  return useContext(MobileNavContext);
}
