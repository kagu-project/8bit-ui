'use client';

import { usePathname } from 'next/navigation';
import { IconButton } from '@kagu-project/8bit-ui';
import { useMobileNav } from './MobileNavContext';

export function MobileNavToggle() {
  const pathname = usePathname() ?? '/';
  const { open } = useMobileNav();

  if (pathname !== '/docs' && !pathname.startsWith('/docs/')) {
    return null;
  }

  return (
    <IconButton
      aria-label="Open docs navigation"
      variant="ghost"
      size="sm"
      className="mobileNavToggle"
      onClick={open}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 4h18v4H3zm0 6h18v4H3zm0 6h18v4H3z" />
      </svg>
    </IconButton>
  );
}
