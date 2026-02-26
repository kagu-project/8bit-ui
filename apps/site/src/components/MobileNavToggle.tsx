'use client';

import { usePathname } from 'next/navigation';
import { IconButton } from '@kagu-project/8bit-ui';
import { MOBILE_DOCS_DRAWER_ID, useMobileNav } from './MobileNavContext';

export function MobileNavToggle() {
  const pathname = usePathname() ?? '/';
  const { isOpen, open, close } = useMobileNav();

  if (pathname !== '/docs' && !pathname.startsWith('/docs/')) {
    return null;
  }

  return (
    <IconButton
      aria-label={isOpen ? 'Close docs navigation' : 'Open docs navigation'}
      aria-expanded={isOpen}
      aria-controls={MOBILE_DOCS_DRAWER_ID}
      variant="ghost"
      size="sm"
      className="mobileNavToggle"
      onClick={isOpen ? close : open}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 4h18v4H3zm0 6h18v4H3zm0 6h18v4H3z" />
      </svg>
    </IconButton>
  );
}
