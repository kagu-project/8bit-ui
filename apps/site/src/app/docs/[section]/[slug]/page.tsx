import Link from 'next/link';
import { compileMDX } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { components } from '@/components/mdx-components';
import { Card, Text } from '@kagu-project/8bit-ui';
import { getAllDocParams, getDoc } from '@/lib/docs';

export async function generateStaticParams() {
  return getAllDocParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    section: string;
    slug: string;
  }>;
}) {
  const { section, slug } = await params;
  const doc = await getDoc(section, slug);

  if (!doc) {
    return {
      title: 'Doc Not Found',
    };
  }

  return {
    title: doc.title,
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{
    section: string;
    slug: string;
  }>;
}) {
  const { section, slug } = await params;
  const doc = await getDoc(section, slug);
  if (!doc) {
    notFound();
  }

  const { content } = await compileMDX({
    source: doc.source,
    components,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight, rehypeSlug],
      },
      parseFrontmatter: false,
      blockJS: false,
    },
  });

  return (
    <>
      <article className="pixelPanel docArticle docsContent">
        <p className="docsMeta">
          <Link href="/docs/">Docs</Link> /{' '}
          <Link href={`/docs/${doc.section}/`}>{doc.section}</Link>
        </p>
        {content}
      </article>

      <Card className="docsToc" title={<span className="docsPanelTitle">On This Page</span>}>
        <div className="docsPanelScroll">
          {doc.headings.length === 0 ? (
            <Text size="sm">No section headings found.</Text>
          ) : (
            <ul className="docsTocList">
              {doc.headings.map((heading) => (
                <li key={heading.id} className={`depth${heading.depth}`}>
                  <a href={`#${heading.id}`}>{heading.text}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </>
  );
}
