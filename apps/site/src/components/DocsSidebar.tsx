'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card } from '@kagu-project/8bit-ui';
import type { DocMeta } from '@/lib/docs';

export interface SidebarSection {
  section: string;
  docs: DocMeta[];
}

const formatLabel = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const normalizePath = (value: string): string => {
  if (value !== '/' && value.endsWith('/')) {
    return value.slice(0, -1);
  }

  return value;
};

export function DocsSidebar({ data }: { data: SidebarSection[] }) {
  const pathname = normalizePath(usePathname() ?? '/');

  return (
    <Card className="docsSidebar" title={<span className="docsPanelTitle">Documentation</span>}>
      <div className="docsPanelScroll">
        <ul className="docsSidebarList">
          <li className="docsSidebarTopLink">
            <Link
              href="/docs/"
              className={pathname === '/docs' ? 'active' : ''}
              aria-current={pathname === '/docs' ? 'page' : undefined}
            >
              Getting Started
            </Link>
          </li>

          {data.map(({ section, docs }) => (
            <li key={section} className="docsSidebarSection">
              <div className="docsSidebarSectionLabel">
                <Link
                  href={`/docs/${section}/`}
                  className={pathname === normalizePath(`/docs/${section}/`) ? 'active' : ''}
                  aria-current={
                    pathname === normalizePath(`/docs/${section}/`) ? 'page' : undefined
                  }
                >
                  {formatLabel(section)}
                </Link>
              </div>
              <ul className="docsSidebarList docsSidebarNestedList">
                {docs.map((entry) => {
                  const href = `/docs/${entry.section}/${entry.slug}/`;
                  const isActive = pathname === normalizePath(href);
                  return (
                    <li key={`${entry.section}-${entry.slug}`}>
                      <Link
                        href={href}
                        className={isActive ? 'active' : ''}
                        aria-current={isActive ? 'page' : undefined}
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
      </div>
    </Card>
  );
}
