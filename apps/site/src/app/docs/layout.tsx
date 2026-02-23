import type { ReactNode } from 'react';
import { getSectionsWithDocs, getSectionDocs } from '@/lib/docs';
import { DocsSidebar } from '@/components/DocsSidebar';

export default async function DocsLayout({ children }: { children: ReactNode }) {
  const sectionsWithDocs = await getSectionsWithDocs();

  const sidebarData = await Promise.all(
    sectionsWithDocs.map(async (section) => ({
      section,
      docs: await getSectionDocs(section),
    }))
  );

  return (
    <div className="docsFrame">
      <DocsSidebar data={sidebarData} />
      {children}
    </div>
  );
}
