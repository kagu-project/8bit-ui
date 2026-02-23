import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DOC_SECTIONS, getSectionDocs, getSectionsWithDocs } from '@/lib/docs';

export async function generateStaticParams() {
  const sections = await getSectionsWithDocs();
  return sections.map((section) => ({ section }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  return {
    title: `Docs: ${section}`,
  };
}

export default async function DocsSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  if (!DOC_SECTIONS.includes(section as (typeof DOC_SECTIONS)[number])) {
    notFound();
  }

  const docs = await getSectionDocs(section as (typeof DOC_SECTIONS)[number]);
  const sectionLabel = section.charAt(0).toUpperCase() + section.slice(1);

  return (
    <>
      <article className="pixelPanel docArticle docsContent">
        <h1>{sectionLabel}</h1>
        <p className="docsMeta">
          <Link href="/docs/">Docs</Link> / {section}
        </p>

        {docs.length === 0 ? (
          <p>No pages found yet.</p>
        ) : (
          <ul className="docsList">
            {docs.map((doc) => (
              <li key={`${doc.section}-${doc.slug}`}>
                <Link href={`/docs/${doc.section}/${doc.slug}/`}>{doc.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </article>

      <div className="docsToc" />
    </>
  );
}
