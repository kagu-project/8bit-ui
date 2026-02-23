import Link from 'next/link';
import { Card, Heading, Text, Button } from '@kagu-project/8bit-ui';
import hljs from 'highlight.js';

export const metadata = {
  title: 'Docs - Getting Started',
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const highlightCode = (code: string, language: string): string => {
  try {
    if (hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value;
    }
    return hljs.highlightAuto(code).value;
  } catch {
    return escapeHtml(code);
  }
};

function CodeBlock({ code, language }: { code: string; language: string }) {
  const highlighted = highlightCode(code, language);
  return (
    <pre style={{ margin: 0 }}>
      <code
        className={`hljs language-${language}`}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </pre>
  );
}

export default function DocsIndexPage() {
  return (
    <article className="pixelPanel docArticle docsContent">
      <section>
        <Heading level={1} className="docsReadableHeading">
          Getting Started
        </Heading>
        <Text size="lg" className="homeBodyText" style={{ marginTop: '12px' }}>
          8bit-ui provides polished React components that feel nostalgic, read clearly, and look launch-ready on modern screens.
          Use this guide to install the library and start building your retro UI in minutes.
        </Text>
      </section>

      <section style={{ marginTop: '32px' }}>
        <Heading
          level={2}
          id="installation"
          className="docsReadableHeading"
          style={{ marginBottom: '16px' }}
        >
          Installation
        </Heading>
        <Text className="homeBodyText" style={{ marginBottom: '12px' }}>
          Install the package via your preferred package manager:
        </Text>
        <div className="homeMiniCode">
          <CodeBlock code="npm install @kagu-project/8bit-ui" language="bash" />
        </div>
        <div className="homeMiniCode" style={{ marginTop: '8px' }}>
          <CodeBlock code="pnpm add @kagu-project/8bit-ui" language="bash" />
        </div>
        <div className="homeMiniCode" style={{ marginTop: '8px', marginBottom: '24px' }}>
          <CodeBlock code="yarn add @kagu-project/8bit-ui" language="bash" />
        </div>

        <Text className="homeBodyText" style={{ marginBottom: '12px' }}>
          Next, import the global CSS styles at the root of your application (e.g., in your Next.js <code>layout.tsx</code> or React <code>App.tsx</code>):
        </Text>
        <div className="homeMiniCode">
          <CodeBlock code="import '@kagu-project/8bit-ui/style.css';" language="typescript" />
        </div>
      </section>

      <section style={{ marginTop: '48px' }}>
        <Heading level={2} id="usage" className="docsReadableHeading" style={{ marginBottom: '16px' }}>
          Basic Usage
        </Heading>
        <Text className="homeBodyText" style={{ marginBottom: '20px' }}>
          Once the CSS is imported, you can start using components immediately. No complex wrapping providers are required!
        </Text>

        <Card title="Example">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Heading level={3} className="docsReadableHeading">
              Quest Complete
            </Heading>
            <Text>You have successfully imported the 8bit-ui library into your project.</Text>
            <div>
              <Button color="primary">Claim Reward</Button>
            </div>
          </div>
        </Card>

        <div className="homeMiniCode" style={{ marginTop: '16px', overflowX: 'auto' }}>
          <CodeBlock
            language="tsx"
            code={`import { Card, Heading, Text, Button } from '@kagu-project/8bit-ui';

export default function MyComponent() {
  return (
    <Card title="Example">
      <Heading level={3}>Quest Complete</Heading>
      <Text>You have successfully imported the 8bit-ui library into your project.</Text>
      <Button color="primary">Claim Reward</Button>
    </Card>
  );
}`}
          />
        </div>
      </section>

      <section style={{ marginTop: '48px' }}>
        <Heading level={2} id="theming" className="docsReadableHeading" style={{ marginBottom: '16px' }}>
          Theming
        </Heading>
        <Text className="homeBodyText" style={{ marginBottom: '12px' }}>
          8bit-ui supports switching between <strong>Light Mode</strong> and <strong>Dark Mode</strong> out-of-the-box using the <code>data-theme</code> attribute.
        </Text>
        <Text className="homeBodyText">
          We highly recommend pairing 8bit-ui with <a href="https://github.com/pacocoursey/next-themes" target="_blank" rel="noreferrer" style={{ color: 'var(--8bit-primary)' }}>next-themes</a> to automatically handle system preferences and theme toggling for your users.
        </Text>
      </section>

      <section style={{ marginTop: '48px', marginBottom: '64px' }}>
        <Heading
          level={2}
          id="next-steps"
          className="docsReadableHeading"
          style={{ marginBottom: '16px' }}
        >
          Next Steps
        </Heading>
        <Text className="homeBodyText" style={{ marginBottom: '16px' }}>
          Browse components from the left sidebar, or jump directly to the full components index.
        </Text>
        <Link href="/docs/components/" style={{ textDecoration: 'none' }}>
          <Button color="primary">View Components</Button>
        </Link>
      </section>
    </article>
  );
}
