import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';
import GithubSlugger from 'github-slugger';

export const DOC_SECTIONS = ['components', 'guides'] as const;

export type DocSection = (typeof DOC_SECTIONS)[number];

export interface DocMeta {
  section: DocSection;
  slug: string;
  title: string;
}

export interface DocHeading {
  depth: 2 | 3 | 4;
  id: string;
  text: string;
}

export interface DocContent extends DocMeta {
  source: string;
  headings: DocHeading[];
}

const resolveDocsRoot = (): string => {
  const cwd = process.cwd();
  const candidates = [
    path.resolve(cwd, 'docs'),
    path.resolve(cwd, '..', 'docs'),
    path.resolve(cwd, '..', '..', 'docs'),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[0];
};

const DOCS_ROOT = resolveDocsRoot();

const isDocSection = (value: string): value is DocSection =>
  DOC_SECTIONS.includes(value as DocSection);

const getSectionDirectory = (section: DocSection): string => path.join(DOCS_ROOT, section);

const normalizeMdxLinks = (source: string, section: DocSection): string =>
  source.replace(/\]\(\.\/([a-z0-9-]+)\.mdx\)/gi, '](/docs/' + section + '/$1/)');

const stripInlineMarkdown = (value: string): string =>
  value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .trim();

const humanizeIdentifier = (value: string): string => {
  const trimmed = value.trim();
  if (trimmed.includes(' ') || trimmed.includes('-') || trimmed.includes('_') || trimmed.includes('/')) {
    return trimmed;
  }

  if (!/[a-z]/.test(trimmed) || !/[A-Z]/.test(trimmed)) {
    return trimmed;
  }

  return trimmed
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2');
};

const humanizeTopHeading = (source: string): string =>
  source.replace(/^#\s+(.+)$/m, (fullMatch, headingText: string) => {
    const plain = stripInlineMarkdown(headingText);
    const humanized = humanizeIdentifier(plain);
    if (humanized === plain) {
      return fullMatch;
    }
    return `# ${humanized}`;
  });

const extractTitle = (source: string, fallback: string): string => {
  const headingMatch = source.match(/^#\s+(.+)$/m);
  if (!headingMatch) {
    return humanizeIdentifier(fallback);
  }

  return humanizeIdentifier(stripInlineMarkdown(headingMatch[1]));
};

const extractHeadings = (source: string): DocHeading[] => {
  const lines = source.split('\n');
  const slugger = new GithubSlugger();
  const headings: DocHeading[] = [];

  for (const line of lines) {
    const match = line.match(/^(#{1,4})\s+(.+)$/);
    if (!match) {
      continue;
    }

    const depth = match[1].length;
    const text = stripInlineMarkdown(match[2]);
    const id = slugger.slug(text);

    if (depth >= 2 && depth <= 4) {
      headings.push({
        depth: depth as 2 | 3 | 4,
        id,
        text,
      });
    }
  }

  return headings;
};

const readDirIfExists = async (directory: string): Promise<string[]> => {
  try {
    return await fs.readdir(directory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

export const getSectionDocs = async (section: DocSection): Promise<DocMeta[]> => {
  const directory = getSectionDirectory(section);
  const entries = await readDirIfExists(directory);

  const mdxFiles = entries.filter((entry) => entry.endsWith('.mdx'));

  const docs = await Promise.all(
    mdxFiles.map(async (fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const filePath = path.join(directory, fileName);
      const source = await fs.readFile(filePath, 'utf8');

      return {
        section,
        slug,
        title: extractTitle(source, slug),
      } satisfies DocMeta;
    }),
  );

  return docs.sort((a, b) => a.slug.localeCompare(b.slug));
};

export const getAllDocs = async (): Promise<DocMeta[]> => {
  const bySection = await Promise.all(DOC_SECTIONS.map((section) => getSectionDocs(section)));
  return bySection.flat();
};

export const getDoc = async (section: string, slug: string): Promise<DocContent | null> => {
  if (!isDocSection(section)) {
    return null;
  }

  const filePath = path.join(getSectionDirectory(section), `${slug}.mdx`);

  try {
    const rawSource = await fs.readFile(filePath, 'utf8');
    const source = normalizeMdxLinks(humanizeTopHeading(rawSource), section);

    return {
      section,
      slug,
      title: extractTitle(source, slug),
      source,
      headings: extractHeadings(source),
    } satisfies DocContent;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
};

export const getAllDocParams = async (): Promise<Array<{ section: DocSection; slug: string }>> => {
  const allDocs = await getAllDocs();
  return allDocs.map(({ section, slug }) => ({ section, slug }));
};

export const getSectionsWithDocs = async (): Promise<DocSection[]> => {
  const results = await Promise.all(
    DOC_SECTIONS.map(async (section) => ({ section, docs: await getSectionDocs(section) })),
  );

  return results.filter((result) => result.docs.length > 0).map((result) => result.section);
};
