'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Drawer } from '@kagu-project/8bit-ui';
import type { SidebarSection } from './DocsSidebar';
import { MOBILE_DOCS_DRAWER_ID, useMobileNav } from './MobileNavContext';
import styles from './MobileDocsDrawer.module.css';

const normalizePath = (value: string): string => {
  if (value !== '/' && value.endsWith('/')) {
    return value.slice(0, -1);
  }
  return value;
};

const formatLabel = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

export function MobileDocsDrawer({ data }: { data: SidebarSection[] }) {
  const { isOpen, close } = useMobileNav();
  const pathname = normalizePath(usePathname() ?? '/');

  return (
    <Drawer id={MOBILE_DOCS_DRAWER_ID} isOpen={isOpen} onClose={close} placement="left" size="sm">
      <Drawer.Header title="Documentation" onClose={close} />
      <Drawer.Body>
        <nav aria-label="Docs navigation">
          <ul className={styles.navList}>
            <li className={styles.topLink}>
              <Link
                href="/docs/"
                className={pathname === '/docs' ? styles.active : ''}
                aria-current={pathname === '/docs' ? 'page' : undefined}
                onClick={close}
              >
                Getting Started
              </Link>
            </li>

            {data.map(({ section, docs }) => (
              <li key={section} className={styles.section}>
                <div className={styles.sectionLabel}>
                  <Link
                    href={`/docs/${section}/`}
                    className={pathname === normalizePath(`/docs/${section}/`) ? styles.active : ''}
                    aria-current={
                      pathname === normalizePath(`/docs/${section}/`) ? 'page' : undefined
                    }
                    onClick={close}
                  >
                    {formatLabel(section)}
                  </Link>
                </div>
                <ul className={`${styles.navList} ${styles.nestedList}`}>
                  {docs.map((entry) => {
                    const href = `/docs/${entry.section}/${entry.slug}/`;
                    const isActive = pathname === normalizePath(href);
                    return (
                      <li key={`${entry.section}-${entry.slug}`}>
                        <Link
                          href={href}
                          className={isActive ? styles.active : ''}
                          aria-current={isActive ? 'page' : undefined}
                          onClick={close}
                        >
                          {entry.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </Drawer.Body>
    </Drawer>
  );
}
