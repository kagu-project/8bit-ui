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
      <span aria-hidden="true">☰</span>
    </IconButton>
  );
}
