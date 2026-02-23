import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Header, Toolbar } from '8bit-ui';
import { MobileHeaderMenu } from '@/components/MobileHeaderMenu';
import { Providers } from '@/components/Providers';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { siteConfig } from '@/lib/site-config';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '8bit-ui',
    template: '%s | 8bit-ui',
  },
  description: '8bit-ui marketing and documentation site scaffold.',
  icons: {
    icon: '/favicon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="siteShell">
            <Header variant="primary" elevation={1} className="siteHeader">
              <Toolbar className="siteToolbar">
                <Link href="/" className="brand">
                  {siteConfig.brand}
                </Link>

                <nav className="nav desktopNav" aria-label="Primary">
                  <Link href="/docs/">Docs</Link>
                  <a href={siteConfig.repoUrl} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                  <ThemeSwitcher />
                </nav>

                <div className="mobileHeaderMenu">
                  <MobileHeaderMenu repoUrl={siteConfig.repoUrl} />
                </div>
              </Toolbar>
            </Header>

            <main className="main">{children}</main>

            <footer className="footer">
              <div className="footerInner">Built with Next.js static export + MDX docs content.</div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
